import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from "react-router-dom";
import {
  Edit,
} from "@material-ui/icons";
import {
  Grid, 
  Button, 
  Tooltip, 
  Fab,
  Link
} from "@material-ui/core";

import { 
  ModelBase 
} from "../../models";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { 
  filter: any;
  data_type: string;
}

export interface State {  
  filter: any;
  data_type: string;
  redirectTo: string | null;
  page_num: number;
  objects: ModelBase[] | null;
  loading: boolean;
  count: number;
  offset: number;
}

class ObjectIndex extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      page_num: 0,
      objects: null,
      loading: false,
      count: 0,
      offset: 0,
      filter: {},
      data_type: ""
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.filter !== this.props.filter || this.state.data_type !== this.props.data_type) {
      this.setState({ 
        filter: this.props.filter, 
        data_type: this.props.data_type 
        }, this.load);
    }
  }

  descriptionStyle = () => {
    const descWidth = Math.floor(this.props.width * 0.7);
  
    const properties: React.CSSProperties = {
      width: `${descWidth}px`,
      whiteSpace: "nowrap", 
      overflow: "hidden", 
      textOverflow: "ellipsis"
    } as React.CSSProperties;

    return properties;
  }

  load() {
    this.setState({ loading: true, objects: [] }, () => {
      this.api.getObjectCount(this.state.data_type, this.state.filter).then((res: any) => {
        if (res && !res.error) {
          this.setState({ count: res.count }, this.load_some);
        }
      });
    });
  }

  load_some() {
    this.api.getObjects(this.state.data_type, this.state.filter, this.state.objects ? (this.state.objects.length + this.state.offset) : this.state.offset, 350).then((res: any) => {
      if (res && !res.error) {
        let objects: ModelBase[] = this.state.objects ? this.state.objects : [];
        objects = [...objects, ...(res as ModelBase[])];
        this.setState({ objects, loading: false });
      }
    });
  }

  render() {
    if (this.state.data_type === "" || this.state.objects === null || this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      const page_size = 7;
      const filtered: any[] = this.state.objects ? this.state.objects : [];
      const page_count = Math.ceil(this.state.count / page_size);
      const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num - this.state.offset, page_size * (this.state.page_num + 1) - this.state.offset);
      return (
        <Grid container spacing={1} direction="column">
          { filtered_and_paged.map((o, key) => {
            return (
              <Grid key={key} item container spacing={1} direction="row">
                <Grid item xs={2}>
                  <Tooltip title={`View details for ${o.name}`}>
                    <Button 
                      fullWidth variant="contained" color="primary" 
                      onClick={ () => {
                        this.setState({ redirectTo:`/beyond/spell/details/${o._id}` });
                      }}>
                        { o.name }
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item xs={1}>
                  <Tooltip title={`Edit ${o.name}`}>
                    <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                      onClick={ () => {
                        this.setState({ redirectTo:`/beyond/spell/edit/${o._id}` });
                      }}>
                      <Edit/>
                    </Fab>
                  </Tooltip> 
                </Grid>
                <Grid item xs={9}>
                  <Tooltip title={o.description}>
                    <div style={this.descriptionStyle()}>
                      { o.description }
                    </div>
                  </Tooltip>
                </Grid>
              </Grid>
            );
          }) }
          { this.state.loading && 
            <Grid item>
              Loading
            </Grid>
          }
          <Grid item>
            { this.renderPageLinks(page_count) }
          </Grid>
        </Grid>
      ); 
    } 
  }

  renderPageLinks(page_count: number) {
    const return_us: any[] = [];
    const start = Math.max(0, this.state.page_num - 3);
    const end = Math.min(page_count, this.state.page_num + 4);
    let key = 0;
    if (start > 0) {
      return_us.push(
        <Link key={key} href="#" onClick={(event: React.SyntheticEvent) => {
          event.preventDefault();
          this.page_change(0);
          }}>
          1
        </Link>
      );
      key++;
      return_us.push(<span key={key}>&nbsp;</span>);
      key++;
    }
    if (start > 1) {
      return_us.push(<span key={key}>...</span>);
      key++;
    }
    for (let i = start; i < end; i++) {
      if (this.state.page_num === i) {
        return_us.push(<span key={key}>{ i + 1}</span>);
      } else {
        return_us.push(
          <Link key={key} href="#" onClick={(event: React.SyntheticEvent) => {
            event.preventDefault();
            this.page_change(i);
            }}>
            { i + 1 }
          </Link>
        );
      }
      key++;
      return_us.push(<span key={key}>&nbsp;</span>);
      key++;
    }
    if (end < page_count - 1) {
      return_us.push(<span key={key}>...</span>);
      key++;
    }
    if (end < page_count) {
      return_us.push(
        <Link key={key} href="#" onClick={(event: React.SyntheticEvent) => {
          event.preventDefault();
          this.page_change(page_count - 1);
          }}>
          { page_count }
        </Link>
      );
      key++;
      return_us.push(<span key={key}>&nbsp;</span>);
      key++;
    }
    return return_us;
  }

  page_change(page_num: number) {
    if (this.state.objects) {
      if ((page_num + 1) * 7 <= this.state.offset) {
        const offset = Math.floor(page_num * 7 / 350) * 350;
        this.setState({ page_num, loading: true, offset, objects: [] }, this.load_some); 
      } else if ((page_num + 1) * 7 <= this.state.offset + this.state.objects.length) { 
        this.setState({ page_num });
      } else {
        const offset = Math.floor((page_num + 1) * 7 / 350) * 350;
        this.setState({ page_num, loading: true, offset, objects: [] }, this.load_some); 
      }
    }
  }
}

export default connector(ObjectIndex);
