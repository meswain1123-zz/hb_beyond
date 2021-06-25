import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Grid,
  Button
} from "@material-ui/core";

import StringBox from "./StringBox";


interface AppState {
}

interface RootState {
}

const mapState = (state: RootState) => ({
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  onParseAll: (parse_me: string) => void;
}

export interface State { 
  parse_string: string;
}

class StringToJSONBox extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      parse_string: ""
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <Grid container spacing={0} direction="column">
        <Grid item>
          <StringBox
            name="String"
            value={this.state.parse_string}
            onBlur={(parse_string: string) => {
              this.setState({ parse_string });
            }}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            disabled={ this.state.parse_string.length === 0 }
            onClick={ () => { 
              this.props.onParseAll(this.state.parse_string);
            }}>
            Parse All
          </Button>
        </Grid>
      </Grid>
    ); 
  }
}

export default connector(StringToJSONBox);
