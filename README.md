# Loki

Loki is an open-source self-hosted browsing companion, 
that starts from scratch, with zero knowledge of 
it's own. It is designed to collect important information 
from the pages we visit on the internet and 
store it in a structured manner.

It is a combo of a Browser Extension & a fully customisable 
Search Engine, built to empower users in building their 
own knowledge repositories.

To know more about Loki, checkout following links

- [About](https://21b.in/about)
- [How it works](https://21b.in/how-it-works)
- [Privacy](https://21b.in/privacy)

Requires a running MongoDB instance. We may add a Redis dependency in the near future.

:warning: Note: Loki is currently in alpha stages, so things may break with new releases.
Use it at your own risk.

### Demo

Check [https://21b.in](https://21b.in) for demo

### Code structure

The root folder of this source is an ExpressJS app. 

The frontend is a ReactJS app, present in the `app` folder.

The `extension` folder contains source code for the browser extension.

### Deploy on Production

- Install dependencies

```bash
npm install
cd app
npm install
```

- Build React app

```bash
cd app
npm run build
```

- Copy .env.example to .env and change env vars values

```bash
NODE_ENV=production
...
```

- Then run ExpressJS app

```bash
source .env
npm start
```

- Use nginx to proxy ExpressJS app on a domain

- Download browser extension from `/extension/download` and install browser extension
in your desktop browsers

In production environment, the ExpressJS app renders the `app/dist/index.html` 
file on `/` route, so after running it, you can open the web app in your browser.

### Configuration

After installing Loki, you must do the following configuration in Settings page `/settings` 

- Set the Base URL for the search engine setup and extension 
to work properly.

- Setup authentication to prevent unauthorized access to Settings

:warning: Note: You can copy the authentication tokens in a secure place, 
or else you can browse them in mongo database 
directly in `auth_tokens` collection
whenever needed.

### Contribute to Loki

If you like this software and want to contribute any improvements or features,
you are welcome to send a PR to this repository. 
Check CONTRIBUTING.md for setting up your development environment.

If you have any suggestions or you are facing any issues when 
using this software, please feel
free to create an issue in this repository.

You can also directly email me at a1ananth@live.com 

### Donate

If you like Loki software and want to keep this project alive, 
please consider donating to us. Your donations will be used
to fund important security fixes and additional features to make
this software more secure and useful. 
We are currently accepting donations
in crypto only.

BTC: `13qFDtGZWB6oAmPwzHDdMvimroEmQnAe3D`

BCH: `qr2mn2ek8gnzd5e7gdnagexhcendfjlyk5qxv2pfht`

ETH: `0x3ac8B761910eC82AeF37b8FaC1aB6623882663D6`

LTC: `LP6Ej5PTFbCRCtdyHqMRz1aNQ5Qk5PEFpK`

