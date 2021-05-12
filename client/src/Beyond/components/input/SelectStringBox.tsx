import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  FormControl, InputLabel,
  Select, MenuItem, Input,
  Checkbox, ListItemText
} from "@material-ui/core";


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
  value: any;
  values: any[];
  options: any[] | null;
  option_map: any;
  display_map: any;
  name: string;
  onChange: Function; 
  labelWidth: number | null;
  multiple: boolean;
  color: string;
}

export interface State { 
  labelWidth: number;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class SelectStringBox extends Component<Props, State> {
  public static defaultProps = {
    labelWidth: null,
    multiple: false,
    value: "",
    values: [],
    options: null,
    option_map: null,
    display_map: null,
    color: ""
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      labelWidth: this.getLabelWidth(props.name)
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
    if (this.props.option_map) {
      return (
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor={`selectInput_${this.props.name}`}>{this.props.name}</InputLabel>
          { this.props.multiple ? 
            <Select
              labelId={`selectInput_${this.props.name}`}
              id={`selectInput_${this.props.name}`}
              multiple
              multiline
              fullWidth
              value={this.props.values}
              labelWidth={ this.props.labelWidth ? this.props.labelWidth : this.state.labelWidth }
              onChange={(event: any) => {
                this.props.onChange(event.target.value as string[]);
              }}
              input={<Input />}
              renderValue={(selected) => (selected as string[]).join(', ')}
              MenuProps={MenuProps}
            >
              { Object.keys(this.props.option_map).map((key: string, i: any) => {
                const opt = this.props.option_map[key];
                return (
                  <MenuItem key={i} value={opt}>
                    <Checkbox checked={this.props.values.indexOf(opt) > -1} />
                    <ListItemText primary={key} />
                  </MenuItem>
                );
              })}
            </Select>
          :
            <Select
              labelId={`selectInput_${this.props.name}`}
              id={`selectInput_${this.props.name}`}
              value={this.props.value? this.props.value : ""}
              onChange={(event: any) => {
                this.props.onChange(event.target.value);
              }}
              fullWidth
              labelWidth={ this.props.labelWidth ? this.props.labelWidth : this.state.labelWidth }
            >
              { Object.keys(this.props.option_map).map((key: string, i: any) => {
                return (<MenuItem key={i} value={this.props.option_map[key]}>{key}</MenuItem>);
              })}
            </Select>
          }
        </FormControl>
      );
    } else if (this.props.display_map) {
      return (
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor={`selectInput_${this.props.name}`}>{this.props.name}</InputLabel>
          { this.props.multiple ? 
            <Select
              labelId={`selectInput_${this.props.name}`}
              id={`selectInput_${this.props.name}`}
              multiple
              multiline
              fullWidth
              value={this.props.values}
              labelWidth={ this.props.labelWidth ? this.props.labelWidth : this.state.labelWidth }
              onChange={(event: any) => {
                this.props.onChange(event.target.value as string[]);
              }}
              input={<Input />}
              renderValue={(selected) => (selected as string[]).join(', ')}
              MenuProps={MenuProps}
            >
              { this.props.options && this.props.options.map((opt: string, i: any) => (
                <MenuItem key={opt} value={opt}>
                  <Checkbox checked={this.props.values.indexOf(opt) > -1} />
                  <ListItemText primary={this.props.display_map[opt]} />
                </MenuItem>
              ))}
            </Select>
          :
            <Select
              labelId={`selectInput_${this.props.name}`}
              id={`selectInput_${this.props.name}`}
              value={this.props.value? this.props.value : ""}
              onChange={(event: any) => {
                this.props.onChange(event.target.value);
              }}
              fullWidth
              labelWidth={ this.props.labelWidth ? this.props.labelWidth : this.state.labelWidth }
            >
              { this.props.options && this.props.options.map((opt: string, i: any) => {
                return (<MenuItem key={i} value={opt}>{this.props.display_map[opt]}</MenuItem>);
              })}
            </Select>
          }
        </FormControl>
      );
    } else {
      return (
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor={`selectInput_${this.props.name}`}>{this.props.name}</InputLabel>
          { this.props.multiple ? 
            <Select
              labelId={`selectInput_${this.props.name}`}
              id={`selectInput_${this.props.name}`}
              multiple
              multiline
              fullWidth
              value={this.props.values}
              labelWidth={ this.props.labelWidth ? this.props.labelWidth : this.state.labelWidth }
              onChange={(event: any) => {
                this.props.onChange(event.target.value as string[]);
              }}
              input={<Input />}
              renderValue={(selected) => (selected as string[]).join(', ')}
              MenuProps={MenuProps}
            >
              { this.props.options && this.props.options.map((opt: string, i: any) => (
                <MenuItem key={opt} value={opt}>
                  <Checkbox checked={this.props.values.indexOf(opt) > -1} />
                  <ListItemText primary={opt} />
                </MenuItem>
              ))}
            </Select>
          :
            <Select
              labelId={`selectInput_${this.props.name}`}
              id={`selectInput_${this.props.name}`}
              value={this.props.value? this.props.value : ""}
              onChange={(event: any) => {
                this.props.onChange(event.target.value);
              }}
              fullWidth
              labelWidth={ this.props.labelWidth ? this.props.labelWidth : this.state.labelWidth }
            >
              { this.props.options && this.props.options.map((opt: string, i: any) => {
                return (<MenuItem key={i} value={opt}>{opt}</MenuItem>);
              })}
            </Select>
          }
        </FormControl>
      );
    }
  }
}

export default connector(SelectStringBox);
