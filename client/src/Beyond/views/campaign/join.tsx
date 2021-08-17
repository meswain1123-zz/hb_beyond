import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";

import {
  Grid, 
  Snackbar,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { 
  Campaign, 
  SourceBook,
  User, 
  Character,
  Race, 
  GameClass, 
  Lineage
} from "../../models";

import ObjectDetails from "../../components/model_inputs/ObjectDetails";
import CheckBox from "../../components/input/CheckBox";
import CenteredMenu from "../../components/input/CenteredMenu";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";
import ButtonBox from '../../components/input/ButtonBox';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


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
  invite: string;
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
  mode: string;
  source_books: SourceBook[];
  races: Race[];
  game_classes: GameClass[];
  lineages: Lineage[];
  players: User[];
  characters: Character[];
  loading: boolean;
  logging_in: boolean;
  processing: boolean;
  message: string;
}

class CampaignJoin extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Campaign(),
      mode: "Characters",
      source_books: [],
      races: [],
      game_classes: [],
      players: [],
      characters: [],
      lineages: [],
      loading: false,
      logging_in: false,
      processing: false,
      message: ""
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    if (this.props.loginUser === null) {
      const userObjStr = localStorage.getItem("loginUser");
      if (!userObjStr) {
        this.load();
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

  // Loads the editing Campaign into state
  load_object(id: string) {
    this.api.getFullObject("campaign", id).then((res: any) => {
      if (res) {
        const obj = res as Campaign;
        let { invite } = this.props.match.params;
        if (invite !== undefined && (obj.reusable_invite === invite || obj.invites.includes(invite))) {
          this.load_players(obj);
        } else {
          this.setState({ loading: false });
        }
      }
    });
  }

  load_players(obj: Campaign) {
    if (obj.player_ids.length > 0) {
      const filter: any = {};
      
      filter.ids = obj.player_ids;
      this.api.getObjects("user", filter).then((res: any) => {
        if (res && !res.error) {
          this.setState({ players: res, obj }, this.load_characters);
        }
      });
    } else {
      this.setState({ obj }, this.load_characters);
    }
  }

  load_characters() {
    const filter: any = {};
    
    filter.campaign_id = this.state.obj._id;
    this.api.getObjects("character", filter).then((res: any) => {
      if (res && !res.error) {
        this.setState({ characters: res, loading: false });
      }
    });
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["source_book","race","game_class","lineage"]).then((res: any) => {
        let { id, invite } = this.props.match.params;
        if (id !== undefined && invite !== undefined && this.state.obj._id !== id) {
          this.setState({ 
            source_books: res.source_book,
            races: res.race,
            game_classes: res.game_class,
            lineages: res.lineage
          }, () => {
            this.load_object(id);
          }); 
        } else {
          this.setState({ loading: false });
        }
      });
    });
  }

  handleClose() {
    this.setState({ message: "" });
  }

  render() {
    console.log(this.props.loginUser);
    console.log(this.state.obj);
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.state.obj === null) {
      return <span>Something is wrong with the link you clicked</span>;
    } else if (this.props.loginUser && this.state.obj.player_ids.includes(this.props.loginUser._id)) {
      return <span>You're already in this campaign.</span>;
    } else if (this.props.loginUser && this.state.obj.owner_id === this.props.loginUser._id) {
      return <span>You own this campaign.</span>;
    } else { 
      const formHeight = this.props.height - (this.props.width > 600 ? 228 : 228);
      let tabs = ["Characters","Sources","Races","Classes"];
      if (this.state.obj.source_books.includes("60d9e2ff909a1d2014235f15")) {
        tabs.push("Lineages");
      }
      if (this.props.loginUser && this.state.obj.owner_id === this.props.loginUser._id) {
        tabs.push("Players");
      }
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            You've been invited to join a campaign.  
          </Grid>
          { this.props.loginUser ? 
            <Grid item>
              <ButtonBox 
                name="Accept Invitation"
                onClick={() => {
                  if (this.props.loginUser) {
                    const obj = this.state.obj;
                    let { invite } = this.props.match.params;
                    if (obj.invites.includes(invite)) {
                      obj.invites = obj.invites.filter(o => o !== invite);
                    }
                    obj.player_ids.push(this.props.loginUser._id);
                    this.api.updateObject("campaign", obj).then((res: any) => {
                      this.setState({ redirectTo: `/beyond/campaign/details/${obj._id}` });
                    });
                  }
                }}
              />
            </Grid>
            :
            <Grid item>
              You need to log in first to be able to join.
            </Grid>
          }
          <Grid item>
            <ObjectDetails 
              obj={this.state.obj}
              data_type="campaign"
              type_label="Campaigns"
            />
          </Grid>
          <Grid item>
            <CenteredMenu
              options={tabs}
              selected={this.state.mode}
              onSelect={(mode: string) => {
                this.setState({ mode });
              }}
            />
          </Grid>
          <Grid item 
            style={{ 
              height: `${formHeight}px`, 
              overflowY: "scroll", 
              overflowX: "hidden" 
            }}>
              { this.render_tab() }
          </Grid>
        </Grid>
      );
    }
  }

  render_tab() {
    let return_me = <Grid item>Coming Soon</Grid>;
    if (this.state.mode === "Players") {
      return_me = (
        <Grid container spacing={1} direction="row">
          <Grid item xs={6}>
            <ButtonBox name="Reusable Invitation Link" 
              onClick={() => {
                navigator.clipboard.writeText(`${this.state.obj.reusable_invite}`);
                this.setState({ message: "Link Copied to Clipboard" });
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <ButtonBox name="Generate Single Use Invitation Link" 
              disabled={this.state.processing}
              onClick={() => {
                const obj = this.state.obj;
                const invite = obj.generate_invite();
                navigator.clipboard.writeText(`${invite}`);
                this.setState({ processing: true }, () => {
                  this.api.updateObject("campaign", obj).then((res: any) => {
                    this.setState({ 
                      obj, 
                      processing: false, 
                      message: "Link Copied to Clipboard" 
                    });
                  });
                });
              }}
            />
          </Grid>
          <Snackbar 
            open={ this.state.message !== "" } 
            autoHideDuration={6000} 
            onClose={() => { this.handleClose(); }}>
            <Alert onClose={() => { this.handleClose(); }} severity="success">
              { this.state.message }
            </Alert>
          </Snackbar>
          { this.state.players.map((player, key) => {
            return (
              <Grid item xs={4} key={key}>
                { player.username } 
                Remove Player (only visible for DM)
                Leave Campaign (only visible for that player)
              </Grid>
            );
          })}
        </Grid>
      ); 
    } else if (this.state.mode === "Characters") {
      return_me = (
        <Grid container spacing={1} direction="row">
          <Grid item>
            Create Character
          </Grid>
          <Grid item>
            Add Existing Character
          </Grid>
          <Grid item>
            Create Unassigned Character
          </Grid>
          { this.state.characters.map((char, key) => {
            return (
              <Grid item xs={4} key={key}>
                { char.name }
                View
                Edit (only visible for DM or that player)
                Leave Campaign (only visible for that player)
                Unassign (only visible for that player)
                Claim (only visible for unassigned character)
              </Grid>
            );
          })}
        </Grid>
      ); 
    } else if (this.state.mode === "Sources") {
      return_me = (
        <Grid container spacing={1} direction="row">
          <Grid item xs={4}>
            <CheckBox 
              name="Custom Origins"
              value={this.state.obj.custom_origins} 
              disabled
              onChange={(value: boolean) => {
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <CheckBox 
              name="Optional Features"
              value={this.state.obj.optional_features}  
              disabled
              onChange={(value: boolean) => {
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <CheckBox 
              name="Homebrew Content"
              value={this.state.obj.allow_homebrew}  
              disabled
              onChange={(value: boolean) => {
              }}
            />
          </Grid>
          { this.state.source_books.map((book, key) => {
            return (
              <Grid item xs={4} key={key}>
                <CheckBox 
                  name={`${book.abbreviation} Content`}
                  value={this.state.obj.source_books.includes(book._id)}   
                  disabled
                  onChange={(value: boolean) => {
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ); 
    } else if (this.state.mode === "Races") {
      return_me = (
        <Grid container spacing={1} direction="row">
          { this.state.races.map((race, key) => {
            return (
              <Grid item xs={4} key={key}>
                <CheckBox 
                  name={race.name}
                  value={!this.state.obj.blocked_races.includes(race._id)}   
                  disabled
                  onChange={(value: boolean) => {
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ); 
    } else if (this.state.mode === "Classes") {
      return_me = (
        <Grid container spacing={1} direction="row">
          { this.state.game_classes.map((game_class, key) => {
            return (
              <Grid item xs={4} key={key}>
                <CheckBox 
                  name={game_class.name}
                  value={!this.state.obj.blocked_classes.includes(game_class._id)}   
                  disabled
                  onChange={(value: boolean) => {
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ); 
    } else if (this.state.mode === "Lineages") {
      return_me = (
        <Grid container spacing={1} direction="row">
          <Grid item xs={12}>
            <CheckBox 
              name="Allow Players to Control Their Lineages"
              value={this.state.obj.player_control_for_lineages}   
              disabled
              onChange={(value: boolean) => {
              }}
            />
          </Grid>
          { this.state.lineages.map((lineage, key) => {
            return (
              <Grid item xs={4} key={key}>
                <CheckBox 
                  name={lineage.name}
                  value={!this.state.obj.blocked_lineages.includes(lineage._id)}   
                  disabled
                  onChange={(value: boolean) => {
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ); 
    }
    return return_me;
  }
}

export default connector(CampaignJoin);
