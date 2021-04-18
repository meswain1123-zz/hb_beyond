import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import {
//   ExpandMore
// } from "@material-ui/icons";
import {
  Grid, 
  // Accordion,
  // AccordionSummary,
  // AccordionDetails
} from "@material-ui/core";

import { 
  Character,
  // Creature,
  CharacterClass,
  Spell,
  SpellList
} from "../../../models";
import { 
  SCHOOLS
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
// import SelectStringBox from "../../input/SelectStringBox";
// import CheckBox from "../../input/CheckBox";
import ToggleButtonBox from "../../input/ToggleButtonBox";

import ViewSpell from "../ViewSpell";

import ButtonBox from '../../input/ButtonBox';

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
  spells: Spell[] | null;
  spell_lists: SpellList[] | null;
  my_spell_lists: any;
  my_always_known: any;
  // my_book_spells: any;
  // my_prepared_spells: any;
  loading: boolean;
  reloading: boolean;
  search_string: string;
  view: string;
  levels: number[];
  schools: string[];
  concentration: boolean | null;
  ritual: boolean | null;
  selected_class: CharacterClass | null;
}

class CharacterManageSpells extends Component<Props, State> {
  // public static defaultProps = {
  //   value: null,
  // };
  constructor(props: Props) {
    super(props);
    
    this.state = {
      spells: null,
      spell_lists: null,
      my_spell_lists: {},
      my_always_known: {},
      // my_book_spells: {},
      // my_prepared_spells: {},
      loading: false,
      reloading: false,
      search_string: "",
      view: "",
      levels: [],
      schools: [],
      concentration: null,
      ritual: null,
      selected_class: props.obj instanceof Character ? props.obj.classes.filter(o => o.position === 0)[0] : null
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["spell","spell_list"]).then((res: any) => {
        const spells: Spell[] = res.spell;
        const spell_lists: SpellList[] = res.spell_list;
        const my_spell_lists: any = {};
        const my_always_known: any = {};
        // const my_book_spells: any = {};
        // const my_prepared_spells: any = {};
        
        if (this.props.obj instanceof Character) {
          this.props.obj.classes.forEach(char_class => {
            const sl_finder = spell_lists.filter(o => o._id === char_class.spell_list_id);
            if (sl_finder.length === 1) {
              const list = sl_finder[0];
              let bonus_spells: Spell[] = [];
              let always_known: Spell[] = [];
              let list_spells = spells.filter(o => 
                list.spell_ids.includes(o._id) && 
                (!o.level || o.level <= char_class.spell_level_max));
              char_class.bonus_spells.forEach(bs => {
                const bspells = spells.filter(o => 
                  Object.keys(bs.spell_ids).includes(o._id) && 
                  bs.spell_ids[o._id] <= char_class.level && 
                  (!o.level || o.level <= char_class.spell_level_max));
                bonus_spells = [...bonus_spells,...bspells.filter(o => list_spells.filter(o2 => o2._id === o._id).length === 0)];
                if (bs.always_known) {
                  always_known = [...always_known,...bspells];
                }
              });
              list_spells = [...list_spells,...bonus_spells];
              my_spell_lists[char_class.game_class_id] = list_spells;
              my_always_known[char_class.game_class_id] = always_known;
            }
          });
        }
        this.setState({ 
          my_spell_lists,
          my_always_known,
          // my_book_spells,
          // my_prepared_spells,
          spells,
          spell_lists,
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span style={{ width: "324px" }}>Loading</span>;
    } else if (this.state.spells === null) {
      this.load();
      return <span style={{ width: "324px" }}>Loading</span>;
    } else { 
      return (
        <div 
          style={{ 
            backgroundColor: "white",
            color: "black",
            border: "1px solid blue",
            height: "800px",
            width: "324px",
            overflowX: "hidden",
            padding: "4px",
            fontSize: "11px"
          }}>
          <Grid container spacing={1} direction="column"
            style={{ 
              backgroundColor: "white",
              color: "black",
              // border: "1px solid blue",
              minHeight: "800px",
              width: "316px",
              // overflowX: "hidden"
            }}>
            <Grid item style={{ fontSize: "18px", fontWeight: "bold", width: "316px" }}>
              Manage Spells
            </Grid>
            { this.renderMagicalClasses() }
            <Grid item container spacing={1} direction="column">
              <Grid item>
                <StringBox
                  name="Filter"
                  value={ this.state.search_string }
                  onChange={(search_string: string) => {
                    this.setState({ search_string });
                  }}
                />
              </Grid>
              <Grid item container spacing={0} direction="row">
                { SCHOOLS.map((school, key) => (
                  <Grid item xs={3} key={key}>
                    <ToggleButtonBox
                      fontSize={8}
                      height={16}
                      lineHeight={2.3}
                      name={school}
                      value={this.state.schools.includes(school)}
                      onToggle={() => {
                        let schools = this.state.schools;
                        if (schools.includes(school)) {
                          schools = schools.filter(s => s !== school);
                        } else {
                          schools.push(school);
                        }
                        this.setState({ schools });
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid item container spacing={0} direction="row">
                <Grid item xs={6}>
                  <ToggleButtonBox 
                    name={ this.state.concentration === null ? "Ignore Concentration" : (this.state.concentration ? "Concentration Only" : "No Concentration Only")}
                    value={this.state.concentration === null ? false : this.state.concentration}
                    onToggle={() => {
                      this.setState({ concentration: (this.state.concentration === null ? true : (this.state.concentration ? false : null)) });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <ToggleButtonBox 
                    name={ this.state.ritual === null ? "Ignore Ritual" : (this.state.ritual ? "Ritual Only" : "No Ritual Only")}
                    value={this.state.ritual === null ? false : this.state.ritual}
                    onToggle={() => {
                      this.setState({ ritual: (this.state.ritual === null ? true : (this.state.ritual ? false : null)) });
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item container spacing={0} direction="row">
                { this.renderLevels() }
              </Grid>
              { this.renderSpellsForClass() }
            </Grid>
          </Grid>
        </div>
      );
    }
  }

  renderMagicalClasses() {
    const return_me: any[] = [];
    if (this.props.obj instanceof Character && this.state.selected_class) {
      this.props.obj.classes.filter(o => o.spellcasting_ability !== "").forEach(char_class => {
        if (char_class.game_class) {
          return_me.push(
            <Grid item key={char_class.position} style={{ width: "316px" }}>
              <ToggleButtonBox 
                name={ char_class.game_class.name }
                value={ this.state.selected_class !== null && this.state.selected_class.game_class_id === char_class.game_class_id }
                onToggle={() => {
                  this.setState({ selected_class: char_class });
                }}
              />
            </Grid>
          );
        }
      });
    }
    return return_me;
  }

  renderLevels() {
    const return_me: any[] = [];
    for (let level = 0; level < 10; ++level) {
      return_me.push(
        <Grid item xs={ level < 4 ? 3 : 2} key={level}>
          <ToggleButtonBox 
            name={`${level}`}
            height={15}
            lineHeight={1.5}
            // border=""
            // color="gray"
            // width={30}
            // bold
            value={this.state.levels.includes(level)}
            onToggle={() => {
              let levels = this.state.levels;
              if (levels.includes(level)) {
                levels = levels.filter(l => l !== level);
              } else {
                levels.push(level);
              }
              this.setState({ levels });
            }}
          />
        </Grid>
      );
    }
    return return_me;
  }

  renderSpellsForClass() {
    // Need to make it use spell lists and bonus spells
    // Also Change Add Button to be appropriate
    const char_class = this.state.selected_class;
    if (char_class) {
      const list: Spell[] = this.state.my_spell_lists[char_class.game_class_id];
      if (list) {
        let filtered = [...list];

        if (this.state.search_string.length > 0) {
          filtered = filtered.filter(o => o.name.toLowerCase().includes(this.state.search_string.toLowerCase()));
        }
        if (this.state.levels.length > 0) {
          filtered = filtered.filter(o => this.state.levels.includes(o.level));
        }
        if (this.state.concentration === null) {

        } else if (this.state.concentration === true) {
          filtered = filtered.filter(o => o.concentration === true);
        } else {
          filtered = filtered.filter(o => o.concentration === undefined || o.concentration === false);
        }
        if (this.state.ritual === null) {

        } else if (this.state.ritual === true) {
          filtered = filtered.filter(o => o.ritual === true);
        } else {
          filtered = filtered.filter(o => o.ritual === undefined || o.ritual === false);
        }
        if (this.state.schools.length > 0) {
          filtered = filtered.filter(o => o.school && this.state.schools.includes(o.school));
        }

        if (filtered.length < 100) {
          const always_known: Spell[] = this.state.my_always_known[char_class.game_class_id];
          return (
            <Grid item container spacing={0} direction="column">
              { filtered.sort((a,b) => { 
                if (a.level === b.level) {
                  return a.name < b.name ? -1 : 1;
                }
                return a.level - b.level; 
              }).map((spell, key) => {
                return (
                  <Grid item key={key} container spacing={0} direction="row">
                    <Grid item xs={9} container spacing={0} direction="column">
                      <ViewSpell spell={spell} 
                        show_level 
                        show_ritual={char_class.ritual_casting} 
                      />
                    </Grid>
                    <Grid item xs={3} style={{ margin: "auto" }}>
                      { !this.state.reloading && always_known.filter(o => o._id === spell._id).length > 0 ?
                        <ButtonBox
                          name="Always Known"
                          fontSize={10}
                          lineHeight={1.3}
                          disabled
                          onClick={() => {
                          }}
                        />
                      : !this.state.reloading && ((spell.level === 0 && !char_class.cantrip_ids.includes(spell._id)) || (spell.level > 0 && !char_class.spell_ids.includes(spell._id)))  ?
                        <ButtonBox
                          name="Add"
                          disabled={ 
                            (spell.level === 0 && 
                              (char_class.cantrips_max <= char_class.cantrip_ids.length)) || 
                            (spell.level > 0 && 
                              (char_class.spells_prepared_max <= char_class.spell_ids.length)) 
                          }
                          onClick={() => {
                            this.addSpell(spell, char_class);
                          }}
                        />
                      : !this.state.reloading && 
                        <ButtonBox
                          name="Remove"
                          onClick={() => {
                            this.removeSpell(spell._id, char_class.game_class_id);
                          }}
                        />
                      }
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          );
        } else {
          return (<Grid item>Too many results</Grid>);
        }
      }
    }
    return (<Grid item></Grid>);
  }
  
  addSpell(spell: Spell, source: CharacterClass) {
    const obj = this.props.obj;
    if (obj instanceof Character) {
      obj.add_spell(spell, source);
      this.update(obj);
    }
  }
  
  removeSpell(spell_id: string, source_id: string) {
    const obj = this.props.obj;
    if (obj instanceof Character) {
      obj.remove_spell(spell_id, "Class", source_id);
      this.update(obj);
    }
  }

  update(obj: Character) {
    this.api.updateObject(obj).then((res: any) => {
      this.setState({ });
    });
  }
}

export default connector(CharacterManageSpells);
