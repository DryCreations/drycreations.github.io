new p5((p) => {
	let agents = [];
	let agentPool = []; // Agent pool for object reuse
	let maxAgents, initialSize, minSize, branchAngle, initialBranchProbability;
	let maxBranchLength, minBranchLength, iterations;
	let startColor, canvas, currentIteration = 0, x_variance, y_variance;
	let frameRateValue = 30; // Control frame rate

	function getAgent(x, y, angle, size, color, branchProb, maxLen) {
		if (agentPool.length > 0) {
			const agent = agentPool.pop();
			agent.reset(x, y, angle, size, color, branchProb, maxLen);
			return agent;
		}
		return new Agent(x, y, angle, size, color, branchProb, maxLen);
	}

	function cleanup() {
		// Recycle agents to pool
		agentPool.push(...agents);
		agents = [];
		p.noLoop();
	}

	p.setup = function() {
		const height = Math.max(window.innerHeight, document.body.scrollHeight);
		canvas = p.createCanvas(p.windowWidth, height);
		canvas.position(0, 0);
		canvas.style('z-index', '-1');

		// Randomize values
		maxAgents = Math.floor(p.random(10, 25)); // Further reduced
		initialSize = p.random(60, 140);
		minSize = p.random(0.5, 3);
		branchAngle = p.PI / p.random(8, 20);
		initialBranchProbability = p.random(0.0001, 0.001);
		maxBranchLength = p.random(100, 300);
		minBranchLength = p.random(5, 20);
		iterations = Math.floor(p.random(3, 8)); // Reduced maximum iterations
		startColor = [
			17,
			24,
			39,
			255
		];

		p.background(0, 0);
		p.frameRate(frameRateValue);

		// Start with a single agent at a random x position at the bottom
		startSimulation();
	};

	p.draw = function() {
		// Force cleanup if we exceed agent limit
		if (agents.length > maxAgents) {
			agents.splice(maxAgents);
		}

		p.noStroke();

		// Draw and update agents
		for (let i = agents.length - 1; i >= 0; i--) {
			let agent = agents[i];
			
			// Skip if agent is off screen
			if (agent.x < -50 || agent.x > p.width + 50 || 
				agent.y < -50 || agent.y > p.height + 50) {
				agentPool.push(agents.splice(i, 1)[0]);
				continue;
			}

			agent.update();
			agent.show();

			// Branching logic with updated weights
			if ((p.random() < agent.branchProbability || agent.length >= agent.maxLength) && agents.length < maxAgents) {
				let newSize = agent.size * p.random(0.9, 0.98);
				let newColor = agent.color; // keep the color as set
				let newBranchProbability = agent.branchProbability * 1.1; // increased multiplier for branching
				let newMaxLength = agent.maxLength * 0.95; // allow branches to extend further

				let angleVariance = p.random(-p.PI / 12, p.PI / 12);

				let newAngle1 = agent.angle - branchAngle + angleVariance;
				let newAngle2 = agent.angle + branchAngle + angleVariance;

				if (p.sin(newAngle1) < -0.1) {
					agents.push(getAgent(agent.x, agent.y, newAngle1, newSize, newColor, newBranchProbability, newMaxLength));
				}
				if (p.sin(newAngle2) < -0.1) {
					agents.push(getAgent(agent.x, agent.y, newAngle2, newSize, newColor, newBranchProbability, newMaxLength));
				}
				agents.splice(i, 1);
			}

			// Random destruction logic
			let destructionProbability = p.map(agents.length, 0, maxAgents, 0.0001, 0.01); // Lower random destruction probability
			if (p.random() < destructionProbability) {
				agentPool.push(agents.splice(i, 1)[0]); // Randomly destroy the agent
			}

			// Remove agent if too small
			if (agent.size <= minSize) {
				agentPool.push(agents.splice(i, 1)[0]);
			}
		}

		// Stop drawing if no agents are left
		if (agents.length === 0) {
			if (currentIteration < iterations) {
				p.fill(255, 255, 255, 50); 
				p.rect(0, 0, p.width, p.height);
				startSimulation();
				currentIteration++;
			} else {
				cleanup(); // Ensure proper cleanup when done
			}
		}
	};

	function startSimulation() {
		cleanup(); // Clean before starting new simulation
		let initialAngle = -p.PI / 2 + p.random(-p.PI / 2, p.PI / 2); // Add slight variance to the starting angle
		agents.push(getAgent(p.random(p.width), p.height, initialAngle, initialSize, startColor, initialBranchProbability, maxBranchLength));
		x_variance = p.random(1, 30);
		y_variance = p.random(1, 30);
		p.loop();
	}

	p.windowResized = function() {
		cleanup(); // Clean before resize
		const height = Math.max(window.innerHeight, document.body.scrollHeight);
		p.resizeCanvas(p.windowWidth, height);
		agents = [];
		p.setup();
		let initialAngle = -p.PI / 2 + p.random(-p.PI / 2, p.PI / 2); // Add slight variance to the starting angle
		agents.push(getAgent(p.random(p.width), p.height, initialAngle, initialSize, startColor, initialBranchProbability, maxBranchLength));
		canvas.position(0, 0);
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
			// Cache random values
			this.angleStep = p.random(-p.PI / 180, p.PI / 180);
			this.sizeMultiplier = p.random(0.95, 1.045);
			return this;
		}

		update() {
			// Use cached random values
			this.angle += this.angleStep;
			const dx = p.cos(this.angle) * this.step;
			const dy = p.sin(this.angle) * this.step;
			
			// Boundary check before updating position
			if (this.x + dx > 0 && this.x + dx < p.width) {
				this.x += dx;
			}
			if (this.y + dy > 0 && this.y + dy < p.height) {
				this.y += dy;
			}
			
			this.size *= this.sizeMultiplier;
			this.length += this.step;

			// Increase branchProbability faster after a given length so trunk grows then branches
			if (this.length > 30) {
				this.branchProbability *= 1.01; // increased multiplier for faster growth in branch chance
			}

			// When agent thins below a threshold, further boost branch probability
			if (this.size < initialSize * 0.4) {
				this.branchProbability *= 1.02;
				this.maxLength *= 0.99;
			}
		}

		show() {
			// Only draw if agent is on screen
			if (this.x >= 0 && this.x <= p.width && 
				this.y >= 0 && this.y <= p.height) {
				p.fill(this.color);
				p.rect(this.x, this.y, this.size, this.size);
			}
		}
	}
});
