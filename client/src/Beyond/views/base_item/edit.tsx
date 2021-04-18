import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  Add, // Edit,
  ArrowBack,
  // DeleteForever
} from "@material-ui/icons";
import {
  Grid, 
  // List, ListItem, 
  Button, 
  Tooltip, Fab,
  // FormControl, 
  // InputLabel,
  // OutlinedInput, FormHelperText
} from "@material-ui/core";
// import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
// import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { 
  // ArmorType,
  WeaponKeyword,
  // GameClass,
  BaseItem, 
  // Skill,
  // Damage,
  RollPlus
} from "../../models";
import { 
  ITEM_TYPES,
  DAMAGE_TYPES
} from "../../models/Constants";

import StringBox from "../../components/input/StringBox";
// import SelectBox from "../../components/input/SelectBox";
import SelectStringBox from "../../components/input/SelectStringBox";
import CheckBox from "../../components/input/CheckBox";

import SelectArmorTypeBox from "../../components/model_inputs/select/SelectArmorTypeBox";
import SelectWeaponKeywordBox from "../../components/model_inputs/select/SelectWeaponKeywordBox";
import SelectToolBox from "../../components/model_inputs/select/SelectToolBox";
// import SelectGameClassBox from "../../components/model_inputs/SelectGameClassBox";
import DamageInput from "../../components/model_inputs/other/DamageInput";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  // base_items: BaseItem[] | null;
  // skills: Skill[] | null;
  item_type: string;
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

interface MatchParams {
  id: string;
}

