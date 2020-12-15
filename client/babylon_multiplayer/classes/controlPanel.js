import BABYLON from 'babylonjs';
import Player from './player.js';
import GUI from 'babylonjs-gui';
import 'babylonjs-loaders';
import Gameroom from '../../src/views/GameRoom.vue'
export default class ControlPanel {
  constructor(role, scene, io, isHost) {
    this.isHost = isHost;
    this.scene = scene;
    this.role = role;
    this.io = io;
    this.enabled = true
    this.kill = null;
    this.vote = null;
    this.create();

    io.on('day', () => {
      console.log("in day in control panel")
      if (this.guiPanel != null) {
        console.log(this.vote)
        console.log(this.guiPanel.containsControl(this.vote))
        if (this.vote == null) {
          let vote = new GUI.HolographicButton('Vote Out');
          this.guiPanel.addControl(vote);

          let voteText = new GUI.TextBlock();
          voteText.text = 'Vote Out';
          voteText.color = 'white';
          voteText.fontSize = 30;
          vote.content = voteText;
          vote.onPointerUpObservable.add(() => this.OnVoteClicked(this.enabled, this.selectedMesh));
          this.vote = vote
        }
        if (this.kill != null) {
          this.kill.dispose()
          this.kill = null
        }
      }
    });

    io.on('night', () => {
      if (this.guiPanel != null) {
        if (this.vote != null) {
          this.vote.dispose()
          this.vote = null
        }
        if (this.role == 'mafia' && this.kill == null) {
          let kill = new GUI.HolographicButton('Kill them');
          this.guiPanel.addControl(kill);

          var killText = new GUI.TextBlock();
          killText.text = 'Kill Them';
          killText.color = 'white';
          killText.fontSize = 30;
          kill.content = killText;

          kill.onPointerUpObservable.add(() => this.OnKillClicked(this.enabled, this.selectedMesh));

          this.kill = kill
        }

      }
    });

  }

  OnStartClicked() {
    console.log('Game Starting')
    this.io.emit('start');
    this.start.dispose();
  }

  OnVoteClicked(enabled, selectedMesh) {
    if (enabled && selectedMesh != null && selectedMesh.name.includes('player')) {
      console.log("Voted for " + selectedMesh.name)
      var votedPlayer = selectedMesh.name.replace("player", "")
      console.log("socket id: " + votedPlayer)
      this.io.emit('vote', votedPlayer);
    }
  }

  OnKillClicked(enabled, selectedMesh) {
    if (enabled && selectedMesh != null && selectedMesh.name.includes('player')) {
      console.log(selectedMesh.name + ' has been eliminated');


      var killedPlayer = selectedMesh.name.replace("player", "")
      this.io.emit("kill", killedPlayer)
      selectedMesh.renderOutline = false;
      selectedMesh = null;
    }
  }

  create() {
    var hl = new BABYLON.HighlightLayer('hl1', this.scene);
    hl.innerGlow = true;
    hl.outerGlow = false;
    var color = 0;

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
    // if (this.role == 'mafia') {
    //   let kill = new GUI.HolographicButton('Kill them');
    //   // guiPanel.addControl(kill);

    //   var killText = new GUI.TextBlock();
    //   killText.text = 'Kill Them';
    //   killText.color = 'white';
    //   killText.fontSize = 30;
    //   kill.content = killText;

    //   kill.onPointerUpObservable.add(() => this.OnKillClicked(this.enabled, selectedMesh));

    //   this.kill = kill
    // }

    // play
    // if (true) {
    //   let vote = new GUI.HolographicButton('Vote Out');
    //   // guiPanel.addControl(vote);

    //   let voteText = new GUI.TextBlock();
    //   voteText.text = 'Vote Out';
    //   voteText.color = 'white';
    //   voteText.fontSize = 30;
    //   vote.content = voteText;
    //   vote.onPointerUpObservable.add(() => this.OnVoteClicked(this.enabled, selectedMesh));

    //   this.vote = vote
    // }


    if (this.isHost) {
      this.start = new GUI.HolographicButton('Start Game');
      guiPanel.addControl(this.start);
      let startText = new GUI.TextBlock();
      startText.text = 'Start';
      startText.color = 'white';
      startText.fontSize = 30;
      this.start.content = startText;
      this.start.onPointerUpObservable.add(() => this.OnStartClicked());
    }
    this.selectedMesh;
    this.guiManager = guiManager
    this.guiPanel = guiPanel
    this.scene.onPointerObservable.add((pointerInfo) => {
      var selectedMesh = this.selectedMesh
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
            this.selectedMesh = selected;
          }
          break;
      }
    });
  }


}
