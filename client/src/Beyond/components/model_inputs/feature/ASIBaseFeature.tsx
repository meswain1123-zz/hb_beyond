import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
  Fab, Tooltip, 
} from "@material-ui/core";
import {
  Add
} from "@material-ui/icons";

import { 
  ASIBaseFeature,
  ASIFeature,
} from "../../../models";

import CheckBox from "../../input/CheckBox";
import ASIFeatureInput from "./ASIFeature";


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
  asi_base_feature: ASIBaseFeature;
  onChange: (asi_base_feature: ASIBaseFeature) => void; 
}

export interface State { 
  asi_base_feature: ASIBaseFeature;
  loading: boolean;
}

class ASIBaseFeatureInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      asi_base_feature: new ASIBaseFeature(),
      loading: true
    };
  }

  componentDidMount() {
  }

  render() {
    if (this.state.loading) {
      this.setState({ loading: false, asi_base_feature: this.props.asi_base_feature });
      return (
        <Grid item>Loading</Grid>
      );
    } else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <CheckBox 
              name="Allow Feat Choice"
              value={this.state.asi_base_feature.feat_option}
              onChange={(value: boolean) => {
                const asi_base_feature = this.state.asi_base_feature;
                asi_base_feature.feat_option = value;
                this.props.onChange(asi_base_feature);
                this.setState({ asi_base_feature });
              }}
            />
          </Grid>
          <Grid item>
            <CheckBox 
              name="Allow Duplicate Choices"
              value={this.state.asi_base_feature.allow_duplicates}
              onChange={(value: boolean) => {
                const asi_base_feature = this.state.asi_base_feature;
                asi_base_feature.allow_duplicates = value;
                this.props.onChange(asi_base_feature);
                this.setState({ asi_base_feature });
              }}
            />
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              ASI Features
            </span>
            <Tooltip title={`Create New ASI Feature`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  const asi_base_feature = this.state.asi_base_feature;
                  const asi_feature = new ASIFeature();
                  asi_feature.id = asi_base_feature.asi_features.length;
                  asi_base_feature.asi_features.push(asi_feature);
                  this.props.onChange(asi_base_feature);
                  this.setState({ asi_base_feature });
                }}>
                <Add/>
              </Fab>
            </Tooltip>
          </Grid>
          { this.state.asi_base_feature.asi_features.map((asi_feature, key) => {
            return (
              <Grid item key={key}>
                <ASIFeatureInput 
                  asi_feature={asi_feature}
                  onChange={(changed: ASIFeature) => {
                    const asi_base_feature = this.state.asi_base_feature;
                    const objFinder = asi_base_feature.asi_features.filter(o => o.id === changed.id);
                    if (objFinder.length === 1) {
                      const asi_feature = objFinder[0];
                      asi_feature.copy(changed);
                      this.props.onChange(asi_base_feature);
                      this.setState({ asi_base_feature });
                    }
                  }}
                  onDelete={() => {
                    const id = asi_feature.id;
                    const asi_base_feature = this.state.asi_base_feature;
                    const asi_features = asi_base_feature.asi_features.filter(o => o.id !== id);
                    asi_features.filter(o => o.id > id).forEach(o => {
                      o.id--;
                    });
                    asi_base_feature.asi_features = asi_features;
                    this.props.onChange(asi_base_feature);
                    this.setState({ asi_base_feature });
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      );
    }
  }
}

export default connector(ASIBaseFeatureInput);
