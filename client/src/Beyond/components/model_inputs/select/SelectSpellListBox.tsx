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
  allow_any: boolean;
  allow_class: boolean;
  allow_all: boolean;
  onChange: (id: string) => void;
}

export interface State {
  spell_lists: SpellList[] | null;
  loading: boolean;
}

class SelectSpellListBox extends Component<Props, State> {
  public static defaultProps = {
    spell_lists: null,
    allow_any: false,
    allow_class: false,
    allow_all: false
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
      const extra_options: string[] = [];
      if (this.props.allow_all) {
        extra_options.push("ALL");
      }
      if (this.props.allow_any) {
        extra_options.push("Any");
      }
      if (this.props.allow_class) {
        extra_options.push("Class");
      }
      return (
        <SelectBox 
          options={this.state.spell_lists}
          extra_options={extra_options}
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
