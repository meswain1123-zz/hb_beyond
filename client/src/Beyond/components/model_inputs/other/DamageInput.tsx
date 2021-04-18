import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
import {
  Grid, Fab, Tooltip, 
  // Button
} from "@material-ui/core";
import {
  DeleteForever, 
  // Add
} from "@material-ui/icons";

import { 
  // Damage,
  RollPlus,
  DiceRoll
} from "../../../models";
import { 
  DAMAGE_TYPES
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";


interface AppState {
  // abilities: Ability[] | null;
  // width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  // abilities: state.app.abilities
  // width: state.app.width
})

const mapDispatch = {
  // setAbilities: (objects: Ability[]) => ({ type: 'SET', dataType: 'abilities', payload: objects })
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
  // public static defaultProps = {
  //   labelWidth: null
  // };
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
          {/* <Tooltip title={`Add Roll`}>
            <Fab size="small" color="primary" style={{marginLeft: "8px"}}
              onClick={ () => {
                const damage = this.props.damage;
                damage.damage_rolls.push(new DiceRoll());
                this.props.onChange();
                this.setState({ reloading: true }, () => {
                  this.setState({ reloading: false });
                });
              }}>
              <Add/>
            </Fab>
          </Tooltip> */}
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
        {/* <Grid item xs={2}>
          <Tooltip title={`Remove Bonus Damage`}>
            <Fab size="small" color="primary" style={{marginLeft: "8px"}}
              onClick={ () => {
                const damage = this.props.damage;
                damage.damage_rolls = damage.damage_rolls.filter(o => o.true_id !== roll.true_id);
                this.props.onChange();
                this.setState({ reloading: true }, () => {
                  this.setState({ reloading: false });
                });
              }}>
              <DeleteForever/>
            </Fab>
          </Tooltip>
        </Grid> */}
      </Grid>
    );
  }
}

export default connector(DamageInput);
