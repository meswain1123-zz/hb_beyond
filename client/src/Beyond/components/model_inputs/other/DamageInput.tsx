import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, Fab, Tooltip, 
} from "@material-ui/core";
import {
  DeleteForever, 
} from "@material-ui/icons";

import { 
  RollPlus,
  DiceRoll
} from "../../../models";
import { 
  DAMAGE_TYPES
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";


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
  damage: RollPlus;
  onChange: () => void; 
  onDelete: () => void; 
}

export interface State { 
  reloading: boolean;
}

class DamageInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      reloading: false,
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <Grid item container spacing={1} direction="column">
        <Grid item container spacing={0} direction="row">
          <Grid item xs={2}>
            <Tooltip title={`Delete Damage`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.props.onDelete();
                }}>
                <DeleteForever/>
              </Fab>
            </Tooltip>
          </Grid>
          <Grid item xs={10}>
            <SelectStringBox 
              options={DAMAGE_TYPES}
              value={this.props.damage.type} 
              name="Type"
              onChange={(value: string) => {
                const damage = this.props.damage;
                damage.type = value;
                this.props.onChange();
              }}
            />
          </Grid>
        </Grid>
        <Grid item>
          Dice Rolls
        </Grid>
        { !this.state.reloading && this.renderRoll(this.props.damage) }
      </Grid>
    );
  }

  renderRoll(roll: DiceRoll) {
    return (
      <Grid item container spacing={0} direction="row">
        <Grid item xs={4}>
          <StringBox 
            value={`${roll.count}`} 
            name="Count"
            type="number"
            onChange={(value: string) => {
              roll.count = +value;
              this.props.onChange();
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <SelectStringBox 
            options={["1","4","6","8","10","12"]}
            value={`${roll.size}`} 
            name="Size"
            onChange={(value: string) => {
              roll.size = +value;
              this.props.onChange();
            }}
          />
        </Grid>
        <Grid item xs={4}>
          { roll.size === 1 ? `${roll.count}` : `${roll.count}d${roll.size}`}
        </Grid>
      </Grid>
    );
  }
}

export default connector(DamageInput);
