import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
} from "@material-ui/core";
import { 
  ModelBase, 
} from "../../models";

import StringBox from "../input/StringBox";
import SelectStringBox from "../input/SelectStringBox";
import SelectObjectBox from "../input/SelectObjectBox";

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
        this.render_description(),
        this.render_source()
      ]; 
    } else {
      return [
        <Grid item key="description">
          { this.render_description() }
        </Grid>,
        <Grid item key="source">
          { this.render_source() }
        </Grid>
      ]; 
    }
  }

  render_description() {
    return (
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
    );
  }

  render_source() {
    return (
      <Grid key="source" container spacing={1} direction="row">
        <Grid item xs={6}>
          <SelectStringBox
            name="Source Type"
            value={this.props.obj.source_type} 
            options={["Source Book","Homebrew"]} // Really I'll probably just automate this for when it's homebrew.  In fact I might put homebrews in different collections.
            onChange={(value: string) => {
              const obj = this.props.obj;
              obj.source_type = value;
              this.props.onChange();
            }}
          />
        </Grid>
        <Grid item xs={6}>
          { this.props.obj.source_type === "Source Book" ?
            <SelectObjectBox
              name="Source Book"
              value={this.props.obj.source_id} 
              data_type="source_book"
              extra_options={["Basic Rules"]}
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.source_id = value;
                this.props.onChange();
              }}
            />
          : this.props.obj.source_type === "Homebrew" &&
            <SelectObjectBox
              name="Owner"
              value={this.props.obj.source_id} 
              data_type="user"
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.source_id = value;
                this.props.onChange();
              }}
            />
          }
        </Grid>
      </Grid>
    );
  }
}

export default connector(ModelBaseInput);
