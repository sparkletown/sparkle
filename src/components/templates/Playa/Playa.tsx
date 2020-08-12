import React from "react";
import { PlayaContextProvider } from "./Context";
import { Container } from "./components/Container";
import { Map } from "./components/Map";
import { UI } from "./components/UI";

import "./Playa.scss";

export const Playa = () => {
  return (
    <PlayaContextProvider>
      <Container>
        <Map />
        <UI />
      </Container>
    </PlayaContextProvider>
  );
};

// Plans:
// Backend server - the pubsub example here: https://goldfirestudios.com/horizontally-scaling-node-js-and-websockets-with-redis
// Notes on 3D camera movement: https://blogs.perficient.com/2020/05/21/3d-camera-movement-in-three-js-i-learned-the-hard-way-so-you-dont-have-to/
// Skybox: https://www.youtube.com/watch?v=cp-H_6VODko
// Rendering DOM elements as textures:
//  - http://learningthreejs.com/blog/2013/04/30/closing-the-gap-between-html-and-webgl/
//  - https://github.com/mrdoob/three.js/blob/master/examples/css3d_molecules.html
// Mouse support:
//  - https://stackoverflow.com/questions/7984471/how-to-get-clicked-element-in-three-js
//  - https://threejs.org/examples/?q=cubes#webgl_interactive_cubes
//  - https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
// Video on a texture:
//  - https://threejs.org/docs/#api/en/textures/VideoTexture
//  - https://github.com/mrdoob/three.js/blob/master/src/textures/VideoTexture.js

// TODO:
// - Put the map in the world
// - LOD map? More detailed the closer you get
// - 2D/3D camera control
// - Tweak pan/zoom to work right with the map in 2D mode
// - Mouse & keyboard support ie. add "walking"
// - Add more UI elements, shoutout feature etc.
// - Lay down assets on map as clickable polygons with DOM elements rendered on them as textures
// - Heroku/websocket relay for sending/receiving object positions
// - Speaking indicator & speaking mode
// - Video chat
// - Impromptu "make a zoom room" feature
// - Art car driving
