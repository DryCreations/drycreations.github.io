new p5((p) => {
	let canvas;

	p.setup = function() {
		if (window.SKETCH_CONFIG && window.SKETCH_CONFIG.container) {
			const container = window.SKETCH_CONFIG.container;
			canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
			canvas.parent(container);
		} else {
			canvas = p.createCanvas(window.innerWidth, Math.min(window.innerHeight, 1080));
		}
		canvas.style('z-index', '-1');
	};

	p.draw = function() {
		// Add drawing logic here when ready
	};

	p.windowResized = function() {
		if (window.SKETCH_CONFIG && window.SKETCH_CONFIG.container) {
			const container = window.SKETCH_CONFIG.container;
			p.resizeCanvas(container.offsetWidth, container.offsetHeight);
		} else {
			p.resizeCanvas(window.innerWidth, Math.min(window.innerHeight, 1080));
		}
	};
});
