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
  CharacterSlot,
  Spell,
  INumHash,
} from "../../../models";

import StringBox from "../../input/StringBox";
import ToggleButtonBox from "../../input/ToggleButtonBox";
import ButtonBox from "../../input/ButtonBox";
import CharacterManageSpells from "./CharacterManageSpells";
import CheckBox from '../../input/CheckBox';
import CharacterAction from "./CharacterAction";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";
import DataUtilities from "../../../utilities/data_utilities";
import { DataUtilitiesClass } from "../../../utilities/data_utilities_class";

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
      view: "All",
      edit_view: "",
      selected_spell: null,
      selected_level: null,
      spells: null,
      levels: {},
      concentration: false,
      ritual: false,
    };
    this.api = API.getInstance();
    this.data_util = DataUtilities.getInstance();
  }

  api: APIClass;
  data_util: DataUtilitiesClass;

  componentDidMount() {
  }

  resetSearch() {
    const search_filtered = [...this.props.obj.spells, ...this.props.obj.spell_as_abilities].filter(o => o.name.toLowerCase().includes(this.state.search_string.toLowerCase()));
    const levels: INumHash = {};
    let concentration = false;
    let ritual = false;
    if (search_filtered.filter(o => o.level === 0).length > 0) {
      levels[0] = 1;
    }
    this.props.obj.slots.forEach(o => {
      if (!levels[o.level]) {
        levels[o.level] = 1;
      }
    });
    search_filtered.forEach(o => {
      if (o.spell) {
        if (o.spell.concentration) {
          concentration = true;
        }
        if (o.spell.ritual) {
          ritual = true;
        }
        if ((o.at_will || o.ritual_only) && !levels[o.level]) {
          levels[o.level] = 1;
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
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.spells === null) {
      this.load();
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
              this.setState({ drawer: "" });
            }}>
            <CharacterManageSpells
              obj={this.props.obj}
              onChange={() => {
                this.setState({ reloading: true }, () => {
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
        <Grid item xs={3} container spacing={0} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              &nbsp;
            </Grid>
            <Grid item xs={2}>
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
            <Grid item xs={4}>
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
            <Grid item xs={3}>
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
          </Grid>
          { classes.map((char_class, key) => {
            let modifier = this.props.obj.current_ability_scores.getModifier(char_class.spellcasting_ability);
            if (!modifier) {
              // Will never come here, but it makes the type happy.
              modifier = 0;
            }
            return (
              <Grid item key={key} container spacing={1} direction="row">
                <Grid item xs={3}>
                  { char_class.game_class && char_class.game_class.name }
                </Grid>
                <Grid item xs={2}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left"
                    }}>
                    <div 
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        textAlign: "center"
                      }}>
                      { this.data_util.add_plus_maybe(modifier) }
                    </div>
                  </div>
                </Grid>
                <Grid item xs={4}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left"
                    }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        textAlign: "center"
                      }}>
                      { this.data_util.add_plus_maybe(char_class.spell_attack) }
                    </div>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left"
                    }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "bold",
                        textAlign: "center"
                      }}>
                      { char_class.spell_dc }
                    </div>
                  </div>
                </Grid>
              </Grid>
            );
          })}
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
    const return_me: any[] = [
      <span key="All">
        <ToggleButtonBox 
          name="All"
          height={15}
          lineHeight={1.5}
          border=""
          color="gray"
          width={30}
          bold
          value={this.state.view === "All"}
          onToggle={() => {
            this.setState({ view: "All" });
          }}
        />
      </span>,
      ...Object.keys(this.state.levels).map((level, key) => (
        <span key={key}>
          <ToggleButtonBox 
            name={`${level}`}
            height={15}
            lineHeight={1.5}
            border=""
            color="gray"
            width={30}
            bold
            value={this.state.view === `${level}`}
            onToggle={() => {
              this.setState({ view: `${level}` });
            }}
          />
        </span>
      ))
    ];
    if (this.state.concentration){
      return_me.push(
        <span key="concentration">
          <ToggleButtonBox 
            name=" C "
            height={15}
            lineHeight={1.5}
            border=""
            color="gray"
            width={30}
            bold
            value={this.state.view === "C"}
            onToggle={() => {
              this.setState({ view: "C" });
            }}
          />
        </span>
      );
    }
    if (this.state.ritual) {
      return_me.push(
        <span key="ritual">
          <ToggleButtonBox 
            name=" R "
            height={15}
            lineHeight={1.5}
            border=""
            color="gray"
            width={30}
            bold
            value={this.state.view === "R"}
            onToggle={() => {
              this.setState({ view: "R" });
            }}
          />
        </span>
      );  
    }
    return return_me;
  }

  renderSpellGroups() {
    let filtered = [...this.props.obj.spells, ...this.props.obj.spell_as_abilities, ...this.props.obj.ritual_only];
    if (this.state.search_string.length > 0) {
      filtered = filtered.filter(o => 
        o.name.toLowerCase().includes(this.state.search_string.toLowerCase()));
    }
    if (this.state.view !== "All") {
      if (this.state.view === "C") {
        filtered = filtered.filter(o => o.spell && o.spell.concentration);
      } else if (this.state.view === "R") {
        filtered = filtered.filter(o => o.spell && o.spell.ritual);
      } else {
        filtered = filtered.filter(o => o.spell && o.spell.level === +this.state.view);
      }
    }
    // Render them by level
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

  renderSpellsForLevelHead(filtered: (CharacterSpell | CharacterAbility)[], level: number) {
    const slots = this.props.obj.slots.filter(o => o.level === level);
    if (slots.length > 0 || (level === 0 && filtered.filter(o => o.level === level).length > 0)) {
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
    const slots = this.props.obj.slots.filter(o => o.level === level);
    const types = slots.map(o => o.slot_name).sort((a,b) => {return a.localeCompare(b)});
    return (
      <Grid item xs={6}>
        <div style={{ float: "right" }}>
          { types.map((slot_name, key) => {
            return (
              <span key={key}>
                { this.renderSlotsForLevelForType(slots.filter(o => o.slot_name === slot_name)) }
                <div style={{ display: "inline", fontSize: "15px", verticalAlign: "top" }}>{ slot_name }&nbsp;</div>
              </span>
            );
          })}
        </div>
      </Grid>
    );
  }

  renderSlotsForLevelForType(slots: CharacterSlot[]) {
    const return_me: any[] = [];
    if (slots.length === 1) {
      const slot = slots[0];
      let used = 0;
      for (let i = 0; i < slot.total; ++i) {
        let isUsed = false;
        if (used < slot.used) {
          isUsed = true;
          used++;
        }
        return_me.push(
          <CheckBox key={i}
            name=""
            value={isUsed}
            onChange={(changed: boolean) => {
              if (changed) {
                slot.used++;
              } else {
                slot.used--;
              }
              this.setState({ }, () => {
                this.api.updateObject(this.props.obj).then((res: any) => {
                  if ((changed && slot.used === slot.total) || (!changed && slot.used === slot.total - 1)) {
                    // Reload to make the cast buttons enabled/disabled appropriately
                    this.setState({ reloading: true }, () => {
                      this.setState({ reloading: false });
                    });
                  }
                });
              });
            }}
          />
        );
      }
    }
    return return_me;
  }

  renderSpellsForLevelBody(filtered: (CharacterSpell | CharacterAbility)[], level: number) {
    let level_filtered: (CharacterSpell | CharacterAbility)[] = [];
    if (level === 0) {
      level_filtered = filtered.filter(o => 
        o.level === level).sort((a,b) => { 
          return a.name < b.name ? -1 : 1;
        });
    } else {
      level_filtered = filtered.filter(o => 
        ((o.at_will || o.ritual_only) && o.level === level) ||
        (!o.at_will && !o.ritual_only && o.level > 0 && o.level <= level)).sort((a,b) => { 
          return a.name < b.name ? -1 : 1;
        });
    }
    return level_filtered.map((spell, key) => {
      if (this.state.reloading) {
        return (<span key={key}></span>);
      } else {
        return (
          <CharacterAction 
            key={key}
            obj={this.props.obj}
            level={level}
            action={spell}
            group={""}
            show_casting_time
            onChange={() => {
              this.props.onChange();
              this.setState({ reloading: true }, () => {
                this.setState({ reloading: false });
              });
            }}
          />
        );
      }
    });
  }
}

export default connector(CharacterSpells);
