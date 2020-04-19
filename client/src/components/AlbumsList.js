import React, { Component } from 'react';
import axios from 'axios'

class AlbumsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      albums: [],
      selectedArtist: ""
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

  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps, prevState, this.state)
    if (prevProps !== this.props) {
      axios.get(`/artists/${this.props.selectedArtist}/albums`)
        .then(res => {
          this.setState({ albums: res.data })
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