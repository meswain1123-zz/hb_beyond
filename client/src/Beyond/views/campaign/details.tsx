import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Redirect } from "react-router-dom";

import {
  Grid, 
  Snackbar,
} from "@material-ui/core";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { 
  Campaign, 
  SourceBook,
  User, 
  Character,
  Race, 
  GameClass, 
  Lineage
} from "../../models";

import ObjectDetails from "../../components/model_inputs/ObjectDetails";
import CheckBox from "../../components/input/CheckBox";
import CenteredMenu from "../../components/input/CenteredMenu";
import ButtonBox from '../../components/input/ButtonBox';

import API from "../../utilities/smart_api";
import { APIClass } from "../../utilities/smart_api_class";
import CharacterUtilities from "../../utilities/character_utilities";
import { CharacterUtilitiesClass } from "../../utilities/character_utilities_class";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


interface AppState {
  loginUser: User | null;
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
  loginUser: state.app.loginUser,
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
  obj: Campaign;
  mode: string;
  source_books: SourceBook[];
  races: Race[];
  game_classes: GameClass[];
  lineages: Lineage[];
  players: User[];
  characters: Character[];
  my_characters: Character[];
  loading: boolean;
  logging_in: boolean;
  processing: boolean;
  message: string;
  add_existing: boolean;
}

