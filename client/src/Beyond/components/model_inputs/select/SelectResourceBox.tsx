import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Resource
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
  onChange: (id: string) => void;
  uses_dice_only: boolean;
  allow_special: boolean;
  allow_none: boolean;
  allow_slot: boolean;
}

export interface State {
  resources: Resource[] | null;
  loading: boolean;
}

class SelectResourceBox extends Component<Props, State> {
  public static defaultProps = {
    uses_dice_only: false,
    allow_special: false,
    allow_none: false,
    allow_slot: false
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      resources: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("resource").then((res: any) => {
        if (res && !res.error) {
          this.setState({ resources: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.resources === null) {
      return <span>Loading</span>;
    } else {
      let resources: Resource[] = [];
      if (this.props.allow_none) {
        const none = new Resource();
        none._id = "None";
        none.name = "None";
        resources.push(none);
      }
      if (this.props.allow_slot) {
        const slot = new Resource();
        slot._id = "Slot";
        slot.name = "Slot";
        resources.push(slot);
      }
      if (this.props.allow_special) {
        const special = new Resource();
        special._id = "Special";
        special.name = "Special";
        resources.push(special);
      }
      if (this.props.uses_dice_only) {
        const dice_only = this.state.resources.filter(o => o.default_dice_size > 0)
        resources = [...resources,...dice_only];
      } else {
        resources = [...resources,...this.state.resources];
      }
      return (
        <SelectBox 
          options={resources}
          value={this.props.value} 
          name={this.props.name}
          onChange={(id: string) => {
            const objFinder = resources.filter(o => o._id === id);
            if (objFinder.length === 1) {
              this.props.onChange(objFinder[0]._id);
            }
          }}
        />
      );
    }
  }
}

export default connector(SelectResourceBox);
