import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
  Link,
} from "@material-ui/core";

import { 
  SpecialFeature
} from "../../../models";

import SelectBox from "../../input/SelectBox";
import SelectSpecialFeatureTypeBox from "./SelectSpecialFeatureTypeBox"; 

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
  type: string;
  onChange: Function;
  color: string;
  multiple: boolean;
  options: SpecialFeature[];
}

export interface State {
  special_features: SpecialFeature[] | null;
  loading: boolean;
  show_features: boolean;
  type: string;
}

class SelectSpecialFeatureBox extends Component<Props, State> {
  public static defaultProps = {
    type: "All",
    color: "",
    multiple: false,
    value: "",
    values: [],
    options: []
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      special_features: null,
      loading: false,
      show_features: false,
      type: ""
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("special_feature").then((res: SpecialFeature[]) => {
        const special_features: SpecialFeature[] = res;
        let type = this.props.type;
        if (type === "All") {
          if (this.props.value !== "") {
            const objFinder = special_features.filter(o => o._id === this.props.value);
            if (objFinder.length === 1) {
              const obj = objFinder[0];
              type = obj.type;
            }
          } else if (this.props.values.length > 0) {
            const objFinder = special_features.filter(o => o._id === this.props.values[0]);
            if (objFinder.length === 1) {
              const obj = objFinder[0];
              type = obj.type;
            }
          }
        }
        this.setState({ special_features, type, loading: false });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.special_features === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.props.type === "All") {
      let features = this.props.options.length === 0 ? this.state.special_features.filter(o => o.type === this.state.type) : this.props.options;
      if (this.props.multiple) {
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <SelectSpecialFeatureTypeBox
                name="Type" 
                value={this.state.type} 
                onChange={(value: string) => {
                  this.setState({ type: value });
                }} 
              />
            </Grid>
            <Grid item>
              <SelectBox 
                options={features}
                color={this.props.color}
                multiple
                values={this.props.values} 
                name={this.props.name}
                onChange={(ids: string[]) => {
                  this.props.onChange(ids);
                }}
              />
            </Grid>
          </Grid>
        );
      } else {
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <SelectSpecialFeatureTypeBox
                name="Type" 
                value={this.state.type} 
                onChange={(value: string) => {
                  this.setState({ type: value });
                }} 
              />
            </Grid>
            <Grid item>
              <SelectBox 
                options={features}
                value={this.props.value} 
                name={this.props.name}
                color={this.props.color}
                onChange={(value: string) => {
                  this.props.onChange(value);
                }}
              />
            </Grid>
          </Grid>
        );
      }
    } else {
      let features = this.state.special_features.filter(o => o.type === this.props.type);
      if (this.props.multiple) {
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <Link href="#" onClick={(event: React.SyntheticEvent) => {
                  event.preventDefault();
                  this.setState({ show_features: !this.state.show_features });
                }}>
                { this.state.show_features ? `Hide ${this.props.name}` : `Show ${this.props.name}` }
              </Link>
            </Grid>
            { this.state.show_features && features.map((special_feature, key) => {
              let feature_list = "";
              for (let i = 0; i < special_feature.features.length; i++) {
                const feature = special_feature.features[i];
                if (i > 0) {
                  feature_list += "; ";
                }
                feature_list += feature.name;
                if (feature.description !== "") {
                  feature_list += ": " + feature.description;
                }
              }
              return (
                <Grid item key={key} container spacing={1} direction="row">
                  <Grid item xs={3}>
                    { special_feature.name }
                  </Grid>
                  <Grid item xs={9}>
                    { special_feature.description } { feature_list }
                  </Grid>
                </Grid>
              );
            })}
            <Grid item>
              <SelectBox 
                options={features}
                color={this.props.color}
                multiple
                values={this.props.values} 
                name={this.props.name}
                onChange={(ids: string[]) => {
                  this.props.onChange(ids);
                }}
              />
            </Grid>
          </Grid>
        );
      } else {
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <Link href="#" onClick={(event: React.SyntheticEvent) => {
                  event.preventDefault();
                  this.setState({ show_features: !this.state.show_features });
                }}>
                { this.state.show_features ? `Hide ${this.props.name}` : `Show ${this.props.name}` }
              </Link>
            </Grid>
            { this.state.show_features && features.map((special_feature, key) => {
              let feature_list = "";
              for (let i = 0; i < special_feature.features.length; i++) {
                const feature = special_feature.features[i];
                if (i > 0) {
                  feature_list += "; ";
                }
                feature_list += feature.name;
                if (feature.description !== "") {
                  feature_list += ": " + feature.description;
                }
              }
              return (
                <Grid item key={key} container spacing={1} direction="row">
                  <Grid item xs={3}>
                    { special_feature.name }
                  </Grid>
                  <Grid item xs={9}>
                    { special_feature.description } { feature_list }
                  </Grid>
                </Grid>
              );
            })}
            <Grid item>
              <SelectBox 
                options={features}
                value={this.props.value} 
                name={this.props.name}
                color={this.props.color}
                onChange={(value: string) => {
                  this.props.onChange(value);
                }}
              />
            </Grid>
          </Grid>
        );
      }
    }
  }
}

export default connector(SelectSpecialFeatureBox);
