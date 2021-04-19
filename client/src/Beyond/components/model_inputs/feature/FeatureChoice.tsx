import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, Fab, Tooltip, Button
} from "@material-ui/core";
import {
  DeleteForever
} from "@material-ui/icons";

import { 
  Feature, 
  FeatureChoice, 
  FeatureChoiceTemplate, 
  TemplateBase 
} from "../../../models";

import StringBox from "../../input/StringBox";
import FeatureListInput from "./FeatureList";
import FeatureInput from "./FeatureMain";
import TemplateBox from "../TemplateBox";


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
  parent_name: string;
  base_name: string;
  obj: FeatureChoice;
  onChange: (obj: FeatureChoice) => void; 
  onDelete: () => void; 
  onDone: (target: string) => void;
}

export interface State { 
  obj: FeatureChoice;
  loading: boolean;
  reloading: boolean;
  expanded: Feature | FeatureChoice | null;
}

class FeatureChoiceInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      obj: new FeatureChoice(),
      loading: true,
      reloading: false,
      expanded: null
    };
  }

  componentDidMount() {
  }

  getLabelWidth(name: string) {
    let smallCount = 
      this.countOccurences(name, "i") +
      this.countOccurences(name, "l") +
      this.countOccurences(name, "I") +
      this.countOccurences(name, "t") +
      this.countOccurences(name, "r") +
      this.countOccurences(name, " ");

    return ((name.length - smallCount) * 10 + smallCount * 4);
  }

  countOccurences(searchMe: string, findMe: string) {
    return searchMe.split(findMe).length - 1;
  }

  render() {
    if (this.state.loading || 
      this.props.obj.parent_type !== this.state.obj.parent_type || 
      this.props.obj.id !== this.state.obj.id) {
      this.setState({ loading: false, obj: this.props.obj });
      return (
        <Grid item>Loading</Grid>
      );
    } else if (this.state.reloading) {
      return (
        <Grid item>Loading</Grid>
      );
    } else if (this.state.expanded) {
      if (this.state.expanded instanceof Feature) {
        const feature: Feature = this.state.expanded;
        return (
          <Grid item>
            <FeatureInput 
              label="Feature"
              parent_name={this.props.parent_name}
              base_name={this.props.base_name}
              choice_name={this.state.obj.name}
              feature={feature} 
              onChange={(changed: Feature) => {
                const obj = this.state.obj;
                const objFinder = obj.options.filter(o => o.id === changed.id);
                if (objFinder.length === 1) {
                  const feature = objFinder[0];
                  feature.copy(changed);
                  this.setState({ obj });
                }
              }}
              onDelete={() => {
                const id = feature.id;
                const obj = this.state.obj;
                const options = obj.options.filter(o => o.id !== id);
                options.filter(o => o.id > id).forEach(o => {
                  o.id--;
                });
                obj.options = options;
                this.setState({ expanded: null, obj });
              }}
              onDone={(target: string) => {
                if (target === "choice") {
                  this.setState({ expanded: null });
                } else {
                  this.setState({ expanded: null }, () => {
                    this.props.onDone(target);
                  });
                }
              }}
            />
          </Grid>
        );
      }
    } else {
      return (
        <Grid item container spacing={1} direction="column">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={ () => { 
                this.props.onDone("parent");
              }}>
              { this.props.parent_name === "" ? `Nameless ${this.props.obj.parent_type}` : this.props.parent_name }
            </Button>
            &gt;
            <Button
              variant="contained"
              color="primary"
              onClick={ () => { 
                this.props.onDone("base");
              }}>
              { this.props.base_name === "" ? `Nameless Feature Choice` : this.props.base_name }
            </Button>
          </Grid>
          <Grid item container spacing={1} direction="row">
            <Grid item xs={2}>
              <Tooltip title={`Delete Feature Choice`}>
                <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                  onClick={ () => {
                    this.props.onDelete();
                  }}>
                  <DeleteForever/>
                </Fab>
              </Tooltip>
            </Grid>
            <Grid item xs={10}>
              <TemplateBox
                obj={this.state.obj}
                type="FeatureChoice"
                useTemplate={(template: TemplateBase) => {
                  const obj_template: FeatureChoiceTemplate = template as FeatureChoiceTemplate;
                  const obj = this.state.obj;
                  obj.copyTemplate(obj_template);
                  this.props.onChange(obj);
                  this.setState({ obj, reloading: true }, () => {
                    this.setState({ reloading: false });
                  });
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <StringBox 
              value={this.state.obj.name} 
              name="Name"
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.name = value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item>
            <StringBox 
              value={this.state.obj.description} 
              name="Description"
              multiline
              onBlur={(value: string) => {
                const obj = this.state.obj;
                obj.description = value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item>
            <StringBox 
              value={`${this.state.obj.choice_count}`} 
              name="Choice Count"
              onBlur={(value: number) => {
                const obj = this.state.obj;
                obj.choice_count = value;
                this.setState({ obj });
              }}
            />
          </Grid>
          <Grid item>
            <FeatureListInput 
              label="Option"
              features={this.state.obj.options} 
              parent_id={this.state.obj.parent_id} 
              parent_type={this.state.obj.parent_type}
              onChange={(changed: Feature[]) => {
                const obj = this.state.obj;
                obj.options = [];
                this.setState({ obj }, () => {
                  obj.options = changed;
                  this.setState({ obj });
                });
              }}
              onExpand={(expanded: Feature) => {
                this.setState({ expanded });
              }}
              onAdd={() => {
                const obj = this.state.obj;
                const feature = new Feature();
                feature.parent_type = obj.parent_type;
                feature.parent_id = obj.parent_id;
                feature.base_id = obj.id;
                feature.id = obj.options.length;
                obj.options.push(feature);
                this.setState({
                  obj,
                  expanded: feature
                });
              }}
            />
          </Grid>
        </Grid>
      );
    }
  }
}

export default connector(FeatureChoiceInput);
