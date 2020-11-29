/* global BABYLON */
/* global Input */
/* global Socket */
/* global World */

export default class Avatar {

    static init() {
        BABYLON.SceneLoader.ImportMesh("", "../scenes/", "player_clothed.obj", Subway.scene, function (newMeshes, particleSystems, skeletons) {

            var Avatar = newMeshes[0];
            Avatar.name = "Avatar";
            Avatar.scaling = new BABYLON.Vector3(0.22, 0.22, 0.22);
            Avatar.outlineWidth = 0.1;
            Avatar.outlineColor = new BABYLON.Color4(1, 0.2, 0.3, 1.0);

            Avatar.renderOutline = false;

            // Avatar 1 location and shadows
            Avatar.position.x = 10;
            Avatar.position.y = -0.6;
            Avatar.position.z = 2.6;

            Avatar.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI);
            Avatar.receiveShadows = true;

            new Billboard(Avatar.mesh, Avatar.name);
        }
        );
    }

    static rotate(isLeft) {
        //Turning left
        if (isLeft) {
            Avatar.absoluteRotation -= Avatar.rotationSpeed;
            Avatar.mesh.rotate(BABYLON.Axis.Y, Avatar.rotationSpeed, BABYLON.Space.WORLD);
            //Turning right
        } else {
            Avatar.absoluteRotation += Avatar.rotationSpeed;
            Avatar.mesh.rotate(BABYLON.Axis.Y, -Avatar.rotationSpeed, BABYLON.Space.WORLD);
        }
    }

    static send() {
        var x = Avatar.mesh.position.x;
        var y = Avatar.mesh.position.y;
        var z = Avatar.mesh.position.z;
        var rot = Avatar.absoluteRotation;
        var JSON = `{"command":"transform","data":{"x":${x},"y":${y},"z":${z},"rotation":${rot}}}`;
        Socket.ws.send(JSON);
    }

    static update() {
        if (Avatar.mesh !== null) {
            //Moving forward
            if (Input.key.up) {
                var forward = new BABYLON.Vector3(Avatar.walkSpeed * Math.cos(Avatar.absoluteRotation), 0, Avatar.walkSpeed * Math.sin(Avatar.absoluteRotation));
                Avatar.mesh.moveWithCollisions(forward);
                Avatar.send();
            }
            //Turning left
            if (Input.key.left) {
                Avatar.rotate(false);
                Avatar.send();
                //Turning right
            } else if (Input.key.right) {
                Avatar.rotate(true);
                Avatar.send();
            }
        }
    }
}

Avatar.absoluteRotation = 0;
Avatar.height = 0.3;
Avatar.mesh = null;
Avatar.rotationSpeed = 0.01;
Avatar.walkSpeed = 0.007;