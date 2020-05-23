import React, { Component } from 'react';

import axios from 'axios'

class ArtistsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      artists: [],
      showComponent: true,
    }
  }
  handleClick(artist) {
    this.props.onChange(artist)
    this.setState({ showComponent: false })
  }


  listArtists() {
    const listArtists = this.state.artists.map((artist) =>
      <div className="col-3">
        <li className="list-group-item" id={artist} key={artist} onClick={() => this.handleClick(artist)} >
          {artist}
        </li >
      </div>
    );
    return (
      <div className="artists-container">
        <div id="artists-list" className="row" >{listArtists}</ div>
      </div>
    );
  }

  componentDidMount() {
    axios.get("/artists")
      .then(res => {
        this.setState({ artists: res.data })
        console.log(res)
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