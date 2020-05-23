
import React, { Component } from "react";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedArtist: this.props.selectedArtist,
    }
  }

  render() {
    return (
      <div>
        <div>
          Header
          SelectedArtist: {this.props.selectedArtist}
        </div>
        <button onClick={() => this.props.onBack()}>Back</button>

      </div>
    );
  };
}


export default Header;