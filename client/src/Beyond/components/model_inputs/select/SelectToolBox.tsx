import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
// import {
//   Grid, Button, Modal
// } from "@material-ui/core";

import { 
  Tool
} from "../../../models";
// import { 
//   // DAMAGE_TYPES, 
//   // DURATIONS,
//   // COMPONENTS,
//   // CASTING_TIMES,
//   // RESOURCES,
//   ABILITY_SCORES 
// } from "../../../models/Constants";

// import StringBox from "../input/StringBox";
import SelectBox from "../../input/SelectBox";
// import SelectStringBox from "../input/SelectStringBox"; 

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
  // templates: TemplateBase[]
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  // templates: state.app.templates
})

const mapDispatch = {
  // addTemplate: (obj: TemplateBase) => ({ type: 'ADD', dataType: 'templates', payload: obj })
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
    ignore_us: []
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
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.tools === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.props.multiple) {
      let tools = this.state.tools;
      if (this.props.options.length > 0) {
        tools = [];
        this.props.options.forEach(o => {
          if (this.state.tools) {
            const objFinder = this.state.tools.filter(s => s._id === o);
            if (objFinder.length === 1) {
              tools.push(objFinder[0]);
            }
          }
        });
      }
      if (this.props.type) {
        tools = tools.filter(o => o.type === this.props.type);
      }
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
      let tools = this.state.tools;
      if (this.props.options.length > 0) {
        tools = [];
        this.props.options.forEach(o => {
          if (this.state.tools) {
            const objFinder = this.state.tools.filter(s => s._id === o);
            if (objFinder.length === 1) {
              tools.push(objFinder[0]);
            }
          }
        });
      }
      tools = tools.filter(o => !this.props.ignore_us.includes(o._id));
      if (this.props.type) {
        tools = tools.filter(o => o.type === this.props.type);
      }
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

export default connector(SelectToolBox);
