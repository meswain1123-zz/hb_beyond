import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { 
  Character,
  CharacterSpell,
  Creature,
  SummonStatBlock,
  Potence,
  IStringNumHash,
  IStringHash,
  IStringAnyHash
} from "../../../models";

import SelectStringBox from '../../input/SelectStringBox';

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
  name: string;
  value: any;
  obj: Character;
  spell: CharacterSpell;
  potence: Potence;
  onChange: (selected: any) => void;
}

export interface State {
  selected_option: Creature | SummonStatBlock | null;
  loading: boolean;
  creatures: Creature[] | null;
}

class CharacterSummonTransformOptions extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selected_option: null,
      loading: false,
      creatures: null
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {
  }

  load() {
    this.setState({ loading: true }, () => {
      this.api.getSetOfObjects(["creature"]).then((res: any) => {
        this.setState({ 
          creatures: res.creature,
          loading: false 
        });
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
      const summon_options = this.props.potence.summon_options;
      const all_options: (Creature | SummonStatBlock)[] = [];
      const counts: IStringNumHash = {};
      summon_options.forEach(option => {
        if (option.custom) {
          if (option.custom_stat_block) {
            all_options.push(option.custom_stat_block);
            counts[option.custom_stat_block.true_id] = option.count;
          }
        } else if (option.specific) {
          if (this.state.creatures) {
            const obj_finder = this.state.creatures.filter(o => o._id === option.specific_id);
            if (obj_finder.length === 1) {
              if (counts[option.specific_id]) {
                if (option.count > +counts[option.specific_id]) {
                  counts[option.specific_id] = option.count;
                }
              } else {
                all_options.push(obj_finder[0]);
                counts[option.specific_id] = option.count;
              }
            }
          }
        } else {
          if (this.state.creatures) {
            const obj_finder = this.state.creatures.filter(o => 
              (o.challenge_rating <= option.challenge_rating) &&
              (option.creature_type === "Any" || o.creature_type === option.creature_type) &&
              (option.subtype === "Any" || o.subtype === option.subtype) &&
              (option.swimming || o.speed.swim === 0) &&
              (option.flying || o.speed.fly === 0) &&
              (option.size === "Any" || 
                option.size === "Gargantuan" ||
                (option.size === "Huge" && !["Gargantuan"].includes(o.size)) ||
                (option.size === "Large" && !["Huge","Gargantuan"].includes(o.size)) ||
                (option.size === "Medium" && ["Tiny","Small","Medium"].includes(o.size)) ||
                (option.size === "Small" && ["Tiny","Small"].includes(o.size)) ||
                (option.size === "Tiny" && "Tiny" === o.size)
              )
            );
            obj_finder.forEach(c => {
              if (counts[c._id]) {
                if (option.count > +counts[c._id]) {
                  counts[c._id] = option.count;
                }
              } else {
                all_options.push(c);
                counts[c._id] = option.count;
              }
            });
          }
        }
      });
      const good_map: IStringAnyHash = {};
      const option_map: IStringHash = {};
      all_options.forEach(c => {
        if (c instanceof Creature) {
          const count = counts[c._id];
          if (count) {
            option_map[c.name + (+count === 1 ? "" : ` x ${count}`)] = c._id;
            good_map[c._id] = {
              creature: c,
              count
            };
          }
        } else {
          const count = counts[c.true_id];
          if (count) {
            option_map[c.name + (+count === 1 ? "" : ` x ${count}`)] = c.true_id;
            good_map[c.true_id] = {
              summon: c,
              count
            };
          }
        }
      });
      return (
        <SelectStringBox 
          option_map={option_map}
          name={this.props.name}
          value={ this.props.value === null ? null : (this.props.value.creature ? this.props.value.creature._id : this.props.value.summon.true_id) }
          onChange={(value: string) => {
            this.props.onChange(good_map[value]);
          }}
        />
      );
    }
  }
}

export default connector(CharacterSummonTransformOptions);
