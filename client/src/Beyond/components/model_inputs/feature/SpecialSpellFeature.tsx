import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  SpecialSpellFeature,
  UpgradableNumber
} from "../../../models";
import { 
  REFRESH_RULES 
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";
import CheckBox from "../../input/CheckBox";

import SelectSpellListBox from "../select/SelectSpellListBox";

import UpgradableNumberBox from "../../input/UpgradableNumberBox";

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
  feature: SpecialSpellFeature;
  onChange: (changed: SpecialSpellFeature) => void; 
}

export interface State { 
  loading: boolean;
  tables: string[] | null;
}

class SpecialSpellFeatureInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      tables: null
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }


  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } 
    else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <SelectStringBox 
              name="Level" 
              options={["0","1","2","3","4","5","6","7","8","9"]}
              value={`${this.props.feature.level}`} 
              onChange={(value: string) => {
                const feature = this.props.feature;
                feature.level = +value;
                this.props.onChange(feature);
              }} 
            />
          </Grid>
          <Grid item>
            <SelectSpellListBox
              name="Use Spells from List" 
              allow_any
              allow_class
              value={ this.props.feature.spell_list } 
              onChange={(value: string) => {
                const feature = this.props.feature;
                feature.spell_list = value;
                this.props.onChange(feature);
              }} 
            />
          </Grid>
          <Grid item>
            <CheckBox 
              name="Always Known"
              value={ this.props.feature.always_known }
              onChange={(value: boolean) => {
                const feature = this.props.feature;
                feature.always_known = value;
                this.props.onChange(feature);
              }}
            /> 
          </Grid>
          <Grid item>
            <SelectStringBox 
              name="Slot Override"
              options={["Normal","At Will","Only Special Resource","Or Special Resource","And Special Resource"]}
              value={this.props.feature.slot_override}
              onChange={(value: string) => {
                const feature = this.props.feature;
                feature.slot_override = value;
                this.props.onChange(feature);
              }}
            /> 
            {/* <SelectResourceBox 
              name="Resource Consumed"
              allow_special
              allow_none
              allow_slot
              value={ this.props.feature.resource_consumed }
              onChange={(value: string) => {
                const feature = this.props.feature;
                feature.resource_consumed = value;
                if (value === "Special" && feature.special_resource_refresh_rule === "") {
                  feature.special_resource_refresh_rule = "Long Rest";
                }
                this.props.onChange(feature);
              }}
            />  */}
          </Grid>
          { !this.props.feature.at_will &&
            <Grid item>
              <StringBox 
                value={ `${this.props.feature.amount_consumed}` } 
                name="Amount Consumed"
                type="number"
                onBlur={(value: number) => {
                  const feature = this.props.feature;
                  feature.amount_consumed = +value;
                  this.props.onChange(feature);
                }}
              />
            </Grid>
          }
          { this.props.feature.slot_override && this.props.feature.slot_override.includes("Special") &&
            <Grid item>
              <UpgradableNumberBox 
                name="Special Resource Amount"
                value={this.props.feature.special_resource_amount} 
                onChange={(value: UpgradableNumber) => {
                  const feature = this.props.feature;
                  feature.special_resource_amount = value;
                  this.props.onChange(feature);
                }}
              />
            </Grid>
          }
          { this.props.feature.slot_override && this.props.feature.slot_override.includes("Special") &&
            <Grid item>
              <SelectStringBox 
                options={REFRESH_RULES}
                value={ this.props.feature.special_resource_refresh_rule } 
                name="Refresh Rule"
                onChange={(value: string) => {
                  const feature = this.props.feature;
                  feature.special_resource_refresh_rule = value;
                  this.props.onChange(feature);
                }}
              />
            </Grid>
          }
        </Grid>
      );
    }
  }
}

export default connector(SpecialSpellFeatureInput);
