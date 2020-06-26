import React, { Component } from 'react';

import axios from 'axios'

class ArtistsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      artists: [],
      showComponent: true,
      selectedArtist: this.props.selectedArtist
    }
  }

  handleClick(artist) {
    this.props.onChange(artist)
    this.setState({ showComponent: false })
  }

  listArtists() {
    const listArtists = this.state.artists.map((artist, i = 1) =>
      <div key={artist} className="col-3">
        <li key={artist} className="list-group-item" onClick={() => this.handleClick(artist)} >
          {artist}
        </li >
      </div >
    );
    return (
      <div className="artists-container">
        <div id="artists-list" className="row" >{listArtists}</ div>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedArtist !== this.props.selectedArtist) {
      this.setState({ selectedArtist: this.props.selectedArtist })
      if (!this.props.selectedArtist) {
        this.setState({ showComponent: true })
      }
    }
  }


  componentDidMount() {
    axios.get("/artists")
      .then(res => {
        this.setState({ artists: res.data })
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.showComponent) {
      return (
        <ul>
          {this.listArtists(this.props.name)}
        </ul>
      );
    }

    return <></>

  }
}

export default ArtistsList;