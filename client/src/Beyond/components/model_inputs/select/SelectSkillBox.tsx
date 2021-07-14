import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Skill
} from "../../../models";
import { 
  ABILITY_SCORES 
} from "../../../models/Constants";

import SelectBox from "../../input/SelectBox";

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
  name: string;
  value: string | null;
  multiple: boolean;
  allow_all: boolean;
  allow_ability_scores: boolean;
  options: string[];
  values: string[];
  skills: Skill[] | null;
  onChange: Function;
  color: string;
  ignore_us: string[];
}

export interface State {
  skills: Skill[] | null;
  loading: boolean;
}

class SelectSkillBox extends Component<Props, State> {
  public static defaultProps = {
    skills: null,
    value: null,
    options: [],
    values: [],
    multiple: false,
    color: "",
    ignore_us: [],
    allow_all: false,
    allow_ability_scores: false
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      skills: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("skill").then((res: any) => {
        if (res && !res.error) {
          this.setState({ skills: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.skills === null) {
      return <span>Loading</span>;
    } else if (this.props.multiple) {
      let skills = this.state.skills;
      if (this.props.options.length > 0) {
        skills = [];
        this.props.options.forEach(o => {
          if (this.state.skills) {
            const objFinder = this.state.skills.filter(s => s._id === o);
            if (objFinder.length === 1) {
              skills.push(objFinder[0]);
            }
          }
        });
      }
      if (this.props.allow_ability_scores) {
        const ability_scores: Skill[] = [];
        ABILITY_SCORES.filter(o => o !== "None").forEach(ability => {
          const skill = new Skill();
          skill._id = ability;
          skill.name = ability;
          ability_scores.push(skill);
        });
        skills = [...ability_scores,...skills];
      }
      return (
        <SelectBox 
          options={skills}
          multiple
          allow_all={this.props.allow_all}
          values={this.props.values} 
          name={this.props.name}
          onChange={(ids: string[]) => {
            this.props.onChange(ids);
          }}
        />
      );
    } else {
      let skills = this.state.skills;
      if (this.props.options.length > 0) {
        skills = [];
        this.props.options.forEach(o => {
          if (this.state.skills) {
            const objFinder = this.state.skills.filter(s => s._id === o);
            if (objFinder.length === 1) {
              skills.push(objFinder[0]);
            }
          }
        });
      }
      if (this.props.allow_ability_scores) {
        const ability_scores: Skill[] = [];
        ABILITY_SCORES.filter(o => o !== "None").forEach(ability => {
          const skill = new Skill();
          skill._id = ability;
          skill.name = ability;
          ability_scores.push(skill);
        });
        skills = [...ability_scores,...skills];
      }
      skills = skills.filter(o => !this.props.ignore_us.includes(o._id));
      return (
        <SelectBox 
          options={skills}
          value={this.props.value} 
          name={this.props.name}
          color={this.props.color}
          allow_all={this.props.allow_all}
          onChange={(id: string) => {
            const objFinder = this.state.skills ? this.state.skills.filter(o => o._id === id) : [];
            if (objFinder.length === 1) {
              this.props.onChange(objFinder[0]._id);
            }
          }}
        />
      );
    }
  }
}

export default connector(SelectSkillBox);
