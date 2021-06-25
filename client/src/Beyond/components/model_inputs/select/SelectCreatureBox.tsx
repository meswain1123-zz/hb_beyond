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
  filter: any;
  name: string;
  value: string;
  creatures: Creature[] | null;
  onChange: (id: string) => void;
  color: string;
}

export interface State {
  creatures: Creature[];
  count: 0;
  loading: boolean;
}

class SelectCreatureBox extends Component<Props, State> {
  public static defaultProps = {
    color: "",
    creatures: null,
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      creatures: [],
      count: 0,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  // componentDidUpdate(prevProps: Props, prevState: State) {
  //   if (!this.state.loading && (prevProps.filter !== this.props.filter)) {
  //     this.load();
  //   }
  // }

  load() {
    if (this.props.creatures) {
      this.setState({ creatures: this.props.creatures });
    } else {
      this.setState({ loading: true, creatures: [] }, () => {
        this.api.getObjectCount("creature", this.props.filter).then((res: any) => {
          if (!res.error) {
            if (res.count < 50) {
              this.setState({ count: res.count }, this.load_some);
            } else {
              this.setState({ count: res.count, loading: false });
            }
          }
        });
      });
    }
  }

  load_some() {
    this.api.getObjects("creature", this.props.filter, 0, 50).then((res: any) => {
      if (res && !res.error) {
        let objects: Creature[] = res;
        this.setState({ creatures: objects.sort((a, b) => { return a.name.localeCompare(b.name); }), loading: false });
      }
    });
  }

  render() {
    if (this.state.loading || this.state.creatures === null) {
      return <span>Loading</span>;
    } else {
      let creatures = this.state.creatures;
      if (creatures.length > 0) {
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
      } else if (this.state.count === 0) {
        return (
          <span>None found</span>
        );
      } else {
        return (
          <span>More than 50 found</span>
        );
      }
    }
  }
}

export default connector(SelectCreatureBox);
