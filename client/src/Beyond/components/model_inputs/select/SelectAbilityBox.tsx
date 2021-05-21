import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Ability
} from "../../../models";

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
    this.load();
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
    if (this.state.loading || this.state.abilities === null) {
      return <span>Loading</span>;
    } else if (this.props.multiple) {
      return (<span></span>);
    } else {
      return (<span></span>);
    }
  }
}

export default connector(SelectAbilityBox);
