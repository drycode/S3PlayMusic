
import React, { Component } from "react";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedArtist: this.props.selectedArtist,
      selectedAlbum: this.props.selectedAlbum,
      selectedSong: this.props.selectedSong,
    }
  }

  render() {
    return (
      <div>
        <div>
          <h1>Header</h1>
          <h5 className="selection-header">
            Selected Artist: {this.props.selectedArtist}
          </h5>
          <h5 className="selection-header">
            Selected Album: {this.props.selectedAlbum}
          </h5>
          <h5 className="selection-header">
            Selected Song: {this.props.selectedSong}
          </h5>
        </div>
        <button onClick={() => this.props.onBack()}>Back</button>

      </div>
    );
  };
}


export default Header;