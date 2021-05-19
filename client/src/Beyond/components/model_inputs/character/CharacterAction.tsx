import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
  Drawer,
  Popover,
} from "@material-ui/core";

import { 
  Attack,
  Ability,
  Character,
  CharacterAbility,
  CharacterItem,
  CharacterSpell,
  CharacterSpecialSpell,
  INumHash,
  SpellAsAbility,
  RollPlus,
  Reroll,
} from "../../../models";

import ButtonBox from "../../input/ButtonBox";

import ViewSpell from "../ViewSpell";
import CharacterSpellDetails from './CharacterSpellDetails';
import CharacterAbilityDetails from './CharacterAbilityDetails';
import CharacterCastButton from "./CharacterCastButton";

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
  obj: Character;
  level: number;
  show_casting_time: boolean;
  action: any;
  group: string;
  onChange: (change_types: string[]) => void; // For slots, resources, and concentration
}

export interface State {
  reloading: boolean;
  drawer: string;
  edit_view: string;
  selected_spell: CharacterSpell | null;
  selected_level: number | null;
  selected_ability: CharacterAbility | null;
  levels: INumHash;
  concentration: boolean;
  ritual: boolean;
  popoverAnchorEl: HTMLDivElement | null;
  popoverAction: CharacterSpell | Attack | CharacterAbility | null;
  popoverActionLevel: number;
  popoverWeapon: CharacterItem | null;
  popoverMode: string;
}

