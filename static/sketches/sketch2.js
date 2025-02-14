new p5((p) => {
	let canvas;
	let nextShapeTime = 0;
	let shapeInterval = 30; // Decreased for more frequent shapes
	let currentY;
	const maxFrames = 30000; // Increased for longer runtime

	p.setup = function() {
		if (window.SKETCH_CONFIG && window.SKETCH_CONFIG.container) {
			const container = window.SKETCH_CONFIG.container;
			canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
			canvas.parent(container);
		} else {
			canvas = p.createCanvas(window.innerWidth, Math.min(window.innerHeight, 1080));
		}
		canvas.style('z-index', '-1');
		nextShapeTime = 0;
		currentY = p.height;
	};

	// Helper function to draw a regular polygon
	function drawPolygon(x, y, radius, npoints, rotation = 0) {
		let angle = p.TWO_PI / npoints;
		p.beginShape();
		for (let a = 0; a < p.TWO_PI; a += angle) {
			let sx = x + p.cos(a + rotation) * radius;
			let sy = y + p.sin(a + rotation) * radius;
			p.vertex(sx, sy);
		}
		p.endShape(p.CLOSE);
	}
	
	p.draw = function() {
		// Do not clear canvas to keep earlier shapes drawn
		if (p.millis() > nextShapeTime) {
			// Calculate a random radius and corresponding minY for shape placement
			const radius = p.random(15, 40); // Slightly smaller shapes
			const shapeMinY = radius * 2;
			// Stop if we're too high or exceeded frame limit.
			if (currentY <= shapeMinY || p.frameCount >= maxFrames) {
				p.noLoop();
				return;
			}
			
			// Increased shadow opacity and blur
			p.drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
			p.drawingContext.shadowBlur = 6;
			p.drawingContext.shadowOffsetY = 2;
            
            // Generate outline color (dark) and fill color (light)
            const outlineColor = p.color(
                17 + p.random(-5, 5),
                24 + p.random(-5, 5),
                39 + p.random(-5, 5),
                255
            );
            
            const fillColor = p.color(
                245 + p.random(-10, 10), // Off-white base
                245 + p.random(-10, 10),
                245 + p.random(-10, 10),
                255
            );

            const newShape = {
                x: p.random(50, p.width - 50),
                y: currentY,
                sides: Math.floor(p.random(3, 8)),
                radius: radius,
                rotation: p.random(p.TWO_PI),
                outlineColor: outlineColor,
                fillColor: fillColor
            };
			
			p.push();
			p.translate(newShape.x, newShape.y);
			p.rotate(newShape.rotation);
			p.fill(newShape.fillColor);
			p.stroke(newShape.outlineColor);
			p.strokeWeight(3);
			drawPolygon(0, 0, newShape.radius, newShape.sides);
			p.pop();

			 // More aggressive density falloff based on height
            const heightFactor = Math.pow(p.map(currentY, 0, p.height, 1, 0), 3); // Cubic falloff
            nextShapeTime = p.millis() + (shapeInterval * (1 + heightFactor * 5)); // Increased multiplier

			// More aggressive spacing increase towards the top
			const progressFactor = p.frameCount / maxFrames;
			const heightProgress = p.map(currentY, 0, p.height, 1, 0);
			const baseSpacing = p.map(currentY, p.height, 0, 15, 30); // Reversed mapping for faster upward movement
			
			// Stronger exponential factor for spacing
			const exponentialFactor = Math.pow(heightProgress, 3); // Cubic growth
			const spacing = baseSpacing * (0.3 + exponentialFactor * 2) * (0.5 + progressFactor * 0.5);
			
			currentY = Math.max(currentY - spacing, shapeMinY);
		}
	};

	p.windowResized = function() {
		if (window.SKETCH_CONFIG && window.SKETCH_CONFIG.container) {
			const container = window.SKETCH_CONFIG.container;
			p.resizeCanvas(container.offsetWidth, container.offsetHeight);
		} else {
			p.resizeCanvas(window.innerWidth, Math.min(window.innerHeight, 1080));
		}
		// Reset canvas and drawing variables on resize.
		p.setup();
	};
});
