import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
} from "@material-ui/core";
import { 
  ModelBase, 
} from "../../models";

import StringBox from "../input/StringBox";

interface AppState {
}

interface RootState {
  app: AppState
}

interface MatchParams {
  id: string;
}

const mapState = (state: RootState) => ({
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { 
  obj: ModelBase;
  no_grid: boolean;
  onChange: () => void;
}

export interface State { 
}

class ModelBaseInput extends Component<Props, State> {
  public static defaultProps = {
    no_grid: false
  };
  render() {
    if (this.props.no_grid) {
      return [
        <StringBox key="description"
          value={this.props.obj.description} 
          name="Description"
          multiline
          onBlur={(value: string) => {
            const obj = this.props.obj;
            obj.description = value;
            this.props.onChange();
          }}
        />
      ]; 
    } else {
      return [
        <Grid item key="description">
          <StringBox 
            value={this.props.obj.description} 
            name="Description"
            multiline
            onBlur={(value: string) => {
              const obj = this.props.obj;
              obj.description = value;
              this.props.onChange();
            }}
          />
        </Grid>
      ]; 
    }
  }
}

export default connector(ModelBaseInput);
