import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
} from "@material-ui/core";
import { 
  CritFail, 
  CritSuccess, 
  D20,
  D4, D6, D8, 
  D10,
  D12
} from "../../models/Images";

import { 
  Character,
  CreatureInstance,
  RollPlus
} from "../../models";

import DamageTypeImage from "./display/DamageTypeImage";

import DataUtilities from "../../utilities/data_utilities";
import { DataUtilitiesClass } from "../../utilities/data_utilities_class";


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
  rolls: RollPlus[];
  char: Character | CreatureInstance | null; // I may make this optional in the future.
  name: string;
  type: string;
}

export interface State {
}

class Roller extends Component<Props, State> {
  public static defaultProps = {
    char: null
  };
  constructor(props: Props) {
    super(props);
    this.state = {
    };
    this.data_util = DataUtilities.getInstance();
  }

  data_util: DataUtilitiesClass;

  componentDidMount() {
  }

  render() {
    if (this.props.type === "Attack") { 
      return this.renderAttack(this.props.rolls, this.props.name);
    } else if (["Skill Check","Ability Check","Saving Throw"].includes(this.props.type)) {
      return this.renderCheck(this.props.rolls, this.props.name);
    } else if (this.props.type === "Damage") {
      return this.renderDamage(this.props.rolls, this.props.name);
    } else if (["Healing","Temp HP","Max HP"].includes(this.props.type)) {
      return this.renderHealing(this.props.rolls, this.props.name);
    } 
    return null;
  }

  renderAttack(rolls: RollPlus[], name: string) {
    let grand_total = 0;

    const roll_renders: any[] = [];
    let bonus = 0;
    rolls.forEach(roll_plus => {
      if (roll_plus.flat !== 0) {
        grand_total += roll_plus.flat;
        bonus += roll_plus.flat;
      }
      if (this.props.char && roll_plus.ability_score !== "") {
        const mod = this.props.char.current_ability_scores.getModifier(roll_plus.ability_score);
        if (mod) {
          grand_total += mod;
          bonus += mod;
        }
      }
      if (roll_plus.size === 1) {
        grand_total += roll_plus.count;
        bonus += roll_plus.count;
      } else if (roll_plus.count !== 0) {
        const roll_render = this.renderRollPlus(roll_plus, true);
        roll_renders.push(roll_render.render);
        grand_total += roll_render.total;
      }
    });

    const d20_rolls: number[] = [];
    let roll_used = 0;
    d20_rolls.push(Math.ceil(Math.random() * 20));
    if (this.props.char && this.props.char instanceof Character && this.props.char.advantage === true) {
      d20_rolls.push(Math.ceil(Math.random() * 20));
      // TODO: Check for Elven Accuracy Feat
      roll_used = Math.max(...d20_rolls);
    } else if (this.props.char && this.props.char instanceof Character && this.props.char.advantage === false) { 
      d20_rolls.push(Math.ceil(Math.random() * 20));
      roll_used = Math.min(...d20_rolls);
    } else {
      roll_used = d20_rolls[0];
    }
    grand_total += roll_used;
    let used = false;
    const d20_renders = d20_rolls.map((roll, key) => {
      let bonus_maybe = 0;
      if (!used && roll === roll_used) {
        used = true;
        bonus_maybe = bonus;
      }
      return this.renderD20(roll, bonus_maybe, key);
    });

    return (
      <Grid container spacing={0} direction="row" 
        style={{
          background: "black"
        }}>
        <Grid item xs={12}>
          <em style={{ 
            fontStyle: "normal",
            color: "gray"
          }}>{ name } Attack:</em>
          &nbsp;
          <em style={{ 
            fontStyle: "normal",
            color: "blue"
          }}>To Hit</em>
        </Grid>
        <Grid item xs={8} container spacing={0} direction="column"
          style={{ 
            padding: "4px", 
            fontSize: "15px",
            color: "white"
          }}>
          { d20_renders.map((render, key) => {
            return (
              <Grid item xs={12} key={key} container spacing={0} direction="column">
                { render }
              </Grid>
            );
          })}
        </Grid>
        <Grid item xs={1} 
          style={{
            color: "gray",
            verticalAlign: "middle",
            fontSize: "20px",
            padding: "4px"
          }}>
          =
        </Grid>
        <Grid item xs={3} 
          style={{
            color: "white",
            verticalAlign: "middle",
            fontSize: "25px",
            fontWeight: "bold",
            padding: "4px"
          }}>
          { grand_total }
        </Grid>
        <Grid item container spacing={0} direction="column"
          style={{ 
            padding: "4px", 
            fontSize: "15px",
            color: "white"
          }}>
          { roll_renders.map((render, key) => {
            return render;
          })}
        </Grid>
      </Grid>
    );
  }

