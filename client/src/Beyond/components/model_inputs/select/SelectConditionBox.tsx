import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Condition
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
  values: string[];
  conditions: Condition[] | null;
  onChange: Function;
  color: string;
  allow_all: boolean;
  multiple: boolean;
}

export interface State {
  conditions: Condition[] | null;
  loading: boolean;
}

class SelectConditionBox extends Component<Props, State> {
  public static defaultProps = {
    color: "",
    conditions: null,
    allow_all: true,
    multiple: true,
    value: "",
    values: []
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      conditions: null,
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
      this.api.getObjects("condition").then((res: any) => {
        if (res && !res.error) {
          this.setState({ conditions: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.conditions === null) {
      return <span>Loading</span>;
    } else if (this.props.multiple) {
      let conditions = this.state.conditions;
      return (
        <SelectBox 
          options={conditions}
          multiple
          allow_all={this.props.allow_all}
          values={this.props.values} 
          name={this.props.name}
          onChange={(ids: string[]) => {
            this.props.onChange(ids);
          }}
        />
      );
    } else {
      let conditions = this.state.conditions;
      return (
        <SelectBox 
          options={conditions}
          value={this.props.value} 
          name={this.props.name}
          color={this.props.color}
          allow_all={this.props.allow_all}
          onChange={(id: string) => {
            const objFinder = this.state.conditions ? this.state.conditions.filter(o => o._id === id) : [];
            if (objFinder.length === 1) {
              this.props.onChange(objFinder[0]._id);
            }
          }}
        />
      );
    }
  }
}

export default connector(SelectConditionBox);
