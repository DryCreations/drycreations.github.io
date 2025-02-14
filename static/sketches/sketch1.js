new p5((p) => {
	let agents = [];
	let agentPool = []; // Agent pool for object reuse
	let maxAgents, initialSize, minSize, branchAngle, initialBranchProbability;
	let maxBranchLength, minBranchLength, iterations;
	let startColor, canvas, currentIteration = 0, x_variance, y_variance;
	let frameRateValue = 60; // Control frame rate
	let startTime;
	let maxRuntime = 60000;
	let frameSkip = 1; // Increase on lower FPS
	let lastFrameTime = 0;
	const targetFrameRate = 30; // Reduced from 60

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
		const mainEl = document.querySelector('html');
		let mainWidth = window.innerWidth;
		let mainHeight = window.innerHeight;
		const isMobile = window.innerWidth <= 640;

		if (mainEl) {
			const rect = mainEl.getBoundingClientRect();
			mainWidth = rect.width;
			mainHeight = rect.height;
		}
		canvas = p.createCanvas(mainWidth,isMobile ? mainHeight : mainHeight - 100);
		canvas.position(0, 0);
		canvas.style('z-index', '-1');

		console.log('Canvas created with width:', mainWidth, 'and height:', mainHeight);

		 // Adjusted parameters for better branching
		maxAgents = Math.floor(p.random(20, 40)); // Reduced max agents
		initialSize = p.random(20, 40); // Smaller initial size
		minSize = p.random(0.1, 5); // Slightly larger minimum size
		branchAngle = p.PI / p.random(8, 12); // More controlled branching angle
		initialBranchProbability = p.random(0.002, 0.008); // Higher initial probability
		maxBranchLength = p.random(80, 150); // Shorter but more consistent branches
		minBranchLength = p.random(20, 40); // Shorter minimum length
		iterations = Math.floor(p.random(5, 16));
		startColor = [
			17,
			24,
			39,
			255
		];

		p.background(0, 0);
		p.frameRate(targetFrameRate);

		// Start with a single agent at a random x position at the bottom
		startSimulation();
	};

	p.draw = function() {
		// Frame skipping for performance
		const currentTime = performance.now();
		if (currentTime - lastFrameTime < (1000 / targetFrameRate)) {
			return;
		}
		lastFrameTime = currentTime;

		 // Check time limit
		if (p.millis() - startTime > maxRuntime) {
			if (currentIteration < iterations) {
				startSimulation();
				currentIteration++;
			} else {
				cleanup();
			}
			return;
		}

		// Force cleanup if we exceed agent limit
		if (agents.length > maxAgents) {
			agents.splice(maxAgents);
		}

		p.noStroke();

		 // Process only a subset of agents per frame
		const agentsPerFrame = Math.min(agents.length, 20);
		for (let i = 0; i < agentsPerFrame; i++) {
			const idx = Math.floor(i * (agents.length / agentsPerFrame));
			if (idx >= 0 && idx < agents.length) {
				let agent = agents[idx];
				
				// Skip if agent is off screen
				if (agent.x < -50 || agent.x > p.width + 50 || 
					agent.y < -50 || agent.y > p.height + 50) {
					agentPool.push(agents.splice(i, 1)[0]);
					continue;
				}

				agent.update();
				agent.show();

				// Modified branching logic
				if (agent.length > minBranchLength && agent.branchProbability > 0.02 && agents.length < maxAgents) {
					let newSize = agent.size * p.random(0.7, 0.9); // More size reduction on branch
					let newColor = agent.color;
					let newBranchProbability = agent.branchProbability * 1.5; // Increased probability multiplier
					let newMaxLength = agent.maxLength * 0.95;
					
					let angleVariance = p.random(-p.PI / 16, p.PI / 16); // Reduced angle variance
					let newAngle1 = agent.angle - branchAngle + angleVariance;
					let newAngle2 = agent.angle + branchAngle + angleVariance;

					// Only create branches that generally move upward
					if (p.sin(newAngle1) < 0.1) {
						agents.push(getAgent(agent.x, agent.y, newAngle1, newSize, newColor, newBranchProbability, newMaxLength));
					}
					if (p.sin(newAngle2) < 0.1) {
						agents.push(getAgent(agent.x, agent.y, newAngle2, newSize, newColor, newBranchProbability, newMaxLength));
					}
					agentPool.push(agents.splice(i, 1)[0]); // Remove parent after branching
				}

				// Reduced destruction probability
				let destructionProbability = p.map(agents.length, 0, maxAgents, 0.00001, 0.0005);
				if (p.random() < destructionProbability) {
					agentPool.push(agents.splice(i, 1)[0]); // Randomly destroy the agent
				}

				// Remove agent if too small
				if (agent.size <= minSize) {
					agentPool.push(agents.splice(i, 1)[0]);
				}
			}
		}

		// Simplified branching logic
		if (agents.length < maxAgents * 0.8) { // Reduced branching frequency
			// ...existing branching code...
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
		startTime = p.millis();
		let initialAngle = -p.PI / 2 + p.random(-p.PI / 2, p.PI / 2); // Add slight variance to the starting angle
		agents.push(getAgent(p.random(p.width), p.height + initialSize, initialAngle, initialSize, startColor, initialBranchProbability, maxBranchLength));
		x_variance = p.random(1, 30);
		y_variance = p.random(1, 30);
		p.loop();
	}

	p.windowResized = function() {
		cleanup(); // Clean before resize
		const mainEl = document.querySelector('main');
		console.log(mainEl)
		let mainWidth = window.innerWidth;
		let mainHeight = window.innerHeight;
		if (mainEl) {
			const rect = mainEl.getBoundingClientRect();
			mainWidth = rect.width;
			mainHeight = rect.height;
		}
		p.resizeCanvas(mainWidth, mainHeight - 100);
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
			this.angleStep = p.random(-p.PI / 90, p.PI / 90); // More subtle angle changes
			this.sizeMultiplier = p.random(0.998, 0.999); // Slow down size reduction for longer lifetimes
			return this;
		}

		update() {
			this.angle += this.angleStep * (0.5 + this.length/200);
			const dx = p.cos(this.angle) * this.step;
			let dy = p.sin(this.angle) * this.step; // Reduced vertical movement multiplier
			
			// Less aggressive upward bias
			if (dy > 0) {
				dy *= -0.5; // Gentler upward correction
			}
			
			// Simpler boundary checks
			this.x += dx;
			this.y += dy;
			
			this.size *= Math.pow(this.sizeMultiplier, 0.8); // Slower size reduction
			this.length += this.step;

			// Simplified branching probability progression
			if (this.length > minBranchLength) {
				this.branchProbability *= 1.03;
			}
		}

		show() {
			 // Only draw if agent is close to viewport
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
