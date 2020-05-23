import React, { Component } from 'react';
import axios from 'axios'


class AlbumsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      albums: [],
      selectedArtist: "",
      showComponent: true,
      selectedAlbum: props.selectedAlbum
    }
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

  handleClick(selection) {
    this.props.onChange(selection)
    this.setState({ showComponent: false, selectedAlbum: selection })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedArtist !== this.props.selectedArtist) {
      this.setState({ selectedArtist: this.props.selectedArtist })
      axios.get(`/artists/${this.props.selectedArtist}/albums`)
        .then(res => {
          this.setState({ albums: res.data })
        })
        .catch(err => console.log(err));
    }


    if (this.state.selectedAlbum !== this.props.selectedAlbum) {
      this.setState({ selectedAlbum: this.props.selectedAlbum })
      if (this.state.selectedArtist) {
        this.setState({ showComponent: true })
      } else {
        this.setState({ showComponent: false })
      }
    }
  }



  render() {
    if (this.state.showComponent) {
      return (
        <ul>
          {this.listAlbums()}
        </ul>
      );
    }
    return <></>
  }
}

export default AlbumsList;