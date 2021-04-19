import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Clear
} from "@material-ui/icons";
import {
  Grid, 
} from "@material-ui/core";

import { 
  Ability,
  Character,
  CharacterAbility
} from "../../../models";

import CheckBox from "../../input/CheckBox";
import ButtonBox from "../../input/ButtonBox";

import DisplayObjects from "../display/DisplayObjects";
import ViewSpell from "../ViewSpell";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";
import CharacterUtilities from "../../../utilities/character_utilities";
import { CharacterUtilitiesClass } from "../../../utilities/character_utilities_class";


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
  ability: CharacterAbility;
  onChange: () => void;
  onClose: () => void;
}

export interface State {
  search_string: string;
  view: string;
}

class CharacterAbilityDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      search_string: "",
      view: "",
    };
    this.api = API.getInstance();
    this.char_util = CharacterUtilities.getInstance();
  }

  api: APIClass;
  char_util: CharacterUtilitiesClass;

  componentDidMount() {
  }

  render() {
    const return_me: any[] = [];
    const the_ability = this.props.ability.the_ability;
    const self_condition_ids = this.props.ability.self_condition();
    if (the_ability instanceof Ability) {
      return_me.push(
        <Grid item key="source" style={{ 
          lineHeight: "1.1",
          fontSize: "10px",
          color: "gray"
        }}>
          { this.props.ability.source_name }
        </Grid>
      );
      return_me.push(
        <Grid item key="name" style={{ 
          lineHeight: "1.1",
          fontSize: "15px",
          fontWeight: "bold"
        }}>
          { this.props.ability.name }
        </Grid>
      );
      if (the_ability.resource_consumed && the_ability.resource_consumed !== "None") {
        return_me.push(
          <Grid item key="resource" style={{ 
            lineHeight: "1.1",
            fontSize: "11px",
            fontWeight: "bold",
            borderTop: "1px solid lightgrey"
          }}>
            <span style={{ verticalAlign: "middle" }}>
              { 
                the_ability.resource_consumed === "Special" ? 
                "Limited Use " : 
                <DisplayObjects type="resource" ids={[the_ability.resource_consumed]} />
              }
            </span>
            <span style={{ verticalAlign: "middle" }}>
              { this.renderResourceCheckboxes() }
            </span>
          </Grid>
        );
        if (the_ability.concentration && this.props.obj.concentrating_on) {
          return_me.push(
            <Grid item key="warning" style={{ 
              lineHeight: "1.1",
              fontSize: "11px",
              fontWeight: "bold",
              borderTop: "1px solid lightgrey"
            }}>
              Already Concentrating On
              { this.props.obj.concentrating_on &&
                <Grid container spacing={0} direction="row">
                  <Grid item xs={9}>
                    <ViewSpell spell={this.props.obj.concentrating_on} show_ritual />
                  </Grid>
                  <Grid item xs={3}>
                    <Clear style={{ cursor: "pointer" }} 
                      onClick={() => {
                        this.props.obj.concentrating_on = null;
                        this.props.onChange();
                      }} 
                    />
                  </Grid>
                </Grid> 
              }
            </Grid>
          );
        }
        return_me.push(
          <Grid item key="cast" style={{ 
            lineHeight: "1.1",
            fontSize: "11px",
            fontWeight: "bold",
            borderTop: "1px solid lightgrey"
          }}>
            <ButtonBox name="Use"
              disabled={this.props.ability.disabled(this.props.obj)}
              onClick={() => {
                if (the_ability.concentration) {
                  // Set the concentration
                  this.props.obj.concentrating_on = this.props.ability;
                }
                // Increment the resource
                if (the_ability.resource_consumed === "Special") {
                  this.props.ability.special_resource_used++;
                } else {
                  const resource_finder = this.props.obj.resources.filter(o => 
                    o.type_id === the_ability.resource_consumed);
                  if (resource_finder.length === 1) {
                    const resource = resource_finder[0];
                    resource.used++;
                  }
                }
                if (self_condition_ids.length > 0) {
                  // Apply the conditions
                  const obj = this.props.obj;
                  self_condition_ids.forEach(cond_id => {
                    obj.conditions.push(cond_id);
                  });
                  if (obj instanceof Character) {
                    this.char_util.recalcAll(obj);
                  }
                }
                this.props.onChange();
                this.setState({ });
              }} 
            />
          </Grid>
        );
      } else if (the_ability.concentration) {
        if (this.props.obj.concentrating_on) {
          return_me.push(
            <Grid item key="warning" style={{ 
              lineHeight: "1.1",
              fontSize: "11px",
              fontWeight: "bold",
              borderTop: "1px solid lightgrey"
            }}>
              Already Concentrating On
            </Grid>
          );
        }
        return_me.push(
          <Grid item key="cast" style={{ 
            lineHeight: "1.1",
            fontSize: "11px",
            fontWeight: "bold",
            borderTop: "1px solid lightgrey"
          }}>
            <ButtonBox name="Use" 
              onClick={() => {
                // Set the concentration
                this.props.obj.concentrating_on = this.props.ability;
                if (self_condition_ids.length > 0) {
                  // Apply the conditions
                  const obj = this.props.obj;
                  self_condition_ids.forEach(cond_id => {
                    obj.conditions.push(cond_id);
                  });
                  if (obj instanceof Character) {
                    this.char_util.recalcAll(obj);
                  }
                }
                this.props.onChange();
                this.setState({ });
              }} 
            />
          </Grid>
        );
      }
      return_me.push(
        <Grid item key="description">
          { the_ability.description }
        </Grid>
      );
    }
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
          fontSize: "11px"
        }}>
        <Grid container spacing={0} direction="column">
          { return_me }
        </Grid>
      </div>
    );
  }

  renderResourceCheckboxes() {
    const return_me: any[] = [];
    const the_ability = this.props.ability.the_ability;
    if (the_ability instanceof Ability && the_ability.resource_consumed) {
      const obj = this.props.obj;
      if (the_ability.resource_consumed === "Special") {
        for (let i = 0; i < +the_ability.special_resource_amount; ++i) {
          return_me.push(
            <CheckBox key={i} name="" 
              value={this.props.ability.special_resource_used > i} 
              onChange={() => {
                if (this.props.ability.special_resource_used > i) {
                  this.props.ability.special_resource_used--;
                } else {
                  this.props.ability.special_resource_used++;
                }
                this.props.onChange();
                this.setState({ });
              }}
            />
          );
        }
      } else {
        const resource_finder = obj.resources.filter(o => 
          o.type_id === the_ability.resource_consumed);
        if (resource_finder.length === 1) {
          const resource = resource_finder[0];
          for (let i = 0; i < resource.total; ++i) {
            return_me.push(
              <CheckBox key={i} name="" 
                value={resource.used > i} 
                onChange={() => {
                  if (resource.used > i) {
                    resource.used--;
                  } else {
                    resource.used++;
                  }
                  this.props.onChange();
                  this.setState({ });
                }}
              />
            );
          }
        }
      }
    }
    return return_me;
  }
}

export default connector(CharacterAbilityDetails);
