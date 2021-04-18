import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
// import {
//   Grid, Button, Modal
// } from "@material-ui/core";

import { 
  Ability
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
  multiple: boolean;
  values: string[];
  abilities: Ability[] | null;
  onChange: Function;
}

export interface State {
  abilities: Ability[] | null;
  loading: boolean;
}

class SelectAbilityBox extends Component<Props, State> {
  public static defaultProps = {
    abilities: null,
    value: null,
    values: [],
    multiple: false
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      abilities: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("ability").then((res: any) => {
        if (res && !res.error) {
          this.setState({ abilities: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.abilities === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.props.multiple) {
      return (<span></span>);
      // return (
      //   <SelectBox 
      //     options={this.state.abilities}
      //     multiple
      //     values={this.props.values} 
      //     name={this.props.name}
      //     onChange={(ids: string[]) => {
      //       this.props.onChange(ids);
      //     }}
      //   />
      // );
    } else {
      return (<span></span>);
      // return (
      //   <SelectBox 
      //     options={this.state.abilities}
      //     value={this.props.value} 
      //     name={this.props.name}
      //     onChange={(id: string) => {
      //       const objFinder = this.state.abilities ? this.state.abilities.filter(o => o._id === id) : [];
      //       if (objFinder.length === 1) {
      //         this.props.onChange(objFinder[0]._id);
      //       }
      //     }}
      //   />
      // );
    }
  }
}

export default connector(SelectAbilityBox);
