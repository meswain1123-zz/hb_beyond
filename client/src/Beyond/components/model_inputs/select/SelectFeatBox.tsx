import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Feat
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
  feats: Feat[] | null;
  onChange: Function;
  color: string;
  ignore_us: string[];
}

export interface State {
  feats: Feat[] | null;
  loading: boolean;
}

class SelectFeatBox extends Component<Props, State> {
  public static defaultProps = {
    feats: null,
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
      feats: null,
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
      this.api.getObjects("feat").then((res: any) => {
        if (res && !res.error) {
          this.setState({ feats: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.feats === null) {
      return <span>Loading</span>;
    } else if (this.props.multiple) {
      let feats = this.state.feats;
      if (this.props.options.length > 0) {
        feats = [];
        this.props.options.forEach(o => {
          if (this.state.feats) {
            const objFinder = this.state.feats.filter(s => s._id === o);
            if (objFinder.length === 1) {
              feats.push(objFinder[0]);
            }
          }
        });
      }
      return (
        <SelectBox 
          options={feats}
          multiple
          values={this.props.values} 
          name={this.props.name}
          onChange={(ids: string[]) => {
            this.props.onChange(ids);
          }}
        />
      );
    } else {
      let feats = this.state.feats;
      if (this.props.options.length > 0) {
        feats = [];
        this.props.options.forEach(o => {
          if (this.state.feats) {
            const objFinder = this.state.feats.filter(s => s._id === o);
            if (objFinder.length === 1) {
              feats.push(objFinder[0]);
            }
          }
        });
      }
      feats = feats.filter(o => !this.props.ignore_us.includes(o._id));
      return (
        <SelectBox 
          options={feats}
          value={this.props.value} 
          name={this.props.name}
          color={this.props.color}
          onChange={(id: string) => {
            const objFinder = this.state.feats ? this.state.feats.filter(o => o._id === id) : [];
            if (objFinder.length === 1) {
              this.props.onChange(objFinder[0]._id);
            }
          }}
        />
      );
    }
  }
}

export default connector(SelectFeatBox);
