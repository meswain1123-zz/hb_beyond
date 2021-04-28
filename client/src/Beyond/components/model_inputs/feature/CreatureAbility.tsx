import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
  Button
} from "@material-ui/core";

import { 
  CreatureAbility,
  AbilityEffect, 
} from "../../../models";
import { 
  ABILITY_SCORES, 
  DURATIONS,
  COMPONENTS,
  CASTING_TIMES,
  REFRESH_RULES
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";
import CheckBox from "../../input/CheckBox";

import SelectResourceBox from "../select/SelectResourceBox";
import AbilityEffectInput from "./AbilityEffect";

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
  obj: CreatureAbility;
  onChange: (changed: CreatureAbility) => void; 
}

export interface State { 
  reloading: boolean;
  show_effect: number;
  special_refresh_rule: boolean;
}

class CreatureAbilityInput extends Component<Props, State> {
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
          <Grid item container spacing={1} direction="row">
            <Grid item xs={2}>
              <SelectStringBox 
                name="Casting Time"
                options={CASTING_TIMES}
                value={this.props.obj.casting_time}
                onChange={(value: string) => {
                  const obj = this.props.obj;
                  obj.casting_time = value;
                  this.props.onChange(obj);
                }}
              /> 
            </Grid>
            <Grid item xs={2}>
              <StringBox
                name="Attack Bonus"
                value={`${this.props.obj.attack_bonus}`}
                onBlur={(value: string) => {
                  const obj = this.props.obj;
                  obj.attack_bonus = +value;
                  this.props.onChange(obj);
                }}
              />
            </Grid>
            <Grid item xs={4} container spacing={1} direction="row">
              <Grid item xs={6}>
                <StringBox 
                  value={this.props.obj.range} 
                  name="Range"
                  onBlur={(value: string) => {
                    const obj = this.props.obj;
                    obj.range = value;
                    this.props.onChange(obj);
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <StringBox 
                  value={this.props.obj.range_2} 
                  name="Area"
                  onBlur={(value: string) => {
                    const obj = this.props.obj;
                    obj.range_2 = value;
                    this.props.onChange(obj);
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <SelectStringBox 
                name="Components"
                options={COMPONENTS}
                values={this.props.obj.components}
                multiple
                onChange={(values: string[]) => {
                  const obj = this.props.obj;
                  obj.components = values;
                  this.props.onChange(obj);
                }}
              /> 
            </Grid>
          </Grid>
          <Grid item container spacing={1} direction="row">
            <Grid item xs={4} container spacing={1} direction="row">
              <Grid item xs={ this.props.obj.duration === "Instantaneous" ? 12 : 9}>
                <SelectStringBox 
                  name="Duration"
                  options={DURATIONS}
                  value={ !DURATIONS.includes(this.props.obj.duration) ? "Special" : this.props.obj.duration }
                  onChange={(value: string) => {
                    const obj = this.props.obj;
                    obj.duration = value;
                    this.props.onChange(obj);
                  }}
                /> 
              </Grid>
              { this.props.obj.duration !== "Instantaneous" && 
                <Grid item xs={3}>
                  <CheckBox 
                    name="C" 
                    value={this.props.obj.concentration} 
                    onChange={(e: boolean) => {
                      const obj = this.props.obj;
                      obj.concentration = e;
                      this.props.onChange(obj);
                    }} 
                  />
                </Grid>
              } 
              { (this.props.obj.duration === "Special" || !DURATIONS.includes(this.props.obj.duration)) && 
                <Grid item xs={12}>
                  <StringBox 
                    name="Duration"
                    value={this.props.obj.duration === "Special" ? "" : this.props.obj.duration}
                    onBlur={(value: string) => {
                      const obj = this.props.obj;
                      obj.duration = value;
                      this.props.onChange(obj);
                    }}
                  /> 
                </Grid>
              } 
            </Grid>
            <Grid item xs={4}>
              <SelectStringBox 
                name="Saving Throw"
                options={ABILITY_SCORES}
                value={this.props.obj.saving_throw_ability_score}
                onChange={(value: string) => {
                  const obj = this.props.obj;
                  obj.saving_throw_ability_score = value;
                  this.props.onChange(obj);
                }}
              /> 
            </Grid>
            <Grid item xs={4} container spacing={1} direction="row">
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color={ this.state.show_effect === 1 ? "primary" : "default" }
                  onClick={ () => { 
                    this.setState({ show_effect: (this.state.show_effect === 1 ? 0 : 1) });
                  }}>
                  { this.props.obj.effect.type } { ["None","Self Condition"].includes(this.props.obj.effect.type) || this.props.obj.effect.attack_type === "None" ? "" : this.props.obj.effect.attack_type }
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color={ this.state.show_effect === 2 ? "primary" : "default" }
                  onClick={ () => { 
                    this.setState({ show_effect: (this.state.show_effect === 2 ? 0 : 2) });
                  }}>
                  { this.props.obj.effect_2.type } { ["None","Self Condition"].includes(this.props.obj.effect_2.type) || this.props.obj.effect_2.attack_type === "None" ? "" : this.props.obj.effect_2.attack_type }
                </Button>
              </Grid>
            </Grid>
          </Grid>
          { this.props.obj.components.includes("M") &&
            <Grid item>
              <StringBox 
                name="Material Component"
                value={this.props.obj.material_component}
                onBlur={(value: string) => {
                  const obj = this.props.obj;
                  obj.material_component = value;
                  this.props.onChange(obj);
                }}
              /> 
            </Grid>
          }
          { this.state.show_effect === 1 &&
            <Grid item>
              <AbilityEffectInput 
                obj={this.props.obj.effect}
                name="Effect 1"
                onChange={(changed: AbilityEffect) => {
                  const obj = this.props.obj;
                  obj.effect = changed;
                  this.props.onChange(obj);
                }}
              />
            </Grid>
          }
          { this.state.show_effect === 2 &&
            <Grid item>
              <AbilityEffectInput 
                obj={this.props.obj.effect_2}
                name="Effect 2"
                onChange={(changed: AbilityEffect) => {
                  const obj = this.props.obj;
                  obj.effect_2 = changed;
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
              // allow_slot
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
          { this.props.obj.resource_consumed && this.props.obj.resource_consumed !== "None" &&
            <Grid item>
              <StringBox 
                value={this.props.obj.amount_consumed ? `${this.props.obj.amount_consumed}` : null} 
                name="Amount Consumed"
                type="number"
                onBlur={(value: number) => {
                  const obj = this.props.obj;
                  obj.amount_consumed = value;
                  this.props.onChange(obj);
                }}
              />
            </Grid>
          }
          { this.props.obj.resource_consumed && this.props.obj.resource_consumed === "Special" &&
            <Grid item>
              <StringBox 
                value={`${this.props.obj.special_resource_amount}`} 
                name="Total Amount"
                onBlur={(value: string) => {
                  const obj = this.props.obj;
                  obj.special_resource_amount = value;
                  this.props.onChange(obj);
                }}
              />
            </Grid>
          }
          { this.props.obj.resource_consumed && this.props.obj.resource_consumed === "Special" &&
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
        </Grid>
      );
    }
  }
}

export default connector(CreatureAbilityInput);
