import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
  // Drawer,
} from "@material-ui/core";

import { 
  Character,
} from "../../../models";

import DisplayCharacterBackground from '../display/DisplayCharacterBackground';
import StringBox from '../../input/StringBox';
import SelectStringBox from '../../input/SelectStringBox';
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

class CharacterDescription extends Component<Props, State> {
  // public static defaultProps = {
  //   value: null,
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      reloading: false,
      drawer: "",
      view: "All"
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
            Description
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
                  name="All"
                  height={15}
                  lineHeight={1.5}
                  border=""
                  color="gray"
                  bold
                  value={this.state.view === "All"}
                  onToggle={() => {
                    this.setState({ view: "All" });
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <ToggleButtonBox 
                  name="Background"
                  height={15}
                  lineHeight={1.5}
                  border=""
                  color="gray"
                  bold
                  value={this.state.view === "Background"}
                  onToggle={() => {
                    this.setState({ view: "Background" });
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <ToggleButtonBox 
                  name="Characteristics"
                  height={15}
                  lineHeight={1.5}
                  border=""
                  color="gray"
                  bold
                  value={this.state.view === "Characteristics"}
                  onToggle={() => {
                    this.setState({ view: "Characteristics" });
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <ToggleButtonBox 
                  name="Appearance"
                  height={15}
                  lineHeight={1.5}
                  border=""
                  color="gray"
                  bold
                  value={this.state.view === "Appearance"}
                  onToggle={() => {
                    this.setState({ view: "Appearance" });
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </Grid>
        { (this.state.view === "All" || this.state.view === "Background") && 
          <Grid item container spacing={0} direction="column">
            <Grid item style={{ fontWeight: "bold", fontSize: "12px" }}>
              Background
            </Grid>
            <Grid item>
              <DisplayCharacterBackground obj={this.props.obj} />
            </Grid>
          </Grid>
        }
        { (this.state.view === "All" || this.state.view === "Characteristics") && 
          <Grid item container spacing={0} direction="column">
            <Grid item style={{ fontWeight: "bold", fontSize: "12px" }}>
              Characteristics
            </Grid>
            <Grid item>
              <SelectStringBox
                name="Alignment"
                options={["Lawful Good","Lawful Neutral","Lawful Evil","Neutral Good","Neutral","Neutral Evil","Chaotic Good","Chaotic Neutral","Chaotic Evil"]}
                value={this.props.obj.characteristics.alignment}
                onChange={(changed: string) => {
                  this.props.obj.characteristics.alignment = changed;
                  this.props.onChange();
                }}
              />
            </Grid>
            <Grid item>
              <StringBox
                name="Faith"
                value={this.props.obj.characteristics.faith}
                onBlur={(changed: string) => {
                  this.props.obj.characteristics.faith = changed;
                  this.props.onChange();
                }}
              />
            </Grid>
            <Grid item>
              <SelectStringBox
                name="Lifestyle"
                options={["Wretched","Squalid (1 SP)","Poor (2 SP)","Modest (1 GP)","Comfortable (2 GP)","Wealthy (4 GP)","Aristocratic (10 GP Min)"]}
                value={this.props.obj.characteristics.lifestyle}
                onChange={(changed: string) => {
                  this.props.obj.characteristics.lifestyle = changed;
                  this.props.onChange();
                }}
              />
            </Grid>
            <Grid item>
              <StringBox
                name="Hair"
                value={this.props.obj.characteristics.hair}
                onBlur={(changed: string) => {
                  this.props.obj.characteristics.hair = changed;
                  this.props.onChange();
                }}
              />
            </Grid>
            <Grid item>
              <StringBox
                name="Skin"
                value={this.props.obj.characteristics.skin}
                onBlur={(changed: string) => {
                  this.props.obj.characteristics.skin = changed;
                  this.props.onChange();
                }}
              />
            </Grid>
            <Grid item>
              <StringBox
                name="Eyes"
                value={this.props.obj.characteristics.eyes}
                onBlur={(changed: string) => {
                  this.props.obj.characteristics.eyes = changed;
                  this.props.onChange();
                }}
              />
            </Grid>
            <Grid item>
              <StringBox
                name="Height"
                value={this.props.obj.characteristics.height}
                onBlur={(changed: string) => {
                  this.props.obj.characteristics.height = changed;
                  this.props.onChange();
                }}
              />
            </Grid>
            <Grid item>
              <StringBox
                name="Weight (lbs)"
                value={this.props.obj.characteristics.weight}
                type="number"
                onBlur={(changed: string) => {
                  this.props.obj.characteristics.weight = changed;
                  this.props.onChange();
                }}
              />
            </Grid>
            <Grid item>
              <StringBox
                name="Age (Years)"
                value={this.props.obj.characteristics.age}
                type="number"
                onBlur={(changed: string) => {
                  this.props.obj.characteristics.age = changed;
                  this.props.onChange();
                }}
              />
            </Grid>
            <Grid item>
              <SelectStringBox
                name="Gender"
                options={["Male","Female","Other"]}
                value={this.props.obj.characteristics.gender}
                onChange={(changed: string) => {
                  this.props.obj.characteristics.gender = changed;
                  this.props.onChange();
                }}
              />
            </Grid>
          </Grid>
        }
        { (this.state.view === "All" || this.state.view === "Appearance") && 
          <Grid item>
            <StringBox 
              name="Appearance" 
              value={this.props.obj.appearance} 
              onBlur={(changed: string) => {
                this.props.obj.appearance = changed;
                this.props.onChange();
              }}
            />
          </Grid>
        }
      </Grid>
    );
  }
}

export default connector(CharacterDescription);
