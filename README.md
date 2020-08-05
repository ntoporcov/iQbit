# React Boiler Plate for Custom qBitTorrent WebUI

This project is a very simple and barebones boilerplate for creating a custom WebUI for qBitTorrent with React.

## Get Started
As usual, just clone this repo, run 

`yarn/npm install`
 
 Then after that to test on your local qBitTorrent, run
 
 `yarn/npm build`
 
 and point qBitTorrent's WebUI folder selection to the build folder.
 

## Considerations

#### Build command builds to /build/public
The reason for this is so that you can use the entire build folder as your WebUI theme folder. 

### Authentication
qBitTorrent's WebUI authenticates and throws the user around between public/private folder. In react, we don't need to do that. You can keep your app a single page application and introduce a 'softer' authentication

### Package.json
I made one small change in package.json to allow the directory that the html files load to be correct. I added the line 

`
homepage:"."
`

Without it, the theme will not work.

---
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
