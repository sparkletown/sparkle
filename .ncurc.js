module.exports = {
  reject: [
    // author of this library decided to corrupt it for political reasons (version 6.6.6 is the bad one)
    "faker",

    // easy to upgrade, might require rm -rf .git/hooks for cloned repos
    "husky",

    // newer version has different API, should probably be easy to rework how it is used upon upgrade
    // @see https://github.com/FirebaseExtended/reactfire/blob/main/docs/upgrade-guide.md
    // "reactfire",

    // will probably require update of components that use the older and testing of the forms
    "react-hook-form",

    // best if replaced instead of upgraded
    "bootstrap",
    "bootswatch",
    "react-bootstrap",

    // most likely some minor adjustment due to prop types change
    "@types/react-resize-detector",
    "react-resize-detector",

    // requires rework of routes to be relative and replacing some basic components like Switch
    "react-router-dom",

    // minor type inconsistency, should  be easy to upgrade
    "@types/yup",
    "yup",

    // quite a leap in versions, should probably be easy to adjust to newer API
    "react-dnd",
    "react-dnd-html5-backend",

    // dev run warnings
    "ical-generator",

    // AnimateMap related, the code there is all kinds of chaos
    "pixi-viewport",
    "pixi-virtual-joystick",
    "pixi.js",
  ],
};
