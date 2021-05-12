import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
} from "@material-ui/core";

import { 
  Character,
  CreatureAbility,
  MinionAbility,
  CharacterClass,
  CharacterFeatureBase,
  CharacterFeature,
  CharacterRace,
  CharacterSubRace,
  CharacterEldritchInvocation,
  CharacterFightingStyle,
  CharacterLanguageFeature,
  Proficiency,
  SpellcastingFeature,
  ResourceFeature,
  Ability,
  SpellModifier,
  SenseFeature,
  Advantage,
  CharacterASIBaseFeature,
  SpellAsAbility,
  // UpgradableNumber,
  IStringHash
} from "../../../models";

import DisplayObjects from "../display/DisplayObjects";
import DisplaySpellcasting from "../display/DisplaySpellcasting";
import DisplayResource from "../display/DisplayResource";
import DisplayAbility from "../display/DisplayAbility";
import DisplaySpellModifier from "../display/DisplaySpellModifier";


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
  item: CharacterFeatureBase | string;
  source: CharacterRace | CharacterSubRace | CharacterClass | null;
  onChange: () => void;
  onClose: () => void;
}

export interface State {
}

class CharacterFeatureBaseDetails extends Component<Props, State> {
  
  componentDidMount() {
  }

  render() {
    if (this.props.item instanceof CharacterFeatureBase) {
      if (this.props.item.feature_base && this.props.source) {
        return (
          <div 
            style={{ 
              backgroundColor: "white",
              color: "black",
              border: "1px solid blue",
              height: "800px",
              width: "324px",
              overflowX: "hidden",
              padding: "4px",
              fontSize: "11px",
              lineHeight: "1.2"
            }}>
            <Grid container spacing={1} direction="column"
              style={{ 
                backgroundColor: "white",
                color: "black",
                minHeight: "800px",
                width: "316px",
                overflowX: "hidden"
              }}>
              <Grid item>
                { this.props.source.name }
              </Grid>
              <Grid item style={{
                fontWeight: "bold",
                fontSize: "20px"
              }}>
                { this.props.item.name }
              </Grid>
              { this.props.item.feature_base.description.length > 0 &&
                <Grid item>
                  { this.props.item.feature_base.description }
                </Grid>
              }
              { this.renderFeatures() }
            </Grid>
          </div>
        );
      }
    } else if (this.props.source instanceof CharacterClass && this.props.source.game_class) {
      if (this.props.item === "hp") {
        const hit_die = this.props.source.game_class.hit_die;
        return (
          <div 
            style={{ 
              backgroundColor: "white",
              color: "black",
              border: "1px solid blue",
              height: "800px",
              width: "324px",
              overflowX: "hidden",
              padding: "4px",
              fontSize: "11px",
              lineHeight: "1.2"
            }}>
            <Grid container spacing={1} direction="column"
              style={{ 
                backgroundColor: "white",
                color: "black",
                minHeight: "800px",
                width: "316px",
                overflowX: "hidden"
              }}>
              <Grid item>
                { this.props.source.name }
              </Grid>
              <Grid item style={{
                fontWeight: "bold",
                fontSize: "20px"
              }}>
                Hit Points
              </Grid>
              <Grid item container spacing={0} direction="column">
                <Grid item>
                  <b>Hit Dice:</b>&nbsp;1d{ hit_die } per { this.props.source.name } level
                </Grid>
                <Grid item>
                  <b>Hit Points at 1st Level:</b>&nbsp;{ hit_die } + your Constitution modifier
                </Grid>
                <Grid item>
                  <b>Hit Points at Higher Levels:</b>&nbsp;1d{ hit_die } (or { hit_die / 2 + 1})
                  + your Constitution modifier per { this.props.source.name } level after 1st
                </Grid>
              </Grid>
            </Grid>
          </div>
        );
      } else if (this.props.item === "subclass") {
        return (
          <div 
            style={{ 
              backgroundColor: "white",
              color: "black",
              border: "1px solid blue",
              height: "800px",
              width: "324px",
              overflowX: "hidden",
              padding: "4px",
              fontSize: "11px",
              lineHeight: "1.2"
            }}>
            <Grid container spacing={1} direction="column"
              style={{ 
                backgroundColor: "white",
                color: "black",
                minHeight: "800px",
                width: "316px",
                overflowX: "hidden"
              }}>
              <Grid item>
                { this.props.source.name }
              </Grid>
              <Grid item style={{
                fontWeight: "bold",
                fontSize: "20px"
              }}>
                { this.props.source.game_class.subclasses_called }
              </Grid>
              <Grid item>
                { this.props.source.game_class.subclass_description }
              </Grid>
              <Grid item>
                <b>Selected { this.props.source.game_class.subclasses_called }:</b>&nbsp;{ this.props.source.subclass && this.props.source.subclass.name }
              </Grid>
            </Grid>
          </div>
        );
      }
    }
    return null;
  }

  renderFeatures() {
    if (this.props.item instanceof CharacterFeatureBase && this.props.item.feature_base && this.props.source) {
      return this.props.item.features.map((feature, key) => {
        return this.renderFeature(feature, key);
      });
    }
  }

