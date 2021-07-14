import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
  Popover,
} from "@material-ui/core";

import { 
  CreatureInstance,
  CreatureAbility,
  RollPlus
} from "../../../models";

import ButtonBox from "../../input/ButtonBox";

import Roller from "../Roller";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";
import CharacterUtilities from "../../../utilities/character_utilities";
import { CharacterUtilitiesClass } from "../../../utilities/character_utilities_class";


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
  obj: CreatureInstance;
  action: CreatureAbility;
  onChange: () => void; // For slots, resources, and concentration
}

export interface State {
  popoverAnchorEl: HTMLDivElement | null;
  popoverMode: string;
}

class CreatureAction extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      popoverAnchorEl: null,
      popoverMode: ""
    };
    this.api = API.getInstance();
    this.char_util = CharacterUtilities.getInstance();
  }

  api: APIClass;
  char_util: CharacterUtilitiesClass;

  componentDidMount() {
  }

  render() {
    const action = this.props.action;
    return (
      <Grid item container spacing={1} direction="row">
        <Grid item xs={4}>{ action.name }</Grid>
        <Grid item xs={4}>
          { action.attack_bonus > 0 ?
            <ButtonBox
              name={ `+${action.attack_bonus}` }
              onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                this.setState({ popoverMode: "Attack" });
                this.setPopoverAnchorEl(event.currentTarget);
              }} 
            />
          : action.saving_throw_ability_score !== "" &&
            <span>
              { `${action.saving_throw_ability_score} ${action.dc}` }
            </span> 
          }
        </Grid>
        <Grid item xs={4}>
          { !["Control","Utility","Summon","Transform","Create Resource"].includes(action.effect.type) && action.effect.potences.length === 1 ?
            <ButtonBox
              fontSize={9}
              name={ action.effect.potences[0].rolls.as_string }
              image={ action.effect.type }
              onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                this.setState({ popoverMode: "Damage" })
                this.setPopoverAnchorEl(event.currentTarget);
              }} 
            />
          :
            <span>
              { action.effect.type }
            </span> 
          }
        </Grid>
        { this.renderExtras() }
      </Grid>
    );
  }

  renderExtras() {
    return [
      <Popover key="rolls"
        open={ this.state.popoverAnchorEl !== null && this.state.popoverMode !== "" }
        anchorEl={this.state.popoverAnchorEl}
        onClose={() => {
          this.setState({ popoverAnchorEl: null, popoverMode: "" });
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        { this.renderRoll() }
      </Popover>
    ];
  }

  renderRoll() {
    const mode = this.state.popoverMode;
    if (mode === "Attack") {
      const rolls = new RollPlus();
      rolls.type = "Attack";
      rolls.flat = +this.props.action.attack_bonus;
      return (
        <Roller 
          name={this.props.action.name}
          // char={this.props.obj}
          rolls={[rolls]} 
          type="Attack" 
        />
      );
    } else if (mode === "Damage" && this.props.action.effect.potences.length > 0) {
      if (["Healing","Temp HP","Max HP"].includes(this.props.action.effect.type)) {
        return (
          <Roller 
            name={this.props.action.name}
            // char={this.props.obj}
            rolls={[this.props.action.effect.potences[0].rolls]} 
            type={this.props.action.effect.type} 
          />
        );
      } else {
        return (
          <Roller 
            name={this.props.action.name}
            // char={this.props.obj}
            rolls={[this.props.action.effect.potences[0].rolls]} 
            type="Damage" 
          />
        );
      }
    }
    return null;
  }

  setPopoverAnchorEl(el: HTMLDivElement | null) {
    this.setState({ popoverAnchorEl: el });
  }
}

export default connector(CreatureAction);
