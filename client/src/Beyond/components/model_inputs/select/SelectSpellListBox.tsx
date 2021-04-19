import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  SpellList
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
  spell_lists: SpellList[] | null;
  onChange: (id: string) => void;
}

export interface State {
  spell_lists: SpellList[] | null;
  loading: boolean;
}

class SelectSpellListBox extends Component<Props, State> {
  public static defaultProps = {
    spell_lists: null
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      spell_lists: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("spell_list").then((res: any) => {
        if (res && !res.error) {
          this.setState({ spell_lists: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.spell_lists === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      return (
        <SelectBox 
          options={this.state.spell_lists}
          allow_all={true}
          value={this.props.value} 
          name={this.props.name}
          onChange={(id: string) => {
            const objFinder = this.state.spell_lists ? this.state.spell_lists.filter(o => o._id === id) : [];
            if (objFinder.length === 1) {
              this.props.onChange(objFinder[0]._id);
            }
          }}
        />
      );
    }
  }
}

export default connector(SelectSpellListBox);
