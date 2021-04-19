import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Tooltip
} from "@material-ui/core";

import { 
  Psychic, 
  Force,
  Poison,
  Acid,
  Radiant,
  Cold,
  Fire,
  Lightning,
  Thunder,
  Healing,
  Necrotic,
  Bludgeoning,
  Piercing,
  Slashing,
  Psychic_White, 
  Force_White,
  Poison_White,
  Acid_White,
  Radiant_White,
  Cold_White,
  Fire_White,
  Lightning_White,
  Thunder_White,
  Healing_White,
  Necrotic_White,
  Bludgeoning_White,
  Piercing_White,
  Slashing_White
} from "../../../models/Images";

interface AppState {
  
}

interface RootState {
  
}

const mapState = (state: RootState) => ({
  
})

const mapDispatch = {
  
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  size: number;
  image: string;
  color: string;
}

export interface State { 
}

class DamageTypeImage extends Component<Props, State> {
  public static defaultProps = {
    size: 10,
    color: "black"
  };
  componentDidMount() {
  }

  render() {
    let image = "";
    switch(this.props.image) {
      case "Bludgeoning": 
        image = this.props.color === "white" ? Bludgeoning_White : Bludgeoning; 
      break;
      case "Piercing": 
        image = this.props.color === "white" ? Piercing_White : Piercing; 
      break;
      case "Slashing": 
        image = this.props.color === "white" ? Slashing_White : Slashing; 
      break;
      case "Psychic": 
        image = this.props.color === "white" ? Psychic_White : Psychic; 
      break;
      case "Force": 
        image = this.props.color === "white" ? Force_White : Force; 
      break;
      case "Poison": 
        image = this.props.color === "white" ? Poison_White : Poison; 
      break;
      case "Acid": 
        image = this.props.color === "white" ? Acid_White : Acid; 
      break;
      case "Radiant": 
        image = this.props.color === "white" ? Radiant_White : Radiant; 
      break;
      case "Cold": 
        image = this.props.color === "white" ? Cold_White : Cold; 
      break;
      case "Fire": 
        image = this.props.color === "white" ? Fire_White : Fire; 
      break;
      case "Lightning": 
        image = this.props.color === "white" ? Lightning_White : Lightning; 
      break;
      case "Thunder": 
        image = this.props.color === "white" ? Thunder_White : Thunder; 
      break;
      case "Healing": 
        image = this.props.color === "white" ? Healing_White : Healing; 
      break;
      case "Necrotic": 
        image = this.props.color === "white" ? Necrotic_White : Necrotic; 
      break;
    }
    if (image === "") {
      return null;
    } else {
      return (
        <Tooltip title={this.props.image}>
          <img src={image} alt={this.props.image} 
            style={{
              width: `${this.props.size}px`,
              height: `${this.props.size}px`
            }} 
          />
        </Tooltip>
      );
    }
  }
}

export default connector(DamageTypeImage);
