import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";
import {
  Add, 
  ArrowBack,
  Close
} from "@material-ui/icons";
import {
  Grid, 
  Button, 
  Tooltip, Fab,
} from "@material-ui/core";

import { 
  EquipmentPack, 
  EquipmentPackItem,
} from "../../models";
import StringBox from "../../components/input/StringBox";

import SelectBaseItemBox from "../../components/model_inputs/select/SelectBaseItemBox";

import ModelBaseInput from "../../components/model_inputs/ModelBaseInput";

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";


interface AppState {
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

interface MatchParams {
  id: string;
}

const mapState = (state: RootState) => ({
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps<MatchParams> & { }

export interface State { 
  redirectTo: string | null;
  obj: EquipmentPack;
  processing: boolean;
  equipment_packs: EquipmentPack[] | null;
  loading: boolean;
}

class EquipmentPackEdit extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new EquipmentPack(),
      processing: false,
      equipment_packs: null,
      loading: false
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  submit() {
    this.setState({ processing: true }, () => {
      this.api.upsertObject("equipment_pack", this.state.obj).then((res: any) => {
        this.setState({ processing: false, redirectTo: "/beyond/equipment_pack" });
      });
    });
  }

  // Loads the editing obj into state
  load_object(id: string) {
    const objFinder = this.state.equipment_packs ? this.state.equipment_packs.filter(a => a._id === id) : [];
    if (objFinder.length === 1) {
      this.setState({ obj: objFinder[0].clone(), loading: false });
    }
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getObjects("equipment_pack").then((res: any) => {
        if (res && !res.error) {
          let { id } = this.props.match.params;
          if (id !== undefined && this.state.obj._id !== id) {
            this.setState({ equipment_packs: res }, () => {
              this.load_object(id);
            });
          } else {
            this.setState({ equipment_packs: res, loading: false });
          }
        }
      });
    });
  }

  render() {
    if (this.state.loading || this.state.equipment_packs === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      const formHeight = this.props.height - (this.props.width > 600 ? 220 : 220);
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <Tooltip title={`Back to Equipment Packs`}>
              <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                onClick={ () => {
                  this.setState({ redirectTo:`/beyond/equipment_pack` });
                }}>
                <ArrowBack/>
              </Fab>
            </Tooltip> 
          </Grid>
          <Grid item>
            <span className={"MuiTypography-root MuiListItemText-primary header"}>
              { this.state.obj._id === "" ? "Create Equipment Pack" : `Edit ${this.state.obj.name}` }
            </span>
          </Grid>
          <Grid item 
            style={{ 
              height: `${formHeight}px`, 
              overflowY: "scroll", 
              overflowX: "hidden" 
            }}>
            <Grid container spacing={1} direction="column">
              <ModelBaseInput 
                obj={this.state.obj}
                onChange={() => {
                  const obj = this.state.obj;
                  this.setState({ obj });
                }}
              />
              <Grid item>
                <StringBox 
                  value={this.state.obj.cost} 
                  name="Cost"
                  onBlur={(value: string) => {
                    const obj = this.state.obj;
                    obj.cost = value;
                    this.setState({ obj });
                  }}
                />
              </Grid>
              <Grid item>
                <span className={"MuiTypography-root MuiListItemText-primary header"}>
                  Items
                </span>
                <Tooltip title={`Add Item`}>
                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                    onClick={ () => {
                      const obj = this.state.obj;
                      const item = new EquipmentPackItem();
                      item.id = obj.items.length;
                      obj.items.push(item);
                      this.setState({ obj });
                    }}>
                    <Add/>
                  </Fab>
                </Tooltip> 
              </Grid>
              { this.state.obj.items.map((item, key) => {
                return (
                  <Grid item key={key} container spacing={1} direction="row">
                    <Grid item xs={6}>
                      <SelectBaseItemBox 
                        name="Item"
                        value={item.item_id}
                        onChange={(id: string) => {
                          item.item_id = id;
                          const obj = this.state.obj;
                          this.setState({ obj });
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <StringBox
                        value={`${item.count}`} 
                        name="Count"
                        type="number"
                        onBlur={(value: string) => {
                          item.count = +value;
                          const obj = this.state.obj;
                          this.setState({ obj });
                        }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={`Delete Item`}>
                        <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                          onClick={ () => {
                            const obj = this.state.obj;
                            obj.items = obj.items.filter(o => o.id !== item.id);
                            this.setState({ obj });
                          }}>
                          <Close/>
                        </Fab>
                      </Tooltip> 
                    </Grid>
                  </Grid>
                );
              })}
              <Grid item>

              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={this.state.processing}
              onClick={ () => { 
                this.submit();
              }}>
              Submit
            </Button>
            <Button
              variant="contained"
              disabled={this.state.processing}
              style={{ marginLeft: "4px" }}
              onClick={ () => { 
                this.setState({ redirectTo:`/beyond/equipment_pack` });
              }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      ); 
    }
  }
}

export default connector(EquipmentPackEdit);
