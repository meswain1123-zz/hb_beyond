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
  WeaponKeyword, 
} from "../../models";

import CheckBox from "../../components/input/CheckBox";

import ModelBaseInput from "../../components/model_inputs/ModelBaseInput";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
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
  obj: WeaponKeyword;
  processing: boolean;
  weapon_keywords: WeaponKeyword[] | null;
  loading: boolean;
}

class WeaponKeywordEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new WeaponKeyword(),
      processing: false,
      weapon_keywords: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject("weapon_keyword", this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/weapon_keyword" });
      });
    });
  }

  // Loads the editing obj into state
  load_object(id: string) {
    const objFinder = this.state.weapon_keywords ? this.state.weapon_keywords.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone(), loading: false });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("weapon_keyword").then((res: any) => {
        if (res && !res.error) {
          let { id } = this.props.match.params;
          if (id !== undefined && this.state.obj._id !== id) {
            this.setState({ weapon_keywords: res }, () => {
              this.load_object(id);
            });
          } else {
            this.setState({ weapon_keywords: res, loading: false });
          }
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.weapon_keywords === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      const formHeight = this.props.height - (this.props.width > 600 ? 220 : 220);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Tooltip title={`Back to Weapon Keywords`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.setState({ redirectTo:`/beyond/weapon_keyword` });
                }}>
                <ArrowBack/>
              </Fab>
            </Tooltip> 
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.state.obj._id === "" ? "Create WeaponKeyword" : `Edit ${this.state.obj.name}` }
            </span>
          </Grid>
          <Grid item 
            style={{ 
              height: `${formHeight}px`, 
              overflowY: "scroll", 
              overflowX: "hidden" 
            }}>
            <Grid container spacing={1} direction="column">
              <ModelBaseInput 
                obj={this.state.obj}
                onChange={() => {
                  const obj = this.state.obj;
                  this.setState({ obj });
                }}
              />
              <Grid item>
                <CheckBox 
                  name="Display in Equipment"
                  value={this.state.obj.display_in_equipment} 
                  onChange={(value: boolean) => {
                    const obj = this.state.obj;
                    obj.display_in_equipment = value;
                    this.setState({ obj });
                  }} 
                />
              </Grid>
              <Grid item>
                <CheckBox 
                  name="Two Weapon Fighting"
                  value={this.state.obj.can_two_weapon_fight} 
                  onChange={(value: boolean) => {
                    const obj = this.state.obj;
                    obj.can_two_weapon_fight = value;
                    this.setState({ obj });
                  }} 
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={this.state.processing}
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
                this.setState({ redirectTo:`/beyond/weapon_keyword` });
              }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      ); 
    }
  }
}

export default connector(WeaponKeywordEdit);
