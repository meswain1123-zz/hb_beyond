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

import { FeatureBase } from "../../../models";

// import StringBox from "../input/StringBox";
// import SelectBox from "../input/SelectBox";
// import SelectStringBox from "../input/SelectStringBox";
// import FeatureBaseInput from "./FeatureBase";


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
  feature_bases: FeatureBase[];
  // onNameChange: (name: string) => void; 
  // onDescriptionChange: (description: string) => void; 
  onChange: (feature_bases: FeatureBase[]) => void; 
  onExpand: (feature_base: FeatureBase) => void;
  onAdd: () => void;
}

export interface State { 
}

class FeatureBasesModal extends Component<Props, State> {
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
            Feature Bases
          </span>
          <Tooltip title={`Create New Feature Base`}>
            <Fab size="small" color="primary" style={{marginLeft: "8px"}}
              onClick={ () => {
                this.props.onAdd();
              }}>
              <Add/>
            </Fab>
          </Tooltip>
        </Grid>
        { this.props.feature_bases.map((feature_base, key) => {
          return (
            <Grid item key={key} container spacing={1} direction="row" 
              onClick={() => {
                this.props.onExpand(feature_base);
              }}>
              <Grid item xs={2}>
                { feature_base.name === "" ? "Nameless Feature Base" : feature_base.name }
              </Grid>
              <Grid item xs={10}>
                <div style={this.descriptionStyle()}>
                  {feature_base.description}
                </div>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default connector(FeatureBasesModal);
