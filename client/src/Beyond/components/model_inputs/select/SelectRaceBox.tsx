import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Race
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
  multiple: boolean;
  values: string[];
  races: Race[] | null;
  onChange: Function;
}

export interface State {
  races: Race[] | null;
  loading: boolean;
}

class SelectRaceBox extends Component<Props, State> {
  public static defaultProps = {
    races: null,
    value: null,
    values: [],
    multiple: false
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      races: null,
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
      this.api.getObjects("race").then((res: any) => {
        if (res && !res.error) {
          this.setState({ races: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.races === null) {
      return <span>Loading</span>;
    } else if (this.props.multiple) {
      return (
        <SelectBox 
          options={this.state.races}
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
          options={this.state.races}
          value={this.props.value} 
          name={this.props.name}
          onChange={(id: string) => {
            const objFinder = this.state.races ? this.state.races.filter(o => o._id === id) : [];
            if (objFinder.length === 1) {
              this.props.onChange(objFinder[0]._id);
            }
          }}
        />
      );
    }
  }
}

export default connector(SelectRaceBox);
