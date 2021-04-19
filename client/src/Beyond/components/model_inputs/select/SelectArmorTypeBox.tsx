import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  ArmorType
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
  armor_types: ArmorType[] | null;
  allow_all: boolean;
  allow_none: boolean;
  onChange: Function;
}

export interface State {
  armor_types: ArmorType[] | null;
  loading: boolean;
}

class SelectArmorTypeBox extends Component<Props, State> {
  public static defaultProps = {
    armor_types: null,
    value: null,
    values: [],
    multiple: false,
    allow_all: false,
    allow_none: false
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      armor_types: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("armor_type").then((res: any) => {
        if (res && !res.error) {
          this.setState({ armor_types: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.armor_types === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.props.multiple) {
      return (
        <SelectBox 
          options={this.state.armor_types}
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
          options={this.state.armor_types}
          value={this.props.value} 
          name={this.props.name}
          onChange={(id: string) => {
            const objFinder = this.state.armor_types ? this.state.armor_types.filter(o => o._id === id) : [];
            if (objFinder.length === 1) {
              this.props.onChange(objFinder[0]._id);
            }
          }}
        />
      );
    }
  }
}

export default connector(SelectArmorTypeBox);
