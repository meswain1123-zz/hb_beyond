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
  SpellSlotType
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
  table: SpellSlotType;
  spell_slot_types: SpellSlotType[] | null;
  loading: boolean;
}

class SpellSlotTypeDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      spell_slot_types: null,
      table: new SpellSlotType(),
      loading: false,
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  // Loads the editing SpellSlotType into state
  load_table(id: string) {
    if (this.state.spell_slot_types) {
      const obj_finder = this.state.spell_slot_types.filter(a => a._id === id);
      if (obj_finder.length === 1) {
        this.setState({ table: obj_finder[0] });
      }
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("spell_slot_type").then((res: any) => {
        if (res && !res.error) {
          this.setState({ spell_slot_types: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.spell_slot_types === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      let { id } = this.props.match.params;
      if (id !== undefined && this.state.table._id !== id) {
        this.load_table(id);
        return (<span>Loading...</span>);
      } else {
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <Tooltip title={`Back to Spell Slot Tables`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/spell_slot_tables` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
              &nbsp;
              <Tooltip title={`Delete ${this.state.table.name}`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.api.deleteObject("spell_slot_type", this.state.table).then((res: any) => {
                      this.setState({ redirectTo:`/beyond/spell_slot_tables` });
                    });
                  }}>
                  <DeleteForever/>
                </Fab>
              </Tooltip> 
            </Grid>
            <Grid item>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                { this.state.table.name }
              </span>
              <Tooltip title={`Edit ${this.state.table.name}`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/spell_slot_tables/edit/${this.state.table._id}` });
                  }}>
                  <Edit/>
                </Fab>
              </Tooltip> 
            </Grid>
          </Grid>
        ); 
      }
    }
  }
}

export default connector(SpellSlotTypeDetails);
