## Running the server
```
~ npm start
```
## High Level Architecture
* Request made to S3 to get list of Artists -> Albums -> Songs
* Subsequent calls made to the (Discogs API)[https://www.discogs.com/developers] to get metadata about a particular piece of data found in S3
    * Both an in memory (for Artist, ALbum, and Song details) and S3 cache (for Artist details) sit in front of the Discogs API. 
    * The artists cache is very large, and is scheduled to update once a day. The Discogs API throttles access per user to 60 API calls per minute, which is infeasible to use if we expect to view more than a few dozen artists and their albums / songs. 


## Controllers 
_defines your app routes and their logic. You main route might be index.js but you might also have a route called for example ‘/user’ so you might want to make a JS file that just handles that._

## Helpers 
_code and functionality to be shared by different parts of the project_

## Middlewares 
_Express middlewares which process the incoming requests before handling them down to the routes_
* Caching Middleware being used to create an in memory cache of each request, stored by request 

## Views 
_provides templates which are rendered and served by your routes_

## Testing