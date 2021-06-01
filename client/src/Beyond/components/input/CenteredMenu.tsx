import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import ToggleButtonBox from "./ToggleButtonBox";


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
  options: string[];
  selected: string;
  onSelect: (selected: string) => void;
}

export interface State { 
}

class SelectBox extends Component<Props, State> {
  componentDidMount() {
  }

  getLabelWidth(name: string) {
    let smallCount = 
      this.countOccurences(name, "i") +
      this.countOccurences(name, "l") +
      this.countOccurences(name, "I") +
      this.countOccurences(name, "t") +
      this.countOccurences(name, "r") +
      this.countOccurences(name, " ");

    return ((name.length - smallCount) * 10 + smallCount * 4);
  }

  countOccurences(searchMe: string, findMe: string) {
    return searchMe.split(findMe).length - 1;
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}>
        { this.props.options.map((option, key) => {
          return (
            <span key={key}>
              <ToggleButtonBox 
                name={ option }
                height={15}
                lineHeight={1.5}
                border=""
                color="gray"
                width={ this.getLabelWidth(option) }
                bold
                value={ this.props.selected === option }
                onToggle={() => {
                  this.props.onSelect(option);
                  this.setState({ });
                }}
              />
            </span>
          );
        })}
      </div>
    );
  }
}

export default connector(SelectBox);
