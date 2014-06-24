/**
 * Created by Jordan on 07/03/14.
 */

// Socket
var socket = io.connect('http://127.0.0.1:9003');
/* Traitement de l'événement client: tweet (donné d'un tweet reçu par le tracking) */
socket.on('tweet', function (data,type) 
{
    console.log("pays:"+data.place.country+" ville:"+data.place.name);
    /* Ajout du texte du tweet dans le container de message */
    var containerMessage = document.getElementById("containerMessage");
    containerMessage.innerHTML = containerMessage.innerHTML + '<p class="message '+type+'" >' + data.text + '</p>';
    containerMessage.scroollTop += containerMessage.innerHeight;

    /* Suppression du premier message tout les 10 messages */ 
    var messages = document.getElementsByClassName("message");
    if(messages.length > 10)containerMessage.removeChild(messages[0]); 

    // Creating point on earth
    CreatePointInEarth(earth,0.50,data.geo.coordinates[0],data.geo.coordinates[1],type)
});

// Global Standard Variable
var scene,camera,renderer;
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var EarthRotation = 0.003;
var controls;
var earth,light,sky;
var windowResize;
var THREEx ;



// Init
function init () 
{
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45,windowWidth/windowHeight,0.01,1000);
    camera.position.z = 1.5;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(windowWidth,windowHeight);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    document.body.appendChild(renderer.domElement);

    light = new THREE.DirectionalLight(0xffffff,1);
    light.position.set(5,3,1);

    // Earth
    earth = new THREE.Mesh
    (
        new THREE.SphereGeometry( 0.5, 32, 32 ),
        new THREE.MeshPhongMaterial
        ({
            map: THREE.ImageUtils.loadTexture('images/2_no_clouds_8k.jpg'),
            bumpMap: THREE.ImageUtils.loadTexture('images/earthbump1k.jpg'),
            specularMap: THREE.ImageUtils.loadTexture('images/earthspec1k.jpg'),
            specular: new THREE.Color('grey'),
            bumpScale:   0.005
        })
    );

    // Sky
    sky = new THREE.Mesh
    (
        new THREE.SphereGeometry(0, 64, 64),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'),
            side: THREE.BackSide
        })
    );

    windowResize = THREEx.WindowResize(renderer, camera);
    // Add objects to the scene
    scene.add(new THREE.AmbientLight(0x333333));
    scene.add(light);
    scene.add(earth);
    scene.add(sky);

};

// Render
function render()
{
    camera.lookAt( scene );
    controls.update();
    earth.rotation.y += EarthRotation; 
    requestAnimationFrame(render);
    renderer.render(scene,camera);
};
// Function for placing point on earth with the longitude an latitude
function CreatePointInEarth(object,rayon,latitude,longitude,type)
{
    var colorPoint;
    // switch type of point
    switch(type)
    {
        case 'love':
            colorPoint = 0xFF99FF;
        break;
        case 'cool':
            colorPoint = 0x66CCFF;
        break;
        case 'happy':
            colorPoint = 0x2ecc71;
        break;
        case 'work':
            colorPoint = 0xf1c40f;
        break;
        case 'sad':
            colorPoint = 0xc0392b;
        break;
        default:
            colorPoint = 0xffffff;
        break
    }
    // 
    var phi = Math.PI/2 - (latitude * Math.PI / 180);
    var theta = 2 * Math.PI - (longitude * Math.PI / 180);
        
    /* creation d'un point rouge */
    var point = new THREE.Mesh
    (
        new THREE.SphereGeometry(0.004,32,32),
        new THREE.MeshBasicMaterial( { color: colorPoint, transparent: true }  )
    );

    /* positionnement du point d'après l'équation d'un point sur une sphère */
    point.position.x = rayon * Math.sin(phi) * Math.cos(theta);
    point.position.y = rayon * Math.cos(phi);
    point.position.z = rayon * Math.sin(phi) * Math.sin(theta); 

    /* ajout du point sur la sphère */
    object.add(point);
};

function resizeEarth()
{
    /** @namespace */

     THREEx  = THREEx        || {};
    /**
     * Update renderer and camera when the window is resized
     * 
     * @param {Object} renderer the renderer to update
     * @param {Object} Camera the camera to update
    */
    THREEx.WindowResize = function(renderer, camera){
        var callback    = function(){
    renderer.setSize( window.innerWidth, window.innerHeight );
            camera.aspect   = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        }
        window.addEventListener('resize', callback, false);
        return {
            /**
             * Stop watching window resize
            */
            stop    : function()
            {
                window.removeEventListener('resize', callback);
            }
        };
    }
};

    /* appel des fonctions */
    resizeEarth();
    init();
    render();

