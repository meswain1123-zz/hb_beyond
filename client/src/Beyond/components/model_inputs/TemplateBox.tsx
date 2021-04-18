import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
import {
  Grid, Button, Modal
} from "@material-ui/core";

import { 
  AbilityTemplate,
  FeatureTemplate,
  FeatureBaseTemplate,
  FeatureChoiceTemplate,
  SummonStatBlockTemplate,
  CreatureTemplate,
  // MagicItemTemplate,
  TemplateBase
} from "../../models";
// import { 
//   // DAMAGE_TYPES, 
//   // DURATIONS,
//   // COMPONENTS,
//   // CASTING_TIMES,
//   // RESOURCES,
//   ABILITY_SCORES 
// } from "../../models/Constants";

import StringBox from "../input/StringBox";
import SelectBox from "../input/SelectBox";
import SelectStringBox from "../input/SelectStringBox"; 

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  // templates: TemplateBase[]
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  // templates: state.app.templates
})

const mapDispatch = {
  // addTemplate: (obj: TemplateBase) => ({ type: 'ADD', dataType: 'templates', payload: obj })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  obj: any;
  type: string;
  useTemplate: (template: TemplateBase) => void;
}

export interface State { 
  loading: boolean;
  type: string;
  categories: string[];
  selected_category: string;
  all_templates: TemplateBase[] | null;
  templates: TemplateBase[];
  selected_template: TemplateBase | null; 
  processing: boolean;
  modal_open: boolean;
  new_template: TemplateBase | null;
}

class TemplateBox extends Component<Props, State> {
  // public static defaultProps = {
  //   choice_name: null
  // };
  constructor(props: Props) {
    super(props);
    this.state = {
      type: "",
      categories: [],
      selected_category: "",
      all_templates: null,
      templates: [],
      selected_template: null,
      loading: false,
      processing: false,
      modal_open: false,
      new_template: null
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  getModalStyle = () => {
    const top = Math.round(window.innerHeight / 2) - 50;
    const left = Math.round(window.innerWidth / 2) - 200;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(${left}px, ${top}px)`,
    };
  }

  load() {
    this.setState({ loading: true }, () => {
      if (this.state.all_templates) {
        const templates = this.state.all_templates.filter(t => t.type === this.props.type);
        const categories = ["ALL", ...Array.from(new Set(this.state.all_templates.filter(item => item.type === this.props.type).map(item => item.category)))];
        
        this.setState({
          loading: false,
          type: this.props.type,
          categories,
          selected_category: "ALL",
          templates,
          selected_template: null
        });
      } else {
        this.api.getObjects("template").then((res: any) => {
          if (res && !res.error) {
            const all_templates: TemplateBase[] = res;
            const templates: TemplateBase[] = res.filter((t: TemplateBase) => t.type === this.props.type);
            const categories: string[] = ["ALL", ...Array.from(new Set(templates.map((item: TemplateBase) => item.category)))];
            
            this.setState({
              all_templates,
              templates,
              loading: false,
              type: this.props.type,
              categories,
              selected_category: "ALL",
              selected_template: null
            });
          }
        });
      }
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.all_templates === null || this.state.type !== this.props.type) {
      this.load();
      return <span>Loading</span>;
    } else {
      return (
        <Grid item container spacing={1} direction="row">
          <Grid item xs={3}>
            <SelectStringBox 
              options={this.state.categories}
              value={this.state.selected_category} 
              name="Template Category"
              onChange={(selected_category: string) => {
                const templates = this.state.all_templates ? this.state.all_templates.filter(t => t.type === this.props.type && (selected_category === "ALL" || t.category === selected_category)) : [];
                this.setState({ selected_category, templates });
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <SelectBox 
              options={this.state.templates}
              value={ this.state.selected_template ? this.state.selected_template._id : "" } 
              name="Template"
              onChange={(id: string) => {
                const objFinder = this.state.all_templates ? this.state.all_templates.filter(o => o._id === id) : [];
                if (objFinder.length === 1) {
                  this.setState({ selected_template: objFinder[0] });
                }
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              disabled={ this.state.selected_template === null }
              onClick={ () => { 
                if (this.state.selected_template) {
                  this.props.useTemplate(this.state.selected_template);
                }
              }}>
              Use Template
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={ () => { 
                // Create a template from the object
                let new_template: TemplateBase | null = null;
                switch(this.state.type) {
                  case "Ability":
                    new_template = new AbilityTemplate();
                  break;
                  case "Feature":
                    new_template = new FeatureTemplate();
                  break;
                  case "FeatureBase":
                    new_template = new FeatureBaseTemplate();
                  break;
                  case "FeatureChoice":
                    new_template = new FeatureChoiceTemplate();
                  break;
                  case "Creature":
                    new_template = new CreatureTemplate();
                  break;
                  case "SummonStatBlock":
                    new_template = new SummonStatBlockTemplate();
                  break;
                  case "MagicItem":
                    // new_template = new MagicItemTemplate();
                  break;
                }
                if (new_template) {
                  new_template.copyObj(this.props.obj);
                  // Pass it to the modal.
                  this.setState({ new_template, modal_open: true });
                }
              }}>
              Create Template
            </Button>
          </Grid>
          <Modal
              aria-labelledby="delete-thing-modal"
              aria-describedby="delete-thing-modal-description"
              open={this.state.modal_open}
              onClose={() => {this.setState({ modal_open: false })}}
            >
            <div style={this.getModalStyle()} className="paper">
              <Grid container spacing={1} direction="column">
                <Grid item>
                  <StringBox
                    name="Template Name"
                    value={ this.state.new_template ? this.state.new_template.name : "" }
                    onBlur={(value: string) => {
                      if (this.state.new_template) {
                        const new_template = this.state.new_template;
                        new_template.name = value;
                        this.setState({ new_template });
                      }
                    }}
                  />
                </Grid>
                <Grid item>
                  <StringBox
                    name="Template Category"
                    value={ this.state.new_template ? this.state.new_template.category : "" }
                    onBlur={(value: string) => {
                      if (this.state.new_template) {
                        const new_template = this.state.new_template;
                        new_template.category = value;
                        this.setState({ new_template });
                      }
                    }}
                  />
                </Grid>
                <Grid item container spacing={1} direction="row">
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={ this.state.processing || !this.state.new_template || this.state.new_template.name === "" || this.state.new_template.category === "" }
                      onClick={() => {
                        this.setState({ processing: true }, () => {
                          if (this.state.new_template) {
                            this.api.createObject(this.state.new_template).then((res: any) => {
                              if (this.state.new_template) {
                                this.setState({ processing: false, modal_open: false }, () => {
                                  const templates = this.state.all_templates ? this.state.all_templates.filter(t => t.type === this.props.type && (this.state.selected_category === "ALL" || t.category === this.state.selected_category)) : [];
                                  this.setState({ templates });
                                });
                              }
                            });
                          }
                        });
                      }}
                    >
                      Submit
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={e => {this.setState({modal_open: false})}}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </Modal>
        </Grid>
      );
    }
  }
}

export default connector(TemplateBox);
