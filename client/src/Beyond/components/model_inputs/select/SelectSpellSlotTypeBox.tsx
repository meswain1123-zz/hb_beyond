import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
// import {
//   Grid, Button, Modal
// } from "@material-ui/core";

import { 
  SpellSlotType
} from "../../../models";
// import { 
//   // DAMAGE_TYPES, 
//   // DURATIONS,
//   // COMPONENTS,
//   // CASTING_TIMES,
//   // RESOURCES,
//   ABILITY_SCORES 
// } from "../../../models/Constants";

// import StringBox from "../input/StringBox";
import SelectBox from "../../input/SelectBox";
// import SelectStringBox from "../input/SelectStringBox"; 

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
  // templates: TemplateBase[]
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  // templates: state.app.templates
})

const mapDispatch = {
  // addTemplate: (obj: TemplateBase) => ({ type: 'ADD', dataType: 'templates', payload: obj })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  name: string;
  value: string | null;
  multiple: boolean;
  values: string[];
  spell_slot_types: SpellSlotType[] | null;
  allow_all: boolean;
  allow_none: boolean;
  onChange: Function;
}

export interface State {
  spell_slot_types: SpellSlotType[] | null;
  loading: boolean;
}

class SelectSpellSlotTypeBox extends Component<Props, State> {
  public static defaultProps = {
    spell_slot_types: null,
    value: null,
    values: [],
    multiple: false,
    allow_all: false,
    allow_none: false
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      spell_slot_types: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("spell_slot_type").then((res: any) => {
        if (res && !res.error) {
          this.setState({ spell_slot_types: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.spell_slot_types === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.props.multiple) {
      return (
        <SelectBox 
          options={this.state.spell_slot_types}
          multiple
          allow_all={this.props.allow_all}
          allow_none={this.props.allow_none}
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
          options={this.state.spell_slot_types}
          value={this.props.value} 
          name={this.props.name}
          onChange={(id: string) => {
            const objFinder = this.state.spell_slot_types ? this.state.spell_slot_types.filter(o => o._id === id) : [];
            if (objFinder.length === 1) {
              this.props.onChange(objFinder[0]._id);
            }
          }}
        />
      );
    }
  }
}

export default connector(SelectSpellSlotTypeBox);
