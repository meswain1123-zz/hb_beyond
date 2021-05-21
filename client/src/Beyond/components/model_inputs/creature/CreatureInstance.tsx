import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from "react-router-dom";

import {
  Grid, 
} from "@material-ui/core";
import { 
  ArmorType,
  Character,
  CharacterFeature,
  CreatureInstance,
  CreatureAbility,
  Condition,
  EldritchInvocation,
  Skill,
  WeaponKeyword,
  Spell,
  SpellSlotType,
} from "../../../models";

import StringBox from "../../input/StringBox";

import CreatureInstanceSavingThrows from "./CreatureInstanceSavingThrows";
import CreatureAbilityScores from "./CreatureAbilityScores";
import CreatureAction from "./CreatureAction";

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
  obj: Character;
  creature_instance: CreatureInstance;
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


class CreatureInstanceInput extends Component<Props, State> {
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

  updateCharacter() {
    this.api.updateObject("character", this.props.obj).then((res: any) => {
      this.props.onChange();
    });
  }

  render() {
    if (this.state.loading || this.state.armor_types === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      const creature_instance = this.props.creature_instance;
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
            { creature_instance.name }
          </Grid>
          <Grid item 
            style={{
              color: "black"
            }}>
            { creature_instance.size } { creature_instance.creature_type }{ creature_instance.subtype !== "" && ` (${creature_instance.subtype})` }{ creature_instance.alignment !== "" && `, ${creature_instance.alignment}` }
          </Grid>
          <Grid item style={{ borderTop: "1px solid blue" }}>
            <b>Armor Class</b> { creature_instance.armor_class }
          </Grid>
          <Grid item>
            { this.renderHPStuff() }
            {/* <b>Hit Points</b> { creature_instance.max_hit_points }{ creature_instance.hit_dice.count > 0 && ` ${ creature_instance.hit_dice_string })` } */}
          </Grid>
          <Grid item>
            <b>Speed</b> { creature_instance.speed_string }
          </Grid>
          <Grid item container spacing={0} direction="row" 
            style={{ borderTop: "1px solid blue" }}>
            <CreatureAbilityScores 
              obj={creature_instance}
              onChange={() => {

              }}
            />
          </Grid>
          <Grid item style={{ borderTop: "1px solid blue" }}>
            <CreatureInstanceSavingThrows 
              obj={creature_instance}
              onChange={() => {

              }}
            />
          </Grid>
          { creature_instance.skills_string.length > 0 &&
            <Grid item>
              <b>Skills</b> { creature_instance.skills_string }
            </Grid>
          }
          { creature_instance.tools_string.length > 0 &&
            <Grid item>
              <b>Tools</b> { creature_instance.tools_string }
            </Grid>
          }
          { creature_instance.damage_multipliers.filter(o => o.multiplier === 0).length > 0 && 
            <Grid item>
              <b>Damage Immunities</b> { creature_instance.immunities_string }
            </Grid>
          }
          { creature_instance.damage_multipliers.filter(o => o.multiplier === 0.5).length > 0 && 
            <Grid item>
              <b>Damage Resistances</b> { creature_instance.resistances_string }
            </Grid>
          }
          { creature_instance.damage_multipliers.filter(o => o.multiplier === 2).length > 0 && 
            <Grid item>
              <b>Damage Vulnerabilities</b> { creature_instance.vulnerabilities_string }
            </Grid>
          }
          { creature_instance.condition_immunities.length > 0 && 
            <Grid item>
              <b>Condition Immunities</b> { creature_instance.condition_immunities_string }
            </Grid>
          }
          <Grid item>
            <b>Senses</b> { creature_instance.senses_string }
          </Grid>
          <Grid item>
            <b>Languages</b> { creature_instance.languages }
          </Grid>
          <Grid item container spacing={0} direction="row">
            <Grid item xs={6}>
              <b>Challenge</b> { creature_instance.challenge_rating }{ creature_instance.xp > 0 && `(${ creature_instance.xp } XP)` }
            </Grid>
            <Grid item xs={6}>
              <b>Prof. Bonus</b> { creature_instance.proficiency_modifier }
            </Grid>
          </Grid>
          <Grid item container 
            spacing={0} direction="column"
            style={{ borderTop: "1px solid blue" }}>
            { creature_instance.special_abilities.map((feature, key) => {
              return (
                <Grid item key={key}>
                  <b>{ feature.name }</b> { feature.feature && feature.feature.description }
                </Grid>
              );
            })}
          </Grid>
          { creature_instance.actions.length > 0 &&
            <Grid item style={{
              fontSize: "20px",
              fontWeight: "bold"
            }}>
              Actions
            </Grid>
          }
          { creature_instance.actions.length > 0 &&
            <Grid item style={{ borderTop: "1px solid blue" }}>
              { creature_instance.actions.map((feature, key) => {
                return this.renderAction(feature, key);
              })}
            </Grid>
          }
          { creature_instance.legendary_actions.length > 0 &&
            <Grid item style={{
              fontSize: "20px",
              fontWeight: "bold"
            }}>
              Legendary Actions
            </Grid>
          }
          { creature_instance.legendary_actions.length > 0 &&
            <Grid item style={{ borderTop: "1px solid blue" }}>
              { creature_instance.legendary_actions.map((feature, key) => {
                return this.renderAction(feature, key);
              })}
            </Grid>
          }
          { creature_instance.description.length > 0 &&
            <Grid item style={{
              fontSize: "20px",
              fontWeight: "bold"
            }}>
              Description
            </Grid>
          }
          { creature_instance.legendary_actions.length > 0 &&
            <Grid item style={{ borderTop: "1px solid blue" }}>
              { creature_instance.description }
            </Grid>
          }
        </Grid>
      ); 
    }
  }

  renderAction(feature: CharacterFeature, key: number) {
    return (
      <Grid item key={key} container spacing={1} direction="column">
        { feature.feature && feature.feature.the_feature && feature.feature.the_feature instanceof CreatureAbility ?
          <Grid item container spacing={1} direction="column">
            <Grid item>
              <CreatureAction
                obj={this.props.creature_instance}
                action={feature.feature.the_feature as CreatureAbility}
                onChange={() => {
                  this.props.onChange();
                }}
              />
            </Grid>
            <Grid item>
              { feature.feature && feature.feature.description }
            </Grid>
          </Grid>
        : feature.feature && feature.feature.feature_type === "Extra Attacks" ?
          <Grid item>
            <b>{ feature.name }</b> { `${(Math.floor(feature.feature.the_feature as number)) + 1} Attacks per Action` }
          </Grid>
        : 
          <Grid item>
            <b>{ feature.name }</b> { feature.feature && feature.feature.description }
          </Grid>
        }
      </Grid>
    );
  }

  renderHPStuff() {
    return (
      <Grid container spacing={1} direction="column"
        style={{ 
          padding: "10px",
          fontWeight: "bold"
        }}>
        <Grid item container spacing={0} direction="row">
          <Grid item xs={4}
            style={{
              display: "flex",
              justifyContent: "center"
            }}>
            Current HP
          </Grid>
          <Grid item xs={4}
            style={{
              display: "flex",
              justifyContent: "center"
            }}>
            Max HP
          </Grid>
          <Grid item xs={4}
            style={{
              display: "flex",
              justifyContent: "center"
            }}>
            Temp HP
          </Grid>
          <Grid item xs={4}
            style={{
              display: "flex",
              justifyContent: "center"
            }}>
            { !this.state.reloading &&
              <StringBox 
                name=""
                value={`${this.props.creature_instance.current_hit_points}`}
                type="number"
                onBlur={(changed: string) => {
                  const obj = this.props.creature_instance;
                  obj.current_hit_points = +changed;
                  if (obj.current_hit_points < 0) {
                    obj.current_hit_points = 0;
                  } else if (obj.override_max_hit_points === -1) {
                    if (obj.current_hit_points > (obj.max_hit_points + obj.max_hit_points_modifier)) {
                      obj.current_hit_points = obj.max_hit_points + obj.max_hit_points_modifier;
                    }
                  } else {
                    if (obj.current_hit_points > obj.override_max_hit_points + obj.max_hit_points_modifier) {
                      obj.current_hit_points = obj.override_max_hit_points + obj.max_hit_points_modifier;
                    }
                  }
                  this.updateCharacter();
                }}
              />
            }
          </Grid>
          <Grid item xs={4}
            style={{
              display: "flex",
              justifyContent: "center",
              fontSize: "20px"
            }}>
            { this.props.creature_instance.max_hit_points }
          </Grid>
          <Grid item xs={4}>
            <StringBox 
              name=""
              value={`${this.props.creature_instance.temp_hit_points}`}
              type="number"
              onBlur={(changed: string) => {
                const obj = this.props.creature_instance;
                obj.temp_hit_points = +changed;
                this.updateCharacter();
              }}
            />
          </Grid>
        </Grid>
        <Grid item container spacing={0} direction="row" style={{ borderTop: "1px solid lightgray" }}>
          <Grid item xs={6}
            style={{
              display: "flex",
              justifyContent: "center"
            }}>
            Max HP Modifier
          </Grid>
          <Grid item xs={6}
            style={{
              display: "flex",
              justifyContent: "center"
            }}>
            Override Max HP
          </Grid>
          <Grid item xs={6}
            style={{
              display: "flex",
              justifyContent: "center"
            }}>
            <StringBox 
              name=""
              value={ this.props.creature_instance.max_hit_points_modifier === 0 ? "" : `${this.props.creature_instance.max_hit_points_modifier}` }
              type="number"
              onBlur={(changed: string) => {
                const obj = this.props.creature_instance;
                if (changed === "") {
                  obj.max_hit_points_modifier = 0;
                } else {
                  obj.max_hit_points_modifier = +changed;
                }
                if (obj.override_max_hit_points === -1) {
                  if (obj.current_hit_points > (obj.max_hit_points + obj.max_hit_points_modifier)) {
                    obj.current_hit_points = obj.max_hit_points + obj.max_hit_points_modifier;
                  }
                } else {
                  if (obj.current_hit_points > obj.override_max_hit_points + obj.max_hit_points_modifier) {
                    obj.current_hit_points = obj.override_max_hit_points + obj.max_hit_points_modifier;
                  }
                }
                this.updateCharacter();
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <StringBox 
              name=""
              value={ this.props.creature_instance.override_max_hit_points === -1 ? "" : `${this.props.creature_instance.override_max_hit_points}`}
              type="number"
              onBlur={(changed: string) => {
                const obj = this.props.creature_instance;
                if (changed === "") {
                  obj.override_max_hit_points = -1;
                } else {
                  obj.override_max_hit_points = +changed;
                }
                if (obj.override_max_hit_points === -1) {
                  if (obj.current_hit_points > (obj.max_hit_points + obj.max_hit_points_modifier)) {
                    obj.current_hit_points = obj.max_hit_points + obj.max_hit_points_modifier;
                  }
                } else {
                  if (obj.current_hit_points > obj.override_max_hit_points + obj.max_hit_points_modifier) {
                    obj.current_hit_points = obj.override_max_hit_points + obj.max_hit_points_modifier;
                  }
                }
                this.updateCharacter();
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default connector(CreatureInstanceInput);
