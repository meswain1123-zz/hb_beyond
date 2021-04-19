import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
  Button, 
} from "@material-ui/core";

import { 
  Character,
  CharacterItem,
  Background,
  BaseItem,
  GameClass,
  Subclass,
  MagicItem,
  MagicItemKeyword,
  Money,
  StartEquipmentItem,
  StartEquipmentChoice,
  StartEquipmentOption,
  WeaponKeyword,
  ArmorType,
  EquipmentPack,
} from "../../../models";

import CheckBox from "../../input/CheckBox";
import SelectBaseItemBox from '../select/SelectBaseItemBox';

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
  base_items: BaseItem[] | null;
  magic_items: MagicItem[] | null;
  magic_item_keywords: MagicItemKeyword[] | null;
  weapon_keywords: WeaponKeyword[] | null;
  armor_types: ArmorType[] | null;
  equipment_packs: EquipmentPack[] | null;
  loading: boolean;
  expanded_feature_base_id: number;
  background_copy: Background | null;
  game_class_copy: GameClass | null;
}

class CharacterEquipmentInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      base_items: null,
      magic_items: null,
      magic_item_keywords: null,
      weapon_keywords: null,
      armor_types: null,
      equipment_packs: null,
      loading: false,
      expanded_feature_base_id: -1,
      background_copy: null,
      game_class_copy: null
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["background","game_class","subclass","base_item","magic_item","magic_item_keyword","weapon_keyword","armor_type","equipment_pack"]).then((res: any) => {
        const obj = this.props.obj;
        const backgrounds: Background[] = res.background;
        if (obj.background.background_id !== "" && !obj.background.background) {
          const obj_finder = backgrounds.filter(o => o._id === obj.background.background_id);
          if (obj_finder.length === 1) {
            obj.background.connectBackground(obj_finder[0]);
          }
        }
        const game_classes: GameClass[] = res.game_class;
        const subclasses: Subclass[] = res.subclass;
        obj.classes.forEach(char_class => {
          if (!char_class.game_class) {
            const objFinder = game_classes.filter(o => o._id === char_class.game_class_id);
            if (objFinder.length === 1) {
              char_class.connectGameClass(objFinder[0]);
            }
          }
          if (char_class.subclass_id !== "" && !char_class.subclass) {
            const objFinder = subclasses.filter(o => o._id === char_class.subclass_id);
            if (objFinder.length === 1) {
              char_class.connectSubclass(objFinder[0]);
            }
          }
        });
        this.props.onChange();
        let game_class_copy: GameClass | null = null;
        let background_copy: Background | null = null;
        if (this.props.obj.classes.length > 0 && this.props.obj.classes[0].game_class && this.props.obj.background.background) {
          game_class_copy = this.props.obj.classes[0].game_class.clone();
          background_copy = this.props.obj.background.background.clone();
        }
        this.setState({ 
          game_class_copy,
          background_copy,
          base_items: res.base_item, 
          magic_items: res.magic_item,
          magic_item_keywords: res.magic_item_keyword,
          weapon_keywords: res.weapon_keyword,
          armor_types: res.armor_type,
          equipment_packs: res.equipment_pack,
          loading: false 
        });
      });
    });
  }

  needs_attention() {
    let needs_attention = false;
    if (this.state.background_copy && this.state.game_class_copy) {
      for (let i = 0; i < this.state.background_copy.start_equipment.length; i++) {
        const choice = this.state.background_copy.start_equipment[i];
        if (choice.selected_option === -1 || choice.options.filter(o => o.id === choice.selected_option && o.items.filter(i => i.item_type === "Type" && i.selected_item_id === "").length > 0).length > 0) {
          needs_attention = true;
          break;
        }
      }
      if (!needs_attention) {
        for (let i = 0; i < this.state.game_class_copy.start_equipment.length; i++) {
          const choice = this.state.game_class_copy.start_equipment[i];
          if (choice.selected_option === -1 || choice.options.filter(o => o.id === choice.selected_option && o.items.filter(i => i.item_type === "Type" && i.selected_item_id === "").length > 0).length > 0) {
            needs_attention = true;
            break;
          }
        }  
      }
    } else {
      needs_attention = true;
    }

    return needs_attention;
  }

  add_starting_equipment() {
    if (this.state.background_copy && this.state.game_class_copy) {
      const items: CharacterItem[] = [];
      const background_copy = this.state.background_copy;
      const game_class_copy = this.state.game_class_copy;
      background_copy.start_equipment.forEach(choice => {
        const option = choice.options[choice.selected_option];
        option.items.forEach(item => {
          if (this.state.base_items && this.state.equipment_packs) {
            switch (item.item_type) {
              case "Item":
                const item_finder = this.state.base_items.filter(o => o._id === item.item);
                if (item_finder.length === 1) {
                  const obj = item_finder[0];
                  const char_item = new CharacterItem();
                  char_item.copyBaseItem(obj);
                  char_item.count = item.item_count;
                  items.push(char_item);
                }
              break;
              case "Type":
                const item_finder2 = this.state.base_items.filter(o => o._id === item.selected_item_id);
                if (item_finder2.length === 1) {
                  const obj = item_finder2[0];
                  const char_item = new CharacterItem();
                  char_item.copyBaseItem(obj);
                  char_item.count = item.item_count;
                  items.push(char_item);
                }
              break;
              case "Pack":
                const pack_finder = this.state.equipment_packs.filter(o => o._id === item.item);
                if (pack_finder.length === 1) {
                  const pack = pack_finder[0];
                  for (let i = 0; i < pack.items.length; i++) {
                    const pack_item = pack.items[i];
                    const item_finder3 = this.state.base_items.filter(o => o._id === pack_item.item_id);
                    if (item_finder3.length === 1) {
                      const obj = item_finder3[0];
                      const char_item = new CharacterItem();
                      char_item.copyBaseItem(obj);
                      char_item.count = pack_item.count;
                      items.push(char_item);
                    }
                  }
                }
              break;
              case "Money":
                const money_split = item.item.split(" ");
                const char_moneys = this.props.obj.money;
                const money_finder = char_moneys.filter(o => o.type === money_split[1]);
                if (money_finder.length === 1) {
                  const money = money_finder[0];
                  money.count += +money_split[0];
                } else {
                  const money = new Money();
                  money.type = money_split[1];
                  money.count = +money_split[0];
                  char_moneys.push(money);
                }
              break;
              case "Other Item":
                this.props.obj.other_possessions += `\n${item.item}`;
              break;
            }
          }
        });
      });
      game_class_copy.start_equipment.forEach(choice => {
        const option = choice.options[choice.selected_option];
        option.items.forEach(item => {
          if (this.state.base_items && this.state.equipment_packs) {
            switch (item.item_type) {
              case "Item":
                const item_finder = this.state.base_items.filter(o => o._id === item.item);
                if (item_finder.length === 1) {
                  const obj = item_finder[0];
                  const char_item = new CharacterItem();
                  char_item.copyBaseItem(obj);
                  char_item.count = item.item_count;
                  items.push(char_item);
                }
              break;
              case "Type":
                const item_finder2 = this.state.base_items.filter(o => o._id === item.selected_item_id);
                if (item_finder2.length === 1) {
                  const obj = item_finder2[0];
                  const char_item = new CharacterItem();
                  char_item.copyBaseItem(obj);
                  char_item.count = item.item_count;
                  items.push(char_item);
                }
              break;
              case "Pack":
                const pack_finder = this.state.equipment_packs.filter(o => o._id === item.item);
                if (pack_finder.length === 1) {
                  const pack = pack_finder[0];
                  for (let i = 0; i < pack.items.length; i++) {
                    const pack_item = pack.items[i];
                    const item_finder3 = this.state.base_items.filter(o => o._id === pack_item.item_id);
                    if (item_finder3.length === 1) {
                      const obj = item_finder3[0];
                      const char_item = new CharacterItem();
                      char_item.copyBaseItem(obj);
                      char_item.count = pack_item.count;
                      items.push(char_item);
                    }
                  }
                }
              break;
              case "Money":
                const money_split = item.item.split(" ");
                const char_moneys = this.props.obj.money;
                const money_finder = char_moneys.filter(o => o.type === money_split[1]);
                if (money_finder.length === 1) {
                  const money = money_finder[0];
                  money.count += +money_split[0];
                } else {
                  const money = new Money();
                  money.type = money_split[1];
                  money.count = +money_split[0];
                  char_moneys.push(money);
                }
              break;
              case "Other Item":
                this.props.obj.other_possessions += `\n${item.item}`;
              break;
            }
          }
        });
      });
      this.props.obj.items = items;
      this.props.onChange();
    }
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.base_items === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              Equipment
            </span>
          </Grid>
          { this.props.obj.items.length > 0 ?
            <Grid item container spacing={1} direction="column">
              { this.props.obj.items.map((item, key) => {
                return (
                  <Grid item key={key}>
                    { item.name } { item.count > 1 ? `(${item.count})` : "" }
                  </Grid>
                );
              })}
              { this.props.obj.money.map((m, key) => {
                return (
                  <Grid item key={key}>
                    { m.count } { m.type }
                  </Grid>
                );
              })}
            </Grid>
          : (!this.state.background_copy || !this.state.game_class_copy) ?
            <Grid item>
              You need to have at least one class, and a background first
            </Grid>
          : 
            this.renderStartEquipmentChoices()
          }
        </Grid>
      );
    }
  }

  renderStartEquipmentChoices() {
    if (this.state.background_copy && this.state.game_class_copy) {
      return (
        <Grid item container spacing={1} direction="column">
          <Grid item>
            { this.state.game_class_copy.name } Equipment Choices
          </Grid>
          { this.state.game_class_copy.start_equipment.map((choice, key) => {
            return (
              <Grid item key={key}>
                <div 
                  style={{
                    border: (choice.selected_option === -1 || choice.options.filter(o => o.id === choice.selected_option && o.items.filter(i => i.item_type === "Type" && i.selected_item_id === "").length > 0).length > 0 ? "1px solid #1C9AEF" : "1px solid #777777"),
                    padding: "4px"
                  }} 
                >
                  <Grid container spacing={1} direction="column">
                    { this.renderChoiceOptions(choice) }
                  </Grid>
                </div>
              </Grid>
            );
          })}
          <Grid item>
            { this.state.background_copy.name } Equipment Choices
          </Grid>
          { this.state.background_copy.start_equipment.map((choice, key) => {
            return (
              <Grid item key={key}>
                <div 
                  style={{
                    border: (choice.selected_option === -1 || choice.options.filter(o => o.id === choice.selected_option && o.items.filter(i => i.item_type === "Type" && i.selected_item_id === "").length > 0).length > 0 ? "1px solid #1C9AEF" : "1px solid #777777"),
                    padding: "4px"
                  }} 
                >
                  <Grid container spacing={1} direction="column">
                    { this.renderChoiceOptions(choice) }
                  </Grid>
                </div>
              </Grid>
            );
          })}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={ this.needs_attention() }
              onClick={ () => { 
                this.add_starting_equipment();
              }}>
              Add Starting Equipment
            </Button>
          </Grid>
        </Grid>
      );
    } else {
      return (<span></span>);
    }
  }

  renderChoiceOptions(choice: StartEquipmentChoice) {
    return choice.options.map((option, key) => (
      <Grid item key={key} container spacing={1} direction="column">
        <Grid item>
          <CheckBox 
            name={ this.renderOptionItems(option) } 
            value={choice.selected_option === option.id} 
            onChange={(value: boolean) => {
              if (value) {
                choice.selected_option = option.id;
              } else if (choice.selected_option === option.id) {
                choice.selected_option = -1;
              }
              this.setState({ });
            }} 
          />
        </Grid>
        { choice.selected_option === option.id && this.renderTypeItems(option) }
      </Grid>
    ));
  }

  renderTypeItems(option: StartEquipmentOption) {
    return option.items.filter(i => i.item_type === "Type").map((item, key) => {
      if (this.state.base_items) {
        let filtered = this.state.base_items.filter(o => o.item_type === item.item);
        if (item.detail !== "") {
          if (item.item === "Weapon") {
            filtered = filtered.filter(o => o.weapon_keyword_ids.includes(item.detail));
          } else if (item.item === "Armor") {
            filtered = filtered.filter(o => o.armor_type_id === item.detail);
          }
        }
        return (
          <Grid item key={key}>
            <SelectBaseItemBox
              name={`Select a ${item.item}`}
              base_items={filtered}
              value={item.selected_item_id}
              item_type={item.item}
              simple_view
              onChange={(value: string) => {
                item.selected_item_id = value;
                this.setState({ });
              }}
            />
          </Grid>
        );
      } else {
        return (<span key={key}>Error</span>);
      }
    });
  }

  renderOptionItems(option: StartEquipmentOption) {
    let option_string = "";
    for (let i = 0; i < option.items.length; i++) {
      if (i > 0) {
        option_string += ", ";
      }
      option_string += this.renderOptionItem(option.items[i]);
    }
    return option_string;
  }

  renderOptionItem(item: StartEquipmentItem) {
    let return_me = "";
    if (this.state.base_items && this.state.weapon_keywords && this.state.armor_types && this.state.equipment_packs) {
      switch (item.item_type) {
        case "Item":
          const item_finder = this.state.base_items.filter(o => o._id === item.item);
          if (item_finder.length === 1) {
            const obj = item_finder[0];
            if (item.item_count > 1) {
              return_me = `${item.item_count} ${obj.name}s`;
            } else {
              return_me = obj.name;
            }
          }
        break;
        case "Type":
          if (item.item === "Weapon" && item.detail !== "") {
            const obj_finder = this.state.weapon_keywords.filter(o => o._id === item.detail);
            if (obj_finder.length === 1) {
              const obj = obj_finder[0];
              return_me = `A ${obj.name} Weapon of your choice`;
            }
          } else if (item.item === "Armor" && item.detail !== "") {
            const obj_finder = this.state.armor_types.filter(o => o._id === item.detail);
            if (obj_finder.length === 1) {
              const obj = obj_finder[0];
              return_me = `A ${obj.name} of your choice`;
            }
          } else {
            return_me = `A ${item.item} of your choice`;
          }
        break;
        case "Pack":
          const pack_finder = this.state.equipment_packs.filter(o => o._id === item.item);
          if (pack_finder.length === 1) {
            const obj = pack_finder[0];
            return_me = obj.name + ": ";
            for (let i = 0; i < obj.items.length; i++) {
              const pack_item = obj.items[i];
              const pack_item_finder = this.state.base_items.filter(o => o._id === pack_item.item_id);
              if (pack_item_finder.length === 1) {
                const obj = pack_item_finder[0];
                if (i > 0) {
                  return_me += ", ";
                }
                if (pack_item.count > 1) {
                  return_me += `${pack_item.count} ${obj.name}`;
                } else {
                  return_me += obj.name;
                }
              }
            }
          }
        break;
        case "Money":
          return_me = item.item;
        break;
        case "Other Item":
          return_me = `${item.item} (Will be added to Other Possessions)`;
        break;
      }
    }
    return return_me;
  }
}

export default connector(CharacterEquipmentInput);
