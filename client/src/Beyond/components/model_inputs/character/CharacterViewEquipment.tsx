import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import {
//   FontDownload
// } from "@material-ui/icons";
import {
  Grid, 
  Drawer,
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

import StringBox from "../../input/StringBox";
import CheckBox from "../../input/CheckBox";
import ToggleButtonBox from "../../input/ToggleButtonBox";

import CharacterManageEquipment from "./CharacterManageEquipment";
import ViewItem from "../ViewItem";

import CharacterItemDetails from './CharacterItemDetails';

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
  reloading: boolean;
  drawer: string;
  search_string: string;
  view: string;
  edit_view: string;
  selected_item: CharacterItem | null;
}

class CharacterViewEquipment extends Component<Props, State> {
  // public static defaultProps = {
  //   value: null,
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      armor_types: null,
      weapon_keywords: null,
      base_items: null,
      magic_items: null,
      magic_item_keywords: null,
      loading: false,
      reloading: false,
      drawer: "",
      search_string: "",
      view: "All",
      edit_view: "",
      selected_item: null
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["armor_type","base_item","magic_item","magic_item_keyword","weapon_keyword"]).then((res: any) => {
        // const armor_types: ArmorType[] = res.armor_type;
        // const weapon_keywords: WeaponKeyword[] = res.weapon_keyword;
          
        // const base_items: BaseItem[] = res.base_item;
        // base_items.forEach(item => {
        //   if (item.item_type === "Armor") {
        //     if (item.armor_type_name === "") {
        //       const obj_finder = armor_types.filter(o => o._id === item.armor_type_id);
        //       if (obj_finder.length === 1) {
        //         item.armor_type_name = obj_finder[0].name;
        //       }
        //     }
        //   } else if (item.item_type === "Weapon") {
        //     if (item.weapon_keyword_names.length === 0) {
        //       const obj_finder = weapon_keywords.filter(o => item.weapon_keyword_ids.includes(o._id) && o.display_in_equipment);
        //       obj_finder.forEach(kw => {
        //         item.weapon_keyword_names.push(kw.name);
        //       });
        //     }
        //   }
        // });
        // const magic_items: MagicItem[] = res.magic_item;
        // magic_items.forEach(item => {
        //   if (!item.base_item) {
        //     const obj_finder = base_items.filter(o => o._id === item.base_item_id);
        //     if (obj_finder.length === 1) {
        //       item.base_item = obj_finder[0];
        //     }
        //   }
        // });
        this.setState({ 
          armor_types: res.armor_type,
          weapon_keywords: res.weapon_keyword,
          base_items: res.base_item,
          magic_items: res.magic_item,
          magic_item_keywords: res.magic_item_keyword,
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.base_items === null) {
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
          <Grid item>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "bold"
              }}>
              <div>
                Equipment
              </div>
            </div>
          </Grid>
          <Grid item container spacing={1} direction="row">
            <Grid item xs={6}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "left"
                }}>
                <Grid container spacing={0} direction="column">
                  <Grid item 
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold"
                    }}>
                    Weight Carried: { this.props.obj.weight_carried } lb. 
                  </Grid>
                  <Grid item>
                    { this.props.obj.weight_carried > (this.props.obj.current_ability_scores.strength * 15) ?
                      "Over Carrying Capacity"
                    :
                      "Unencumbered"
                    }
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div
                style={{
                  float: "right",
                  fontSize: "13px",
                  fontWeight: "bold"
                }}>
                <div>
                  Currency: { this.renderCurrency() }
                </div>
              </div>
            </Grid>
          </Grid>
          <Grid item>
            <div
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              <div style={{
                fontSize: "11px", 
                height: "26px",
                border: "1px solid blue",
                color: "blue",
                margin: "4px",
                lineHeight: "2.5",
                textAlign: "center",
                cursor: "pointer",
                width: "125px"
              }} onClick={() => {
                this.setState({ drawer: "manage equipment" });
              }}>
                Manage Equipment
              </div>
            </div>
          </Grid>
          <Grid item>
            <StringBox
              name="Search Items"
              value={ this.state.search_string }
              onChange={(search_string: string) => {
                this.setState({ search_string });
              }}
            />
          </Grid>
          <Grid item>
            <div
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              <Grid container spacing={1} direction="row"
                style={{
                  width: "340px"
                }}>
                <Grid item xs={7} container spacing={1} direction="row">
                  <Grid item xs={3}>
                    <ToggleButtonBox 
                      name="All"
                      height={15}
                      lineHeight={1.5}
                      border=""
                      color="gray"
                      bold
                      value={this.state.view === "All"}
                      onToggle={() => {
                        this.setState({ view: "All" });
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <ToggleButtonBox 
                      name="Inventory"
                      height={15}
                      lineHeight={1.5}
                      border=""
                      color="gray"
                      bold
                      value={this.state.view === "Inventory"}
                      onToggle={() => {
                        this.setState({ view: "Inventory" });
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <ToggleButtonBox 
                      name="Attunement"
                      height={15}
                      lineHeight={1.5}
                      border=""
                      color="gray"
                      bold
                      value={this.state.view === "Attunement"}
                      onToggle={() => {
                        this.setState({ view: "Attunement" });
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={5}>
                  <ToggleButtonBox 
                    name="Other Possessions"
                    height={15}
                    lineHeight={1.5}
                    border=""
                    color="gray"
                    bold
                    value={this.state.view === "Other"}
                    onToggle={() => {
                      this.setState({ view: "Other" });
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          </Grid>
          { (this.state.view === "All" || this.state.view === "Inventory") &&
            this.renderInventory()
          }
          { (this.state.view === "All" || this.state.view === "Attunement") &&
            this.renderAttunement()
          }
          { (this.state.view === "All" || this.state.view === "Other") &&
            this.renderOtherPossessions()
          }
          <Drawer anchor="right" 
            open={ this.state.drawer === "manage equipment" } 
            onClose={() => {
              this.setState({ drawer: "" });
            }}>
            <CharacterManageEquipment
              obj={this.props.obj}
              onChange={() => {
                this.props.onChange();
              }}
            />
          </Drawer>
          <Drawer anchor="right" 
            open={ this.state.drawer === "details" } 
            onClose={() => {
              this.setState({ drawer: "" });
            }}>
            { this.state.selected_item &&
              <CharacterItemDetails
                obj={this.props.obj}
                item={this.state.selected_item}
                onChange={() => {
                  this.api.updateObject(this.props.obj).then((res: any) => {
                    this.props.onChange();
                    this.setState({ reloading: true }, () => {
                      this.setState({ reloading: false });
                    });
                  });
                }}
                onClose={() => {
                  this.setState({ drawer: "", selected_item: null });
                }}
              />
            }
          </Drawer>
        </Grid>
      );
    }
  }

  renderCurrency() {
    const money = this.props.obj.money;
    return money.map((m, key) => (
      <span key={key}>
        { key > 0 && ", " }
        { m.count }&nbsp;{ m.type }
      </span>
    ));
  }

  renderInventory() {
    const search_string = this.state.search_string.toLowerCase();
    const filtered = this.props.obj.items.filter(o => o._name.toLowerCase().includes(search_string) || (o.base_item && o.base_item.name.toLowerCase().includes(search_string)) || (o.magic_item && o.magic_item.name.toLowerCase().includes(search_string)));
    return (
      <Grid item container spacing={1} direction="column">
        <Grid item 
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "blue"
          }}>
          Inventory
        </Grid>
        <Grid item container spacing={0} direction="row">
          <Grid item xs={1}
            style={{
              fontWeight: "bold"
            }}>
            Active
          </Grid>
          <Grid item xs={7}
            style={{
              fontWeight: "bold"
            }}>
            Name
          </Grid>
          <Grid item xs={1}
            style={{
              fontWeight: "bold"
            }}>
            Weight
          </Grid>
          <Grid item xs={1}
            style={{
              fontWeight: "bold"
            }}>
            Qty
          </Grid>
          <Grid item xs={1}
            style={{
              fontWeight: "bold"
            }}>
            Cost (GP)
          </Grid>
          <Grid item xs={1}
            style={{
              fontWeight: "bold"
            }}>
            Worn Type
          </Grid>
        </Grid>
        { filtered.map((item, key) => {
          if (item.base_item) {
            return (
              <Grid item key={key} container spacing={0} direction="row">
                <Grid item xs={1}>
                  { !this.state.reloading && item.base_item && 
                    (item.base_item.item_type === "Armor" || 
                      item.base_item.item_type === "Weapon") ? 
                    <CheckBox 
                      name=""
                      value={item.equipped} 
                      disabled={ !item.equipped && item.base_item.item_type === "Armor" && ((item.base_item.armor_type_name === "Shield" && this.props.obj.shield_carried) || (item.base_item.armor_type_name !== "Shield" && this.props.obj.armor_worn)) }
                      onChange={(value: boolean) => {
                        const obj = this.props.obj;
                        if (value) {
                          obj.equip_item(item);
                        } else {
                          obj.unequip_item(item);
                        }
                        this.api.updateObject(obj).then((res: any) => {
                          this.props.onChange();
                        });
                      }} 
                    />
                  :
                    <span>--</span>
                  }
                </Grid>
                <Grid item xs={7} container spacing={0} direction="column" onClick={() => this.setState({ drawer: "details", selected_item: item })}>
                  {!this.state.reloading && <ViewItem item={item} /> }
                </Grid>
                <Grid item xs={1}>
                  { !this.state.reloading && <span>{ item.weight * item.count }</span> }
                </Grid>
                <Grid item xs={1}>
                  { !this.state.reloading && <span>{ item.count }</span> }
                </Grid>
                <Grid item xs={1}>
                  { !this.state.reloading && <span>{ item.cost * item.count }</span> }
                </Grid>
                { (!this.state.reloading && item.base_item.item_type === "Armor" && item.base_item.name === "Shield") ? 
                  <Grid item xs={1}>
                    Shield
                  </Grid>
                : !this.state.reloading && item.base_item.item_type === "Armor" ? 
                  <Grid item xs={1}>
                    Armor
                  </Grid>
                : !this.state.reloading && item.base_item.item_type === "Weapon" ?
                  <Grid item xs={1}>
                    Weapon
                  </Grid>
                : !this.state.reloading && 
                  <Grid item xs={1}>
                    { item.base_item.worn_type === "None" ? "--" : item.base_item.worn_type }
                  </Grid>
                }
              </Grid>
            );
          } else {
            return (<span key={key}></span>);
          }
        })}
      </Grid>
    );
  }

  renderAttunement() {
    return (
      <Grid item container spacing={1} direction="column">
        <Grid item
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "blue"
          }}>
          Attunement
        </Grid>
        <Grid item
          style={{
            fontWeight: "bold"
          }}>
          Attuned Items
        </Grid>
        { this.renderAttunedItems() }
        <Grid item
          style={{
            fontWeight: "bold"
          }}>
          Items Requiring Attunement
        </Grid>
        { this.renderItemsNeedingAttunement() }
      </Grid>
    );
  }

  renderAttunedItems() {
    const obj = this.props.obj;
    return obj.items.filter(o => o.attuned).map((item, key) => (
      <Grid item key={key} container spacing={0} direction="column">
        { !this.state.reloading && <ViewItem item={item} /> }
      </Grid>
    ));
  }

  renderItemsNeedingAttunement() {
    const obj = this.props.obj;
    const attuned_count = this.props.obj.items.filter(o => o.attuned).length;
    return obj.items.filter(o => o.magic_item && o.magic_item.attunement).map((item, key) => {
      if (item.base_item && item.magic_item) {
        return (
          <Grid item key={key} container spacing={0} direction="row">
            <Grid item xs={1}>
              { !this.state.reloading && (item.attuned || attuned_count < this.props.obj.max_attuned_items) ? 
                <CheckBox 
                  name=""
                  value={item.attuned} 
                  disabled={!item.attuned && this.props.obj.attuned_items.length >= this.props.obj.max_attuned_items}
                  onChange={(value: boolean) => {
                    const obj = this.props.obj;
                    if (value) {
                      obj.attune_item(item);
                    } else {
                      obj.unattune_item(item);
                    }
                    this.api.updateObject(obj).then((res: any) => {
                      this.props.onChange();
                    });
                  }} 
                />
              : !this.state.reloading && 
                <span>--</span>
              }
            </Grid>
            <Grid item xs={11} container spacing={0} direction="column">
              { !this.state.reloading && <ViewItem item={item} /> }
            </Grid>
          </Grid>
        );
      } else {
        return (<span key={key}></span>);
      }
    });
  }

  renderOtherPossessions() {
    return (
      <Grid item container spacing={1} direction="column">
        <Grid item
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "blue"
          }}>
          Other Possessions
        </Grid>
        { this.state.edit_view ? 
          <Grid item>
            <StringBox
              name=""
              multiline
              value={ this.props.obj.other_possessions }
              onBlur={(value: string) => {
                const obj = this.props.obj;
                obj.other_possessions = value;
                this.api.updateObject(obj).then((res: any) => {
                  this.setState({ edit_view: "" }, () => {
                    this.props.onChange();
                  });
                });
              }}
            />
          </Grid>
        :
          <Grid item 
            onClick={() => {
              this.setState({ edit_view: "Other" });
            }}>
            { this.props.obj.other_possessions }
          </Grid>
        }  
      </Grid>
    );
  }
}

export default connector(CharacterViewEquipment);
