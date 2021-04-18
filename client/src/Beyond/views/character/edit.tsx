import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  // Add, Edit,
  ArrowBack
} from "@material-ui/icons";
import {
  Grid, 
  // List, ListItem, 
  Button, 
  Tooltip, Fab,
  Link,
  // FormControl, InputLabel,
  // OutlinedInput, FormHelperText
} from "@material-ui/core";
// import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
// import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import {  
  ArmorType,
  AbilityScores,
  // Background,
  Character, 
  CharacterBackground,
  // CharacterClass,
  // CharacterItem,
  // CharacterFeature,
  CharacterRace,
  // CharacterResource,
  EldritchInvocation,
  FeatureBase,
  // GameClass,
  // Subclass,
  // Race,
  // Subrace,
  // BaseItem,
  // MagicItem,
  WeaponKeyword,
  Spell,
  SpellSlotType
} from "../../models";
import StringBox from "../../components/input/StringBox";
// import SelectBox from "../../components/input/SelectBox";
// import SelectStringBox from "../../components/input/SelectStringBox";
// import CheckBox from "../../components/input/CheckBox";
// import FeatureBasesInput from "../../components/model_inputs/feature/FeatureBases";
// import FeatureBaseInput from "../../components/model_inputs/feature/FeatureBase";
// import SelectArmorTypeBox from "../../components/model_inputs/SelectArmorTypeBox";
// import SelectBaseItemBox from "../../components/model_inputs/SelectBaseItemBox";
import CharacterRaceInput from "../../components/model_inputs/character/CharacterRace";
import CharacterBackgroundInput from "../../components/model_inputs/character/CharacterBackground";
import CharacterAbilityScoresInput from "../../components/model_inputs/character/CharacterAbilityScoresInput";
import CharacterClassInput from "../../components/model_inputs/character/CharacterClassInput";
import CharacterEquipment from "../../components/model_inputs/character/CharacterEquipment";
// import { 
//   ITEM_TYPES
// } from "../../models/Constants";
import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";
import CharacterUtilities from "../../utilities/character_utilities";
import { CharacterUtilitiesClass } from "../../utilities/character_utilities_class";



