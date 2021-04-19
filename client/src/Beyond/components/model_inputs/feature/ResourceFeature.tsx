import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Resource, ResourceFeature
} from "../../../models";

import StringBox from "../../input/StringBox";
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
  obj: ResourceFeature;
  onChange: (changed: ResourceFeature) => void; 
}

export interface State { 
  resources: Resource[] | null;
  loading: boolean;
  type: Resource | null;
}

class ResourceFeatureInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      resources: null,
      loading: false,
      type: null
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
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.resources === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.props.obj.type_id && (this.state.type === null || this.state.type._id !== this.props.obj.type_id)) {
      const objFinder = this.state.resources ? this.state.resources.filter(o => o._id === this.props.obj.type_id) : [];
      if (objFinder.length === 1) {
        this.setState({
          type: objFinder[0]
        });
      }
      return <span>Loading</span>;
    } else if (!this.props.obj.type_id && this.state.type !== null) {
      this.setState({
        type: null
      });
      return <span>Loading</span>;
    } else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <SelectBox 
              name="Resource Type" 
              options={this.state.resources}
              value={this.props.obj.type_id} 
              onChange={(id: string) => {
                if (this.state.resources) {
                  const objFinder = this.state.resources.filter(o => o._id === id);
                  if (objFinder.length === 1) {
                    const obj = this.props.obj;
                    obj.type_id = id;
                    this.props.onChange(obj);
                  }
                }
              }} 
            />
          </Grid>
          <Grid item>
            <StringBox 
              name="Total" 
              value={`${this.props.obj.total}`} 
              onBlur={(value: string) => {
                const obj = this.props.obj;
                obj.total = +value;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        </Grid>
      );
    }
  }
}

export default connector(ResourceFeatureInput);
