import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  ArrowBack
} from "@material-ui/icons";
import {
  Grid, 
  Button, 
  Tooltip, Fab,
} from "@material-ui/core";
import {
  Campaign, 
  SourceBook,
  Race,
  GameClass,
  Lineage,
  User
} from "../../models";

import StringBox from "../../components/input/StringBox";
import ToggleButtonBox from "../../components/input/ToggleButtonBox";
import CenteredMenu from "../../components/input/CenteredMenu";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  loginUser: User | null;
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

interface MatchParams {
  id: string;
}

const mapState = (state: RootState) => ({
  loginUser: state.app.loginUser,
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & { }

export interface State { 
  redirectTo: string | null;
  obj: Campaign;
  processing: boolean;
  mode: string;
  source_books: SourceBook[];
  races: Race[];
  game_classes: GameClass[];
  lineages: Lineage[];
  loading: boolean;
  logging_in: boolean;
}

class CampaignEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Campaign(),
      processing: false,
      mode: "Home",
      source_books: [],
      races: [],
      game_classes: [],
      lineages: [],
      loading: false,
      logging_in: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    if (this.props.loginUser === null) {
      const userObjStr = localStorage.getItem("loginUser");
      if (!userObjStr) {
        this.setState({ redirectTo: "/beyond" });
      } else {
        this.setState({ logging_in: true }, this.check_login);
      }
    } else {
      this.load();
    }
  }

  check_login() {
    setTimeout(() => {
      if (this.props.loginUser === null) {
        this.check_login();
      } else {
        this.setState({ logging_in: false }, this.load);
      }
    }, 1000);
  }

  submit() {
    this.setState({ processing: true }, () => {
      const obj = this.state.obj;
      if (obj._id && obj._id !== "") {
        this.api.updateObject("campaign", obj).then((res: any) => {
          this.setState({ processing: false, redirectTo: "/beyond/campaign" });
        });
      } else {
        obj.owner_id = this.props.loginUser ? this.props.loginUser._id : "No Login";
        this.api.createObject("campaign", obj).then((res: any) => {
          this.setState({ processing: false, redirectTo: "/beyond/campaign" });
        });
      }
    });
  }

  // Loads the editing Campaign into state
  load_object(id: string) {
    this.api.getFullObject("campaign", id).then((res: any) => {
      if (res) {
        const obj = res;
        this.setState({ obj, loading: false });
      }
    });
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["source_book","race","game_class","lineage"]).then((res: any) => {
        let { id } = this.props.match.params;
        if (id !== undefined && this.state.obj._id !== id) {
          this.setState({ 
            source_books: res.source_book,
            races: res.race,
            game_classes: res.game_class,
            lineages: res.lineage
          }, () => {
            this.load_object(id);
          }); 
        } else {
          this.setState({ 
            source_books: res.source_book,
            races: res.race,
            game_classes: res.game_class,
            lineages: res.lineage, 
            loading: false 
          });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      const formHeight = this.props.height - (this.props.width > 600 ? 228 : 228);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <Tooltip title={`Back to Campaigns`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/campaign` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
            </Grid>
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.state.obj._id === "" ? "Create Campaign" : `Edit ${this.state.obj.name}` }
            </span>
          </Grid>
          <Grid item>
            { this.state.obj.source_books.includes("60d9e2ff909a1d2014235f15") ? 
              <CenteredMenu
                options={["Home","Allowed Sources","Allowed Races","Allowed Classes","Allowed Lineages"]}
                selected={this.state.mode}
                onSelect={(mode: string) => {
                  this.setState({ mode });
                }}
              />
            : 
              <CenteredMenu
                options={["Home","Allowed Sources","Allowed Races","Allowed Classes"]}
                selected={this.state.mode}
                onSelect={(mode: string) => {
                  this.setState({ mode });
                }}
              />
          }
          </Grid>
          <Grid item 
            style={{ 
              height: `${formHeight}px`, 
              overflowY: "scroll", 
              overflowX: "hidden" 
            }}>
              { this.render_tab() }
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={ this.state.processing || this.state.obj.name === "" }
              onClick={ () => { 
                this.submit();
              }}>
              Submit
            </Button>
            <Button
              variant="contained"
              disabled={this.state.processing}
              style={{ marginLeft: "4px" }}
              onClick={ () => { 
                this.setState({ redirectTo:`/beyond/campaign` });
              }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      ); 
    }
  }

  render_tab() {
    let return_me = <Grid item>Coming Soon</Grid>;
    if (this.state.mode === "Allowed Sources") {
      return_me = (
        <Grid container spacing={1} direction="row">
          <Grid item xs={4}>
            <ToggleButtonBox 
              name="Custom Origins"
              value={this.state.obj.custom_origins} 
              onToggle={() => {
                const obj = this.state.obj;
                obj.custom_origins = !obj.custom_origins;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <ToggleButtonBox 
              name="Optional Features"
              value={this.state.obj.optional_features} 
              onToggle={() => {
                const obj = this.state.obj;
                obj.optional_features = !obj.optional_features;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <ToggleButtonBox 
              name="Homebrew Content"
              value={this.state.obj.allow_homebrew} 
              onToggle={() => {
                const obj = this.state.obj;
                obj.allow_homebrew = !obj.allow_homebrew;
                this.setState({ obj });
              }}
            />
          </Grid>
          { this.state.source_books.map((book, key) => {
            return (
              <Grid item xs={4} key={key}>
                <ToggleButtonBox 
                  name={`${book.abbreviation} Content`}
                  value={this.state.obj.source_books.includes(book._id)} 
                  onToggle={() => {
                    const obj = this.state.obj;
                    if (this.state.obj.source_books.includes(book._id)) {
                      obj.source_books = obj.source_books.filter(o => o !== book._id);
                    } else {
                      obj.source_books.push(book._id);
                    }
                    this.setState({ obj });
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ); 
    } else if (this.state.mode === "Allowed Races") {
      return_me = (
        <Grid container spacing={1} direction="row">
          { this.state.races.map((race, key) => {
            return (
              <Grid item xs={4} key={key}>
                <ToggleButtonBox 
                  name={race.name}
                  value={!this.state.obj.blocked_races.includes(race._id)} 
                  onToggle={() => {
                    const obj = this.state.obj;
                    if (this.state.obj.blocked_races.includes(race._id)) {
                      obj.blocked_races = obj.blocked_races.filter(o => o !== race._id);
                    } else {
                      obj.blocked_races.push(race._id);
                    }
                    this.setState({ obj });
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ); 
    } else if (this.state.mode === "Allowed Classes") {
      return_me = (
        <Grid container spacing={1} direction="row">
          { this.state.game_classes.map((game_class, key) => {
            return (
              <Grid item xs={4} key={key}>
                <ToggleButtonBox 
                  name={game_class.name}
                  value={!this.state.obj.blocked_classes.includes(game_class._id)} 
                  onToggle={() => {
                    const obj = this.state.obj;
                    if (this.state.obj.blocked_classes.includes(game_class._id)) {
                      obj.blocked_classes = obj.blocked_classes.filter(o => o !== game_class._id);
                    } else {
                      obj.blocked_classes.push(game_class._id);
                    }
                    this.setState({ obj });
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ); 
    } else if (this.state.mode === "Allowed Lineages") {
      return_me = (
        <Grid container spacing={1} direction="row">
          <Grid item xs={12}>
            <ToggleButtonBox 
              name="Allow Players to Control Their Lineages"
              value={this.state.obj.player_control_for_lineages} 
              onToggle={() => {
                const obj = this.state.obj;
                obj.player_control_for_lineages = !obj.player_control_for_lineages;
                this.setState({ obj });
              }}
            />
          </Grid>
          { this.state.lineages.map((lineage, key) => {
            return (
              <Grid item xs={4} key={key}>
                <ToggleButtonBox 
                  name={lineage.name}
                  value={!this.state.obj.blocked_lineages.includes(lineage._id)} 
                  onToggle={() => {
                    const obj = this.state.obj;
                    if (this.state.obj.blocked_lineages.includes(lineage._id)) {
                      obj.blocked_lineages = obj.blocked_lineages.filter(o => o !== lineage._id);
                    } else {
                      obj.blocked_lineages.push(lineage._id);
                    }
                    this.setState({ obj });
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ); 
    } else {
      return_me = (
        <Grid container spacing={1} direction="row">
          <Grid item xs={12}>
            <StringBox 
              value={this.state.obj.name} 
              message={this.state.obj.name.length > 0 ? "" : "Name Invalid"} 
              name="Name"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.name = value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <StringBox 
              value={this.state.obj.description} 
              name="Description"
              multiline
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.description = value;
                this.setState({ obj });
              }}
            />
          </Grid>
        </Grid>
      ); 
    }
    return return_me;
  }
}

export default connector(CampaignEdit);
