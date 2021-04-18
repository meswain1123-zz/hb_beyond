import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
import {
  Grid, 
  // Fab, Tooltip, Button
} from "@material-ui/core";
// import {
//   DeleteForever
// } from "@material-ui/icons";

import { 
  SenseFeature, 
  Sense
} from "../../../models";
// import { 
//   ABILITY_SCORES, 
//   PERCENTAGE_LEVEL_MAP 
// } from "../../../models/Constants";

import StringBox from "../../input/StringBox";
// import SelectBox from "../../input/SelectBox";
import SelectObjectBox from "../../input/SelectObjectBox";
// import CheckBox from "../../input/CheckBox";

// import SelectSpellListBox from "../select/SelectSpellListBox";
// import SelectSpellSlotTypeBox from "../select/SelectSpellSlotTypeBox";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
  // resources: Resource[] | null;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  // resources: state.app.resources
})

const mapDispatch = {
  // setAbilities: (objects: Ability[]) => ({ type: 'SET', dataType: 'abilities', payload: objects })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  obj: SenseFeature;
  onChange: (changed: SenseFeature) => void; 
}

export interface State { 
  // obj: ResourceFeature;
  senses: Sense[] | null;
  loading: boolean;
}

class SenseFeatureInput extends Component<Props, State> {
  // public static defaultProps = {
  //   choice_name: null
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      senses: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("sense").then((res: any) => {
        if (res && !res.error) {
          const senses: Sense[] = res;
          this.setState({ senses, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.senses === null) {
      this.load();
      return <span>Loading</span>;
    } 
    else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <SelectObjectBox
              name="Sense"
              type="sense"
              value={this.props.obj.sense_id}
              onChange={(id: string) => {
                this.props.obj.sense_id = id;
                this.props.onChange(this.props.obj);
              }}
            />
          </Grid>
          <Grid item>
            <StringBox
              name="Range"
              value={`${this.props.obj.range}`}
              type="number"
              onBlur={(changed: string) => {
                this.props.obj.range = +changed;
                this.props.onChange(this.props.obj);
              }}
            />
          </Grid>
        </Grid>
      );
    }
  }
}

export default connector(SenseFeatureInput);
