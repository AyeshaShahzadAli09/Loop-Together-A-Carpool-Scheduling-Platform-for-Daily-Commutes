import { useEffect, useRef } from 'react';

const MovingCarsBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Car {
      constructor() {
        // Initialize with random position and properties
        this.size = 40 + Math.random() * 20;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.speed = (2 + Math.random() * 2) * this.direction;
        
        // Random lane position (divide screen into 5 lanes)
        const laneCount = 5;
        const laneHeight = canvas.height / laneCount;
        const lane = Math.floor(Math.random() * laneCount);
        this.y = lane * laneHeight + laneHeight / 2;
        
        // Start position based on direction
        this.x = this.direction > 0 ? -this.size : canvas.width + this.size;
        
        // Random bright color
        const hues = [0, 60, 120, 180, 240, 300]; // Red, Yellow, Green, Cyan, Blue, Magenta
        const hue = hues[Math.floor(Math.random() * hues.length)];
        this.color = `hsl(${hue}, 80%, 65%)`;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.direction < 0) {
          ctx.scale(-1, 1);
        }

        // Car body (main)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.roundRect(-this.size/2, -this.size/3, this.size, this.size/1.8, 8);
        ctx.fill();

        // Car top
        ctx.beginPath();
        ctx.roundRect(-this.size/3, -this.size/2, this.size/1.5, this.size/3, 6);
        ctx.fill();

        // Windows
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        // Front window
        ctx.fillRect(this.size/6, -this.size/2.2, this.size/4, this.size/3);
        // Back window
        ctx.fillRect(-this.size/2.5, -this.size/2.2, this.size/4, this.size/3);

        // Wheels
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(-this.size/3, this.size/4, this.size/7, 0, Math.PI * 2);
        ctx.arc(this.size/3, this.size/4, this.size/7, 0, Math.PI * 2);
        ctx.fill();

        // Wheel caps
        ctx.fillStyle = '#777';
        ctx.beginPath();
        ctx.arc(-this.size/3, this.size/4, this.size/14, 0, Math.PI * 2);
        ctx.arc(this.size/3, this.size/4, this.size/14, 0, Math.PI * 2);
        ctx.fill();

        // Headlights
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.size/2 - 5, -this.size/6, this.size/12, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      update() {
        this.x += this.speed;
        
        // Reset position when car goes off screen
        if ((this.direction > 0 && this.x > canvas.width + this.size) || 
            (this.direction < 0 && this.x < -this.size)) {
          // Reset to a new lane
          const laneCount = 5;
          const laneHeight = canvas.height / laneCount;
          const lane = Math.floor(Math.random() * laneCount);
          this.y = lane * laneHeight + laneHeight / 2;
          
          // Reset x position
          this.x = this.direction > 0 ? -this.size : canvas.width + this.size;
          
          // Occasionally change direction
          if (Math.random() < 0.3) {
            this.direction *= -1;
            this.speed = (2 + Math.random() * 2) * this.direction;
          }
        }
      }
    }

    // Create more cars for a busier scene
    const cars = Array.from({ length: 15 }, () => new Car());

    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 77, 77, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      cars.forEach(car => {
        car.update();
        car.draw();
      });
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.7,
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default MovingCarsBackground; 