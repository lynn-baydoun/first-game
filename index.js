const canvas = document.querySelector("canvas"); //reference any element within the html
const context = canvas.getContext("2d"); //setting the api to 2d

canvas.width = 1024; //can do this in css obv these num are to ensure it works on any screen
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  // 70 is the width of the map this is looping through the collision array in increments
  collisionsMap.push(collisions.slice(i, 70 + i));
}

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  // 70 is the width of the map this is looping through the collision array in increments
  battleZonesMap.push(battleZonesData.slice(i, 70 + i));
}

const boundaries = [];
const offset = {
  x: -980,
  y: -600,
};
collisionsMap.forEach((row, i) => {
  // i is to loop over the arrays (all of the arrays)
  row.forEach((symbol, j) => {
    //j is to loop through the elements within the arrays
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x, // this will lay out the 'tiles' aka array elements perfectly on our map
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const battleZones = [];
battleZonesMap.forEach((row, i) => {
  // i is to loop over the arrays (all of the arrays)
  row.forEach((symbol, j) => {
    //j is to loop through the elements within the arrays
    if (symbol === 1025)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x, // this will lay out the 'tiles' aka array elements perfectly on our map
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});
console.log(battleZones);
//creating an html image object because .drawImage cannot work with just the source like ./img/x town.png
const image = new Image();
image.src = "./img/AidenTown.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/4groundObj.png";

const playerDown = new Image();
playerDown.src = "./img/playerDown.png";

const playerUp = new Image();
playerUp.src = "./img/playerUp.png";

const playerLeft = new Image();
playerLeft.src = "./img/playerLeft.png";

const playerRight = new Image();
playerRight.src = "./img/playerRight.png";

//because it takes very long for it to load and the code is being called instantly so the image is not loading to make it load we use this
// image.onload = () => {
//     context.drawImage(image, -980, -600);
//     context.drawImage(
//         playerDown,
//         0, //starting to crop the sprite sheet from the beginning (the left)
//         0, //
//         playerDown.width/4, //crop width
//         playerDown.height, // height
//         canvas.width/2 - (playerDown.width/4)/2,
//         canvas.height/2 - playerDown.height/2,
//         playerDown.width/4, //width of which the image will be rendered out at
//         playerDown.height, //height of which the image will be rendered out at
//         );
// }

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2, //the 192x68 are the dimensions of the image you can find them in properties -> details
    y: canvas.height / 2 + 30 - 68 / 2,
  },
  image: playerDown,
  frames: { max: 4, hold: 10 },
  sprites: {
    up: playerUp,
    down: playerDown,
    left: playerLeft,
    right: playerRight,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});
const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
});
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, ...boundaries, foreground, ...battleZones];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    player.position.x + player.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

const battle = {
  initiated: false,
};
function animate() {
  const animationId = window.requestAnimationFrame(animate); //creates an infinite loop

  //we need to keep rerendering it as the animation is going
  background.draw();
  //adding all the boundaries
  boundaries.forEach((boundary) => {
    //we cannot put a break statement inside a forEach
    boundary.draw();
  });
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });
  player.draw();
  foreground.draw();

  let moving = true;
  //telling the character to move
  player.animate = false;

  console.log(animationId);
  if (battle.initiated) return;
  //activate a battle
  if (keys.w.pressed || keys.s.pressed || keys.a.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
        Math.max(player.position.x, battleZone.position.x) *
          (Math.min(
            player.position.y,
            battleZone.position.y + battleZone.height
          ) -
            Math.max(player.position.y, battleZone.position.y));

      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.01
      ) {
        console.log("activate battle");
        //deactivate old animation loop
        window.cancelAnimationFrame(animationId);
        battle.initiated = true;
        gsap.to("#overlappingDiv", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                //new animation loop for
                animateBattle();
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });
        break;
      }
    }
  }

  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
    }
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
    }
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
    }
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];

      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving) {
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
    }
  }
}
//animate();

const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

//first monster
const draggleImage = new Image();
draggleImage.src = "./img/draggleSprite.png";

const draggle = new Sprite({
  position: {
    x: 800,
    y: 100,
  },
  image: draggleImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
  isEnemy: true,
});

const embyImage = new Image();
embyImage.src = "./img/embySprite.png";

const emby = new Sprite({
  position: {
    x: 280,
    y: 325,
  },
  image: embyImage,
  frames: {
    max: 4,
    hold: 30,
  },
  animate: true,
});

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  draggle.draw();
  emby.draw();
}

animateBattle();
//event listeners for our attack buttons
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    emby.attack({
      attack: Tackle,
      recipient: draggle,
    });
  });
});

let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
