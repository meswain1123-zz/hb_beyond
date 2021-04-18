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
  Resource, ResourceFeature
} from "../../../models";
// import { 
//   // DAMAGE_TYPES, 
//   // DURATIONS,
//   // COMPONENTS,
//   // CASTING_TIMES,
//   // RESOURCES,
//   ABILITY_SCORES 
// } from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectBox from "../../input/SelectBox";
// import SelectStringBox from "../../input/SelectStringBox";

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
  obj: ResourceFeature;
  onChange: (changed: ResourceFeature) => void; 
}

export interface State { 
  // obj: ResourceFeature;
  resources: Resource[] | null;
  loading: boolean;
  type: Resource | null;
}

class ResourceFeatureInput extends Component<Props, State> {
  // public static defaultProps = {
  //   choice_name: null
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      // obj: new ResourceFeature(),
      resources: null,
      loading: false,
      type: null
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("resource").then((res: any) => {
        if (res && !res.error) {
          this.setState({ resources: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.resources === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.props.obj.type_id && (this.state.type === null || this.state.type._id !== this.props.obj.type_id)) {
      const objFinder = this.state.resources ? this.state.resources.filter(o => o._id === this.props.obj.type_id) : [];
      if (objFinder.length === 1) {
        this.setState({
          type: objFinder[0]
        });
      }
      return <span>Loading</span>;
    } else if (!this.props.obj.type_id && this.state.type !== null) {
      this.setState({
        type: null
      });
      return <span>Loading</span>;
    } else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <SelectBox 
              name="Resource Type" 
              options={this.state.resources}
              value={this.props.obj.type_id} 
              onChange={(id: string) => {
                if (this.state.resources) {
                  const objFinder = this.state.resources.filter(o => o._id === id);
                  if (objFinder.length === 1) {
                    const obj = this.props.obj;
                    obj.type_id = id;
                    this.props.onChange(obj);
                    // this.setState({ type: objFinder[0] });
                  }
                }
              }} 
            />
          </Grid>
          {/* <Grid item>
            { this.state.type && this.state.type.name === "Spell Slot" ?
              <SelectStringBox 
                name="Level" 
                options={["1","2","3","4","5","6","7","8","9"]}
                value={`${this.props.obj.level}`} 
                onChange={(value: string) => {
                  const obj = this.props.obj;
                  obj.level = +value;
                  this.props.onChange(obj);
                  // this.setState({ obj });
                }} 
              />
            : this.state.type && this.state.type.name === "Pact Slot" &&
              <SelectStringBox 
                name="Level" 
                options={["1","2","3","4","5"]}
                value={`${this.props.obj.level}`} 
                onChange={(value: string) => {
                  const obj = this.props.obj;
                  obj.level = +value;
                  this.props.onChange(obj);
                  // this.setState({ obj });
                }} 
              />
            }
          </Grid> */}
          <Grid item>
            <StringBox 
              name="Total" 
              value={`${this.props.obj.total}`} 
              onBlur={(value: string) => {
                const obj = this.props.obj;
                obj.total = +value;
                this.props.onChange(obj);
                // this.setState({ obj });
              }} 
            />
          </Grid>
        </Grid>
      );
    }
  }
}

export default connector(ResourceFeatureInput);
