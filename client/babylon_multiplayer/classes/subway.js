/* global Avatar */
/* global BABYLON */
import Avatar from "./avatar.js";
import BABYLON from 'babylonjs'
import 'babylonjs-loaders'

export default class Subway {
    static init() {
        Subway.canvas = document.getElementById('renderCanvas');
        var engine = new BABYLON.Engine(Subway.canvas, true);

        Subway.scene = new BABYLON.Scene(engine);
        Subway.setupCamera();
        Subway.setupLightsAndShadows();
        Subway.setupGround();
        Subway.setupSubway();

        //magic vr line
        var vrHelper = Subway.scene.createDefaultVRExperience({
          createDeviceOrientationCamera: true,
        });
        vrHelper.enableInteractions();
        vrHelper.touch = true;
        vrHelper.displayLaserPointer = true;
        vrHelper.deviceOrientationCamera.disablePointerInputWhenUsingDeviceOrientation = false;

        engine.runRenderLoop(() => {
            Subway.scene.render();
            Avatar.update();
            //Subway.updateCamera();
        });

        //Resize event
        window.addEventListener("resize", () => {
            engine.resize();
        });
    }

    static setupCamera() {
        // Subway.camera = new BABYLON.FreeCamera("thirdPersonCam", BABYLON.Vector3.Zero(), Subway.scene);
        // Subway.camera.position.x -= Math.sin(-Math.PI / 2) * -1 * Subway.cameraDistance;
        // Subway.camera.position.y = Avatar.height + Avatar.height / 2;
        // Subway.camera.position.z -= Math.cos(-Math.PI / 2) * -1 * Subway.cameraDistance;
        // var lookAt = BABYLON.Vector3.Zero();
        // lookAt.y = Avatar.height + Avatar.height / 2;
        // Subway.camera.setTarget(lookAt);
        // Subway.scene.activeCameras.push(Subway.camera);

        // This creates and positions a free camera (non-mesh)
        var camera = new BABYLON.FlyCamera(
          "camera1",
          new BABYLON.Vector3(10, 2.8, -4.8),
          Subway.scene
        );

        // This targets the camera to scene origin
        //camera.setTarget(new BABYLON.Vector3(10, 2, 3));

        // This attaches the camera to the canvas
        //camera.attachControl(Subway.canvas, true);
    }

    static setupGround() {
        // var ground = BABYLON.MeshBuilder.CreateGround("ground", { height: 3, width: 3, subdivisions: 4 }, Subway.scene);
        // ground.position = BABYLON.Vector3.Zero();
        // ground.material = new BABYLON.StandardMaterial("matGround", Subway.scene);
        // ground.material.diffuseTexture = new BABYLON.Texture("ground.jpg", Subway.scene);

        Subway.ground = BABYLON.MeshBuilder.CreateGround(
          "ground",
          {
            width: 6,
            height: 6,
          },
          Subway.scene
        );
        Subway.ground.receiveShadows = true;
    }

    static setupLightsAndShadows() {
        // var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0.5), Subway.scene);
        // light.intensity = 0.5;
        var subwaylight = new BABYLON.SpotLight(
            "light2",
            new BABYLON.Vector3(7, 10, 0),
            new BABYLON.Vector3(0, -1, 0),
            3,
            2,
            Subway.scene
        );
        subwaylight.diffuse = new BABYLON.Color3.White();
        var subwaylight2 = new BABYLON.SpotLight(
            "light3",
            new BABYLON.Vector3(-7, 10, 0),
            new BABYLON.Vector3(0, -1, 0),
            3,
            2,
            Subway.scene
        );
        subwaylight2.diffuse = new BABYLON.Color3.Red();

        subwaylight.intensity = .5;

        // Setup shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, subwaylight);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.useKernelBlur = true;
        shadowGenerator.blurKernel = 64;
        var shadowGenerator2 = new BABYLON.ShadowGenerator(1024, subwaylight2);
        shadowGenerator2.useBlurExponentialShadowMap = true;
        shadowGenerator2.useKernelBlur = true;
        shadowGenerator2.blurKernel = 64;
    }

    static updateCamera() {
        if (Avatar.mesh !== null) {
            Subway.camera.position.x = Avatar.mesh.position.x;
            Subway.camera.position.y = Avatar.mesh.position.y + Avatar.height;
            Subway.camera.position.z = Avatar.mesh.position.z;
            Subway.camera.position.z -= Math.sin(Avatar.absoluteRotation - Math.PI) * -1 * Subway.cameraDistance;
            Subway.camera.position.x -= Math.cos(Avatar.absoluteRotation - Math.PI) * -1 * Subway.cameraDistance;
            var lookAt = new BABYLON.Vector3(Avatar.mesh.position.x, Avatar.mesh.position.y + Avatar.height, Avatar.mesh.position.z);
            Subway.camera.setTarget(lookAt);
        }
    }

    static setupSubway() {
        var subwaylight = new BABYLON.SpotLight(
            "light2",
            new BABYLON.Vector3(7, 10, 0),
            new BABYLON.Vector3(0, -1, 0),
            3,
            2,
            Subway.scene
        );
        subwaylight.diffuse = new BABYLON.Color3.White();
        var subwaylight2 = new BABYLON.SpotLight(
            "light3",
            new BABYLON.Vector3(-7, 10, 0),
            new BABYLON.Vector3(0, -1, 0),
            3,
            2,
            Subway.scene
        );
        subwaylight2.diffuse = new BABYLON.Color3.Red();

        subwaylight.intensity = 3;

        // Setup shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, subwaylight);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.useKernelBlur = true;
        shadowGenerator.blurKernel = 64;
        var shadowGenerator2 = new BABYLON.ShadowGenerator(1024, subwaylight2);
        shadowGenerator2.useBlurExponentialShadowMap = true;
        shadowGenerator2.useKernelBlur = true;
        shadowGenerator2.blurKernel = 64;

        BABYLON.SceneLoader.ImportMesh(
            null,
            "src/assets/scenes/",
            "subway (with modifiers).obj",
            Subway.scene,
            function (newMeshes) {
                for (var i = 0; i < newMeshes.length; i++) {
                    newMeshes[i].position.x = 0;
                    newMeshes[i].position.y = 0.001;
                    newMeshes[i].position.z = -1;
                    newMeshes[i].scaling = new BABYLON.Vector3(4, 2, 2);
                    newMeshes[i].rotate(new BABYLON.Vector3(0, 1, 0), -3.141592 / 2);
                    shadowGenerator.getShadowMap().renderList.push(newMeshes[i]);
                    newMeshes[i].receiveShadows = true;
                }
            }
        );
    }
}

Subway.cameraDistance = 1.5;