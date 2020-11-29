/* global Avatar */
/* global BABYLON */
import Avatar from "./avatar.js";
import BABYLON from 'babylonjs'
import 'babylonjs-loaders'

export default class Subway {
    constructor(scene) {
        this.scene = scene

        this.positions = [11.6, 10, 8.5, 7, 11.6, 8.5, 7];

        // setupGround();
        this.setupSubway();
    }

    setupSubway() {
        var subwaylight = new BABYLON.SpotLight(
            "light2",
            new BABYLON.Vector3(7, 10, 0),
            new BABYLON.Vector3(0, -1, 0),
            3,
            2,
            this.scene
        );
        subwaylight.diffuse = new BABYLON.Color3.White();
        var subwaylight2 = new BABYLON.SpotLight(
            "light3",
            new BABYLON.Vector3(-7, 10, 0),
            new BABYLON.Vector3(0, -1, 0),
            3,
            2,
            this.scene
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
            this.scene,
            function(newMeshes) {
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