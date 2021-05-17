import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, Fab, Tooltip, Button
} from "@material-ui/core";
import {
  DeleteForever
} from "@material-ui/icons";

import { 
  FeatureBase, 
  Feature, 
  FeatureChoice,
  TemplateBase,
  FeatureBaseTemplate,
  IStringHash
} from "../../../models";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox";
import CheckBox from "../../input/CheckBox";

import FeatureListInput from "./FeatureList";
import FeatureInput from "./FeatureMain";
import FeatureChoicesInput from "./FeatureChoices";
import FeatureChoiceInput from "./FeatureChoice";
import SelectConditionBox from "../select/SelectConditionBox";

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
  feature_base: FeatureBase;
  feature_bases: FeatureBase[];
  onChange: (feature_base: FeatureBase) => void; 
  onDelete: () => void; 
  onDone: () => void;
}

export interface State { 
  feature_base: FeatureBase;
  loading: boolean;
  reloading: boolean;
  expanded: Feature | FeatureChoice | null;
}

class FeatureBaseInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      feature_base: new FeatureBase(),
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
      this.props.feature_base.parent_type !== this.state.feature_base.parent_type || 
      this.props.feature_base.id !== this.state.feature_base.id) {
      this.setState({ loading: false, feature_base: this.props.feature_base });
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
              base_name={this.state.feature_base.name}
              feature={feature} 
              onChange={(changed: Feature) => {
                const feature_base = this.state.feature_base;
                const objFinder = feature_base.features.filter(o => o.id === changed.id);
                if (objFinder.length === 1) {
                  const feature = objFinder[0];
                  feature.copy(changed);
                  this.setState({ feature_base });
                }
              }}
              onDelete={() => {
                const id = feature.id;
                const feature_base = this.state.feature_base;
                const features = feature_base.features.filter(o => o.id !== id);
                features.filter(o => o.id > id).forEach(o => {
                  o.id--;
                });
                feature_base.features = features;
                this.setState({ expanded: null, feature_base });
              }}
              onDone={(target: string) => {
                if (target === "base") {
                  this.setState({ expanded: null });
                } else {
                  this.setState({ expanded: null }, () => {
                    this.props.onDone();
                  });
                }
              }}
            />
          </Grid>
        );
      } else if (this.state.expanded instanceof FeatureChoice) {
        const feature_choice: FeatureChoice = this.state.expanded;
        return (
          <Grid item>
            <FeatureChoiceInput 
              parent_name={this.props.parent_name}
              base_name={this.state.feature_base.name}
              obj={feature_choice} 
              onChange={(changed: FeatureChoice) => {
                const feature_base = this.state.feature_base;
                const objFinder = feature_base.feature_choices.filter(o => o.id === changed.id);
                if (objFinder.length === 1) {
                  const feature = objFinder[0];
                  feature.copy(changed);
                  this.setState({ feature_base });
                }
              }}
              onDelete={() => {
                const id = feature_choice.id;
                const feature_base = this.state.feature_base;
                const feature_choices = feature_base.feature_choices.filter(o => o.id !== id);
                feature_choices.filter(o => o.id > id).forEach(o => {
                  o.id--;
                });
                feature_base.feature_choices = feature_choices;
                this.setState({ expanded: null, feature_base });
              }}
              onDone={(target: string) => {
                if (target === "base") {
                  this.setState({ expanded: null });
                } else {
                  this.setState({ expanded: null }, () => {
                    this.props.onDone(); 
                  });
                }
              }}
            />
          </Grid>
        );
      } else {
        return <span>?</span>;
      }
    } else {
      return (
        <Grid item container spacing={1} direction="column">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={ () => { 
                this.props.onDone();
              }}>
              { this.props.parent_name === "" ? `Nameless ${this.props.feature_base.parent_type}` : this.props.parent_name }
            </Button>
          </Grid>
          <Grid item container spacing={1} direction="row">
            <Grid item xs={2}>
              <Tooltip title={`Delete Feature Base`}>
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
                obj={this.state.feature_base}
                type="FeatureBase"
                useTemplate={(template: TemplateBase) => {
                  const feature_base_template: FeatureBaseTemplate = template as FeatureBaseTemplate;
                  const feature_base = this.state.feature_base;
                  feature_base.copyTemplate(feature_base_template);
                  this.props.onChange(feature_base);
                  this.setState({ feature_base, reloading: true }, () => {
                    this.setState({ reloading: false });
                  });
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <StringBox 
              value={this.state.feature_base.name} 
              name="Name"
              onBlur={(value: string) => {
                const feature_base = this.state.feature_base;
                feature_base.name = value;
                this.setState({ feature_base });
              }}
            />
          </Grid>
          <Grid item>
            <StringBox 
              value={this.state.feature_base.description} 
              name="Description"
              multiline
              onBlur={(value: string) => {
                const feature_base = this.state.feature_base;
                feature_base.description = value;
                this.setState({ feature_base });
              }}
            />
          </Grid>
          <Grid item>
            <CheckBox 
              value={this.state.feature_base.display} 
              name="Display"
              onChange={(value: boolean) => {
                const feature_base = this.state.feature_base;
                feature_base.display = value;
                this.setState({ feature_base });
              }}
            />
          </Grid>
          <Grid item>
            <CheckBox 
              value={this.state.feature_base.optional} 
              name="Optional"
              onChange={(value: boolean) => {
                const feature_base = this.state.feature_base;
                feature_base.optional = value;
                this.setState({ feature_base });
              }}
            />
          </Grid>
          { this.state.feature_base.optional && 
            <Grid item>
              { this.render_other_feature_base_select() }
            </Grid>
          }
          <Grid item>
            <StringBox 
              value={`${this.state.feature_base.level}`} 
              name={ (this.state.feature_base.parent_type === "Class" || this.state.feature_base.parent_type === "Subclass") ? "Class Level" : "Character Level" }
              type="number"
              onBlur={(value: number) => {
                const feature_base = this.state.feature_base;
                feature_base.level = value;
                this.setState({ feature_base });
              }}
            />
          </Grid>
          <Grid item>
            <SelectStringBox
              name="Multiclassing"
              option_map={{
                "Unaffected": "0",
                "First Class Only": "1",
                "Later Classes Only": "2"
              }}
              value={`${this.state.feature_base.multiclassing}`}
              onChange={(changed: string) => {
                const feature_base = this.state.feature_base;
                feature_base.multiclassing = +changed;
                this.setState({ feature_base }); 
              }}
            />
          </Grid>
          <Grid item>
            <SelectConditionBox
              name="Required Conditions"
              multiple
              allow_all
              values={this.state.feature_base.required_condition_ids}
              onChange={(ids: string[]) => {
                const feature_base = this.state.feature_base;
                feature_base.required_condition_ids = ids;
                this.setState({ feature_base }); 
              }}
            />
          </Grid>
          <Grid item>
            <FeatureListInput 
              label="Feature"
              features={this.state.feature_base.features} 
              parent_id={this.state.feature_base.parent_id} 
              parent_type={this.state.feature_base.parent_type}
              onChange={(changed: Feature[]) => {
                const feature_base = this.state.feature_base;
                feature_base.features = [];
                this.setState({ feature_base }, () => {
                  feature_base.features = changed;
                  this.setState({ feature_base });
                });
              }}
              onExpand={(expanded: Feature) => {
                this.setState({ expanded });
              }}
              onAdd={() => {
                const feature_base = this.state.feature_base;
                const feature = new Feature();
                feature.parent_type = feature_base.parent_type;
                feature.parent_id = feature_base.parent_id;
                feature.base_id = feature_base.id;
                feature.id = feature_base.features.length;
                feature_base.features.push(feature);
                this.setState({
                  feature_base,
                  expanded: feature
                });
              }}
            />
          </Grid>
          <Grid item>
            <FeatureChoicesInput 
              feature_choices={this.state.feature_base.feature_choices} 
              parent_id={this.state.feature_base.parent_id} 
              parent_type={this.state.feature_base.parent_type}
              onChange={(changed: FeatureChoice[]) => {
                const feature_base = this.state.feature_base;
                feature_base.feature_choices = [];
                this.setState({ feature_base }, () => {
                  feature_base.feature_choices = changed;
                  this.setState({ feature_base });
                });
              }}
              onExpand={(expanded: FeatureChoice) => {
                this.setState({ expanded });
              }}
              onAdd={() => {
                const feature_base = this.state.feature_base;
                const feature_choice = new FeatureChoice();
                feature_choice.parent_type = feature_base.parent_type;
                feature_choice.parent_id = feature_base.parent_id;
                feature_choice.base_id = feature_base.id;
                feature_choice.id = feature_base.feature_choices.length;
                feature_base.feature_choices.push(feature_choice);
                this.setState({
                  feature_base,
                  expanded: feature_choice
                });
              }}
            />
          </Grid>
        </Grid>
      );
    }
  }

  render_other_feature_base_select() {
    const option_map: IStringHash = {
      "None": ""
    };
    this.props.feature_bases.filter(o => !o.optional).forEach(fb => {
      option_map[fb.name] = fb.true_id;
    });
    return (
      <SelectStringBox
        name="Replace Other Feature"
        option_map={option_map}
        value={this.state.feature_base.replaces_feature_base_id}
        onChange={(changed: string) => {
          const feature_base = this.state.feature_base;
          feature_base.replaces_feature_base_id = changed;
          this.setState({ feature_base }); 
        }}
      />
    );
  }
}

export default connector(FeatureBaseInput);
