class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
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
  }

  draw() {
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
  attack({ attack, recipient }) {
    const tl = gsap.timeline();

    tl.to(this.position, {
      x: this.position.x - 20,
    })
      .to(this.position, {
        x: this.position.x + 40,
      })
      .to(this.position, {
        x: this.position.x,
      });
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
    context.fillStyle = "rgba(225,0,0,0.5)";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
