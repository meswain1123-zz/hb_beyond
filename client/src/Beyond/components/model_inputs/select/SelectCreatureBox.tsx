import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Creature
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
  creatures: Creature[] | null;
  onChange: (id: string) => void;
  color: string;
  creature_types: string[];
  subtypes: string[];
  sizes: string[];
  swimming: boolean;
  flying: boolean;
  min_cr: number;
  max_cr: number;
}

export interface State {
  creatures: Creature[] | null;
  loading: boolean;
}

class SelectCreatureBox extends Component<Props, State> {
  public static defaultProps = {
    color: "",
    creatures: null,
    creature_types: ["Any"],
    subtypes: ["Any"],
    sizes: ["Any"],
    swimming: false,
    flying: false,
    min_cr: 0,
    max_cr: 100
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      creatures: null,
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
          this.setState({ creatures: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.creatures === null) {
      return <span>Loading</span>;
    } else {
      let creatures = this.props.creatures ? this.props.creatures : this.state.creatures;
      creatures = creatures.filter(o => 
        (this.props.creature_types.includes("Any") || this.props.creature_types.includes(o.creature_type)) &&
        (this.props.subtypes.includes("Any") || this.props.subtypes.includes(o.subtype)) &&
        (this.props.sizes.includes("Any") || this.props.sizes.includes(o.size)) &&
        (this.props.swimming || o.speed.swim === 0) &&
        (this.props.flying || o.speed.fly === 0) &&
        this.props.min_cr <= o.challenge_rating && 
        o.challenge_rating <= this.props.max_cr
      );
      return (
        <SelectBox 
          options={creatures}
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