  renderCheck(rolls: RollPlus[], name: string) {
    let grand_total = 0;

    const roll_renders: any[] = [];
    let bonus = 0;
    rolls.forEach(roll_plus => {
      if (roll_plus.flat !== 0) {
        grand_total += roll_plus.flat;
        bonus += roll_plus.flat;
      }
      if (this.props.char && roll_plus.ability_score !== "") {
        const mod = this.props.char.current_ability_scores.getModifier(roll_plus.ability_score);
        if (mod) {
          grand_total += mod;
          bonus += mod;
        }
      }
      if (roll_plus.size === 1) {
        grand_total += roll_plus.count;
        bonus += roll_plus.count;
      } else if (roll_plus.count !== 0) {
        const roll_render = this.renderRollPlus(roll_plus, true);
        roll_renders.push(roll_render.render);
        grand_total += roll_render.total;
      }
    });

    const d20_rolls: number[] = [];
    let roll_used = 0;
    d20_rolls.push(Math.ceil(Math.random() * 20));
    if (this.props.char && this.props.char instanceof Character && this.props.char.advantage === true) {
      d20_rolls.push(Math.ceil(Math.random() * 20));
      // TODO: Check for Elven Accuracy Feat
      roll_used = Math.max(...d20_rolls);
    } else if (this.props.char && this.props.char instanceof Character && this.props.char.advantage === false) { 
      d20_rolls.push(Math.ceil(Math.random() * 20));
      roll_used = Math.min(...d20_rolls);
    } else {
      roll_used = d20_rolls[0];
    }
    grand_total += roll_used;
    let used = false;
    const d20_renders = d20_rolls.map((roll, key) => {
      let bonus_maybe = 0;
      if (!used && roll === roll_used) {
        used = true;
        bonus_maybe = bonus;
      }
      return this.renderD20(roll, bonus_maybe, key);
    });

    return (
      <Grid container spacing={0} direction="row" 
        style={{
          background: "black"
        }}>
        <Grid item xs={12}>
          <em style={{ 
            fontStyle: "normal",
            color: "gray"
          }}>{ name } { this.props.type }</em>
        </Grid>
        <Grid item xs={8} container spacing={0} direction="column"
          style={{ 
            padding: "4px", 
            fontSize: "15px",
            color: "white"
          }}>
          { d20_renders.map((render, key) => {
            return (
              <Grid item xs={12} key={key} container spacing={0} direction="column">
                { render }
              </Grid>
            );
          })}
        </Grid>
        <Grid item xs={1} 
          style={{
            color: "gray",
            verticalAlign: "middle",
            fontSize: "20px",
            padding: "4px"
          }}>
          =
        </Grid>
        <Grid item xs={3} 
          style={{
            color: "white",
            verticalAlign: "middle",
            fontSize: "25px",
            fontWeight: "bold",
            padding: "4px"
          }}>
          { grand_total }
        </Grid>
        <Grid item container spacing={0} direction="column"
          style={{ 
            padding: "4px", 
            fontSize: "15px",
            color: "white"
          }}>
          { roll_renders.map((render, key) => {
            return render;
          })}
        </Grid>
      </Grid>
    );
  }

  renderDamage(rolls: RollPlus[], name: string) {
    let grand_total = 0;

    const roll_renders: any[] = [];
    rolls.forEach(roll_plus => {
      const roll_render = this.renderRollPlus(roll_plus, true);
      roll_renders.push(roll_render.render);
      grand_total += roll_render.total;
    });
    return (
      <Grid container spacing={0} direction="row" 
        style={{
          background: "black"
        }}>
        <Grid item xs={12}>
          <em style={{ 
            fontStyle: "normal",
            color: "gray"
          }}>{ name }:</em>
          &nbsp;
          <em style={{ 
            fontStyle: "normal",
            color: "red"
          }}>Damage</em>
        </Grid>
        <Grid item xs={8} container spacing={0} direction="column"
          style={{ 
            padding: "4px", 
            fontSize: "15px",
            color: "white"
          }}>
          { roll_renders }
        </Grid>
        <Grid item xs={1} 
          style={{
            color: "gray",
            verticalAlign: "middle",
            fontSize: "20px",
            padding: "4px"
          }}>
          =
        </Grid>
        <Grid item xs={3} 
          style={{
            color: "white",
            verticalAlign: "middle",
            fontSize: "25px",
            fontWeight: "bold",
            padding: "4px"
          }}>
          { grand_total }
        </Grid>
      </Grid>
    );
  }

