new p5((p) => {
	let agents = [];
	let agentPool = [];
	let maxAgents, initialSize, minSize, branchAngle, initialBranchProbability;
	let maxBranchLength, minBranchLength, iterations;
	let startColor, canvas, currentIteration = 0;
	let startTime;
	const targetFrameRate = 30; // Reduced from 60
	const maxRuntime = 60000;
	let lastFrameTime = 0;

	function getAgent(x, y, angle, size, color, branchProb, maxLen) {
		if (agentPool.length > 0) {
			const agent = agentPool.pop();
			if (agent && typeof agent.reset === 'function') {
				agent.reset(x, y, angle, size, color, branchProb, maxLen);
				return agent;
			}
		}
		return new Agent(x, y, angle, size, color, branchProb, maxLen);
	}

	function cleanup() {
		agentPool.push(...agents);
		agents = [];
		p.noLoop();
	}

	p.setup = function() {
		if (window.SKETCH_CONFIG && window.SKETCH_CONFIG.container) {
			const container = window.SKETCH_CONFIG.container;
			canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
			canvas.parent(container);
		} else {
			let mainWidth = window.innerWidth;
			let mainHeight = Math.min(window.innerHeight, 1080);
			canvas = p.createCanvas(mainWidth, mainHeight);
		}
		canvas.style('z-index', '-1');

		// Set parameters
		maxAgents = Math.floor(p.random(20, 40));
		initialSize = p.random(20, 40);
		minSize = p.random(0.1, 5);
		branchAngle = p.PI / p.random(8, 12);
		initialBranchProbability = p.random(0.002, 0.008);
		maxBranchLength = p.random(80, 150);
		minBranchLength = p.random(20, 40);
		iterations = Math.floor(p.random(5, 16));
		startColor = [17, 24, 39, 255];

		p.background(0, 0);
		p.frameRate(targetFrameRate);
		startSimulation();
	};

	p.draw = function() {
		const currentTime = performance.now();
		if (currentTime - lastFrameTime < 1000 / targetFrameRate) return;
		lastFrameTime = currentTime;

		if (p.millis() - startTime > maxRuntime) {
			if (currentIteration < iterations) {
				startSimulation();
				currentIteration++;
			} else {
				cleanup();
			}
			return;
		}

		if (agents.length > maxAgents) agents.splice(maxAgents);
		p.noStroke();

		const agentsPerFrame = Math.min(agents.length, 20);
		for (let i = 0; i < agentsPerFrame; i++) {
			const idx = Math.floor(i * (agents.length / agentsPerFrame));
			if (idx >= 0 && idx < agents.length) {
				let agent = agents[idx];
				if (agent.x < -50 || agent.x > p.width + 50 || agent.y < -50 || agent.y > p.height + 50) {
					agentPool.push(agents.splice(i, 1)[0]);
					continue;
				}
				agent.update();
				agent.show();
				if (agent.length > minBranchLength && agent.branchProbability > 0.02 && agents.length < maxAgents) {
					const newSize = agent.size * p.random(0.7, 0.9);
					const newColor = agent.color;
					const newBranchProbability = agent.branchProbability * 1.5;
					const newMaxLength = agent.maxLength * 0.95;
					const angleVariance = p.random(-p.PI / 16, p.PI / 16);
					const newAngle1 = agent.angle - branchAngle + angleVariance;
					const newAngle2 = agent.angle + branchAngle + angleVariance;
					if (p.sin(newAngle1) < 0.1) {
						agents.push(getAgent(agent.x, agent.y, newAngle1, newSize, newColor, newBranchProbability, newMaxLength));
					}
					if (p.sin(newAngle2) < 0.1) {
						agents.push(getAgent(agent.x, agent.y, newAngle2, newSize, newColor, newBranchProbability, newMaxLength));
					}
					agentPool.push(agents.splice(i, 1)[0]);
				}
				const destructionProbability = p.map(agents.length, 0, maxAgents, 0.00001, 0.0005);
				if (p.random() < destructionProbability) {
					agentPool.push(agents.splice(i, 1)[0]);
				}
				if (agent.size <= minSize) {
					agentPool.push(agents.splice(i, 1)[0]);
				}
			}
		}

		if (agents.length === 0) {
			if (currentIteration < iterations) {
				p.fill(255, 255, 255, 50);
				p.rect(0, 0, p.width, p.height);
				startSimulation();
				currentIteration++;
			} else {
				cleanup();
			}
		}
	};

	function startSimulation() {
		cleanup();
		startTime = p.millis();
		const initialAngle = -p.PI / 2 + p.random(-p.PI / 2, p.PI / 2);
		agents.push(getAgent(p.random(p.width), p.height + initialSize, initialAngle, initialSize, startColor, initialBranchProbability, maxBranchLength));
		p.loop();
	}

	p.windowResized = function() {
		cleanup();
		const mainEl = p.select('main');
		let mainWidth = window.innerWidth;
		let mainHeight = Math.min(window.innerHeight, 1080);
		if (mainEl) {
			const rect = mainEl.elt.getBoundingClientRect();
			mainWidth = rect.width;
			mainHeight = Math.min(rect.height, 1080);
		}
		p.resizeCanvas(mainWidth, mainHeight);
		agents = [];
		p.setup();
		const initialAngle = -p.PI / 2 + p.random(-p.PI / 2, p.PI / 2);
		agents.push(getAgent(p.random(p.width), p.height, initialAngle, initialSize, startColor, initialBranchProbability, maxBranchLength));
		canvas.position(0, 'auto');
		p.loop();
	};

	class Agent {
		constructor(x, y, angle, size, color, branchProbability, maxLength) {
			this.reset(x, y, angle, size, color, branchProbability, maxLength);
		}

		reset(x, y, angle, size, color, branchProbability, maxLength) {
			this.x = x;
			this.y = y;
			this.angle = angle;
			this.size = size;
			this.color = color;
			this.branchProbability = branchProbability;
			this.maxLength = maxLength;
			this.length = 0;
			this.step = p.random(0.1, 1);
			this.angleStep = p.random(-p.PI / 90, p.PI / 90);
			this.sizeMultiplier = p.random(0.998, 0.999);
			return this;
		}

		update() {
			this.angle += this.angleStep * (0.5 + this.length / 200);
			const dx = p.cos(this.angle) * this.step;
			let dy = p.sin(this.angle) * this.step;
			if (dy > 0) dy *= -0.5;
			this.x += dx;
			this.y += dy;
			this.size *= Math.pow(this.sizeMultiplier, 0.8);
			this.length += this.step;
			if (this.length > minBranchLength) {
				this.branchProbability *= 1.03;
			}
		}

		show() {
			const margin = this.size * 2;
			if (this.x >= -margin && this.x <= p.width + margin &&
				this.y >= -margin && this.y <= p.height + margin) {
				let c = p.color(this.color[0], this.color[1], this.color[2], 150);
				p.fill(c);
				p.ellipse(this.x, this.y, this.size, this.size);
			}
		}
	}
});
