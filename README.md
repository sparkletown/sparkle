# Sparkle: SparkleTown Platform

Codebase for SparkleTown, brought to you by Sparkle.

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


## Automatic upload of map changes

You can use a quick shell script while editing the map, to speed up the process of seeing your changes on the map:

* Edit `scripts/config-upload.js` to replace the code that prompts for username and password, with the username and password you would type:

```
read(username)
read(password)
```

becomes:

```
//read(username)
//read(password)
const username = 'email@address.com`
const password = 'password'
```

* Run the automatic upload script:

```
$ CONFIG=co-reality-6; fswatch -o configs/${CONFIG}.js| xargs -n1 -I{} ./scripts/upload.sh ${CONFIG}
```

* Be careful not to commit or push your script change, since it contains your password!

## Obtaining email addresses from firebase

WARNING: Only email people with consent. Permission based marketing is the best way to grow your email list.

```
$ firebase auth:export --project co-reality-map auth.json
$ jq '.users[] | "\(.createdAt) \(.email)"' auth.json|awk '$2!="null\"" {print $0}'|sed -e 's/^"//' -e 's/"$//'|awk '{print $1"\t"$2}'|pbcopy
```

Paste into a google sheet. Leftmost column is the [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) of the account creation. This can be converted easily:

1. Create a new column to the right of the timestamp
2. Use the formula: `=A4/86400000 + DATE(1970,1,1)`
3. Fill down to get all values
4. Sort by timestamp or the calculated, human date
5. Consider not adding any with a "+"
6. Be mindful this is PII (personally identifiable information) so we should handle it carefully and treat it as sensitive. It may be subject to the GDPR data privacy requirements in the EU and the CCPA privacy laws in California.
7. Share the google sheet, ready to import the users into our other email lists.
8. Email the new folks, welcome them, and say thanks for coming to the party!

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
