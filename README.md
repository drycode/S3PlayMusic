controllers/ — defines your app routes and their logic. You main route might be index.js but you might also have a route called for example ‘/user’ so you might want to make a JS file that just handles that.

helpers/ — code and functionality to be shared by different parts of the project

middlewares/ — Express middlewares which process the incoming requests before handling them down to the routes

models/ — represents data, implements business logic and handles storage

public/ — contains all static files like images, styles and javascript

views/ — provides templates which are rendered and served by your routes

tests/ — tests everything which is in the other folders

app.js — initializes the app and glues everything together

package.json — remembers all packages that your app depends on and their versions