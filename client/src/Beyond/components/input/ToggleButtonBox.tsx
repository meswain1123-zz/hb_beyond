import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';


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
  value: boolean;
  disabled: boolean;
  name: string;
  image: string;
  color: string;
  onToggle: (() => void) | null; 
  width: number;
  height: number;
  lineHeight: number;
  margin: number;
  fontSize: number;
  bold: boolean;
  border: string;
}

export interface State { 
}

class ToggleButtonBox extends Component<Props, State> {
  public static defaultProps = {
    disabled: false,
    width: -1,
    height: 26,
    lineHeight: 2.5,
    margin: 4,
    fontSize: 11,
    bold: false,
    color: "",
    border: "1px solid blue",
    onToggle: null,
    image: ""
  };
  componentDidMount() {
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}>
        <div style={{
          fontSize: `${this.props.fontSize}px`, 
          fontWeight: (this.props.bold ? "bold" : "inherit"),
          height: `${this.props.height}px`,
          border: this.props.border,
          backgroundColor: (this.props.disabled ? "lightgray" : (this.props.value ? "blue" : "inherit")),
          color: (this.props.value ? "white" : (this.props.color === "" ? "blue" : this.props.color)),
          margin: `${this.props.margin}px`,
          lineHeight: `${this.props.lineHeight}`,
          textAlign: "center",
          cursor: (this.props.disabled ? "inherit" : "pointer"),
          width: (this.props.width > 0 ? `${this.props.width}px` : "100%")
        }} onClick={() => {
          if (!this.props.disabled && this.props.onToggle) {
            this.props.onToggle();
          }
        }}>
          { this.props.image === "" ? 
            <span>{ this.props.name }</span> 
          : 
            <img src={ this.props.image } alt={ this.props.name }
              style={{
                height: `${this.props.height}px`
              }} 
            />
          }
        </div>
      </div>
    );
  }
}

export default connector(ToggleButtonBox);
