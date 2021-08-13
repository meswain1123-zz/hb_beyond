
import { ModelBase } from "./ModelBase";

export class Campaign extends ModelBase {
  static data_type: string = "campaign";

  owner_id: string;
  player_ids: string[];
  source_books: string[];
  blocked_races: string[];
  blocked_classes: string[];
  blocked_lineages: string[];
  allow_homebrew: boolean;
  custom_origins: boolean;
  optional_features: boolean;
  player_control_for_lineages: boolean;

  constructor(obj?: any) {
    super(obj);
    this.owner_id = obj ? obj.owner_id : "";
    this.player_ids = obj && obj.player_ids ? obj.player_ids : [];
    this.source_books = obj && obj.source_books ? obj.source_books : [];
    this.blocked_races = obj && obj.blocked_races ? obj.blocked_races : [];
    this.blocked_classes = obj && obj.blocked_classes ? obj.blocked_classes : [];
    this.blocked_lineages = obj && obj.blocked_lineages ? obj.blocked_lineages : [];
    this.allow_homebrew = obj && obj.allow_homebrew ? obj.allow_homebrew : false;
    this.custom_origins = obj && obj.custom_origins ? obj.custom_origins : false;
    this.optional_features = obj && obj.optional_features ? obj.optional_features : false;
    this.player_control_for_lineages = obj && obj.player_control_for_lineages ? obj.player_control_for_lineages : false;
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      source_type: this.source_type,
      source_id: this.source_id,
      owner_id: this.owner_id,
      player_ids: this.player_ids,
      source_books: this.source_books,
      allow_homebrew: this.allow_homebrew,
      custom_origins: this.custom_origins,
      optional_features: this.optional_features,
      player_control_for_lineages: this.player_control_for_lineages,
      blocked_races: this.blocked_races,
      blocked_classes: this.blocked_classes,
      blocked_lineages: this.blocked_lineages
    };
  }

  clone(): Campaign {
    return new Campaign(this);
  }

  copy(copyMe: Campaign): void {
    this._id = copyMe._id;
    this.name = copyMe.name;
    this.description = copyMe.description;
    this.source_type = copyMe.source_type;
    this.source_id = copyMe.source_id;
    this.owner_id = copyMe.owner_id;
    this.player_ids = copyMe.player_ids;
    this.source_books = copyMe.source_books;
    this.allow_homebrew = copyMe.allow_homebrew;
    this.custom_origins = copyMe.custom_origins;
    this.optional_features = copyMe.optional_features;
    this.player_control_for_lineages = copyMe.player_control_for_lineages;
    this.blocked_races = copyMe.blocked_races;
    this.blocked_classes = copyMe.blocked_classes;
    this.blocked_lineages = copyMe.blocked_lineages;
  }
}