  renderFeature(feature: CharacterFeature, key: number) {
    if (feature.feature_type === "Saving Throw Proficiencies") {
      const the_prof = feature.feature.the_feature as Proficiency;
      const details = the_prof.the_proficiencies.join(", ");
      return (
        <Grid item key={key}>
          <b>{ feature.name }:</b>&nbsp;{ details }
        </Grid>
      );
    } else if (feature.feature_type === "Spellcasting") {
      const spellcasting = feature.feature.the_feature as SpellcastingFeature;
      return (
        <Grid item key={key}>
          <DisplaySpellcasting spellcasting={spellcasting} />
        </Grid>
      );
    } else if (feature.feature_type === "Spells") {
      return (
        <Grid item key={key}>
          <b>{ feature.name }:</b>&nbsp;{ feature.feature.the_feature }
        </Grid>
      );
    } else if (feature.feature_type === "Sense") {
      const sense_feature = feature.feature.the_feature as SenseFeature;
      return (
        <Grid item key={key}>
          <b><DisplayObjects type="sense" ids={[sense_feature.sense_id]} />:</b>&nbsp;Out to { sense_feature.range } feet
        </Grid>
      );
    } else if (feature.feature_type === "Advantage") {
      const adv = feature.feature.the_feature as Advantage;
      if (adv.type === "Saving Throw") {
        return (
          <Grid item key={key}>
            <b>Advantage on { adv.type_detail } Saving Throws { adv.formula }</b>
          </Grid>
        );
      } else {
        return (
          <Grid item key={key}>
            <b>Coming Soon</b>
          </Grid>
        )
      }
    } else if (feature.feature_type === "Ability Score Improvement") {
      const asi = feature.feature_options[0] as CharacterASIBaseFeature;
      if (asi.feat_option) {
        return (
          <Grid item key={key}>
            <b>Coming Soon</b>
          </Grid>
        );
      } else {
        return (
          <Grid item key={key} container spacing={0} direction="column">
            { asi.asi_features.map((asif, key2) => {
              return (
                <Grid item key={key2}>
                  <b>{ asif.selected_option } increased by { asif.amount }</b>
                </Grid>
              );
            })}
          </Grid>
        )
      }
    } else if (feature.feature_type === "Spell Modifier") {
      return (
        <Grid item key={key}>
          <DisplaySpellModifier
            modifier={feature.feature.the_feature as SpellModifier}
          />
        </Grid>
      );
    } else if (feature.feature_type === "Resource") {
      const rf = feature.feature.the_feature as ResourceFeature;
      return (
        <Grid item key={key}>
          <DisplayResource obj={this.props.obj} 
            resource_feature={rf} 
            onChange={() => {
              this.props.onChange();
            }} 
          />
        </Grid>
      );
    } else if (feature.feature_type === "Ability") {
      const ability = feature.feature.the_feature as Ability;
      return (
        <Grid item key={key}>
          <DisplayAbility obj={this.props.obj} 
            ability={ability}
            onChange={() => {
              this.props.onChange();
            }}  
          />
        </Grid>
      );
    } else if (feature.feature_type === "Creature Ability") {
      const ability = feature.feature.the_feature as CreatureAbility;
      return (
        <Grid item key={key}>
          { ability.name }
          {/* <DisplayAbility obj={this.props.obj} 
            ability={ability}
            onChange={() => {
              this.props.onChange();
            }}  
          /> */}
        </Grid>
      );
    } else if (feature.feature_type === "Minion Ability") {
      const ability = feature.feature.the_feature as MinionAbility;
      return (
        <Grid item key={key}>
          { ability.name }
          {/* <DisplayAbility obj={this.props.obj} 
            ability={ability}
            onChange={() => {
              this.props.onChange();
            }}  
          /> */}
        </Grid>
      );
    } else if (feature.feature_type === "Extra Attacks") {
      const attacks = feature.feature.the_feature as number;
      return (
        <Grid item key={key}>
          { attacks }
        </Grid>
      );
    } else if (feature.feature_type === "Unarmed Strike Size") {
      const size = feature.feature.the_feature as number;
      return (
        <Grid item key={key}>
          { size }
        </Grid>
      );
    } else if (feature.feature_type === "Unarmed Strike Count") {
      const count = feature.feature.the_feature as number;
      return (
        <Grid item key={key}>
          { count }
        </Grid>
      );
    } else if (feature.feature_type === "Unarmed Strike Bonus Action") {
      return (
        <Grid item key={key}>
          You can make an unarmed strike as a Bonus Action.
        </Grid>
      );
    } else if (feature.feature_type === "Unarmed Strike Damage Type") {
      const damage_type = feature.feature.the_feature as string;
      return (
        <Grid item key={key}>
          Your Unarmed Strikes can deal { damage_type } damage.
        </Grid>
      );
    } else if (feature.feature_type === "Unarmed Strike Score") {
      const score = feature.feature.the_feature as string;
      return (
        <Grid item key={key}>
          Your Unarmed Strikes can use your { score } modifier.
        </Grid>
      );
    } else if (feature.feature_type === "Spell as Ability") {
      const ability = feature.feature.the_feature as SpellAsAbility;
      return (
        <Grid item key={key}>
          <DisplayAbility obj={this.props.obj} 
            ability={ability}
            onChange={() => {
              this.props.onChange();
            }}  
          />
        </Grid>
      );
    } else if (feature.feature_type === "Eldritch Invocation") {
      const ei = feature.feature_options[0] as CharacterEldritchInvocation;
      return this.renderEldritchInvocation(ei, key);
    } else if (feature.feature_type === "Fighting Style") {
      const ei = feature.feature_options[0] as CharacterFightingStyle;
      return this.renderFightingStyle(ei, key);
    } else if (feature.feature_type === "Cantrips from List") {
      const cfl = feature.feature.the_feature as IStringHash;
      const cantrip_ids = feature.feature_options as string[];
      return (
        <Grid item key={key} container spacing={1} direction="column">
          <Grid item>
            You learn { cfl.count } cantrips of your choice from the <DisplayObjects type="spell_list" ids={[cfl.list_id]} /> spell list. 
            { cfl.spellcasting_ability } is your spellcasting ability for them. 
            Whenever you gain a level in this class, you can replace one of these cantrips with another cantrip from the <DisplayObjects type="spell_list" ids={[cfl.list_id]} /> spell list. 
          </Grid>
          <Grid item>
            <DisplayObjects type="spell" ids={cantrip_ids} />
          </Grid>
        </Grid>
      );
    } else if (feature.feature_type === "Spells from List") {
      const sfl = feature.feature.the_feature as IStringHash;
      const spell_ids = feature.feature_options as string[];
      return (
        <Grid item key={key} container spacing={1} direction="column">
          <Grid item>
            You learn { sfl.count } spells of your choice from { sfl.list_id === "Any" ? <span>any</span> : <span>the <DisplayObjects type="spell_list" ids={[sfl.list_id]} /></span> } spell list. 
            A spell you choose must be of a level you can cast, 
            as shown on the <DisplayObjects type="game_class" ids={[sfl.count_as_class_id]} /> table, or a cantrip. 
            The chosen spells count as <DisplayObjects type="game_class" ids={[sfl.count_as_class_id]} /> spells for you 
            but don’t count against the number of <DisplayObjects type="game_class" ids={[sfl.count_as_class_id]} /> spells you know.
          </Grid>
          <Grid item>
            <DisplayObjects type="spell" ids={spell_ids} />
          </Grid>
        </Grid>
      );
    } else {
      let ids: string[] = [];
      let type = "";
      if (feature.feature_type === "Skill Proficiency Choices") {
        ids = feature.feature_options.map(o => o.skill_id);
        type = "skill";
      } else if (feature.feature_type === "Weapon Proficiencies") {
        const the_prof = feature.feature.the_feature as Proficiency;
        ids = the_prof.the_proficiencies;
        type = "weapon_keyword";
      } else if (feature.feature_type === "Armor Proficiencies") {
        const the_prof = feature.feature.the_feature as Proficiency;
        ids = the_prof.the_proficiencies;
        type = "armor_type";
      } else if (feature.feature_type === "Language") {
        const lang_feature = feature.feature_options[0] as CharacterLanguageFeature;
        ids = [lang_feature.language_id];
        type = "language";
      } else {
        console.log(feature);
      }
      const details = <DisplayObjects ids={ids} type={type} />;
      return (
        <Grid item key={key}>
          <b>{ feature.name }:</b>&nbsp;{ details }
        </Grid>
      );
    }
  }

