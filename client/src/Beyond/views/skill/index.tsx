import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from "react-router-dom";
import {
  Add, 
} from "@material-ui/icons";
import {
  Grid, 
  Tooltip, 
  Fab,
} from "@material-ui/core";
import { 
  ABILITY_SCORES 
} from "../../models/Constants";

import StringBox from "../../components/input/StringBox";
import SelectStringBox from "../../components/input/SelectStringBox";

import ObjectIndex from "../../components/Navigation/ObjectIndex";
import LetterLinks from "../../components/Navigation/LetterLinks";


interface AppState {
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { }

export interface State { 
  redirectTo: string | null;
  search_string: string;
  start_letter: string;
  ability_score: string;
}

class SkillIndex extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      search_string: "",
      start_letter: "",
      ability_score: "ALL",
    };
  }

  get_filter() {
    const filter: any = {};
    
    if (this.state.ability_score !== "ALL") {
      filter.use_ability_score = this.state.ability_score;
    }
    if (this.state.start_letter !== "") {
      filter.start_letter = this.state.start_letter;
    }
    if (this.state.search_string !== "") {
      filter.search_string = this.state.search_string;
    }

    return filter;
  }

  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Skills
              </span>
              <Tooltip title={`Create New Skill`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/skill/create` });
                  }}>
                  <Add/>
                </Fab>
              </Tooltip> 
            </Grid>
            <Grid item xs={6}>
              <StringBox
                name="Search"
                value={`${this.state.search_string}`}
                onBlur={(search_string: string) => {
                  this.setState({ search_string });
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <SelectStringBox
                name="Ability Score"
                options={["ALL",...ABILITY_SCORES]}
                value={`${this.state.ability_score}`}
                onChange={(ability_score: string) => {
                  this.setState({ ability_score });
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <ObjectIndex 
              filter={this.get_filter()}
              data_type="skill"
            />
          </Grid>
          <Grid item>
            <LetterLinks 
              onChange={(start_letter: string) => {
                this.setState({ start_letter });
              }} 
            />
          </Grid>
        </Grid>
      ); 
    } 
  }
}

export default connector(SkillIndex);
