import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
} from "@material-ui/core";

import { 
  Character,
} from "../../../models";

import StringBox from '../../input/StringBox';
import ToggleButtonBox from '../../input/ToggleButtonBox';

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


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
  onChange: () => void;
}

export interface State {
  loading: boolean;
  reloading: boolean;
  drawer: string;
  view: string;
}

class CharacterNotes extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      reloading: false,
      drawer: "",
      view: "ALL"
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  render() {
    return (
      <Grid item container spacing={0} direction="column" 
        style={{
          border: "1px solid blue",
          borderRadius: "5px",
          fontSize: "11px"
        }}>
        <Grid item
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: "bold"
          }}>
          <div onClick={() => {
            this.setState({ drawer: "manage" });
          }}>
            Notes
          </div>
        </Grid>
        <Grid item>
          <div
            style={{
              display: "flex",
              justifyContent: "center"
            }}>
            <Grid container spacing={0} direction="row" style={{ width: "300px" }}>
              <Grid item xs={1}>
                <ToggleButtonBox 
                  name="ALL"
                  height={15}
                  lineHeight={1.5}
                  border=""
                  color="gray"
                  bold
                  value={this.state.view === "ALL"}
                  onToggle={() => {
                    this.setState({ view: "ALL" });
                  }}
                />
              </Grid>
              <Grid item xs={1}>
                <ToggleButtonBox 
                  name="Orgs"
                  height={15}
                  lineHeight={1.5}
                  border=""
                  color="gray"
                  bold
                  value={this.state.view === "Orgs"}
                  onToggle={() => {
                    this.setState({ view: "Orgs" });
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <ToggleButtonBox 
                  name="Allies"
                  height={15}
                  lineHeight={1.5}
                  border=""
                  color="gray"
                  bold
                  value={this.state.view === "Allies"}
                  onToggle={() => {
                    this.setState({ view: "Allies" });
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <ToggleButtonBox 
                  name="Enemies"
                  height={15}
                  lineHeight={1.5}
                  border=""
                  color="gray"
                  bold
                  value={this.state.view === "Enemies"}
                  onToggle={() => {
                    this.setState({ view: "Enemies" });
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <ToggleButtonBox 
                  name="Backstory"
                  height={15}
                  lineHeight={1.5}
                  border=""
                  color="gray"
                  bold
                  value={this.state.view === "Backstory"}
                  onToggle={() => {
                    this.setState({ view: "Backstory" });
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <ToggleButtonBox 
                  name="Other"
                  height={15}
                  lineHeight={1.5}
                  border=""
                  color="gray"
                  bold
                  value={this.state.view === "Other"}
                  onToggle={() => {
                    this.setState({ view: "Other" });
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </Grid>
        { (this.state.view === "ALL" || this.state.view === "Orgs") && 
          <Grid item>
            <StringBox 
              name="Organizations" 
              value={this.props.obj.organizations}
              onBlur={(changed: string) => {
                this.props.obj.organizations = changed;
                this.props.onChange();
              }}
            />
          </Grid>
        }
        { (this.state.view === "ALL" || this.state.view === "Allies") && 
          <Grid item>
            <StringBox 
              name="Allies" 
              value={this.props.obj.allies}
              onBlur={(changed: string) => {
                this.props.obj.allies = changed;
                this.props.onChange();
              }}
            />
          </Grid>
        }
        { (this.state.view === "ALL" || this.state.view === "Enemies") && 
          <Grid item>
            <StringBox 
              name="Enemies" 
              value={this.props.obj.enemies}
              onBlur={(changed: string) => {
                this.props.obj.enemies = changed;
                this.props.onChange();
              }}
            />
          </Grid>
        }
        { (this.state.view === "ALL" || this.state.view === "Backstory") && 
          <Grid item>
            <StringBox 
              name="Backstory" 
              value={this.props.obj.backstory}
              onBlur={(changed: string) => {
                this.props.obj.backstory = changed;
                this.props.onChange();
              }}
            />
          </Grid>
        }
        { (this.state.view === "ALL" || this.state.view === "Other") && 
          <Grid item>
            <StringBox 
              name="Other" 
              value={this.props.obj.other_notes}
              onBlur={(changed: string) => {
                this.props.obj.other_notes = changed;
                this.props.onChange();
              }}
            />
          </Grid>
        }
      </Grid>
    );
  }
}

export default connector(CharacterNotes);
