import Subway from './subway.js';
import BABYLON from 'babylonjs';
import Avatar from './avatar.js';
import Player from './player.js';
import GUI from 'babylonjs-gui';
import 'babylonjs-loaders';

export default class ControlPanel {
  constructor(playerMesh, role, scene) {
    this.scene = scene;
    this.playerMesh = playerMesh;
    this.role = role;
    this.create();
  }

  create() {
    var hl = new BABYLON.HighlightLayer('hl1', this.scene);
    hl.innerGlow = true;
    hl.outerGlow = false;
    var color = 0;

    function OnVoteClicked() {
      if (selectedMesh != null && selectedMesh.name.includes('player')) {
        console.log("Voted for " + selectedMesh.name)
        Player.addVote(selectedMesh.id);
        console.log(selectedMesh);
      }
    }


    function OnKillClicked() {
      if (selectedMesh != null && selectedMesh.name.includes('player')) {
        console.log(selectedMesh.name + ' has been eliminated');

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
    if (this.role == 'mafia') {
      let kill = new GUI.HolographicButton('Kill them');
      guiPanel.addControl(kill);

      var killText = new GUI.TextBlock();
      killText.text = 'Kill Them';
      killText.color = 'white';
      killText.fontSize = 30;
      kill.content = killText;

      kill.onPointerUpObservable.add(OnKillClicked);

    }
    if (this.role == 'doctor') {
      let save = new GUI.HolographicButton('Save them');
      guiPanel.addControl(save);
      let saveText = new GUI.TextBlock();
      saveText.text = 'Save Them';
      saveText.color = 'white';
      saveText.fontSize = 30;
      save.content = saveText;
    }

    let vote = new GUI.HolographicButton('Vote Out');
    guiPanel.addControl(vote);

    // play
    let voteText = new GUI.TextBlock();
    voteText.text = 'Vote Out';
    voteText.color = 'white';
    voteText.fontSize = 30;
    vote.content = voteText;
    vote.onPointerUpObservable.add(OnVoteClicked);

    var selectedMesh;

    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          if (
            pointerInfo.pickInfo.hit &&
            pointerInfo.pickInfo.pickedMesh != this.ground
          ) {
            var selected = pointerInfo.pickInfo.pickedMesh;
            if (selected != null && selected.name.includes('player'))
              selected.renderOutline = true;
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
