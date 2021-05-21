import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid,
  Tooltip,
  Fab
} from "@material-ui/core";
import {
  Add,
  DeleteForever
} from "@material-ui/icons";

import { 
  StartEquipmentChoice, 
  StartEquipmentOption, 
  StartEquipmentItem, 
  BaseItem,
  IStringHash 
} from "../../../models";
import { 
  ITEM_TYPES
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";
import SelectBaseItemBox from "../select/SelectBaseItemBox";
import SelectEquipmentPackBox from "../select/SelectEquipmentPackBox";
import SelectWeaponKeywordBox from "../select/SelectWeaponKeywordBox";
import SelectArmorTypeBox from "../select/SelectArmorTypeBox";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
  
  width: number
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
  choices: StartEquipmentChoice[];
  onChange: (choices: StartEquipmentChoice[]) => void; 
}

export interface State { 
  base_items: BaseItem[] | null;
  base_item_map: IStringHash;
  loading: boolean;
}

class StartEquipmentChoicesInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      base_items: null,
      base_item_map: {},
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("base_item").then((res: any) => {
        if (res && !res.error) {
          const base_items: BaseItem[] = res;
          const base_item_map: IStringHash = {};
          base_items.forEach(item => {
            base_item_map[item._id] = item.name;
          });
          this.setState({
            base_items, 
            base_item_map,
            loading: false 
          });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.base_items === null) {
      return <span>Loading</span>;
    } else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              Starting Equipment Choices
            </span>
            <Tooltip title={`Create New Choice`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  const choices = this.props.choices;
                  const choice = new StartEquipmentChoice();
                  choice.id = choices.length;
                  choices.push(choice);
                  this.props.onChange(choices);
                }}>
                <Add/>
              </Fab>
            </Tooltip>
          </Grid>
          { this.renderChoices() }
        </Grid>
      );
    }
  }

  renderChoices() {
    return this.props.choices.map((choice, key) => {
      return (
        <Grid item key={key}>
          <div style={{
            border: "1px solid #777777"
          }}>
            <Grid container spacing={1} direction="column">
              <Grid item>
                <span className={"MuiTypography-root MuiListItemText-primary header"}>
                  Options
                </span>
                <Tooltip title={`Create New Option`}>
                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                    onClick={ () => {
                      const option = new StartEquipmentOption();
                      option.id = choice.options.length;
                      choice.options.push(option);
                      const choices = this.props.choices;
                      this.props.onChange(choices);
                    }}>
                    <Add/>
                  </Fab>
                </Tooltip>
                <Tooltip title={`Remove Choice`}>
                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                    onClick={ () => {
                      const choices = this.props.choices.filter(c => c.id !== choice.id);
                      choices.filter(o => o.id > choice.id).forEach(o => {
                        o.id--;
                      });
                      this.props.onChange(choices);
                      this.setState({ loading: true }, () => {
                        this.setState({ loading: false });
                      });
                    }}>
                    <DeleteForever/>
                  </Fab>
                </Tooltip>
              </Grid>
              { this.renderChoiceOptions(choice) }
            </Grid>
          </div>
        </Grid>
      );
    });
  }

  renderChoiceOptions(choice: StartEquipmentChoice) {
    return choice.options.map((opt, key) => {
      return (
        <Grid item key={key}>
          <div style={{
            border: "1px solid #777777"
          }}>
            <Grid container spacing={1} direction="column">
              <Grid item>
                <span className={"MuiTypography-root MuiListItemText-primary header"}>
                  Items
                </span>
                <Tooltip title={`Add New Item`}>
                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                    onClick={ () => {
                      const item = new StartEquipmentItem();
                      item.id = opt.items.length;
                      opt.items.push(item);
                      const choices = this.props.choices;
                      this.props.onChange(choices);
                    }}>
                    <Add/>
                  </Fab>
                </Tooltip>
                <Tooltip title={`Remove Option`}>
                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                    onClick={ () => {
                      const choices = this.props.choices;
                      choice.options = choice.options.filter(o => o.id !== opt.id);
                      choice.options.filter(o => o.id > opt.id).forEach(o => {
                        o.id--;
                      });
                      this.props.onChange(choices);
                      this.setState({ loading: true }, () => {
                        this.setState({ loading: false });
                      });
                    }}>
                    <DeleteForever/>
                  </Fab>
                </Tooltip>
              </Grid>
              { this.renderOptionItems(opt) }
            </Grid>
          </div>
        </Grid>
      );
    });
  }

  renderOptionItems(opt: StartEquipmentOption) {
    return opt.items.map((item, key) => {
      return (
        <Grid item key={key} container spacing={1} direction="row">
          <Grid item xs={1}>
            <Tooltip title={`Remove Item`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  const choices = this.props.choices;
                  opt.items = opt.items.filter(o => o.id !== item.id);
                  opt.items.filter(i => i.id > item.id).forEach(i => {
                    i.id--;
                  });
                  this.props.onChange(choices);
                  this.setState({ loading: true }, () => {
                    this.setState({ loading: false });
                  });
                }}>
                <DeleteForever/>
              </Fab>
            </Tooltip>
          </Grid>
          <Grid item xs={2}>
            <SelectStringBox 
              name="Item Type"
              options={["Item","Type","Pack","Money","Other Item"]}
              value={item.item_type}
              onChange={(value: string) => {
                item.item_type = value;
                const choices = this.props.choices;
                this.props.onChange(choices);
              }}
            />
          </Grid>
          { item.item_type === "Item" ?
            <Grid item xs={6}>
              <SelectBaseItemBox
                name="Item"
                value={item.item}
                onChange={(value: string) => {
                  item.item = value;
                  const choices = this.props.choices;
                  this.props.onChange(choices);
                }}
              />
            </Grid>
          : item.item_type === "Type" ?
            <Grid item xs={ item.item === "Weapon" || item.item === "Armor" ? 6 : 9}>
              <SelectStringBox 
                name="Type"
                options={ITEM_TYPES}
                value={item.item}
                onChange={(value: string) => {
                  item.item = value;
                  const choices = this.props.choices;
                  this.props.onChange(choices);
                }}
              />
            </Grid>
          : item.item_type === "Pack" ?
            <Grid item xs={9}>
              <SelectEquipmentPackBox 
                name="Pack"
                value={item.item}
                onChange={(value: string) => {
                  item.item = value;
                  const choices = this.props.choices;
                  this.props.onChange(choices);
                }}
              />
            </Grid>
          : item.item_type === "Money" ?
            <Grid item xs={9}>
              <StringBox 
                name="Money"
                value={item.item}
                onBlur={(value: string) => {
                  item.item = value;
                  const choices = this.props.choices;
                  this.props.onChange(choices);
                }}
              />
            </Grid>
          :
            <Grid item xs={9}>
              <StringBox 
                name="Other Item"
                value={item.item}
                onBlur={(value: string) => {
                  item.item = value;
                  const choices = this.props.choices;
                  this.props.onChange(choices);
                }}
              />
            </Grid>
          }
          { item.item_type === "Item" &&
            <Grid item xs={3}>
              <StringBox 
                name="Count"
                value={`${item.item_count}`}
                onBlur={(value: string) => {
                  item.item_count = +value;
                  const choices = this.props.choices;
                  this.props.onChange(choices);
                }}
              />
            </Grid>
          }
          { item.item_type === "Type" && item.item === "Weapon" &&
            <Grid item xs={3}>
              <SelectWeaponKeywordBox 
                name="Weapon Type"
                value={item.detail}
                onChange={(value: string) => {
                  item.detail = value;
                  const choices = this.props.choices;
                  this.props.onChange(choices);
                }}
              />
            </Grid>
          }
          { item.item_type === "Type" && item.item === "Armor" &&
            <Grid item xs={3}>
              <SelectArmorTypeBox 
                name="Armor Type"
                value={item.detail}
                onChange={(value: string) => {
                  item.detail = value;
                  const choices = this.props.choices;
                  this.props.onChange(choices);
                }}
              />
            </Grid>
          }
        </Grid>
      );
    });
  }
}

export default connector(StartEquipmentChoicesInput);
