import Subway from './subway.js';
import BABYLON from 'babylonjs';
import Avatar from './avatar.js';
import Player from './player.js';
import GUI from 'babylonjs-gui';
import 'babylonjs-loaders';

export default class ControlPanel {
  constructor(playerMesh, username, scene) {
    this.scene = scene;
    this.playerMesh = playerMesh;
    this.create();
  }

  create() {
    var hl = new BABYLON.HighlightLayer('hl1', this.scene);
    hl.innerGlow = true;
    hl.outerGlow = false;
    var color = 0;
    var OnKillClicked = function onKillClicked() {
      if (selectedMesh != null && selectedMesh.name.includes('player')) {
        console.log('eliminated');

        selectedMesh.material = new BABYLON.StandardMaterial();
        selectedMesh.visibility = 0.25;
        var newColor;
        switch (color) {
          case 0:
            newColor = BABYLON.Color3.Red();
            break;
          case 1:
            newColor = BABYLON.Color3.Green();
            break;
          case 2:
            newColor = BABYLON.Color3.Blue();
            break;
          case 3:
            newColor = BABYLON.Color3.Yellow();
            break;
          case 4:
            newColor = BABYLON.Color3.Purple();
            break;
        }
        hl.addMesh(selectedMesh, newColor);

        color = (color + 1) % 5;
        selectedMesh.material.diffuseColor = newColor;
        selectedMesh.renderOutline = false;
        selectedMesh = null;
      }
    };

    // Set UI Control panel
    var guiManager = new GUI.GUI3DManager(this.scene);
    var guiPanel = new GUI.StackPanel3D();
    guiPanel.margin = 0.02;
    guiManager.addControl(guiPanel);
    guiPanel.linkToTransformNode(this.scene.activeCamera);
    guiPanel.node.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
    guiPanel.position.z = 3;
    guiPanel.position.y = -1;
    guiPanel.node.rotation = new BABYLON.Vector3(Math.PI / 3, 0, 0);

    //// add buttons
    // follow / walking mode button
    let kill = new GUI.HolographicButton('Kill them');
    guiPanel.addControl(kill);
    // change environment button
    let save = new GUI.HolographicButton('Save them');
    guiPanel.addControl(save);
    // play button
    let pass = new GUI.HolographicButton('Do Nothing');
    guiPanel.addControl(pass);
    kill.onPointerUpObservable.add(OnKillClicked);

    //// add text
    // follow
    let toggleFollowText = new GUI.TextBlock();
    toggleFollowText.text = 'Kill Them';
    toggleFollowText.color = 'white';
    toggleFollowText.fontSize = 30;
    kill.content = toggleFollowText;
    // environment
    let envText = new GUI.TextBlock();
    envText.text = 'Save Them';
    envText.color = 'white';
    envText.fontSize = 30;
    save.content = envText;
    // play
    let playText = new GUI.TextBlock();
    playText.text = 'Do Nothing';
    playText.color = 'white';
    playText.fontSize = 30;
    pass.content = playText;

    var selectedMesh;

    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          if (
            pointerInfo.pickInfo.hit &&
            pointerInfo.pickInfo.pickedMesh != this.ground
          ) {
            console.log('clicked something');
            var selected = pointerInfo.pickInfo.pickedMesh;

            if (selected === this.playerMesh) selected.renderOutline = true;
            if (selectedMesh != null && selected != selectedMesh) {
              selectedMesh.renderOutline = false;
            }
            selectedMesh = selected;
          }
          break;
      }
    });
  }
}
