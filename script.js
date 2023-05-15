const canvas = document.getElementById('playground');
const ctx = canvas.getContext('2d');
let numParticles = calculateNumParticles();

// Suction distance
const attractionDistance = 50;

const mouse = { x: undefined, y: undefined };

canvas.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

canvas.addEventListener('mouseout', () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

// Calculate the number of particles based on the page size
function calculateNumParticles() {
  const numParticlesBase = 300;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const screenArea = screenWidth * screenHeight;
  const baseArea = 1920 * 1080; 
  // The benchmark screen size for my computer is this parameter and can be modified to others as needed
  const ratio = screenArea / baseArea;
  const adjustedNumParticles = Math.round(numParticlesBase * ratio);
  return adjustedNumParticles;
}

// Set canvas size and number of particles
function setCanvasSizeAndParticles() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  numParticles = calculateNumParticles();
  particles.length = 0; // Empty the original particle array

  // Create a new particle
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle2());
  }
}

// Store the created ball
const particles = [];

//Maximum distance
const maxDistance = 200;

// Reset canvas size and particle count when window size changes
window.addEventListener('resize', setCanvasSizeAndParticles);

// Create draw move updates
class Particle2 {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    // Control movement speed
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.radius = Math.max(1, canvas.width / 1920 * 3); 
    // The particle size ADAPTS to the screen width
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
  }

  // Update location
  update(mouse) {
    this.x += this.vx;
    this.y += this.vy;

    //Influence movement Angle
    if (this.x < 0 || this.x > canvas.width) {
      this.vx = -this.vx;
    }
    if (this.y < 0 || this.y > canvas.height) {
      this.vy = -this.vy;
    }

    // Mouse participation
    if (mouse.x !== undefined && mouse.y !== undefined) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;

      // The distance between the point and the mouse
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < attractionDistance) {
        this.vx += dx / distance;
        this.vy += dy / distance;
      }
    }
  }
}

// Connective particle
function connectParticles(p1, p2, mouseInfluence = false) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const modifiedMaxDistance = mouseInfluence ? maxDistance / 2 : maxDistance;

  if (distance < modifiedMaxDistance) {
    ctx.strokeStyle = `rgba(51, 51, 51, ${1 - distance / modifiedMaxDistance})`;
    ctx.lineWidth = mouseInfluence ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
}

// Set canvas size and number of particles
setCanvasSizeAndParticles();

function animate2() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const particle of particles) {
    particle.update(mouse);
    particle.draw();
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      connectParticles(particles[i], particles[j]);
    }
    if (mouse.x !== undefined && mouse.y !== undefined) {
      connectParticles(particles[i], mouse, true);
    }
  }
  requestAnimationFrame(animate2);
}

animate2();          