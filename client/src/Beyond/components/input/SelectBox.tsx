import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  FormControl, 
  InputLabel,
  Input,
  Select, 
  MenuItem,
  ListItemText,
  Checkbox
} from "@material-ui/core";

import { ModelBase } from "../../models/ModelBase";


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
  values: string[];
  multiple: boolean;
  options: ModelBase[];
  allow_all: boolean;
  allow_none: boolean;
  allow_any: boolean;
  extra_options: string[];
  name: string;
  onChange: Function;
  labelWidth: number | null;
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

class SelectBox extends Component<Props, State> {
  public static defaultProps = {
    labelWidth: null,
    multiple: false,
    value: null,
    values: [],
    allow_all: false,
    allow_none: false,
    allow_any: false,
    extra_options: [],
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

  renderValues(selected: string[]) {
    let rendered = "";
    for (let i = 0; i < selected.length; i++) {
      const s = selected[i];
      const oFinder = this.props.options.filter(o => o._id === s);
      if (oFinder.length === 1) {
        if (i > 0) {
          rendered += ",";
        }
        rendered += oFinder[0].name;
      } else {
        // To get All and None to show up
        if (i > 0) {
          rendered += ",";
        }
        rendered += s;
      }
    }
    return rendered;
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
            renderValue={ (selected) => this.renderValues(selected as string[]) }
            MenuProps={MenuProps}
          >
            { this.props.allow_any && 
              <MenuItem value="Any">
                <Checkbox checked={ this.props.values.indexOf("Any") > -1 } />
                <ListItemText primary="Any" />
              </MenuItem>
            }
            { this.props.allow_all && 
              <MenuItem value="All">
                <Checkbox checked={ this.props.values.indexOf("All") > -1 } />
                <ListItemText primary="All" />
              </MenuItem>
            }
            { this.props.allow_none && 
              <MenuItem value="None">
                <Checkbox checked={ this.props.values.indexOf("None") > -1 } />
                <ListItemText primary="None" />
              </MenuItem>
            }
            { this.props.extra_options.map((opt: string, i: any) => (
              <MenuItem key={i} value={opt}>
                <Checkbox checked={ this.props.values.indexOf(opt) > -1 } />
                <ListItemText primary={opt} />
              </MenuItem>
            ))}
            { this.props.options && this.props.options.map((opt: ModelBase, i: any) => (
              <MenuItem key={i} value={opt._id}>
                <Checkbox checked={ this.props.values.indexOf(opt._id) > -1 } />
                <ListItemText primary={opt.name} />
              </MenuItem>
            ))}
          </Select>
        :
          <Select
            labelId={`selectInput_${this.props.name}`}
            id={`selectInput_${this.props.name}`}
            value={this.props.value ? this.props.value : ""}
            onChange={(event: any) => {
              this.props.onChange(event.target.value);
            }}
            fullWidth
            labelWidth={ this.props.labelWidth ? this.props.labelWidth : this.state.labelWidth }
          >
            { this.props.allow_any && 
              <MenuItem value="Any">Any</MenuItem>
            }
            { this.props.allow_all && 
              <MenuItem value="All">All</MenuItem>
            }
            { this.props.allow_none && 
              <MenuItem value="None">None</MenuItem>
            }
            { this.props.extra_options.map((opt: string, i: any) => {
              return (<MenuItem key={i} value={opt}>{opt}</MenuItem>);
            })}
            { this.props.options && this.props.options.map((opt: ModelBase, i: any) => {
              return (<MenuItem key={i} value={opt._id}>{opt.name}</MenuItem>);
            })}
          </Select>
        }
      </FormControl>
    );
  }
}

export default connector(SelectBox);
