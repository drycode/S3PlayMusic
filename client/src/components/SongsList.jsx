import React, { useState, Component } from 'react';
import axios from 'axios';

function SongListItem({ i, callback, song }) {
  const [selected, setSelected] = useState(false);

  let color = "black"
  if (selected) {
    color = "blue"
  }
  console.log()

  return (
    <li
      key={i}
      onClick={() => {
        callback(i);
        setSelected(true);
      }}
      color={color} >
      {song}
    </li >
  )
}

class SongsList extends Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      songs: [],
      selectedAlbum: "",
      selectedArtist: "",
      selectedSong: "",
      showComponent: props.showComponent
    }
  }

  handleClick(index) {
    this.props.onChange(this.state.songs[index])
  }


  listSongs() {
    // const songs = this.state.songs.slice(1)
    // let songNames = []
    // Strips the path prefix from the song name
    // songs.map((song) => songNames.push(song.replace(/^.*[\\\/]/, '')))

    const songsList = []

    for (let i in this.state.songs) {
      songsList.push(
        <SongListItem key={i} i={i} song={this.state.songs[i]} callback={this.handleClick} />
      )
    }
    return (
      <> {songsList}</ >
    );
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps, prevState)
    if (prevProps.selectedAlbum !== this.props.selectedAlbum) {
      if (this.props.selectedArtist && this.props.selectedAlbum) {
        this.setState(this.props)
        axios.get(`/artists/${this.props.selectedArtist}/albums/${this.props.selectedAlbum}/songs`)
          .then(res => {
            this.setState({ songs: res.data })
          })
          .catch(err => console.log(err));
      }
      else {
        this.setState({ songs: [], selectedArtist: null, selectedAlbum: null, showComponent: false })
      }
    }

  }

  render() {
    if (this.state.showComponent) {
      return (
        <ul>
          {this.listSongs()}
        </ul>
      );
    }
    return <></>
  }
}


export default SongsList;