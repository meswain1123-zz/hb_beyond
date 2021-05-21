import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  ExpandMore
} from "@material-ui/icons";
import {
  Grid, 
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@material-ui/core";

import { 
  Character,
  CharacterItem,
  BaseItem,
  MagicItem,
  MagicItemKeyword,
  WeaponKeyword,
  ArmorType,
} from "../../../models";
import { 
  ITEM_TYPES 
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import CheckBox from "../../input/CheckBox";
import ToggleButtonBox from "../../input/ToggleButtonBox";

import ViewItem from "../ViewItem";

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
  armor_types: ArmorType[] | null;
  weapon_keywords: WeaponKeyword[] | null;
  base_items: BaseItem[] | null;
  magic_items: MagicItem[] | null;
  magic_item_keywords: MagicItemKeyword[] | null;
  loading: boolean;
  search_string: string;
  view: string;
  proficient: boolean;
  common: boolean;
  magical: boolean;
  item_types: string[];
}

class CharacterManageEquipment extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      armor_types: null,
      weapon_keywords: null,
      base_items: null,
      magic_items: null,
      magic_item_keywords: null,
      loading: false,
      search_string: "",
      view: "",
      proficient: false,
      common: false,
      magical: false,
      item_types: []
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["armor_type","base_item","magic_item","magic_item_keyword","weapon_keyword"]).then((res: any) => {
        const base_items: BaseItem[] = res.base_item;
        const magic_items: MagicItem[] = res.magic_item;
        this.setState({ 
          armor_types: res.armor_type,
          weapon_keywords: res.weapon_keyword,
          base_items,
          magic_items,
          magic_item_keywords: res.magic_item_keyword,
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading || this.state.base_items === null) {
      return <span>Loading</span>;
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
              minHeight: "800px",
              width: "316px",
              overflowX: "hidden"
            }}>
            <Grid item style={{ fontSize: "18px", fontWeight: "bold", width: "316px" }}>
              Manage Equipment
            </Grid>
            <Grid item style={{ width: "316px" }}>
              <Accordion>
                <AccordionSummary 
                  style={{
                    backgroundColor: "lightgray",
                    color: "black",
                    fontWeight: "bold",
                    height: "30px"
                  }}
                  expandIcon={<ExpandMore />}>
                  Add Items
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{
                    width: "100%"
                  }}>
                    <Grid container spacing={1} direction="column">
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
                        { ITEM_TYPES.map((type, key) => (
                          <Grid item xs={3} key={key}>
                            <ToggleButtonBox
                              fontSize={8}
                              height={16}
                              lineHeight={2.3}
                              name={type}
                              value={this.state.item_types.includes(type)}
                              onToggle={() => {
                                let item_types = this.state.item_types;
                                if (item_types.includes(type)) {
                                  item_types = item_types.filter(t => t !== type);
                                } else {
                                  item_types.push(type);
                                }
                                this.setState({ item_types });
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                      <Grid item container spacing={0} direction="row">
                        <Grid item xs={6}>
                          <ToggleButtonBox 
                            name="Proficient"
                            value={this.state.proficient}
                            onToggle={() => {
                              this.setState({ proficient: !this.state.proficient });
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <ToggleButtonBox 
                            name="Magical"
                            value={this.state.magical}
                            onToggle={() => {
                              this.setState({ magical: !this.state.magical });
                            }}
                          />
                        </Grid>
                      </Grid>
                      { this.renderItems() }
                    </Grid>
                  </div>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item style={{ width: "316px" }}>
              <Accordion>
                <AccordionSummary
                  style={{
                    backgroundColor: "lightgray",
                    color: "black",
                    fontWeight: "bold"
                  }}
                  expandIcon={<ExpandMore />}>
                  Inventory
                </AccordionSummary>
                <AccordionDetails>
                  { this.renderInventory() }
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </div>
      );
    }
  }

  renderItems() {
    if (this.state.base_items && this.state.magic_items) {
      let filtered_base_items = this.state.magical ? [] : this.state.base_items;
      let filtered_magic_items = this.state.magic_items;
      if (this.state.search_string.length > 0) {
        filtered_base_items = filtered_base_items.filter(o => o.name.toLowerCase().includes(this.state.search_string.toLowerCase()));
        filtered_magic_items = filtered_magic_items.filter(o => o.name.toLowerCase().includes(this.state.search_string.toLowerCase()));
      }
      if (this.state.item_types.length > 0) {
        filtered_base_items = filtered_base_items.filter(o => this.state.item_types.includes(o.item_type));
        filtered_magic_items = filtered_magic_items.filter(o => o.base_item && this.state.item_types.includes(o.base_item.item_type));
      }
      if (this.state.proficient) {
        const obj = this.props.obj;
        const no_prof_required_types = ["Ammunition","Potion","Ring","Rod","Scroll","Staff","Wand","Wondrous","Other","Holy Symbol","Arcane Focus","Druidic Focus"];
        const tool_types = ["Artisan's Tools","Game Set","Instrument","Vehicles"];

        filtered_base_items = filtered_base_items.filter(o => 
          no_prof_required_types.includes(o.item_type) ||
          (tool_types.includes(o.item_type) && obj.tool_proficiencies[o.tool_id]) ||
          (o.item_type === "Armor" && obj.armor_proficiencies.includes(o.armor_type_id)) ||
          (o.item_type === "Weapon" && (this.findAnyCommonality(obj.weapon_proficiencies, o.weapon_keyword_ids) || obj.special_weapon_proficiencies.includes(o._id))));
        
        filtered_magic_items = filtered_magic_items.filter(o => o.base_item_id && o.base_item &&
          (no_prof_required_types.includes(o.base_item.item_type) ||
          tool_types.includes(o.base_item.item_type) ||
          (o.base_item.item_type === "Armor" && obj.armor_proficiencies.includes(o.base_item.armor_type_id)) ||
          (o.base_item.item_type === "Weapon" && (this.findAnyCommonality(obj.weapon_proficiencies, o.base_item.weapon_keyword_ids) || obj.special_weapon_proficiencies.includes(o.base_item_id)))));
      }

      if ((filtered_base_items.length + filtered_magic_items.length) < 100) {
        return (
          <Grid item container spacing={0} direction="column">
            { filtered_base_items.map((item, key) => {
              return (
                <Grid item key={key} container spacing={0} direction="row">
                  <Grid item xs={9} container spacing={0} direction="column">
                    <ViewItem item={item} />
                  </Grid>
                  <Grid item xs={3} style={{ margin: "auto" }}>
                    <div style={{
                      cursor: "pointer",
                      backgroundColor: "blue",
                      borderRadius: "5px",
                      color: "white",
                      textAlign: "center"
                    }} onClick={() => {
                      this.addItem(item);
                    }}>
                      Add
                    </div>
                  </Grid>
                </Grid>
              );
            })}
            { filtered_magic_items.map((item, key) => {
              return (
                <Grid item key={key} container spacing={0} direction="row">
                  <Grid item xs={9} container spacing={0} direction="column">
                    <ViewItem item={item} />
                  </Grid>
                  <Grid item xs={3} style={{ margin: "auto" }}>
                    <div style={{
                      cursor: "pointer",
                      backgroundColor: "blue",
                      borderRadius: "5px",
                      color: "white",
                      textAlign: "center"
                    }} onClick={() => {
                      this.addItem(item);
                    }}>
                      Add
                    </div>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        );
      } else {
        return (<Grid item>Too many results</Grid>);
      }
    } else {
      return (<span></span>);
    }
  }
  
  addItem(item: BaseItem | MagicItem) {
    const obj = this.props.obj;
    obj.add_item(item);
    this.api.updateObject("character", obj).then((res: any) => {
      this.props.onChange();
    });
  }
  
  removeItem(item: CharacterItem) {
    const obj = this.props.obj;
    obj.remove_item(item);
    this.api.updateObject("character", obj).then((res: any) => {
      this.props.onChange();
    });
  }

  findAnyCommonality(arr1: string[], arr2: string[]) {
    let found = false;
    if (arr1.length < arr2.length) {
      for (let i = 0; i < arr1.length; ++i) {
        if (arr2.includes(arr1[i])) {
          found = true;
          break;
        }
      }
    } else {
      for (let i = 0; i < arr2.length; ++i) {
        if (arr1.includes(arr2[i])) {
          found = true;
          break;
        }
      }
    }

    return found;
  }

  renderInventory() {
    return (
      <Grid item container spacing={1} direction="column">
        { this.props.obj.items.map((item, key) => {
          return (
            <Grid item key={key} container spacing={0} direction="row">
              <Grid item xs={2}>
                { item.base_item && 
                  (item.base_item.item_type === "Armor" || 
                    item.base_item.item_type === "Weapon") ? 
                  <CheckBox 
                    name=""
                    value={item.equipped} 
                    onChange={(value: boolean) => {
                      const obj = this.props.obj;
                      if (value) {
                        obj.equip_item(item);
                      } else {
                        obj.unequip_item(item);
                      }
                      this.api.updateObject("character", obj).then((res: any) => {
                        this.props.onChange();
                      });
                    }} 
                  />
                :
                  <span>--</span>
                }
              </Grid>
              <Grid item xs={8} container spacing={0} direction="column">
                <ViewItem item={item} />
              </Grid>
              <Grid item xs={2}>
                <div style={{
                  cursor: "pointer",
                  backgroundColor: "blue",
                  borderRadius: "5px",
                  color: "white",
                  textAlign: "center"
                }} onClick={() => {
                  this.removeItem(item);
                }}>
                  Remove
                </div>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default connector(CharacterManageEquipment);
