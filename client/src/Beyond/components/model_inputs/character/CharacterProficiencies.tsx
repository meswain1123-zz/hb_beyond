import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
  Drawer,
} from "@material-ui/core";

import { 
  Character,
  // Creature
} from "../../../models";

import DisplayObjects from '../display/DisplayObjects';

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  obj: Character;
  onChange: () => void;
}

export interface State {
  loading: boolean;
  reloading: boolean;
  drawer: string;
}

class CharacterProficiencies extends Component<Props, State> {
  // public static defaultProps = {
  //   value: null,
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      reloading: false,
      drawer: "",
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  render() {
    return (
      <Grid item container spacing={0} direction="column" 
        style={{
          border: "1px solid blue",
          borderRadius: "5px",
          fontSize: "11px"
        }}>
        <Grid item
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: "bold"
          }}>
          <div onClick={() => {
            this.setState({ drawer: "manage" });
          }}>
            Proficiencies &amp; Languages
          </div>
        </Grid>
        <Grid item style={{ 
          fontWeight: "bold",
          fontSize: "15px" 
        }}>
          Armor
        </Grid>
        <Grid item>
          <DisplayObjects type="armor_type" ids={this.props.obj.armor_proficiencies} />
        </Grid>
        <Grid item style={{ 
          fontWeight: "bold",
          fontSize: "15px",
          borderTop: "1px solid lightgray" 
        }}>
          Weapons
        </Grid>
        <Grid item>
          <DisplayObjects type="weapon_keyword" ids={this.props.obj.weapon_proficiencies} />
        </Grid>
        <Grid item>
          <DisplayObjects type="base_item" ids={this.props.obj.special_weapon_proficiencies} />
        </Grid>
        <Grid item style={{ 
          fontWeight: "bold",
          fontSize: "15px",
          borderTop: "1px solid lightgray" 
        }}>
          Tools
        </Grid>
        <Grid item>
          <DisplayObjects type="tool" ids={Object.keys(this.props.obj.tool_proficiencies)} />
        </Grid>
        <Grid item style={{ 
          fontWeight: "bold",
          fontSize: "15px",
          borderTop: "1px solid lightgray" 
        }}>
          Languages
        </Grid>
        <Grid item>
          <DisplayObjects type="language" ids={this.props.obj.languages_known} />
        </Grid>
        <Drawer anchor="right" 
          open={ this.state.drawer === "manage" } 
          onClose={() => {
            this.setState({ drawer: "" });
          }}>
        </Drawer>
      </Grid>
    );
  }
}

export default connector(CharacterProficiencies);
