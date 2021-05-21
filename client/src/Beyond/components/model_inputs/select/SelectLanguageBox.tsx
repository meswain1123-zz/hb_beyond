import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Language
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
  type: string;
  onChange: (id: string) => void;
  color: string;
  ignore_us: string[];
}

export interface State {
  languages: Language[] | null;
  loading: boolean;
}

class SelectLanguageBox extends Component<Props, State> {
  public static defaultProps = {
    type: "Standard",
    color: "",
    ignore_us: []
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      languages: null,
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
      this.api.getObjects("language").then((res: any) => {
        if (res && !res.error) {
          this.setState({ languages: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.languages === null) {
      return <span>Loading</span>;
    } else {
      const filtered = this.state.languages.filter(o => 
        !this.props.ignore_us.includes(o._id) && 
          (this.props.type === "ALL" ||
          (this.props.type === "Standard" && (o.type === "Standard" || o.type === "Exotic")) ||
          (this.props.type === "Exotic" && o.type === "Exotic"))
      );
      return (
        <SelectBox 
          options={filtered}
          value={this.props.value} 
          name={this.props.name}
          color={this.props.color}
          onChange={(id: string) => {
            const objFinder = this.state.languages ? this.state.languages.filter(o => o._id === id) : [];
            if (objFinder.length === 1) {
              this.props.onChange(objFinder[0]._id);
            }
          }}
        />
      );
    }
  }
}

export default connector(SelectLanguageBox);
