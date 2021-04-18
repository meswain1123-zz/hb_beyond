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
  Sense, 
  // Sense
} from "../../models";
import StringBox from "../../components/input/StringBox";
// import SelectBox from "../../components/input/SelectBox";
// import SelectStringBox from "../../components/input/SelectStringBox";
// // import CheckBox from "../../components/input/CheckBox";
// import { 
//   ABILITY_SCORES, 
//   // DAMAGE_TYPES, 
//   // DURATIONS,
//   // COMPONENTS,
//   // CASTING_TIMES,
//   // RESOURCES
// } from "../../models/Constants";
import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  // senses: Sense[] | null;
  // senses: Sense[] | null;
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
  // senses: state.app.senses,
  // sensesMB: state.app.senses as ModelBase[],
  // senses: state.app.senses,
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
  // setSenses: (objects: Sense[]) => ({ type: 'SET', dataType: 'senses', payload: objects }),
  // addSense: (object: Sense) => ({ type: 'ADD', dataType: 'senses', payload: object })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & { }

export interface State { 
  redirectTo: string | null;
  obj: Sense;
  processing: boolean;
  // senses: Sense[] | null;
  senses: Sense[] | null;
  loading: boolean;
}

class SenseEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Sense(),
      processing: false,
      // senses: null,
      senses: null,
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
        this.setState({ processing: false, redirectTo: "/beyond/sense" });
      });
    });
  }

  // Loads the editing Sense into state
  load_object(id: string) {
    const objFinder = this.state.senses ? this.state.senses.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone() });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("sense").then((res: any) => {
        if (res && !res.error) {
          this.setState({ senses: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.senses === null) {
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
              <Tooltip title={`Back to Senses`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/sense` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
            </Grid>
            <Grid item>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                { this.state.obj._id === "" ? "Create Sense" : `Edit ${this.state.obj.name}` }
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
                  this.setState({ redirectTo:`/beyond/sense` });
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

export default connector(SenseEdit);
