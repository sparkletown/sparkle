import React, { useRef, useEffect, useContext } from "react";
import * as THREE from "three";
import { MTLLoader, OBJLoader } from "three-obj-mtl-loader";
import { PlayaContext } from "../Context";

export const Map = () => {
  const mapRef = useRef();
  const stateRef = useRef();
  const { state } = useContext(PlayaContext);
  stateRef.current = state;

  useEffect(() => {
    const width = mapRef.current.clientWidth;
    const height = mapRef.current.clientHeight;
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#c2b280");
    renderer.setSize(width, height);
    mapRef.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.lerp(stateRef.current.center, stateRef.current.rate);

    //LIGHTS
    // var lights = [];
    // lights[0] = new THREE.PointLight(0x304ffe, 1, 0);
    // lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    // lights[2] = new THREE.PointLight(0xffffff, 1, 0);
    // lights[0].position.set(0, 200, 0);
    // lights[1].position.set(100, 200, 100);
    // lights[2].position.set(-100, -200, -100);
    // scene.add(lights[0]);
    // scene.add(lights[1]);
    // scene.add(lights[2]);

    //Simple Box with WireFrame
    // -----Step 1--------
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({
      color: "#0F0",
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // -----Step 2--------
    //LOAD TEXTURE and on completion apply it on SPHERE
    new THREE.TextureLoader().load(
      "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
      (texture) => {
        //Update Texture
        cube.material.map = texture;
        cube.material.needsUpdate = true;
      },
      (xhr) => {
        //Download Progress
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        //Error CallBack
        console.log("An error happened" + error);
      }
    );

    // -----Step 4--------
    //Loading 3d Models
    //Loading Material First
    var freedomMesh;
    var mtlLoader = new MTLLoader();
    mtlLoader.setBaseUrl("/assets/");
    mtlLoader.load("/assets/freedom.mtl", (materials) => {
      materials.preload();
      console.log("Material loaded");
      //Load Object Now and Set Material
      var objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(
        "/assets/freedom.obj",
        (object) => {
          freedomMesh = object;
          freedomMesh.position.setY(3); //or  this
          freedomMesh.scale.set(0.02, 0.02, 0.02);
          scene.add(freedomMesh);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        // called when loading has errors
        (error) => {
          console.log("An error happened" + error);
        }
      );
    });

    renderer.render(scene, camera);

    let frameId;
    const animate = () => {
      // -----Step 3--------
      //Rotate Models
      if (cube) cube.rotation.y += 0.01;
      if (freedomMesh) freedomMesh.rotation.y += 0.01;
      camera.position.lerp(stateRef.current.center, stateRef.current.rate);

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    const stop = () => {
      cancelAnimationFrame(frameId);
    };

    window.addEventListener("resize", () => {
      const width = mapRef.current.clientWidth;
      const height = mapRef.current.clientHeight;
      renderer.setSize(width, height);

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });

    const mapRefCurrent = mapRef.current;
    return () => {
      stop();
      mapRefCurrent.removeChild(renderer.domElement);
    };
  }, [mapRef]);

  return (
    <div
      ref={mapRef}
      style={{ height: "100vh", width: "100%", position: "absolute" }}
    />
  );
};

export default Map;