class CharacterAction extends Component<Props, State> {
  public static defaultProps = {
    show_casting_time: false,
    level: -1
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      reloading: false,
      drawer: "",
      edit_view: "",
      selected_spell: null,
      selected_level: null,
      selected_ability: null,
      levels: {},
      concentration: false,
      ritual: false,
      popoverAnchorEl: null,
      popoverAction: null,
      popoverActionLevel: -1,
      popoverWeapon: null,
      popoverMode: ""
    };
    this.api = API.getInstance();
    this.char_util = CharacterUtilities.getInstance();
  }

  api: APIClass;
  char_util: CharacterUtilitiesClass;

  componentDidMount() {
  }

  updateCharacter(change_types: string[]) {
    this.api.updateObject("character", this.props.obj).then((res: any) => {
      if (change_types.length > 0) {
        this.setState({ 
          popoverAnchorEl: null, 
          popoverAction: null, 
          popoverActionLevel: -1, 
          popoverWeapon: null,
          popoverMode: "", 
          reloading: true 
        }, () => {
          this.setState({ reloading: false }, () => {
            this.props.onChange(change_types);
          });
        });
      } else {
        this.setState({
          popoverAnchorEl: null, 
          popoverAction: null, 
          popoverActionLevel: -1, 
          popoverWeapon: null,
          popoverMode: ""
        });
      }
    });
  }

  render() {
    const action = this.props.action;
    const group2 = this.props.group;
    if (action instanceof CharacterItem) {
      const weapon = action;
      return (
        <Grid item container spacing={0} direction="row">
          <Grid item xs={1}>
            
          </Grid>
          <Grid item xs={4} 
            container spacing={0} 
            direction="column">
            { weapon.name }
          </Grid>
          <Grid item xs={1} style={{
            display: "flex",
            justifyContent: "center"
          }}>
            { weapon.range === 0 ? "Melee" : `${weapon.range} feet` }
          </Grid>
          { this.renderWeaponAttacks(weapon, group2) }
          { this.renderExtras() }
        </Grid>    
      );
    } else if (action instanceof CharacterSpecialSpell || action instanceof CharacterSpell) {
      const spell = action;
      const level = this.props.level === -1 ? spell.level : this.props.level;
      let slots = this.props.obj.slots.filter(o => o.level === level);
      let level2 = level;
      if (slots.length === 0) {
        level2 = 9; 
        this.props.obj.slots.filter(o => o.level > level).forEach(s => {
          if (s.level < level2) {
            level2 = s.level;
          }
        });
      }
      return (
        <Grid item container spacing={0} direction="row">
          <Grid item xs={1}>
            <CharacterCastButton
              obj={spell}
              character={this.props.obj}
              level={level2}
              onChange={(change_types: string[]) => {
                this.props.onChange(change_types);
              }}
            />
          </Grid>
          <Grid item xs={3} onClick={() => {
            this.setState({ 
              drawer: "details", 
              selected_spell: spell, 
              selected_level: level2 
            });
          }}>
            <ViewSpell spell={spell} show_ritual />
          </Grid>
          <Grid item xs={1} style={{
            display: "flex",
            justifyContent: "center"
          }}>
            { this.props.show_casting_time && spell.casting_time_string }
          </Grid>
          <Grid item xs={1} style={{
            display: "flex",
            justifyContent: "center"
          }}>
            { spell.range_string }
          </Grid>
          { this.renderSpellAttacks(spell, level2) }
          { this.renderExtras() }
        </Grid>
      );
    } else if (action instanceof CharacterAbility) {
      return (
        <Grid item container spacing={0} direction="row">
          <Grid item xs={1}>
            <CharacterCastButton
              obj={action}
              character={this.props.obj}
              onChange={(change_types: string[]) => {
                this.props.onChange(change_types);
              }}
            />
          </Grid>
          <Grid item xs={3} container spacing={0} direction="column" onClick={() => this.setState({ drawer: "details", selected_ability: action })}>
            <Grid item>{ action.name }</Grid>
            <Grid item style={{ 
              lineHeight: "1.1",
              fontSize: "10px",
              color: "gray"
            }}>
              { action.source_name }
            </Grid>
          </Grid>
          <Grid item xs={1} style={{
            display: "flex",
            justifyContent: "center"
          }}>
            { this.props.show_casting_time && action.casting_time_string }
          </Grid>
          { action.the_ability instanceof Ability ? 
            <Grid item xs={1} style={{
              display: "flex",
              justifyContent: "center"
            }}>
              { action.the_ability.range }
            </Grid>
          : action.the_ability instanceof SpellAsAbility && 
            <Grid item xs={1} style={{
              display: "flex",
              justifyContent: "center"
            }}>
              { action.the_ability.spell && action.the_ability.spell.range }
            </Grid>
          }
          { this.renderSpellAttacks(action, action.level) }
          { this.renderExtras() }
        </Grid>
      );
    } else return null;
  }

  renderExtras() {
    return [
      <Drawer key="drawer" anchor="right" 
        open={ this.state.drawer === "details" } 
        onClose={() => {
          this.setState({ drawer: "" });
        }}>
        { this.state.selected_spell && this.state.selected_level !== null &&
          <CharacterSpellDetails
            obj={this.props.obj}
            spell={this.state.selected_spell}
            level={this.state.selected_level}
            onChange={(change_types: string[]) => {
              this.updateCharacter(change_types);
            }}
            onClose={() => {
              this.setState({ drawer: "", selected_spell: null, selected_level: null });
            }}
          />
        }
        { this.state.selected_ability &&
          <CharacterAbilityDetails
            obj={this.props.obj}
            ability={this.state.selected_ability}
            onChange={(change_types: string[]) => {
              this.updateCharacter(change_types);
            }}
            onClose={() => {
              this.setState({ drawer: "", selected_ability: null });
            }}
          />
        }
      </Drawer>,
      <Popover key="rolls"
        open={ this.state.popoverAnchorEl !== null && this.state.popoverMode !== "Cast" }
        anchorEl={this.state.popoverAnchorEl}
        onClose={() => {
          this.setState({ popoverAnchorEl: null, popoverAction: null, popoverActionLevel: -1, popoverMode: "" });
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

  renderWeaponAttacks(weapon: CharacterItem, group2: string) {
    const filtered = weapon.attacks.filter(o => (group2 !== "bonus_actions" && !o.bonus_action) || (group2 === "bonus_actions" && o.bonus_action));
    if (filtered.length > 0) {
      return (
        <Grid item xs={6} container spacing={0} direction="column">
          { filtered.map((attack, key) => {
            return (
              <Grid item key={key} container spacing={0} direction="row">
                <Grid item xs={6}>
                  <ButtonBox
                    name={ attack.attack_string }
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                      this.setState({ popoverAction: attack, popoverMode: "Attack" });
                      this.setPopoverAnchorEl(event.currentTarget);
                    }} 
                  />
                </Grid>
                <Grid item xs={6}>
                  <ButtonBox
                    name={ attack.damage_string }
                    find_images
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                      this.setState({ popoverAction: attack, popoverMode: "Damage", popoverWeapon: weapon });
                      this.setPopoverAnchorEl(event.currentTarget);
                    }} 
                  />
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      );
    } else return null;
  }

  renderSpellAttacks(spell: CharacterSpell | CharacterAbility, level2: number) {
    // console.log(spell);
    return (
      <Grid item xs={6} container spacing={0} direction="row">
        <Grid item xs={6} style={{
            display: "flex",
            justifyContent: "center"
          }}>
          { spell.use_attack ?
            <ButtonBox
              name={ spell.attack_string }
              onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                this.setState({ popoverAction: spell, popoverActionLevel: level2, popoverMode: "Attack" })
                this.setPopoverAnchorEl(event.currentTarget);
              }} 
            />
          :
            <span>
              { spell.attack_string }
            </span> 
          }
        </Grid>
        <Grid item xs={6} style={{
            display: "flex",
            justifyContent: "center"
          }}>
          { !["Control","Utility","Summon","Transform","Create Resource"].includes(spell.effect_string) ?
            <ButtonBox
              fontSize={9}
              name={ spell.get_potence_string(level2, this.props.obj) }
              image={ spell.effect_string }
              onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                this.setState({ popoverAction: spell, popoverActionLevel: level2, popoverMode: "Damage" })
                this.setPopoverAnchorEl(event.currentTarget);
              }} 
            />
          :
            <span>
              { spell.effect_string }
            </span> 
          }
        </Grid>
      </Grid>
    );
  }

  renderRoll() {
    const mode = this.state.popoverMode;
    if (this.state.popoverAction instanceof CharacterSpell) {
      const spell = this.state.popoverAction;
      if (spell && spell.spell) {
        if (mode === "Attack") {
          return (
            <Roller 
              name={spell.name}
              char={this.props.obj}
              rolls={spell.attack.attack_rolls} 
              type="Attack" 
            />
          );
        } else if (mode === "Damage") {
          const level = this.state.popoverActionLevel;
          const potence = spell.get_potence(level, this.props.obj);
          let damage_rolls: RollPlus[] = [];
          if (potence) {
            const roll_plus = new RollPlus(potence.rolls);
            damage_rolls.push(roll_plus);
          }
          damage_rolls = [...damage_rolls,...spell.attack.damage_rolls];
          
          const rerolls: Reroll[] = [];
          this.props.obj.rerolls.forEach(r => {
            let good = false;
            if (r.allowed_armor_types.includes("All")) {
              // Check for required
              if (r.required_armor_types.includes("None")) {
                good = true;
              } else if (r.required_armor_types.includes("Any")) {
                good = this.props.obj.equipped_items.filter(o => 
                  o.base_item &&
                  o.base_item.item_type === "Armor" &&
                  o.base_item.name !== "Shield"
                ).length > 0;
              } else {
                const missing_armor_types = r.required_armor_types.filter(a =>
                  this.props.obj.equipped_items.filter(o =>
                    o.base_item &&
                    o.base_item.item_type === "Armor" &&
                    o.base_item.armor_type_id === a).length === 0);
                good = missing_armor_types.length === 0;
              }
            } else if (r.allowed_armor_types.includes("None")) {
              good = this.props.obj.equipped_items.filter(o => 
                o.base_item &&
                o.base_item.item_type === "Armor" &&
                o.base_item.name !== "Shield"
              ).length === 0;
            } else {
              const bad_armor_items = this.props.obj.equipped_items.filter(o =>
                o.base_item &&
                o.base_item.item_type === "Armor" &&
                !r.allowed_armor_types.includes(o.base_item.armor_type_id));
    
              good = bad_armor_items.length === 0;
            }
            if (good) {
              if (!r.required_weapon_keywords.includes("None")) {
              } else if (!r.allowed_damage_types.includes("All")) {
                good = false;
                for (let i = 0; i < damage_rolls.length; ++i) {
                  if (r.allowed_damage_types.includes(damage_rolls[i].type)) {
                    good = true;
                    break;
                  }
                }
              }
              rerolls.push(r);
            }
          });
          if (["Healing","Temp HP","Max HP"].includes(spell.effect_string)) {
            return (
              <Roller 
                name={spell.name}
                char={this.props.obj}
                rolls={damage_rolls} 
                rerolls={rerolls}
                type={spell.effect_string} 
              />
            );
          } else {
            return (
              <Roller 
                name={spell.name}
                char={this.props.obj}
                rolls={damage_rolls} 
                rerolls={rerolls}
                type="Damage" 
              />
            );
          }
        }
      }
    } else if (this.state.popoverAction instanceof Attack) {
      const attack = this.state.popoverAction;
      if (mode === "Attack") {
        return (
          <Roller 
            name={attack.type}
            char={this.props.obj}
            rolls={attack.attack_rolls} 
            type="Attack" 
          />
        );
      } else if (mode === "Damage") {
        const weapon = this.state.popoverWeapon;
        const rerolls: Reroll[] = [];
        if (weapon) {
          this.props.obj.rerolls.forEach(r => {
            let good = false;
            if (r.allowed_armor_types.includes("All")) {
              // Check for required
              if (r.required_armor_types.includes("None")) {
                good = true;
              } else if (r.required_armor_types.includes("Any")) {
                good = this.props.obj.equipped_items.filter(o => 
                  o.base_item &&
                  o.base_item.item_type === "Armor" &&
                  o.base_item.name !== "Shield"
                ).length > 0;
              } else {
                const missing_armor_types = r.required_armor_types.filter(a =>
                  this.props.obj.equipped_items.filter(o =>
                    o.base_item &&
                    o.base_item.item_type === "Armor" &&
                    o.base_item.armor_type_id === a).length === 0);
                good = missing_armor_types.length === 0;
              }
            } else if (r.allowed_armor_types.includes("None")) {
              good = this.props.obj.equipped_items.filter(o => 
                o.base_item &&
                o.base_item.item_type === "Armor" &&
                o.base_item.name !== "Shield"
              ).length === 0;
            } else {
              const bad_armor_items = this.props.obj.equipped_items.filter(o =>
                o.base_item &&
                o.base_item.item_type === "Armor" &&
                !r.allowed_armor_types.includes(o.base_item.armor_type_id));
    
              good = bad_armor_items.length === 0;
            }
            if (good) {
              if (!r.required_weapon_keywords.includes("None")) {
                for (let i = 0; i < r.required_weapon_keywords.length; ++i) {
                  if (weapon.weapon_keywords.filter(o => o._id === r.required_weapon_keywords[i]).length === 0) {
                    good = false;
                    break;
                  }
                }
              }
              if (good) {
                if (!r.excluded_weapon_keywords.includes("None")) {
                  for (let i = 0; i < weapon.weapon_keywords.length; ++i) {
                    if (r.excluded_weapon_keywords.includes(weapon.weapon_keywords[i]._id)) {
                      good = false;
                      break;
                    }
                  }
                }
              }
              if (good) {
                if (!r.allowed_damage_types.includes("All")) {
                  good = false;
                  for (let i = 0; i < attack.damage_rolls.length; ++i) {
                    if (r.allowed_damage_types.includes(attack.damage_rolls[i].type)) {
                      good = true;
                      break;
                    }
                  }
                }
              }
              if (good) {
                rerolls.push(r);
              }
            }
          });
        }
        return (
          <Roller 
            name={attack.type}
            char={this.props.obj}
            rolls={attack.damage_rolls} 
            rerolls={rerolls}
            type="Damage" 
          />
        );
      }
    } else {
      const ability = this.state.popoverAction;
      if (ability) {
        if (ability.spell) {
          if (mode === "Attack") {
            return (
              <Roller 
                name={ability.name}
                char={this.props.obj}
                rolls={ability.attack.attack_rolls} 
                type="Attack" 
              />
            );
          } else if (mode === "Damage") {
            const level = this.state.popoverActionLevel;
            const potence = ability.get_potence(level, this.props.obj);
            let damage_rolls: RollPlus[] = [];
            if (potence) {
              const roll_plus = new RollPlus(potence.rolls);
              damage_rolls.push(roll_plus);
            }
            damage_rolls = [...damage_rolls,...ability.attack.damage_rolls];
            
            const rerolls: Reroll[] = [];
            this.props.obj.rerolls.forEach(r => {
              let good = false;
              if (r.allowed_armor_types.includes("All")) {
                // Check for required
                if (r.required_armor_types.includes("None")) {
                  good = true;
                } else if (r.required_armor_types.includes("Any")) {
                  good = this.props.obj.equipped_items.filter(o => 
                    o.base_item &&
                    o.base_item.item_type === "Armor" &&
                    o.base_item.name !== "Shield"
                  ).length > 0;
                } else {
                  const missing_armor_types = r.required_armor_types.filter(a =>
                    this.props.obj.equipped_items.filter(o =>
                      o.base_item &&
                      o.base_item.item_type === "Armor" &&
                      o.base_item.armor_type_id === a).length === 0);
                  good = missing_armor_types.length === 0;
                }
              } else if (r.allowed_armor_types.includes("None")) {
                good = this.props.obj.equipped_items.filter(o => 
                  o.base_item &&
                  o.base_item.item_type === "Armor" &&
                  o.base_item.name !== "Shield"
                ).length === 0;
              } else {
                const bad_armor_items = this.props.obj.equipped_items.filter(o =>
                  o.base_item &&
                  o.base_item.item_type === "Armor" &&
                  !r.allowed_armor_types.includes(o.base_item.armor_type_id));
      
                good = bad_armor_items.length === 0;
              }
              if (good) {
                if (!r.required_weapon_keywords.includes("None")) {
                } else if (!r.allowed_damage_types.includes("All")) {
                  good = false;
                  for (let i = 0; i < damage_rolls.length; ++i) {
                    if (r.allowed_damage_types.includes(damage_rolls[i].type)) {
                      good = true;
                      break;
                    }
                  }
                }
                rerolls.push(r);
              }
            });
            if (["Healing","Temp HP","Max HP"].includes(ability.effect_string)) {
              return (
                <Roller 
                  name={ability.name}
                  char={this.props.obj}
                  rolls={damage_rolls} 
                  rerolls={rerolls}
                  type={ability.effect_string} 
                />
              );
            } else {
              return (
                <Roller 
                  name={ability.name}
                  char={this.props.obj}
                  rolls={damage_rolls} 
                  rerolls={rerolls}
                  type="Damage" 
                />
              );
            }
          }
        } else if (ability.the_ability instanceof Ability) {
          if (mode === "Attack") {
            return (
              <Roller 
                name={ability.name}
                char={this.props.obj}
                rolls={ability.attack.attack_rolls} 
                type="Attack" 
              />
            );
          } else if (mode === "Damage") {
            const level = this.state.popoverActionLevel;
            const potence = ability.get_potence(level, this.props.obj);
            let damage_rolls: RollPlus[] = [];
            if (potence) {
              const roll_plus = new RollPlus(potence.rolls);
              damage_rolls.push(roll_plus);
            }
            damage_rolls = [...damage_rolls,...ability.attack.damage_rolls];
            
            const rerolls: Reroll[] = [];
            this.props.obj.rerolls.forEach(r => {
              let good = false;
              if (r.allowed_armor_types.includes("All")) {
                // Check for required
                if (r.required_armor_types.includes("None")) {
                  good = true;
                } else if (r.required_armor_types.includes("Any")) {
                  good = this.props.obj.equipped_items.filter(o => 
                    o.base_item &&
                    o.base_item.item_type === "Armor" &&
                    o.base_item.name !== "Shield"
                  ).length > 0;
                } else {
                  const missing_armor_types = r.required_armor_types.filter(a =>
                    this.props.obj.equipped_items.filter(o =>
                      o.base_item &&
                      o.base_item.item_type === "Armor" &&
                      o.base_item.armor_type_id === a).length === 0);
                  good = missing_armor_types.length === 0;
                }
              } else if (r.allowed_armor_types.includes("None")) {
                good = this.props.obj.equipped_items.filter(o => 
                  o.base_item &&
                  o.base_item.item_type === "Armor" &&
                  o.base_item.name !== "Shield"
                ).length === 0;
              } else {
                const bad_armor_items = this.props.obj.equipped_items.filter(o =>
                  o.base_item &&
                  o.base_item.item_type === "Armor" &&
                  !r.allowed_armor_types.includes(o.base_item.armor_type_id));
      
                good = bad_armor_items.length === 0;
              }
              if (good) {
                if (!r.required_weapon_keywords.includes("None")) {
                } else if (!r.allowed_damage_types.includes("All")) {
                  good = false;
                  for (let i = 0; i < damage_rolls.length; ++i) {
                    if (r.allowed_damage_types.includes(damage_rolls[i].type)) {
                      good = true;
                      break;
                    }
                  }
                }
                rerolls.push(r);
              }
            });
            if (["Healing","Temp HP","Max HP"].includes(ability.effect_string)) {
              return (
                <Roller 
                  name={ability.name}
                  char={this.props.obj}
                  rolls={damage_rolls} 
                  rerolls={rerolls}
                  type={ability.effect_string} 
                />
              );
            } else {
              return (
                <Roller 
                  name={ability.name}
                  char={this.props.obj}
                  rolls={damage_rolls} 
                  rerolls={rerolls}
                  type="Damage" 
                />
              );
            }
          }
        }
      }
    }
    return null;
  }

  setPopoverAnchorEl(el: HTMLDivElement | null) {
    this.setState({ popoverAnchorEl: el });
  }
}

export default connector(CharacterAction);
