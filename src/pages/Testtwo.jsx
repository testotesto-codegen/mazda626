import React, { useRef, useEffect } from 'react';

class Particle {
	constructor(x, y, effect) {
		this.originX = x;
		this.originY = y;
		this.effect = effect;
		this.x = Math.floor(x);
		this.y = Math.floor(y);
		this.ctx = this.effect.ctx;
		this.color = 'orange'; // Set color to orange
		this.vx = 0;
		this.vy = 0;
		this.ease = 0.2;
		this.friction = 0.95;
		this.dx = 0;
		this.dy = 0;
		this.distance = 0;
		this.force = 0;
		this.angle = 0;
		this.size = Math.floor(Math.random() * 3);
		this.draw();
	}

	draw() {
		this.ctx.beginPath();
		this.ctx.fillStyle = this.color; // Set fill style for this particle
		this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Draw a circle
		this.ctx.fill(); // Fill the circle with color
	}

	update() {
		if (this.effect.isHovering) {
			// Apply force only when hovering
			this.dx = this.effect.mouse.x - this.x; // Calculate distance to mouse cursor
			this.dy = this.effect.mouse.y - this.y; // Calculate distance to mouse cursor
			this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy); // Calculate distance to mouse cursor
			this.force = (this.effect.maxCircleRadius - this.distance) / 100; // Adjust this value to control the strength of attraction

			if (this.force > 0) {
				// Only apply force if particle is within the circle
				this.angle = Math.atan2(this.dy, this.dx);
				this.vx += this.force * Math.cos(this.angle);
				this.vy += this.force * Math.sin(this.angle);
			}
		}

		this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
		this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
		this.draw();
	}
}

// the slower effect with all particles not joining but dispersed

class Effect {
	constructor(width, height, context) {
		this.width = width;
		this.height = height;
		this.ctx = context;
		this.particlesArray = [];
		this.gap = 20;
		this.mouse = {
			x: 0,
			y: 0,
		};
		this.isHovering = false;
		this.centerX = width / 2; // Center of canvas
		this.centerY = height / 2; // Center of canvas
		this.maxCircleRadius = 1000; // Maximum radius of circle
	}

	init() {
		for (let x = 0; x < this.width; x += this.gap) {
			for (let y = 0; y < this.height; y += this.gap) {
				this.particlesArray.push(new Particle(x, y, this));
			}
		}
	}

	update() {
		this.ctx.clearRect(0, 0, this.width, this.height);

		let totalDistance = 0;
		let particleCount = 0;

		for (let i = 0; i < this.particlesArray.length; i++) {
			this.particlesArray[i].update();
			if (this.isHovering) {
				const dx = this.particlesArray[i].x - this.centerX;
				const dy = this.particlesArray[i].y - this.centerY;
				const distance = Math.sqrt(dx * dx + dy * dy);
				totalDistance += distance;
				particleCount++;
			}
		}

		if (this.isHovering && particleCount > 0) {
			const avgDistance = totalDistance / particleCount;
			this.maxCircleRadius = Math.min(500, avgDistance * 1.5); // Adjust 1.5 to control the circle size factor
		}
	}
}

function Test() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const effect = new Effect(canvas.width, canvas.height, ctx);

		const resizeCanvas = () => {
			canvas.width = window.innerWidth * window.devicePixelRatio;
			canvas.height = window.innerHeight * window.devicePixelRatio;

			canvas.style.width = `${window.innerWidth}px`;
			canvas.style.height = `${window.innerHeight}px`;

			effect.width = canvas.width;
			effect.height = canvas.height;
			effect.centerX = canvas.width / 2;
			effect.centerY = canvas.height / 2;

			effect.init();
			effect.update();
		};

		const updateCanvas = () => {
			effect.update();
			requestAnimationFrame(updateCanvas);
		};

		const handleMouseEnter = () => {
			effect.isHovering = true;
			updateCanvas();
		};

		const handleMouseLeave = () => {
			effect.isHovering = false;
			effect.update();
		};

		const handleMouseMove = (e) => {
			effect.mouse.x = e.clientX * window.devicePixelRatio;
			effect.mouse.y = e.clientY * window.devicePixelRatio;
		};

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
		canvas.addEventListener('mouseenter', handleMouseEnter);
		canvas.addEventListener('mouseleave', handleMouseLeave);
		canvas.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			canvas.removeEventListener('mouseenter', handleMouseEnter);
			canvas.removeEventListener('mouseleave', handleMouseLeave);
			canvas.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return <canvas ref={canvasRef} className="absolute top-0 bottom-0 left-0 right-0 z-40" />;
}

