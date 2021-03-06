import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  FormControl, InputLabel,
  OutlinedInput, FormHelperText
} from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";


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
  value: string | null;
  message: string;
  name: string;
  onBlur: Function | null; 
  onChange: Function | null; 
  multiline: boolean;
  labelWidth: number | null;
  type: string;
  color: string;
  disabled: boolean;
}

export interface State { 
  value: string;
  labelWidth: number;
  typeTime: Date | null;
  true_id: string;
}

class StringBox extends Component<Props, State> {
  public static defaultProps = {
    message: "",
    multiline: false,
    labelWidth: null,
    type: "text",
    color: "",
    onChange: null,
    onBlur: null,
    disabled: false
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      true_id: uuidv4().toString(),
      value: props.value ? props.value : "",
      labelWidth: this.getLabelWidth(props.name),
      typeTime: null
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
      <FormControl variant="outlined" fullWidth>
        <InputLabel htmlFor={`stringInput_${this.state.true_id}`}>{this.props.name}</InputLabel>
        <OutlinedInput
          id={`stringInput_${this.state.true_id}`}
          name={`stringInput_${this.state.true_id}`}
          type={this.props.type}
          autoComplete="Off"
          value={this.state.value}
          disabled={this.props.disabled}
          onChange={(event: any) => {
            this.setState({ value: event.target.value }, () => {
              if (this.props.type === "number") {
                if (this.props.onBlur) {
                  const typeTime = new Date();
                  this.setState({ typeTime }, () => {
                    setTimeout(() => {
                      if (this.state.typeTime === typeTime) {
                        if (this.props.onBlur) {
                          this.props.onBlur(this.state.value);
                        }
                      }
                    }, 500);
                  });
                }
              }
              if (this.props.onChange) {
                const typeTime = new Date();
                this.setState({ typeTime }, () => {
                  setTimeout(() => {
                    if (this.state.typeTime === typeTime) {
                      if (this.props.onChange) {
                        this.props.onChange(this.state.value);
                      }
                    }
                  }, 500);
                });
              }
            });
          }}
          onBlur={() => {
            if (this.props.type !== "number") {
              if (this.props.onBlur) {
                this.props.onBlur(this.state.value);
              }
            }
          }}
          labelWidth={ this.props.labelWidth ? this.props.labelWidth : this.state.labelWidth }
          fullWidth
          multiline={this.props.multiline}
        />
        <FormHelperText>
          {this.props.message}
        </FormHelperText>
      </FormControl>
    ); 
  }
}

export default connector(StringBox);
