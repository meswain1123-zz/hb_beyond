import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  FontDownload, ExpandMore
} from "@material-ui/icons";
import {
  Grid, 
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@material-ui/core";

import { 
  Character,
  CharacterItem,
  BaseItem,
  MagicItem,
  MagicItemKeyword,
  WeaponKeyword,
  ArmorType,
} from "../../../models";

import ToggleButtonBox from "../../input/ToggleButtonBox";
import ButtonBox from "../../input/ButtonBox";
import StringBox from '../../input/StringBox';

import API from "../../../utilities/smart_api";
import { APIClass } from "../../../utilities/smart_api_class";


interface AppState {
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  obj: Character;
  item: CharacterItem;
  onChange: () => void;
  onClose: () => void;
}

export interface State {
  armor_types: ArmorType[] | null;
  weapon_keywords: WeaponKeyword[] | null;
  base_items: BaseItem[] | null;
  magic_items: MagicItem[] | null;
  magic_item_keywords: MagicItemKeyword[] | null;
  loading: boolean;
  search_string: string;
  view: string;
  proficient: boolean;
  common: boolean;
  magical: boolean;
  item_types: string[];
}

class CharacterItemDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      armor_types: null,
      weapon_keywords: null,
      base_items: null,
      magic_items: null,
      magic_item_keywords: null,
      loading: false,
      search_string: "",
      view: "",
      proficient: false,
      common: false,
      magical: false,
      item_types: []
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
    this.load();
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["armor_type","base_item","magic_item","magic_item_keyword","weapon_keyword"]).then((res: any) => {
        const base_items: BaseItem[] = res.base_item;
        const magic_items: MagicItem[] = res.magic_item;
        this.setState({ 
          armor_types: res.armor_type,
          weapon_keywords: res.weapon_keyword,
          base_items,
          magic_items,
          magic_item_keywords: res.magic_item_keyword,
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading || this.state.base_items === null) {
      return <span>Loading</span>;
    } else { 
      if (this.props.item.base_item) {
        return (
          <div 
            style={{ 
              backgroundColor: "white",
              color: "black",
              border: "1px solid blue",
              height: "800px",
              width: "324px",
              overflowX: "hidden",
              padding: "4px",
              fontSize: "11px"
            }}>
            <Grid container spacing={1} direction="column"
              style={{ 
                backgroundColor: "white",
                color: "black",
                minHeight: "800px",
                width: "316px",
                overflowX: "hidden"
              }}>
              <Grid item style={{ width: "316px", color: "purple", fontSize: "15px", fontWeight: "bold" }}>
                { this.props.item.name } { this.props.item.attuned && <FontDownload fontSize="inherit" /> }
              </Grid>
              <Grid item style={{ width: "316px" }}>
                { this.props.item.base_item.item_type } { this.props.item.magic_item && `(${this.props.item.base_item.name}), ${this.props.item.magic_item.rarity}`} { this.props.item.magic_item && this.props.item.magic_item.attunement && "(requires attunement)" }
              </Grid>
              <Grid item style={{ width: "316px", fontWeight: "bold" }}>
                <Accordion>
                  <AccordionSummary 
                    style={{
                      backgroundColor: "lightgray",
                      color: "black",
                      fontWeight: "bold",
                      height: "30px"
                    }}
                    expandIcon={<ExpandMore />}>
                    Customize
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{
                      width: "100%"
                    }}>
                      <Grid container spacing={1} direction="row">
                        <Grid item xs={6}>
                          <StringBox
                            name="Cost Override (gp)"
                            value={ this.props.item.customizations.cost ? `${this.props.item.customizations.cost}` : "" }
                            type="number"
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.item.customizations.cost;
                              } else {
                                try {
                                  this.props.item.customizations.cost = +value;
                                } catch {}
                              }
                              this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <StringBox
                            name="Weight Override (lb)"
                            value={ this.props.item.customizations.weight ? `${this.props.item.customizations.weight}` : "" }
                            type="number"
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.item.customizations.weight;
                              } else {
                                try {
                                  this.props.item.customizations.weight = +value;
                                } catch {}
                              }
                              this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StringBox
                            name="Name"
                            value={ this.props.item._name }
                            onBlur={(value: string) => {
                              this.props.item._name = value;
                              this.props.onChange();
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StringBox
                            name="Notes"
                            multiline
                            value={ this.props.item.customizations.notes ? `${this.props.item.customizations.notes}` : "" }
                            onBlur={(value: string) => {
                              if (value === "") {
                                delete this.props.item.customizations.notes;
                              } else {
                                try {
                                  this.props.item.customizations.notes = value;
                                } catch {}
                              }
                              this.props.onChange();
                            }}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Grid item style={{ width: "316px" }} container spacing={0} direction="column">
                { this.props.item.base_item.item_type === "Armor" &&
                  <Grid item>
                    <span style={{ fontWeight: "bold" }}>Armor Class:</span> { this.props.item.base_item.base_armor_class }
                  </Grid>
                }
                <Grid item>
                  <span style={{ fontWeight: "bold" }}>Weight:</span> { this.props.item.weight } lb.
                </Grid>
                <Grid item>
                  <span style={{ fontWeight: "bold" }}>Cost:</span> { this.props.item.cost } gp
                </Grid>
                {/* <Grid item>
                  <span style={{ fontWeight: "bold" }}>Version:</span> 
                </Grid> */}
              </Grid>
              <Grid item style={{ width: "316px" }} container spacing={0} direction="column">
                <Grid item>
                  { this.props.item.base_item.description }
                </Grid>
                { this.props.item.magic_item &&
                  <Grid item>
                    { this.props.item.magic_item.description }
                  </Grid>
                }
              </Grid>
              <Grid item style={{ width: "316px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center"
                  }}>
                  <div style={{ width: "300" }}>
                    <Grid container spacing={0} direction="row">
                      { (this.props.item.base_item.worn_type !== "None" || this.props.item.base_item.item_type === "Armor") ?
                        <Grid item xs={4}>
                          <ToggleButtonBox 
                            name="Wearing"
                            value={this.props.item.equipped}
                            width={100}
                            height={20}
                            fontSize={8}
                            lineHeight={2.7}
                            onToggle={() => {
                              if (this.props.item.equipped) {
                                this.props.obj.unequip_item(this.props.item);
                              } else {
                                this.props.obj.equip_item(this.props.item);
                              }
                              this.props.onChange();
                            }}
                          />
                        </Grid>
                      : this.props.item.base_item.item_type === "Weapon" ?
                        <Grid item xs={4}>
                          <ToggleButtonBox 
                            name="Equipped"
                            width={100}
                            height={20}
                            fontSize={8}
                            lineHeight={2.7}
                            value={this.props.item.equipped}
                            onToggle={() => {
                              if (this.props.item.equipped) {
                                this.props.obj.unequip_item(this.props.item);
                              } else {
                                this.props.obj.equip_item(this.props.item);
                              }
                              this.props.onChange();
                            }}
                          />
                        </Grid>
                      : this.props.item.base_item.stackable &&
                        <Grid item xs={4}>
                          Count
                        </Grid>
                      }
                      { this.props.item.magic_item && this.props.item.magic_item.attunement &&
                        <Grid item xs={4}>
                          <ToggleButtonBox 
                            name="Attuned"
                            width={100}
                            height={20}
                            fontSize={8}
                            lineHeight={2.7}
                            value={this.props.item.attuned}
                            disabled={!this.props.item.attuned && this.props.obj.attuned_items.length >= this.props.obj.max_attuned_items}
                            onToggle={() => {
                              if (this.props.item.attuned) {
                                this.props.obj.unattune_item(this.props.item);
                              } else {
                                this.props.obj.attune_item(this.props.item);
                              }
                              this.props.onChange();
                            }}
                          />
                        </Grid>
                      }
                      <Grid item xs={4}>
                        <ButtonBox 
                          name="Remove"
                          width={100}
                          height={20}
                          fontSize={8}
                          lineHeight={2.7}
                          onClick={() => {
                            this.props.obj.remove_item(this.props.item);
                            this.props.onChange();
                            this.props.onClose();
                          }}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        );
      } else return null;
    }
  }
}

export default connector(CharacterItemDetails);
