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

import StringBox from "../../components/input/StringBox";

import SelectSpecialFeatureTypeBox from "../../components/model_inputs/select/SelectSpecialFeatureTypeBox";
import SelectObjectBox from "../../components/input/SelectObjectBox";

import ObjectIndex from "../../components/Navigation/ObjectIndex";
import LetterLinks from "../../components/Navigation/LetterLinks";


interface AppState {
  source_book: string;
  special_feature_type: string;
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  source_book: state.app.source_book,
  special_feature_type: state.app.special_feature_type,
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
  setSpecialFeatureType: (type: string) => ({ type: 'SET', dataType: 'special_feature_type', payload: type }),
  setSourceBook: (sb: string) => ({ type: 'SET', dataType: 'source_book', payload: sb })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { }

export interface State { 
  redirectTo: string | null;
  search_string: string;
  start_letter: string;
  type: string;
}

class SpecialFeatureIndex extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      search_string: "",
      start_letter: "",
      type: "Any"
    };
  }

  get_filter() {
    const filter: any = {};
    
    if (this.props.special_feature_type !== "Any") {
      filter.type = this.props.special_feature_type;
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
            <Grid item xs={2}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Special Features
              </span>
              <Tooltip title={`Create New Special Feature`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.setState({ redirectTo:`/beyond/special_feature/create` });
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
            <Grid item xs={2}>
              <SelectSpecialFeatureTypeBox 
                name="Special Feature Type" 
                value={this.props.special_feature_type} 
                allowAny
                onChange={(value: string) => {
                  this.props.setSpecialFeatureType(value);
                  this.setState({ type: value });
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
              data_type="special_feature"
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

export default connector(SpecialFeatureIndex);
