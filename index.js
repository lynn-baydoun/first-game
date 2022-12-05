const canvas = document.querySelector('canvas'); //reference any element within the html
const context = canvas.getContext('2d'); //setting the api to 2d


canvas.width = 1024; //can do this in css obv these num are to ensure it works on any screen
canvas.height = 576;

const collisionsMap = []
for(let i = 0; i < collisions.length; i+=70){ // 70 is the width of the map this is looping through the collision array in increments 
    collisionsMap.push(collisions.slice(i, 70 + i));
}
class Boundary{
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
collisionsMap.forEach((row, i) =>{ // i is to loop over the arrays (all of the arrays)
    row.forEach((symbol, j) =>{ //j is to loop through the elements within the arrays
        boundaries.push(
            new Boundary({
                position:{
                    x: 0, 
                    y: 0
                }
            })
        );
    })
})

//creating an html image object because .drawImage cannot work with just the source like ./img/x town.png
const image = new Image();
image.src = './img/Aiden town.png'

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
    constructor({position, velocity, image}){
        this.position = position;
        this.image = image;
    }

    draw(){
        context.drawImage(this.image, this.position.x, this.position.y);
    }
}

const background = new Sprite({
    position: {
        x:-980,
        y:-600
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

function animate(){
    window.requestAnimationFrame(animate); //creates an infinite loop
    console.log("animate");
    //we need to keep rerendering it as the animation is going
    background.draw();
    context.drawImage(
        playerImage,
        0, //starting to crop the sprite sheet from the beginning (the left)
        0, //
        playerImage.width/4, //crop width
        playerImage.height, // height 
        canvas.width/2 - (playerImage.width/4)/2, 
        canvas.height/2 - playerImage.height/2,
        playerImage.width/4, //width of which the image will be rendered out at
        playerImage.height, //height of which the image will be rendered out at
        );
       if(keys.w.pressed && lastKey === 'w') background.position.y += 3;
       else if(keys.a.pressed && lastKey === 'a') background.position.x += 3;
       else if(keys.s.pressed && lastKey === 's') background.position.y -= 3;
       else if(keys.d.pressed && lastKey === 'd') background.position.x -= 3;
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
    console.log(keys)
})

