import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
// import {
//   Grid, Button, Modal
// } from "@material-ui/core";

import { 
  EldritchInvocation
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
  value: string;
  eldritch_invocations: EldritchInvocation[] | null;
  onChange: (id: string) => void;
  color: string;
  allow_all: boolean;
}

export interface State {
  eldritch_invocations: EldritchInvocation[] | null;
  loading: boolean;
}

class SelectEldritchInvocationBox extends Component<Props, State> {
  public static defaultProps = {
    color: "",
    eldritch_invocations: null,
    allow_all: true
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      eldritch_invocations: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("eldritch_invocation").then((res: any) => {
        if (res && !res.error) {
          this.setState({ eldritch_invocations: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.eldritch_invocations === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      const eldritch_invocations = this.props.eldritch_invocations ? this.props.eldritch_invocations : this.state.eldritch_invocations;
      return (
        <SelectBox 
          options={eldritch_invocations}
          allow_all={this.props.allow_all}
          value={this.props.value} 
          name={this.props.name}
          color={this.props.color}
          onChange={(id: string) => {
            this.props.onChange(id);
          }}
        />
      );
    }
  }
}

export default connector(SelectEldritchInvocationBox);
