import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  ArrowBack
} from "@material-ui/icons";
import {
  Grid, 
  Button, 
  Tooltip, Fab,
  Link,
} from "@material-ui/core";
import {  
  ArmorType,
  AbilityScores,
  Character, 
  CharacterBackground,
  CharacterRace,
  EldritchInvocation,
  FeatureBase,
  WeaponKeyword,
  Spell,
  SpellSlotType
} from "../../models";
import StringBox from "../../components/input/StringBox";
import CharacterRaceInput from "../../components/model_inputs/character/CharacterRace";
import CharacterBackgroundInput from "../../components/model_inputs/character/CharacterBackground";
import CharacterAbilityScoresInput from "../../components/model_inputs/character/CharacterAbilityScoresInput";
import CharacterClassInput from "../../components/model_inputs/character/CharacterClassInput";
import CharacterEquipment from "../../components/model_inputs/character/CharacterEquipment";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";
import CharacterUtilities from "../../utilities/character_utilities";
import { CharacterUtilitiesClass } from "../../utilities/character_utilities_class";



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
  obj: Character;
  processing: boolean;
  expanded_feature_base: FeatureBase | null;
  child_names_valid: boolean;
  mode: string;
  armor_types: ArmorType[] | null;
  weapon_keywords: WeaponKeyword[] | null;
  spells: Spell[] | null;
  spell_slot_types: SpellSlotType[] | null;
  eldritch_invocations: EldritchInvocation[] | null;
  loading: boolean;
}

class CharacterEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Character(),
      processing: false,
      expanded_feature_base: null,
      child_names_valid: true,
      mode: "main",
      armor_types: null,
      weapon_keywords: null,
      spells: null,
      spell_slot_types: null,
      eldritch_invocations: null,
      loading: false
    };
    this.api = API.getInstance();
    this.char_util = CharacterUtilities.getInstance();
  }

  api: APIClass;
  char_util: CharacterUtilitiesClass;

  componentDidMount() {
  }

  submit() {
    this.setState({ processing: true }, () => {
      const obj = this.state.obj;
      obj.current_hit_points = obj.max_hit_points;
      if (obj._id && obj._id !== "") {
        this.api.updateObject(obj).then((res: any) => {
          this.setState({ processing: false, redirectTo: "/beyond/character" });
        });
      } else {
        this.api.createObject(obj).then((res: any) => {
          this.setState({ processing: false, redirectTo: "/beyond/character" });
        });
      }
    });
  }

  // Loads the editing Character into state
  load_object(id: string) {
    this.api.getFullObject("character", id).then((res: any) => {
      if (res && res.length === 1) {
        const obj = res[0];
        this.char_util.recalcAll(obj);
        this.setState({ obj });
      }
    });
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["armor_type","spell","spell_slot_type","eldritch_invocation","weapon_keyword"]).then((res: any) => {
        const armor_types: ArmorType[] = res.armor_type;
        const spells: Spell[] = res.spell;
        this.setState({ 
          armor_types,
          spells,
          spell_slot_types: res.spell_slot_type,
          eldritch_invocations: res.eldritch_invocation,
          weapon_keywords: res.weapon_keyword,
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.armor_types === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      let { id } = this.props.match.params;
      if (id !== undefined && this.state.obj._id !== id) {
        this.load_object(id);
        return (<span>Loading...</span>);
      } else {
        const formHeight = this.props.height - (this.props.width > 600 ? 228 : 228);
        return (
          <Grid container spacing={1} direction="column">
            <Grid item container spacing={1} direction="row">
              <Grid item xs={3}>
                <Tooltip title={`Back to Characters`}>
                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                    onClick={ () => {
                      this.setState({ redirectTo:`/beyond/character` });
                    }}>
                    <ArrowBack/>
                  </Fab>
                </Tooltip> 
              </Grid>
            </Grid>
            <Grid item>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                { this.state.obj._id === "" ? "Create Character" : `Edit ${this.state.obj.name}` }
              </span>
            </Grid>
            <Grid item container spacing={1} direction="row">
              <Grid item xs={2}>
                <Link href="#" 
                  style={{
                    borderBottom: `${this.state.mode === "main" ? "2px solid blue" : "none"}`
                  }}
                  onClick={(event: React.SyntheticEvent) => {
                    event.preventDefault();
                    this.setState({ mode: "main" });
                  }}>
                  Home
                </Link>
              </Grid>
              <Grid item xs={2}>
                <Link href="#"  
                  style={{
                    borderBottom: `${this.state.mode === "race" ? "2px solid blue" : "none"}`
                  }}
                  onClick={(event: React.SyntheticEvent) => {
                    event.preventDefault();
                    this.setState({ mode: "race" });
                  }}>
                  Race
                </Link>
              </Grid>
              <Grid item xs={2}>
                <Link href="#" 
                  style={{
                    borderBottom: `${this.state.mode === "background" ? "2px solid blue" : "none"}`
                  }}
                  onClick={(event: React.SyntheticEvent) => {
                    event.preventDefault();
                    this.setState({ mode: "background" });
                  }}>
                  Background
                </Link>
              </Grid>
              <Grid item xs={2}>
                <Link href="#" 
                  style={{
                    borderBottom: `${this.state.mode === "abilities" ? "2px solid blue" : "none"}`
                  }}
                  onClick={(event: React.SyntheticEvent) => {
                    event.preventDefault();
                    this.setState({ mode: "abilities" });
                  }}>
                  Abilities
                </Link>
              </Grid>
              <Grid item xs={2}>
                <Link href="#" 
                  style={{
                    borderBottom: `${this.state.mode === "class" ? "2px solid blue" : "none"}`
                  }}
                  onClick={(event: React.SyntheticEvent) => {
                    event.preventDefault();
                    this.setState({ mode: "class" });
                  }}>
                  Class
                </Link>
              </Grid>
              <Grid item xs={2}>
                <Link href="#" 
                  style={{
                    borderBottom: `${this.state.mode === "equipment" ? "2px solid blue" : "none"}`
                  }}
                  onClick={(event: React.SyntheticEvent) => {
                    event.preventDefault();
                    this.setState({ mode: "equipment" });
                  }}>
                  Equipment
                </Link>
              </Grid>
            </Grid>
            <Grid item 
              style={{ 
                height: `${formHeight}px`, 
                overflowY: "scroll", 
                overflowX: "hidden" 
              }}>
                { this.render_tab() }
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={ this.state.processing || !this.state.child_names_valid || this.state.obj.name === "" || this.state.obj.race.race_id === "" || this.state.obj.background.background_id === "" || this.state.obj.classes.length === 0 }
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
                  this.setState({ redirectTo:`/beyond/character` });
                }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        ); 
      }
    }
  }

  render_tab() {
    if (this.state.mode === "race") {
      return (
        <CharacterRaceInput 
          obj={this.state.obj}
          onChange={(changed: CharacterRace) => {
            const obj = this.state.obj;
            obj.race = changed;
            this.char_util.recalcAll(obj);
            this.setState({ obj });
          }}
        />
      );
    } else if (this.state.mode === "background") {
      return (
        <CharacterBackgroundInput 
          obj={this.state.obj}
          onChange={(changed: CharacterBackground) => {
            const obj = this.state.obj;
            obj.background = changed;
            this.char_util.recalcAll(obj);
            this.setState({ obj });
          }}
        />
      );
    } else if (this.state.mode === "abilities") {
      return (
        <CharacterAbilityScoresInput
          obj={this.state.obj}
          onChange={(changed: AbilityScores) => {
            const obj = this.state.obj;
            obj.base_ability_scores = changed;
            this.char_util.recalcAll(obj);
            this.setState({ obj });
          }}
        />
      );
    } else if (this.state.mode === "class") {
      return (
        <CharacterClassInput
          obj={this.state.obj}
          onChange={(changed: Character) => {
            const obj = changed;
            this.char_util.recalcAll(obj);
            this.setState({ obj });
          }}
        />
      );
    } else if (this.state.mode === "equipment") {
      return (
        <CharacterEquipment
          obj={this.state.obj}
          onChange={() => {
            const obj = this.state.obj;
            this.char_util.recalcAll(obj);
            this.setState({ obj });
          }}
        />
      );
    } else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <StringBox 
              value={this.state.obj.name} 
              message={this.state.obj.name.length > 0 ? "" : "Name Invalid"} 
              name="Name"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.name = value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item>
            <StringBox 
              value={this.state.obj.description} 
              name="Description"
              multiline
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.description = value;
                this.setState({ obj });
              }}
            />
          </Grid>
        </Grid>
      ); 
    }
  }
}

export default connector(CharacterEdit);
