import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  Edit, ArrowBack, DeleteForever
} from "@material-ui/icons";
import {
  Grid, 
  Tooltip, Fab,
} from "@material-ui/core";

import { 
  Spell
} from "../../models";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  spells: Spell[] | null;
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
  objects: state.app.spells,
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
  obj: Spell;
  spells: Spell[] | null;
  loading: boolean;
}

class SpellDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Spell(),
      spells: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  // Loads the editing Spell into state
  load_object(id: string) {
    const spellFinder = this.state.spells ? this.state.spells.filter(a => a._id === id) : [];
    if (spellFinder.length === 1) {
      this.setState({ obj: spellFinder[0].clone() });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("spell").then((res: any) => {
        if (res && !res.error) {
          this.setState({ spells: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.spells === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      let { id } = this.props.match.params;
      if (id !== undefined && this.state.obj._id !== id) {
        this.load_object(id);
        return (<span>Loading...</span>);
      } else {
        const formHeight = this.props.height - (this.props.width > 600 ? 150 : 150);
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <Tooltip title={`Back to Spells`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/spell` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
              &nbsp;
              <Tooltip title={`Delete ${this.state.obj.name}`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.api.deleteObject(this.state.obj).then((res: any) => {
                      if (this.props.objects) {
                        this.setState({ redirectTo:`/beyond/spell` });
                      }
                    });
                  }}>
                  <DeleteForever/>
                </Fab>
              </Tooltip> 
            </Grid>
            <Grid item>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                { this.state.obj.name }
              </span>
              <Tooltip title={`Edit ${this.state.obj.name}`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/spell/edit/${this.state.obj._id}` });
                  }}>
                  <Edit/>
                </Fab>
              </Tooltip> 
            </Grid>
            <Grid item 
              style={{ 
                height: `${formHeight}px`, 
                overflowY: "scroll", 
                overflowX: "hidden" 
              }}>
              <Grid container spacing={1} direction="row">
                <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                  Description
                </Grid>
                <Grid item xs={9}>
                  {this.state.obj.description} 
                </Grid>
                <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                  Saving Throw
                </Grid>
                <Grid item xs={9}>
                  {this.state.obj.saving_throw_ability_score}
                </Grid>
                {/* <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                  Potence Formula
                </Grid>
                <Grid item xs={9}>
                  {this.state.obj.potence_formula}
                </Grid>
                <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                  Damage Type
                </Grid>
                <Grid item xs={9}>
                  {this.state.obj.damage_type}
                </Grid>
                <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                  Potence Formula 2
                </Grid>
                <Grid item xs={9}>
                  {this.state.obj.potence_formula_2}
                </Grid>
                <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                  Damage Type 2
                </Grid>
                <Grid item xs={9}>
                  {this.state.obj.damage_type_2}
                </Grid> */}
                <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                  Range
                </Grid>
                <Grid item xs={9}>
                  {this.state.obj.range}
                </Grid>
                <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                  Range 2
                </Grid>
                <Grid item xs={9}>
                  {this.state.obj.range_2}
                </Grid>
                <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                  Concentration
                </Grid>
                <Grid item xs={9}>
                  {this.state.obj.concentration} 
                </Grid>
                <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                  Notes
                </Grid>
                <Grid item xs={9}>
                  {this.state.obj.notes} 
                </Grid>
                <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                  Duration
                </Grid>
                <Grid item xs={9}>
                  {this.state.obj.duration}
                </Grid>
                <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                  Components
                </Grid>
                <Grid item xs={9}>
                  {this.state.obj.components}
                </Grid>
                { this.state.obj.components.includes("M") &&
                  <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                    Material Component
                  </Grid>
                }
                { this.state.obj.components.includes("M") &&
                  <Grid item xs={9}>
                    {this.state.obj.material_component}
                  </Grid>
                }
                <Grid item xs={3} className={"MuiTypography-root MuiListItemText-primary header"}>
                  Casting Time
                </Grid>
                <Grid item xs={9}>
                  {this.state.obj.casting_time}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ); 
      }
    }
  }
}

export default connector(SpellDetails);
