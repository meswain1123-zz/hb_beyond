import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  ModelBase
} from "../../../models";

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
  ids: string[];
  type: string;
}

export interface State { 
  loading: boolean;
  objects: ModelBase[] | null;
}

class DisplayObjects extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      objects: null
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  load() {
    this.setState({ loading: true }, () => {
      const filter: any = {
        ids: this.props.ids
      };
      this.api.getObjects(this.props.type, filter).then((res: any) => {
        if (res && !res.error) {
          this.setState({ objects: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.props.type === "") {
      return <span></span>;
    } else if (this.state.loading || this.state.objects === null) {
      return <span>Loading</span>;
    } else {
      const obj_finder = this.state.objects.filter(o => 
        this.props.ids.includes(o._id));
      const details = obj_finder.map(o => o.name).join(", ");
      return (
        <span>{ details }</span>
      );
    }
  }
}

export default connector(DisplayObjects);
