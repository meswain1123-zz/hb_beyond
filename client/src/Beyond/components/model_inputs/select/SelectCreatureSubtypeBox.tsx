import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Creature,
  // IStringArrayHash
} from "../../../models";

import SelectStringBox from "../../input/SelectStringBox";

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


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
  name: string;
  value: string;
  // creatures: Creature[] | null;
  onChange: (id: string) => void;
  color: string;
  allow_any: boolean;
  creature_type: string;
}

export interface State {
  creatures: Creature[] | null;
  subtypes: string[];
  loading: boolean;
}

class SelectCreatureBox extends Component<Props, State> {
  public static defaultProps = {
    color: "",
    creatures: null,
    allow_any: true,
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      creatures: null,
      subtypes: [],
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("creature").then((res: any) => {
        if (res && !res.error) {
          const creatures: Creature[] = res;
          const subtypes: string[] = [];
          creatures.filter(o => this.props.creature_type === o.creature_type).forEach(c => {
            if (!subtypes.includes(c.subtype)) {
              subtypes.push(c.subtype);
            }
          });
          this.setState({ creatures, subtypes, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.creatures === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      // const creatures = this.props.creatures ? this.props.creatures : this.state.creatures;
      const subtypes = this.props.allow_any ? ["Any",...this.state.subtypes] : this.state.subtypes;
      return (
        <SelectStringBox 
          options={subtypes}
          // allow_any={this.props.allow_any}
          value={this.props.value} 
          name={this.props.name}
          color={this.props.color}
          onChange={(id: string) => {
            this.props.onChange(id);
          }}
        />
      );
    }
  }
}

export default connector(SelectCreatureBox);
