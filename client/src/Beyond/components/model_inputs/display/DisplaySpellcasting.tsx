import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  SpellList,
  SpellSlotType,
  SpellcastingFeature
} from "../../../models";

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
  spellcasting: SpellcastingFeature;
}

export interface State { 
  loading: boolean;
  spell_lists: SpellList[] | null;
  spell_slot_types: SpellSlotType[] | null;
}

class DisplaySpellcasting extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      spell_lists: null,
      spell_slot_types: null
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["spell_list","spell_slot_type"]).then((res: any) => {
        if (res) {
          this.setState({ 
            spell_lists: res.spell_list, 
            spell_slot_types: res.spell_slot_type,
            loading: false 
          });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.spell_lists === null || this.state.spell_slot_types === null) {
      return <span>Loading</span>;
    } else {
      const spellcasting = this.props.spellcasting;
      const list_finder = this.state.spell_lists.filter(o => o._id === this.props.spellcasting.spell_list_id);
      let spell_list: SpellList | null = null;
      if (list_finder.length === 1) {
        spell_list = list_finder[0];
      }
      const table_finder = this.state.spell_slot_types.filter(o => o._id === this.props.spellcasting.table);
      let table: SpellSlotType | null = null;
      if (table_finder.length === 1) {
        table = table_finder[0];
      }
      return (
        <Grid container spacing={0} direction="column">
          <Grid item>
            <b>Spellcasting Ability:</b> { spellcasting.ability }
          </Grid>
          <Grid item>
            <b>Cantrips:</b> { spellcasting.cantrips_max }
          </Grid>
          { spellcasting.knowledge_type === "Prepared" ?
            <Grid item>
              <b>Spells Prepared:</b>
              &nbsp;
              You can prepare&nbsp;
              { spellcasting.spell_count_per_level } 
              &nbsp;
              spell per level in this class
              { spellcasting.extra_prepared_from_ability !== "None" &&
                ` plus your ${spellcasting.extra_prepared_from_ability} modifier`
              }.
              You can change your list of prepared spells 
              when you finish a long rest. 
              Preparing a new list of cleric spells requires 
              time spent in prayer and meditation: 
              at least 1 minute per spell level for 
              each spell on your list.
            </Grid>
          : spellcasting.knowledge_type === "Known" ?
            <Grid item>
              <b>Spells Known:</b>&nbsp;
              { spellcasting.spell_count_per_level ?
                <span>
                  &nbsp;
                  You can learn
                  &nbsp;
                  { spellcasting.spell_count_per_level } 
                  &nbsp;
                  spell per level in this class
                  &nbsp;
                  { spellcasting.extra_prepared_from_ability !== "None" &&
                    ` plus your ${spellcasting.extra_prepared_from_ability} modifier`
                  }.
                </span>
              :
                <span>
                  Your class table tells you how many
                  spells you can learn of 1st level 
                  and higher.
                </span>
              }
              &nbsp;
              You can choose to replace one spell 
              with another when you level up in this class.
            </Grid>
          : spellcasting.knowledge_type === "Book" &&
            <Grid item>
              <b>Spell Book:</b>
              &nbsp;
              You can learn
              &nbsp;
              { spellcasting.spell_count_per_level } 
              per level in this class
              &nbsp;
              { spellcasting.extra_prepared_from_ability !== "" &&
                ` plus your ${spellcasting.extra_prepared_from_ability} modifier`
              }.
              &nbsp;
              You can choose to replace one spell 
              with another when you level up in this class.
            </Grid>
          }
          { table && 
            <Grid item>
              <b>Spell Slots:</b>
              &nbsp;
              You take your spell slots from the 
              &nbsp;{ table.name } table.
            </Grid>
          }
          { spell_list && 
            <Grid item>
              <b>Spell List:</b> 
              &nbsp;
              You learn your spells from the
              &nbsp;
              { spell_list.name } table.
            </Grid>
          }
          { spellcasting.focus !== "" &&
            <Grid item>
              <b>Spellcasting Focus:</b>
              &nbsp;
              You can use a(n) { spellcasting.focus } 
              &nbsp;
              to focus your spells, 
              allowing you to ignore most material components.
            </Grid>
          }
        </Grid>
      );
    }
  }
}

export default connector(DisplaySpellcasting);