interface AppState {
  // characters: Character[] | null;
  // skills: Skill[] | null;
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
  // characters: state.app.characters,
  // skillsMB: state.app.skills as ModelBase[],
  // skills: state.app.skills,
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
  // setCharacters: (objects: Character[]) => ({ type: 'SET', dataType: 'characters', payload: objects }),
  // addCharacter: (object: Character) => ({ type: 'ADD', dataType: 'characters', payload: object })
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
  // characters: Character[] | null;
  armor_types: ArmorType[] | null;
  // game_classes: GameClass[] | null;
  // subclasses: Subclass[] | null;
  // races: Race[] | null;
  // subraces: Subrace[] | null;
  // base_items: BaseItem[] | null;
  // magic_items: MagicItem[] | null;
  weapon_keywords: WeaponKeyword[] | null;
  spells: Spell[] | null;
  spell_slot_types: SpellSlotType[] | null;
  eldritch_invocations: EldritchInvocation[] | null;
  // backgrounds: Background[] | null;
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
      // characters: null,
      armor_types: null,
      // game_classes: null,
      // subclasses: null,
      // races: null,
      // subraces: null,
      // base_items: null,
      // magic_items: null,
      weapon_keywords: null,
      spells: null,
      spell_slot_types: null,
      eldritch_invocations: null,
      // backgrounds: null,
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
        // if (this.state.armor_types && this.state.spells && this.state.spell_slot_types && this.state.eldritch_invocations && this.state.weapon_keywords) {
        //   obj.recalcAll(this.state.armor_types, this.state.weapon_keywords, this.state.spells, this.state.spell_slot_types, this.state.eldritch_invocations);
        // }
        // this.setState({ 
        //   obj
        // });
      }
    });
    // const objFinder = this.state.characters ? this.state.characters.filter(a => a._id === id) : [];
    // if (objFinder.length === 1 && this.state.races && this.state.backgrounds && this.state.game_classes && this.state.subclasses) {
    //   const obj = objFinder[0];
    //   if (obj.race.race_id !== "" && !obj.race.race) {
    //     const races = this.state.races;
    //     const obj_finder = races.filter(o => o._id === obj.race.race_id);
    //     if (obj_finder.length === 1) {
    //       obj.race.connectRace(obj_finder[0]);
    //     }
    //   }
    //   if (obj.background.background_id !== "" && !obj.background.background) {
    //     const backgrounds = this.state.backgrounds;
    //     const obj_finder = backgrounds.filter(o => o._id === obj.background.background_id);
    //     if (obj_finder.length === 1) {
    //       obj.background.connectBackground(obj_finder[0]);
    //     }
    //   }
    //   const game_classes = this.state.game_classes;
    //   const subclasses = this.state.subclasses;
    //   obj.classes.forEach(char_class => {
    //     if (!char_class.game_class) {
    //       const objFinder = game_classes.filter(o => o._id === char_class.game_class_id);
    //       if (objFinder.length === 1) {
    //         char_class.connectGameClass(objFinder[0]);
    //       }
    //     }
    //     if (char_class.subclass_id !== "" && !char_class.subclass) {
    //       const objFinder = subclasses.filter(o => o._id === char_class.subclass_id);
    //       if (objFinder.length === 1) {
    //         char_class.connectSubclass(objFinder[0]);
    //       }
    //     }
    //   });
    //   const base_items = this.state.base_items;
    //   const magic_items = this.state.magic_items;
    //   // const magic_item_keywords = this.state.magic_item_keywords;
    //   obj.items.forEach(item => {
    //     if (!item.base_item && magic_items && base_items) {
    //       if (item.magic_item_id !== "") {
    //         const objFinder = magic_items.filter(o => o._id === item.magic_item_id);
    //         if (objFinder.length === 1) {
    //           item.connectMagicItem(objFinder[0]);
    //         }
    //       } else {
    //         const objFinder = base_items.filter(o => o._id === item.base_item_id);
    //         if (objFinder.length === 1) {
    //           item.connectBaseItem(objFinder[0]);
    //         }
    //       }
    //     }
    //   });
    //   if (this.state.armor_types && this.state.spells) {
    //     obj.recalcAll(this.state.armor_types, this.state.spells);
    //   }
    //   this.setState({ obj });
    // }
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
                // color="primary"
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
            // if (this.state.armor_types && this.state.spells && this.state.spell_slot_types && this.state.eldritch_invocations && this.state.weapon_keywords) {
            //   obj.recalcAll(this.state.armor_types, this.state.weapon_keywords, this.state.spells, this.state.spell_slot_types, this.state.eldritch_invocations);
            // }
            // this.setState({ obj });
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
            // if (this.state.armor_types && this.state.spells && this.state.spell_slot_types && this.state.eldritch_invocations && this.state.weapon_keywords) {
            //   obj.recalcAll(this.state.armor_types, this.state.weapon_keywords, this.state.spells, this.state.spell_slot_types, this.state.eldritch_invocations);
            // }
            // this.setState({ obj });
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
            // if (this.state.armor_types && this.state.spells && this.state.spell_slot_types && this.state.eldritch_invocations && this.state.weapon_keywords) {
            //   obj.recalcAll(this.state.armor_types, this.state.weapon_keywords, this.state.spells, this.state.spell_slot_types, this.state.eldritch_invocations);
            // }
            // this.setState({ obj });
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
            // const obj = this.state.obj;
            // obj.base_ability_scores = changed;
            // obj.recalcAbilityScores();
            // if (this.state.armor_types && this.state.spells && this.state.spell_slot_types && this.state.eldritch_invocations && this.state.weapon_keywords) {
            //   changed.recalcAll(this.state.armor_types, this.state.weapon_keywords, this.state.spells, this.state.spell_slot_types, this.state.eldritch_invocations);
            // }
            // this.setState({ obj: changed });
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
            // const obj = this.state.obj;
            // if (this.state.armor_types && this.state.spells && this.state.spell_slot_types && this.state.eldritch_invocations && this.state.weapon_keywords) {
            //   obj.recalcAll(this.state.armor_types, this.state.weapon_keywords, this.state.spells, this.state.spell_slot_types, this.state.eldritch_invocations);
            // }
            // this.setState({ obj });
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
