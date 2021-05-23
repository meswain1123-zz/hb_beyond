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
  obj: SpellSlotType;
  processing: boolean;
  spell_slot_types: SpellSlotType[] | null;
  loading: boolean;
}

class SpellSlotTypeEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new SpellSlotType(),
      processing: false,
      spell_slot_types: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject("spell_slot_type", this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/spell_slot_type" });
      });
    });
  }

  // Loads the editing obj into state
  load_object(id: string) {
    const objFinder = this.state.spell_slot_types ? this.state.spell_slot_types.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone(), loading: false });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("spell_slot_type").then((res: any) => {
        if (res && !res.error) {
          let { id } = this.props.match.params;
          if (id !== undefined && this.state.obj._id !== id) {
            this.setState({ spell_slot_types: res }, () => {
              this.load_object(id);
            });
          } else {
            this.setState({ spell_slot_types: res, loading: false });
          }
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.spell_slot_types === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
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
              { this.state.obj._id === "" ? "Create Spell Slot Table" : `Edit ${this.state.obj.name}` }
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
                  value={this.state.obj.name} 
                  name="Type"
                  onBlur={(value: string) => {
                    const obj = this.state.obj;
                    obj.name = value;
                    this.setState({ obj });
                  }}
                />
              </Grid>
              <Grid item>
                <StringBox 
                  value={this.state.obj.slot_name} 
                  name="Slot Name"
                  onBlur={(value: string) => {
                    const obj = this.state.obj;
                    obj.slot_name = value;
                    this.setState({ obj });
                  }}
                />
              </Grid>
              <Grid item>
                <SelectStringBox 
                  value={this.state.obj.refresh_rule} 
                  options={["Long Rest","Short Rest"]}
                  name="Refresh Rule"
                  onChange={(value: string) => {
                    const obj = this.state.obj;
                    obj.refresh_rule = value;
                    this.setState({ obj });
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
              { this.state.obj.entries.map((entry, key) => {
                return (
                  <Grid item key={key} container spacing={1} direction="row">
                    <Grid item xs={3}>
                      <StringBox 
                        value={`${entry.level}`} 
                        name="Level"
                        onBlur={(value: string) => {
                          entry.level = +value;
                          this.setState({ obj: this.state.obj });
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
              disabled={this.state.obj.name === "" || this.state.processing}
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

  onAdd() {
    const obj = this.state.obj;
    const entry = new SpellSlotTableEntry();
    if (obj.entries.length > 0) {
      const previous = obj.entries[obj.entries.length - 1];
      entry.level = previous.level + 1;
      entry.slots_per_level = {...previous.slots_per_level};
    } else {
      entry.level = 1;
    }
    obj.entries.push(entry);
    this.setState({ obj });
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
            this.setState({ obj: this.state.obj });
          }}
        />
      </Grid>
    );
  }
}

export default connector(SpellSlotTypeEdit);
