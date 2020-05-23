import React, { Component } from 'react';

import axios from 'axios'

class List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showComponent: true,
      selected: props.selected
    }
  }

  handleClick(selection) {
    this.props.onChange(selection)
    this.setState({ showComponent: false, selected: selection })
  }


  componentDidUpdate(prevProps, prevState) {
    console.log(this.props)
    if (this.state.selected !== this.props.selected) {
      this.setState({ selected: this.props.selected })
      if (!this.props.selected) {
        this.setState({ showComponent: true })
      }
    }
  }


  // componentDidMount() {
  //   axios.get("/artists")
  //     .then(res => {
  //       this.setState({ artists: res.data })
  //       console.log(res)
  //     })
  //     .catch(err => console.log(err));
  // }

  // render() {
  //   if (this.state.showComponent) {
  //     return (
  //       <ul>
  //         {this.listArtists(this.props.name)}
  //       </ul>
  //     );
  //   }

  //   return <></>

  // }
}

export default List;