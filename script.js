// K-Means Clustering Visualizer

const canvas = document.getElementById('kmeans-canvas');
const ctx = canvas.getContext('2d');
const kSelect = document.getElementById('k-select');
const assignBtn = document.getElementById('assign-btn');
const moveBtn = document.getElementById('move-btn');
const resetBtn = document.getElementById('reset-btn');

const POINT_COUNT = 40;
const POINT_RADIUS = 6;
const CENTROID_RADIUS = 10;
const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];

let points = [];
let centroids = [];
let assignments = [];
let k = parseInt(kSelect.value);

function randomPoint() {
  return {
    x: Math.random() * (canvas.width - 40) + 20,
    y: Math.random() * (canvas.height - 40) + 20
  };
}

function generatePoints() {
  points = [];
  for (let i = 0; i < POINT_COUNT; i++) {
    points.push(randomPoint());
  }
}

function generateCentroids() {
  centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push(randomPoint());
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw lines from points to centroids
  for (let i = 0; i < points.length; i++) {
    if (assignments[i] !== undefined) {
      ctx.strokeStyle = COLORS[assignments[i]];
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(centroids[assignments[i]].x, centroids[assignments[i]].y);
      ctx.stroke();
    }
  }

  // Draw points
  for (let i = 0; i < points.length; i++) {
    ctx.fillStyle = assignments[i] !== undefined ? COLORS[assignments[i]] : '#555';
    ctx.beginPath();
    ctx.arc(points[i].x, points[i].y, POINT_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  }

  // Draw centroids
  for (let i = 0; i < centroids.length; i++) {
    ctx.fillStyle = COLORS[i];
    ctx.beginPath();
    ctx.arc(centroids[i].x, centroids[i].y, CENTROID_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();
  }
}

function assignPoints() {
  assignments = points.map(p => {
    let minDist = Infinity;
    let idx = 0;
    for (let i = 0; i < centroids.length; i++) {
      let dx = p.x - centroids[i].x;
      let dy = p.y - centroids[i].y;
      let dist = dx * dx + dy * dy;
      if (dist < minDist) {
        minDist = dist;
        idx = i;
      }
    }
    return idx;
  });
  draw();
}

function moveCentroids() {
  let sums = Array(k).fill(0).map(() => ({x:0, y:0, count:0}));
  for (let i = 0; i < points.length; i++) {
    let cluster = assignments[i];
    if (cluster !== undefined) {
      sums[cluster].x += points[i].x;
      sums[cluster].y += points[i].y;
      sums[cluster].count++;
    }
  }
  for (let i = 0; i < k; i++) {
    if (sums[i].count > 0) {
      centroids[i].x = sums[i].x / sums[i].count;
      centroids[i].y = sums[i].y / sums[i].count;
    }
  }
  draw();
}

function reset() {
  k = parseInt(kSelect.value);
  assignments = [];
  generatePoints();
  generateCentroids();
  draw();
}

kSelect.addEventListener('change', reset);
assignBtn.addEventListener('click', assignPoints);
moveBtn.addEventListener('click', moveCentroids);
resetBtn.addEventListener('click', reset);

// Initial setup
reset();
