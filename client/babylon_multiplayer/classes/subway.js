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
        var subwaylight = new BABYLON.PointLight(
            "light2",
            new BABYLON.Vector3(11, 4.1, -1.5),
            // new BABYLON.Vector3(0, -1, 0),
            // 6,
            // 0.2,
            this.scene
        );
        var subwaylight2 = new BABYLON.PointLight(
            "light3",
            new BABYLON.Vector3(-7, 4, -1.5),
            // new BABYLON.Vector3(0, -1, 0),
            // 6,
            // 0.5,
            this.scene
        );

        subwaylight.intensity = .8;
        subwaylight2.intensity = .5;
        // var mySphere = BABYLON.MeshBuilder.CreateSphere("mySphere", {
        //     diameter: 1
        // }, this.scene);
        // mySphere.position.y = 1.5;
        // mySphere.position.x = 7;
        // mySphere.material = new BABYLON.StandardMaterial()
        // mySphere.material.diffuseColor = new BABYLON.Color3.Red()
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
            "subwayV2.obj",
            this.scene,
            function(newMeshes) {
                for (var i = 0; i < newMeshes.length; i++) {
                    newMeshes[i].position.x = 0;
                    newMeshes[i].position.y = 0.001;
                    newMeshes[i].position.z = -1;
                    newMeshes[i].scaling = new BABYLON.Vector3(3, 2, 2);
                    newMeshes[i].rotate(new BABYLON.Vector3(0, 1, 0), -3.141592 / 2);
                    // shadowGenerator.getShadowMap().renderList.push(newMeshes[i]);
                    newMeshes[i].receiveShadows = true;
                }
            }
        );
    }
}