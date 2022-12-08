const canvas = document.querySelector('canvas'); //reference any element within the html
const context = canvas.getContext('2d'); //setting the api to 2d


canvas.width = 1024; //can do this in css obv these num are to ensure it works on any screen
canvas.height = 576;

const collisionsMap = []
for(let i = 0; i < collisions.length; i+=70){ // 70 is the width of the map this is looping through the collision array in increments 
    collisionsMap.push(collisions.slice(i, 70 + i));
}
class Boundary{
    static width = 48; //this is only in case i forget what 48 is for
    static height = 48;
    constructor({position}){
        this.position = position;
        this.width = 48; //don't forget that we imported this map 4 times its actual size 12x4
        this.height = 48;
    }
    draw(){
        context.fillStyle = 'red';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const boundaries = []
const offset ={
    x:-980,
    y:-600 
}
collisionsMap.forEach((row, i) =>{ // i is to loop over the arrays (all of the arrays)
    row.forEach((symbol, j) =>{ //j is to loop through the elements within the arrays
        if(symbol === 1025)
        boundaries.push(
            new Boundary({
                position:{
                    x: j * Boundary.width + offset.x,  // this will lay out the 'tiles' aka array elements perfectly on our map
                    y: i * Boundary.height + offset.y, 
                }
            })
        );
    })
})


//creating an html image object because .drawImage cannot work with just the source like ./img/x town.png
const image = new Image();
image.src = './img/AidenTown.png'

const playerImage = new Image();
playerImage.src = './img/playerDown.png';

//because it takes very long for it to load and the code is being called instantly so the image is not loading to make it load we use this
// image.onload = () => {
//     context.drawImage(image, -980, -600);
//     context.drawImage(
//         playerImage,
//         0, //starting to crop the sprite sheet from the beginning (the left)
//         0, //
//         playerImage.width/4, //crop width
//         playerImage.height, // height 
//         canvas.width/2 - (playerImage.width/4)/2, 
//         canvas.height/2 - playerImage.height/2,
//         playerImage.width/4, //width of which the image will be rendered out at
//         playerImage.height, //height of which the image will be rendered out at
//         );
// }
class Sprite{
    constructor({position, velocity, image, frames = {max: 1}}) {
        this.position = position;
        this.image = image;
        this.frames = frames;
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;
        }
    }

    draw(){
        context.drawImage(
            this.image,
            0, //starting to crop the sprite sheet from the beginning (the left)
            0, //
            this.image.width/this.frames.max, 
            this.image.height, // height 
            this.position.x, //the placement of our sprite
            this.position.y, 
            this.image.width/this.frames.max, //width of which the image will be rendered out at
            this.image.height, //height of which the image will be rendered out at
            );
    }
}

const player = new Sprite({
    position:{
        x: canvas.width/2 - (192/4)/2, //the 192x68 are the dimensions of the image you can find them in properties -> details
        y: canvas.height/2 - 68/2,
    },
    image: playerImage,
    frames: {max: 4}
})

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
});
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const movables = [background, ...boundaries]

function rectangularCollision({rectangle1, rectangle2}){
    return(player.position.x + player.width >= rectangle2.position.x && 
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

function animate(){
    window.requestAnimationFrame(animate); //creates an infinite loop
    //we need to keep rerendering it as the animation is going
    background.draw();
    player.draw();
    //adding all the boundaries
    boundaries.forEach(boundary => { //we cannot put a break statement inside a forEach
        boundary.draw();
    })
    
    let moving = true;
    //telling the character to move
    if(keys.w.pressed && lastKey === 'w') {
            //the for loop is to predict whether or not you character is going to collide with a boundary
            for(let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];
                //detecting for collision
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary, position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }}
                }))
                // player.position.x + player.width >= testBoundary.position.x && 
                // player.position.x <= testBoundary.position.x + testBoundary.width &&
                // player.position.y <= testBoundary.position.y + testBoundary.height &&
                // player.position.y + player.height >= testBoundary.position.y)
                {
                   moving = false;
                   break;
                }
            }
        if(moving){
            movables.forEach(movable =>{
                movable.position.y += 3;
            });
        }
        }
    else if(keys.a.pressed && lastKey === 'a')  {
        movables.forEach(movable =>{
            movable.position.x += 3;
        });
        }
    else if(keys.s.pressed && lastKey === 's')  {
        movables.forEach(movable =>{
            movable.position.y -= 3;
        });
        }
    else if(keys.d.pressed && lastKey === 'd')  {
        movables.forEach(movable =>{
            movable.position.x -= 3;
        });
       }
}
animate();

let lastKey = ''
window.addEventListener('keydown',(e) => {
    switch (e.key) {
        case 'w':
           keys.w.pressed = true;
           lastKey = 'w'
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a'
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's'
            break;
         case 'd':
            keys.d.pressed = true;
            lastKey = 'd'
            break
    }
})
window.addEventListener('keyup',(e) => {
    switch (e.key) {
        case 'w':
           keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
         case 'd':
            keys.d.pressed = false;
            break
    }
})