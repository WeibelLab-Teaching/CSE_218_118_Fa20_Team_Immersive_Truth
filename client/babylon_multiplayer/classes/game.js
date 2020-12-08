/* global Avatar */
/* global BABYLON */
import BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import Player from './player';
import Subway from './subway';
export default class Game {
  constructor(selfid, villagers, mafias, player_names, target) {
    console.log(player_names);
    this.canvas = target;
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);
    this.subway = new Subway(this.scene);
    this.players = []
    let villager_ctr = 0
    let mafia_ctr = 0
    this.num_players = villagers + mafias;

    for (var i = 0; i < this.num_players; i++) {
      var role = 'mafia'
      if (villager_ctr < villagers && (Math.random() > 0.5 || mafia_ctr == mafias)) {
        role = 'villager'
        villager_ctr++;
      }
      else {
        mafia_ctr++;
      }
      this.players[i] = new Player(
        i,
        selfid,
        player_names[i] ? player_names[i] : "null",
        this.subway.positions[i],
        role,
        this.scene
      );
    }

    this.cam_pos = [this.subway.positions[selfid], 2.8, selfid > 3 ? -4.7 : 2.6]
    this.camera = this.setupCamera();

    // This attaches the camera to the canvas
    this.camera.attachControl(this.canvas, true);

    //magic vr line
    var vrHelper = this.scene.createDefaultVRExperience({
      createDeviceOrientationCamera: true,
      trackPosition: true,
    });
    vrHelper.enableInteractions();
    vrHelper.touch = true;
    vrHelper.displayLaserPointer = true;
    vrHelper.deviceOrientationCamera.disablePointerInputWhenUsingDeviceOrientation = false;

    // vrHelper.enableTeleportation({
    //   floorMeshes: [enviroment.ground],
    // });

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
      new BABYLON.Vector3(this.cam_pos[0], this.cam_pos[1], this.cam_pos[2]),
      this.scene
    );
    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(10, this.cam_pos[1], -this.cam_pos[2]));
    return camera;
  }
}
