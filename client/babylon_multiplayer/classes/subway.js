/* global BABYLON */
import BABYLON from 'babylonjs';
import 'babylonjs-loaders';

export default class Subway {
    constructor(scene) {
        this.scene = scene;

        this.positions = [11.6, 10, 8.5, 11.6, 8.5, 7, 7];

        // setupGround();
        this.setupSubway();
    }

    setupSubway() {
        var subwaylight = new BABYLON.PointLight(
            'light2',
            new BABYLON.Vector3(11, 4.1, -1.5),
            // new BABYLON.Vector3(0, -1, 0),
            // 6,
            // 0.2,
            this.scene
        );
        var subwaylight2 = new BABYLON.PointLight(
            'light3',
            new BABYLON.Vector3(-7, 4, -1.5),
            // new BABYLON.Vector3(0, -1, 0),
            // 6,
            // 0.5,
            this.scene
        );

        subwaylight.intensity = 0.7;
        subwaylight2.intensity = 0.5;

        subwaylight.diffuse = BABYLON.Color3.White();
        // var mySphere = BABYLON.MeshBuilder.CreateSphere("mySphere", {
        //     diameter: 1
        // }, this.scene);
        // mySphere.position.y = 1.5;
        // mySphere.position.x = 7;
        // mySphere.material = new BABYLON.StandardMaterial()
        // mySphere.material.diffuseColor = new BABYLON.Color3.Red()
        // var shadowGenerator = new BABYLON.ShadowGenerator(1024, subwaylight);
        // shadowGenerator.useBlurExponentialShadowMap = true;
        // shadowGenerator.useKernelBlur = true;
        // shadowGenerator.blurKernel = 64;
        // var shadowGenerator2 = new BABYLON.ShadowGenerator(1024, subwaylight2);
        // shadowGenerator2.useBlurExponentialShadowMap = true;
        // shadowGenerator2.useKernelBlur = true;
        // shadowGenerator2.blurKernel = 64;
        var gl = new BABYLON.GlowLayer('glow', this.scene);
        var scene = this.scene;
        BABYLON.SceneLoader.ImportMesh(
            null,
            'src/assets/scenes/',
            'subway.obj',
            this.scene,
            function (newMeshes) {
                for (var i = 0; i < newMeshes.length; i++) {
                    console.log(newMeshes[i].name);
                    newMeshes[i].position.x = 0;
                    newMeshes[i].position.y = 0.001;
                    newMeshes[i].position.z = -1;
                    newMeshes[i].scaling = new BABYLON.Vector3(4, 2, 2);
                    newMeshes[i].rotate(new BABYLON.Vector3(0, 1, 0), -3.141592 / 2);
                    // shadowGenerator.getShadowMap().renderList.push(newMeshes[i]);
                    newMeshes[i].receiveShadows = false;
                }

                var lightsMesh = newMeshes[3];
                lightsMesh.material = new BABYLON.StandardMaterial();
                lightsMesh.material.emissiveColor = new BABYLON.Color3(0.5, 0.4, 0.2);
                gl.addIncludedOnlyMesh(lightsMesh);
                gl.intensity = 0.8;
                var metalMesh1 = newMeshes[2];
                metalMesh1.material = new BABYLON.PBRMetallicRoughnessMaterial(
                    'pbr1',
                    scene
                );
                var metalMesh2 = newMeshes[4];
                metalMesh2.material = new BABYLON.PBRMetallicRoughnessMaterial(
                    'pbr2',
                    scene
                );
                var metalMesh3 = newMeshes[5];
                metalMesh3.material = new BABYLON.PBRMetallicRoughnessMaterial(
                    'pbr3',
                    scene
                );
            }
        )
    }
}
