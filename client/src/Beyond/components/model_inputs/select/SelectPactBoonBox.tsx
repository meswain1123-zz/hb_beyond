import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  PactBoon
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
  value: string;
  pact_boons: PactBoon[] | null;
  color: string;
  allow_none: boolean;
  onChange: (id: string) => void;
}

export interface State {
  pact_boons: PactBoon[] | null;
  loading: boolean;
}

class SelectPactBoonBox extends Component<Props, State> {
  public static defaultProps = {
    pact_boons: null,
    allow_none: false,
    color: ""
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      pact_boons: null,
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
      this.api.getObjects("pact_boon").then((res: any) => {
        if (res && !res.error) {
          this.setState({ pact_boons: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.pact_boons === null) {
      return <span>Loading</span>;
    } else {
      return (
        <SelectBox 
          options={this.state.pact_boons}
          allow_none={this.props.allow_none}
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

export default connector(SelectPactBoonBox);
