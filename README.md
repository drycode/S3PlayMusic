# S3 MusicPlayer

> A simple AWS S3 / Node / React application for playing personal music

![last-commit][last-commit]
![open-issues][open-url]

As a professional musician and teacher, I have several terrabytes of proprietary audio data. In an attempt to keep my storage costs low, and keep my data highly available, I put together a web application which will allow me to store recordings for a reasonable price in AWS S3 (Infrequent Access). 

Design Considerations
* I choose to use NodeJS for the backend because it seemed like an appropriate language to serve streaming content. Also, as someone with more experience in Python and synchronous programming patterns, I am using this as an opportunity to practice event-driven programming 

## Installation

Be sure to first install the latest versions of [Node](https://nodejs.org/en/) and [React](https://www.tutorialspoint.com/reactjs/reactjs_environment_setup.htm). 

```sh
~ git clone https://github.com/danyoungmusic93/S3PlayMusic
```

## Development setup

Be sure to create separate dependency management systems for the `./server` and `./client` directories. 

```sh
~ cd client
~ npm install
~ cd ../server
~ npm install
```

Follow subsequent readme directions in the [client](client/README.md) and [server](server/README.md) directories

[open-url]: https://img.shields.io/github/issues-raw/danyoungmusic93/S3PlayMusic.svg
[last-commit]: https://img.shields.io/github/last-commit/danyoungmusic93/S3PlayMusic.svg
