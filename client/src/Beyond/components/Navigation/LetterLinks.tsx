import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Link
} from "@material-ui/core";

interface AppState {
  height: number;
  width: number;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  height: state.app.height,
  width: state.app.width
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & { 
  onChange: (letter: string) => void;
}

export interface State {}

class LetterLinks extends Component<Props, State> {
  componentDidMount() {
  }

  render() {
    const return_us: any[] = [];
    const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    let key = 0;
    alphabet.forEach(a => {
      return_us.push(
        <Link key={key} href="#" 
          onClick={(event: React.SyntheticEvent) => {
            event.preventDefault();
            this.props.onChange(a);
          }}>
          {a}
        </Link>
      );
      key++;
      return_us.push(<span key={key}>&nbsp;</span>);
      key++;
    });
    return_us.push(
      <Link key={key} href="#" 
        onClick={(event: React.SyntheticEvent) => {
          event.preventDefault();
          this.props.onChange("");
        }}>
        Clear
      </Link>
    );
    key++;
    return_us.push(<span key={key}>&nbsp;</span>);

    return return_us;
  }
}

export default connector(LetterLinks);
