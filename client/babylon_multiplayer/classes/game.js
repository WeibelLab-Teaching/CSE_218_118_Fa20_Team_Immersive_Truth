/* global Avatar */
/* global BABYLON */
import BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import Player from './player';
import Subway from './subway';
export default class Game {
  constructor(selfid, villagers, mafias, player_names, target, playerRole) {
    console.log(`in game constructor, players: ${player_names}`);
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
    this.player_names = player_names;
    this.selfid = selfid

    //this.addPlayer(player_names[this.selfid], playerRole);

    this.cam_pos = [this.subway.positions[this.selfid], 2.8, this.selfid > 3 ? -4.7 : 2.6]
    this.camera = this.setupCamera();

    // This attaches the camera to the canvas
    this.camera.attachControl(this.canvas, true);
    console.log('after cam setup');


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

  addPlayer(username, role) {
    //get id and username
    console.log(`in addPlayer username: ${username}`);
    if (username == null) {
      username = 'test';
    }
    var id = this.player_names.length;
    this.player_names.push(username);

    var new_player = new Player(id, this.selfid, username, this.subway.positions[id], role, this.scene);

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
