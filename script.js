/* Selecting canvas */
const canvas = document.querySelector('canvas');
/* Selecting canvas api that lets us draw on the canvas */
const ctx = canvas.getContext('2d');

/* Setting height and width of canvas */
canvas.width = innerWidth;
canvas.height = innerHeight;


/* Player class */
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    /* Canvas draw function */
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

/* Projectile class */
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    /* Canvas draw function */
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

}

/* Setting player co-ordinates */
const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 30, 'blue');
/* Drawing player */
player.draw();
console.log(player);

/* Creating a event listener on window object */
window.addEventListener('click', (e) => {
    /* x and y cordinates using event */
    let x = e.clientX;
    let y = e.clientY
    const projectile = new Projectile(x, y, 5, 'red', null);
    projectile.draw();
})
