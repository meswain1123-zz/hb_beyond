import React, { Component } from "react";
import { connect, ConnectedProps } from 'react-redux';
import styled
// , { css } 
from "styled-components";
// import {
//   // Button, 
//   // Link
// } from "@material-ui/core";
// import { NavLink } from "react-router-dom";
import { 
   
} from "../models";
// import CreateCampaign from "../components/CreateCampaign";
import API from "../utilities/smart_api";
import { APIClass } from "../utilities/smart_api_class";


const HEADER_HEIGHT = 50;

const Heading = styled.div`
  background: dimgrey;
  color: white;
  height: ${HEADER_HEIGHT}px;
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

interface AppState {
  // tokens: Token[],
  // players: Player[],
  // selectedPlayMap: PlayMap,
  // selectedCampaign: Campaign
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  // tokens: state.app.tokens,
  // players: state.app.players,
  // selectedPlayMap: state.app.selectedPlayMap,
  // selectedCampaign: state.app.selectedCampaign
});

const mapDispatch = {
  // selectCampaign: (campaign: Campaign) => ({ type: 'SELECT_CAMPAIGN', payload: campaign }),
  // updateCampaign: (campaign: Campaign) => ({ type: 'UPDATE_CAMPAIGN', payload: campaign }),
  // selectPlayMap: (playMap: PlayMap) => ({ type: 'SELECT_PLAYMAP', payload: playMap }),
  // updatePlayMap: (playMap: PlayMap) => ({ type: 'UPDATE_PLAYMAP', payload: playMap })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
}
export interface State {
  // mode: string;
  // selectedToken_id: number;
  // hoveredToken_id: number;
  // deselecting: boolean;
  // lastRefresh: Date;
  // controlMode: string;
}
class DMPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // mode: "loadCampaign",
      // selectedToken_id: -1,
      // hoveredToken_id: -1,
      // deselecting: false,
      // lastRefresh: new Date(),
      // controlMode: "controls"
    };
    this.api = API.getInstance();
  }

  api: APIClass;

  componentDidMount() {}

  createCampaign = () => {
    this.setState({
      // mode: "createCampaign"
    })
  }

  loadCampaign = () => {
    this.setState({
      // mode: "loadCampaign"
    })
  }

  // saveCampaign = () => {
  //   this.api.updateCampaign(this.props.selectedCampaign.toDBObj()).then((res: any) => {
  //     const campaign = this.props.selectedCampaign;
  //     campaign.lastUpdate = res.lastUpdate;
  //     this.props.updateCampaign(campaign);
  //   });
  // }

  // selectCampaign = (campaign: Campaign) => {
  //   this.props.selectCampaign(campaign);
  //   if (campaign.selectedPlayMap_id === "") {
  //     this.setState({ mode: "loadPlayMap" });
  //   } else {
  //     this.setState({ mode: "main" });
  //   }
  // }

  // createPlayMap = () => {
  //   this.setState({
  //     mode: "createPlayMap"
  //   })
  // }

  // loadPlayMap = () => {
  //   this.setState({
  //     mode: "loadPlayMap"
  //   })
  // }

  // savePlayMap = () => {
  //   this.api.updatePlayMap(this.props.selectedPlayMap.toDBObj()).then((res: any) => {
  //     const newCampaign = this.props.selectedCampaign;
  //     newCampaign.lastUpdate = res.lastUpdate;
  //     this.props.updateCampaign(newCampaign);
  //   });
  // }

  // selectPlayMap = (playMap: PlayMap) => {
  //   this.props.selectPlayMap(playMap);
  //   this.setState({ mode: "main" });
  // }

  // useSelectedPlayMap = () => {
  //   const campaign: Campaign = this.props.selectedCampaign;
  //   campaign.selectedPlayMap_id = this.props.selectedPlayMap._id;
  //   this.api.updateCampaign(campaign.toDBObj()).then((res: any) => {
  //     campaign.lastUpdate = res.lastUpdate;
  //     this.props.updateCampaign(campaign);
  //     this.setState({ mode: "main" });
  //   });
  // }

  renderHeader = () => {
    return (
      <Heading key="heading"> 
        Homebrew Beyond - DM
        {/* <Button onClick={this.createCampaign}>Create Campaign</Button>
        <Button onClick={this.loadCampaign}>Load Campaign</Button>
        { this.renderControls() } */}
      </Heading>
    );
  };

  renderControls = () => {
    return (
      <div> 
        {/* { this.props.selectedCampaign && 
          <div>
            <Button onClick={this.createPlayMap}>Create PlayMap</Button>
            <Button onClick={this.loadPlayMap}>Load PlayMap</Button>
            <Button onClick={this.savePlayMap} disabled={this.props.selectedPlayMap === null}>Save PlayMap</Button>
            <Button onClick={this.useSelectedPlayMap} disabled={this.props.selectedPlayMap === null}>Use PlayMap</Button>
            <NavLink to={`/beyond/player/${this.props.selectedCampaign._id}`} target="_blank" style={{ color: "black" }}>
              Player Page
            </NavLink>
          </div>
        } */}
      </div>
    );
  };

  renderMain = () => {
    // if (this.state.mode === "loadCampaign") {
    //   return (
    //     <LoadCampaign key="main" mode="DM" selectCampaign={this.selectCampaign} />
    //   );
    // } else if (this.state.mode === "createCampaign") {
    //   return (
    //     <CreateCampaign key="main" selectCampaign={this.selectCampaign} />
    //   );
    // } else if (this.state.mode === "loadPlayMap") {
    //   return (
    //     <LoadPlayMap key="main" mode="DM" selectPlayMap={this.selectPlayMap} />
    //   );
    // } else if (this.state.mode === "createPlayMap") {
    //   return (
    //     <CreatePlayMap key="main" selectPlayMap={this.selectPlayMap} />
    //   );
    // } else {
    //   if (this.props.selectedPlayMap) {
    //     return (
    //       <DisplayPlayMap key="main" mode="DM" />
    //     );
    //   } else {
        return (
          <div key="main" style={{ margin: 10 }}>
            Load a Map to see it here
          </div>
        );
    //   }
    // }
  };

  render() {
    return [
      this.renderHeader(),
      this.renderMain()
    ];
  }
}

export default connector(DMPage);
