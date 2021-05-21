import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Modifier
} from "../../../models";
import { 
  DAMAGE_TYPES, 
  ABILITY_SCORES,
  SCHOOLS
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";
import ToggleButtonBox from "../../input/ToggleButtonBox";

import SelectResourceBox from "../select/SelectResourceBox";
import SelectArmorTypeBox from "../select/SelectArmorTypeBox";
import SelectWeaponKeywordBox from "../select/SelectWeaponKeywordBox";

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
  obj: Modifier;
  onChange: (changed: Modifier) => void; 
}

export interface State { 
}

class ModifierInput extends Component<Props, State> {
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
            name="Modifies" 
            options={["AC","Max HP","Speed","Ability Check","Saving Throw","Ability Score Max","Spell DC","Attack","Damage","Resource Dice Size","Initiative"]}
            value={this.props.obj.modifies} 
            onChange={(value: string) => {
              const obj = this.props.obj;
              obj.modifies = value;
              if (value === "Resource Dice Size") {
                obj.modifies_details = [""];
              } else {
                obj.modifies_details = [];
              }
              this.props.onChange(obj);
            }} 
          />
        </Grid>
        <Grid item>
          <ToggleButtonBox
            name="Multiply"
            value={this.props.obj.multiply}
            onToggle={() => {
              const obj = this.props.obj;
              obj.multiply = !obj.multiply;
              this.props.onChange(obj);
            }}
          />
        </Grid>
        { this.props.obj.modifies === "Resource Dice Size" && 
          <Grid item>
            <SelectResourceBox
              name="Resource"
              uses_dice_only
              value={this.props.obj.modifies_details[0]}
              onChange={(id: string) => {
                const obj = this.props.obj;
                obj.modifies_details[0] = id;
                this.props.onChange(obj);
              }}
            />
          </Grid>
        }
        { this.props.obj.modifies === "Speed" && 
          <Grid item>
            <SelectStringBox 
              name="Speed Type" 
              options={["Walking","Swimming","Flying","Climbing","Burrowing"]}
              multiple
              values={this.props.obj.modifies_details} 
              onChange={(values: string[]) => {
                const obj = this.props.obj;
                obj.modifies_details = values;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        }
        { (this.props.obj.modifies === "Saving Throw") && 
          <Grid item>
            <SelectStringBox 
              name="Saving Throw" 
              options={ABILITY_SCORES}
              values={this.props.obj.modifies_details} 
              multiple
              onChange={(values: string[]) => {
                const obj = this.props.obj;
                obj.modifies_details = values;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        }
        { (this.props.obj.modifies === "Ability Check") && 
          <Grid item>
            <SelectStringBox 
              name="Ability Check" 
              options={ABILITY_SCORES}
              values={this.props.obj.modifies_details} 
              multiple
              onChange={(values: string[]) => {
                const obj = this.props.obj;
                obj.modifies_details = values;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        }
        { this.props.obj.modifies === "Ability Score Max" && 
          <Grid item>
            <SelectStringBox 
              name="Ability Score" 
              options={ABILITY_SCORES}
              values={this.props.obj.modifies_details} 
              multiple
              onChange={(values: string[]) => {
                const obj = this.props.obj;
                obj.modifies_details = values;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        }
        { (this.props.obj.modifies === "Attack" || this.props.obj.modifies === "Damage") && 
          <Grid item>
            <SelectStringBox 
              name="Attack Type" 
              options={["Strength","Dexterity","Melee","Ranged","Versatile","2nd Weapon","Cantrip Attacks","Spell Attacks","Cantrip Saves","Spell Saves",...SCHOOLS]}
              values={this.props.obj.modifies_details} 
              multiple
              onChange={(values: string[]) => {
                const obj = this.props.obj;
                obj.modifies_details = values;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        }
        { this.props.obj.modifies === "Damage" && 
          <Grid item>
            <SelectStringBox 
              name="Damage Type" 
              options={["ALL",...DAMAGE_TYPES]}
              value={this.props.obj.modifies_detail_2} 
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.modifies_detail_2 = value;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        }
        <Grid item>
          <SelectArmorTypeBox 
            name="Allowed Armor Types" 
            values={this.props.obj.allowed_armor_types} 
            multiple
            allow_all
            onChange={(values: string[]) => {
              const obj = this.props.obj;
              obj.allowed_armor_types = values;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
        <Grid item>
          <SelectArmorTypeBox 
            name="Required Armor Types" 
            values={this.props.obj.required_armor_types} 
            multiple
            allow_none
            allow_any
            onChange={(values: string[]) => {
              const obj = this.props.obj;
              obj.required_armor_types = values;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
        { this.props.obj.modifies === "Damage" && 
          <Grid item>
            <SelectWeaponKeywordBox 
              name="Excluded Weapon Keywords" 
              values={this.props.obj.excluded_weapon_keywords} 
              multiple
              allow_none
              allow_any
              allow_all
              onChange={(values: string[]) => {
                const obj = this.props.obj;
                obj.excluded_weapon_keywords = values;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        }
        { ["Attack","Damage"].includes(this.props.obj.modifies) && 
          <Grid item>
            <SelectWeaponKeywordBox 
              name="Required Weapon Keywords" 
              values={this.props.obj.required_weapon_keywords} 
              multiple
              allow_none
              allow_any
              onChange={(values: string[]) => {
                const obj = this.props.obj;
                obj.required_weapon_keywords = values;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        }
        <Grid item>
          <SelectStringBox 
            name="Modification Type" 
            options={["Flat","Attack Ability Modifier","Attack Ability Option","Damage Dice Option","Character Level","Class Level",...ABILITY_SCORES]}
            value={this.props.obj.type} 
            onChange={(value: string) => {
              const obj = this.props.obj;
              obj.type = value;
              this.props.onChange(obj);
            }} 
          />
        </Grid>
        { ["Flat","Character Level","Class Level"].includes(this.props.obj.type) && 
          <Grid item>
            <StringBox 
              name="Amount" 
              value={this.props.obj.amount} 
              onBlur={(value: string) => {
                const obj = this.props.obj;
                obj.amount = value;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        }
        { ["Attack Ability Option"].includes(this.props.obj.type) && 
          <Grid item>
            <SelectStringBox 
              name="Ability Score" 
              options={ABILITY_SCORES}
              value={this.props.obj.modifies_detail_3} 
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.modifies_detail_3 = value;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        }
        { ["Damage Dice Option"].includes(this.props.obj.type) && 
          <Grid item>
            <StringBox 
              name="Damage Dice Size" 
              value={this.props.obj.modifies_detail_3} 
              type="number"
              onBlur={(value: string) => {
                const obj = this.props.obj;
                obj.modifies_detail_3 = value;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
        }
      </Grid>
    );
  }
}

export default connector(ModifierInput);
