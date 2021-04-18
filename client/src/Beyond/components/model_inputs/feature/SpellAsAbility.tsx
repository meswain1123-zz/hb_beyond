import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
import {
  Grid, 
  // Fab, Tooltip, 
  // Button
} from "@material-ui/core";
// import {
//   DeleteForever
// } from "@material-ui/icons";

import { 
  // Ability,
  // AbilityEffect,
  // AbilityTemplate,
  TemplateBase,
  // Spell,
  SpellAsAbility,
  SpellAsAbilityTemplate
} from "../../../models";
import { 
  ABILITY_SCORES, 
  // // DAMAGE_TYPES, 
  // DURATIONS,
  COMPONENTS,
  CASTING_TIMES,
  // RESOURCES,
  REFRESH_RULES
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
// import SelectBox from "../input/SelectBox";
import SelectStringBox from "../../input/SelectStringBox";
// import CheckBox from "../input/CheckBox";
import TemplateBox from "../TemplateBox";
import SelectSpellBox from "../select/SelectSpellBox";
import SelectResourceBox from "../select/SelectResourceBox";

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
  // choice_name: string | null;
  obj: SpellAsAbility;
  onChange: (changed: SpellAsAbility) => void; 
}

export interface State { 
  // obj: SpellAsAbility;
  // loading: boolean;
  reloading: boolean;
  show_effect: number;
  special_refresh_rule: boolean;
}

class SpellAsAbilityInput extends Component<Props, State> {
  // public static defaultProps = {
  //   choice_name: null
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      // obj: new SpellAsAbility(),
      // loading: false,
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
              type="SpellAsAbility"
              useTemplate={(template: TemplateBase) => {
                const ability_template: SpellAsAbilityTemplate = template as SpellAsAbilityTemplate;
                const obj = this.props.obj;
                obj.copyTemplate(ability_template);
                this.props.onChange(obj);
                // this.setState({ obj, reloading: true }, () => {
                //   this.setState({ reloading: false });
                // });
              }}
            />
          </Grid>
          <Grid item>
            <SelectSpellBox 
              name="Spell" 
              value={this.props.obj.spell_id as string} 
              onChange={(id: string) => {
                const obj = this.props.obj;
                obj.spell_id = id;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
          <Grid item container spacing={1} direction="row">
            <Grid item xs={4}>
              <SelectStringBox 
                name="Spellcasting Ability"
                options={["Same as Feat",...ABILITY_SCORES]}
                value={this.props.obj.spellcasting_ability}
                onChange={(value: string) => {
                  const obj = this.props.obj;
                  obj.spellcasting_ability = value;
                  this.props.onChange(obj);
                }}
              /> 
            </Grid>
            <Grid item xs={4}>
              <SelectStringBox 
                name="Override Casting Time"
                options={["Normal","Ritual Only",...CASTING_TIMES]}
                value={this.props.obj.casting_time_override}
                onChange={(value: string) => {
                  const obj = this.props.obj;
                  obj.casting_time_override = value;
                  this.props.onChange(obj);
                }}
              /> 
            </Grid>
            <Grid item xs={4}>
              <SelectStringBox 
                name="Slots"
                options={["Normal","At Will","Only Special Resource","Or Special Resource","And Special Resource"]}
                value={this.props.obj.slot_override}
                onChange={(value: string) => {
                  const obj = this.props.obj;
                  obj.slot_override = value;
                  this.props.onChange(obj);
                }}
              /> 
            </Grid>
            <Grid item xs={4}>
              <SelectStringBox 
                name="Components Override"
                options={[...COMPONENTS, "Don't Override"]}
                values={this.props.obj.components_override}
                multiple
                onChange={(values: string[]) => {
                  const obj = this.props.obj;
                  obj.components_override = values;
                  this.props.onChange(obj);
                }}
              /> 
            </Grid>
          </Grid>
          { this.props.obj.components_override.includes("M") &&
            <Grid item>
              <StringBox 
                name="Material Component"
                value={this.props.obj.material_component_override}
                onBlur={(value: string) => {
                  const obj = this.props.obj;
                  obj.material_component_override = value;
                  this.props.onChange(obj);
                }}
              /> 
            </Grid>
          }
          { this.props.obj.slot_override !== "Normal" && this.props.obj.slot_override !== "At Will" &&
            <Grid item>
              <SelectResourceBox 
                name="Resource Consumed"
                allow_special
                allow_none
                value={ this.props.obj.resource_consumed ? this.props.obj.resource_consumed : "None" }
                onChange={(value: string) => {
                  const obj = this.props.obj;
                  obj.resource_consumed = value;
                  if (value === "Special" && obj.special_resource_refresh_rule === "") {
                    obj.special_resource_refresh_rule = "Long Rest";
                  }
                  this.props.onChange(obj);
                  // this.props.onChange(obj);
                }}
              /> 
            </Grid>
          }
          { this.props.obj.slot_override !== "Normal" && this.props.obj.slot_override !== "At Will" && this.props.obj.resource_consumed && this.props.obj.resource_consumed !== "None" &&
            <Grid item>
              <StringBox 
                value={this.props.obj.amount_consumed ? `${this.props.obj.amount_consumed}` : null} 
                name="Amount Consumed"
                type="number"
                onBlur={(value: number) => {
                  const obj = this.props.obj;
                  obj.amount_consumed = value;
                  this.props.onChange(obj);
                  // this.props.onChange(obj);
                }}
              />
            </Grid>
          }
          { this.props.obj.slot_override !== "Normal" && this.props.obj.slot_override !== "At Will" && this.props.obj.resource_consumed && this.props.obj.resource_consumed === "Special" &&
            <Grid item>
              <StringBox 
                value={`${this.props.obj.special_resource_amount}`} 
                name="Total Amount"
                onBlur={(value: string) => {
                  const obj = this.props.obj;
                  obj.special_resource_amount = value;
                  this.props.onChange(obj);
                  // this.props.onChange(obj);
                }}
              />
            </Grid>
          }
          { this.props.obj.slot_override !== "Normal" && this.props.obj.slot_override !== "At Will" && this.props.obj.resource_consumed && this.props.obj.resource_consumed === "Special" &&
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
          { this.props.obj.slot_override !== "Normal" && this.props.obj.slot_override !== "At Will" && (this.state.special_refresh_rule || refresh_rule_helper === "Special") &&
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

export default connector(SpellAsAbilityInput);
