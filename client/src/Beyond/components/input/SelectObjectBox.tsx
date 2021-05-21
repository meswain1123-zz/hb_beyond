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

import { 
  ModelBase 
} from "../../models/ModelBase";

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
  type: string;
  value: string | null;
  values: string[];
  multiple: boolean;
  allow_all: boolean;
  allow_none: boolean;
  name: string;
  onChange: Function;
  labelWidth: number | null;
  color: string;
}

export interface State { 
  objects: ModelBase[] | null;
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

class SelectBox extends Component<Props, State> {
  public static defaultProps = {
    labelWidth: null,
    multiple: false,
    value: null,
    values: [],
    allow_all: false,
    allow_none: false,
    color: ""
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      objects: null,
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

  renderValues(selected: string[]) {
    let rendered = "";
    if (this.state.objects) {
      for (let i = 0; i < selected.length; i++) {
        const s = selected[i];
        const oFinder = this.state.objects.filter(o => o._id === s);
        if (oFinder.length === 1) {
          if (i > 0) {
            rendered += ",";
          }
          rendered += oFinder[0].name;
        } else {
          // To get ALL and None to show up
          if (i > 0) {
            rendered += ",";
          }
          rendered += s;
        }
      }
    }
    return rendered;
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects(this.props.type).then((res: any) => {
        if (res && !res.error) {
          this.setState({ objects: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.props.type === "") {
      return <span></span>;
    } else if (this.state.loading || this.state.objects === null) {
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
            { this.props.allow_none && 
              <MenuItem value="None">
                <Checkbox checked={ this.props.values.indexOf("None") > -1 } />
                <ListItemText primary="None" />
              </MenuItem>
            }
            { this.state.objects && this.state.objects.map((opt: ModelBase, i: any) => (
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
            { this.props.allow_all && 
              <MenuItem value="ALL">ALL</MenuItem>
            }
            { this.props.allow_none && 
              <MenuItem value="None">None</MenuItem>
            }
            { this.state.objects && this.state.objects.map((opt: ModelBase, i: any) => {
              return (<MenuItem key={i} value={opt._id}>{opt.name}</MenuItem>);
            })}
          </Select>
        }
      </FormControl>
    );
  }
}

export default connector(SelectBox);
