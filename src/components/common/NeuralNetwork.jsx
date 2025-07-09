import { useEffect, useRef } from "react";

const NeuralNetworkBackground = () => {
    const canvasRef = useRef(null);
  
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let mouseX = 0;
        let mouseY = 0;
        const deltaX = 0.005;
        const deltaY = 0.005;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    
        const neurons = [];
        const connections = [];
        const layers = [3, 5, 5, 5, 1]; // Example neural network structure
        const spacingX = canvas.width / (layers.length + 1);
    
        // Generate neurons and their positions
        layers.forEach((count, layerIndex) => {
            for (let i = 0; i < count; i++) {
                neurons.push({
                    baseX: (layerIndex + 1) * spacingX,
                    baseY: (i + 1) * (window.innerHeight / (count + 1)),
                    x: 0,
                    y: 0,
                    radius: 8,
                    offsetX: Math.random() * 2 * Math.PI,
                    offsetY: Math.random() * 2 * Math.PI
                });
            }
        });
    
        // Generate connections between neurons
        for (let i = 0; i < layers.length - 1; i++) {
            const currentLayer = neurons.filter(n => n.baseX === (i + 1) * spacingX);
            const nextLayer = neurons.filter(n => n.baseX === (i + 2) * spacingX);
    
            currentLayer.forEach((neuron) => {
                nextLayer.forEach((nextNeuron) => {
                    connections.push({
                        from: neuron,
                        to: nextNeuron,
                        opacity: (Math.random() * 0.5) + 0.1,
                    });
                });
            });
        }

        let time = 0;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.01;

            // Update neuron positions with animation
            neurons.forEach((n) => {
                n.x = n.baseX + Math.sin(time + n.offsetX) * spacingX * deltaX;
                n.y = n.baseY + Math.cos(time + n.offsetY) * canvas.height * deltaY;
            });

            // Draw connections
            connections.forEach((c) => {
                ctx.beginPath();
                ctx.moveTo(
                    c.from.baseX + Math.sin(time + c.from.offsetX) * spacingX * deltaX,
                    c.from.baseY + Math.cos(time + c.from.offsetY) * canvas.height * deltaY
                );
                ctx.lineTo(
                    c.to.baseX + Math.sin(time + c.to.offsetX) * spacingX * deltaX,
                    c.to.baseY + Math.cos(time + c.to.offsetY) * canvas.height * deltaY
                );
                ctx.strokeStyle = `rgba(255, 255, 255, ${c.opacity})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            });

            // Draw neurons
            neurons.forEach((n) => {
                const dist = 1 - Math.pow((Math.sqrt(Math.pow(mouseX - n.x, 2) + Math.pow(mouseY - n.y, 2)) / 250), 2);
                //${0.4 * (1 + dist)})
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, 0.5`;
                ctx.fill();
            });
        }
    
        // Animation loop
        const animate = () => {
            draw();
            requestAnimationFrame(animate);
        };
        animate();
    
        // Handle window resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    return (
      <canvas
        ref={canvasRef}
        className="absolute top-[50px] left-0 w-full h-full bg-[#121416] z-[-1]"
      />
    );
  };
  
  export default NeuralNetworkBackground;