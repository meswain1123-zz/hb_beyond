import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Resource, 
  ResourceFeature,
  UpgradableNumber
} from "../../../models";

import UpgradableNumberBox from "../../input/UpgradableNumberBox";

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
    this.load();
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("resource").then((res: any) => {
        if (res && !res.error) {
          const resources = res as Resource[];
          let type: Resource | null = null;
          if (this.props.obj.type_id) {
            const objFinder = resources.filter(o => o._id === this.props.obj.type_id);
            if (objFinder.length === 1) {
              type = objFinder[0];
            }
          }
          this.setState({ 
            resources, 
            type, 
            loading: false 
          });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.resources === null) {
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
            <UpgradableNumberBox 
              name="Total"
              value={this.props.obj.total} 
              onChange={(value: UpgradableNumber) => {
                const obj = this.props.obj;
                obj.total = value;
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
