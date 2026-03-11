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

  // Also observe dynamically added elements (e.g., from gallery JS)
  const mutationObs = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.classList && node.classList.contains('animate-on-scroll')) {
            observer.observe(node);
          }
          // Check children too
          const children = node.querySelectorAll && node.querySelectorAll('.animate-on-scroll');
          if (children) children.forEach((child) => observer.observe(child));
        }
      });
    });
  });
  mutationObs.observe(document.body, { childList: true, subtree: true });

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

  // ==========================================
  // Background Music Control (Cross-page sync)
  // ==========================================
  const musicBtn = document.getElementById('music-btn');
  const bgMusic = document.getElementById('bg-music');
  
  if (musicBtn && bgMusic) {
      let isPlaying = sessionStorage.getItem('musicPlaying') === 'true';
      const savedTime = sessionStorage.getItem('musicTime');
      
      bgMusic.volume = 0.5;
      
      // Restore previous time if it exists
      if (savedTime && !isNaN(savedTime)) {
          bgMusic.currentTime = parseFloat(savedTime);
      }

      function updateMusicUI() {
          if (isPlaying) {
              musicBtn.classList.add('playing');
              musicBtn.classList.remove('paused');
          } else {
              musicBtn.classList.remove('playing');
              musicBtn.classList.add('paused');
          }
      }

      function toggleMusic() {
          if (isPlaying) {
              bgMusic.pause();
              isPlaying = false;
              sessionStorage.setItem('musicPlaying', 'false');
          } else {
              bgMusic.play().catch(e => console.log("Audio play failed:", e));
              isPlaying = true;
              sessionStorage.setItem('musicPlaying', 'true');
          }
          updateMusicUI();
      }

      musicBtn.addEventListener('click', toggleMusic);

      // Save time continuously to resume perfectly on next page
      setInterval(() => {
          if (isPlaying && !bgMusic.paused) {
              sessionStorage.setItem('musicTime', bgMusic.currentTime);
          }
      }, 500);

      // Initial Play Logic
      if (isPlaying) {
          // It was playing on the previous page, try to resume
          const playPromise = bgMusic.play();
          if (playPromise !== undefined) {
              playPromise.then(() => {
                  updateMusicUI();
              }).catch(error => {
                  console.log("Autoplay prevented on navigation. User needs to interact.");
                  isPlaying = false;
                  sessionStorage.setItem('musicPlaying', 'false');
                  updateMusicUI();
              });
          }
      } else if (sessionStorage.getItem('musicPlaying') === null) {
          // First time visitor, try autoplay
          const playPromise = bgMusic.play();
          if (playPromise !== undefined) {
              playPromise.then(() => {
                  isPlaying = true;
                  sessionStorage.setItem('musicPlaying', 'true');
                  updateMusicUI();
              }).catch(error => {
                  console.log("Initial autoplay prevented.");
                  isPlaying = false;
                  sessionStorage.setItem('musicPlaying', 'false');
                  updateMusicUI();
              });
          }
      } else {
          updateMusicUI();
      }

      // One-time interaction to start music if autoplay failed
      document.body.addEventListener('click', function startMusicOnce() {
          if (!isPlaying && sessionStorage.getItem('userInteracted') !== 'true') {
              sessionStorage.setItem('userInteracted', 'true');
              bgMusic.play().then(() => {
                  isPlaying = true;
                  sessionStorage.setItem('musicPlaying', 'true');
                  updateMusicUI();
              }).catch(e => console.log(e));
          }
          // Remove listener after first interaction
          document.body.removeEventListener('click', startMusicOnce);
      }, { once: true });
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
