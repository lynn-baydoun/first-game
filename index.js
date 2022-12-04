const canvas = document.querySelector('canvas'); //reference any element within the html
const context = canvas.getContext('2d'); //setting the api to 2d

canvas.width = 1024; //can do this in css obv these num are to ensure it works on any screen
canvas.height = 576;

context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

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
        context.drawImage(this.image, -980, -600);
    }
}

const background = new Sprite({
    position: {
        x:-980,
        y:-600
    },
    image: image
});
const keys{
    
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
        if();
}
animate();
window.addEventListener('keydown',(e) => {
    switch (e.key) {
        case 'w':
            
            break;
        case 'a':
            
            break;
        case 's':
            
            break;
         case 'd':
            
            break
    }
})

