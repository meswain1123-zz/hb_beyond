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
// import SelectBox from "../input/SelectBox";
import SelectStringBox from "../../input/SelectStringBox"; 

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
  value: string;
  tool_types: string[] | null;
  allowAny: boolean; 
  onChange: (id: string) => void;
}

export interface State {
  tool_types: string[] | null;
  loading: boolean;
}

class SelectToolTypeBox extends Component<Props, State> {
  public static defaultProps = {
    allowAny: false,
    tool_types: null
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      tool_types: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("tool").then((res: Tool[]) => {
        const tool_types: string[] = [];
        res.forEach((f: any) => {
          if (!tool_types.includes(f.type)) {
            tool_types.push(f.type);
          }
        });
        this.setState({ tool_types, loading: false });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.tool_types === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      let features: string[] = [];
      if (this.props.allowAny) {
        features.push("Any");
      }
      features = [...features, ...this.state.tool_types];
      return (
        <SelectStringBox 
          options={features}
          value={this.props.value} 
          name={this.props.name}
          onChange={(value: string) => {
            this.props.onChange(value);
          }}
        />
      );
    }
  }
}

export default connector(SelectToolTypeBox);
