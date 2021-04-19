import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Subclass
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
  game_class_id: string | null;
  name: string;
  value: string | null;
  multiple: boolean;
  values: string[];
  subclasses: Subclass[] | null;
  onChange: Function;
  color: string; 
}

export interface State {
  subclasses: Subclass[] | null;
  loading: boolean;
}

class SelectSubclassBox extends Component<Props, State> {
  public static defaultProps = {
    game_class_id: null,
    subclasses: null,
    value: null,
    values: [],
    multiple: false,
    color: ""
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      subclasses: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("subclass").then((res: any) => {
        if (res && !res.error) {
          this.setState({ subclasses: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.subclasses === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      const options = this.props.game_class_id ? this.state.subclasses.filter(o => o.game_class_id === this.props.game_class_id) : this.state.subclasses;
      if (this.props.multiple) {
        return (
          <SelectBox 
            options={options}
            multiple
            values={this.props.values} 
            name={this.props.name}
            color={this.props.color}
            onChange={(ids: string[]) => {
              this.props.onChange(ids);
            }}
          />
        );
      } else {
        return (
          <SelectBox 
            options={options}
            value={this.props.value} 
            name={this.props.name}
            color={this.props.color}
            onChange={(id: string) => {
              const objFinder = this.state.subclasses ? this.state.subclasses.filter(o => o._id === id) : [];
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

export default connector(SelectSubclassBox);
