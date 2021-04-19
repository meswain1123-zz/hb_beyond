import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  EquipmentPack
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
  options: string[];
  values: string[];
  equipment_packs: EquipmentPack[] | null;
  onChange: Function;
  color: string;
  ignore_us: string[];
}

export interface State {
  equipment_packs: EquipmentPack[] | null;
  loading: boolean;
}

class SelectEquipmentPackBox extends Component<Props, State> {
  public static defaultProps = {
    equipment_packs: null,
    value: null,
    options: [],
    values: [],
    multiple: false,
    color: "",
    ignore_us: []
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      equipment_packs: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("equipment_pack").then((res: any) => {
        if (res && !res.error) {
          this.setState({ equipment_packs: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.equipment_packs === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.props.multiple) {
      let equipment_packs = this.state.equipment_packs;
      if (this.props.options.length > 0) {
        equipment_packs = [];
        this.props.options.forEach(o => {
          if (this.state.equipment_packs) {
            const objFinder = this.state.equipment_packs.filter(s => s._id === o);
            if (objFinder.length === 1) {
              equipment_packs.push(objFinder[0]);
            }
          }
        });
      }
      return (
        <SelectBox 
          options={equipment_packs}
          multiple
          values={this.props.values} 
          name={this.props.name}
          onChange={(ids: string[]) => {
            this.props.onChange(ids);
          }}
        />
      );
    } else {
      let equipment_packs = this.state.equipment_packs;
      if (this.props.options.length > 0) {
        equipment_packs = [];
        this.props.options.forEach(o => {
          if (this.state.equipment_packs) {
            const objFinder = this.state.equipment_packs.filter(s => s._id === o);
            if (objFinder.length === 1) {
              equipment_packs.push(objFinder[0]);
            }
          }
        });
      }
      equipment_packs = equipment_packs.filter(o => !this.props.ignore_us.includes(o._id));
      return (
        <SelectBox 
          options={equipment_packs}
          value={this.props.value} 
          name={this.props.name}
          color={this.props.color}
          onChange={(id: string) => {
            const objFinder = this.state.equipment_packs ? this.state.equipment_packs.filter(o => o._id === id) : [];
            if (objFinder.length === 1) {
              this.props.onChange(objFinder[0]._id);
            }
          }}
        />
      );
    }
  }
}

export default connector(SelectEquipmentPackBox);
