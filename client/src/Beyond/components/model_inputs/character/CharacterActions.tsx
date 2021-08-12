import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
} from "@material-ui/core";

import { 
  Attack,
  Character,
  // CharacterItem,
  CharacterSpell,
  CharacterAction,
  Spell,
  INumHash,
} from "../../../models";

import CharacterActionInput from "./CharacterAction";

import CenteredMenu from "../../input/CenteredMenu";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";

import DataUtilities from "../../../utilities/data_utilities";
import { DataUtilitiesClass } from "../../../utilities/data_utilities_class";


interface AppState {
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  obj: Character;
  onChange: (change_types: string[]) => void;
}

export interface State {
  loading: boolean;
  reloading: boolean;
  drawer: string;
  search_string: string;
  view: string;
  edit_view: string;
  selected_spell: CharacterSpell | null;
  selected_level: number | null;
  spells: Spell[] | null;
  levels: INumHash;
  concentration: boolean;
  ritual: boolean;
  popoverAnchorEl: HTMLDivElement | null;
  popoverAction: CharacterSpell | Attack | null;
  popoverActionLevel: number;
  popoverMode: string;
}

class CharacterActions extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      reloading: false,
      drawer: "",
      search_string: "",
      view: "ALL",
      edit_view: "",
      selected_spell: null,
      selected_level: null,
      spells: null,
      levels: {},
      concentration: false,
      ritual: false,
      popoverAnchorEl: null,
      popoverAction: null,
      popoverActionLevel: -1,
      popoverMode: ""
    };
    this.api = API.getInstance();
    this.data_util = DataUtilities.getInstance();
  }

  api: APIClass;
  data_util: DataUtilitiesClass;

  componentDidMount() {
  }

  render() {
    // console.log(this.props.obj.actions);
    return (
      <Grid item container spacing={1} direction="column" 
        style={{
          border: "1px solid blue",
          borderRadius: "5px",
          fontSize: "11px"
        }}>
        <Grid item container spacing={0} direction="row">
          <Grid item xs={3}>
            
          </Grid>
          <Grid item xs={6}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "bold"
              }}>
              <div>
                Actions
              </div>
            </div>
            <CenteredMenu
              options={["ALL","Action","Bonus Action","Reaction","Other"]}
              selected={this.state.view}
              onSelect={(view: string) => {
                this.setState({ view });
              }}
            />
          </Grid>
          <Grid item xs={3}>
            
          </Grid>
        </Grid>
        { (this.state.view === "ALL" || this.state.view === "Action") && 
          this.renderActionGroup("Actions") 
        }
        { (this.state.view === "ALL" || this.state.view === "Bonus Action") && 
          this.renderActionGroup("Bonus Actions") 
        }
        { (this.state.view === "ALL" || this.state.view === "Reaction") && 
          this.renderActionGroup("Reactions") 
        }
        { (this.state.view === "ALL" || this.state.view === "Other") && 
          this.renderActionGroup("Other") 
        }
      </Grid>
    );
  }

  renderActionGroup(group: string) {
    const filtered = this.props.obj.actions.filter(o => o.casting_time[0] === group[0] || (group === "Other" && !["A","BA","RA"].includes(o.casting_time)));
    if (filtered.length > 0) {
      let extra_attacks = "";
      if (group === "Action" && this.props.obj.extra_attacks > 0) {
        extra_attacks = `${this.props.obj.extra_attacks + 1} Attacks per Action`;
      }
      return (
        <Grid item container spacing={1} direction="column">
          <Grid item style={{ fontWeight: "bold", fontSize: "15px" }}>
            { group } { extra_attacks }
          </Grid>
          { this.renderActionsOfType(filtered, "Weapon Attacks") }
          { this.renderActionsOfType(filtered, "Spells") }
          { this.renderActionsOfType(filtered, "Abilities") }
        </Grid>
      );
    } else return null;
  }

  renderActionsOfType(actions: CharacterAction[], type: string) {
    let dingen = type === "Weapon Attacks" ? 
      actions.filter(o => o.type === "Weapon") : 
      (type === "Spells" ? 
      actions.filter(o => o.type === "Spell" || o.type === "Spell As Ability") :
      actions.filter(o => !["Weapon","Spell","Spell As Ability"].includes(o.type)));
    dingen = dingen.sort((a: any, b: any) => { return a.name.localeCompare(b.name) });
    if (dingen && dingen.length > 0) {
      return (
        <Grid item container spacing={1} direction="column">
          <Grid item style={{ fontWeight: "bold" }}>{ type }</Grid>
          { dingen.map((action: any, key: number) => {
            if (this.state.reloading) {
              return (<span key={key}></span>);
            } else {
              return (
                <CharacterActionInput
                  key={key}
                  character={this.props.obj}
                  action={action}
                  group={action.casting_time}
                  onChange={(change_types: string[]) => {
                    this.props.onChange(change_types);
                  }}
                />
              );
            }
          })}
        </Grid>
      );
    } else return null;
  }
}

export default connector(CharacterActions);
