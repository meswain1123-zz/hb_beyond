import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Add, DeleteForever
} from "@material-ui/icons";
import {
  Grid,
  Tooltip,
  Fab
} from "@material-ui/core";

import { 
  AbilityEffect, 
  Potence,
  UpgradableNumber
} from "../../../models";
import { 
  DAMAGE_TYPES, 
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox"; 
import UpgradableNumberBox from "../../input/UpgradableNumberBox";

import SelectResourceBox from "../select/SelectResourceBox";

import AbilityPotenceInput from "./AbilityPotence"; 
import AbilityPotenceCreaturesInput from "./AbilityPotenceCreatures"; 
import SelectConditionBox from "../select/SelectConditionBox";

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
  obj: AbilityEffect;
  slot_level: number;
  onChange: () => void;
  onDelete: () => void;
}

export interface State { 
}

class AbilityEffectInput extends Component<Props, State> {
  public static defaultProps = {
    slot_level: -1
  };
  constructor(props: Props) {
    super(props);
    this.state = {
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  render() {
    return (
      <Grid item container spacing={1} direction="column">
        <Grid item>
          <Tooltip title={`Delete`}>
            <Fab size="small" color="primary" style={{marginLeft: "8px"}}
              onClick={ () => {
                this.props.onDelete();
              }}>
              <DeleteForever/>
            </Fab>
          </Tooltip>
          <SelectStringBox 
            options={["None","Control","Summon","Transform","Create Resource","Utility","Healing","Max HP","Temp HP","Bonus Roll","Self Condition",...DAMAGE_TYPES]}
            value={this.props.obj.type} 
            name="Effect"
            onChange={(changed: string) => {
              const obj = this.props.obj;
              obj.type = changed;
              this.props.onChange();
            }}
          />
        </Grid>
        { !["None","Control"].includes(this.props.obj.type) &&
          <Grid item>
            <SelectStringBox 
              options={["Slot","Character","Class","None"]}
              value={this.props.obj.potence_type} 
              name="Potence Type"
              onChange={(changed: string) => {
                const obj = this.props.obj;
                obj.potence_type = changed;
                this.props.onChange();
              }}
            />
          </Grid>
        }
        { !["None","Self Condition","Summon"].includes(this.props.obj.type) &&
          <Grid item>
            <SelectStringBox 
              options={["Melee","Ranged","Melee Spell","Ranged Spell","Bonus","Save","None"]}
              value={this.props.obj.attack_type} 
              name="Attack Type"
              onChange={(changed: string) => {
                const obj = this.props.obj;
                obj.attack_type = changed;
                this.props.onChange();
              }}
            />
          </Grid>
        }
        { !["None","Control","Summon","Transform","Create Resource","Self Condition"].includes(this.props.obj.type) &&
          <Grid item>
            <StringBox 
              value={this.props.obj.add_modifier} 
              name="Add Modifier"
              onBlur={(changed: string) => {
                const obj = this.props.obj;
                obj.add_modifier = changed;
                this.props.onChange();
              }}
            />
          </Grid>
        }
        { !["None","Control","Self Condition"].includes(this.props.obj.type) &&
          <Grid item container spacing={1} direction="column">
            <Grid item>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Potences
              </span>
              <Tooltip title={`Add Potence`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    const obj = this.props.obj;
                    let level = 1;
                    let count = 1;
                    let size = 1;
                    if (obj.potences.length > 0) {
                      const last = obj.potences[obj.potences.length - 1];
                      level = last.level + 1;
                      count = last.rolls.count;
                      size = last.rolls.size;
                    }
                    const potence = new Potence();
                    potence.level = level;
                    potence.rolls.count = count;
                    potence.rolls.size = size;
                    obj.potences.push(potence);
                    this.props.onChange();
                  }}>
                  <Add/>
                </Fab>
              </Tooltip>
            </Grid>
            { this.props.obj.potences.map((p, key) => {
              if (["Summon","Transform"].includes(this.props.obj.type)) {
                return (
                  <Grid item key={key}>
                    <AbilityPotenceCreaturesInput
                      obj={p}
                      slot_level={this.props.slot_level}
                      onChange={(changed: Potence) => {
                        const obj = this.props.obj;
                        const objFinder = obj.potences.filter(p => p.true_id === changed.true_id);
                        if (objFinder.length === 1) {
                          const potence = objFinder[0];
                          potence.level = changed.level;
                          potence.rolls.count = changed.rolls.count;
                          potence.rolls.size = changed.rolls.size;
                        }
                        this.props.onChange();
                      }}
                      onDelete={() => {
                        const obj = this.props.obj;
                        obj.potences = obj.potences.filter(o => o.true_id !== p.true_id);
                        this.props.onChange();
                      }}
                    />
                  </Grid>
                );
              } else {
                return (
                  <Grid item key={key}>
                    <AbilityPotenceInput
                      obj={p}
                      onChange={(changed: Potence) => {
                        const obj = this.props.obj;
                        const objFinder = obj.potences.filter(p => p.true_id === changed.true_id);
                        if (objFinder.length === 1) {
                          const potence = objFinder[0];
                          potence.level = changed.level;
                          potence.rolls.count = changed.rolls.count;
                          potence.rolls.size = changed.rolls.size;
                        }
                        this.props.onChange();
                      }}
                      onDelete={() => {
                        const obj = this.props.obj;
                        obj.potences = obj.potences.filter(o => o.true_id !== p.true_id);
                        this.props.onChange();
                      }}
                    />
                  </Grid>
                );
              }
            })}
          </Grid>
        }
        { !["None","Control","Summon","Transform","Create Resource","Self Condition"].includes(this.props.obj.type) &&
          <Grid item>
            <UpgradableNumberBox 
              value={this.props.obj.bonus} 
              name="Bonus"
              onChange={(changed: UpgradableNumber) => {
                const obj = this.props.obj;
                obj.bonus = changed;
                this.props.onChange();
              }}
            />
          </Grid>
        }
        { this.props.obj.type === "Self Condition" &&
          <Grid item>
            <SelectConditionBox
              name="Apply Conditions"
              multiple
              values={this.props.obj.conditions_applied}
              onChange={(ids: string[]) => {
                const obj = this.props.obj;
                obj.conditions_applied = ids;
                this.props.onChange();
              }}
            />
          </Grid>
        }
        { this.props.obj.type === "Create Resource" &&
          <Grid item>
            <SelectResourceBox 
              name="Resource Created"
              allow_none
              allow_slot
              value={ this.props.obj.create_resource_type }
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.create_resource_type = value;
                this.props.onChange();
              }}
            /> 
          </Grid>
        }
        { this.props.obj.type === "Create Resource" && this.props.obj.create_resource_type === "Slot" &&
          <Grid item>
            <StringBox 
              name="Slot Level"
              value={ `${this.props.obj.create_resource_level}` }
              type="number"
              onBlur={(value: string) => {
                const obj = this.props.obj;
                obj.create_resource_level = +value;
                this.props.onChange();
              }}
            /> 
          </Grid>
        }
        { this.props.obj.type === "Create Resource" &&
          <Grid item>
            <UpgradableNumberBox 
              value={this.props.obj.create_resource_amount} 
              name="Amount Created"
              slot_level={1}
              onChange={(changed: UpgradableNumber) => {
                const obj = this.props.obj;
                obj.create_resource_amount = changed;
                this.props.onChange();
              }}
            />
          </Grid>
        }
      </Grid>
    );
  }
}

export default connector(AbilityEffectInput);
