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
            if (countdownEl) countdownEl.innerHTML = "Đã diễn ra";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const countdownEl = document.getElementById("countdown");
        if (countdownEl) {
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

        // ==========================================
        // Lyrics Sync Logic
        // ==========================================
        const lyricsContainer = document.getElementById('lyrics-container');
        const lyricPrev = document.getElementById('lyric-prev');
        const lyricCur = document.getElementById('lyric-cur');
        const lyricNext = document.getElementById('lyric-next');

        // BẠN CÓ THỂ THAY ĐỔI LỜI BÀI HÁT TẠI ĐÂY
        // time: thời gian xuất hiện (đơn vị: giây)
        // text: lời bài hát
        const lyrics = [
            // Phần 1
            { time: 19, text: "Anh vẫn nhớ ngày đầu tiên em đến" },
            { time: 24, text: "Như ánh nắng dành tặng giọt sương đêm" },
            { time: 27, text: "Thấy thế giới xung quanh ô hay lạ lùng" },
            { time: 30, text: "Người ơi sao lại tới đúng lúc con tim tôi không đợi mong?" },

            { time: 35, text: "Anh đâu nghĩ mình hợp nhau đến nỗi" },
            { time: 39, text: "Đôi câu nói cười một ngày không thôi" },
            { time: 42, text: "Những kí ức khi xưa như xa mờ dần" },
            { time: 45, text: "Để lòng anh lại muốn bất chấp âu lo yêu thêm một lần" },

            // Tiền điệp khúc
            { time: 50, text: "Có những điều anh chưa thể nói ra" },
            { time: 54, text: "Điều xa xôi về chúng ta" },
            { time: 58, text: "Em ơi ngày sau thời gian sẽ dẫn đôi ta về đâu?" },
            { time: 65, text: "Chỉ mong giờ bên cạnh nhau em sẽ không quên" },

            // Điệp khúc 1
            { time: 72, text: "Từ ngày đầu tiên như thế" },
            { time: 77, text: "Mỗi tối anh đưa em về" },
            { time: 81, text: "Mình chọn cùng đi những lối thật dài" },
            { time: 85, text: "Nhìn lại trời đã ban mai" },

            { time: 88, text: "Chuyện mình làm sao viết hết" },
            { time: 92, text: "Những tháng năm dành bên nhau thật thà" },
            { time: 96, text: "Ánh mắt em như đưa anh về nhà" },

            { time: 101, text: "Dù người vững chãi hay còn chơi vơi" },
            { time: 105, text: "Dù nhiều bão tố gian nan đường đời" },
            { time: 109, text: "Ít nhất luôn có anh thương em nhiều nhất" },

            { time: 116, text: "" }, // Nghỉ ngắt quãng giữa bài

            // Phần 2
            { time: 123, text: "Dẫu đã biết chẳng một ai giữ mãi" },
            { time: 127, text: "Những cảm xúc từ thuở đầu si mê" },
            { time: 131, text: "Thế mới nói bên em ô hay thật lạ" },
            { time: 134, text: "Càng làm anh lại muốn ở mãi nơi đây không bao giờ xa" },

            { time: 140, text: "Em vẫn thế, người anh yêu vẫn thế" },
            { time: 144, text: "Luôn ấm áp và tràn đầy đam mê" },
            { time: 146, text: "Vẫn thích cách em luôn quan tâm mọi người" },
            { time: 149, text: "Mà niềm ân cần dẫu những tháng năm trôi cũng không hề vơi" },

            // Tiền điệp khúc 2
            { time: 154, text: "Có những điều anh chưa thể nói ra" },
            { time: 158, text: "Điều xa xôi về chúng ta" },
            { time: 162, text: "Em ơi ngày sau thời gian sẽ dẫn đôi ta về đâu?" },
            { time: 169, text: "Chỉ mong giờ bên cạnh nhau em sẽ không quên" },

            // Điệp khúc 2
            { time: 175, text: "Từ ngày đầu tiên như thế" },
            { time: 179, text: "Mỗi tối anh đưa em về" },
            { time: 183, text: "Mình chọn cùng đi những lối thật dài" },
            { time: 187, text: "Nhìn lại trời đã ban mai" },

            { time: 189, text: "Chuyện mình làm sao viết hết" },
            { time: 194, text: "Những tháng năm dành bên nhau thật thà" },
            { time: 198, text: "Ánh mắt em như đưa anh về nhà" },

            { time: 203, text: "Dù người vững chãi hay còn chơi vơi" },
            { time: 207, text: "Dù nhiều bão tố gian nan đường đời" },
            { time: 212, text: "Ít nhất luôn có anh thương em nhiều nhất" },

            { time: 220, text: "" }, // Break nhạc

            // Điệp khúc cuối
            { time: 221, text: "Từ ngày đầu tiên như thế" },
            { time: 225, text: "Cho đến mai sau có thể" },
            { time: 229, text: "Được cùng em đi hết quãng đường dài" },
            { time: 232, text: "Hôn em chào mỗi ban mai" },

            { time: 237, text: "Chuyện mình làm sao viết hết" },
            { time: 240, text: "Những tháng năm dành bên nhau thật thà" },
            { time: 244, text: "Ánh mắt em như đưa anh về nhà" },

            { time: 250, text: "Dù người vững chãi hay còn chơi vơi" },
            { time: 253, text: "Dù nhiều bão tố gian nan đường đời" },
            { time: 258, text: "Ít nhất luôn có anh thương em nhiều nhất" },

            // Outro
            { time: 267, text: "Sau này tóc có hơi bạc hơn trước" },
            { time: 271, text: "Thì mình vẫn cứ yêu nhau như bình thường" },
            { time: 274, text: "Vẫn nói anh sẽ luôn thương em nhiều nhất" },
            { time: 284, text: "" },
            { time: 285, text: "" },
            { time: 286, text: "" } // Kết thúc
        ];

        if (lyricsContainer && lyricCur) {
            bgMusic.addEventListener('timeupdate', () => {
                const currentTime = bgMusic.currentTime;

                let currentIndex = -1;
                for (let i = 0; i < lyrics.length; i++) {
                    if (currentTime >= lyrics[i].time) {
                        currentIndex = i;
                    } else {
                        break;
                    }
                }

                if (currentIndex !== -1) {
                    const currentLyricText = lyrics[currentIndex].text || "";
                    const lastLyricText = lyricCur.dataset.text || "";

                    // Update DOM only if lyric changed
                    if (lastLyricText !== currentLyricText) {
                        lyricCur.dataset.text = currentLyricText;

                        // Prev lyric
                        let prevText = "";
                        if (currentIndex > 0) {
                            prevText = lyrics[currentIndex - 1].text || "";
                        }

                        // Next lyric
                        let nextText = "";
                        if (currentIndex < lyrics.length - 1) {
                            nextText = lyrics[currentIndex + 1].text || "";
                        }

                        // Helper function to update individual bubbles
                        function updateBubble(el, txt) {
                            if (!el) return;
                            el.innerText = txt;
                            if (txt.trim() === "") {
                                el.classList.remove('show');
                            } else {
                                el.classList.add('show');
                            }
                        }

                        // Apply to DOM
                        updateBubble(lyricPrev, prevText);
                        updateBubble(lyricCur, currentLyricText);
                        updateBubble(lyricNext, nextText);
                    }
                }
            });
        }
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
