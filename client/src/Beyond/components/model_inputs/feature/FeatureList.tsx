import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid,
  Tooltip,
  Fab
} from "@material-ui/core";
import {
  Add
} from "@material-ui/icons";

import { Feature } from "../../../models";


interface AppState {
  
  width: number
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
  label: string;
  plural: string;
  parent_type: string;
  parent_id: string;
  features: Feature[];
  onChange: (features: Feature[]) => void; 
  onExpand: (feature: Feature) => void;
  onAdd: () => void;
}

export interface State { 
}

class FeaturesModal extends Component<Props, State> {
  public static defaultProps = {
    plural: ""
  };
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
            { this.props.plural === "" ? `${this.props.label}s` : this.props.plural }
          </span>
          <Tooltip title={`Create New ${this.props.label}`}>
            <Fab size="small" color="primary" style={{marginLeft: "8px"}}
              onClick={ () => {
                this.props.onAdd();
              }}>
              <Add/>
            </Fab>
          </Tooltip>
        </Grid>
        { this.props.features.map((feature, key) => {
          return (
            <Grid item key={key} container spacing={1} direction="row" 
              onClick={() => {
                this.props.onExpand(feature);
              }}>
              <Grid item xs={2}>
                { feature.name === "" ? `Nameless ${this.props.label}` : feature.name }
              </Grid>
              <Grid item xs={10}>
                <div style={this.descriptionStyle()}>
                  {feature.description}
                </div>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default connector(FeaturesModal);
