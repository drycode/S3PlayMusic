import React, { Component } from 'react';
import axios from 'axios'

class AlbumsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      albums: [],
      selectedArtist: this.props.name
    }
  }

  handleClick(album) {
    console.log(`${album} was clicked`);
  }

  listAlbums() {
    const listAlbums = this.state.albums.map((album) =>
      <li key={album} onClick={() => this.handleClick(album)}>
        {album}
      </li>
    );
    return (
      <ul>{listAlbums}</ul>
    );
  }

  componentDidUpdate() {
    console.log(this.props.name, this.state.selectedArtist)
    if (!this.props.name == this.state.selectedArtist) {
      axios.get(`/artists/${this.props.name}/albums`)
        .then(res => {
          this.setState({ albums: res.data, selectedArtist: this.props.name })
          console.log(res)
        })
        .catch(err => console.log(err));
    }

  }

  render() {
    return (
      <ul>
        {this.listAlbums()}
      </ul>
    );
  }
}

export default AlbumsList;