import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Psychic, 
  Force,
  Poison,
  Acid,
  Radiant,
  Cold,
  Fire,
  Lightning,
  Thunder,
  Healing,
  Necrotic,
  Bludgeoning,
  Piercing,
  Slashing
} from "../models/Images";

import {
  Grid
} from "@material-ui/core";

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
}

export interface State {
}

class Attributions extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <Grid container spacing={1} direction="row">
        <Grid item xs={6}>
          <img src={Psychic} alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </Grid>
        <Grid item xs={6}>
          Brain by Minh Do from the Noun Project
        </Grid>
        <Grid item xs={6}>
          <img src={Force} alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </Grid>
        <Grid item xs={6}>
         meteor by Colourcreatype from the Noun Project
        </Grid>
        <Grid item xs={6}>
          <img src={Poison} alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </Grid>
        <Grid item xs={6}>
          Poison by Diego Naive from the Noun Project
        </Grid>
        <Grid item xs={6}>
          <img src={Acid} alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </Grid>
        <Grid item xs={6}>
          Poison by Luis Prado from the Noun Project
        </Grid>
        <Grid item xs={6}>
          <img src={Radiant} alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </Grid>
        <Grid item xs={6}>
          sun by Alice Design from the Noun Project
        </Grid>
        <Grid item xs={6}>
          <img src={Cold} alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </Grid>
        <Grid item xs={6}>
          Cold by Landan Lloyd from the Noun Project
        </Grid>
        <Grid item xs={6}>
          <img src={Fire} alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </Grid>
        <Grid item xs={6}>
          Fire by Aisyah from the Noun Project
        </Grid>
        <Grid item xs={6}>
          <img src={Lightning} alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </Grid>
        <Grid item xs={6}>
          Lightning by Locad from the Noun Project
        </Grid>
        <Grid item xs={6}>
          <img src={Thunder} alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </Grid>
        <Grid item xs={6}>
          thunder by LUTFI GANI AL ACHMAD from the Noun Project
        </Grid>
        <Grid item xs={6}>
          <img src={Healing} alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </Grid>
        <Grid item xs={6}>
          Heart by Bluetip Design from the Noun Project
        </Grid>
        <Grid item xs={6}>
          <img src={Necrotic} alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </Grid>
        <Grid item xs={6}>
          grim reaper by Baboon designs from the Noun Project
        </Grid>
        <Grid item xs={6}>
          <img src={Bludgeoning} alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </Grid>
        <Grid item xs={6}>
          hit by Guilherme Furtado from the Noun Project
        </Grid>
        <Grid item xs={6}>
          <img src={Piercing} alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </Grid>
        <Grid item xs={6}>
          hit by P Thanga Vignesh from the Noun Project
        </Grid>
        <Grid item xs={6}>
          <img src={Slashing} alt="logo" 
            style={{
              width: "5em",
              height: "5em",
              border: "1px solid blue"
            }} 
          />
        </Grid>
        <Grid item xs={6}>
          By Carter Precourt 
        </Grid>
      </Grid>
    );
  }
}

export default connector(Attributions);
