import Phaser from "phaser";
import gameEvents from "../gameEvents";

const G = 6.6743e-11 * 1e10;
const TIME_STEP = 0.2;
const MAX_STEPS = 1000;
const EARTH_MASS = 2500;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
    this.rocket = null;
    this.earth = null;
    this.trajectoryGraphics = null;
    this.background = null;
    this.planets = [];
    this.currentLevel = 1;
    this.initialVelocity = 5;
    this.launchAngle = 0;
    this.isSimulating = false;
    this.simulatedTrajectory = [];
    this.launchComplete = false;
    this.launchTimer = null;
  }

  preload() {
    this.load.image("rocket", "rocket.png");
    this.load.image("background", "bg.jpg");
    this.load.audio("bgMusic", "ObservingTheStar.ogg");
    this.load.audio("success", "success.ogg");
    for (let i = 1; i <= 8; i++) {
      this.load.image(`p${i}`, `p${i}.png`);
    }
    this.load.image("earth", "earth.png");
    this.load.audio("boom", "explosion.wav");
    this.load.spritesheet("explosion", "explosion.png", {
      frameWidth: 195,
      frameHeight: 190,
    });
  }

  create() {
    this.setupGameObjects();
    this.setupColliders();
    this.setupAnimations();
    this.setupEventListeners();

    // Generate initial level
    this.generateLevel(this.currentLevel);

    // Initial trajectory preview
    this.updateTrajectoryPreview();

    // Emit initial state to Vue
    this.emitGameState();

    this.music = this.sound.add("bgMusic", {
      volume: 0.5,
      loop: true,
    });
    this.music.play();
  }

  setupGameObjects() {
    this.background = this.add.image(400, 300, "background");

    this.rocket = this.physics.add.image(50, 300, "rocket");
    this.rocket
      .setOrigin(0.5, 0.5)
      .setCollideWorldBounds(false)
      .setBounce(0)
      .setScale(0.1);
    this.rocket.body.setCircle(this.rocket.height / 2);
    this.rocket.body.setOffset(25, -30);

    this.earth = this.physics.add
      .image(750, 300, "earth")
      .setScale(0.5)
      .setImmovable(true)
      .setBounce(0);
    this.earth.setCircle(this.earth.height / 2);

    this.trajectoryGraphics = this.add.graphics();
  }

  setupColliders() {
    this.physics.add.collider(
      this.rocket,
      this.earth,
      this.handleCollision,
      null,
      this
    );
  }

  setupAnimations() {
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion", {
        start: 0,
        end: 12,
      }),
      frameRate: 24,
      hideOnComplete: true,
    });
  }

  setupEventListeners() {
    // Listen for control events from Vue
    gameEvents.on("launch-rocket", () => {
      if (!this.isSimulating) this.launchRocket();
    });

    gameEvents.on("update-velocity", (velocity) => {
      if (!this.isSimulating) {
        this.initialVelocity = velocity;
        this.updateTrajectoryPreview();
      }
    });

    gameEvents.on("update-angle", (angle) => {
      if (!this.isSimulating) {
        this.launchAngle = angle;
        this.updateTrajectoryPreview();
      }
    });

    gameEvents.on("retry-level", () => {
      this.resetRocketPosition();
    });

    gameEvents.on("reset-level", () => {
      this.resetLevel();
    });

    gameEvents.on("start-over", () => {
      this.startOver();
    });
  }

  resetRocketPosition() {
    this.rocket.setVisible(true).setPosition(50, 300);
    this.launchComplete = false;
    this.isSimulating = false;
    this.rocket.setRotation(Phaser.Math.DegToRad(this.launchAngle));
    this.updateTrajectoryPreview();
  }

  startOver() {
    // Reset simulation state
    this.isSimulating = false;
    this.launchComplete = false;

    // Clear any ongoing launch
    if (this.launchTimer) {
      clearInterval(this.launchTimer);
    }

    // Reset level to 1
    this.currentLevel = 1;

    // Reset rocket position and angle
    this.rocket.setVisible(true).setPosition(50, 300);
    this.rocket.setRotation(Phaser.Math.DegToRad(this.launchAngle));

    // Generate new level 1
    this.generateLevel(this.currentLevel);
    this.updateTrajectoryPreview();

    // Update UI
    this.emitGameState();
  }

  generateLevel(level) {
    this.planets.forEach((planet) => planet.destroy());
    this.planets = [];

    const maxPlanets = Math.min(12, level);

    for (let i = 0; i < maxPlanets; i++) {
      const planetImgs = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"];
      const x = Phaser.Math.Between(200, 600);
      const y = Phaser.Math.Between(100, 500);
      const size = Phaser.Math.Between(30, 120);
      const planet = this.physics.add.image(
        x,
        y,
        planetImgs[i % planetImgs.length]
      );
      const scale = size / planet.height;

      planet.setScale(scale).setCircle(planet.height / 2);
      planet.mass = size * 100;

      this.planets.push(planet);
      this.physics.add.collider(
        this.rocket,
        planet,
        this.handleCollision,
        null,
        this
      );
    }

    this.updateTrajectoryPreview();
    this.emitGameState();
  }

  calculateTrajectory(initX, initY, velocity, angle, numSteps = MAX_STEPS) {
    const planetData = this.planets.map((p) => ({
      x: p.x,
      y: p.y,
      mass: p.mass,
      radius: p.displayHeight / 2,
    }));

    const trajectory = [];
    let x = initX;
    let y = initY;
    const radians = Phaser.Math.DegToRad(angle);
    let vx = velocity * Math.cos(radians);
    let vy = velocity * Math.sin(radians);

    // Function to check if point collides with any planet
    const checkPlanetCollision = (x, y) => {
      // Check Earth collision
      const dx_earth = this.earth.x - x;
      const dy_earth = this.earth.y - y;
      const distSq_earth = dx_earth * dx_earth + dy_earth * dy_earth;
      if (
        distSq_earth <=
        (this.earth.displayHeight / 2) * (this.earth.displayHeight / 2)
      ) {
        return true;
      }
      for (let planet of planetData) {
        const dx = planet.x - x;
        const dy = planet.y - y;
        const distSq = dx * dx + dy * dy;
        if (distSq <= planet.radius * planet.radius) {
          return true;
        }
      }
      return false;
    };

    const calculateAcceleration = (x, y) => {
      let ax = 0,
        ay = 0;

      for (let i = 0; i < planetData.length; i++) {
        const planet = planetData[i];
        const dx = planet.x - x;
        const dy = planet.y - y;
        const distSq = dx * dx + dy * dy;
        const force = (G * planet.mass) / distSq;
        const invDist = 1 / Math.sqrt(distSq);

        ax += force * dx * invDist;
        ay += force * dy * invDist;
      }

      const dx = this.earth.x - x;
      const dy = this.earth.y - y;
      const distSq = dx * dx + dy * dy;
      const invDist = 1 / Math.sqrt(distSq);
      const force = (G * EARTH_MASS) / distSq;

      ax += force * dx * invDist;
      ay += force * dy * invDist;

      return { x: ax, y: ay };
    };

    for (let step = 0; step < numSteps; step++) {
      if (x < 0 || x > 800 || y < 0 || y > 600) break;

      // Stop if we hit a planet
      if (checkPlanetCollision(x, y)) {
        trajectory.push({ x, y }); // Add the collision point
        break;
      }

      trajectory.push({ x, y });

      const k1 = calculateAcceleration(x, y);
      const k2 = calculateAcceleration(
        x + (vx * TIME_STEP) / 2,
        y + (vy * TIME_STEP) / 2
      );
      const k3 = calculateAcceleration(
        x + ((vx + (k1.x * TIME_STEP) / 2) * TIME_STEP) / 2,
        y + ((vy + (k1.y * TIME_STEP) / 2) * TIME_STEP) / 2
      );
      const k4 = calculateAcceleration(
        x + (vx + k2.x * TIME_STEP) * TIME_STEP,
        y + (vy + k2.y * TIME_STEP) * TIME_STEP
      );

      vx += ((k1.x + 2 * k2.x + 2 * k3.x + k4.x) * TIME_STEP) / 6;
      vy += ((k1.y + 2 * k2.y + 2 * k3.y + k4.y) * TIME_STEP) / 6;

      x += vx * TIME_STEP;
      y += vy * TIME_STEP;
    }

    return trajectory;
  }

  updateTrajectoryPreview() {
    const trajectory = this.calculateTrajectory(
      this.rocket.x,
      this.rocket.y,
      this.initialVelocity,
      this.launchAngle
    );

    this.trajectoryGraphics.clear().lineStyle(1, 0xffff00, 0.5).beginPath();

    for (let i = 0; i < trajectory.length; i += 2) {
      const point = trajectory[i];
      i === 0
        ? this.trajectoryGraphics.moveTo(point.x, point.y)
        : this.trajectoryGraphics.lineTo(point.x, point.y);
    }

    this.trajectoryGraphics.strokePath();
  }

  launchRocket() {
    if (this.isSimulating || this.launchComplete) return;

    this.isSimulating = true;
    this.simulatedTrajectory = this.calculateTrajectory(
      this.rocket.x,
      this.rocket.y,
      this.initialVelocity,
      this.launchAngle
    );
    this.trajectoryGraphics.clear();

    let step = 0;
    this.launchTimer = setInterval(() => {
      if (step >= this.simulatedTrajectory.length || !this.isSimulating) {
        clearInterval(this.launchTimer);
        if (!this.launchComplete) this.handleLaunchComplete(false);
        return;
      }

      this.rocket.setPosition(
        this.simulatedTrajectory[step].x,
        this.simulatedTrajectory[step].y
      );
      step++;
    }, 8);

    this.emitGameState();
  }

  handleCollision(rocket, other) {
    if (this.launchComplete || !this.isSimulating) return;

    this.isSimulating = false;
    this.launchComplete = true;

    if (this.planets.includes(other)) {
      let explosion = this.add.sprite(rocket.x, rocket.y, "explosion");
      this.sound.play("boom");
      rocket.setVisible(false);
      explosion.play("explode");
      explosion.once("animationcomplete", () =>
        this.handleLaunchComplete(false)
      );
    } else if (other === this.earth) {
      this.sound.play("success");
      this.handleLaunchComplete(true);
    }

    this.emitGameState();
  }

  handleLaunchComplete(success) {
    clearInterval(this.launchTimer);

    gameEvents.emit("launch-complete", {
      success,
      nextLevel: this.currentLevel + 1,
    });

    if (success) {
      this.currentLevel++;
    } else {
      this.isSimulating = false;
      this.launchComplete = false;
    }

    this.emitGameState();
  }

  resetLevel() {
    this.rocket.setVisible(true).setPosition(50, 300);
    this.launchComplete = false;
    this.isSimulating = false;
    this.rocket.setRotation(Phaser.Math.DegToRad(this.launchAngle));
    this.generateLevel(this.currentLevel);
    this.updateTrajectoryPreview();
    this.emitGameState();
  }

  emitGameState() {
    gameEvents.emit("game-state", {
      currentLevel: this.currentLevel,
      isSimulating: this.isSimulating,
      launchComplete: this.launchComplete,
      velocity: this.initialVelocity,
      angle: this.launchAngle,
    });
  }

  update() {
    if (this.isSimulating && this.simulatedTrajectory.length > 1) {
      const idx =
        Math.floor(this.game.getTime() / 8) % this.simulatedTrajectory.length;
      if (idx > 0) {
        const prev = this.simulatedTrajectory[idx - 1];
        const curr = this.simulatedTrajectory[idx];
        const targetAngle = Math.atan2(curr.y - prev.y, curr.x - prev.x);
        const smoothRotation = Phaser.Math.Angle.RotateTo(
          this.rocket.rotation,
          targetAngle,
          Math.PI / 360
        );
        this.rocket.setRotation(smoothRotation);
      }
    } else {
      this.rocket.setRotation(Phaser.Math.DegToRad(this.launchAngle));
    }
  }
}
