import React, { Component } from "react";
import { connect, ConnectedProps } from 'react-redux';
import { 
  Route, 
  Switch 
} from "react-router-dom";

import HomePage from "./Home";
import DMPage from "./DMPage";

import SpellIndex from "./spell";
import SpellEdit from "./spell/edit";
import SpellDetails from "./spell/details";

import SpellSlotTableIndex from "./spell_slot_tables";
import SpellSlotTableEdit from "./spell_slot_tables/edit";
import SpellSlotTableDetails from "./spell_slot_tables/details";

import ArmorTypeIndex from "./armor_type";
import ArmorTypeEdit from "./armor_type/edit";
import ArmorTypeDetails from "./armor_type/details";

import BackgroundIndex from "./background";
import BackgroundEdit from "./background/edit";
import BackgroundDetails from "./background/details";

import ResourceIndex from "./resource";
import ResourceEdit from "./resource/edit";
import ResourceDetails from "./resource/details";

import BaseItemIndex from "./base_item";
import BaseItemEdit from "./base_item/edit";
import BaseItemDetails from "./base_item/details";

import CampaignIndex from "./campaign";
import CampaignEdit from "./campaign/edit";
import CampaignDetails from "./campaign/details";
import CampaignJoin from "./campaign/join";

import CharacterIndex from "./character";
import CharacterEdit from "./character/edit";
import CharacterDetails from "./character/details";

import CreatureIndex from "./creature";
import CreatureEdit from "./creature/edit";
import CreatureDetails from "./creature/details";

import FeatIndex from "./feat";
import FeatEdit from "./feat/edit";
import FeatDetails from "./feat/details";

import EldritchInvocationIndex from "./eldritch_invocation";
import EldritchInvocationEdit from "./eldritch_invocation/edit";
import EldritchInvocationDetails from "./eldritch_invocation/details";

import FightingStyleIndex from "./fighting_style";
import FightingStyleEdit from "./fighting_style/edit";
import FightingStyleDetails from "./fighting_style/details";

import ConditionIndex from "./condition";
import ConditionEdit from "./condition/edit";
import ConditionDetails from "./condition/details";

import PactBoonIndex from "./pact_boon";
import PactBoonEdit from "./pact_boon/edit";
import PactBoonDetails from "./pact_boon/details";

import GameClassIndex from "./game_class";
import GameClassEdit from "./game_class/edit";
import GameClassDetails from "./game_class/details";

import SubclassIndex from "./subclass";
import SubclassEdit from "./subclass/edit";
import SubclassDetails from "./subclass/details";

import EquipmentPackIndex from "./equipment_pack";
import EquipmentPackEdit from "./equipment_pack/edit";
import EquipmentPackDetails from "./equipment_pack/details";

import MagicItemIndex from "./magic_item";
import MagicItemEdit from "./magic_item/edit";
import MagicItemDetails from "./magic_item/details";

import MagicItemKeywordIndex from "./magic_item_keyword";
import MagicItemKeywordEdit from "./magic_item_keyword/edit";
import MagicItemKeywordDetails from "./magic_item_keyword/details";

import RaceIndex from "./race";
import RaceEdit from "./race/edit";
import RaceDetails from "./race/details";

import SubraceEdit from "./subrace/edit";
import SubraceDetails from "./subrace/details";

import SkillIndex from "./skill";
import SkillEdit from "./skill/edit";
import SkillDetails from "./skill/details";

import SenseIndex from "./sense";
import SenseEdit from "./sense/edit";
import SenseDetails from "./sense/details";

import UserIndex from "./user";
import UserEdit from "./user/edit";
import UserDetails from "./user/details";

import WeaponKeywordIndex from "./weapon_keyword";
import WeaponKeywordEdit from "./weapon_keyword/edit";
import WeaponKeywordDetails from "./weapon_keyword/details";

import LanguageIndex from "./language";
import LanguageEdit from "./language/edit";
import LanguageDetails from "./language/details";

import LineageIndex from "./lineage";
import LineageEdit from "./lineage/edit";
import LineageDetails from "./lineage/details";

