import React from 'react';

const Player = (props) => {
  if (props.selectedArtist && props.selectedAlbum && props.selectedSong) {
    return (
      // <></>
      <video name="song" controls src={`http://localhost:3000/artists/${props.selectedArtist}/albums/${props.selectedAlbum}/songs/${props.selectedSong}/play`} type="audio/mp3" />
    )
  }
  else {
    return (
      <></>
    )
  }
}

export default Player;