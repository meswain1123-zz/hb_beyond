import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
import {
  ArrowBack
} from "@material-ui/icons";
import {
  Grid,
  Tooltip,
  Fab
} from "@material-ui/core";

import { 
  UpgradableNumber
} from "../../models";

import StringBox from "./StringBox";

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
  value: UpgradableNumber;
  name: string;
  onChange: (changed: UpgradableNumber) => void; 
  slot_level: number;
  labelWidth: number | null;
  color: string;
}

export interface State { 
  // value: string;
  // values: string[];
  labelWidth: number;
  editing: string;
}


class UpgradableNumberBox extends Component<Props, State> {
  public static defaultProps = {
    labelWidth: null,
    color: "",
    slot_level: -1
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      labelWidth: this.getLabelWidth(props.name),
      editing: ""
    };
  }

  componentDidMount() {
  }

  getLabelWidth(name: string) {
    let smallCount = 
      this.countOccurences(name, "i") +
      this.countOccurences(name, "l") +
      this.countOccurences(name, "I") +
      this.countOccurences(name, "t") +
      this.countOccurences(name, "r") +
      this.countOccurences(name, " ");

    return ((name.length - smallCount) * 10 + smallCount * 4);
  }

  countOccurences(searchMe: string, findMe: string) {
    return searchMe.split(findMe).length - 1;
  }

  render() {
    if (this.props.color !== "") {
      return (
        <div style={{
          border: "1px solid #1C9AEF"
        }}>
          { this.renderControl() }
        </div>
      );
    } else {
      return this.renderControl();
    }
  }

  renderControl() {
    return (
      <Grid container spacing={0} direction="column">
        { this.state.editing === "" &&
          <Grid item>
            { this.props.name }
          </Grid>
        }
        { this.state.editing === "" &&
          <Grid item style={{ fontSize: "8px" }}>
            <span style={{ cursor: "pointer" }} 
              onClick={() => {
                this.setState({ editing: "Base" });
              }}>{ this.props.value.base }</span> + 
            <span style={{ cursor: "pointer" }} 
              onClick={() => {
                this.setState({ editing: "Char" });
              }}>{ this.props.value.add_char_level_mult } * Char. Level</span> +
            <span style={{ cursor: "pointer" }} 
              onClick={() => {
                this.setState({ editing: "Class" });
              }}>{ this.props.value.add_class_level_mult } * Class Level</span> +
            <span style={{ cursor: "pointer" }} 
              onClick={() => {
                this.setState({ editing: "Prof" });
              }}>{ this.props.value.add_prof_bonus_mult } * Prof. Bonus</span> +
            { this.props.slot_level > 0 &&
              <span style={{ cursor: "pointer" }} 
              onClick={() => {
                this.setState({ editing: "Upcast" });
              }}>(Slot Level - { this.props.slot_level }) * { this.props.value.add_slot_level_mult }</span>
            }
          </Grid>
        }
        { this.state.editing !== "" &&
          <Grid item container spacing={0} direction="row">
            <Grid item xs={9}>
              { this.state.editing === "Base" ?
                <StringBox
                  name="Base"
                  value={`${this.props.value.base}`}
                  type="number"
                  onBlur={(changed: string) => {
                    const value = this.props.value;
                    value.base = +changed;
                    this.props.onChange(value);
                  }}
                />
              : this.state.editing === "Char" ?
                <StringBox
                  name="Char. Level Multiplier"
                  value={`${this.props.value.add_char_level_mult}`}
                  type="number"
                  onBlur={(changed: string) => {
                    const value = this.props.value;
                    value.add_char_level_mult = +changed;
                    this.props.onChange(value);
                  }}
                />
              : this.state.editing === "Class" ?
                <StringBox
                  name="Class Level Multiplier"
                  value={`${this.props.value.add_class_level_mult}`}
                  type="number"
                  onBlur={(changed: string) => {
                    const value = this.props.value;
                    value.add_class_level_mult = +changed;
                    this.props.onChange(value);
                  }}
                />
              : this.state.editing === "Prof" ?
                <StringBox
                  name="Prof. Bonus Multiplier"
                  value={`${this.props.value.add_prof_bonus_mult}`}
                  type="number"
                  onBlur={(changed: string) => {
                    const value = this.props.value;
                    value.add_prof_bonus_mult = +changed;
                    this.props.onChange(value);
                  }}
                />
              : this.state.editing === "Upcast" &&
                <StringBox
                  name="Upcast Multiplier"
                  value={`${this.props.value.add_slot_level_mult}`}
                  type="number"
                  onBlur={(changed: string) => {
                    const value = this.props.value;
                    value.add_slot_level_mult = +changed;
                    this.props.onChange(value);
                  }}
                />
              }
            </Grid>
            <Grid item xs={3}>
              <Tooltip title={`Back`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ editing: "" });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
            </Grid>
          </Grid>
        }
      </Grid>
    );
  }
}

export default connector(UpgradableNumberBox);
