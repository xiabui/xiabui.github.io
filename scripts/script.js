document.addEventListener("DOMContentLoaded", () => {
  // Scroll Animation Observer
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Optional: Stop observing once visible to run only once
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((el) => observer.observe(el));

  // Countdown Timer
  
  const weddingDate = new Date('April 5, 2026 09:00:00').getTime();

  const countdownFunction = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
          clearInterval(countdownFunction);
          const countdownEl = document.getElementById("countdown");
          if(countdownEl) countdownEl.innerHTML = "Đã diễn ra";
          return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const countdownEl = document.getElementById("countdown");
      if(countdownEl) {
          countdownEl.innerHTML = `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
      }
  }, 1000);

  // Background Music Control
  const musicBtn = document.getElementById('music-btn');
  const bgMusic = document.getElementById('bg-music');
  let isPlaying = false;

  toggleMusic()

  function toggleMusic() {
      if (isPlaying) {
          bgMusic.pause();
          musicBtn.classList.remove('playing');
          musicBtn.classList.add('paused');
      } else {
          bgMusic.play().then(() => {
            musicBtn.classList.add('playing');
            musicBtn.classList.remove('paused');
          }).catch(e => console.log("Audio play failed:", e));
      }
      isPlaying = !isPlaying;
  }

  musicBtn.addEventListener('click', toggleMusic);

  // Try Auto-play
  bgMusic.volume = 0.5; // Set volume to 50%
  const playPromise = bgMusic.play();

  if (playPromise !== undefined) {
      playPromise.then(_ => {
          // Autoplay started!
          isPlaying = true;
          musicBtn.classList.add('playing');
      }).catch(error => {
          // Autoplay was prevented.
          // Show a UI element to let the user manually start playback.
          console.log("Autoplay prevented. User interaction required.");
          musicBtn.classList.remove('playing');
          musicBtn.classList.add('paused');
          
          // Optional: One-time click listener on body to start music if autoplay failed
          document.body.addEventListener('click', function startMusicOnce() {
              bgMusic.play();
              isPlaying = true;
              musicBtn.classList.add('playing');
              musicBtn.classList.remove('paused');
              document.body.removeEventListener('click', startMusicOnce);
          });
      });
  }

  // Hero Sparkler Effect
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];

      class Particle {
          constructor() {
              this.reset();
          }

          reset() {
              this.x = Math.random() * canvas.width;
              this.y = canvas.height + Math.random() * 100; // Start below
              this.size = Math.random() * 2 + 0.5;
              this.speedY = Math.random() * 1 + 0.5; // Slow rise
              this.speedX = Math.random() * 0.6 - 0.3; // Slight drift
              this.life = Math.random() * 100 + 50;
              this.opacity = Math.random() * 0.5 + 0.3;
              this.color = `rgba(255, 215, 0, ${this.opacity})`; // Gold/Sparkler color
          }

          update() {
              this.y -= this.speedY;
              this.x += this.speedX;
              this.life--;
              this.opacity -= 0.005;

              if (this.life <= 0 || this.opacity <= 0) {
                  this.reset();
              }
          }

          draw() {
              ctx.fillStyle = `rgba(255, 220, 150, ${this.opacity})`;
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
              ctx.fill();
              
              // Sparkle glint
              if (Math.random() > 0.95) {
                 ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                 ctx.fillRect(this.x - 1, this.y - 1, 2, 2);
              }
          }
      }

      function initParticles() {
          for (let i = 0; i < 100; i++) {
              particles.push(new Particle());
          }
      }

      function animate() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          for (let i = 0; i < particles.length; i++) {
              particles[i].update();
              particles[i].draw();
          }
          requestAnimationFrame(animate);
      }
      
      // Handle Resize
      window.addEventListener('resize', () => {
         canvas.width = window.innerWidth;
         canvas.height = window.innerHeight;
      });

      initParticles();
      animate();
  }
});
