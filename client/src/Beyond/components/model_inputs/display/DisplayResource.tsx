import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, 
} from "@material-ui/core";

import { 
  Character,
  // Creature,
  CharacterResource,
  ResourceFeature,
  Resource
} from "../../../models";

import CheckBox from "../../input/CheckBox";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";

interface AppState {
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  obj: Character;
  resource_feature: ResourceFeature;
  onChange: () => void;
}

export interface State { 
  loading: boolean;
  // reloading: boolean;
  resources: Resource[] | null;
}

class DisplayResource extends Component<Props, State> {
  // public static defaultProps = {
  //   choice_name: null
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      // reloading: false,
      resources: null
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["resource"]).then((res: any) => {
        if (res) {
          this.setState({ 
            resources: res.resource,
            loading: false 
          });
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
    } else {
      const resource_feature = this.props.resource_feature;
      const resource_finder = this.state.resources.filter(o => o._id === resource_feature.type_id);
      let r: Resource | null = null;
      if (resource_finder.length === 1) {
        r = resource_finder[0];
      }
      if (r) {
        const char_resource_finder = this.props.obj.resources.filter(o => r && o.type_id === r._id);
        if (char_resource_finder.length === 1) {
          return (
            <Grid container spacing={0} direction="column">
              <Grid item>
                <b>{ r.name }:</b>&nbsp;{ this.renderSlots(char_resource_finder[0]) }
              </Grid>
            </Grid>
          );
        }
      }
      return null;
    }
  }

  renderSlots(resource: CharacterResource) {
    const return_me: any[] = [];
    let used = 0;
    for (let i = 0; i < resource.total; ++i) {
      let isUsed = false;
      if (used < resource.used) {
        isUsed = true;
        used++;
      }
      return_me.push(
        <CheckBox key={i}
          name=""
          value={isUsed}
          onChange={(changed: boolean) => {
            if (changed) {
              resource.used++;
            } else {
              resource.used--;
            }
            // const obj = this.props.obj;
            // this.props.onChange(obj);
            this.setState({ }, () => {
              this.api.updateObject(this.props.obj).then((res: any) => {
                if ((changed && resource.used === resource.total) || (!changed && resource.used === resource.total - 1)) {
                  // Reload to make the cast buttons enabled/disabled appropriately
                  // this.setState({ reloading: true }, () => {
                  //   this.setState({ reloading: false });
                  // });
                }
              });
            });
          }}
        />
      );
    }
    return return_me;
  }
}

export default connector(DisplayResource);