  renderHealing(rolls: RollPlus[], name: string) {
    let grand_total = 0;

    const roll_renders: any[] = [];
    rolls.forEach(roll_plus => {
      const roll_render = this.renderRollPlus(roll_plus, true);
      roll_renders.push(roll_render.render);
      grand_total += roll_render.total;
    });
    return (
      <Grid container spacing={0} direction="row" 
        style={{
          background: "black"
        }}>
        <Grid item xs={12}>
          <em style={{ 
            fontStyle: "normal",
            color: "gray"
          }}>{ name }:</em>
          &nbsp;
          <em style={{ 
            fontStyle: "normal",
            color: "green"
          }}>{ this.props.type }</em>
        </Grid>
        <Grid item xs={8} container spacing={0} direction="column"
          style={{ 
            padding: "4px", 
            fontSize: "15px",
            color: "white"
          }}>
          { roll_renders }
        </Grid>
        <Grid item xs={1} 
          style={{
            color: "gray",
            verticalAlign: "middle",
            fontSize: "20px",
            padding: "4px"
          }}>
          =
        </Grid>
        <Grid item xs={3} 
          style={{
            color: "white",
            verticalAlign: "middle",
            fontSize: "25px",
            fontWeight: "bold",
            padding: "4px"
          }}>
          { grand_total }
        </Grid>
      </Grid>
    );
  }

  renderD20(roll: number, bonus: number, key: number) {
    const image = roll === 1 ? CritFail : (roll === 20 ? CritSuccess : D20);
    return (
      <Grid item key={key} container spacing={0} direction="row">
        <Grid item xs={6}>
          <img src={image} alt={image} 
            style={{
              width: "40px",
              height: "40px"
            }} 
          />
        </Grid>
        <Grid item xs={6} container spacing={0} direction="column">
          <Grid item>
            { roll }{ this.data_util.add_plus_maybe(bonus, true) }
          </Grid>
        </Grid>
        { roll === 1 ?
          <Grid item xs={12}>
            CRITICAL FAIL! :(
          </Grid>
        : roll === 20 &&
          <Grid item xs={12}>
            CRITICAL SUCCESS! :)
          </Grid>
        }
      </Grid>
    );
  }

  renderRollPlus(roll_plus: RollPlus, show_bonus: boolean) {
    const return_me: any = {
      total: 0,
      render: null
    };
    let total = roll_plus.flat;
    let bonuses = roll_plus.flat;
    if (this.props.char && roll_plus.ability_score !== "") {
      const mod = this.props.char.current_ability_scores.getModifier(roll_plus.ability_score);
      if (mod) {
        total += mod;
        bonuses += mod;
      }
    }
    const dr = roll_plus;
    if (dr.size === 1) {
      if (dr.count !== 0) {
        total += dr.count;
      }
      return_me.total = total;
      return_me.render = (
        <Grid item key={roll_plus.true_id} container spacing={0} direction="row">
          <Grid item xs={6}>
            &nbsp;
          </Grid>
          <Grid item xs={6}>
            { total }
            <DamageTypeImage image={roll_plus.type} size={25} color="white" />
          </Grid>
        </Grid>
      );
    } else if (dr.count === 0) {
      return_me.total = total;
      return_me.render = (
        <Grid item key={roll_plus.true_id} container spacing={0} direction="row">
          <Grid item xs={6}>
            &nbsp;
          </Grid>
          <Grid item xs={6}>
            { total }
            <DamageTypeImage image={roll_plus.type} size={25} color="white" />
          </Grid>
        </Grid>
      );
    } else {
      let roll_string = "";
      let image = "";
      switch(+dr.size) {
        case 4: image = D4; break;
        case 6: image = D6; break;
        case 8: image = D8; break;
        case 10: image = D10; break;
        case 12: image = D12; break;
      }
      let count = dr.count;
      let reverse = false;
      if (count < 0) {
        count *= -1;
        reverse = true;
      }
      for (let i = 0; i < count; ++i) {
        const roll2 = Math.ceil(Math.random() * dr.size);
        if (reverse) {
          roll_string += `-${roll2}`;
          total -= roll2;
        } else {
          roll_string = this.data_util.add_plus_maybe_2_strings(roll_string, roll2);
          total += roll2;
        }
      }
      return_me.total = total;
      return_me.render = (
        <Grid item key={roll_plus.true_id} container spacing={0} direction="row">
          <Grid item xs={6}>
            <img src={image} alt={image} 
              style={{
                width: "40px",
                height: "40px"
              }} 
            />
          </Grid>
          <Grid item xs={6}>
            { roll_string }
            { show_bonus && <span>{ this.data_util.add_plus_maybe(bonuses, true) }</span> }
            { show_bonus && (count > 1 || bonuses !== 0) && `= ${ total }` }
            <DamageTypeImage image={roll_plus.type} size={25} color="white" />
          </Grid>
        </Grid>
      );
    }
    return return_me;
  }
}

export default connector(Roller);
