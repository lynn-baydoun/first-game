const battleBackgroundImage = new Image();
battleBackgroundImage.src = "./img/battleBackground.png";

const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

//monsters
const draggle = new Monster(monsters.Draggle);
const emby = new Monster(monsters.Emby);
//we are using render so the animation and etc works within a timeline
const renderedSprites = [draggle, emby];
//the attack buttons:
const button = document.createElement("button");
button.innerHTML = "Fireball";
document.querySelector("#attacksBox").append(button);
//battle animation
function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprites) => {
    sprites.draw();
  });
}

animateBattle();
//we created a Q array to Q all the attacks from the enemy and randomize it accordingly
const queue = [];
//event listeners for our attack buttons
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML];
    emby.attack({
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites,
    });

    queue.push(() => {
      draggle.attack({
        attack: attacks.Tackle,
        recipient: emby,
        renderedSprites,
      });
    });
    queue.push(() => {
      draggle.attack({
        attack: attacks.Fireball,
        recipient: emby,
        renderedSprites,
      });
    });
  });
});
//changing the dialogue box according to our enemy's attacks
document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
});
