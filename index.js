const canvas = document.querySelector('canvas'); //reference any element within the html
const context = canvas.getContext('2d'); //setting the api to 2d

canvas.width = 1024; //can do this in css obv these num are to ensure it works on any screen
canvas.height = 576;

context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

//creating an html image object because .drawImage cannot work with just the source like ./img/x town.png
const image = new Image();
image.src = './img/Aiden town.png'
console.log(image);

//because it takes very long for it to load and the code is being called instantly so the image is not loading to make it load we use this
image.onload = () => {
    context.drawImage(image, -1100, -500);
}