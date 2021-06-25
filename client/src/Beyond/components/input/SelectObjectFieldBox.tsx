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

// import { 
//   ModelBase 
// } from "../../models/ModelBase";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


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
  data_type: string;
  field: string;
  filter: any;
  value: string | null;
  values: string[];
  extra_options: string[];
  multiple: boolean;
  allow_all: boolean;
  allow_any: boolean;
  allow_none: boolean;
  name: string;
  onChange: Function;
  labelWidth: number | null;
  color: string;
}

export interface State { 
  field_values: string[] | null;
  labelWidth: number;
  loading: boolean;
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

class SelectObjectFieldBox extends Component<Props, State> {
  public static defaultProps = {
    labelWidth: null,
    multiple: false,
    value: null,
    values: [],
    allow_all: false,
    allow_any: false,
    allow_none: false,
    color: "",
    extra_options: [],
    filter: {}
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      field_values: null,
      labelWidth: this.getLabelWidth(props.name),
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
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

  load() {
    this.setState({ loading: true }, () => {
      console.log(this.props.data_type);
      console.log(this.props.field);
      console.log(this.props.filter);
      this.api.getObjectFieldValues(this.props.data_type, this.props.field, this.props.filter).then((res: any) => {
        if (res && !res.error) {
          this.setState({ field_values: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.props.data_type === "" || this.props.field === "") {
      return <span></span>;
    } else if (this.state.loading || this.state.field_values === null) {
      return <span>Loading</span>;
    } else {
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
  }

  renderValues(selected: string[]) {
    let rendered = "";
    for (let i = 0; i < selected.length; i++) {
      const s = selected[i];
      if (i > 0) {
        rendered += ",";
      }
      rendered += s;
    }
    return rendered;
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
            { this.props.allow_all && 
              <MenuItem value="ALL">
                <Checkbox checked={ this.props.values.indexOf("ALL") > -1 } />
                <ListItemText primary="ALL" />
              </MenuItem>
            }
            { this.props.allow_any && 
              <MenuItem value="Any">
                <Checkbox checked={ this.props.values.indexOf("Any") > -1 } />
                <ListItemText primary="Any" />
              </MenuItem>
            }
            { this.props.allow_none && 
              <MenuItem value="None">
                <Checkbox checked={ this.props.values.indexOf("None") > -1 } />
                <ListItemText primary="None" />
              </MenuItem>
            }
            { this.props.extra_options.map((extra_option, key) => {
              return (
                <MenuItem key={key} value={extra_option}>
                  <Checkbox checked={ this.props.values.indexOf(extra_option) > -1 } />
                  <ListItemText primary={extra_option} />
                </MenuItem>
              );
            })}
            { this.state.field_values && this.state.field_values.map((opt: string, i: any) => (
              <MenuItem key={i} value={opt}>
                <Checkbox checked={ this.props.values.indexOf(opt) > -1 } />
                <ListItemText primary={opt} />
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
            { this.props.allow_all && 
              <MenuItem value="ALL">ALL</MenuItem>
            }
            { this.props.allow_any && 
              <MenuItem value="Any">Any</MenuItem>
            }
            { this.props.allow_none && 
              <MenuItem value="None">None</MenuItem>
            }
            { this.props.extra_options.map((extra_option, key) => {
              return (
                <MenuItem key={key} value={extra_option}>{extra_option}</MenuItem>
              );
            })}
            { this.state.field_values && this.state.field_values.map((opt: string, i: any) => {
              return (<MenuItem key={i} value={opt}>{opt}</MenuItem>);
            })}
          </Select>
        }
      </FormControl>
    );
  }
}

export default connector(SelectObjectFieldBox);
