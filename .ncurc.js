module.exports = {
  reject: [
    // author of this library decided to corrupt it for political reasons (version 6.6.6 is the bad one)
    "faker",
    "@types/faker",

    // will probably require update of components that use the older and testing of the forms
    "react-hook-form",

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

    // Don't upgrade prettier until after the node 16 upgrade
    "prettier",
  ],
};
