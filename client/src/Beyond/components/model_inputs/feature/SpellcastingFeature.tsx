import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  SpellcastingFeature
} from "../../../models";
import { 
  ABILITY_SCORES, 
  PERCENTAGE_LEVEL_MAP 
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";
import CheckBox from "../../input/CheckBox";

import SelectSpellListBox from "../select/SelectSpellListBox";
import SelectSpellSlotTypeBox from "../select/SelectSpellSlotTypeBox";

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
  obj: SpellcastingFeature;
  onChange: (changed: SpellcastingFeature) => void; 
}

export interface State { 
  loading: boolean;
  tables: string[] | null;
}

class SpellcastingFeatureInput extends Component<Props, State> {
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
              name="Spellcasting Ability" 
              options={ABILITY_SCORES}
              value={this.props.obj.ability} 
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.ability = value;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
          <Grid item>
            <SelectSpellSlotTypeBox 
              name="Table" 
              value={this.props.obj.table} 
              onChange={(id: string) => {
                const obj = this.props.obj;
                obj.table = id;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
          <Grid item>
            <SelectStringBox 
              name="Level" 
              option_map={PERCENTAGE_LEVEL_MAP}
              value={this.props.obj.level} 
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.level = +value;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
          <Grid item>
            <SelectStringBox 
              name="Spellcasting Focus" 
              options={["Arcane Focus","Holy Symbol","Druidic Focus"]}
              value={this.props.obj.focus} 
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.focus = value;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
          <Grid item>
            <SelectStringBox 
              name="Knowledge Type" 
              options={["Prepared","Known","Spell Book"]}
              value={this.props.obj.knowledge_type} 
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.knowledge_type = value;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
          <Grid item>
            <StringBox 
              name="Cantrips" 
              type="number"
              value={`${this.props.obj.cantrips_max}`} 
              onBlur={(value: string) => {
                const obj = this.props.obj;
                obj.cantrips_max = +value;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
          <Grid item>
            <StringBox 
              name="Spells Per Level" 
              type="number"
              value={`${this.props.obj.spell_count_per_level}`} 
              onBlur={(value: string) => {
                const obj = this.props.obj;
                obj.spell_count_per_level = +value;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
          <Grid item>
            <CheckBox 
              name="Ritual Casting" 
              value={this.props.obj.ritual_casting} 
              onChange={(value: boolean) => {
                const obj = this.props.obj;
                obj.ritual_casting = value;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
          <Grid item>
            <SelectSpellListBox
              name="Use Spells from List" 
              value={ this.props.obj.spell_list_id } 
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.spell_list_id = value;
                this.props.onChange(obj);
              }} 
            />
          </Grid>
          <Grid item>
            <SelectStringBox 
              name="Extra Spells based on Ability"
              options={ABILITY_SCORES}
              value={this.props.obj.extra_prepared_from_ability}
              onChange={(value: string) => {
                const obj = this.props.obj;
                obj.extra_prepared_from_ability = value;
                this.props.onChange(obj);
              }}
            /> 
          </Grid>
        </Grid>
      );
    }
  }
}

export default connector(SpellcastingFeatureInput);
