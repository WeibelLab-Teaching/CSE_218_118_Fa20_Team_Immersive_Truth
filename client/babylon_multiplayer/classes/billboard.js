/* global Avatar */
/* global BABYLON */
/* global World */
import Subway from './subway.js';
import BABYLON from 'babylonjs';
import Avatar from './avatar.js';
import GUI from 'babylonjs-gui';
import 'babylonjs-loaders';

export default class Billboard {
  constructor(playerMesh, username) {
    this.playerMesh = playerMesh;
    this.username = username;
    this.create();
  }

  create() {
    this.mesh = BABYLON.MeshBuilder.CreatePlane(
      'billboard',
      { width: Billboard.width, height: Billboard.height },
      Subway.scene
    );
    this.mesh.scaling = new BABYLON.Vector3(7, 7, 7);
    this.mesh.position = BABYLON.Vector3.Zero();
    this.mesh.position.y = this.playerMesh.position.y + 16;
    this.mesh.position.x = this.playerMesh.position.x - 11;
    this.mesh.position.z = this.playerMesh.position.z;
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(
      this.mesh,
      1024,
      256
    );
    advancedTexture.name = 'AvatarBillboard';
    var containerUI = new GUI.Rectangle('container');
    containerUI.thickness = 0;
    containerUI.height = '100px';
    containerUI.width = '800px';
    advancedTexture.addControl(containerUI);
    this.text = new GUI.TextBlock();
    this.text.fontFamily = 'Arial';
    this.text.fontWeight = 'bold';
    this.text.color = 'white';
    this.text.outlineColor = 'black';
    this.text.outlineWidth = 4;
    this.text.fontSize = 90;
    containerUI.addControl(this.text);
    this.text.text = this.username;
    this.mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    this.mesh.parent = this.playerMesh;
  }
}

Billboard.height = 1;
Billboard.width = 3;
