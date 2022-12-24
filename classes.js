class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    attacks,
  }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
    this.rotation = rotation;
    this.attacks = attacks;
  }

  draw() {
    context.save();
    context.globalAlpha = this.opacity;
    //for the rotation animation
    context.translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
    context.rotate(this.rotation);
    context.translate(
      -this.position.x - this.width / 2,
      -this.position.y - this.height / 2
    );
    context.drawImage(
      this.image,
      this.frames.val * this.width, //starting to crop the sprite sheet from the beginning (the left)
      0, //
      this.image.width / this.frames.max,
      this.image.height, // height
      this.position.x, //the placement of our sprite
      this.position.y,
      this.image.width / this.frames.max, //width of which the image will be rendered out at
      this.image.height //height of which the image will be rendered out at
    );
    context.restore();

    if (this.animate) {
      if (this.frames.max > 1) {
        this.frames.elapsed++;
      }

      if (this.frames.elapsed % this.frames.hold === 0) {
        if (this.frames.val < this.frames.max - 1) this.frames.val++;
        else this.frames.val = 0;
      }
    }
  }
}

class Monster extends Sprite {
  constructor({
    isEnemy = false,
    name,
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    rotation = 0,
    attacks,
  }) {
    super({
      position,
      image,
      frames,
      sprites,
      animate,
      rotation,
      attacks,
    });
    this.isEnemy = isEnemy;
    this.name = name;
    this.health = 100;
  }

  faint() {
    document.querySelector("#dialogueBox").innerHTML = this.name + " died! ";
    //the dead character laid down
    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    //changing the opacity of the dead character
    gsap.to(this, {
      opacity: 0,
    });
  }
  attack({ attack, recipient, renderedSprites }) {
    document.querySelector("#dialogueBox").style.display = "block";
    document.querySelector("#dialogueBox").innerHTML =
      this.name + " used " + attack.name;
    let healthBar = "#green-bar";
    if (this.isEnemy) healthBar = "#green-bar2";

    recipient.health -= attack.damage;

    let rotation = 1;
    if (this.isEnemy) rotation = -2.2;
    switch (attack.name) {
      case "Fireball":
        const fireballImage = new Image();
        fireballImage.src = "./img/fireball.png";
        //animating the fireball
        const fireball = new Sprite({
          position: { x: this.position.x, y: this.position.y },
          image: fireballImage,
          frames: {
            max: 4,
            hold: 10,
          },
          animate: true,
          rotation,
        });
        //rendering draggle emby and the fireball so the fireball spawns in the correct place (in front of emby and not on top of)
        renderedSprites.splice(1, 0, fireball);
        //moving the fireball towards draggle
        gsap.to(fireball.position, {
          x: recipient.position.x,
          y: recipient.position.y,
          onComplete: () => {
            //where x gets hit
            //health bar decreases by 25 points
            gsap.to(healthBar, {
              width: recipient.health + "%",
            });
            //draggle moves
            gsap.to(recipient.position, {
              x: recipient.position.x + 10,
              yoyo: true,
              repeat: 5,
              duration: 0.08,
            });
            //draggle flashes
            gsap.to(recipient, {
              opacity: 0,
              repeat: 5,
              yoyo: true,
              duration: 0.08,
            });
            //what removes the fireball after draggle is hit
            renderedSprites.splice(1, 1);
          },
        });
        break;

      case "Tackle":
        //we use gsap.timeline to make a cohesive timeline to when emby moves and draggle is hit and draggle moves
        const tl = gsap.timeline();
        //this was made because draggle is supposed to move differently than emby
        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;
        //x administering the hit moves to attack
        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            onComplete: () => {
              //where x gets hit
              //health bar decreases
              gsap.to(healthBar, {
                width: recipient.health + "%",
              });
              //x hit moves
              gsap.to(recipient.position, {
                x: recipient.position.x + 10,
                yoyo: true,
                repeat: 5,
                duration: 0.08,
              });
              //x hit flashes in and out
              gsap.to(recipient, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
            },
          })
          //x who administered the attack gets back to default place
          .to(this.position, {
            x: this.position.x,
          });
        break;
    }
  }
}
class Boundary {
  static width = 48; //this is only in case i forget what 48 is for
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48; //don't forget that we imported this map 4 times its actual size 12x4
    this.height = 48;
  }
  draw() {
    context.fillStyle = "rgba(225,0,0,0)";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
