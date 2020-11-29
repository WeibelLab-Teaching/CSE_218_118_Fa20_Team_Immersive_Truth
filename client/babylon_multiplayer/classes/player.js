/* global BABYLON */
/* global World */
import Billboard from './billboard.js';
import BABYLON from 'babylonjs';
import ControlPanel from './controlPanel.js';
import 'babylonjs-loaders';

export default class Player {

    constructor(id, username, position, scene) {
        this.id = id;
        this.role = 'mafia'
        this.name = username
        this.mesh = null
        BABYLON.SceneLoader.ImportMesh("", "src/assets/scenes/", "player_clothed.obj", scene, function(newMeshes, particleSystems, skeletons) {
            //Locations of players
            var x_val = position;
            var y_val = -0.6;
            var z_val = id > 4 ? -4.7 : 2.6;

            var Avatar = newMeshes[0];
            Avatar.name = "player" + id;
            Avatar.scaling = new BABYLON.Vector3(0.22, 0.22, 0.22);
            Avatar.outlineWidth = 0.1;
            Avatar.outlineColor = new BABYLON.Color4(1, 0.2, 0.3, 1.0);

            Avatar.renderOutline = false;

            // Avatar 1 location and shadows
            Avatar.position.x = x_val;
            Avatar.position.y = y_val;
            Avatar.position.z = z_val;

            Avatar.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI);
            Avatar.receiveShadows = true;
            new Billboard(Avatar, username);
            new ControlPanel(Avatar, 'name', scene);
        });

        Player.all.push(this);
    }

    //Destroy player meshes
    destroy() {
        this.billboard.mesh.dispose();
        this.mesh.dispose();
    }

    //Find existing player or create if not exists
    static find(playerID, username) {
        //Check if player is in our list
        for (var objPlayer of Player.all) {
            if (objPlayer.id === playerID) {
                //Found player, so lets return it
                return (objPlayer);
            }
        };
        //Player doesn't exist, so lets create a new one
        return (new Player(playerID, username));
    }

    static init() {
        Player.material = new BABYLON.StandardMaterial("matPlayer", scene);
        Player.material.diffuseColor = new BABYLON.Color3.Red();
    }

    //Find player and move them
    static move(data) {
        var playerID = parseInt(data.id);
        var objPlayer = Player.find(playerID, data.username);
        objPlayer.transform(data.x, data.y, data.z, data.rotation);
    }

    //Remove player from world
    static remove(playerID) {
        for (var objPlayer of Player.all) {
            if (objPlayer.id === playerID) {
                objPlayer.destroy();
                break;
            }
        }

        //Remove me from list of all players
        Player.all = Player.all.filter((obj) => {
            return obj.id !== playerID;
        });
    }

    //Change position and rotation
    transform(x, y, z, rotation) {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
        this.mesh.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, -rotation, 0);
    }
}

Player.all = new Array();