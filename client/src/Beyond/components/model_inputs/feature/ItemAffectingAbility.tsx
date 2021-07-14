import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  TemplateBase,
  ItemAffectingAbility,
  ItemAffectingAbilityTemplate,
  UpgradableNumber
} from "../../../models";
import { 
  ITEM_TYPES,
  REFRESH_RULES
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";
import TemplateBox from "../TemplateBox";
import SelectWeaponKeywordBox from "../select/SelectWeaponKeywordBox";
import SelectArmorTypeBox from "../select/SelectArmorTypeBox";
import SelectResourceBox from "../select/SelectResourceBox";

import UpgradableNumberBox from "../../input/UpgradableNumberBox";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  obj: ItemAffectingAbility;
  onChange: (changed: ItemAffectingAbility) => void; 
}

export interface State { 
  reloading: boolean;
  show_effect: number;
  special_refresh_rule: boolean;
}

class ItemAffectingAbilityInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      reloading: false,
      show_effect: 0,
      special_refresh_rule: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  render() {
    if (this.state.reloading) {
      return (
        <Grid item>Loading</Grid>
      );
    } else {
      const refresh_rule_helper = REFRESH_RULES.includes(this.props.obj.special_resource_refresh_rule) ? this.props.obj.special_resource_refresh_rule : "Special";
      return (
        <Grid item container spacing={1} direction="column">
          <Grid item>
            <TemplateBox
              obj={this.props.obj}
              type="ItemAffectingAbility"
              useTemplate={(template: TemplateBase) => {
                const ability_template: ItemAffectingAbilityTemplate = template as ItemAffectingAbilityTemplate;
                const obj = this.props.obj;
                obj.copyTemplate(ability_template);
                this.props.onChange(obj);
              }}
            />
          </Grid>
          <Grid item>
            <SelectStringBox
              name="Ability Type"
              options={["Create","Edit","Both"]}
              value={this.props.obj.item_ability_type}
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.item_ability_type = value;
                this.props.onChange(obj);
              }}
            />
          </Grid>
          <Grid item>
            <SelectStringBox
              name="Item Types"
              options={ITEM_TYPES}
              multiple={true}
              values={this.props.obj.item_types}
              onChange={(values: string[]) => {
                const obj = this.props.obj;
                obj.item_types = values;
                this.props.onChange(obj);
              }}
            />
          </Grid>
          <Grid item>
            <StringBox
              name="Max to Create/Enchant"
              type="number"
              value={`${this.props.obj.max_count}`}
              onBlur={(value: number) => {
                const obj = this.props.obj;
                obj.max_count = value;
                this.props.onChange(obj);
              }}
            />
          </Grid>
          { this.props.obj.item_types.includes("Weapon") &&
            <Grid item>
              <SelectWeaponKeywordBox 
                name="Weapon Keywords" 
                multiple
                values={this.props.obj.weapon_keyword_ids} 
                onChange={(ids: string[]) => {
                  const obj = this.props.obj;
                  obj.weapon_keyword_ids = ids;
                  this.props.onChange(obj);
                }} 
              />
            </Grid>
          }
          { this.props.obj.item_types.includes("Armor") &&
            <Grid item>
              <SelectArmorTypeBox 
                name="Armor Types" 
                multiple
                values={this.props.obj.armor_type_ids} 
                onChange={(ids: string[]) => {
                  const obj = this.props.obj;
                  obj.armor_type_ids = ids;
                  this.props.onChange(obj);
                }} 
              />
            </Grid>
          }
          <Grid item>
            <SelectResourceBox 
              name="Resource Consumed"
              allow_special
              allow_none
              allow_slot
              value={ this.props.obj.resource_consumed ? this.props.obj.resource_consumed : "None" }
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.resource_consumed = value;
                if (value === "Special" && obj.special_resource_refresh_rule === "") {
                  obj.special_resource_refresh_rule = "Long Rest";
                }
                this.props.onChange(obj);
              }}
            /> 
          </Grid>
          { this.props.obj.resource_consumed !== "None" &&
            <Grid item>
              <StringBox 
                value={this.props.obj.amount_consumed ? `${this.props.obj.amount_consumed}` : null} 
                name="Amount Consumed"
                type="number"
                onBlur={(value: number) => {
                  const obj = this.props.obj;
                  obj.amount_consumed = +value;
                  this.props.onChange(obj);
                }}
              />
            </Grid>
          }
          { this.props.obj.resource_consumed === "Special" &&
            <Grid item>
              <UpgradableNumberBox 
                name="Special Resource Amount"
                value={this.props.obj.special_resource_amount} 
                onChange={(value: UpgradableNumber) => {
                  const obj = this.props.obj;
                  obj.special_resource_amount = value;
                  this.props.onChange(obj);
                }}
              />
            </Grid>
          }
          { this.props.obj.resource_consumed === "Special" &&
            <Grid item>
              <SelectStringBox 
                options={REFRESH_RULES}
                value={ this.state.special_refresh_rule ? "Special" : refresh_rule_helper } 
                name="Refresh Rule"
                onChange={(value: string) => {
                  if (value === "Special") {
                    this.setState({ special_refresh_rule: true });
                  } else {
                    const obj = this.props.obj;
                    obj.special_resource_refresh_rule = value;
                    this.props.onChange(obj);
                    if (this.state.special_refresh_rule) {
                      this.setState({ special_refresh_rule: false });
                    }
                  }
                }}
              />
            </Grid>
          }
          { this.props.obj.resource_consumed === "Special" &&
            <Grid item>
              <StringBox 
                value={ this.props.obj.special_resource_refresh_rule } 
                name="Refresh Rule"
                onBlur={(value: string) => {
                  const obj = this.props.obj;
                  obj.special_resource_refresh_rule = value;
                  this.props.onChange(obj);
                }}
              />
            </Grid>
          }
        </Grid>
      );
    }
  }
}

export default connector(ItemAffectingAbilityInput);
