import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid,
  Tooltip,
  Fab
} from "@material-ui/core";
import {
  DeleteForever
} from "@material-ui/icons";

import { 
  PotenceUpgradable,
  UpgradableNumber
} from "../../../models";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox"; 
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
  obj: PotenceUpgradable;
  slot_level: number;
  onChange: (changed: PotenceUpgradable) => void;
  onDelete: () => void;
}

export interface State { 
}

class AbilityPotenceUpgradableInput extends Component<Props, State> {
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
      <Grid item container spacing={1} direction="row">
        <Grid item xs={2}>
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
        <Grid item xs={2}>
          <UpgradableNumberBox 
            name="Flat"
            slot_level={this.props.slot_level}
            value={this.props.obj.rolls.flat} 
            onChange={(value: UpgradableNumber) => {
              const obj = this.props.obj;
              obj.rolls.flat = value;
              this.props.onChange(obj);
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <UpgradableNumberBox 
            name="Dice Count"
            slot_level={this.props.slot_level}
            value={this.props.obj.rolls.count} 
            onChange={(value: UpgradableNumber) => {
              const obj = this.props.obj;
              obj.rolls.count = value;
              this.props.onChange(obj);
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <UpgradableNumberBox 
            name="Dice Size"
            slot_level={this.props.slot_level}
            value={this.props.obj.rolls.size} 
            onChange={(value: UpgradableNumber) => {
              const obj = this.props.obj;
              obj.rolls.size = value;
              this.props.onChange(obj);
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <StringBox 
            value={this.props.obj.extra} 
            name="Extra"
            onBlur={(changed: string) => {
              const obj = this.props.obj;
              obj.extra = changed;
              this.props.onChange(obj);
            }}
          />
        </Grid>
        <Grid item xs={2}>
          <Tooltip title={`Delete Potence`}>
            <Fab size="small" color="primary" style={{marginLeft: "8px"}}
              onClick={ () => {
                this.props.onDelete();
              }}>
              <DeleteForever/>
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
    );
  }
}

export default connector(AbilityPotenceUpgradableInput);
