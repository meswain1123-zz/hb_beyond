import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  // Add, Edit,
  ArrowBack
} from "@material-ui/icons";
import {
  Grid, 
  // List, ListItem, 
  Button, 
  Tooltip, Fab,
  // FormControl, InputLabel,
  // OutlinedInput, FormHelperText
} from "@material-ui/core";
// import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
// import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { 
  // ModelBase, 
  Skill, 
  // Skill
} from "../../models";
import StringBox from "../../components/input/StringBox";
// import SelectBox from "../../components/input/SelectBox";
import SelectStringBox from "../../components/input/SelectStringBox";
// import CheckBox from "../../components/input/CheckBox";
import { 
  ABILITY_SCORES, 
  // DAMAGE_TYPES, 
  // DURATIONS,
  // COMPONENTS,
  // CASTING_TIMES,
  // RESOURCES
} from "../../models/Constants";
import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  // skills: Skill[] | null;
  // skills: Skill[] | null;
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
  // skills: state.app.skills,
  // skillsMB: state.app.skills as ModelBase[],
  // skills: state.app.skills,
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
  // setSkills: (objects: Skill[]) => ({ type: 'SET', dataType: 'skills', payload: objects }),
  // addSkill: (object: Skill) => ({ type: 'ADD', dataType: 'skills', payload: object })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & { }

export interface State { 
  redirectTo: string | null;
  obj: Skill;
  processing: boolean;
  // skills: Skill[] | null;
  skills: Skill[] | null;
  loading: boolean;
}

class SkillEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Skill(),
      processing: false,
      // skills: null,
      skills: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject(this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/skill" });
      });
    });
  }

  // Loads the editing Skill into state
  load_object(id: string) {
    const objFinder = this.state.skills ? this.state.skills.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone() });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("skill").then((res: any) => {
        if (res && !res.error) {
          this.setState({ skills: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.skills === null) {
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
        const formHeight = this.props.height - (this.props.width > 600 ? 198 : 198);
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <Tooltip title={`Back to Skills`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/skill` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
            </Grid>
            <Grid item>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                { this.state.obj._id === "" ? "Create Skill" : `Edit ${this.state.obj.name}` }
              </span>
            </Grid>
            <Grid item 
              style={{ 
                height: `${formHeight}px`, 
                overflowY: "scroll", 
                overflowX: "hidden" 
              }}>
              <Grid container spacing={1} direction="column">
                <Grid item>
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
                <Grid item>
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
                <Grid item>
                  <SelectStringBox 
                    value={this.state.obj.use_ability_score} 
                    options={ABILITY_SCORES}
                    name="Use Ability Score"
                    onChange={(value: string) => {
                      const obj = this.state.obj;
                      obj.use_ability_score = value;
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
                // color="primary"
                disabled={this.state.processing}
                style={{ marginLeft: "4px" }}
                onClick={ () => { 
                  this.setState({ redirectTo:`/beyond/skill` });
                }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        ); 
      }
    }
  }
}

export default connector(SkillEdit);
