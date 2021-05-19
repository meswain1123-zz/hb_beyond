import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  ArrowBack,
} from "@material-ui/icons";
import {
  Grid, 
  Tooltip, 
  Fab,
} from "@material-ui/core";
import { 
  ArmorType,
  Creature,
  Condition,
  EldritchInvocation,
  Skill,
  WeaponKeyword,
  Spell,
  SpellSlotType,
} from "../../models";

import CreatureStatBlock from "../../components/model_inputs/creature/CreatureStatBlock";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";
import imageAPI from "../../utilities/image_api";
import { APIClass as ImageAPIClass } from "../../utilities/image_api_class";


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
  obj: Creature;
  armor_types: ArmorType[] | null;
  conditions: Condition[] | null;
  weapon_keywords: WeaponKeyword[] | null;
  skills: Skill[] | null;
  spells: Spell[] | null;
  spell_slot_types: SpellSlotType[] | null;
  eldritch_invocations: EldritchInvocation[] | null;
  loading: boolean;
  reloading: boolean;
}


class CreatureDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Creature(),
      armor_types: null,
      conditions: null,
      weapon_keywords: null,
      skills: null,
      spells: null,
      spell_slot_types: null,
      eldritch_invocations: null,
      loading: false,
      reloading: false,
    };
    this.api = API.getInstance();
    this.image_api = imageAPI.getInstance();
  }

  api: APIClass;
  image_api: ImageAPIClass;

  componentDidMount() {
  }

  // Loads the editing Character into state
  load_object(id: string) {
    this.api.getFullObject("creature", id).then((res: any) => {
      if (res) {
        const obj = res;
        this.setState({ obj });
      }
    });
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["armor_type","condition","spell","skill","spell_slot_type","eldritch_invocation","weapon_keyword"]).then((res: any) => {
        const armor_types: ArmorType[] = res.armor_type;
        const spells: Spell[] = res.spell;
        this.setState({ 
          armor_types,
          conditions: res.condition,
          spells,
          skills: res.skill,
          spell_slot_types: res.spell_slot_type,
          eldritch_invocations: res.eldritch_invocation,
          weapon_keywords: res.weapon_keyword,
          loading: false 
        });
      });
    });
  }

  updateCharacter(obj: Creature) {
    this.api.updateObject("creature", obj).then((res: any) => {
      this.setState({ obj });
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
        return (
          <Grid container spacing={1} direction="column" style={{ lineHeight: "1.5" }}>
            <Grid item container spacing={1} direction="row">
              <Grid item xs={3}>
                <Tooltip title={`Back to Creatures`}>
                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                    onClick={ () => {
                      this.setState({ redirectTo:`/beyond/creature` });
                    }}>
                    <ArrowBack/>
                  </Fab>
                </Tooltip> 
              </Grid>
            </Grid>
            <Grid item>
              <CreatureStatBlock 
                obj={this.state.obj} 
                onChange={() => {

                }} 
              />
            </Grid>
          </Grid>
        ); 
      }
    }
  }
}

export default connector(CreatureDetails);