const mapState = (state: RootState) => ({
  // base_items: state.app.base_items,
  // skillsMB: state.app.skills as ModelBase[],
  // skills: state.app.skills,
  item_type: state.app.item_type,
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
  // setBaseItems: (objects: BaseItem[]) => ({ type: 'SET', dataType: 'base_items', payload: objects }),
  // addBaseItem: (object: BaseItem) => ({ type: 'ADD', dataType: 'base_items', payload: object })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & { }

export interface State { 
  redirectTo: string | null;
  obj: BaseItem;
  processing: boolean;
  // skills: Skill[] | null;
  base_items: BaseItem[] | null;
  // armor_types: ArmorType[] | null;
  weapon_keywords: WeaponKeyword[] | null;
  range_ids: string[];
  reach_id: string;
  versatile_id: string;
  // game_classes: GameClass[] | null;
  loading: boolean;
  reloading: boolean;
}

class BaseItemEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new BaseItem(),
      processing: false,
      // skills: null,
      base_items: null,
      // armor_types: null,
      weapon_keywords: null,
      range_ids: [],
      reach_id: "",
      versatile_id: "",
      // game_classes: null,
      loading: false,
      reloading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject(this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/base_item" });
      });
    });
  }

  // Loads the editing BaseItem into state
  load_object(id: string) {
    const objFinder = this.state.base_items ? this.state.base_items.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone() });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["base_item","weapon_keyword"]).then((res: any) => {
        const obj = this.state.obj;
        if (obj._id === "" && this.props.item_type !== "ALL") {
          obj.item_type = this.props.item_type;
        }
        const range_ids: string[] = [];
        let reach_id = "";
        let versatile_id = "";
        if (res.weapon_keyword) {
          let objFinder = res.weapon_keyword.filter((o: WeaponKeyword) => o.name.toLowerCase().includes("range") || o.name.toLowerCase().includes("thrown"));
          objFinder.forEach((o: WeaponKeyword) => {
            range_ids.push(o._id);
          });
          objFinder = res.weapon_keyword.filter((o: WeaponKeyword) => o.name === "Reach");
          if (objFinder.length === 1) {
            reach_id = objFinder[0]._id;
          }
          objFinder = res.weapon_keyword.filter((o: WeaponKeyword) => o.name === "Versatile");
          if (objFinder.length === 1) {
            versatile_id = objFinder[0]._id;
          }
        }
        this.setState({ 
          obj,
          base_items: res.base_item, 
          // armor_types: res.armor_type,
          weapon_keywords: res.weapon_keyword,
          range_ids,
          reach_id,
          versatile_id,
          // game_classes: res.game_class,
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
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      let { id } = this.props.match.params;
      if (id !== undefined && this.state.obj._id !== id) {
        this.load_object(id);
        return (<span>Loading...</span>);
      } else {
        let range = false;
        let reach = false;
        let versatile = false;
        if (this.state.obj.weapon_keyword_ids.indexOf(this.state.versatile_id) !== -1) {
          versatile = true;
        }
        if (this.state.obj.weapon_keyword_ids.indexOf(this.state.reach_id) !== -1) {
          reach = true;
        } else {
          for (let i = 0; i < this.state.obj.weapon_keyword_ids.length; i++) {
            if (this.state.range_ids.indexOf(this.state.obj.weapon_keyword_ids[i]) !== -1) {
              range = true;
              break;
            }
          }
        }
        const formHeight = this.props.height - (this.props.width > 600 ? 198 : 198);
        const tool_types = ["Artisan's Tools","Game Set","Instrument","Vehicles"];
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <Tooltip title={`Back to Base Items`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/base_item` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
            </Grid>
            <Grid item>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                { this.state.obj._id === "" ? "Create Base Item" : `Edit ${this.state.obj.name}` }
              </span>
            </Grid>
            <Grid item 
              style={{ 
                height: `${formHeight}px`, 
                overflowY: "scroll", 
                overflowX: "hidden" 
              }}>
              <Grid container spacing={1} direction="column">
                <Grid item>
                  <StringBox 
                    value={this.state.obj.name} 
                    message={this.state.obj.name.length > 0 ? "" : "Name Invalid"} 
                    name="Name"
                    onBlur={(value: string) => {
                      const obj = this.state.obj;
                      obj.name = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item>
                  <StringBox 
                    value={this.state.obj.description} 
                    name="Description"
                    multiline
                    onBlur={(value: string) => {
                      const obj = this.state.obj;
                      obj.description = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item>
                  <StringBox 
                    value={`${this.state.obj.weight}`} 
                    name="Weight (in lbs)"
                    type="number"
                    onBlur={(value: number) => {
                      const obj = this.state.obj;
                      obj.weight = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item>
                  <StringBox 
                    value={`${this.state.obj.cost}`} 
                    name="Cost (GP)"
                    onBlur={(value: string) => {
                      const obj = this.state.obj;
                      obj.cost = +value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                <Grid item>
                  <SelectStringBox
                    name="Item Type"
                    options={ITEM_TYPES}
                    value={this.state.obj.item_type}
                    onChange={(value: string) => {
                      const obj = this.state.obj;
                      obj.item_type = value;
                      this.setState({ obj });
                    }}
                  />
                </Grid>
                { this.state.obj.item_type === "Armor" ? 
                  <Grid item container spacing={1} direction="column">
                    <Grid item>
                      <SelectArmorTypeBox
                        name="Armor Type" 
                        value={ this.state.obj.armor_type_id ? this.state.obj.armor_type_id : "" } 
                        onChange={(id: string) => {
                          const obj = this.state.obj;
                          obj.armor_type_id = id;
                          this.setState({ obj });
                        }} 
                      />
                    </Grid>
                    <Grid item>
                      <StringBox
                        name="Base Armor Class (or Bonus)"
                        type="number"
                        value={ `${this.state.obj.base_armor_class}` }
                        onBlur={(value: string) => {
                          const obj = this.state.obj;
                          obj.base_armor_class = +value;
                          this.setState({ obj });
                        }}
                      />
                    </Grid>
                  </Grid>
                : this.state.obj.item_type === "Weapon" ?
                  <Grid item container spacing={1} direction="column">
                    <Grid item>
                      <SelectWeaponKeywordBox
                        name="Weapon Keywords" 
                        values={ this.state.obj.weapon_keyword_ids } 
                        multiple
                        onChange={(ids: string[]) => {
                          const obj = this.state.obj;
                          obj.weapon_keyword_ids = ids;
                          this.setState({ obj });
                        }} 
                      />
                    </Grid>
                    { this.renderDamageInputs(false) }
                    <Grid item>
                      <SelectStringBox
                        name="Damage Type"
                        options={DAMAGE_TYPES}
                        value={this.state.obj.damage_type}
                        onChange={(value: string) => {
                          const obj = this.state.obj;
                          obj.damage_type = value;
                          this.setState({ obj });
                        }}
                      />
                    </Grid>
                    { versatile && this.renderDamageInputs(true) }
                    { range ? 
                      <Grid item>
                        <StringBox
                          name="Range"
                          type="number"
                          value={ `${this.state.obj.range}` }
                          onBlur={(value: number) => {
                            const obj = this.state.obj;
                            obj.range = value;
                            this.setState({ obj });
                          }}
                        />
                      </Grid>
                    : reach &&
                      <Grid item>
                        <StringBox
                          name="Reach"
                          type="number"
                          value={ `${this.state.obj.range}` }
                          onBlur={(value: number) => {
                            const obj = this.state.obj;
                            obj.range = value;
                            this.setState({ obj });
                          }}
                        />
                      </Grid>
                    }
                    { range && 
                      <Grid item>
                        <StringBox
                          name="Far Range"
                          type="number"
                          value={ `${this.state.obj.range2}` }
                          onBlur={(value: number) => {
                            const obj = this.state.obj;
                            obj.range2 = value;
                            this.setState({ obj });
                          }}
                        />
                      </Grid>
                    }
                  </Grid>
                : tool_types.includes(this.state.obj.item_type) &&
                  <Grid item container spacing={1} direction="column">
                    <Grid item>
                      <SelectToolBox
                        name="Specific Tool" 
                        type={ this.state.obj.item_type }
                        value={ this.state.obj.tool_id } 
                        onChange={(id: string) => {
                          const obj = this.state.obj;
                          obj.tool_id = id;
                          this.setState({ obj });
                        }} 
                      />
                    </Grid>
                  </Grid>
                }
                { this.state.obj.item_type !== "Weapon" && this.state.obj.item_type !== "Armor" && 
                  <Grid item>
                    <SelectStringBox
                      name="Worn Type"
                      options={["None","Head","Chest","Hands","Feet","Cape","Ring","Belt"]}
                      value={this.state.obj.worn_type}
                      onChange={(value: string) => {
                        const obj = this.state.obj;
                        obj.worn_type = value;
                        this.setState({ obj });
                      }}
                    />
                  </Grid>
                }
                { this.state.obj.item_type !== "Weapon" && this.state.obj.item_type !== "Armor" && 
                  <Grid item>
                    <CheckBox 
                      name="Stackable"
                      value={this.state.obj.stackable}
                      onChange={(value: boolean) => {
                        const obj = this.state.obj;
                        obj.stackable = value;
                        this.setState({ obj });
                      }}
                    />
                  </Grid>
                }
                { this.state.obj.stackable &&
                  <Grid item>
                    <StringBox 
                      value={`${this.state.obj.bundle_size}`} 
                      name="Bundle Size"
                      type="number"
                      onBlur={(value: number) => {
                        const obj = this.state.obj;
                        obj.bundle_size = value;
                        this.setState({ obj });
                      }}
                    />
                  </Grid>
                }
              </Grid>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={this.state.processing}
                onClick={ () => { 
                  this.submit();
                }}>
                Submit
              </Button>
              <Button
                variant="contained"
                // color="primary"
                disabled={this.state.processing}
                style={{ marginLeft: "4px" }}
                onClick={ () => { 
                  this.setState({ redirectTo:`/beyond/base_item` });
                }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        ); 
      }
    }
  }

  renderDamageInputs(versatile: boolean) {
    return (
      <Grid item container spacing={0} direction="column">
        <Grid item>
          { versatile ? "Versatile Damages" : "Damages" }
          <Tooltip title={`Add Damage`}>
            <Fab size="small" color="primary" style={{marginLeft: "8px"}}
              onClick={ () => {
                const obj = this.state.obj;
                if (versatile) {
                  obj.versatile_attack_damages.push(new RollPlus());
                } else {
                  obj.attack_damages.push(new RollPlus());
                }
                this.setState({ obj }, () => {
                  this.setState({ reloading: false });
                });
              }}>
              <Add/>
            </Fab>
          </Tooltip>
        </Grid>
        { !this.state.reloading && versatile ? 
          this.state.obj.versatile_attack_damages.map((damage, key) => {
            return (
              <DamageInput 
                damage={damage}
                onChange={() => {
                  const obj = this.state.obj;
                  this.setState({ obj });
                }}
                onDelete={() => {
                  const obj = this.state.obj;
                  obj.versatile_attack_damages = obj.versatile_attack_damages.filter(o => o.true_id === damage.true_id);
                  this.setState({ obj }, () => {
                    this.setState({ reloading: false });
                  });
                }}
              />
            );
          }) 
        : !this.state.reloading && 
          this.state.obj.attack_damages.map((damage, key) => {
            return (
              <DamageInput 
                damage={damage}
                onChange={() => {
                  const obj = this.state.obj;
                  this.setState({ obj });
                }}
                onDelete={() => {
                  const obj = this.state.obj;
                  obj.attack_damages = obj.attack_damages.filter(o => o.true_id === damage.true_id);
                  this.setState({ obj }, () => {
                    this.setState({ reloading: false });
                  });
                }}
              />
            );
          }) 
        }
      </Grid>
    );
  }
}

export default connector(BaseItemEdit);
