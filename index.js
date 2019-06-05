const ease = require("eases/expo-in-out");
const THREE = require("three");
const createOrbitViewer = require("three-orbit-viewer")(THREE);
const glslify = require("glslify");
const dat = require("dat.gui");
const guiData = {
  displacement: 47000.0,
  dispReduction: 6000.0,
  dispIntensity: 1,
  reactToMusic: false,
  wireframe: false,
  wrapper: true
};

const gui = new dat.GUI();
gui.add(guiData, "displacement");
gui.add(guiData, "dispReduction", 5000, 18000);
gui.add(guiData, "dispIntensity", 0, 1);
gui.add(guiData, "reactToMusic");
gui.add(guiData, "wireframe");
gui.add(guiData, "wrapper");

let micStream = null;
const audioCtx = new (AudioContext || webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
// const micPromise = navigator.mediaDevices
//   .getUserMedia({ audio: true })
//   .then(stream => {
//     const micSource = audioCtx.createMediaStreamSource(stream);
//     micSource.connect(analyser);
//     analyser.connect(audioCtx.destination);
//   });

const track = document.querySelector("#track");
const source = audioCtx.createMediaElementSource(track);
source.connect(analyser);
analyser.connect(audioCtx.destination);

const time = Date.now();

const app = createOrbitViewer({
  clearColor: "rgb(255, 255, 255)",
  // clearColor: "rgb(26, 28, 29)",
  clearAlpha: 1.0,
  fov: 65,
  position: new THREE.Vector3(1, 1, -60),
  contextAttributes: {
    antialias: true,
    alpha: false
  }
});

const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { type: "f", value: 0 },
    displacement: { type: "f", value: 0.0 },
    dispReduction: { type: "f", value: 0.0 },
    dispIntensity: { type: "f", value: 0.0 }
  },
  vertexShader: glslify("./vert.glsl"), // or: document.getElementById( 'vertexShader' ).textContent,
  fragmentShader: glslify("./frag.glsl") // or: document.getElementById( 'fragmentShader' ).textContent
});

const geometry = new THREE.IcosahedronGeometry(23, 5);
const mesh = new THREE.Mesh(geometry, material);
mesh.castShadow = true;
app.scene.add(mesh);
mesh.rotation.y = -Math.PI;

const material2 = new THREE.ShaderMaterial({
  uniforms: {
    time: { type: "f", value: 0 },
    displacement: { type: "f", value: 0.0 },
    dispReduction: { type: "f", value: 0.0 },
    dispIntensity: { type: "f", value: 0.0 }
  },
  vertexShader: glslify("./vert.glsl"),
  fragmentShader: glslify("./frag2.glsl")
});

const geometry2 = new THREE.IcosahedronGeometry(26, 2);
const mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.castShadow = true;
app.scene.add(mesh2);
mesh2.rotation.y = Math.PI;

let isWrapperVisible = false;
app.on("tick", dt => {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);

  let trackLevel = 0;
  for (let n of dataArray) {
    trackLevel += n;
  }
  const trackFrequenncy = Math.fround(trackLevel);

  material.uniforms.time.value = 0.00025 * (Date.now() - time);

  material.uniforms.displacement.value = guiData.reactToMusic
    ? trackFrequenncy
    : guiData.displacement;
  material.uniforms.dispReduction.value = guiData.dispReduction;
  material.uniforms.dispIntensity.value = guiData.dispIntensity;
  material.wireframe = guiData.wireframe;

  if (guiData.wrapper) {
    if (!isWrapperVisible) {
      app.scene.add(mesh2);
      isWrapperVisible = true;
    }

    material2.uniforms.time.value = 0.00025 * (Date.now() - time);

    material2.uniforms.displacement.value = guiData.reactToMusic
      ? trackFrequenncy
      : guiData.displacement;
    material2.uniforms.dispReduction.value = guiData.dispReduction;
    material2.uniforms.dispIntensity.value = guiData.dispIntensity;
    material2.wireframe = true;
  } else {
    if (isWrapperVisible) {
      app.scene.remove(mesh2);
      isWrapperVisible = false;
    }
  }
});