export default Test;

/*
import { useRef, useEffect } from 'react';

class Particle {
	constructor(x, y, effect) {
		this.originX = x;
		this.originY = y;
		this.effect = effect;
		this.x = Math.floor(x);
		this.y = Math.floor(y);
		this.ctx = this.effect.ctx;
		this.color = '#FFA500';
		this.vx = 0;
		this.vy = 0;
		this.ease = 0.2;
		this.friction = 0.95;
		this.dx = 0;
		this.dy = 0;
		this.distance = 0;
		this.force = 0;
		this.angle = 0;
		this.size = Math.floor(Math.random() * 5);
		this.draw();
	}

	draw() {
		this.ctx.beginPath();
		//this.ctx.fillRect(this.x, this.y, this.size, this.size);
		this.ctx.fillStyle = this.color;
		this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		this.ctx.fill();
	}

	update() {
		this.dx = this.effect.mouse.x - this.x;
		this.dy = this.effect.mouse.y - this.y;
		this.distance = this.dx * this.dx + this.dy * this.dy;
		this.force = (-this.effect.mouse.radius / this.distance) * 8;

		if (this.distance < this.effect.mouse.radius) {
			this.angle = Math.atan2(this.dy, this.dx);
			this.vx += this.force * Math.cos(this.angle);
			this.vy += this.force * Math.sin(this.angle);
		}

		// If mouse is hovering, move particles towards the center to form a circle
		if (this.effect.isHovering) {
			const centerDx = this.originX - this.effect.centerX;
			const centerDy = this.originY - this.effect.centerY;
			const centerDistance = Math.sqrt(centerDx * centerDx + centerDy * centerDy);
			const forceToCenter = -centerDistance / 100; // Adjust this value to control the strength of attraction

			this.vx += forceToCenter * Math.cos(this.angle);
			this.vy += forceToCenter * Math.sin(this.angle);
		}

		this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
		this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
		this.draw();
	}
}

class Effect {
	constructor(width, height, context) {
		this.width = width;
		this.height = height;
		this.ctx = context;
		this.particlesArray = [];
		this.gap = 20;
		this.mouse = {
			radius: 150, // Reduce mouse radius for hover effect
			x: 0,
			y: 0,
		};
		this.isHovering = false;
		this.centerX = width / 2; // Center of canvas
		this.centerY = height / 2; // Center of canvas
		this.maxCircleRadius = 1000; // Maximum distance from center to form a circle
	}

	init() {
		for (let x = 0; x < this.width; x += this.gap) {
			for (let y = 0; y < this.height; y += this.gap) {
				this.particlesArray.push(new Particle(x, y, this));
			}
		}
	}

	update() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		for (let i = 0; i < this.particlesArray.length; i++) {
			this.particlesArray[i].update();
		}
	}
}

function Test() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		console.log('ctx', ctx);

		const resizeCanvas = () => {
			canvas.width = window.innerWidth * window.devicePixelRatio;
			canvas.height = window.innerHeight * window.devicePixelRatio;

			canvas.style.width = `${window.innerWidth}px`;
			canvas.style.height = `${window.innerHeight}px`;
		};

		const effect = new Effect(canvas.width, canvas.height, ctx);
		effect.init();

		const updateCanvas = () => {
			effect.update();
			requestAnimationFrame(updateCanvas);
		};

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);

		canvas.addEventListener('mouseenter', handleMouseEnter);
		canvas.addEventListener('mouseleave', handleMouseLeave);

		function handleMouseEnter() {
			effect.isHovering = true;
		}

		function handleMouseLeave() {
			effect.isHovering = false;
		}

		window.addEventListener('mousemove', handleMouseMove);

		function handleMouseMove(e) {
			effect.mouse.x = e.clientX * window.devicePixelRatio;
			effect.mouse.y = e.clientY * window.devicePixelRatio;
		}

		updateCanvas();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			canvas.removeEventListener('mouseenter', handleMouseEnter);
			canvas.removeEventListener('mouseleave', handleMouseLeave);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return <canvas ref={canvasRef} />;
}

export default Test;
*/
/*

import { useRef, useEffect } from 'react';

class Particle {
	constructor(x, y, effect) {
		this.originX = x;
		this.originY = y;
		this.effect = effect;
		this.x = Math.floor(x);
		this.y = Math.floor(y);
		this.ctx = this.effect.ctx;
		this.ctx.fillStyle = 'orange';
		this.vx = 0;
		this.vy = 0;
		this.ease = 0.2;
		this.friction = 0.95;
		this.dx = 0;
		this.dy = 0;
		this.distance = 0;
		this.force = 0;
		this.angle = 0;
		this.size = Math.floor(Math.random() * 5);
		this.draw();
	}

	draw() {
		this.ctx.beginPath();
		this.ctx.fillRect(this.x, this.y, this.size, this.size);
	}

	update() {
		this.dx = this.effect.mouse.x - this.x;
		this.dy = this.effect.mouse.y - this.y;
		this.distance = this.dx * this.dx + this.dy * this.dy;
		this.force = (-this.effect.mouse.radius / this.distance) * 8;

		if (this.distance < this.effect.mouse.radius) {
			this.angle = Math.atan2(this.dy, this.dx);
			this.vx += this.force * Math.cos(this.angle);
			this.vy += this.force * Math.sin(this.angle);
		}

		this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
		this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
		this.draw();
	}
}

class Effect {
	constructor(width, height, context) {
		this.width = width;
		this.height = height;
		this.ctx = context;
		this.particlesArray = [];
		this.gap = 20;
		this.mouse = {
			radius: 3000,
			x: 0,
			y: 0,
		};
	}

	init() {
		for (let x = 0; x < this.width; x += this.gap) {
			for (let y = 0; y < this.height; y += this.gap) {
				this.particlesArray.push(new Particle(x, y, this));
			}
		}
	}

	update() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		for (let i = 0; i < this.particlesArray.length; i++) {
			this.particlesArray[i].update();
		}
	}
}

function Test() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		const resizeCanvas = () => {
			canvas.width = window.innerWidth * window.devicePixelRatio;
			canvas.height = window.innerHeight * window.devicePixelRatio;

			canvas.style.width = `${window.innerWidth}px`;
			canvas.style.height = `${window.innerHeight}px`;
		};

		const effect = new Effect(canvas.width, canvas.height, ctx);
		effect.init();

		const updateCanvas = () => {
			effect.update();
			requestAnimationFrame(updateCanvas);
		};

		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
		window.addEventListener('mousemove', (e) => {
			effect.mouse.x = e.clientX * window.devicePixelRatio;
			effect.mouse.y = e.clientY * window.devicePixelRatio;
		});

		function handleMouseMove(e) {
			effect.mouse.x = e.clientX * window.devicePixelRatio;
			effect.mouse.y = e.clientY * window.devicePixelRatio;
		}

		updateCanvas();

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return <canvas ref={canvasRef} />;
}

export default Test;
*/

// the quicker effect allowing all particles come closers to center

/*
class Effect {
	constructor(width, height, context) {
		this.width = width;
		this.height = height;
		this.ctx = context;
		this.particlesArray = [];
		this.gap = 20;
		this.mouse = {
			x: 0,
			y: 0,
		};
		this.isHovering = false;
		this.centerX = width / 2; // Center of canvas
		this.centerY = height / 2; // Center of canvas
		this.maxCircleRadius = 1000; // Maximum radius of circle
	}

	init() {
		for (let x = 0; x < this.width; x += this.gap) {
			for (let y = 0; y < this.height; y += this.gap) {
				this.particlesArray.push(new Particle(x, y, this));
			}
		}
	}

	update() {
		this.ctx.clearRect(0, 0, this.width, this.height);
		for (let i = 0; i < this.particlesArray.length; i++) {
			this.particlesArray[i].update();
		}
	}
}
*/
