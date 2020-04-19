import React, { Component } from 'react';
import axios from 'axios';

class SongsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      songs: [],
      selectedAlbum: "",
      selectedArtist: "",
      selectedSong: ""
    }
  }

  handleClick(song) {
    this.props.onChange(song)
  }

  listSongs() {
    // const songs = this.state.songs.slice(1)
    // let songNames = []
    // Strips the path prefix from the song name
    // songs.map((song) => songNames.push(song.replace(/^.*[\\\/]/, '')))

    const songsList = this.state.songs.map((song) =>
      <li key={song} onClick={() => this.handleClick(song)}>
        {song}
      </li>
    );
    return (
      <ul>{songsList}</ul>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      if (this.props.selectedArtist && this.props.selectedAlbum) {
        // let selectedAlbum = this.props.selectedAlbum.replace(this.props.selectedArtist, "")
        this.setState(this.props)
        axios.get(`/artists/${this.props.selectedArtist}/albums/${this.props.selectedAlbum}/songs`)
          .then(res => {
            this.setState({ songs: res.data })
          })
          .catch(err => console.log(err));
      }
    }

  }

  render() {
    return (
      <ul>
        {this.listSongs()}
      </ul>
    );
  }
}

export default SongsList;