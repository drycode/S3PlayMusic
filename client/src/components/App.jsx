import React, { Component } from 'react';
// import axios from 'axios'
import Header from "./Header.jsx";
import ArtistsList from "./ArtistsList.jsx"
import AlbumsList from "./AlbumsList.jsx"
import SongsList from "./SongsList.jsx"
import Player from "./Player.jsx"

class App extends Component {
  constructor() {
    super()
    this.updateArtist = this.updateArtist.bind(this);
    this.updateAlbum = this.updateAlbum.bind(this);
    this.updateSong = this.updateSong.bind(this);
    this.rerenderComponents = this.rerenderComponents.bind(this);
    this.state = {
      selectedArtist: null,
      selectedAlbum: null,
      selectedSong: null
    }
  }

  rerenderComponents() {
    let selections = this.stateConditional();

    if (selections === 1) {
      this.setState({ selectedArtist: null })
    }
    if (selections === 2) {
      this.setState({ selectedAlbum: null })
    }
    if (selections === 3) {
      this.setState({ selectedSong: null })
    }
  }
  selections = 0;


  // if (this.state.selectedArtist && this.state.selectedAlbum && this.state.selectedSong) {
  //   this.setState({ selectedSong: null })
  // } else if (this.state.selectedArtist && this.state.selectedAlbum) {
  //   this.setState({ selectedAlbum: null })
  // }
  // this.setState({ selectedSong: null })


  stateConditional() {
    let i = 0;
    for (let property in this.state) {
      if (this.state[property]) {
        i += 1
      }
    }
    return i
  }

  updateArtist(artist) {
    this.setState({ selectedArtist: artist });
  }

  updateAlbum(album) {
    this.setState({ selectedAlbum: album });
  }

  updateSong(song) {
    this.setState({ selectedSong: song });
  }

  render() {
    const selectedArtist = this.state.selectedArtist
    const selectedAlbum = this.state.selectedAlbum
    const showSongList = this.state.selectedArtist && this.state.selectedAlbum

    return (
      <div>
        <Header {...this.state} onBack={this.rerenderComponents} />
        <ArtistsList selectedArtist={selectedArtist} onChange={this.updateArtist} />
        <AlbumsList selectedArtist={selectedArtist} selectedAlbum={selectedAlbum} onChange={this.updateAlbum} />
        <SongsList
          {...this.state}
          onChange={this.updateSong}
          showComponent={showSongList}
        />
        <Player
          {...this.state}
        />
      </div>
    );
  }
}

export default App;