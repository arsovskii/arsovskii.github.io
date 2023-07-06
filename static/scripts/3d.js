import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { SSAARenderPass } from 'three/addons/postprocessing/SSAARenderPass.js'

import computerUrl from '/static/models/computer.gltf?url';
import magionicarUrl from '/static/models/magionicar.gltf?url';


const numOfElements = 10;

const loader = new GLTFLoader();
const scene = new THREE.Scene();




const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const container = document.getElementById("background3D");

const renderer = new THREE.WebGLRenderer({ alpha: true, antialiasing: true });


renderer.setClearColor((0x0f1a28), 0);
scene.background = new THREE.Color(0x0f1a28);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio * 1.5)

container.appendChild(renderer.domElement);

const ssaa = new SSAARenderPass(scene, camera, new THREE.Color(0x0f1a28), false)


// var parameters = {format: THREE.RGBAFormat};
// var renderTarget = new THREE.WebGLRenderTarget(window.innerWidth || 1, window.innerHeight || 1, parameters);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight || 1), 0.9, 3, 0.5);
const composer = new EffectComposer(renderer)//,renderTarget);

composer.addPass(ssaa);
composer.addPass(bloomPass);


camera.position.z = 5;


var elems = [];

loader.load(computerUrl, function (gltf) {

    for (let i = 0; i < numOfElements; i++) {
        let curr = gltf.scene.clone()
        curr.position.x = THREE.MathUtils.randFloat(-50, 50);
        curr.position.y = THREE.MathUtils.randFloat(-10, 40);
        curr.position.z = THREE.MathUtils.randFloat(-20, -40);

        curr.rotation.x = THREE.MathUtils.randFloat(0, 10);
        curr.rotation.y = THREE.MathUtils.randFloat(0, 10);

        scene.add(curr);
        elems.push({});
        elems[i]['elem'] = curr;
        elems[i]['xRot'] = THREE.MathUtils.randFloat(-0.01, 0.01);
        elems[i]['yRot'] = THREE.MathUtils.randFloat(-0.01, 0.01);

    }
    loader.load(magionicarUrl, function (magionicar) {

        for (let i = numOfElements; i < numOfElements * 2; i++) {

            let curr = magionicar.scene.clone()
            curr.scale.x = 2;
            curr.scale.y = 2;

            curr.position.x = THREE.MathUtils.randFloat(-50, 50);
            curr.position.y = THREE.MathUtils.randFloat(-10, 40);
            curr.position.z = THREE.MathUtils.randFloat(-20, -40);

            curr.rotation.x = THREE.MathUtils.randFloat(0, 10);
            curr.rotation.y = THREE.MathUtils.randFloat(0, 10);

            scene.add(curr);
            elems.push({});
            elems[i]['elem'] = curr;
            elems[i]['xRot'] = THREE.MathUtils.randFloat(-0.01, 0.01);
            elems[i]['yRot'] = THREE.MathUtils.randFloat(-0.01, 0.01);

        }
        animate();

    }, undefined, function (error) {

        console.error(error);

    });


}, undefined, function (error) {

    console.error(error);

});
const light = new THREE.PointLight(0xffffff, 0.5);
light.position.set(1, 10, 2);

scene.add(light);



function animate() {

    for (let i = 0; i < numOfElements * 2; i++) {
        elems[i]['elem'].rotation.x += elems[i]['xRot'];
        elems[i]['elem'].rotation.y += elems[i]['yRot'];
        elems[i]['elem'].position.x += elems[i]['xRot'] * THREE.MathUtils.randInt(-1, 1);
        elems[i]['elem'].position.y += elems[i]['yRot'] * THREE.MathUtils.randInt(-1, 1);;
    }


    requestAnimationFrame(animate);



    composer.render();


}