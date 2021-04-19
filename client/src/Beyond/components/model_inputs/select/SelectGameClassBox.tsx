import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  GameClass
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
  game_classes: GameClass[] | null;
  onChange: Function;
}

export interface State {
  game_classes: GameClass[] | null;
  loading: boolean;
}

class SelectGameClassBox extends Component<Props, State> {
  public static defaultProps = {
    game_classes: null,
    value: null,
    values: [],
    multiple: false
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      game_classes: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("game_class").then((res: any) => {
        if (res && !res.error) {
          this.setState({ game_classes: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.game_classes === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.props.multiple) {
      return (
        <SelectBox 
          options={this.state.game_classes}
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
          options={this.state.game_classes}
          value={this.props.value} 
          name={this.props.name}
          onChange={(id: string) => {
            const objFinder = this.state.game_classes ? this.state.game_classes.filter(o => o._id === id) : [];
            if (objFinder.length === 1) {
              this.props.onChange(objFinder[0]._id);
            }
          }}
        />
      );
    }
  }
}

export default connector(SelectGameClassBox);
