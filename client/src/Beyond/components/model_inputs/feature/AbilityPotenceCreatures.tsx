import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid,
  Tooltip,
  Fab
} from "@material-ui/core";
import {
  DeleteForever, Add
} from "@material-ui/icons";

import { 
  Potence,
  SummonOption,
  SummonStatBlock
} from "../../../models";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox"; 
import ToggleButtonBox from "../../input/ToggleButtonBox"; 

import DisplayObjects from "../display/DisplayObjects"; 

import SelectCreatureTypeBox from "../select/SelectCreatureTypeBox";
import SelectCreatureSubtypeBox from "../select/SelectCreatureSubtypeBox";
import SelectCreatureBox from "../select/SelectCreatureBox";

import SummonStatBlockInput from "./SummonStatBlock";

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
  obj: Potence;
  slot_level: number;
  onChange: (changed: Potence) => void;
  onDelete: () => void;
}

export interface State { 
  expanded_option: string;
}

class AbilityPotenceCreaturesInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expanded_option: ""
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
      <Grid item container spacing={1} direction="row">
        <Grid item xs={4}>
          <SelectStringBox 
            options={["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"]}
            value={`${this.props.obj.level}`} 
            name="Level"
            onChange={(changed: string) => {
              const obj = this.props.obj;
              obj.level = +changed;
              this.props.onChange(obj);
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <span className={"MuiTypography-root MuiListItemText-primary header"}>
            Options
          </span>
          <Tooltip title={`Add Option`}>
            <Fab size="small" color="primary" style={{marginLeft: "8px"}}
              onClick={ () => {
                const obj = this.props.obj;
                obj.summon_options.push(new SummonOption());
                this.props.onChange(obj);
              }}>
              <Add/>
            </Fab>
          </Tooltip>
        </Grid>
        <Grid item xs={4}>
          <Tooltip title={`Delete Potence`}>
            <Fab size="small" color="primary" style={{marginLeft: "8px"}}
              onClick={ () => {
                this.props.onDelete();
              }}>
              <DeleteForever/>
            </Fab>
          </Tooltip>
        </Grid>
        { this.props.obj.summon_options.map((option, key) => {
          return (
            <Grid item xs={12} key={key} container spacing={1} direction="row">
              <Grid item xs={2}>
                <ToggleButtonBox 
                  value={option.true_id === this.state.expanded_option} 
                  name="Expand"
                  onToggle={() => {
                    if (option.true_id === this.state.expanded_option) {
                      this.setState({ expanded_option: "" });
                    } else {
                      this.setState({ expanded_option: option.true_id });
                    }
                  }}
                />
              </Grid>
              { option.true_id === this.state.expanded_option && 
                <Grid item xs={4}>
                  <ToggleButtonBox 
                    value={option.custom} 
                    name="Custom"
                    onToggle={() => {
                      option.custom = !option.custom;
                      if (!option.custom_stat_block) {
                        option.custom_stat_block = new SummonStatBlock();
                      }
                      const obj = this.props.obj;
                      this.props.onChange(obj);
                    }}
                  />
                </Grid>
              }
              { option.true_id === this.state.expanded_option && 
                <Grid item xs={4}>
                  { !option.custom &&
                    <ToggleButtonBox 
                      value={option.specific} 
                      name="Specific"
                      onToggle={() => {
                        option.specific = !option.specific;
                        const obj = this.props.obj;
                        this.props.onChange(obj);
                      }}
                    />
                  }
                </Grid>
              }
              { option.true_id !== this.state.expanded_option && 
                <Grid item xs={8}>
                  { option.custom && option.custom_stat_block ? <span>{ option.custom_stat_block.name }</span> : (option.specific ? <DisplayObjects type="creature" ids={[option.specific_id]} /> : <span>{ option.creature_type }</span>) }
                </Grid>
              }
              <Grid item xs={2}>
                <Tooltip title={`Delete Option`}>
                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                    onClick={ () => {
                      const obj = this.props.obj;
                      obj.summon_options = obj.summon_options.filter(o => o.true_id !== option.true_id);
                      this.props.onChange(obj);
                    }}>
                    <DeleteForever/>
                  </Fab>
                </Tooltip>
              </Grid>
              { option.true_id === this.state.expanded_option && !option.custom &&
                <Grid item xs={6}>
                  <SelectCreatureTypeBox 
                    value={option.creature_type} 
                    name="Creature Type"
                    allow_any
                    onChange={(changed: string) => {
                      option.creature_type = changed;
                      const obj = this.props.obj;
                      this.props.onChange(obj);
                    }}
                  />
                </Grid>
              }
              { option.true_id === this.state.expanded_option && !option.custom &&
                <Grid item xs={6}>
                  { option.creature_type !== "" &&
                    <SelectCreatureSubtypeBox 
                      value={option.subtype} 
                      name="Subtype"
                      creature_type={option.creature_type}
                      allow_any
                      onChange={(changed: string) => {
                        option.subtype = changed;
                        const obj = this.props.obj;
                        this.props.onChange(obj);
                      }}
                    />
                  }
                </Grid>
              }
              { option.true_id === this.state.expanded_option && !option.custom &&
                <Grid item xs={4}>
                  <StringBox 
                    value={`${option.challenge_rating}`} 
                    name="Max Challenge Rating"
                    type="number"
                    onBlur={(changed: string) => {
                      option.challenge_rating = +changed;
                      const obj = this.props.obj;
                      this.props.onChange(obj);
                    }}
                  />
                </Grid>
              }
              { option.true_id === this.state.expanded_option &&
                <Grid item xs={4}>
                  <StringBox 
                    value={`${option.count}`} 
                    name="Count"
                    type="number"
                    onBlur={(changed: string) => {
                      option.count = +changed;
                      const obj = this.props.obj;
                      this.props.onChange(obj);
                    }}
                  />
                </Grid>
              }
              { option.true_id === this.state.expanded_option && !option.custom &&
                <Grid item xs={4}>
                  <SelectStringBox 
                    options={["Any","Tiny","Small","Medium","Large","Huge","Gargantuan"]}
                    value={option.size} 
                    name="Size"
                    onChange={(changed: string) => {
                      option.size = changed;
                      const obj = this.props.obj;
                      this.props.onChange(obj);
                    }}
                  />
                </Grid>
              }
              { option.true_id === this.state.expanded_option && !option.custom &&
                <Grid item xs={4}>
                  <ToggleButtonBox 
                    value={option.flying} 
                    name="Can Fly"
                    onToggle={() => {
                      option.flying = !option.flying;
                      const obj = this.props.obj;
                      this.props.onChange(obj);
                    }}
                  />
                </Grid>
              }
              { option.true_id === this.state.expanded_option && !option.custom &&
                <Grid item xs={4}>
                  <ToggleButtonBox 
                    value={option.swimming} 
                    name="Can Swim"
                    onToggle={() => {
                      option.swimming = !option.swimming;
                      const obj = this.props.obj;
                      this.props.onChange(obj);
                    }}
                  />
                </Grid>
              }
              { option.true_id === this.state.expanded_option && !option.custom && option.specific &&
                <Grid item xs={4}>
                  {/* <SelectCreatureBox 
                    value={option.specific_id} 
                    name="Specific Creature"
                    creature_types={[option.creature_type]}
                    subtypes={[option.subtype]}
                    swimming={option.swimming}
                    flying={option.flying}
                    onChange={(changed: string) => {
                      option.specific_id = changed;
                      const obj = this.props.obj;
                      this.props.onChange(obj);
                    }}
                  /> */}
                </Grid>
              }
              { option.true_id === this.state.expanded_option && option.custom && option.custom_stat_block && 
                <Grid item xs={12} container spacing={1} direction="row">
                  <SummonStatBlockInput 
                    obj={option.custom_stat_block}
                    slot_level={this.props.slot_level}
                    onChange={() => {
                      const obj = this.props.obj;
                      this.props.onChange(obj);
                    }}
                  />
                </Grid>
              }
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default connector(AbilityPotenceCreaturesInput);
