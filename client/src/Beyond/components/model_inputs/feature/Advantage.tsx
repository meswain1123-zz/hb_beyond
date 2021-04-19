import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Advantage
} from "../../../models";
import { 
  ABILITY_SCORES 
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";
import ToggleButtonBox from "../../input/ToggleButtonBox";

import SelectSkillBox from "../select/SelectSkillBox";

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
  obj: Advantage;
  onChange: (changed: Advantage) => void; 
}

export interface State { 
}

class AdvantageInput extends Component<Props, State> {
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
            options={["Initiative","Attack","Saving Throw","Ability Checks"]}
            value={this.props.obj.type} 
            onChange={(value: string) => {
              const obj = this.props.obj;
              obj.type = value;
              obj.type_detail = "All";
              this.props.onChange(obj);
            }} 
          />
        </Grid>
        <Grid item>
          <ToggleButtonBox
            name="Disadvantage"
            value={this.props.obj.disadvantage}
            onToggle={() => {
              const obj = this.props.obj;
              obj.disadvantage = !obj.disadvantage;
              this.props.onChange(obj);
            }}
          />
        </Grid>
        { this.props.obj.type === "Saving Throw" && 
          <Grid item>
            <SelectStringBox 
              name="Saving Throw" 
              options={["All",...ABILITY_SCORES]}
              value={this.props.obj.type_detail} 
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.type_detail = value;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        }
        { this.props.obj.type === "Ability Checks" && 
          <Grid item>
            <SelectSkillBox 
              name="Ability Checks" 
              allow_ability_scores
              allow_all
              multiple
              values={this.props.obj.type_details} 
              onChange={(values: string[]) => {
                const obj = this.props.obj;
                obj.type_details = values;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        }
        <Grid item>
          <StringBox 
            name="When" 
            value={this.props.obj.formula} 
            onBlur={(value: string) => {
              const obj = this.props.obj;
              obj.formula = value;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
      </Grid>
    );
  }
}

export default connector(AdvantageInput);
