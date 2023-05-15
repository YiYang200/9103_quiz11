const canvas = document.getElementById('playground');
const ctx = canvas.getContext('2d');
let numParticles = calculateNumParticles();

// 吸力距离
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

// 根据页面大小计算粒子数量
function calculateNumParticles() {
  const numParticlesBase = 300;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const screenArea = screenWidth * screenHeight;
  const baseArea = 1920 * 1080; // 基准屏幕大小，我的电脑是这个参数，可以根据需要修改为其他的
  const ratio = screenArea / baseArea;
  const adjustedNumParticles = Math.round(numParticlesBase * ratio);
  return adjustedNumParticles;
}

// 设置画布大小和粒子数量
function setCanvasSizeAndParticles() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  numParticles = calculateNumParticles();
  particles.length = 0; // 清空原有粒子数组

  // 创建新的粒子
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle2());
  }
}

// 储存创建好的小球
const particles = [];

// 最大距离
const maxDistance = 200;

// 窗口大小变化时重新设置画布大小和粒子数量
window.addEventListener('resize', setCanvasSizeAndParticles);

// 创造 绘制 移动更新
class Particle2 {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    // 控制移动速度
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.radius = Math.max(1, canvas.width / 1920 * 3); // 粒子大小根据屏幕宽度自适应
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
  }

  // 更新位置
  update(mouse) {
    this.x += this.vx;
    this.y += this.vy;

    // 影响移动角度
    if (this.x < 0 || this.x > canvas.width) {
      this.vx = -this.vx;
    }
    if (this.y < 0 || this.y > canvas.height) {
      this.vy = -this.vy;
    }

    // 鼠标参与
    if (mouse.x !== undefined && mouse.y !== undefined) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;

      // 点与鼠标的距离
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < attractionDistance) {
        this.vx += dx / distance;
        this.vy += dy / distance;
      }
    }
  }
}

// 连接粒子
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

// 设置画布大小和粒子数量
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