  renderEldritchInvocation(ei: CharacterEldritchInvocation, key1: number) {
    if (ei.eldritch_invocation) {
      return (
        <Grid item key={key1} container spacing={0} direction="row">
          <Grid item xs={12}>
            <b>{ ei.eldritch_invocation.name }:</b>&nbsp;{ ei.eldritch_invocation.description }
          </Grid>
          <Grid item xs={1} container spacing={0} direction="row">
            <Grid item xs={6} style={{ borderRight: "1px solid lightgray" }}></Grid>
            <Grid item xs={6}></Grid>
          </Grid>
          <Grid item xs={11} container spacing={0} direction="column">
            { ei.features.map((f, key) => {
              return this.renderFeature(f, key);
            })}
          </Grid>
        </Grid>
      );
    } else return null;
  }

  renderFightingStyle(ei: CharacterFightingStyle, key1: number) {
    if (ei.fighting_style) {
      return (
        <Grid item key={key1} container spacing={0} direction="row">
          <Grid item xs={12}>
            <b>{ ei.fighting_style.name }:</b>&nbsp;{ ei.fighting_style.description }
          </Grid>
          <Grid item xs={1} container spacing={0} direction="row">
            <Grid item xs={6} style={{ borderRight: "1px solid lightgray" }}></Grid>
            <Grid item xs={6}></Grid>
          </Grid>
          <Grid item xs={11} container spacing={0} direction="column">
            { ei.features.map((f, key) => {
              return this.renderFeature(f, key);
            })}
          </Grid>
        </Grid>
      );
    } else return null;
  }
}

export default connector(CharacterFeatureBaseDetails);