class CampaignDetails extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      redirectTo: null,
      obj: new Campaign(),
      mode: "Characters", // "Players", // 
      source_books: [],
      races: [],
      game_classes: [],
      players: [],
      characters: [],
      my_characters: [],
      lineages: [],
      loading: false,
      logging_in: false,
      processing: false,
      message: "",
      add_existing: false
    };
    this.api = API.getInstance();
    this.char_util = CharacterUtilities.getInstance();
  }

  api: APIClass;
  char_util: CharacterUtilitiesClass;

  componentDidMount() {
    if (this.props.loginUser === null) {
      const userObjStr = localStorage.getItem("loginUser");
      if (!userObjStr) {
        this.setState({ redirectTo: "/beyond" });
      } else {
        this.setState({ logging_in: true }, this.check_login);
      }
    } else {
      this.load();
    }
  }

  check_login() {
    setTimeout(() => {
      if (this.props.loginUser === null) {
        this.check_login();
      } else {
        this.setState({ logging_in: false }, this.load);
      }
    }, 1000);
  }

  // Loads the editing Campaign into state
  load_object(id: string) {
    this.api.getFullObject("campaign", id).then((res: any) => {
      if (res) {
        const obj = res as Campaign;
        if (obj.player_ids.length > 0) {
          const filter: any = {};
          
          filter.ids = obj.player_ids;
          this.api.getObjects("user", filter).then((res: any) => {
            if (res && !res.error) {
              this.setState({ players: res, obj }, this.load_characters);
            }
          });
        } else {
          this.setState({ obj }, this.load_characters);
        }
      }
    });
  }

  load_characters() {
    const filter: any = {};
    
    filter.campaign_id = this.state.obj._id;
    this.api.getObjects("character", filter).then((res: any) => {
      if (res && !res.error) {
        this.setState({ characters: res, loading: false });
      }
    });
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["source_book","race","game_class","lineage"]).then((res: any) => {
        let { id } = this.props.match.params;
        if (id !== undefined && this.state.obj._id !== id) {
          this.setState({ 
            source_books: res.source_book,
            races: res.race,
            game_classes: res.game_class,
            lineages: res.lineage
          }, () => {
            this.load_object(id);
          }); 
        } else {
          this.setState({ 
            source_books: res.source_book,
            races: res.race,
            game_classes: res.game_class,
            lineages: res.lineage, 
            loading: false 
          });
        }
      });
    });
  }

  handleClose() {
    this.setState({ message: "" });
  }

  remove_characters_for_user(user_id: string) {
    const characters_for_user = this.state.characters.filter(o => o.owner_id);
    if (characters_for_user.length > 0) {
      const char = characters_for_user[0];
      char.campaign_id = "";
      this.api.updateObject("character", char).then((res: any) => {
        const characters = this.state.characters.filter(o => o.campaign_id === this.state.obj._id);
        this.setState({ characters }, () => {
          this.remove_characters_for_user(user_id);
        });
      });
    } else if (this.props.loginUser && this.props.loginUser._id === user_id) {
      this.setState({ redirectTo: `/beyond/campaign` });
    } else {
      this.setState({ processing: false });
    }
  }

  render() {
    if (this.state.loading || this.props.loginUser === null || this.state.obj === null) {
      return <span>Loading</span>;
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else { 
      const formHeight = this.props.height - (this.props.width > 600 ? 228 : 228);
      let tabs = ["Characters","Sources","Races","Classes"];
      if (this.state.obj.source_books.includes("60d9e2ff909a1d2014235f15")) {
        tabs.push("Lineages");
      }
      if (this.props.loginUser && this.state.obj.owner_id === this.props.loginUser._id) {
        tabs.push("Players");
      }
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <ObjectDetails 
              obj={this.state.obj}
              data_type="campaign"
              type_label="Campaigns"
            />
          </Grid>
          <Grid item>
            <CenteredMenu
              options={tabs}
              selected={this.state.mode}
              onSelect={(mode: string) => {
                this.setState({ mode });
              }}
            />
          </Grid>
          <Grid item 
            style={{ 
              height: `${formHeight}px`, 
              overflowY: "scroll", 
              overflowX: "hidden" 
            }}>
              { this.render_tab() }
          </Grid>
        </Grid>
      );
    }
  }

  render_tab() {
    let return_me = <Grid item>Coming Soon</Grid>;
    if (this.state.mode === "Players") {
      return_me = (
        <Grid container spacing={0} direction="row">
          <Grid item xs={6}>
            <ButtonBox name="Reusable Invitation Link" 
              onClick={() => {
                const invite = this.state.obj.reusable_invite;
                navigator.clipboard.writeText(`${window.location.origin}/beyond/campaign/join/${this.state.obj._id}/${invite}`);
                this.setState({ message: "Link Copied to Clipboard" });
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <ButtonBox name="Generate Single Use Invitation Link" 
              disabled={this.state.processing}
              onClick={() => {
                const obj = this.state.obj;
                const invite = obj.generate_invite();
                navigator.clipboard.writeText(`${window.location.origin}/beyond/campaign/join/${this.state.obj._id}/${invite}`);
                this.setState({ processing: true }, () => {
                  this.api.updateObject("campaign", obj).then((res: any) => {
                    this.setState({ 
                      obj, 
                      processing: false, 
                      message: "Link Copied to Clipboard" 
                    });
                  });
                });
              }}
            />
          </Grid>
          <Snackbar 
            open={ this.state.message !== "" } 
            autoHideDuration={6000} 
            onClose={this.handleClose}>
            <Alert onClose={this.handleClose} severity="success">
              { this.state.message }
            </Alert>
          </Snackbar>
          { this.state.players.map((player, key) => {
            return (
              <Grid item xs={12} key={key} container spacing={0} direction="row">
                <Grid item xs={6}>
                  { player.username }
                </Grid> 
                { this.props.loginUser && this.state.obj.owner_id === this.props.loginUser._id ?
                  <Grid item xs={6}>
                    <ButtonBox 
                      name="Remove Player"
                      onClick={() => {
                        this.setState({ processing: true }, () => {
                          const obj = this.state.obj;
                          obj.player_ids = obj.player_ids.filter(o => o !== player._id);
                          this.api.updateObject("campaign", obj).then((res: any) => {
                            this.remove_characters_for_user(player._id);
                          });
                        });
                      }}
                    />
                  </Grid> 
                : this.props.loginUser && player._id === this.props.loginUser._id &&
                  <Grid item xs={6}>
                    <ButtonBox 
                      name="Leave Campaign"
                      lineHeight={1.1}
                      onClick={() => {
                        this.setState({ processing: true }, () => {
                          const obj = this.state.obj;
                          obj.player_ids = obj.player_ids.filter(o => o !== player._id);
                          this.api.updateObject("campaign", obj).then((res: any) => {
                            this.remove_characters_for_user(player._id);
                          });
                        });
                      }}
                    />
                  </Grid> 
                }
              </Grid>
            );
          })}
        </Grid>
      ); 
    } else if (this.state.mode === "Characters") {
      if (this.state.add_existing) {
        return_me = (
          <Grid container spacing={1} direction="column">
            <Grid item>
              Adding an existing character which doesn't comply with the allowed options for this campaign will automatically undo those options on the character.<br/>
              This may include race, subrace, class, subclass, lineages, items, and spells.
            </Grid>
            <Grid item container spacing={1} direction="row">
              { this.state.my_characters.map((char, key) => {
                return (
                  <Grid item xs={4} key={key} container spacing={0} direction="row">
                    <Grid item xs={12}>{ char.name }</Grid>
                    { char.campaign_id === this.state.obj._id ? 
                      <Grid item xs={12}>Already in Campaign</Grid>
                    : char.campaign_id === "" ? 
                      <Grid item xs={12}>
                        <ButtonBox name="Join" 
                          onClick={() => {
                            char.campaign_id = this.state.obj._id;
                            char.connect_campaign(this.state.obj);
                            this.char_util.enforce_options(char, this.state.obj);
                            this.api.updateObject("character", char).then((res: any) => {
                              const characters = this.state.characters;
                              characters.push(char);
                              this.setState({ add_existing: false, characters });
                            });
                          }}
                        />
                      </Grid>
                    : 
                      <Grid item xs={12}>In a Different Campaign</Grid>
                    }
                  </Grid>
                );
              })}
            </Grid>
            <Grid item>
              <ButtonBox name="Cancel" 
                onClick={() => {
                  this.setState({ add_existing: false });
                }}
              />
            </Grid>
          </Grid>
        );
      } else {
        return_me = (
          <Grid container spacing={1} direction="row">
            { this.props.loginUser && 
              <Grid item xs={12} container spacing={1} direction="row">
                <Grid item xs={4}>
                  <ButtonBox name="Add Existing Character" 
                    onClick={() => {
                      if (this.state.my_characters.length > 0) {
                        this.setState({ 
                          add_existing: true
                        });
                      } else {
                        this.setState({ loading: true }, () => {
                          if (this.props.loginUser) {
                            const filter: any = {};
                          
                            filter.owner_id = this.props.loginUser._id;
                            this.api.getFullObjects("character", filter).then((res: any) => {
                              if (res && !res.error) {
                                this.setState({ 
                                  my_characters: res, 
                                  loading: false, 
                                  add_existing: true 
                                });
                              }
                            });
                          }
                        });
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <ButtonBox name="Create Character" 
                    onClick={() => {
                      this.setState({ redirectTo:`/beyond/character/create_on_campaign/${this.state.obj._id}/0` });
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <ButtonBox name="Create Unassigned Character" 
                    onClick={() => {
                      this.setState({ redirectTo:`/beyond/character/create_on_campaign/${this.state.obj._id}/1` });
                    }}
                  />
                </Grid>
              </Grid>
            }
            { this.state.characters.map((char, key) => {
              if (this.props.loginUser && (this.state.obj.owner_id === this.props.loginUser._id || this.state.obj.player_ids.includes(this.props.loginUser._id))) {
                if (char.owner_id === "") {
                  return (
                    <Grid item xs={4} key={key} container spacing={0} direction="row">
                      <Grid item xs={12}>{ char.name }</Grid>
                      <Grid item xs={4}>
                        <ButtonBox name="View" 
                          onClick={() => {
                            this.setState({ redirectTo:`/beyond/character/details/${char._id}` });
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ButtonBox name="Edit" 
                          onClick={() => {
                            this.setState({ redirectTo:`/beyond/character/edit/${char._id}` });
                          }}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <ButtonBox name="Claim" 
                          onClick={() => {
                            if (this.props.loginUser) {
                              char.owner_id = this.props.loginUser._id;
                              this.api.updateObject("character", char).then((res: any) => {
                                this.setState({ });
                              });
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  );
                } else if (this.props.loginUser._id === char.owner_id || this.props.loginUser._id === this.state.obj.owner_id) {
                  return (
                    <Grid item xs={4} key={key} container spacing={0} direction="row">
                      <Grid item xs={12}>{ char.name }</Grid>
                      <Grid item xs={3}>
                        <ButtonBox name="View" 
                          onClick={() => {
                            this.setState({ redirectTo:`/beyond/character/details/${char._id}` });
                          }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <ButtonBox name="Edit" 
                          onClick={() => {
                            this.setState({ redirectTo:`/beyond/character/edit/${char._id}` });
                          }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <ButtonBox name="Unassign" 
                          onClick={() => {
                            char.owner_id = "";
                            this.api.updateObject("character", char).then((res: any) => {
                              this.setState({ });
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <ButtonBox 
                          name="Leave Campaign" 
                          lineHeight={1.1}
                          onClick={() => {
                            char.campaign_id = "";
                            this.api.updateObject("character", char).then((res: any) => {
                              const characters = this.state.characters.filter(o => o.campaign_id === this.state.obj._id);
                              this.setState({ characters });
                            });
                          }}
                        />
                      </Grid>
                    </Grid>
                  );
                } else {
                  return (
                    <Grid item xs={4} key={key} container spacing={0} direction="row">
                      <Grid item xs={12}>{ char.name }</Grid>
                      <Grid item xs={12}>
                        <ButtonBox name="View" 
                          onClick={() => {
                            this.setState({ redirectTo:`/beyond/character/details/${char._id}` });
                          }}
                        />
                      </Grid>
                    </Grid>
                  );
                }
              } else {
                return (
                  <Grid item xs={4} key={key} container spacing={0} direction="row">
                    <Grid item xs={12}>{ char.name }</Grid>
                  </Grid>
                );
              }
            })}
          </Grid>
        ); 
      }
    } else if (this.state.mode === "Sources") {
      return_me = (
        <Grid container spacing={1} direction="row">
          <Grid item xs={4}>
            <CheckBox 
              name="Custom Origins"
              value={this.state.obj.custom_origins} 
              disabled
              onChange={(value: boolean) => {
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <CheckBox 
              name="Optional Features"
              value={this.state.obj.optional_features}  
              disabled
              onChange={(value: boolean) => {
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <CheckBox 
              name="Homebrew Content"
              value={this.state.obj.allow_homebrew}  
              disabled
              onChange={(value: boolean) => {
              }}
            />
          </Grid>
          { this.state.source_books.map((book, key) => {
            return (
              <Grid item xs={4} key={key}>
                <CheckBox 
                  name={`${book.abbreviation} Content`}
                  value={this.state.obj.source_books.includes(book._id)}   
                  disabled
                  onChange={(value: boolean) => {
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ); 
    } else if (this.state.mode === "Races") {
      return_me = (
        <Grid container spacing={1} direction="row">
          { this.state.races.map((race, key) => {
            return (
              <Grid item xs={4} key={key}>
                <CheckBox 
                  name={race.name}
                  value={!this.state.obj.blocked_races.includes(race._id)}   
                  disabled
                  onChange={(value: boolean) => {
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ); 
    } else if (this.state.mode === "Classes") {
      return_me = (
        <Grid container spacing={1} direction="row">
          { this.state.game_classes.map((game_class, key) => {
            return (
              <Grid item xs={4} key={key}>
                <CheckBox 
                  name={game_class.name}
                  value={!this.state.obj.blocked_classes.includes(game_class._id)}   
                  disabled
                  onChange={(value: boolean) => {
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ); 
    } else if (this.state.mode === "Lineages") {
      return_me = (
        <Grid container spacing={1} direction="row">
          <Grid item xs={12}>
            <CheckBox 
              name="Allow Players to Control Their Lineages"
              value={this.state.obj.player_control_for_lineages}   
              disabled
              onChange={(value: boolean) => {
              }}
            />
          </Grid>
          { this.state.lineages.map((lineage, key) => {
            return (
              <Grid item xs={4} key={key}>
                <CheckBox 
                  name={lineage.name}
                  value={!this.state.obj.blocked_lineages.includes(lineage._id)}   
                  disabled
                  onChange={(value: boolean) => {
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ); 
    }
    return return_me;
  }
}

export default connector(CampaignDetails);
