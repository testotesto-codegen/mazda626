import Button from '../common/Button';
import HeaderCover from './HeaderCover';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

class Particle {
	constructor(effect, x, y, color) {
		this.effect = effect;
		this.x = Math.random() * this.effect.width;
		this.y = 0;
		this.color = color;
		this.size = this.effect.gap;
		this.originX = Math.floor(x);
		this.originY = Math.floor(y);
		this.vy = 0;
		this.vx = 0;
		this.ease = 0.04;
		this.friction = 0.95;
		this.dx = 0;
		this.dy = 0;
		this.distance = 0;
		this.force = 0;
		this.angle = 0;
	}

	draw(context) {
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.size, this.size);
	}
	update() {
		this.dx = this.effect.mouse.x - this.x;
		this.dy = this.effect.mouse.y - this.y;
		this.distance = this.dx * this.dx + this.dy * this.dy;
		this.force = -this.effect.mouse.radius / this.distance;

		if (this.distance < this.effect.mouse.radius) {
			this.angle = Math.atan2(this.dy, this.dx);
			this.vx += this.force * Math.cos(this.angle);
			this.vy += this.force * Math.sin(this.angle);
		}

		this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
		this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
	}
}

class Effect {
	constructor(width, height, canvas) {
		this.canvas = canvas;
		this.width = width;
		this.height = height;
		this.particlesArray = [];
		this.image = document.getElementById('image1');
		this.centerX = this.width * 0.5;
		this.centerY = this.height * 0.5;
		this.x = this.centerX - this.image.width * 0.5;
		this.y = this.centerY - this.image.height * 0.4;
		this.gap = 2;
		this.mouse = {
			radius: 1800,
			x: undefined,
			y: undefined,
		};
		window.addEventListener('mousemove', (event) => {
			const rect = canvas.getBoundingClientRect();
			this.mouse.x = event.clientX - rect.left;
			this.mouse.y = event.clientY - rect.top;
		});
	}

	init(context) {
		context.drawImage(this.image, this.x, this.y);
		const pixels = context.getImageData(0, 0, this.width, this.height).data;
		for (let y = 0; y < this.height; y += this.gap) {
			for (let x = 0; x < this.width; x += this.gap) {
				const index = (y * this.width + x) * 4;
				const red = pixels[index];
				const green = pixels[index + 1];
				const blue = pixels[index + 2];
				const alpha = pixels[index + 3];
				const color = 'rgb(' + red + ',' + green + ',' + blue + ')';

				if (alpha > 0) {
					this.particlesArray.push(new Particle(this, x, y, color));
				}
			}
		}
	}

	draw(context) {
		this.particlesArray.forEach((particle) => particle.draw(context));
	}
	update() {
		this.particlesArray.forEach((particle) => particle.update());
	}
}

//animate();

const HeroHeader = () => {
	useEffect(() => {
		// const isLargeScreen = window.innerWidth > 1024;
		// if (!isLargeScreen) return;

		// const canvas = document.getElementById('canvas1');
		// const ctx = canvas.getContext('2d', { willReadFrequently: true });
		// canvas.width = window.innerWidth;
		// canvas.height = window.innerHeight + 400;

		// const effect = new Effect(canvas.width, canvas.height, canvas);
		// effect.init(ctx);

		// function animate() {
		// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
		// 	effect.draw(ctx);
		// 	effect.update();
		// 	requestAnimationFrame(animate);
		// }

		// animate();
	}, []);

	return (
		<div className="mt-36 relative">
			<motion.div
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ ease: 'easeOut', duration: 0.9 }}
				viewport={{ once: true }}
				className="text-center mt-20 flex flex-col gap-3 p-4 md:p-0 "
			>
				<h2 className="text-white font-semibold text-3xl md:text-6xl z-40 bg-[#121416] bg-opacity-25">Build Valuation Models Instantly</h2>
				<h3 className="gradient-text  font-semibold text-3xl md:text-6xl z-40 bg-[#121416] bg-opacity-40"> Live Hours Saved: 293</h3>
				<p className="text-white text-base md:text-lg font-medium z-40 bg-[#121416] bg-opacity-40"> Fast Financial Intelligence starts here </p>
			</motion.div>
			{/* {window.innerWidth > 1024 && (
				<>
					<canvas id="canvas1" className="absolute top-0 z-50 "></canvas>
					<img
						id="image1"
						className="hidden"
						src="data:image/png;base64,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"
					/>
				</>
			)}

			<motion.div
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ ease: 'easeOut', duration: 2 }}
				viewport={{ once: true }}
				className="flex flex-col md:flex-row justify-center gap-4 mt-8 mx-auto w-full text-center"
			>
				<Button customClassName="bg-[#813CF0] hover:bg-[#6324c9] text-white " title={'Get Started'} path={'/register'} />
				<Button customClassName="bg-[#373737]  hover:bg-[#272727] text-white" title={'Learn More'} />
			</motion.div> */}

			{/* <HeaderCover /> */}
		</div>
	);
};

export default HeroHeader;
