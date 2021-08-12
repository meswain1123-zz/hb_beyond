import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Add
} from "@material-ui/icons";
import {
  Grid, 
  Tooltip, Fab,
  // Button
} from "@material-ui/core";

import { 
  MinionAbility,
  AbilityEffectUpgradable, 
  UpgradableNumber
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
import UpgradableNumberBox from "../../input/UpgradableNumberBox";
import ToggleButtonBox from "../../input/ToggleButtonBox";

import SelectResourceBox from "../select/SelectResourceBox";

// import TemplateBox from "../TemplateBox";
import AbilityEffectUpgradableInput from "./AbilityEffectUpgradable";

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
  obj: MinionAbility;
  slot_level: number;
  onChange: (changed: MinionAbility) => void; 
}

export interface State {
  reloading: boolean;
  show_effect: string;
  special_refresh_rule: boolean;
}

class MinionAbilityInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      reloading: false,
      show_effect: "",
      special_refresh_rule: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  render() {
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
                if (value === 'A') {
                  obj.casting_time = value;
                } else if (value === 'BA') {
                  obj.casting_time = value;
                } else if (value === 'RA') {
                  obj.casting_time = value;
                } else if (value === 'Special') {
                  obj.casting_time = value;
                } else if (value === 'Attack') {
                  obj.casting_time = value;
                }
                this.props.onChange(obj);
              }}
            /> 
          </Grid>
          <Grid item xs={2}>
            <UpgradableNumberBox 
              name="Attack Bonus"
              slot_level={this.props.slot_level}
              value={this.props.obj.attack_bonus} 
              onChange={(value: UpgradableNumber) => {
                const obj = this.props.obj;
                obj.attack_bonus = value;
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
          <Grid item xs={2}>
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
          <Grid item xs={2}>
            <UpgradableNumberBox 
              name="DC"
              slot_level={this.props.slot_level}
              value={this.props.obj.dc} 
              onChange={(value: UpgradableNumber) => {
                const obj = this.props.obj;
                obj.dc = value;
                this.props.onChange(obj);
              }}
            />
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
        <Grid item container spacing={1} direction="column">
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              Effects
            </span>
            <Tooltip title={`Add Effect`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  const obj = this.props.obj;
                  const effect = new AbilityEffectUpgradable();
                  obj.effects.push(effect);
                  this.props.onChange(obj);
                  this.setState({ show_effect: effect.true_id });
                }}>
                <Add/>
              </Fab>
            </Tooltip>
          </Grid>
          { !this.state.reloading && this.props.obj.effects.map((effect, key) => {
            let name = effect.type;
            if (!["None","Self Condition"].includes(effect.type) && effect.attack_type !== "None") {
              name += ` ${effect.attack_type}`
            }
            return (
              <Grid item key={key} container spacing={1} direction="column">
                <Grid item>
                  <ToggleButtonBox
                    name={ name }
                    value={ this.state.show_effect === effect.true_id }
                    onToggle={ () => { 
                      this.setState({ show_effect: (this.state.show_effect === effect.true_id ? "" : effect.true_id) });
                    }}
                  />
                </Grid>
                { this.state.show_effect === effect.true_id && 
                  <Grid item>
                    <AbilityEffectUpgradableInput 
                      obj={effect}
                      slot_level={this.props.slot_level}
                      name="Effect"
                      onChange={() => {
                        const obj = this.props.obj;
                        this.props.onChange(obj);
                      }}
                      onDelete={() => {
                        const obj = this.props.obj;
                        obj.effects = obj.effects.filter(o => o.true_id !== effect.true_id);
                        this.props.onChange(obj);
                        this.setState({ reloading: true }, () => { this.setState({ reloading: false }); });
                      }}
                    />
                  </Grid>        
                }
              </Grid>
            );
          })}
        </Grid>
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
        { this.props.obj.resource_consumed && this.props.obj.resource_consumed !== "None" &&
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
        { this.props.obj.resource_consumed && this.props.obj.resource_consumed === "Special" &&
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

export default connector(MinionAbilityInput);
