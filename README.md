# RSSchool NodeJS websocket task 

## Installation

1. Clone/download repo
2. `npm install`

## Usage

**Development**

`npm run start:dev`

- App served @ `http://localhost:8181` with tsx

**Production**

`npm run build`

- Build production version

`npm start`

- App served @ `http://localhost:8181` without tsx

## Note

If you have created profile, it will stay in inMemory db untill server is running.

If you have closed app page in your web browser and want to reconnect to the same profile you have created,
provide the same username and password you have used to create profile.

At the same time to server can be connected mupltiple users.

All users can play with each other, or play with bot simultaniously.
