<img src="https://github.com/ntoporcov/iQbit/raw/master/src/images/logo_round.png" alt="iQbit logo" title="iQbit Logo" align="right" height="300" />

# iQbit

iQbit is an iOS styled WebUI theme for qBitTorrent clients.

True story. While I was developing this, my wife asked me if qBitTorrent was like Limewire. The reason was clear, torrent clients haven't evolved in their last 20 years of popularity. iQbit is an attempt to bring torrenting to more modern design approaches. With that being said, this is not a data-heavy approach to torrenting (or at least not yet). The main focus of this projects are the following points:

* Ease of Use
* Mobile Friendly/First 
* Adhering to Human Interface Guidelines (as much as possible)

This is a PWA! This means you can install this app on your device through your OS default browser.



## Screenshots

![Screenshot](https://github.com/ntoporcov/iQbit/raw/master/src/images/mobileScreenshot.png)
![Screenshot](https://github.com/ntoporcov/iQbit/raw/master/src/images/mobileScreenshot2.png)
![Screenshot](https://github.com/ntoporcov/iQbit/raw/master/src/images/mobileScreenshot3.png)
![Screenshot](https://github.com/ntoporcov/iQbit/raw/master/src/images/tabletScreenshot.png)
![Screenshot](https://github.com/ntoporcov/iQbit/raw/master/src/images/tabletScreenshot2.png)




## Releases And Installing

All releases will be published right in this repo. All you actually need is the release folder but I do accept any other ideas of how to release updates.

My suggestion is to do a git clone of this repo locally and then point your qbittorrent to the release folder and it should all just work. Then all you need to do to get updates would be pulling the repo. If you don't actually install all the dependencies for development it shouldn't be too much. You might need to install git.



## Method Suggested

On your terminal

`$ cd [path of directory you want to download project to]`

`$ git clone https://github.com/ntoporcov/iQbit.git`

Then in qBitTorrent you'll want to point the WebUI theme folder selection to the newly created `[...]/iqbit/release` folder and you should be done.



## RoadMap

I intend to keep supporting this project for the foreseeable future at least until I run out of things that I would like to see in it. My current feature roadmap organized by priority is the following:

1. Add Dark Mode
2. Add More Search Providers (Maybe using qbittorrent's plugins, maybe not, maybe both native providers and plugins)
3. Add All possible settings to the settings screen



## License

iQbit is licensed under the terms of the GPL Open Source license and is available for free.



## Bugs & Feature Suggestions 

Please use the issues tab for any bugs found and feature suggestions.
