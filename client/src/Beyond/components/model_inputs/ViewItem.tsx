import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  FontDownload
} from "@material-ui/icons";
import {
  Grid, 
} from "@material-ui/core";

import { 
  CharacterItem,
  BaseItem,
  MagicItem
} from "../../models";


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
  item: BaseItem | MagicItem | CharacterItem;
}

export interface State {
}

class ViewItem extends Component<Props, State> {
  componentDidMount() {
  }

  get_detail(item: BaseItem) {
    let detail = "";
    if (item.item_type === "Armor") {
      detail = item.armor_type_name;
    } else if (item.item_type === "Weapon") {
      item.weapon_keyword_names.forEach(wk => {
        if (detail.length > 0) {
          detail += ", ";
        }
        detail += wk;
      });
    }
    return detail;
  }

  render() {
    const item = this.props.item;
    let detail = "";
    let show_attunement_icon = false;
    if (item instanceof CharacterItem) {
      show_attunement_icon = item.attuned;
      if (item.base_item) {
        detail = this.get_detail(item.base_item);
        if (item.name !== item.base_item.name) {
          if (detail !== "") {
            detail += " - ";
          }
          detail += item.base_item.name;
        }
      }
    } else if (item instanceof MagicItem) {
      show_attunement_icon = item.attunement;
      if (item.base_item) {
        detail = this.get_detail(item.base_item);
        detail += ` - ${ item.base_item.name }`;
      }
    } else if (item instanceof BaseItem) {
      detail = this.get_detail(item);
    }
    return [
      <Grid item key={0}>
        { item.name } { show_attunement_icon && <FontDownload fontSize="inherit" /> }
      </Grid>,
      <Grid item key={1} style={{ 
        lineHeight: "1.1",
        fontSize: "10px",
        color: "gray"
      }}>
        { detail }
      </Grid>
    ];
  }
}

export default connector(ViewItem);
