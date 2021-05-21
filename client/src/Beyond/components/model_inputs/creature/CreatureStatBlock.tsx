import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Redirect } from "react-router-dom";

import {
  Grid, 
} from "@material-ui/core";
import { 
  ArmorType,
  Creature,
  Condition,
  EldritchInvocation,
  Skill,
  WeaponKeyword,
  Spell,
  SpellSlotType,
} from "../../../models";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";
import imageAPI from "../../../utilities/image_api";
import { APIClass as ImageAPIClass } from "../../../utilities/image_api_class";


interface AppState {
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { 
  obj: Creature;
  onChange: () => void;
}

export interface State { 
  redirectTo: string | null;
  armor_types: ArmorType[] | null;
  conditions: Condition[] | null;
  weapon_keywords: WeaponKeyword[] | null;
  skills: Skill[] | null;
  spells: Spell[] | null;
  spell_slot_types: SpellSlotType[] | null;
  eldritch_invocations: EldritchInvocation[] | null;
  loading: boolean;
  reloading: boolean;
}


class CreatureStatBlock extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      armor_types: null,
      conditions: null,
      weapon_keywords: null,
      skills: null,
      spells: null,
      spell_slot_types: null,
      eldritch_invocations: null,
      loading: false,
      reloading: false,
    };
    this.api = API.getInstance();
    this.image_api = imageAPI.getInstance();
  }

  api: APIClass;
  image_api: ImageAPIClass;

  componentDidMount() {
    this.load();
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["armor_type","condition","spell","skill","spell_slot_type","eldritch_invocation","weapon_keyword"]).then((res: any) => {
        const armor_types: ArmorType[] = res.armor_type;
        const spells: Spell[] = res.spell;
        this.setState({ 
          armor_types,
          conditions: res.condition,
          spells,
          skills: res.skill,
          spell_slot_types: res.spell_slot_type,
          eldritch_invocations: res.eldritch_invocation,
          weapon_keywords: res.weapon_keyword,
          loading: false 
        });
      });
    });
  }

  updateCharacter(obj: Creature) {
    this.api.updateObject("creature", obj).then((res: any) => {
      this.props.onChange();
    });
  }

  render() {
    if (this.state.loading || this.state.armor_types === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      return (
        <Grid container spacing={1} direction="column" 
          style={{ 
            lineHeight: "1.5",
            backgroundColor: "beige",
            color: "blue"
          }}>
          <Grid item 
            style={{
              fontSize: "25px",
              fontWeight: "bold"
            }}>
            { this.props.obj.name }
          </Grid>
          <Grid item 
            style={{
              color: "black"
            }}>
            { this.props.obj.size } { this.props.obj.creature_type }{ this.props.obj.subtype !== "" && ` (${this.props.obj.subtype})` }{ this.props.obj.alignment !== "" && `, ${this.props.obj.alignment}` }
          </Grid>
          <Grid item style={{ borderTop: "1px solid blue" }}>&nbsp;</Grid>
          <Grid item>
            <b>Armor Class</b> { this.props.obj.armor_class }
          </Grid>
          <Grid item>
            <b>Hit Points</b> { this.props.obj.max_hit_points } ({ this.props.obj.hit_dice_string })
          </Grid>
          <Grid item>
            <b>Speed</b> { this.props.obj.speed_string }
          </Grid>
          <Grid item style={{ borderTop: "1px solid blue" }}>&nbsp;</Grid>
          <Grid item container spacing={0} direction="row">
            <Grid item xs={4} style={{
              display: "flex",
              justifyContent: "center"
            }}>
              STR
            </Grid>
            <Grid item xs={4} style={{
              display: "flex",
              justifyContent: "center"
            }}>
              DEX
            </Grid>
            <Grid item xs={4} style={{
              display: "flex",
              justifyContent: "center"
            }}>
              CON
            </Grid>
            <Grid item xs={4} style={{
              display: "flex",
              justifyContent: "center"
            }}>
              { this.props.obj.ability_scores.strength } ({ this.props.obj.ability_scores.STR > 0 ? `+${this.props.obj.ability_scores.STR}` : `${this.props.obj.ability_scores.STR}` })
            </Grid>
            <Grid item xs={4} style={{
              display: "flex",
              justifyContent: "center"
            }}>
              { this.props.obj.ability_scores.dexterity } ({ this.props.obj.ability_scores.DEX > 0 ? `+${this.props.obj.ability_scores.DEX}` : `${this.props.obj.ability_scores.DEX}` })
            </Grid>
            <Grid item xs={4} style={{
              display: "flex",
              justifyContent: "center"
            }}>
              { this.props.obj.ability_scores.constitution } ({ this.props.obj.ability_scores.CON > 0 ? `+${this.props.obj.ability_scores.CON}` : `${this.props.obj.ability_scores.CON}` })
            </Grid>
            <Grid item xs={12}>&nbsp;</Grid>
            <Grid item xs={4} style={{
              display: "flex",
              justifyContent: "center"
            }}>
              INT
            </Grid>
            <Grid item xs={4} style={{
              display: "flex",
              justifyContent: "center"
            }}>
              WIS
            </Grid>
            <Grid item xs={4} style={{
              display: "flex",
              justifyContent: "center"
            }}>
              CHA
            </Grid>
            <Grid item xs={4} style={{
              display: "flex",
              justifyContent: "center"
            }}>
              { this.props.obj.ability_scores.intelligence } ({ this.props.obj.ability_scores.INT > 0 ? `+${this.props.obj.ability_scores.INT}` : `${this.props.obj.ability_scores.INT}` })
            </Grid>
            <Grid item xs={4} style={{
              display: "flex",
              justifyContent: "center"
            }}>
              { this.props.obj.ability_scores.wisdom } ({ this.props.obj.ability_scores.WIS > 0 ? `+${this.props.obj.ability_scores.WIS}` : `${this.props.obj.ability_scores.WIS}` })
            </Grid>
            <Grid item xs={4} style={{
              display: "flex",
              justifyContent: "center"
            }}>
              { this.props.obj.ability_scores.charisma } ({ this.props.obj.ability_scores.CHA > 0 ? `+${this.props.obj.ability_scores.CHA}` : `${this.props.obj.ability_scores.CHA}` })
            </Grid>
          </Grid>
          <Grid item style={{ borderTop: "1px solid blue" }}>&nbsp;</Grid>
          <Grid item>
            <b>Saving Throws</b> { this.props.obj.saving_throws_string }
          </Grid>
          <Grid item>
            <b>Skills</b> { this.props.obj.skills_string }
          </Grid>
          <Grid item>
            <b>Tools</b> { this.props.obj.tools_string }
          </Grid>
          { this.props.obj.damage_multipliers.filter(o => o.multiplier === 0).length > 0 && 
            <Grid item>
              <b>Damage Immunities</b> { this.props.obj.immunities_string }
            </Grid>
          }
          { this.props.obj.damage_multipliers.filter(o => o.multiplier === 0.5).length > 0 && 
            <Grid item>
              <b>Damage Resistances</b> { this.props.obj.resistances_string }
            </Grid>
          }
          { this.props.obj.damage_multipliers.filter(o => o.multiplier === 2).length > 0 && 
            <Grid item>
              <b>Damage Vulnerabilities</b> { this.props.obj.vulnerabilities_string }
            </Grid>
          }
          { this.props.obj.condition_immunities.length > 0 && 
            <Grid item>
              <b>Condition Immunities</b> { this.props.obj.condition_immunities_string }
            </Grid>
          }
          <Grid item>
            <b>Senses</b> { this.props.obj.senses_string }
          </Grid>
          <Grid item>
            <b>Languages</b> { this.props.obj.languages }
          </Grid>
          <Grid item container spacing={0} direction="row">
            <Grid item xs={6}>
              <b>Challenge</b> { this.props.obj.challenge_rating } ({ this.props.obj.xp } XP) 
            </Grid>
            <Grid item xs={6}>
              <b>Proficiency Bonus</b> { this.props.obj.proficiency_modifier }
            </Grid>
          </Grid>
          <Grid item style={{ borderTop: "1px solid blue" }}>&nbsp;</Grid>
          <Grid item container spacing={0} direction="column">
            { this.props.obj.special_abilities.map((feature, key) => {
              return (
                <Grid item key={key}>
                  <b>{ feature.name }</b> { feature.description }
                </Grid>
              );
            })}
          </Grid>
          <Grid item style={{
            fontSize: "20px",
            fontWeight: "bold"
          }}>
            Actions
          </Grid>
          <Grid item style={{ borderTop: "1px solid blue" }}>
            { this.props.obj.actions.map((feature, key) => {
              return (
                <Grid item key={key}>
                  <b>{ feature.name }</b> { feature.description }
                </Grid>
              );
            })}
          </Grid>
          <Grid item style={{
            fontSize: "20px",
            fontWeight: "bold"
          }}>
            Legendary Actions
          </Grid>
          <Grid item style={{ borderTop: "1px solid blue" }}>
            { this.props.obj.legendary_actions.map((feature, key) => {
              return (
                <Grid item key={key}>
                  <b>{ feature.name }</b> { feature.description }
                </Grid>
              );
            })}
          </Grid>
          <Grid item style={{
            fontSize: "20px",
            fontWeight: "bold"
          }}>
            Description
          </Grid>
          <Grid item style={{ borderTop: "1px solid blue" }}>
            { this.props.obj.description }
          </Grid>
        </Grid>
      ); 
    }
  }
}

export default connector(CreatureStatBlock);
