import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  FightingStyle
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
  fighting_styles: FightingStyle[] | null;
  allow_all: boolean;
  allow_none: boolean;
  allow_any: boolean;
  color: string;
  onChange: Function;
}

export interface State {
  fighting_styles: FightingStyle[] | null;
  loading: boolean;
}

class SelectFightingStyleBox extends Component<Props, State> {
  public static defaultProps = {
    fighting_styles: null,
    value: null,
    values: [],
    multiple: false,
    allow_all: false,
    allow_none: false,
    allow_any: false,
    color: "",
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      fighting_styles: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("fighting_style").then((res: any) => {
        if (res && !res.error) {
          this.setState({ fighting_styles: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.props.fighting_styles === null && this.state.fighting_styles === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      const fighting_styles = this.props.fighting_styles === null ? this.state.fighting_styles : this.props.fighting_styles;
      if (fighting_styles) {
        if (this.props.multiple) {
          return (
            <SelectBox 
              options={fighting_styles}
              multiple
              allow_all={this.props.allow_all}
              allow_none={this.props.allow_none}
              allow_any={this.props.allow_any}
              values={this.props.values} 
              name={this.props.name}
              color={this.props.color}
              onChange={(ids: string[]) => {
                this.props.onChange(ids);
              }}
            />
          );
        } else {
          return (
            <SelectBox 
              options={fighting_styles}
              value={this.props.value} 
              name={this.props.name}
              allow_all={this.props.allow_all}
              allow_none={this.props.allow_none}
              allow_any={this.props.allow_any}
              color={this.props.color}
              onChange={(id: string) => {
                this.props.onChange(id);
              }}
            />
          );
        }
      } else {
        return null;
      }
    }
  }
}

export default connector(SelectFightingStyleBox);
