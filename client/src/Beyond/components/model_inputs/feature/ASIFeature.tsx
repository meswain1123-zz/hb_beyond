import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
  Fab, Tooltip, 
} from "@material-ui/core";
import {
  DeleteForever
} from "@material-ui/icons";

import { 
  ASIFeature,
} from "../../../models";
import { 
  ABILITY_SCORES 
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";


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
  asi_feature: ASIFeature;
  onChange: (asi_feature: ASIFeature) => void; 
  onDelete: () => void; 
}

export interface State { 
  asi_feature: ASIFeature;
  loading: boolean;
}

class ASIFeatureInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      asi_feature: new ASIFeature(),
      loading: true
    };
  }

  componentDidMount() {
  }

  render() {
    if (this.state.loading) {
      this.setState({ loading: false, asi_feature: this.props.asi_feature });
      return (
        <Grid item>Loading</Grid>
      );
    } else {
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={2}>
            <Tooltip title={`Delete ASI Feature`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.props.onDelete();
                }}>
                <DeleteForever/>
              </Fab>
            </Tooltip>
          </Grid>
          <Grid item xs={5}>
            <StringBox
              name="Amount"
              value={`${this.state.asi_feature.amount}`}
              type="number"
              onBlur={(value: string) => {
                const asi_feature = this.state.asi_feature;
                const amount: number = +value;
                asi_feature.amount = amount;
                this.props.onChange(asi_feature);
                this.setState({ asi_feature });
              }}
            />
          </Grid>
          <Grid item xs={5}>
            <SelectStringBox
              name="Options"
              options={ABILITY_SCORES}
              values={this.state.asi_feature.options}
              multiple
              onChange={(values: string[]) => {
                const asi_feature = this.state.asi_feature;
                asi_feature.options = values;
                this.props.onChange(asi_feature);
                this.setState({ asi_feature });
              }}
            />
          </Grid>
        </Grid>
      );
    }
  }
}

export default connector(ASIFeatureInput);
