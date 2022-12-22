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
  name: "Draggle",
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
  name: "emby",
});

const renderedSprites = [draggle, emby];

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprites) => {
    sprites.draw();
  });
}

animateBattle();
//event listeners for our attack buttons
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML];
    emby.attack({
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites,
    });
  });
});
