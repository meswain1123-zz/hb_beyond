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
  SpellSlotType,
  SourceBook,
  User
} from "../../models";

import StringBox from "../../components/input/StringBox";
import ToggleButtonBox from "../../components/input/ToggleButtonBox";
import CenteredMenu from "../../components/input/CenteredMenu";

import CharacterRaceInput from "../../components/model_inputs/character/CharacterRace";
import CharacterLineageInput from "../../components/model_inputs/character/CharacterLineageInput";
import CharacterBackgroundInput from "../../components/model_inputs/character/CharacterBackground";
import CharacterAbilityScoresInput from "../../components/model_inputs/character/CharacterAbilityScoresInput";
import CharacterClassInput from "../../components/model_inputs/character/CharacterClassInput";
import CharacterEquipment from "../../components/model_inputs/character/CharacterEquipment";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";
import CharacterUtilities from "../../utilities/character_utilities";
import { CharacterUtilitiesClass } from "../../utilities/character_utilities_class";



interface AppState {
  loginUser: User | null;
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
  loginUser: state.app.loginUser,
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
  source_books: SourceBook[] | null;
  loading: boolean;
  logging_in: boolean;
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
      mode: "Home",
      armor_types: null,
      weapon_keywords: null,
      spells: null,
      spell_slot_types: null,
      eldritch_invocations: null,
      source_books: null,
      loading: false,
      logging_in: false
    };
    this.api = API.getInstance();
    this.char_util = CharacterUtilities.getInstance();
  }

  api: APIClass;
  char_util: CharacterUtilitiesClass;

  componentDidMount() {
    if (this.props.loginUser === null) {
      const userObjStr = localStorage.getItem("loginUser");
      if (!userObjStr) {
        this.setState({ redirectTo: "/beyond" });
      } else {
        this.setState({ logging_in: true }, this.check_login);
      }
    } else {
      this.load();
    }
  }

  check_login() {
    setTimeout(() => {
      if (this.props.loginUser === null) {
        this.check_login();
      } else {
        this.setState({ logging_in: false }, this.load);
      }
    }, 1000);
  }

  submit() {
    this.setState({ processing: true }, () => {
      const obj = this.state.obj;
      obj.current_hit_points = obj.max_hit_points;
      if (obj._id && obj._id !== "") {
        this.api.updateObject("character", obj).then((res: any) => {
          this.setState({ processing: false, redirectTo: "/beyond/character" });
        });
      } else {
        obj.owner_id = this.props.loginUser ? this.props.loginUser._id : "No Login";
        this.api.createObject("character", obj).then((res: any) => {
          this.setState({ processing: false, redirectTo: "/beyond/character" });
        });
      }
    });
  }

  // Loads the editing Character into state
  load_object(id: string) {
    this.api.getFullObject("character", id).then((res: any) => {
      if (res) {
        const obj = res;
        this.char_util.recalcAll(obj);
        this.setState({ obj, loading: false });
      }
    });
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["armor_type","spell","spell_slot_type","eldritch_invocation","weapon_keyword","source_book"]).then((res: any) => {
        const armor_types: ArmorType[] = res.armor_type;
        const spells: Spell[] = res.spell;
        let { id } = this.props.match.params;
        if (id !== undefined && this.state.obj._id !== id) {
          this.setState({ 
            armor_types,
            spells,
            spell_slot_types: res.spell_slot_type,
            eldritch_invocations: res.eldritch_invocation,
            weapon_keywords: res.weapon_keyword,
            source_books: res.source_book
          }, () => {
            this.load_object(id);
          }); 
        } else {
          this.setState({ 
            armor_types,
            spells,
            spell_slot_types: res.spell_slot_type,
            eldritch_invocations: res.eldritch_invocation,
            weapon_keywords: res.weapon_keyword,
            source_books: res.source_book, 
            loading: false 
          });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.armor_types === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
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
          <Grid item>
            { this.state.obj.source_books.includes("60d9e2ff909a1d2014235f15") ? 
              <CenteredMenu
                options={["Home","Race","Background","Abilities","Class","Equipment","Lineage"]}
                selected={this.state.mode}
                onSelect={(mode: string) => {
                  this.setState({ mode });
                }}
              />
            : 
              <CenteredMenu
                options={["Home","Race","Background","Abilities","Class","Equipment"]}
                selected={this.state.mode}
                onSelect={(mode: string) => {
                  this.setState({ mode });
                }}
              />
          }
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

  render_tab() {
    if (this.state.mode === "Race") {
      return (
        <CharacterRaceInput 
          character={this.state.obj}
          onChange={(changed: CharacterRace) => {
            const obj = this.state.obj;
            obj.race = changed;
            this.char_util.recalcAll(obj);
            this.setState({ obj });
          }}
        />
      );
    } else if (this.state.mode === "Background") {
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
    } else if (this.state.mode === "Abilities") {
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
    } else if (this.state.mode === "Class") {
      return (
        <CharacterClassInput
          character={this.state.obj}
          onChange={(changed: Character) => {
            const obj = changed;
            this.char_util.recalcAll(obj);
            this.setState({ obj });
          }}
        />
      );
    } else if (this.state.mode === "Equipment") {
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
    } else if (this.state.mode === "Lineage") {
      return (
        <CharacterLineageInput 
          character={this.state.obj}
          onChange={(changed: Character) => {
            const obj = changed;
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
            <ToggleButtonBox 
              name="Custom Origins"
              value={this.state.obj.custom_origins} 
              onToggle={() => {
                const obj = this.state.obj;
                obj.custom_origins = !obj.custom_origins;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item>
            <ToggleButtonBox 
              name="Optional Features"
              value={this.state.obj.optional_features} 
              onToggle={() => {
                const obj = this.state.obj;
                obj.optional_features = !obj.optional_features;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item>
            <ToggleButtonBox 
              name="Homebrew Content"
              value={this.state.obj.allow_homebrew} 
              onToggle={() => {
                const obj = this.state.obj;
                obj.allow_homebrew = !obj.allow_homebrew;
                this.setState({ obj });
              }}
            />
          </Grid>
          { this.state.source_books && this.state.source_books.map((book, key) => {
            return (
              <Grid item key={key}>
                <ToggleButtonBox 
                  name={`${book.abbreviation} Content`}
                  value={this.state.obj.source_books.includes(book._id)} 
                  onToggle={() => {
                    const obj = this.state.obj;
                    if (this.state.obj.source_books.includes(book._id)) {
                      obj.source_books = obj.source_books.filter(o => o !== book._id);
                    } else {
                      obj.source_books.push(book._id);
                    }
                    this.setState({ obj });
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ); 
    }
  }
}

export default connector(CharacterEdit);
