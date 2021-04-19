import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid, 
  Drawer,
} from "@material-ui/core";

import { 
  Character,
  CharacterClass,
  CharacterFeatureBase,
  CharacterRace,
  CharacterSubRace,
  BaseItem,
  MagicItem,
  MagicItemKeyword,
  WeaponKeyword,
  ArmorType,
} from "../../../models";

import ToggleButtonBox from "../../input/ToggleButtonBox";

import CharacterFeatureBaseDetails from './CharacterFeatureBaseDetails';

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
  onChange: () => void;
}

export interface State {
  armor_types: ArmorType[] | null;
  weapon_keywords: WeaponKeyword[] | null;
  base_items: BaseItem[] | null;
  magic_items: MagicItem[] | null;
  magic_item_keywords: MagicItemKeyword[] | null;
  loading: boolean;
  reloading: boolean;
  drawer: string;
  search_string: string;
  view: string;
  edit_view: string;
  selected_item: CharacterFeatureBase | null;
  selected_source: CharacterRace | CharacterSubRace | CharacterClass | null;
}

class CharacterFeatures extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      armor_types: null,
      weapon_keywords: null,
      base_items: null,
      magic_items: null,
      magic_item_keywords: null,
      loading: false,
      reloading: false,
      drawer: "",
      search_string: "",
      view: "All",
      edit_view: "",
      selected_item: null,
      selected_source: null
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["armor_type","base_item","magic_item","magic_item_keyword","weapon_keyword"]).then((res: any) => {
        this.setState({ 
          armor_types: res.armor_type,
          weapon_keywords: res.weapon_keyword,
          base_items: res.base_item,
          magic_items: res.magic_item,
          magic_item_keywords: res.magic_item_keyword,
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.base_items === null) {
      this.load();
      return <span>Loading</span>;
    } else { 
      return (
        <Grid item container spacing={1} direction="column" 
          style={{
            border: "1px solid blue",
            borderRadius: "5px",
            fontSize: "11px"
          }}>
          <Grid item>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "bold"
              }}>
              <div>
                Features &amp; Traits
              </div>
            </div>
          </Grid>
          <Grid item>
            <div
              style={{
                display: "flex",
                justifyContent: "center"
              }}>
              <Grid container spacing={1} direction="row"
                style={{
                  width: "340px"
                }}>
                <Grid item xs={9} container spacing={1} direction="row">
                  <Grid item xs={2}>
                    <ToggleButtonBox 
                      name="All"
                      height={15}
                      lineHeight={1.5}
                      border=""
                      color="gray"
                      bold
                      value={this.state.view === "All"}
                      onToggle={() => {
                        this.setState({ view: "All" });
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <ToggleButtonBox 
                      name="Class Features"
                      height={15}
                      lineHeight={1.5}
                      border=""
                      color="gray"
                      bold
                      value={this.state.view === "Class"}
                      onToggle={() => {
                        this.setState({ view: "Class" });
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <ToggleButtonBox 
                      name="Racial Traits"
                      height={15}
                      lineHeight={1.5}
                      border=""
                      color="gray"
                      bold
                      value={this.state.view === "Racial"}
                      onToggle={() => {
                        this.setState({ view: "Racial" });
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <ToggleButtonBox 
                    name="Feats"
                    height={15}
                    lineHeight={1.5}
                    border=""
                    color="gray"
                    bold
                    value={this.state.view === "Feats"}
                    onToggle={() => {
                      this.setState({ view: "Feats" });
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          </Grid>
          { (this.state.view === "All" || this.state.view === "Class") &&
            this.renderClassFeatures()
          }
          { (this.state.view === "All" || this.state.view === "Racial") &&
            this.renderRacialFeatures()
          }
          { (this.state.view === "All" || this.state.view === "Feats") &&
            this.renderFeats()
          }
          
          <Drawer anchor="right" 
            open={ ["details","hp","subclass"].includes(this.state.drawer) } 
            onClose={() => {
              this.setState({ drawer: "" });
            }}>
            { this.state.selected_source &&
              <CharacterFeatureBaseDetails
                obj={this.props.obj}
                item={ this.state.drawer === "details" && this.state.selected_item ? this.state.selected_item : this.state.drawer }
                source={this.state.selected_source}
                onChange={() => {
                  this.setState({ reloading: true }, () => {
                    this.setState({ reloading: false });
                  });
                }}
                onClose={() => {
                  this.setState({ drawer: "", selected_item: null });
                }}
              />
            }
          </Drawer>
        </Grid>
      );
    }
  }

  renderClassFeatures() {
    if (this.props.obj instanceof Character) {
      return (
        <Grid item container spacing={1} direction="column">
          <Grid item 
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              color: "blue",
              borderBottom: "1px solid lightgray"
            }}>
            Class Features
          </Grid>
          { this.props.obj.classes.map((char_class, key) => {
            return (
              <Grid item key={key} container spacing={0} direction="column">
                <Grid item style={{ 
                  fontWeight: "bold", 
                  color: "blue" 
                }}>
                  { char_class.game_class && char_class.game_class.name } Features
                </Grid>
                <Grid item onClick={() => {
                  this.setState({ selected_source: char_class, drawer: "hp" });
                }}>
                  Hit Points
                </Grid>
                { char_class.game_class && char_class.game_class.subclass_level <= char_class.level &&
                  <Grid item onClick={() => {
                    this.setState({ selected_source: char_class, drawer: "subclass" });
                  }}>
                    { char_class.game_class.subclasses_called }
                  </Grid>
                }
                { this.renderFeaturesForClass(char_class) }
              </Grid>
            );  
          })}
        </Grid>
      );
    }
    return null;
  }

  renderFeaturesForClass(char_class: CharacterClass) {
    return char_class.class_features.map((char_feature, key) => {
      return (
        <Grid item key={key} onClick={() => {
          this.setState({ selected_source: char_class, selected_item: char_feature, drawer: "details" });
        }}>
          { char_feature.name }
        </Grid>
      );
    });
  }

  renderRacialFeatures() {
    return (
      <Grid item container spacing={0} direction="column">
        <Grid item
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "blue",
            borderBottom: "1px solid lightgray"
          }}>
          Racial Trais
        </Grid>
        { this.props.obj.race.features.map((char_feature, key) => {
          return (
            <Grid item key={key} onClick={() => {
              this.setState({ selected_source: this.props.obj.race, selected_item: char_feature, drawer: "details" });
            }}>
              { char_feature.name }
            </Grid>
          );
        })}
        { this.props.obj.race.subrace && this.props.obj.race.subrace.features.map((char_feature, key) => {
          return (
            <Grid item key={key} onClick={() => {
              this.setState({ selected_source: this.props.obj.race.subrace, selected_item: char_feature, drawer: "details" });
            }}>
              { char_feature.name }
            </Grid>
          );
        })}
      </Grid>
    );
  }

  renderFeats() {
    return (
      <Grid item container spacing={1} direction="column">
        <Grid item
          style={{
            fontSize: "12px",
            fontWeight: "bold",
            color: "blue",
            borderBottom: "1px solid lightgray"
          }}>
          Feats
        </Grid>
        { this.props.obj.feats.map((feat, key) => {
          return (
            <Grid item key={key}>
              { feat.feat && feat.feat.name }
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

export default connector(CharacterFeatures);
