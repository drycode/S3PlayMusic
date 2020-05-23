# S3 MusicPlayer

> 

![last-commit][last-commit]
![open-issues][open-url]
![coverage][coverage]

As a professional musician and teacher, I have a several terrabytes of audio data. In an attempt to keep my storage costs low, and keep my data highly available, I put together a web application which will allow me to store recordings for a reasonable price in AWS S3 (Infrequent Access). 

Design Considerations
* I choose to use NodeJS for the backend because it seemed like the most appropriate language to serve streaming content. 
* As someone with more experience in Python and synchronous programming patterns, I am using this as an opportunity to practice event-driven programming patterns
* I am also interested in determining the best way to playback high-resolution lossless audio files over the web.

Next Steps
* I will need to deploy the server somewhere, likely in AWS
* I would like to create a mobile frontend for this application, so I can access my data from other devices


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


[open-url]: https://img.shields.io/github/issues-raw/danyoungmusic93/todo-list-app.svg
[last-commit]: https://img.shields.io/github/last-commit/danyoungmusic93/todo-list-app.svg
[coverage]: ./api/coverage.svg
