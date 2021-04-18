import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import {
//   Clear, 
// } from "@material-ui/icons";
import {
  Grid, 
} from "@material-ui/core";

import { 
  Attack,
  Character,
  CharacterItem,
  CharacterSpell,
  Spell,
  INumHash,
} from "../../../models";

import ToggleButtonBox from "../../input/ToggleButtonBox";

import CharacterAction from "./CharacterAction";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


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
  onChange: () => void;
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
  // public static defaultProps = {
  //   value: null,
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      reloading: false,
      drawer: "",
      search_string: "",
      view: "All",
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
  }

  api: APIClass;

  componentDidMount() {
  }

  render() {
    return (
      <Grid item container spacing={1} direction="column" 
        style={{
          border: "1px solid blue",
          borderRadius: "5px",
          fontSize: "11px"
        }}>
        <Grid item container spacing={0} direction="row">
          <Grid item xs={3}>&nbsp;</Grid>
          <Grid item xs={6} container spacing={1} direction="column">
            <Grid item
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "bold"
              }}>
              <div>
                Actions
              </div>
            </Grid>
          </Grid>
          <Grid item xs={3}>&nbsp;</Grid>
        </Grid>
        <Grid item>
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}>
            <span>
              <ToggleButtonBox 
                name="All"
                height={15}
                lineHeight={1.5}
                border=""
                color="gray"
                width={30}
                bold
                value={this.state.view === "All"}
                onToggle={() => {
                  this.setState({ view: "All" });
                }}
              />
            </span>
            <span>
              <ToggleButtonBox 
                name="Action"
                height={15}
                lineHeight={1.5}
                border=""
                color="gray"
                width={30}
                bold
                value={this.state.view === "Action"}
                onToggle={() => {
                  this.setState({ view: "Action" });
                }}
              />
            </span>
            <span>
              <ToggleButtonBox 
                name="Bonus Action"
                height={15}
                lineHeight={1.5}
                border=""
                color="gray"
                width={80}
                bold
                value={this.state.view === "Bonus Action"}
                onToggle={() => {
                  this.setState({ view: "Bonus Action" });
                }}
              />
            </span>
            <span>
              <ToggleButtonBox 
                name="Reaction"
                height={15}
                lineHeight={1.5}
                border=""
                color="gray"
                width={40}
                bold
                value={this.state.view === "Reaction"}
                onToggle={() => {
                  this.setState({ view: "Reaction" });
                }}
              />
            </span>
            <span>
              <ToggleButtonBox 
                name="Other"
                height={15}
                lineHeight={1.5}
                border=""
                color="gray"
                width={40}
                bold
                value={this.state.view === "Other"}
                onToggle={() => {
                  this.setState({ view: "Other" });
                }}
              />
            </span>
          </div>
        </Grid>
        { (this.state.view === "All" || this.state.view === "Action") && 
          this.renderActionGroup("Actions") 
        }
        { (this.state.view === "All" || this.state.view === "Bonus Action") && 
          this.renderActionGroup("Bonus Actions") 
        }
        { (this.state.view === "All" || this.state.view === "Reaction") && 
          this.renderActionGroup("Reactions") 
        }
        { (this.state.view === "All" || this.state.view === "Other") && 
          this.renderActionGroup("Other Actions") 
        }
      </Grid>
    );
  }

  renderActionGroup(group: string) {
    const group2 = this.replaceAll(group.toLowerCase()," ","_");
    let found = false;
    if (["actions","bonus_actions","reactions"].includes(group2)) {
      found = this.props.obj.actions.item_actions.length > 0;
    }
    if (!found) {
      found = this.props.obj.actions[`spells_${group2}`].length > 0 || this.props.obj.actions[`abilities_${group2}`].length > 0;
    }
    if (found) {
      return (
        <Grid item container spacing={1} direction="column">
          <Grid item style={{ fontWeight: "bold", fontSize: "15px" }}>
            { group }
          </Grid>
          { this.renderActionsOfType(group2, "Weapon Attacks") }
          { this.renderActionsOfType(group2, "Spells") }
          { this.renderActionsOfType(group2, "Abilities") }
        </Grid>
      );
    } else return null;
  }

  renderActionsOfType(group2: string, type: string) {
    const type2 = this.replaceAll(type.toLowerCase()," ","_");
    let dingen: any = type === "Weapon Attacks" ? (["actions","bonus_actions","reactions"].includes(group2) ? this.props.obj.actions.item_actions : []) : this.props.obj.actions[`${type2}_${group2}`];
    if (type === "Weapon Attacks") {
      dingen = dingen.filter((o: any) => o instanceof CharacterItem && o.attacks.filter(a => group2 !== "bonus_actions" || a.bonus_action).length > 0);
    }
    dingen = dingen.sort((a: any, b: any) => { return a.name.localeCompare(b.name) });
    if (type === "Spells") {
      dingen = dingen.sort((a: any, b: any) => { 
        if (a instanceof CharacterSpell && b instanceof CharacterSpell) {
          return a.level < b.level ? -1 : 1;
        } else {
          return a.name.localeCompare(b.name)
        }
      });
    }
    if (dingen && dingen.length > 0) {
      return (
        <Grid item container spacing={1} direction="column">
          <Grid item style={{ fontWeight: "bold" }}>{ type }</Grid>
          { dingen.map((action: any, key: number) => {
            if (this.state.reloading) {
              return (<span key={key}></span>);
            } else {
              return (
                <CharacterAction 
                  key={key}
                  obj={this.props.obj}
                  action={action}
                  group={group2}
                  onChange={() => {
                    this.props.onChange();
                    // this.setState({ reloading: true }, () => {
                    //   this.setState({ reloading: false });
                    // });
                  }}
                />
              );
            }
          })}
        </Grid>
      );
    } else return null;
  }

  replaceAll(cleanMe: string, replaceMe: string, withMe: string) {
    let dirtyString = cleanMe;
    let newString = "";
    while (dirtyString.indexOf(replaceMe) > -1) {
      newString += dirtyString.substring(0, dirtyString.indexOf(replaceMe)) + withMe;
      dirtyString = dirtyString.substring(dirtyString.indexOf(replaceMe) + 1);
    }
    newString += dirtyString;
    return newString;
  }
}

export default connector(CharacterActions);
