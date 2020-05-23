import React, { Component } from 'react';
// import axios from 'axios'
import Header from "./Header";
import ArtistsList from "./ArtistsList"
import AlbumsList from "./AlbumsList"
import SongsList from "./SongsList"
import Player from "./Player"

class App extends Component {
  constructor(props) {
    super(props)
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
    if (this.state.selectedArtist && this.state.selectedAlbum) {
      this.setState({ selectedAlbum: null })
    } else if (this.state.selectedArtist) {
      this.setState({ selectedArtist: null })
    }
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
    const selectedSong = this.state.selectedSong
    const showSongList = this.state.selectedArtist && this.state.selectedAlbum
    return (
      <div>
        <Header selectedArtist={selectedArtist} onBack={this.rerenderComponents} />
        <ArtistsList selectedArtist={selectedArtist} onChange={this.updateArtist} />
        <AlbumsList selectedArtist={selectedArtist} selectedAlbum={selectedAlbum} onChange={this.updateAlbum} />
        <SongsList
          selectedArtist={selectedArtist}
          selectedAlbum={selectedAlbum}
          onChange={this.updateSong}
          showComponent={showSongList}
        />
        <Player
          selectedArtist={selectedArtist}
          selectedAlbum={selectedAlbum}
          selectedSong={selectedSong}
        />
      </div>
    );
  }
}

export default App;