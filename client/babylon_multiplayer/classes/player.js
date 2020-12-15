/* global BABYLON */
/* global World */
import Billboard from './billboard.js';
import BABYLON from 'babylonjs';
import ControlPanel from './controlPanel.js';
import 'babylonjs-loaders';

export default class Player {
  constructor(id, username, position, role, scene, isSelf, io, isHost) {
    this.id = id;
    this.role = role;
    this.io = io;
    this.name = username;
    this.mesh = null;
    this.votes = 0;
    this.scene = scene;
    this.billboard = null;
    this.controlPanel = null;
    this.check = 55
    BABYLON.SceneLoader.ImportMesh(
      '',
      'src/assets/scenes/',
      'player_clothed_rigged.obj',
      scene,
      function (newMeshes, particleSystems, skeletons) {
        //Locations of players
        var x_val = position[0];
        var y_val = -0.6;
        var z_val = position[1];
        var Avatar = newMeshes[0];
        Avatar.name = 'player' + id;
        Avatar.scaling = new BABYLON.Vector3(0.22, 0.22, 0.22);
        Avatar.outlineWidth = 0.1;
        Avatar.outlineColor = new BABYLON.Color3(1, 0.2, 0.3);

        Avatar.renderOutline = false;

        if (role == 'mafia') {
          Avatar.renderOutline = true
          Avatar.outlineColor = new BABYLON.Color3.Blue()
        }

        // Avatar 1 location and shadows
        Avatar.position.x = x_val;
        Avatar.position.y = y_val;
        Avatar.position.z = z_val;

        if (z_val > 0)
          Avatar.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI);
        Avatar.receiveShadows = true;
        this.billboard = new Billboard(Avatar, username);
        if (isSelf) {
          this.controlPanel = new ControlPanel(role, scene, io, isHost);
        }
        this.mesh = Avatar;
      }.bind(this)
    );
  }

  //Destroy player meshes
  destroy() {
    this.billboard.mesh.dispose();
    this.mesh.dispose();
    //this.controlPanel.enabled = false
  }

}
