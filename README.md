<img src="https://github.com/ntoporcov/iQbit/raw/master/src/images/logo_round.png" alt="iQbit logo" title="iQbit Logo" align="right" height="300" />

# iQbit

iQbit is an iOS styled WebUI theme for qBitTorrent clients.

True story. While I was developing this, my wife asked me if qBitTorrent was like Limewire. The reason was clear,
torrent clients haven't evolved in their last 20 years of popularity. iQbit is an attempt to bring torrenting to more
modern design approaches. With that being said, this is not a data-heavy approach to torrenting (or at least not yet).
The main focus of this projects are the following points:

* Ease of Use
* Mobile Friendly/First
* Adhering to Human Interface Guidelines (as much as possible)

This is a PWA! This means you can install this app on your device through your OS default browser. Being a PWA allows us
to have native features in the WebUI. Including:

* Native PushAPI Notifications (hopefully) - Coming whenever apple releases it for iOS 16, expected 2023. Users that
  enable it could get notifications when a torrent finishes downloading
* Camera support (maybe) - My idea is to use iOS live text feature to add a torrent by just pointing your phone into its
  hash id

![Screenshot](public/images/devices-pichi.png)
![Screenshot](public/images/iphones-pichi.png)

## Releases And Installing

All releases will be published right in this repo. All you actually need is the release folder but I do accept any other
ideas of how to release updates.

My suggestion is to do a git clone of this repo locally and then point your qbittorrent to the release folder and it
should all just work. Then all you need to do to get updates would be pulling the repo. If you don't actually install
all the dependencies for development it shouldn't be too much. You might need to install git.

## Method Suggested

On your terminal

`$ cd [path of directory you want to download project to]`

`$ git clone https://github.com/ntoporcov/iQbit.git`

Then in qBitTorrent you'll want to point the WebUI theme folder selection to the newly created `[...]/iqbit/release`
folder and you should be done.

## RoadMap

I intend to keep supporting this project for the foreseeable future at least until I run out of things that I would like
to see in it. My current feature roadmap organized by priority is the following:

1. Add support for Sonarr and Radarr

## Settings

I added what I think is a decent amount of all the settings onto the WebUI. Qbittorrent has a ton of settings, so if you
really want to use the webui and the only thing stopping you is one of the missing settings screen, let me know and I'll
do my best to add it in a timely manner.

## License

iQbit is licensed under the terms of the GNU GPLv3 and is available for free.

## Bugs & Feature Suggestions

Please use the issues tab for any bugs found and feature suggestions.
