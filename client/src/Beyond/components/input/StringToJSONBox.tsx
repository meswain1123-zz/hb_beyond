import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
import {
  Grid,
  Button
} from "@material-ui/core";
import { IStringHash } from '../../models';

import StringBox from "./StringBox";
import SelectStringBox from "./SelectStringBox";
import ParseHelperBox from "./ParseHelperBox";


interface AppState {
}

interface RootState {
}

const mapState = (state: RootState) => ({
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  onParse: (json: IStringHash[]) => void;
  onParseAll: (parse_me: string) => void;
}

export interface State { 
  parse_string: string;
  pieces: IStringHash[];
}

class StringToJSONBox extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      parse_string: "",
      pieces: []
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <Grid container spacing={0} direction="column">
        <Grid item>
          <StringBox
            name="String"
            value={this.state.parse_string}
            onBlur={(parse_string: string) => {
              const pieces = [{
                str: parse_string,
                type: "Unknown",
                true_id: uuidv4().toString()
              }];
              this.setState({ parse_string, pieces });
            }}
          />
        </Grid>
        { this.state.pieces.map((piece, key) => {
          return (
            <Grid item key={key} container spacing={1} direction="row">
              <Grid item xs={6}>
                <SelectStringBox 
                  name="Type"
                  value={piece.type}
                  options={[
                    "Unknown","Name",
                    "Description",
                    "Type","Subtype",
                    "Hit Dice","Max HP",
                    "Size","CR","Exp Points",
                    "Init Mod","AC","Alignment",
                    "Ability Scores",
                    "Speed","Sense",
                    "Damage Immunity","Damage Resistance","Damage Vulnerability",
                    "Condition Immunity",
                    "Tool","Skill",
                    "Saving Throws",
                    "Language",
                    "Action",
                    "Legendary Action",
                    "Lair Action",
                    "Special"
                  ]}
                  onChange={(changed: string) => {
                    piece.type = changed;
                    this.setState({ pieces: this.state.pieces });
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <ParseHelperBox 
                  value={piece.str}
                  onSplit={(new_pieces: IStringHash[]) => {
                    const pieces: IStringHash[] = [];
                    this.state.pieces.forEach(p => {
                      if (piece.true_id === p.true_id) {
                        new_pieces.forEach(p2 => {
                          pieces.push(p2);
                        });
                      } else {
                        pieces.push(p);
                      }
                    });
                    this.setState({ pieces });
                  }}
                />
              </Grid>
            </Grid>
          );
        }) }
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            disabled={ this.state.pieces.filter(o => o.type !== "Unknown").length === 0 }
            onClick={ () => { 
              const parsed = this.state.pieces.filter(o => o.type !== "Unknown");
              this.props.onParse(parsed);
            }}>
            Parse
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={ this.state.parse_string.length === 0 }
            onClick={ () => { 
              this.props.onParseAll(this.state.parse_string);
            }}>
            Parse All
          </Button>
        </Grid>
      </Grid>
    ); 
  }
}

export default connector(StringToJSONBox);
