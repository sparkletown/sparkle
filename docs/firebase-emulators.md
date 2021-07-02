### Firebase Emulators

Instead of running just the functions' emulator, the full suite of emulators can be used.
You can find out more at https://firebase.google.com/docs/emulator-suite.

**Note**: If your code accidentally invokes non-emulated (production) resources, there is a chance of data change, usage and billing.
To prevent this, you might opt in to use a Firebase project name beginning with `demo-` (e.g. `demo-staging`) in which case no production resources will be used.

This might entail some code changes as well, to enable the emulation, e.g.

```typescript
// Enable the functions emulator when running in development at specific port
if (process.env.NODE_ENV === "development" && window.location.port === "5000") {
  firebaseApp.firestore().useEmulator("localhost", 8080);
}
```
or to account for changed and/or deprecated Firebase client API, e.g.

```typescript
// deprecated
// import firebase, { UserInfo } from "firebase/app";
// use instead
import firebase from "firebase/app";
type UserInfo = firebase.UserInfo;
```

You can start the emulators in a manner that can persist the data locally:

```bash
npx firebase "emulators:start" --import=./tmp --export-on-exit
```

You should be greeted with

```bash
All emulators ready! View status and logs at http://localhost:4000
```

That's the location you can access and manage the running emulators.
The data between emulator runs should be persisted at

```bash
tmp/firebase-export-metadata.json
tmp/firestore_export
```
