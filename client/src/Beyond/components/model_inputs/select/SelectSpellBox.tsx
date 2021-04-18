import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// import { RouteComponentProps } from 'react-router';
import {
  Grid
} from "@material-ui/core";

import { 
  Spell
} from "../../../models";
import { 
  SCHOOLS 
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectBox from "../../input/SelectBox";
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
  spells: Spell[] | null;
  onChange: (id: string) => void;
}

export interface State {
  spells: Spell[] | null;
  search_string: string;
  level: string;
  school: string;
  loading: boolean;
}

class SelectSpellBox extends Component<Props, State> {
  public static defaultProps = {
    spells: null
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      spells: null,
      search_string: "",
      level: "ALL",
      school: "ALL",
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("spell").then((res: any) => {
        if (res && !res.error) {
          this.setState({ spells: res, loading: false });
        }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.spells === null) {
      this.load();
      return <span>Loading</span>;
    } else {
      const filtered: any[] = this.state.spells ? this.state.spells.filter(o => 
        (this.state.level === "ALL" || this.state.level === `${o.level}`) && 
        (this.state.school === "ALL" || this.state.school === `${o.school}`) && 
        (this.state.search_string === "" || o.name.toLowerCase().includes(this.state.search_string.toLowerCase()) || o.description.toLowerCase().includes(this.state.search_string.toLowerCase()))).sort((a,b) => {return a.name.localeCompare(b.name)}) : [];
      
      return (
        <Grid container spacing={1} direction="row">
          <Grid item xs={3}>
            <StringBox
              name="Search"
              value={`${this.state.search_string}`}
              onBlur={(search_string: string) => {
                this.setState({ search_string });
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <SelectStringBox
              name="Level"
              options={["ALL","0","1","2","3","4","5","6","7","8","9"]}
              value={this.state.level}
              onChange={(level: string) => {
                this.setState({ level });
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <SelectStringBox
              name="School"
              options={["ALL",...SCHOOLS]}
              value={this.state.school}
              onChange={(school: string) => {
                this.setState({ school });
              }}
            />
          </Grid>
          <Grid item xs={3}>
            { filtered.length > 20 ?
              <span>Too many spells { filtered.length }</span>
            :
              <SelectBox 
                options={filtered}
                value={this.props.value} 
                name={this.props.name}
                onChange={(id: string) => {
                  const objFinder = this.state.spells ? this.state.spells.filter(o => o._id === id) : [];
                  if (objFinder.length === 1) {
                    this.props.onChange(objFinder[0]._id);
                  }
                }}
              />
            }
          </Grid>
        </Grid>
      );
    }
  }
}

export default connector(SelectSpellBox);
