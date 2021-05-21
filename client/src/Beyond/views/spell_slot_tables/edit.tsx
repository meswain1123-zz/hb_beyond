import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  Add, 
  ArrowBack
} from "@material-ui/icons";
import {
  Grid, 
  Button, 
  Tooltip, Fab,
} from "@material-ui/core";
import { 
  SpellSlotType, 
  SpellSlotTableEntry
} from "../../models";
import StringBox from "../../components/input/StringBox";

import SelectStringBox from "../../components/input/SelectStringBox";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

interface MatchParams {
  id: string;
}

const mapState = (state: RootState) => ({
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & { }

export interface State { 
  redirectTo: string | null;
  table: SpellSlotType;
  processing: boolean;
  spell_slot_types: SpellSlotType[] | null;
  loading: boolean;
}

class SpellSlotTypeEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      table: new SpellSlotType(),
      processing: false,
      spell_slot_types: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject("spell_slot_type", this.state.table).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/spell_slot_type" });
      });
    });
  }

  // Loads the editing SpellSlotType into state
  load_table(id: string) {
    if (this.state.spell_slot_types) {
      const obj_finder = this.state.spell_slot_types.filter(a => a._id === id);
      if (obj_finder.length === 1) {
        this.setState({ table: obj_finder[0] });
      }
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("spell_slot_type").then((res: any) => {
        if (res && !res.error) {
          this.setState({ spell_slot_types: res, loading: false });
        }
      });
    });
  }

  onAdd() {
    const table = this.state.table;
    const entry = new SpellSlotTableEntry();
    if (table.entries.length > 0) {
      const previous = table.entries[table.entries.length - 1];
      entry.level = previous.level + 1;
      entry.slots_per_level = {...previous.slots_per_level};
    } else {
      entry.level = 1;
    }
    table.entries.push(entry);
    this.setState({ table });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.spell_slot_types === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      let { id } = this.props.match.params;
      if (id !== undefined && this.state.table._id !== id) {
        this.load_table(id);
        return (<span>Loading...</span>);
      } else {
        const formHeight = this.props.height - (this.props.width > 600 ? 198 : 198);
        return (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <Tooltip title={`Back to Spell Slot Tables`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/spell_slot_type` });
                  }}>
                  <ArrowBack/>
                </Fab>
              </Tooltip> 
            </Grid>
            <Grid item>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                { this.state.table._id === "" ? "Create Spell Slot Table" : `Edit ${this.state.table.name}` }
              </span>
            </Grid>
            <Grid item 
              style={{ 
                height: `${formHeight}px`, 
                overflowY: "scroll", 
                overflowX: "hidden" 
              }}>
              <Grid container spacing={1} direction="column">
                <Grid item>
                  <StringBox 
                    value={this.state.table.name} 
                    name="Type"
                    onBlur={(value: string) => {
                      const table = this.state.table;
                      table.name = value;
                      this.setState({ table });
                    }}
                  />
                </Grid>
                <Grid item>
                  <StringBox 
                    value={this.state.table.slot_name} 
                    name="Slot Name"
                    onBlur={(value: string) => {
                      const table = this.state.table;
                      table.slot_name = value;
                      this.setState({ table });
                    }}
                  />
                </Grid>
                <Grid item>
                  <SelectStringBox 
                    value={this.state.table.refresh_rule} 
                    options={["Long Rest","Short Rest"]}
                    name="Refresh Rule"
                    onChange={(value: string) => {
                      const table = this.state.table;
                      table.refresh_rule = value;
                      this.setState({ table });
                    }}
                  />
                </Grid>
                <Grid item>
                  <span className={"MuiTypography-root MuiListItemText-primary header"}>
                    Entries
                  </span>
                  <Tooltip title={`Create New Spellcasting Level`}>
                    <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                      onClick={ () => {
                        this.onAdd();
                      }}>
                      <Add/>
                    </Fab>
                  </Tooltip>
                </Grid>
                { this.state.table.entries.map((entry, key) => {
                  return (
                    <Grid item key={key} container spacing={1} direction="row">
                      <Grid item xs={3}>
                        <StringBox 
                          value={`${entry.level}`} 
                          name="Level"
                          onBlur={(value: string) => {
                            entry.level = +value;
                            this.setState({ table: this.state.table });
                          }}
                        />
                      </Grid>
                      { this.renderEntrySpellSlotBoxes(entry) }
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={this.state.table.name === "" || this.state.processing}
                onClick={ () => { 
                  this.submit();
                }}>
                Submit
              </Button>
              <Button
                variant="contained"
                disabled={this.state.processing}
                style={{ marginLeft: "4px" }}
                onClick={ () => { 
                  this.setState({ redirectTo:`/beyond/spell_slot_type` });
                }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        ); 
      }
    }
  }

  renderEntrySpellSlotBoxes(entry: SpellSlotTableEntry) {
    // If I make this able to support higher level spell slots then I'll need to rewrite this
    const return_me: any = [];
    for (let i = 1; i < 10; ++i) {
      return_me.push(this.renderEntrySpellSlotBox(entry, i));
    }
    return return_me;
  }

  renderEntrySpellSlotBox(entry: SpellSlotTableEntry, slot_level: number) {
    // If I'm going to change it to allow for different numbers of slots then I'd have to change it here.
    return (
      <Grid item xs={1} key={slot_level}>
        <SelectStringBox 
          options={[" - ","1","2","3","4"]}
          value={ entry.slots_per_level[slot_level] ? `${entry.slots_per_level[slot_level]}` : " - "} 
          name={`${slot_level}`}
          onChange={(value: string) => {
            if (value === " - ") {
              delete entry.slots_per_level[slot_level];
            } else {
              entry.slots_per_level[slot_level] = +value;
            }
            this.setState({ table: this.state.table });
          }}
        />
      </Grid>
    );
  }
}

export default connector(SpellSlotTypeEdit);
