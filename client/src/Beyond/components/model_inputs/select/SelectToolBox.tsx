import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Tool
} from "../../../models";

import SelectBox from "../../input/SelectBox";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  name: string;
  value: string | null;
  type: string | null;
  multiple: boolean;
  options: string[];
  values: string[];
  tools: Tool[] | null;
  onChange: Function;
  color: string;
  ignore_us: string[];
  allow_types: boolean;
}

export interface State {
  tools: Tool[] | null;
  loading: boolean;
}

class SelectToolBox extends Component<Props, State> {
  public static defaultProps = {
    tools: null,
    type: null,
    value: null,
    options: [],
    values: [],
    multiple: false,
    color: "",
    ignore_us: [],
    allow_types: false
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      tools: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("tool").then((res: any) => {
        if (res && !res.error) {
          this.setState({ tools: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.tools === null) {
      return <span>Loading</span>;
    } else {
      let tools = this.state.tools;
      if (this.props.options.length > 0) {
        tools = [];
        this.props.options.forEach(o => {
          if (this.state.tools) {
            let obj_finder = this.state.tools.filter(s => s._id === o);
            if (obj_finder.length === 1) {
              tools.push(obj_finder[0]);
            } else if (obj_finder.length === 0) {
              // It's probably a type.
              obj_finder = this.state.tools.filter(s => s.type === o);
              tools = [...tools,...obj_finder];
            }
          }
        });
      }
      tools = tools.filter(o => !this.props.ignore_us.includes(o._id));
      if (this.props.type) {
        tools = tools.filter(o => o.type === this.props.type);
      } else if (this.props.allow_types) {
        const tool_types: Tool[] = [];
        tools.forEach((f: any) => {
          if (tool_types.filter(o => o._id === f.type).length === 0) {
            const tool_type = new Tool();
            tool_type._id = f.type;
            tool_type.name = f.type;
            tool_types.push(tool_type);
          }
        });
        tools = [...tool_types,...tools];
      }
      if (this.props.multiple) {
        return (
          <SelectBox 
            options={tools}
            multiple
            values={this.props.values} 
            name={this.props.name}
            onChange={(ids: string[]) => {
              this.props.onChange(ids);
            }}
          />
        );
      } else {
        return (
          <SelectBox 
            options={tools}
            value={this.props.value} 
            name={this.props.name}
            color={this.props.color}
            onChange={(id: string) => {
              const objFinder = this.state.tools ? this.state.tools.filter(o => o._id === id) : [];
              if (objFinder.length === 1) {
                this.props.onChange(objFinder[0]._id);
              }
            }}
          />
        );
      }
    }
  }
}

export default connector(SelectToolBox);
