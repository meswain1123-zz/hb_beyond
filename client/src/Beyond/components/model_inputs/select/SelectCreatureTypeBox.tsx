import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Creature,
} from "../../../models";

import SelectStringBox from "../../input/SelectStringBox";

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
  onChange: (id: string) => void;
  color: string;
  allow_any: boolean;
}

export interface State {
  creatures: Creature[] | null;
  creature_types: string[];
  loading: boolean;
}

class SelectCreatureBox extends Component<Props, State> {
  public static defaultProps = {
    color: "",
    creatures: null,
    allow_any: true,
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      creatures: null,
      creature_types: [],
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
      this.api.getObjects("creature").then((res: any) => {
        if (res && !res.error) {
          const creatures: Creature[] = res;
          const creature_types: string[] = [];
          creatures.forEach(c => {
            if (!creature_types.includes(c.creature_type)) {
              creature_types.push(c.creature_type);
            }
          });
          this.setState({ creatures, creature_types, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.creatures === null) {
      return <span>Loading</span>;
    } else {
      const types = this.props.allow_any ? ["Any",...this.state.creature_types] : this.state.creature_types;
      return (
        <SelectStringBox 
          options={types}
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

export default connector(SelectCreatureBox);
