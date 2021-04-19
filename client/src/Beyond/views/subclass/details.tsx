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
  Subclass
} from "../../models";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  subclasses: Subclass[] | null;
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
  objects: state.app.subclasses,
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
  setSubclasses: (objects: Subclass[]) => ({ type: 'SET', dataType: 'subclasses', payload: objects }),
  // addSubclass: (obj: Subclass) => ({ type: 'ADD', dataType: 'subclasses', payload: obj })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & { }

export interface State { 
  redirectTo: string | null;
  obj: Subclass;
}

class SubclassDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Subclass()
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  // Loads the editing Subclass into state
  load(id: string) {
    const objFinder = this.props.objects ? this.props.objects.filter(o => o._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone() });
    }
  }

  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      let { id } = this.props.match.params;
      if (id !== undefined && this.state.obj._id !== id) {
        this.load(id);
        return (<span>Loading...</span>);
      } else {
        const formHeight = this.props.height - (this.props.width > 600 ? 150 : 150);
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <Tooltip title={`Back to Subclasses`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/subclass` });
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
                        this.props.setSubclasses(this.props.objects.filter(o => o._id !== this.state.obj._id));
                        this.setState({ redirectTo:`/beyond/subclass` });
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
                    this.setState({ redirectTo:`/beyond/class/edit/${this.state.obj._id}` });
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
              </Grid>
            </Grid>
          </Grid>
        ); 
      }
    }
  }
}

export default connector(SubclassDetails);
