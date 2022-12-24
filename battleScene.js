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
let draggle;
let emby;
//we are using render so the animation and etc works within a timeline
let renderedSprites;
let battleAnimationId;
//we created a Q array to Q all the attacks from the enemy and randomize it accordingly
let queue;

//to make sure the next battle loads in correctly
function initBattle() {
  draggle = new Monster(monsters.Draggle);
  emby = new Monster(monsters.Emby);
  renderedSprites = [draggle, emby];
  queue = [];

  //adding both attack buttons
  emby.attacks.forEach((attack) => {
    //the attack buttons:
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    document.querySelector("#attacksBox").append(button);
    //event listeners for our attack buttons
    document.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML];
        emby.attack({
          attack: selectedAttack,
          recipient: draggle,
          renderedSprites,
        });
        //death rip draggle
        if (draggle.health <= 0) {
          queue.push(() => {
            draggle.faint({});
          });
          queue.push(() => {
            //fade to black
            gsap.to("#overlappingDiv", {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId);
                animate();
                document.querySelector("#userinterface").style.display = "none";
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                });
              },
            });
          });
        }
        //randomizing enemy attacks
        const randomAttack =
          draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

        queue.push(() => {
          draggle.attack({
            attack: randomAttack,
            recipient: emby,
            renderedSprites,
          });
          //death rip emby
          if (emby.health <= 0) {
            queue.push(() => {
              emby.faint({});
            });
          }
        });
      });

      //changes the attack type display
      button.addEventListener("mouseenter", (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML];
        document.querySelector("#attackType").innerHTML = selectedAttack.type;
        document.querySelector("#attackType").style.color =
          selectedAttack.color;
      });
    });
  });
}
//battle animation
function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderedSprites.forEach((sprites) => {
    sprites.draw();
  });
}
initBattle();
animateBattle();

//changing the dialogue box according to our enemy's attacks
document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
});
