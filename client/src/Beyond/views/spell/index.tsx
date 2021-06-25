import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from "react-router-dom";
import {
  Add, 
} from "@material-ui/icons";
import {
  Grid, 
  Tooltip, 
  Fab
} from "@material-ui/core";

import { 
  SCHOOLS 
} from "../../models/Constants";

import StringBox from "../../components/input/StringBox";
import SelectStringBox from "../../components/input/SelectStringBox";
import SelectObjectBox from "../../components/input/SelectObjectBox";

import ObjectIndex from "../../components/Navigation/ObjectIndex";
import LetterLinks from "../../components/Navigation/LetterLinks";


interface AppState {
  source_book: string;
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  source_book: state.app.source_book,
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
  setSourceBook: (sb: string) => ({ type: 'SET', dataType: 'source_book', payload: sb })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { }

export interface State { 
  redirectTo: string | null;
  search_string: string;
  level: string;
  school: string;
  start_letter: string;
}

class SpellIndex extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      search_string: "",
      level: "ALL",
      school: "ALL",
      start_letter: "",
    };
  }

  get_filter() {
    const filter: any = {};
    
    if (this.state.level !== "ALL") {
      filter.level = +this.state.level;
    }
    if (this.state.school !== "ALL") {
      filter.school = this.state.school;
    }
    if (this.state.start_letter !== "") {
      filter.start_letter = this.state.start_letter;
    }
    if (this.state.search_string !== "") {
      filter.search_string = this.state.search_string;
    }
    if (this.props.source_book !== "Any") {
      filter.source_id = this.props.source_book;
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
                Spells
              </span>
              <Tooltip title={`Create New Spell`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/spell/create` });
                  }}>
                  <Add/>
                </Fab>
              </Tooltip> 
            </Grid>
            <Grid item xs={3}>
              <StringBox
                name="Search"
                value={`${this.state.search_string}`}
                onBlur={(search_string: string) => {
                  this.setState({ search_string });
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <SelectStringBox
                name="Level"
                options={["ALL","0","1","2","3","4","5","6","7","8","9"]}
                value={this.state.level}
                onChange={(level: string) => {
                  this.setState({ level });
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <SelectStringBox
                name="School"
                options={["ALL",...SCHOOLS]}
                value={this.state.school}
                onChange={(school: string) => {
                  this.setState({ school });
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <SelectObjectBox
                name="Source Book"
                value={this.props.source_book} 
                data_type="source_book"
                extra_options={["Any","Basic Rules"]}
                onChange={(value: string) => {
                  this.props.setSourceBook(value);
                  this.setState({ });
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <ObjectIndex 
              filter={this.get_filter()}
              data_type="spell"
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

export default connector(SpellIndex);