import SpellListIndex from "./spell_list";
import SpellListEdit from "./spell_list/edit";
import SpellListDetails from "./spell_list/details";

import SpecialFeatureIndex from "./special_feature";
import SpecialFeatureEdit from "./special_feature/edit";
import SpecialFeatureDetails from "./special_feature/details";

import SourceBookIndex from "./source_book";
import SourceBookEdit from "./source_book/edit";
import SourceBookDetails from "./source_book/details";

import ToolIndex from "./tool";
import ToolEdit from "./tool/edit";
import ToolDetails from "./tool/details";

import Attributions from "./attributions";

import Login from '../components/Login';

import API from "../utilities/smart_api";
import { APIClass } from "../utilities/smart_api_class";


interface AppState {
  loginOpen: boolean;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  loginOpen: state.app.loginOpen
})

const mapDispatch = {
  toggleLogin: () => ({ type: 'TOGGLE_LOGIN' }),
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { }

export interface State { }

class MainPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      version: "0"
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  render() {
    if (this.props.loginOpen) {
      return (
        <Login />
      );
    } else {
      return (
        <Switch>
          <Route exact path="/beyond" component={HomePage} />
          <Route exact path="/beyond/home" component={HomePage} />
          <Route exact path="/beyond/attributions" component={Attributions} />

          <Route exact path="/beyond/skill" component={SkillIndex} />
          <Route exact path="/beyond/skill/details/:id" component={SkillDetails} />
          <Route exact path="/beyond/skill/create" component={SkillEdit} />
          <Route exact path="/beyond/skill/edit/:id" component={SkillEdit} />

          <Route exact path="/beyond/sense" component={SenseIndex} />
          <Route exact path="/beyond/sense/details/:id" component={SenseDetails} />
          <Route exact path="/beyond/sense/create" component={SenseEdit} />
          <Route exact path="/beyond/sense/edit/:id" component={SenseEdit} />

          <Route exact path="/beyond/spell" component={SpellIndex} />
          <Route exact path="/beyond/spell/details/:id" component={SpellDetails} />
          <Route exact path="/beyond/spell/create" component={SpellEdit} />
          <Route exact path="/beyond/spell/edit/:id" component={SpellEdit} />

          <Route exact path="/beyond/spell_slot_type" component={SpellSlotTableIndex} />
          <Route exact path="/beyond/spell_slot_type/details/:id" component={SpellSlotTableDetails} />
          <Route exact path="/beyond/spell_slot_type/create" component={SpellSlotTableEdit} />
          <Route exact path="/beyond/spell_slot_type/edit/:id" component={SpellSlotTableEdit} />

          <Route exact path="/beyond/armor_type" component={ArmorTypeIndex} />
          <Route exact path="/beyond/armor_type/details/:id" component={ArmorTypeDetails} />
          <Route exact path="/beyond/armor_type/create" component={ArmorTypeEdit} />
          <Route exact path="/beyond/armor_type/edit/:id" component={ArmorTypeEdit} />

          <Route exact path="/beyond/language" component={LanguageIndex} />
          <Route exact path="/beyond/language/details/:id" component={LanguageDetails} />
          <Route exact path="/beyond/language/create" component={LanguageEdit} />
          <Route exact path="/beyond/language/edit/:id" component={LanguageEdit} />

          <Route exact path="/beyond/lineage" component={LineageIndex} />
          <Route exact path="/beyond/lineage/details/:id" component={LineageDetails} />
          <Route exact path="/beyond/lineage/create" component={LineageEdit} />
          <Route exact path="/beyond/lineage/edit/:id" component={LineageEdit} />

          <Route exact path="/beyond/background" component={BackgroundIndex} />
          <Route exact path="/beyond/background/details/:id" component={BackgroundDetails} />
          <Route exact path="/beyond/background/create" component={BackgroundEdit} />
          <Route exact path="/beyond/background/edit/:id" component={BackgroundEdit} />

          <Route exact path="/beyond/resource" component={ResourceIndex} />
          <Route exact path="/beyond/resource/details/:id" component={ResourceDetails} />
          <Route exact path="/beyond/resource/create" component={ResourceEdit} />
          <Route exact path="/beyond/resource/edit/:id" component={ResourceEdit} />

          <Route exact path="/beyond/base_item" component={BaseItemIndex} />
          <Route exact path="/beyond/base_item/details/:id" component={BaseItemDetails} />
          <Route exact path="/beyond/base_item/create" component={BaseItemEdit} />
          <Route exact path="/beyond/base_item/edit/:id" component={BaseItemEdit} />

          <Route exact path="/beyond/campaign" component={CampaignIndex} />
          <Route exact path="/beyond/campaign/details/:id" component={CampaignDetails} />
          <Route exact path="/beyond/campaign/join/:id/:invite" component={CampaignJoin} />
          <Route exact path="/beyond/campaign/create" component={CampaignEdit} />
          <Route exact path="/beyond/campaign/edit/:id" component={CampaignEdit} />

          <Route exact path="/beyond/character" component={CharacterIndex} />
          <Route exact path="/beyond/character/details/:id" component={CharacterDetails} />
          <Route exact path="/beyond/character/create" component={CharacterEdit} />
          <Route exact path="/beyond/character/edit/:id" component={CharacterEdit} />
          <Route exact path="/beyond/character/create_on_campaign/:campaign_id/:unassigned" component={CharacterEdit} />

          <Route exact path="/beyond/creature" component={CreatureIndex} />
          <Route exact path="/beyond/creature/details/:id" component={CreatureDetails} />
          <Route exact path="/beyond/creature/create" component={CreatureEdit} />
          <Route exact path="/beyond/creature/edit/:id" component={CreatureEdit} />

          <Route exact path="/beyond/feat" component={FeatIndex} />
          <Route exact path="/beyond/feat/details/:id" component={FeatDetails} />
          <Route exact path="/beyond/feat/create" component={FeatEdit} />
          <Route exact path="/beyond/feat/edit/:id" component={FeatEdit} />

          <Route exact path="/beyond/eldritch_invocation" component={EldritchInvocationIndex} />
          <Route exact path="/beyond/eldritch_invocation/details/:id" component={EldritchInvocationDetails} />
          <Route exact path="/beyond/eldritch_invocation/create" component={EldritchInvocationEdit} />
          <Route exact path="/beyond/eldritch_invocation/edit/:id" component={EldritchInvocationEdit} />

          <Route exact path="/beyond/fighting_style" component={FightingStyleIndex} />
          <Route exact path="/beyond/fighting_style/details/:id" component={FightingStyleDetails} />
          <Route exact path="/beyond/fighting_style/create" component={FightingStyleEdit} />
          <Route exact path="/beyond/fighting_style/edit/:id" component={FightingStyleEdit} />

          <Route exact path="/beyond/condition" component={ConditionIndex} />
          <Route exact path="/beyond/condition/details/:id" component={ConditionDetails} />
          <Route exact path="/beyond/condition/create" component={ConditionEdit} />
          <Route exact path="/beyond/condition/edit/:id" component={ConditionEdit} />

          <Route exact path="/beyond/pact_boon" component={PactBoonIndex} />
          <Route exact path="/beyond/pact_boon/details/:id" component={PactBoonDetails} />
          <Route exact path="/beyond/pact_boon/create" component={PactBoonEdit} />
          <Route exact path="/beyond/pact_boon/edit/:id" component={PactBoonEdit} />

          <Route exact path="/beyond/game_class" component={GameClassIndex} />
          <Route exact path="/beyond/game_class/details/:id" component={GameClassDetails} />
          <Route exact path="/beyond/game_class/create" component={GameClassEdit} />
          <Route exact path="/beyond/game_class/edit/:id" component={GameClassEdit} />

          <Route exact path="/beyond/subclass" component={SubclassIndex} />
          <Route exact path="/beyond/subclass/details/:id" component={SubclassDetails} />
          <Route exact path="/beyond/subclass/create" component={SubclassEdit} />
          <Route exact path="/beyond/subclass/edit/:id" component={SubclassEdit} />

          <Route exact path="/beyond/equipment_pack" component={EquipmentPackIndex} />
          <Route exact path="/beyond/equipment_pack/details/:id" component={EquipmentPackDetails} />
          <Route exact path="/beyond/equipment_pack/create" component={EquipmentPackEdit} />
          <Route exact path="/beyond/equipment_pack/edit/:id" component={EquipmentPackEdit} />

          <Route exact path="/beyond/magic_item" component={MagicItemIndex} />
          <Route exact path="/beyond/magic_item/details/:id" component={MagicItemDetails} />
          <Route exact path="/beyond/magic_item/create" component={MagicItemEdit} />
          <Route exact path="/beyond/magic_item/edit/:id" component={MagicItemEdit} />

          <Route exact path="/beyond/magic_item_keyword" component={MagicItemKeywordIndex} />
          <Route exact path="/beyond/magic_item_keyword/details/:id" component={MagicItemKeywordDetails} />
          <Route exact path="/beyond/magic_item_keyword/create" component={MagicItemKeywordEdit} />
          <Route exact path="/beyond/magic_item_keyword/edit/:id" component={MagicItemKeywordEdit} />

          <Route exact path="/beyond/race" component={RaceIndex} />
          <Route exact path="/beyond/race/details/:id" component={RaceDetails} />
          <Route exact path="/beyond/race/create" component={RaceEdit} />
          <Route exact path="/beyond/race/edit/:id" component={RaceEdit} />

          <Route exact path="/beyond/subrace/details/:id" component={SubraceDetails} />
          <Route exact path="/beyond/subrace/create" component={SubraceEdit} />
          <Route exact path="/beyond/subrace/edit/:id" component={SubraceEdit} />

          <Route exact path="/beyond/user" component={UserIndex} />
          <Route exact path="/beyond/user/details/:id" component={UserDetails} />
          <Route exact path="/beyond/user/create" component={UserEdit} />
          <Route exact path="/beyond/user/edit/:id" component={UserEdit} />

          <Route exact path="/beyond/weapon_keyword" component={WeaponKeywordIndex} />
          <Route exact path="/beyond/weapon_keyword/details/:id" component={WeaponKeywordDetails} />
          <Route exact path="/beyond/weapon_keyword/create" component={WeaponKeywordEdit} />
          <Route exact path="/beyond/weapon_keyword/edit/:id" component={WeaponKeywordEdit} />

          <Route exact path="/beyond/spell_list" component={SpellListIndex} />
          <Route exact path="/beyond/spell_list/details/:id" component={SpellListDetails} />
          <Route exact path="/beyond/spell_list/create" component={SpellListEdit} />
          <Route exact path="/beyond/spell_list/edit/:id" component={SpellListEdit} />

          <Route exact path="/beyond/special_feature" component={SpecialFeatureIndex} />
          <Route exact path="/beyond/special_feature/details/:id" component={SpecialFeatureDetails} />
          <Route exact path="/beyond/special_feature/create" component={SpecialFeatureEdit} />
          <Route exact path="/beyond/special_feature/edit/:id" component={SpecialFeatureEdit} />

          <Route exact path="/beyond/tool" component={ToolIndex} />
          <Route exact path="/beyond/tool/details/:id" component={ToolDetails} />
          <Route exact path="/beyond/tool/create" component={ToolEdit} />
          <Route exact path="/beyond/tool/edit/:id" component={ToolEdit} />

          <Route exact path="/beyond/source_book" component={SourceBookIndex} />
          <Route exact path="/beyond/source_book/details/:id" component={SourceBookDetails} />
          <Route exact path="/beyond/source_book/create" component={SourceBookEdit} />
          <Route exact path="/beyond/source_book/edit/:id" component={SourceBookEdit} />

          <Route exact path="/beyond/dm" component={DMPage} />
        </Switch>
      );
    }
  }
}

export default connector(MainPage);
