import React, { Component } from 'react';
// import axios from 'axios'

class ArtistsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      artists: [
        "1970",
        "29th Street Saxophone Quartet",
        "A Day to Remember",
        "AC_DC",
        "Abbey Lincoln",
        "Adam Brodsky",
        "Adam Sandler",
        "Adelphi Saxophone Quartet",
        "Aerosmith",
        "Ahmad Jamal Trio",
        "Ahmad Jamal",
        "Akon",
        "Al Green",
        "Al Hirt"
      ],
    }
  }
  handleClick(artist) {
    this.props.onChange(artist)
  }


  listArtists() {
    const listArtists = this.state.artists.map((artist) =>
      <li key={artist} onClick={() => this.handleClick(artist)} >
        {artist}
      </li >
    );
    return (
      <ul>{listArtists}</ul>
    );
  }
  componentDidMount() {
    // axios.get("/artists")
    //   .then(res => {
    //     this.setState({ artists: res.data })
    //     console.log(res)
    //   })
    //   .catch(err => console.log(err));
  }

  render() {
    return (
      <ul>
        {this.listArtists(this.props.name)}
      </ul>
    );
  }
}

export default ArtistsList;