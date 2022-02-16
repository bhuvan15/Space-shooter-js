/* Selecting canvas */
const canvas = document.querySelector('canvas');
/* Selecting canvas api that lets us draw on the canvas */
const ctx = canvas.getContext('2d');

/* Setting height and width of canvas */
canvas.width = innerWidth;
canvas.height = innerHeight;

/* score */
const scoreEl = document.querySelector('#scoreEl');
/* Start button */
const startBtn = document.querySelector('#startBtn');
/* Model */

const modelEl = document.querySelector('#modelEl');
const modalScore = document.querySelector('#modalScore');

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

/* Enemies class */
class Enemy {
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
/* For slowing particles */
const friction = 0.99;

/* small pieces classes after bursting */
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    /* Canvas draw function */
    draw() {
        /* Save starts the global canvas function and restore ends to */
        /* We do to change alpha value */
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    /* If a globalAlpha value is less than 0 then it will reappear */

    /* Updating class properties function */
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
        this.velocity.x *= friction;
        this.velocity.y *= friction;
    }

}


/* Setting player co-ordinates */
const x = canvas.width / 2;
const y = canvas.height / 2;

/* Player object */
let player = new Player(x, y, 12, '#fff');
/* Grouping of projectiles */
let projectiles = [];
/* Grouping of enemies */
let enemies = [];
/* Grouping of particles */
let particles = [];


/* For restart */

function init() {
    
    player = new Player(x, y, 12, '#fff');
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    scoreEl.innerHTML = score;
    modalScore.innerHTML = score;
}


/* Spawn enemies*/
function spawnEnemies() {
    /* Creating new enemy after every sec */
    setInterval(() => {
        /* Generating random radius for enemy */
        /* This frmat makes sure we get value from 4 to 30 */
        const radius = Math.random() * (30 - 4) + 4;

        /* Generating random starting postions for the enemy */
        let x;
        let y;


        if(Math.random() < 0.5) {
             x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
             y = Math.random() * canvas.height;
        }
        else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

       
        
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        /* click distance from center */
        let xD = canvas.width / 2 - x;
        let yD = canvas.height / 2 - y;

        /* Angle between center and click pos in radians*/
        const angle = Math.atan2(yD, xD);
        
        /* setting x and y velocity */
        const velocity = {
            x: Math.cos(angle),
            y : Math.sin(angle),
        }

        enemies.push(new Enemy(x, y, radius, color, velocity));

    }, 1000);
}

let animateId;
let score = 0;
/* Animation loop */
function animate() {
    
   animateId = requestAnimationFrame(animate);
    

    /* Clearing canvas with each projectile */
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* Drawing player at every frame after clearing*/
    player.draw();

    /* Particle rendering */
    particles.forEach((particle, index) => {
        if(particle.alpha <= 0) {
            particles.slice(index, 1);
        }
        else {
            particle.update();
        }
        

    })

    /* Loopping through every projectile in projectiles array */
    projectiles.forEach((projectile, index) => {
        projectile.update();

        /* If projectile moves off screen it needs to be removed */
        if(projectile.x - projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                /* removing projectile from projectiles array */
                projectiles.splice(index, 1);

            }, 0)
        }
    })

    /* Looping through enemies to draw and update them*/
    enemies.forEach((enemy, index) => {
        enemy.update();

        /* cheking for distance between player and enemy */
        /* Distance between two points */
        const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if(distance - enemy.radius - player.radius < 1) { 
            /* End game */
            /* Cancelling animation frame */
            cancelAnimationFrame(animateId);
            
            /* End modal */
            modelEl.style.display = 'flex';
            modalScore.innerHTML = score;
        }

        /* Collision detection for enemy hit*/
        /* For each enemy we will check the position of each projectile */
        projectiles.forEach((projectile, idx) => {
           /* Distance between two points */
            const distance = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            /* Subtracting enemy radius and projectile radius because distance is from center */
            if(distance - enemy.radius - projectile.radius < 1) {

                
              /* Small particles after bursting */
                for(let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {x: (Math.random() - 0.5) * (Math.random() * 6)  , y: (Math.random() - 0.5) * (Math.random() * 6) ,}))
                }


                /* Shrinking enemy */
                if(enemy.radius - 10 > 5) {

                    /* Increase Score */
                    score += 100;
                    scoreEl.innerHTML = score;

                    /* Using gsap library to animate shrinking */
                    gsap.to(enemy , {
                        radius: enemy.radius - 10,
                    })
                    setTimeout(() => {
                    /* removing projectile from projectiles array */
                    projectiles.splice(idx, 1);

                    }, 0)
                    }
                else {

                    /* Increase Score */
                    score += 200;
                    scoreEl.innerHTML = score;

                /* Removing of enemy is causing a flash beacuse we are removing it but whenever we move to next
                it is still trying to draw it */
                setTimeout(() => {
                /* Removing enemy from enemies array */
                enemies.splice(index, 1);
                /* removing projectile from projectiles array */
                projectiles.splice(idx, 1);

                }, 0)
                }
                


            }
        })
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
        x: Math.cos(angle) * 5,
        y : Math.sin(angle) * 5,
    }

    /* Pushing a new projectile every time we click on the screen to projectiles array */
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, '#fff', velocity))
})


/* Start game */
    
startBtn.addEventListener('click', function() {
    init();
    animate();
    spawnEnemies();
    modelEl.style.display = 'none';
})