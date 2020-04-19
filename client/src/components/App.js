import React, { Component } from 'react';
import axios from 'axios'
import Header from "./Header";
import ArtistsList from "./ArtistsList"
import AlbumsList from "./AlbumsList"

class App extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      selectedArtist: null
    }
  }
  handleChange(artist) {
    this.setState({ selectedArtist: artist });
  }
  render() {
    const selectedArtist = this.state.selectedArtist
    console.log(selectedArtist)
    return (
      <div>
        <Header />
        <ArtistsList selectedArtist={selectedArtist} onChange={this.handleChange} />
        <AlbumsList selectedArtist={selectedArtist} />
      </div>
    );
  }
}

export default App;