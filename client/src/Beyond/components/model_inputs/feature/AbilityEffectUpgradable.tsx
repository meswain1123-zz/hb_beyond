import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid,
  Tooltip,
  Fab
} from "@material-ui/core";
import {
  Add
} from "@material-ui/icons";

import { 
  AbilityEffectUpgradable, PotenceUpgradable
} from "../../../models";
import { 
  DAMAGE_TYPES, 
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import CheckBox from "../../input/CheckBox";
import SelectStringBox from "../../input/SelectStringBox"; 
import AbilityPotenceUpgradableInput from "./AbilityPotenceUpgradable"; 
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
  obj: AbilityEffectUpgradable;
  name: string;
  slot_level: number;
  onChange: (changed: AbilityEffectUpgradable) => void;
}

export interface State { 
}

class AbilityEffectUpgradableInput extends Component<Props, State> {
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

  getModalStyle = () => {
    const top = Math.round(window.innerHeight / 2) - 50;
    const left = Math.round(window.innerWidth / 2) - 200;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(${left}px, ${top}px)`,
    };
  }

  render() {
    return (
      <Grid item container spacing={1} direction="column">
        <Grid item>
          <SelectStringBox 
            options={["None","Control","Summon","Transform","Utility","Healing","Max HP","Temp HP","Bonus Roll","Self Condition",...DAMAGE_TYPES]}
            value={this.props.obj.type} 
            name="Effect"
            onChange={(changed: string) => {
              const obj = this.props.obj;
              obj.type = changed;
              this.props.onChange(obj);
            }}
          />
        </Grid>
        { !["None","Control","Summon","Transform","Self Condition"].includes(this.props.obj.type) &&
          <Grid item>
            <SelectStringBox 
              options={["Slot","Character","Class","None"]}
              value={this.props.obj.potence_type} 
              name="Potence Type"
              onChange={(changed: string) => {
                const obj = this.props.obj;
                obj.potence_type = changed;
                this.props.onChange(obj);
              }}
            />
          </Grid>
        }
        { !["None","Self Condition","Summon","Transform"].includes(this.props.obj.type) &&
          <Grid item>
            <SelectStringBox 
              options={["Melee","Ranged","Melee Spell","Ranged Spell","Bonus","Save","None"]}
              value={this.props.obj.attack_type} 
              name="Attack Type"
              onChange={(changed: string) => {
                const obj = this.props.obj;
                obj.attack_type = changed;
                this.props.onChange(obj);
              }}
            />
          </Grid>
        }
        { !["None","Control","Summon","Transform","Self Condition"].includes(this.props.obj.type) &&
          <Grid item>
            <StringBox 
              value={this.props.obj.add_modifier} 
              name="Add Modifier"
              onBlur={(changed: string) => {
                const obj = this.props.obj;
                obj.add_modifier = changed;
                this.props.onChange(obj);
              }}
            />
          </Grid>
        }
        { !["None","Control","Summon","Transform","Self Condition"].includes(this.props.obj.type) &&
          <Grid item>
            <CheckBox 
              value={this.props.obj.use_formula} 
              name="Use Formula"
              onChange={(changed: boolean) => {
                const obj = this.props.obj;
                obj.use_formula = changed;
                this.props.onChange(obj);
              }}
            />
          </Grid>
        }
        { !["None","Control","Summon","Transform","Self Condition"].includes(this.props.obj.type) && this.props.obj.use_formula ?
          <Grid item>
            <StringBox 
              value={this.props.obj.potence_formula} 
              name="Potence Formula"
              onBlur={(changed: string) => {
                const obj = this.props.obj;
                obj.potence_formula = changed;
                this.props.onChange(obj);
              }}
            />
          </Grid>
        : !["None","Control","Self Condition"].includes(this.props.obj.type) &&
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
                    }
                    const potence = new PotenceUpgradable();
                    potence.level = level;
                    obj.potences.push(potence);
                    this.props.onChange(obj);
                  }}>
                  <Add/>
                </Fab>
              </Tooltip>
            </Grid>
            { this.props.obj.potences.map((p, key) => {
              return (
                <Grid item key={key}>
                  <AbilityPotenceUpgradableInput
                    obj={p}
                    onChange={(changed: PotenceUpgradable) => {
                      const obj = this.props.obj;
                      const objFinder = obj.potences.filter(p => p.true_id === changed.true_id);
                      if (objFinder.length === 1) {
                        const potence = objFinder[0];
                        potence.level = changed.level;
                        potence.rolls.count = changed.rolls.count;
                        potence.rolls.size = changed.rolls.size;
                      }
                      this.props.onChange(obj);
                    }}
                    onDelete={() => {
                      const obj = this.props.obj;
                      obj.potences = obj.potences.filter(o => o.true_id !== p.true_id);
                      this.props.onChange(obj);
                    }}
                  />
                </Grid>
              );
            })}
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
                this.props.onChange(obj);
              }}
            />
          </Grid>
        }
      </Grid>
    );
  }
}

export default connector(AbilityEffectUpgradableInput);
