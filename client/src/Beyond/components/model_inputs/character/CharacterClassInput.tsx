import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import {
  Grid, Button, Link, Tooltip
} from "@material-ui/core";
import {
  Close
} from "@material-ui/icons";

import { 
  Race, 
  Subrace,
  Character,
  CharacterClass,
  CharacterFeature,
  CharacterFeatureBase,
  GameClass,
  Subclass,
  FeatureBase,
  Feature,
} from "../../../models";

import StringBox from "../../input/StringBox";
import SelectStringBox from "../../input/SelectStringBox"; 
import CharacterFeatureBasesInput from "./CharacterFeatureBases";

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
  onChange: (changed: Character) => void;
}

export interface State {
  game_classes: GameClass[] | null;
  subclasses: Subclass[] | null;
  races: Race[] | null;
  subraces: Subrace[] | null;
  search_string: string;
  page_num: number;
  start_letter: string;
  new_class: boolean;
  loading: boolean;
  expanded_class_id: string;
  expanded_feature_base_id: string;
}

class CharacterClassInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      game_classes: null,
      subclasses: null,
      races: null,
      subraces: null,
      search_string: "",
      page_num: 0,
      start_letter: "",
      new_class: false,
      loading: false,
      expanded_class_id: "",
      expanded_feature_base_id: ""
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
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
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["game_class","subclass"]).then((res: any) => {
        const obj = this.props.obj;
        const game_classes: GameClass[] = res.game_class;
        const subclasses: Subclass[] = res.subclass;
        obj.classes.forEach(char_class => {
          if (!char_class.game_class) {
            const objFinder = game_classes.filter(o => o._id === char_class.game_class_id);
            if (objFinder.length === 1) {
              char_class.connectGameClass(objFinder[0]);
            }
          }
          if (char_class.subclass_id !== "" && !char_class.subclass) {
            const objFinder = subclasses.filter(o => o._id === char_class.subclass_id);
            if (objFinder.length === 1) {
              char_class.connectSubclass(objFinder[0]);
            }
          }
        });
        this.props.onChange(obj);
        this.setState({ 
          expanded_class_id: (obj.classes.length === 1 ? obj.classes[0].game_class_id : ""),
          game_classes, 
          subclasses,
          loading: false 
        });
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <span>Loading</span>;
    } else if (this.state.game_classes === null) {
      this.load();
      return <span>Loading</span>;
    } else if (this.props.obj.classes.length === 0 || this.state.new_class) {
      const page_size = 7;
      const filtered: any[] = this.state.game_classes ? this.state.game_classes.filter(o => 
        (this.state.start_letter === "" || 
          o.name.toUpperCase().startsWith(this.state.start_letter)) && 
        (this.state.search_string === "" || 
          o.name.toLowerCase().includes(this.state.search_string.toLowerCase()) || 
          o.description.toLowerCase().includes(this.state.search_string.toLowerCase()))
        ).sort((a,b) => {return a.name.localeCompare(b.name)}) : [];
      const page_count = Math.ceil(filtered.length / page_size);
      const filtered_and_paged: any[] = filtered.slice(page_size * this.state.page_num, page_size * (this.state.page_num + 1));
      return (
        <Grid container spacing={1} direction="column">
          <Grid item container spacing={1} direction="row">
            <Grid item xs={3}>
              <span className={"MuiTypography-root MuiListItemText-primary header"}>
                Classes
              </span>
            </Grid>
            <Grid item xs={ this.state.new_class ? 6 : 9 }>
              <StringBox
                name="Search"
                value={`${this.state.search_string}`}
                onBlur={(search_string: string) => {
                  this.setState({ search_string });
                }}
              />
            </Grid>
            { this.state.new_class && 
              <Grid item xs={3}>
                <Button variant="contained" color="primary"
                  onClick={() => {
                    this.setState({ new_class: false });
                  }}>
                  Cancel Add
                </Button>
              </Grid>
            }
          </Grid>
          <Grid item>
            <Grid container spacing={1} direction="column">
              { filtered_and_paged.map((o, key) => {
                return this.renderGameClass(o,key);
              }) }
              <Grid item>
                { this.renderPageLinks(page_count) }
              </Grid>
              <Grid item>
                { this.renderLetterLinks() }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item className={"MuiTypography-root MuiListItemText-primary header"}>
            Character Level { this.props.obj.character_level }
          </Grid>
          <Grid item>
            Max Hit Points: { this.props.obj.max_hit_points }
          </Grid>
          <Grid item>
            Hit Dice: { this.props.obj.hit_dice_string() }
          </Grid>
          { this.renderCharClasses() }
          <Grid item>
            <Link href="#" 
              onClick={(event: React.SyntheticEvent) => {
                event.preventDefault();
                this.setState({ new_class: true });
              }}>
              + Add Another Class
            </Link>
          </Grid>
        </Grid>
      );
    }
  }

  renderCharClasses() {
    return (
      <Grid item container spacing={1} direction="column">
        { this.props.obj.classes.map((char_class, key) => {
          let other_class_levels = this.props.obj.character_level - char_class.level;
          const class_levels: string[] = [];
          for (let i = 1; i <= (20 - other_class_levels); ++i) {
            class_levels.push(`${i}`);
          }
          if (char_class.game_class) {
            return (
              <Grid item key={key} container spacing={1} direction="row">
                <Grid item xs={9}>
                  <span className={"MuiTypography-root MuiListItemText-primary header"}>
                    { char_class.game_class.name }
                  </span>
                </Grid>
                <Grid item xs={3} container spacing={1} direction="row">
                  <Grid item xs={10}>
                    <SelectStringBox 
                      name="Level"
                      options={class_levels}
                      value={`${char_class.level}`}
                      onChange={(value: string) => {
                        const level: number = +value;
                        if (level < char_class.level) {
                          char_class.class_features = char_class.class_features.filter(o => o.feature_base && o.feature_base.level <= level);
                          if (char_class.subclass) {
                            char_class.subclass_features = char_class.subclass_features.filter(o => o.feature_base && o.feature_base.level <= level);
                          }
                        } else if (char_class.game_class) {
                          char_class.copyGameClass(char_class.game_class, level);
                          if (char_class.subclass) {
                            char_class.copySubclass(char_class.subclass, level);
                          }
                        }
                        char_class.level = level;
                        const obj = this.props.obj;
                        this.props.onChange(obj);
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Close style={{ cursor: "pointer" }}
                      onClick={() => {
                        const obj = this.props.obj;
                        obj.classes = obj.classes.filter(o => o.game_class_id !== char_class.game_class_id);
                        obj.classes.filter(o => o.position > char_class.position).forEach(cc => {
                          cc.position--;
                          if (cc.position === 0) {
                            cc.fixWithGameClass();
                          }
                        });
                        obj.spells = obj.spells.filter(o => o.source_type !== "Class" || o.source_id !== char_class.game_class_id);
                        this.props.onChange(obj);
                        this.setState({ new_class: false });
                      }} 
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Link href="#" 
                    onClick={(event: React.SyntheticEvent) => {
                      event.preventDefault();
                      this.setState({ expanded_class_id: (this.state.expanded_class_id === char_class.game_class_id ? "" : char_class.game_class_id) });
                    }}>
                    { this.state.expanded_class_id === char_class.game_class_id ? "Hide" : "Show" } Class Features
                  </Link>
                </Grid>
                { this.renderCharClassFeatures(char_class) }
              </Grid>
            );
          } else {
            return (<span key={key}></span>);
          }
        })}
      </Grid>
    )
  }

  renderCharClassFeatures(char_class: CharacterClass) {
    if (char_class.game_class && this.state.expanded_class_id === char_class.game_class_id) {
      const combined_features = [...char_class.class_features,...char_class.subclass_features];
      if (char_class.level >= char_class.game_class.subclass_level) {
        const subclass_choice = new CharacterFeatureBase();
        subclass_choice.true_id = "Subclass";
        subclass_choice.feature_base = new FeatureBase();
        subclass_choice.feature_base.level = char_class.game_class.subclass_level;
        subclass_choice.feature_base.name = char_class.game_class.subclasses_called;
        subclass_choice.needs_attention = char_class.subclass_id === "";
        if (this.state.subclasses) {
          const subclass_feature = new CharacterFeature();
          subclass_feature.name = char_class.game_class.subclasses_called;
          subclass_feature.feature_type = "Subclass";
          subclass_feature.feature = new Feature();
          subclass_feature.feature.name = char_class.game_class.subclasses_called;
          subclass_feature.feature.feature_type = "Subclass";
          subclass_feature.feature_options = [char_class.game_class_id, char_class.subclass_id];
          subclass_choice.features.push(subclass_feature);
        }
        combined_features.push(subclass_choice);
      }
      return (
        <CharacterFeatureBasesInput 
          character={this.props.obj}
          features={combined_features.sort((a, b) => (a.feature_base && b.feature_base && a.feature_base.level > b.feature_base.level) ? 1 : -1)}
          onChange={() => {
            this.props.onChange(this.props.obj);
          }}
        />
      );
    }
    return null;
  }

  renderGameClass(game_class: GameClass, key: number) {
    let disabled = false;
    let reasons = "";
    if (this.state.new_class) {
      // Check if they already have the class
      const obj = this.props.obj;
      if (obj.classes.filter(o => o.game_class_id === game_class._id).length === 1) {
        disabled = true;
      } else {
        // Need to check all the char_classes' primary and secondary abilities
        // As well as the game_class's
        // I should also check these if the ability_scores are being modified
        obj.classes.forEach(char_class => {
          if (char_class.game_class) {
            let reason = "";
            if (char_class.game_class.primary_ability.length === 3) {
              const score = obj.current_ability_scores.getAbilityScore(char_class.game_class.primary_ability);
              if (score && score < 13) {
                disabled = true;
                reason = `Prerequisites not met: ${char_class.game_class.primary_ability} 13 (${score})`;
              }
            } else if (char_class.game_class.primary_ability.length > 3) {
              const score1 = obj.current_ability_scores.getAbilityScore(char_class.game_class.primary_ability.substring(0,3));
              const score2 = obj.current_ability_scores.getAbilityScore(char_class.game_class.primary_ability.substring(7,3));
              
              if ((score1 && score1 < 13) && (score2 && score2 < 13)) {
                disabled = true;
                reason = `Prerequisites not met: ${char_class.game_class.primary_ability.substring(0,3)} 13 (${score1}) or ${char_class.game_class.primary_ability.substring(7,3)} 13 (${score2})`;
              }
            }
            if (char_class.game_class.secondary_ability.length === 3) {
              const score = obj.current_ability_scores.getAbilityScore(char_class.game_class.secondary_ability);
              if (score && score < 13) {
                disabled = true;
                if (reason === "") {
                  reason = `Prerequisites not met: `;
                } else {
                  reason += `, `;
                }
                reason += `${char_class.game_class.secondary_ability} 13 (${score})`;
              }
            } else if (char_class.game_class.secondary_ability.length > 3) {
              const score1 = obj.current_ability_scores.getAbilityScore(char_class.game_class.secondary_ability.substring(0,3));
              const score2 = obj.current_ability_scores.getAbilityScore(char_class.game_class.secondary_ability.substring(7,3));
              
              if ((score1 && score1 < 13) && (score2 && score2 < 13)) {
                disabled = true;
                if (reason === "") {
                  reason = `Prerequisites not met: `;
                } else {
                  reason += `, `;
                }
                reason += `${char_class.game_class.secondary_ability.substring(0,3)} 13 (${score1}) or ${char_class.game_class.secondary_ability.substring(7,3)} 13 (${score2})`;
              }
            }
            if (reason !== "") {
              reason += ` from ${char_class.game_class.name}\n`;
              reasons += reason;
            }
          }
        });
        let reason2 = "";
        if (game_class.primary_ability.length === 3) {
          const score = obj.current_ability_scores.getAbilityScore(game_class.primary_ability);
          if (score && score < 13) {
            disabled = true;
            reason2 = `Prerequisites not met: ${game_class.primary_ability} 13 (${score})`;
          }
        } else if (game_class.primary_ability.length > 3) {
          const score1 = obj.current_ability_scores.getAbilityScore(game_class.primary_ability.substring(0,3));
          const score2 = obj.current_ability_scores.getAbilityScore(game_class.primary_ability.substring(7,3));
          
          if ((score1 && score1 < 13) && (score2 && score2 < 13)) {
            disabled = true;
            reason2 = `Prerequisites not met: ${game_class.primary_ability.substring(0,3)} 13 (${score1}) or ${game_class.primary_ability.substring(7,3)} 13 (${score2})`;
          }
        }
        if (game_class.secondary_ability.length === 3) {
          const score = obj.current_ability_scores.getAbilityScore(game_class.secondary_ability);
          if (score && score < 13) {
            disabled = true;
            if (reason2 === "") {
              reason2 = `Prerequisites not met: `;
            } else {
              reason2 += `, `;
            }
            reason2 += `${game_class.secondary_ability} 13 (${score})`;
          }
        } else if (game_class.secondary_ability.length > 3) {
          const score1 = obj.current_ability_scores.getAbilityScore(game_class.secondary_ability.substring(0,3));
          const score2 = obj.current_ability_scores.getAbilityScore(game_class.secondary_ability.substring(7,3));
          
          if ((score1 && score1 < 13) && (score2 && score2 < 13)) {
            disabled = true;
            if (reason2 === "") {
              reason2 = `Prerequisites not met: `;
            } else {
              reason2 += `, `;
            }
            reason2 += `${game_class.secondary_ability.substring(0,3)} 13 (${score1}) or ${game_class.secondary_ability.substring(7,3)} 13 (${score2})`;
          }
        }
        if (reason2 !== "") {
          reason2 += ` from ${game_class.name}\n`;
          reasons += reason2;
        }
      }
    }
    return (
      <Grid key={key} item container spacing={1} direction="row">
        <Grid item xs={3}>
          { disabled ? 
            <Button 
              fullWidth variant="contained" color="primary" 
              disabled={disabled}
              onClick={ () => {
                const obj = this.props.obj;
                const char_class = new CharacterClass();
                char_class.position = obj.classes.length;
                char_class.copyGameClass(game_class, 1);
                char_class.level = 1;
                obj.classes.push(char_class);
                
                this.props.onChange(obj);
                this.setState({ new_class: false, expanded_class_id: game_class._id });
              }}>
              {game_class.name}
              <div 
                style={{
                  fontSize: "8px",
                  color: "red"
                }}> 
                { disabled ? reasons : "" }
              </div>
            </Button>
            : 
            <Tooltip title={`Select ${game_class.name}`}>
              <Button 
                fullWidth variant="contained" color="primary" 
                onClick={ () => {
                  const obj = this.props.obj;
                  const char_class = new CharacterClass();
                  char_class.position = obj.classes.length;
                  char_class.copyGameClass(game_class, 1);
                  char_class.level = 1;
                  obj.classes.push(char_class);
                  
                  this.props.onChange(obj);
                  this.setState({ new_class: false, expanded_class_id: game_class._id });
                }}>
                {game_class.name}
                <div 
                  style={{
                    fontSize: "8px",
                    color: "red"
                  }}> 
                  { disabled ? reasons : "" }
                </div>
              </Button>
            </Tooltip>
          }
        </Grid>
        <Grid item xs={9}>
          { this.renderDescription(game_class) }
        </Grid>
      </Grid>
    );
  }

  renderDescription(game_class: GameClass) {
    return (
      <Tooltip title={game_class.description}>
        <div style={this.descriptionStyle()}>
          { game_class.description }
        </div>
      </Tooltip>
    );
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
          this.setState({ page_num: 0 });
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
            this.setState({ page_num: i });
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
          this.setState({ page_num: page_count - 1 });
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

  renderLetterLinks() {
    const return_us: any[] = [];
    const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let key = 0;
    alphabet.forEach(a => {
      return_us.push(
        <Link key={key} href="#" onClick={(event: React.SyntheticEvent) => {
          event.preventDefault();
          this.setState({ start_letter: a });
          }}>
          {a}
        </Link>
      );
      key++;
      return_us.push(<span key={key}>&nbsp;</span>);
      key++;
    });
    return_us.push(
      <Link key={key} href="#" onClick={(event: React.SyntheticEvent) => {
        event.preventDefault();
        this.setState({ start_letter: "" });
        }}>
        Clear
      </Link>
    );
    key++;
    return_us.push(<span key={key}>&nbsp;</span>);

    return return_us;
  }
}

export default connector(CharacterClassInput);
