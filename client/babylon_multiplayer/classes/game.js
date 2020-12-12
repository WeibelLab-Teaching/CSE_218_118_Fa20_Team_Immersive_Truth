/* global Avatar */
/* global BABYLON */
import BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import Player from './player';
import Subway from './subway';
export default class Game {
  constructor(villagers, mafias, target) {
    this.canvas = target;
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.subway = new Subway(this.scene);
    this.players = []
    this.villagers = villagers
    this.mafias = mafias
    this.villager_ctr = 0
    this.mafia_ctr = 0
    this.num_players = villagers + mafias;
    this.selfid = selfid


    //magic vr line
    var vrHelper = this.scene.createDefaultVRExperience({
      createDeviceOrientationCamera: true,
      trackPosition: true,
    });
    vrHelper.enableInteractions();
    vrHelper.touch = true;
    vrHelper.displayLaserPointer = true;
    vrHelper.deviceOrientationCamera.disablePointerInputWhenUsingDeviceOrientation = false;
    console.log('after vr setup');


    //Resize event
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  render() {
    console.log('in render');

    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  addPlayer(username, role, isSelf) {


    // This attaches the camera to the canvas
    console.log('after cam setup');

    //get id and username
    console.log(`in addPlayer username: ${username}`);
    if (username == null) {
      username = 'test';
    }
    
    var id = this.players.length;

    if(isSelf){
      this.cam_pos = [this.subway.positions[id][0], 2.8, this.subway.positions[id][1]]
      this.camera = this.setupCamera();
      this.camera.attachControl(this.canvas, true);
      this.scene.activeCamera = this.camera
    }

    var new_player = new Player(id, username, this.subway.positions[id], role, this.scene, isSelf);

    this.players.push(new_player);
  }



  setupCamera() {
    console.log('in set up camera');
    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FlyCamera(
      'camera1',
      new BABYLON.Vector3(this.cam_pos[0], this.cam_pos[1], this.cam_pos[2]),
      this.scene
    );
    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(10, this.cam_pos[1], -this.cam_pos[2]));
    return camera;
  }
}
