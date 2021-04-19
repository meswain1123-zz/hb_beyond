import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  LanguageFeature
} from "../../../models";

import SelectStringBox from "../../input/SelectStringBox";
import SelectLanguageBox from "../select/SelectLanguageBox";

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
  obj: LanguageFeature;
  onChange: (changed: LanguageFeature) => void; 
}

export interface State { 
}

class LanguageInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  render() {
    return (
      <Grid container spacing={1} direction="column">
        <Grid item>
          <SelectStringBox 
            name="Type"
            options={["Standard","Exotic","Specific"]}
            value={this.props.obj.type}
            onChange={(value: string) => {
              const obj = this.props.obj;
              obj.type = value;
              this.props.onChange(obj);
            }}
          /> 
        </Grid>
        { this.props.obj.type === "Specific" && 
          <Grid item>
            <SelectLanguageBox
              name="Language" 
              type="All"
              value={ this.props.obj.language_id } 
              onChange={(id: string) => {
                const obj = this.props.obj;
                obj.language_id = id;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        }
      </Grid>
    );
  }
}

export default connector(LanguageInput);
