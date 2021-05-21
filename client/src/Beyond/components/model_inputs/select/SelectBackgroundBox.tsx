import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Background
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
  backgrounds: Background[] | null;
  onChange: (id: string) => void;
}

export interface State {
  backgrounds: Background[] | null;
  loading: boolean;
}

class SelectBackgroundBox extends Component<Props, State> {
  public static defaultProps = {
    backgrounds: null
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      backgrounds: null,
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
      this.api.getObjects("background").then((res: any) => {
        if (res && !res.error) {
          this.setState({ backgrounds: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.backgrounds === null) {
      return <span>Loading</span>;
    } else {
      return (
        <SelectBox 
          options={this.state.backgrounds}
          value={this.props.value} 
          name={this.props.name}
          onChange={(id: string) => {
            const objFinder = this.state.backgrounds ? this.state.backgrounds.filter(o => o._id === id) : [];
            if (objFinder.length === 1) {
              this.props.onChange(objFinder[0]._id);
            }
          }}
        />
      );
    }
  }
}

export default connector(SelectBackgroundBox);
