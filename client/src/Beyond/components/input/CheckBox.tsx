import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
import {
  CheckBoxOutlineBlank, 
  CheckBox as CheckBoxIcon
} from "@material-ui/icons";
// import {
//   FormControlLabel, Checkbox
// } from "@material-ui/core";

// import { ModelBase } from "../../models/ModelBase";


interface AppState {
  // abilities: Ability[] | null;
}

interface RootState {
  // app: AppState
}

const mapState = (state: RootState) => ({
  // abilities: state.app.abilities
})

const mapDispatch = {
  // setAbilities: (objects: Ability[]) => ({ type: 'SET', dataType: 'abilities', payload: objects })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  icon: string;
  size: number;
  value: boolean;
  disabled: boolean;
  name: string;
  onChange: Function; 
}

export interface State { 
}

class CheckBox extends Component<Props, State> {
  public static defaultProps = {
    disabled: false,
    icon: "",
    size: 0
  };
  componentDidMount() {
  }

  render() {
    const size = `${this.props.size}px`;
    return (
      <span style={{ cursor: "pointer" }}
        onClick={() => {
          this.props.onChange(!this.props.value);
        }}>
        <span style={{ display: "inline" }}>
          { this.props.value && this.props.size > 0 ?
            <CheckBoxIcon style={{ width: size, height: size }} />
          : this.props.value ?
            <CheckBoxIcon />
          : this.props.size > 0 ?
            <CheckBoxOutlineBlank style={{ width: size, height: size }} />
          : 
            <CheckBoxOutlineBlank />
          }
        </span>
        { this.props.name.length > 0 ? <span style={{ display: "inline" }}>&nbsp;{ this.props.name }</span> : null }
      </span>
    );
  }

  // render() {
  //   return (
  //     <FormControlLabel
  //       control={
  //         <Checkbox disabled={this.props.disabled} checked={this.props.value} onChange={e => {
  //           this.props.onChange(e.target.checked);
  //         }}
  //         color="primary" />
  //       }
  //       label={this.props.name}
  //     />
  //   );
  // }
}

export default connector(CheckBox);
