import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import {
//   Copyright,

// } from "@material-ui/icons";
import {
  Grid, 
} from "@material-ui/core";

import { 
  CharacterSpell,
  CharacterAbility,
  Spell,
  SpellAsAbility,
  Ability,
  ItemAffectingAbility
} from "../../models";


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
  spell: CharacterSpell | Spell | SpellAsAbility | Ability | ItemAffectingAbility | CharacterAbility;
  show_level: boolean;
  show_ritual: boolean;
  fontSize: number;
  fontWeight: "-moz-initial" | "inherit" | "initial" | "revert" | "unset" | "normal" | (number & {}) | "bold" | "bolder" | "lighter" | undefined;
}

export interface State {
}

class ViewSpell extends Component<Props, State> {
  public static defaultProps = {
    show_level: false,
    fontSize: 11,
    fontWeight: undefined // "inherit"
  };
  componentDidMount() {
  }

  render() {
    const spell = this.props.spell;
    let detail = "";
    let concentration = false;
    let ritual = false;
    let level = 0;
    if (spell instanceof Spell) {
      concentration = spell.concentration;
      ritual = spell.ritual;
      if (spell.level) {
        level = spell.level;
      }
    } else if (spell instanceof CharacterSpell) {
      detail = spell.source_name;
      if (spell.spell) {
        if (spell.spell instanceof SpellAsAbility && spell.spell.spell) {
          if (spell.name !== spell.spell.spell.name) {
            if (detail !== "") {
              detail += " - ";
            }
            detail += spell.spell.spell.name;
          }
        } else if (spell.name !== spell.spell.name) {
          if (detail !== "") {
            detail += " - ";
          }
          detail += spell.spell.name;
        }
        concentration = spell.spell.concentration;
        ritual = spell.ritual;
        if (spell.spell.level) {
          level = spell.spell.level;
        }
      }
    } else if (spell instanceof CharacterAbility) {
      detail = spell.source_name;
      const the_ability = spell.the_ability;
      if (the_ability instanceof Ability) {
        concentration = the_ability.concentration;
      } else if (the_ability instanceof SpellAsAbility) {
        concentration = the_ability.concentration;
      }
    } else if (spell instanceof SpellAsAbility) {
      if (spell.spell) {
        if (spell.name !== spell.spell.name) {
          if (detail !== "") {
            detail += " - ";
          }
          detail += spell.spell.name;
        }
        concentration = spell.spell.concentration;
        // ritual = spell.spell.ritual;
        if (spell.spell.level) {
          level = spell.spell.level;
        }
      }
    }
    return [
      <Grid item key={0} style={{ 
        fontSize: `${this.props.fontSize}px`, 
        fontWeight: this.props.fontWeight 
      }}>
        { spell.name } 
        &nbsp;
        { concentration && <span style={{ backgroundColor: "black", color: "white", fontSize: "7px" }}>&nbsp;C&nbsp;</span> }
        &nbsp;
        { this.props.show_ritual && ritual && <span style={{ backgroundColor: "black", color: "white", fontSize: "7px" }}>&nbsp;R&nbsp;</span> }
        &nbsp;
        { this.props.show_level && <span>({ this.get_level_string(level) })</span> }
      </Grid>,
      <Grid item key={1} style={{ 
        lineHeight: "1.1",
        fontSize: "10px",
        color: "gray"
      }}>
        { detail }
      </Grid>
    ];
  }

  get_level_string(level: number) {
    if (level === 0) {
      return "Cantrip";
    } else if (level === 1) {
      return "1st";
    } else if (level === 2) {
      return "2nd";
    } else if (level === 3) {
      return "3rd";
    } else {
      return `${level}th`;
    }
  }
}

export default connector(ViewSpell);
