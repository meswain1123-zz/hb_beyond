import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  DAMAGE_TYPES
} from "../../models/Constants";

import DamageTypeImage from "../model_inputs/display/DamageTypeImage";

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
  disabled: boolean;
  name: string;
  onClick: ((event: React.MouseEvent<HTMLDivElement>) => void) | null; 
  width: number;
  height: number;
  lineHeight: number;
  margin: number;
  fontSize: number;
  image: string;
  find_images: boolean;
  fontWeight: "-moz-initial" | "inherit" | "initial" | "revert" | "unset" | "normal" | (number & {}) | "bold" | "bolder" | "lighter" | undefined;
}

export interface State { 
}

class ButtonBox extends Component<Props, State> {
  public static defaultProps = {
    disabled: false,
    width: -1,
    height: 26,
    lineHeight: 2.5,
    margin: 4,
    fontSize: 11,
    onClick: null,
    image: "",
    find_images: false,
    fontWeight: undefined 
  };
  componentDidMount() {
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: (this.props.width > 0 ? `${this.props.width}px` : "100%")
        }}>
        <div style={{
          fontSize: `${this.props.fontSize}px`, 
          height: `${this.props.height}px`,
          border: "1px solid blue",
          backgroundColor: (this.props.disabled ? "lightgray" : "inherit"),
          color: "blue",
          margin: `${this.props.margin}px`,
          lineHeight: `${this.props.lineHeight}`,
          textAlign: "center",
          cursor: (this.props.disabled ? "inherit" : "pointer"),
          width: (this.props.width > 0 ? `${this.props.width}px` : "100%"),
          fontWeight: this.props.fontWeight
        }} onClick={(event: React.MouseEvent<HTMLDivElement>) => {
          if (!this.props.disabled && this.props.onClick) {
            this.props.onClick(event);
          }
        }}>
          { this.renderContent() }
        </div>
      </div>
    );
  }

  renderContent() {
    if (this.props.find_images) {
      const strs = this.props.name.split(/{|}|,/);
      const return_me: any[] = [];
      strs.forEach(s => {
        const s2 = s.trim();
        if (s2.length > 0) {
          if (DAMAGE_TYPES.includes(s2)) {
            return_me.push(<DamageTypeImage key={return_me.length} image={s2} />);
          } else {
            return_me.push(<span key={return_me.length}>{s2}&nbsp;</span>);
          }
        }
      });
      return return_me;
    } else {
      return [
        <span key="name">{this.props.name}</span>,
        <DamageTypeImage key={0} image={this.props.image} />
      ];
    }
  }
}

export default connector(ButtonBox);
