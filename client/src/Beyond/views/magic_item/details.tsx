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
  MagicItem
} from "../../models";

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
  obj: MagicItem;
  magic_items: MagicItem[] | null;
  loading: boolean;
}

class MagicItemDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new MagicItem(),
      magic_items: null,
      loading: false,
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  // Loads the editing MagicItem into state
  load_object(id: string) {
    const objFinder = this.state.magic_items ? this.state.magic_items.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone() });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("magic_item").then((res: any) => {
        if (res && !res.error) {
          this.setState({ magic_items: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.magic_items === null) {
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
              <Tooltip title={`Back to Magic Items`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/magic_item` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
              &nbsp;
              <Tooltip title={`Delete ${this.state.obj.name}`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.api.deleteObject("magic_item", this.state.obj).then((res: any) => {
                      this.setState({ redirectTo:`/beyond/magic_item` });
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
                    this.setState({ redirectTo:`/beyond/magic_item/edit/${this.state.obj._id}` });
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

export default connector(MagicItemDetails);
