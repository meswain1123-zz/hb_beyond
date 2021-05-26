
import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';
import { v4 as uuidv4 } from "uuid";
import { IStringHash } from "../../models";
import {
  FormControl,
  OutlinedInput
} from "@material-ui/core";
// import StringBox from "./StringBox";


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
  value: string;
  onSplit: (json: IStringHash[]) => void;
}

export interface State {
  // ctrlHeld: boolean;
  // selected: string;
}
class ParseHelperBox extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // ctrlHeld: false,
      // selected: ""
    };
    this.the_control = React.createRef();
  }

  the_control: any;
  
  componentDidMount() {
    // console.log(this.the_control);
    // if (this.the_control.current) {
    //   this.the_control.current.addEventListener("keydown", this.onKeyDown.bind(this));
    // }
  }

  render() {
    return (
      <FormControl variant="outlined" fullWidth>
        <OutlinedInput 
          id={`parse_helper`}
          name={`parse_helper`}
          type={"string"}
          autoComplete="Off"
          value={this.props.value}
          fullWidth
          multiline
          onKeyDown={(e: any) => {
            if (e.key === "a") {
              const selection = window.getSelection();
              if (selection) {
                const start = e.target.selectionStart;
                const finish = e.target.selectionEnd;
                const piece1 = this.props.value.substring(0, start);
                const piece2 = this.props.value.substring(start, finish);
                const piece3 = this.props.value.substring(finish);
                const hash_pieces: IStringHash[] = [];
                if (piece1.length > 0) {
                  hash_pieces.push({ 
                    str: piece1,
                    type: "Unknown",
                    true_id: uuidv4().toString()
                  });
                }
                if (piece2.length > 0) {
                  hash_pieces.push({ 
                    str: piece2,
                    type: "Unknown",
                    true_id: uuidv4().toString()
                  });
                }
                if (piece3.length > 0) {
                  hash_pieces.push({ 
                    str: piece3,
                    type: "Unknown",
                    true_id: uuidv4().toString()
                  });
                }
                this.props.onSplit(hash_pieces);
              }
            }
          }}
        />
      </FormControl>
    );
  }
}

export default connector(ParseHelperBox);
