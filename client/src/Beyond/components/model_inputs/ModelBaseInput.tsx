import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
} from "@material-ui/core";
import { 
  ModelBase, 
} from "../../models";

import StringBox from "../input/StringBox";

import ModelBaseDetails from "./ModelBaseDetails";

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
  onChange: () => void;
}

export interface State { 
}

class ModelBaseInput extends Component<Props, State> {
  render() {
    return [
      <Grid item key="name">
        <StringBox 
          value={this.props.obj.name} 
          message={this.props.obj.name.length > 0 ? "" : "Name Invalid"} 
          name="Name"
          onBlur={(value: string) => {
            const obj = this.props.obj;
            obj.name = value;
            this.props.onChange();
          }}
        />
      </Grid>,
      <ModelBaseDetails key="description"
        obj={this.props.obj}
        onChange={() => {
          this.props.onChange();
        }}
      />
    ]; 
  }
}

export default connector(ModelBaseInput);
