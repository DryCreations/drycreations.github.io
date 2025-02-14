new p5((p) => {
	let agents = [];
	let maxAgents, initialSize, minSize, branchAngle, initialBranchProbability;
	let maxBranchLength, minBranchLength, iterations;
	let startColor, canvas, currentIteration = 0, x_variance, y_variance;

	p.setup = function() {
		canvas = p.createCanvas(p.windowWidth, document.body.scrollHeight);
		canvas.position(0, 0);
		canvas.style('z-index', '-1');

		// Randomize values
		maxAgents = Math.floor(p.random(20, 60));
		initialSize = p.random(60, 140);
		minSize = p.random(0.5, 3);
		branchAngle = p.PI / p.random(8, 20);
		initialBranchProbability = p.random(0.0001, 0.001);
		maxBranchLength = p.random(100, 300);
		minBranchLength = p.random(5, 20);
		iterations = Math.floor(p.random(5, 15));
		startColor = [
			17,
			24,
			39,
			255
		];

		p.background(0, 0);

		// Start with a single agent at a random x position at the bottom
		startSimulation();
	};

	p.draw = function() {
		p.noStroke();

		// Draw and update agents
		for (let i = agents.length - 1; i >= 0; i--) {
			let agent = agents[i];
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
					agents.push(new Agent(agent.x, agent.y, newAngle1, newSize, newColor, newBranchProbability, newMaxLength));
				}
				if (p.sin(newAngle2) < -0.1) {
					agents.push(new Agent(agent.x, agent.y, newAngle2, newSize, newColor, newBranchProbability, newMaxLength));
				}
				agents.splice(i, 1);
			}

			// Random destruction logic
			let destructionProbability = p.map(agents.length, 0, maxAgents, 0.0001, 0.01); // Lower random destruction probability
			if (p.random() < destructionProbability) {
				agents.splice(i, 1); // Randomly destroy the agent
			}

			// Remove agent if too small
			if (agent.size <= minSize) {
				agents.splice(i, 1);
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
				p.noLoop();
			}
		}
	};

	function startSimulation() {
		agents = [];
		let initialAngle = -p.PI / 2 + p.random(-p.PI / 2, p.PI / 2); // Add slight variance to the starting angle
		agents.push(new Agent(p.random(p.width), p.height, initialAngle, initialSize, startColor, initialBranchProbability, maxBranchLength));
		x_variance = p.random(1, 30);
		y_variance = p.random(1, 30);
	}

	p.windowResized = function() {
		p.resizeCanvas(p.windowWidth, document.body.scrollHeight);
		agents = [];
		p.setup();
		let initialAngle = -p.PI / 2 + p.random(-p.PI / 2, p.PI / 2); // Add slight variance to the starting angle
		agents.push(new Agent(p.random(p.width), p.height, initialAngle, initialSize, startColor, initialBranchProbability, maxBranchLength));
		canvas.position(0, 0);
	};

	class Agent {
		constructor(x, y, angle, size, color, branchProbability, maxLength) {
			this.x = x;
			this.y = y;
			this.angle = angle;
			this.size = size;
			this.color = color;
			this.branchProbability = branchProbability;
			this.maxLength = maxLength;
			this.length = 0;
			this.step = p.random(.1, 1); // Add variation in step size
		}

		update() {
			this.angle += p.random(-p.PI / 180, p.PI / 180); // Add slight random walk to the angle
			this.x += p.cos(this.angle) * this.step;
			this.y += p.sin(this.angle) * this.step;
			this.size *= p.random(0.95, 1.045); // Keep trunk larger for longer
			this.length += this.step; // Increase length

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
			p.fill(this.color);
			p.rect(this.x, this.y, this.size, this.size);
		}
	}
});
