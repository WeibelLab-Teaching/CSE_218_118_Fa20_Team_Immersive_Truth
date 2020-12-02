/* global Avatar */
/* global BABYLON */
import BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import Player from './player';
import Subway from './subway';
export default class Game {
  constructor(num_players, player_names) {
    console.log(player_names);
    this.canvas = document.getElementById('renderCanvas');
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.subway = new Subway(this.scene);
    this.player0 = new Player(
      0,
      player_names[0],
      this.subway.positions[0],
      this.scene
    );
    this.player1 = new Player(
      1,
      player_names[1],
      this.subway.positions[1],
      this.scene
    );
    this.num_players = num_players;
    this.camera = this.setupCamera();

    // This attaches the camera to the canvas
    this.camera.attachControl(this.canvas, true);

    //magic vr line
    var vrHelper = this.scene.createDefaultVRExperience({
      createDeviceOrientationCamera: true,
    });
    vrHelper.enableInteractions();
    vrHelper.touch = true;
    vrHelper.displayLaserPointer = true;

    //Resize event
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  render() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  setupCamera() {
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FlyCamera(
      'camera1',
      new BABYLON.Vector3(10, 2.8, -4.8),
      this.scene
    );
    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(10, 2, 3));
    return camera;
  }
}
