import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
import {
  Grid,
  Tooltip,
  Fab
} from "@material-ui/core";
import {
  Add
} from "@material-ui/icons";

import { FeatureChoice } from "../../../models";

// import StringBox from "../input/StringBox";
// import SelectBox from "../input/SelectBox";
// import SelectStringBox from "../input/SelectStringBox";
// import FeatureInput from "./Feature";


interface AppState {
  // abilities: Ability[] | null;
  width: number
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  // abilities: state.app.abilities
  width: state.app.width
})

const mapDispatch = {
  // setAbilities: (objects: Ability[]) => ({ type: 'SET', dataType: 'abilities', payload: objects })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  parent_type: string;
  parent_id: string;
  feature_choices: FeatureChoice[];
  // onNameChange: (name: string) => void; 
  // onDescriptionChange: (description: string) => void; 
  onChange: (feature_choices: FeatureChoice[]) => void; 
  onExpand: (feature_choice: FeatureChoice) => void;
  onAdd: () => void;
}

export interface State { 
}

class FeatureChoicesModal extends Component<Props, State> {
  // public static defaultProps = {
  //   labelWidth: null
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  descriptionStyle = () => {
    const descWidth = Math.floor(this.props.width * 0.8);
  
    const properties: React.CSSProperties = {
      width: `${descWidth}px`,
      whiteSpace: "nowrap", 
      overflow: "hidden", 
      textOverflow: "ellipsis"
    } as React.CSSProperties;

    return properties;
  }

  render() {
    return (
      <Grid container spacing={1} direction="column">
        <Grid item>
          <span className={"MuiTypography-root MuiListItemText-primary header"}>
            Feature Choices
          </span>
          <Tooltip title={`Create New Feature Choice`}>
            <Fab size="small" color="primary" style={{marginLeft: "8px"}}
              onClick={ () => {
                this.props.onAdd();
              }}>
              <Add/>
            </Fab>
          </Tooltip>
        </Grid>
        { this.props.feature_choices.map((feature_choice, key) => {
          return (
            <Grid item key={key} container spacing={1} direction="row" 
              onClick={() => {
                this.props.onExpand(feature_choice);
              }}>
              <Grid item xs={2}>
                { feature_choice.name === "" ? "Nameless Feature Choice" : feature_choice.name }
              </Grid>
              <Grid item xs={10}>
                <div style={this.descriptionStyle()}>
                  {feature_choice.description}
                </div>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default connector(FeatureChoicesModal);
