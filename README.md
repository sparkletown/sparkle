# co-reality-map: Co-reality Collective Party Map App

A clickable party map to help you navigate Co-reality Collective parties.

## Getting started

```
git clone ...
cd co-reality-map
npm i
npm run init # Initialize secrets files with default values
npm test
npm start
npm run build
```

## Deploying

tl;dr:
```
npm i -g firebase-tools # only need this once
firebase login # only need this once
npm run build && firebase deploy
```

You can do a faster deploy by deploying just hosting:
```
npm run build && firebase deploy --only hosting
```

**NOTE:** You may get a warning about deleting the function `checkAdminPassword`; this is a function from [co-reality-admin](https://github.com/co-reality/co-reality-admin) and will be folded into this repo in future. In the meantime please don't delete this function.


## Uploading config for an event

`src/config.js` has the ID of the Firestore document containing the party configuration. For example, if it's "co-reality-5", the Firestore document with the party config is IDed by `config/co-reality-5`.

To upload a new config, use `scripts/upload.sh`:

```
$ scripts/upload.sh co-reality-5
```
This will upload the JSON object exported from `configs/co-reality-5.js` to the Firestore document `config/co-reality-5`.


## Create React App Documentation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
