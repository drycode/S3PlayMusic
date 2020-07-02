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
    const listAlbums = Object.keys(this.state.albums).map((album) =>
      // TODO: Create an album card
      <li key={this.state.albums[album].id} onClick={() => this.handleClick(album)}>
        {album}
        <img className="albumArt" src={this.state.albums[album].images[0].resource_url} />
      </li>

    );
    return listAlbums
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
          console.log(res.data)
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