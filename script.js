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

    /* Updating class properties function */
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }

}

/* Setting player co-ordinates */
const x = canvas.width / 2;
const y = canvas.height / 2;

/* Player object */
const player = new Player(x, y, 30, 'blue');



/* Grouping of projectiles */
const projectiles = [];


    
/* Animation loop */
function animate() {
    requestAnimationFrame(animate);



    /* Clearing canvas with each projectile */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Drawing player at every frame after clearing*/
    player.draw();

    /* Loopping through every projectile in projectiles array */
    projectiles.forEach((projectile) => {
        projectile.update();
    })


}



/* Creating a event listener on window object */
window.addEventListener('click', (e) => {
    /* click distance from center */
    let x = e.clientX - canvas.width / 2;
    let y = e.clientY - canvas.height / 2;

    /* Angle between center and click pos in radians*/
    const angle = Math.atan2(y, x);
    
    /* setting x and y velocity */
    const velocity = {
        x: Math.cos(angle),
        y : Math.sin(angle),
    }

    /* Pushing a new projectile every time we click on the screen to projectiles array */
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', velocity))
})

animate();