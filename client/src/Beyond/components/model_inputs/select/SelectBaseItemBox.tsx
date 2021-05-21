import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid
} from "@material-ui/core";

import { 
  BaseItem
} from "../../../models";
import { 
  ITEM_TYPES 
} from "../../../models/Constants";

import StringBox from "../../input/StringBox";
import SelectBox from "../../input/SelectBox";
import SelectStringBox from "../../input/SelectStringBox"; 

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
  value: string;
  item_type: string;
  multiple: boolean;
  simple_view: boolean;
  values: string[];
  base_items: BaseItem[] | null;
  onChange: Function;
}

export interface State {
  base_items: BaseItem[] | null;
  search_string: string;
  item_type: string;
  loading: boolean;
}

class SelectBaseItemBox extends Component<Props, State> {
  public static defaultProps = {
    base_items: null,
    value: "",
    values: [],
    multiple: false,
    simple_view: false,
    item_type: "ALL"
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      base_items: null,
      search_string: "",
      item_type: "ALL",
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
      this.api.getObjects("base_item").then((res: any) => {
        if (res && !res.error) {
          const base_items: BaseItem[] = res;
          let search_string = this.state.search_string;
          let item_type = this.props.item_type;
          if (this.props.value !== "") {
            const objFinder = base_items.filter(o => o._id === this.props.value);
            if (objFinder.length === 1) {
              const obj = objFinder[0];
              search_string = obj.name;
              item_type = obj.item_type;
            }
          }
          this.setState({ 
            search_string,
            item_type,
            base_items, 
            loading: false 
          });
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.base_items === null) {
      return <span>Loading</span>;
    } else {
      let filtered: BaseItem[] = this.props.base_items ? this.props.base_items : (this.state.base_items ? this.state.base_items : []);
      filtered = filtered.filter(o => 
        (this.state.item_type === "ALL" || this.state.item_type === o.item_type) &&
        (this.state.search_string === "" || o.name.toLowerCase().includes(this.state.search_string.toLowerCase()) || o.description.toLowerCase().includes(this.state.search_string.toLowerCase()))).sort((a,b) => {return a.name.localeCompare(b.name)});
      return (
        <Grid container spacing={1} direction="row">
          { !this.props.simple_view &&
            <Grid item xs={ this.props.item_type === "ALL" ? 3 : 6}>
              <StringBox
                name="Search"
                value={`${this.state.search_string}`}
                onBlur={(search_string: string) => {
                  this.setState({ search_string });
                }}
              />
            </Grid>
          }
          { !this.props.simple_view && this.props.item_type === "ALL" &&
            <Grid item xs={3}>
              <SelectStringBox
                name="Item Type"
                options={["ALL",...ITEM_TYPES]}
                value={this.state.item_type}
                onChange={(item_type: string) => {
                  this.setState({ item_type });
                }}
              />
            </Grid>
          }
          <Grid item xs={ this.props.simple_view ? 12 : 6 }>
            { !this.props.simple_view && filtered.length > 20 ?
              <span>Too many base items { filtered.length }</span>
            : this.props.multiple ?
              <SelectBox 
                options={filtered}
                multiple
                values={this.props.values} 
                name={this.props.name}
                onChange={(ids: string[]) => {
                  this.props.onChange(ids);
                }}
              />
            :
              <SelectBox 
                options={filtered}
                value={this.props.value} 
                name={this.props.name}
                onChange={(id: string) => {
                  const objFinder = this.state.base_items ? this.state.base_items.filter(o => o._id === id) : [];
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

export default connector(SelectBaseItemBox);
