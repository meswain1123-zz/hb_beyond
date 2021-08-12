import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
  Drawer,
} from "@material-ui/core";

import { 
  Character,
  CharacterSpell,
  CharacterAbility,
  Spell,
  SpellAsAbility,
  INumHash,
  CharacterAction
} from "../../../models";

import StringBox from "../../input/StringBox";
import ButtonBox from "../../input/ButtonBox";
import CenteredMenu from "../../input/CenteredMenu";

import CharacterManageSpells from "./CharacterManageSpells";
import CharacterActionInput from "./CharacterAction";
import CharacterResourceBoxes from "./CharacterResourceBoxes";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";
import DataUtilities from "../../../utilities/data_utilities";
import { DataUtilitiesClass } from "../../../utilities/data_utilities_class";
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
  onChange: (change_types: string[]) => void;
}

export interface State {
  loading: boolean;
  reloading: boolean;
  drawer: string;
  search_string: string;
  view: string;
  edit_view: string;
  selected_spell: CharacterSpell | CharacterAbility | null;
  selected_level: number | null;
  spells: Spell[] | null;
  levels: INumHash;
  concentration: boolean;
  ritual: boolean;
}

class CharacterSpells extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      reloading: false,
      drawer: "",
      search_string: "",
      view: "ALL",
      edit_view: "",
      selected_spell: null,
      selected_level: null,
      spells: null,
      levels: {},
      concentration: false,
      ritual: false,
    };
    this.api = API.getInstance();
    this.char_util = CharacterUtilities.getInstance();
    this.data_util = DataUtilities.getInstance();
  }

  api: APIClass;
  char_util: CharacterUtilitiesClass;
  data_util: DataUtilitiesClass;

  componentDidMount() {
    this.load();
  }

  resetSearch() {
    const search_filtered = [...this.props.obj.spells, ...this.props.obj.spell_as_abilities].filter(o => o.name.toLowerCase().includes(this.state.search_string.toLowerCase()));
    const levels: INumHash = {};
    let concentration = false;
    let ritual = false;
    if (search_filtered.filter(o => o.level.value === 0).length > 0) {
      levels[0] = 1;
    }
    this.props.obj.slots.forEach(slot => {
      if (!levels[slot.level.value]) {
        levels[slot.level.value] = 1;
      }
    });
    search_filtered.forEach(char_spell => {
      if (char_spell instanceof CharacterAbility) {
        levels[char_spell.level.value] = 1;
      } else if (char_spell.spell) {
        if (char_spell.spell.concentration) {
          concentration = true;
        }
        if (char_spell.spell.ritual) {
          ritual = true;
        }
        if ((char_spell.at_will || char_spell.ritual_only) && !levels[char_spell.level.value]) {
          levels[char_spell.level.value] = 1;
        }
      }
    });
    this.setState({ levels, concentration, ritual });
  }

  load() {
    this.api.getSetOfObjects(["spell"]).then((res: any) => {
      const spells: Spell[] = res.spell;
      
      this.setState({ 
        spells,
        loading: false 
      }, () => {
        this.resetSearch();
      });
    });
  }

  render() {
    if (this.state.loading || this.state.spells === null) {
      return <span>Loading</span>;
    } else { 
      return (
        <Grid item container spacing={1} direction="column" 
          style={{
            border: "1px solid blue",
            borderRadius: "5px",
            fontSize: "11px"
          }}>
          <Grid item container spacing={0} direction="row">
            { this.renderSpellStats() }
            <Grid item xs={6} container spacing={1} direction="column">
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
                  Spells
                </div>
              </Grid>
              <Grid item>
                <ButtonBox name="Manage Spells"
                  onClick={() => {
                    this.setState({ drawer: "manage" });
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={3}>
              &nbsp;
            </Grid>
          </Grid>
          <Grid item>
            <StringBox
              name="Search Spells"
              value={ this.state.search_string }
              onChange={(search_string: string) => {
                this.setState({ search_string }, () => {
                  this.resetSearch();
                });
              }}
            />
          </Grid>
          <Grid item>
            { this.renderSpells() }
          </Grid>
          <Drawer anchor="right" 
            open={ this.state.drawer === "manage" } 
            onClose={() => {
              this.setState({ drawer: "", reloading: true }, () => {
                this.char_util.recalcAll(this.props.obj);
                this.setState({ reloading: false }, () => {
                  this.resetSearch();
                });
              });
            }}>
            <CharacterManageSpells
              obj={this.props.obj}
              onChange={() => {
                this.setState({ reloading: true }, () => {
                  this.char_util.recalcAll(this.props.obj);
                  this.setState({ reloading: false }, () => {
                    this.resetSearch();
                  });
                });
              }}
            />
          </Drawer>
        </Grid>
      );
    }
  }

  renderSpellStats() {
    if (this.props.obj instanceof Character) {
      const classes = this.props.obj.classes.filter(o => o.spellcasting_ability !== "");
      return (
        <Grid item xs={3}>
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}>
            <span style={{ margin: "4px" }}>
              <Grid container spacing={0} direction="column">
                <Grid item>
                  &nbsp;
                </Grid>
                { classes.map((char_class, key) => {
                  return (
                    <Grid item key={key}
                      style={{
                        display: "flex",
                        justifyContent: "center"
                      }}>
                      { char_class.game_class && char_class.game_class.name }
                    </Grid>
                  );
                })}
              </Grid>
            </span>
            <span style={{ margin: "4px" }}>
              <Grid container spacing={0} direction="column">
                <Grid item>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left"
                    }}>
                    <div className={"small_label gray"}>
                      Modifier
                    </div>
                  </div>
                </Grid>
                { classes.map((char_class, key) => {
                  let modifier = this.props.obj.current_ability_scores.getModifier(char_class.spellcasting_ability);
                  if (!modifier) {
                    // Will never come here, but it makes the type happy.
                    modifier = 0;
                  }
                  return (
                    <Grid item key={key}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: "bold"
                      }}>
                        { this.data_util.add_plus_maybe(modifier) }
                    </Grid>
                  );
                })}
              </Grid>
            </span>
            <span style={{ margin: "4px" }}>
              <Grid container spacing={0} direction="column">
                <Grid item>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left"
                    }}>
                    <div className={"small_label gray"}>
                      Spell Attack
                    </div>
                  </div>
                </Grid>
                { classes.map((char_class, key) => {
                  let modifier = this.props.obj.current_ability_scores.getModifier(char_class.spellcasting_ability);
                  if (!modifier) {
                    // Will never come here, but it makes the type happy.
                    modifier = 0;
                  }
                  return (
                    <Grid item key={key}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: "bold"
                      }}>
                      { this.data_util.add_plus_maybe(char_class.spell_attack) }
                    </Grid>
                  );
                })}
              </Grid>
            </span>
            <span style={{ margin: "4px" }}>
              <Grid container spacing={0} direction="column">
                <Grid item>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left"
                    }}>
                    <div className={"small_label gray"}>
                      Save DC
                    </div>
                  </div>
                </Grid>
                { classes.map((char_class, key) => {
                  let modifier = this.props.obj.current_ability_scores.getModifier(char_class.spellcasting_ability);
                  if (!modifier) {
                    // Will never come here, but it makes the type happy.
                    modifier = 0;
                  }
                  return (
                    <Grid item key={key}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: "bold"
                      }}>
                      { char_class.spell_dc }
                    </Grid>
                  );
                })}
              </Grid>
            </span>
          </div>
        </Grid>
      );
    }
    return (<Grid item xs={3}>&nbsp;</Grid>);
  }

  renderSpells() {
    return [
      <div key={0}>
        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}>
          { this.renderSpellFilters() }
        </div>
      </div>,
      this.renderSpellGroups()
    ];
  }

  renderSpellFilters() {
    const options: string[] = [
      "ALL",
      ...Object.keys(this.state.levels).map((level, key) => (`${level}`))
    ];
    if (this.state.concentration) {
      options.push(" C ");
    }
    if (this.state.ritual) {
      options.push(" R ");  
    }
    return (
      <CenteredMenu
        options={options}
        selected={this.state.view}
        onSelect={(view: string) => {
          this.setState({ view });
        }}
      />
    );
  }

  renderSpellGroups() {
    let filtered = this.props.obj.actions.filter(o => ["Spell","Special Spell","Spell As Ability"].includes(o.type));// [...this.props.obj.spells, ...this.props.obj.spell_as_abilities, ...this.props.obj.ritual_only];
    if (this.state.search_string.length > 0) {
      filtered = filtered.filter(o => 
        o.name.toLowerCase().includes(this.state.search_string.toLowerCase()));
    }
    if (this.state.view !== "ALL") {
      if (this.state.view === " C ") {
        filtered = filtered.filter(o => o.action && (o.action instanceof CharacterSpell || o.action instanceof CharacterAbility) && o.action.spell && o.action.spell.concentration);
      } else if (this.state.view === " R ") {
        filtered = filtered.filter(o => o.action && (o.action instanceof CharacterSpell || o.action instanceof CharacterAbility) && o.action.spell && o.action.spell.ritual);
      } else {
        filtered = filtered.filter(o => o.action && (o.action instanceof CharacterSpell || o.action instanceof CharacterAbility) && o.action.spell && o.action.spell.level.value === +this.state.view);
      }
    }
    // Render them by level
    // Need to make it so SpellsAsAbilities 
    // that can be done sans slots 
    // show up at their appropriate level, 
    // so include them as well, 
    // even though they may not have slots of that level
    return (
      <div key="spell_groups">
        { Object.keys(this.state.levels).map((level, key) => {
          return (
            <div key={key}>
              { this.renderSpellsForLevelHead(filtered, +level) }
            </div>
          );
        })}
      </div>
    );
  }

  renderSpellsForLevelHead(filtered: CharacterAction[], level: number) {
    if (this.state.view === `${level}` || filtered.filter(o => o.level.value === level).length > 0) {
      return [
        <Grid key={level} container spacing={0} direction="row"
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "blue"
          }}>
          <Grid item xs={6}>
            <span style={{ margin: "4px" }}>
              { level === 0 ? "Cantrip" : `${level}` }
            </span>
          </Grid>
          { level > 0 && this.renderSlotsForLevel(level) }
        </Grid>,
        <Grid key={`${level}_header`} 
          style={{ fontWeight: "bold" }} 
          container spacing={0} 
          direction="row">
          <Grid item xs={1}>&nbsp;</Grid>
          <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>Name</Grid>
          <Grid item xs={1} style={{ display: "flex", justifyContent: "center" }}>Time</Grid>
          <Grid item xs={1} style={{ display: "flex", justifyContent: "center" }}>Range/Area</Grid>
          <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>Hit/DC</Grid>
          <Grid item xs={3} style={{ display: "flex", justifyContent: "center" }}>Effect</Grid>
        </Grid>,
        <div key={`${level}_body`}>
          { this.renderSpellsForLevelBody(filtered, level) }
        </div>
      ];
    }
    return null;
  }

  renderSlotsForLevel(level: number) {
    const slots = this.props.obj.slots.filter(o => o.level.value === level).sort((a,b) => {return a.slot_name.localeCompare(b.slot_name)});
    return (
      <Grid item xs={6}>
        <div style={{ float: "right" }}>
          { slots.map((slot, key) => {
            return (
              <span key={key}>
                <CharacterResourceBoxes 
                  resource={slot}
                  character={this.props.obj}
                  onChange={() => {
                    this.props.onChange(["Resources"]);
                  }}
                />
              </span>
            );
          })}
        </div>
      </Grid>
    );
  }

  renderSpellsForLevelBody(filtered: CharacterAction[], level: number) {
    let level_filtered: CharacterAction[] = [];
    if (level === 0 || this.props.obj.slots.filter(o => o.level.value === level).length > 0) {
      level_filtered = filtered.filter(o => 
        o.level.value === level);
      // filtered.forEach(o => {
      //   // if (o.name === "Tasha's Caustic Brew") {
      //   //   console.log(o);
      //   //   console.log(o.level.value);
      //   //   console.log(level);
      //   //   console.log(o.level.value === level);
      //   // }
      //   if (o.level.value === level) { 
      //     level_filtered.push(o);
      //   }
      // });
    } else {
      // console.log(level);
      level_filtered = filtered.filter(o => 
        o.level.value === level && 
        o.action instanceof CharacterAbility &&
        o.action.the_ability instanceof SpellAsAbility &&
        !["Normal","And Special Resource"].includes(o.action.the_ability.slot_override)
      );
      // filtered.forEach(o => {
      //   if (o.level.value === level) { 
      //     if (o.name === "Tasha's Caustic Brew") {
      //       console.log(o);
      //     }
      //     if (o.action instanceof CharacterAbility) {
      //       if (o.action.the_ability instanceof SpellAsAbility) {
      //         if (!["Normal","And Special Resource"].includes(o.action.the_ability.slot_override)) {
      //           level_filtered.push(o);
      //         }
      //       }
      //     }
      //   }
      // });
    }
    // console.log(level);
    // console.log(filtered);
    // console.log(level_filtered);
    return level_filtered.sort((a,b) => 
      { 
        return a.name < b.name ? -1 : 1;
      }).map((spell, key) => {
      if (this.state.reloading) {
        return (<span key={key}></span>);
      } else {
        return (
          <CharacterActionInput 
            key={key}
            character={this.props.obj}
            level={level}
            action={spell}
            group={""}
            show_casting_time
            onChange={(change_types: string[]) => {
              this.props.onChange(change_types);
              // this.setState({ reloading: true }, () => {
              //   this.setState({ reloading: false });
              // });
            }}
          />
        );
      }
    });
  }
}

export default connector(CharacterSpells);
