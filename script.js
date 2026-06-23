   /* ── YEAR ── */
        document.getElementById('yr').textContent = new Date().getFullYear();

        /* ── NAV TOGGLE ── */
        function toggleNav() {
            const navlist = document.getElementById('navlist');
            const ham = document.getElementById('ham');
            navlist.classList.toggle('open');
            ham.classList.toggle('open');
            const isOpen = navlist.classList.contains('open');
            ham.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        }

        function closeNav() {
            const navlist = document.getElementById('navlist');
            const ham = document.getElementById('ham');
            navlist.classList.remove('open');
            ham.classList.remove('open');
            ham.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        // Close nav on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeNav();
            }
        });

        /* ── ACTIVE NAV ── */
        const secs = document.querySelectorAll('section[id]');
        const nls = document.querySelectorAll('.nav-links a:not(.nav-cta)');
        window.addEventListener('scroll', () => {
            let cur = '';
            secs.forEach(s => { if (window.scrollY >= s.offsetTop - 90) cur = s.id; });
            nls.forEach(a => a.classList.toggle('nav-active', a.getAttribute('href') === '#' + cur));
        }, { passive: true });

        /* ── TYPEWRITER ── */
        const phrases = ['React applications.', 'full-stack platforms.', 'clean, fast interfaces.', 'things that ship.'];
        let pi = 0,
            ci = 0,
            del = false;
        const tel = document.getElementById('typed-text');

        function type() {
            const p = phrases[pi];
            if (!del) {
                tel.textContent = p.slice(0, ++ci);
                if (ci === p.length) {
                    setTimeout(() => { del = true;
                        type(); }, 2200);
                    return;
                }
                setTimeout(type, 70);
            } else {
                tel.textContent = p.slice(0, --ci);
                if (ci === 0) {
                    del = false;
                    pi = (pi + 1) % phrases.length;
                    setTimeout(type, 400);
                    return;
                }
                setTimeout(type, 35);
            }
        }
        type();

        /* ── PROJECTS TOGGLE ── */
        let projOpen = false;

        function toggleProj() {
            projOpen = !projOpen;
            const btn = document.getElementById('proj-btn');
            document.querySelectorAll('.hidden-proj').forEach(el => {
                el.style.display = projOpen ? 'grid' : 'none';
                if (projOpen) {
                    el.classList.remove('visible');
                    revObs.observe(el);
                }
            });
            btn.innerHTML = projOpen ?
                'Show fewer projects <span class="arr" style="display:inline-block;transform:rotate(180deg)">↓</span>' :
                'View more projects <span class="arr">↓</span>';
            btn.classList.toggle('expanded', projOpen);
            if (!projOpen) document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        }

        /* ── CERTIFICATES TOGGLE ── */
        let certOpen = false;

        function toggleCert() {
            certOpen = !certOpen;
            const btn = document.getElementById('cert-btn');
            document.querySelectorAll('.hidden-cert').forEach(el => {
                el.style.display = certOpen ? 'flex' : 'none';
                if (certOpen) {
                    el.classList.remove('visible');
                    revObs.observe(el);
                }
            });
            btn.innerHTML = certOpen ?
                'Show fewer <span class="arr" style="display:inline-block;transform:rotate(180deg)">↓</span>' :
                'View all credentials <span class="arr">↓</span>';
            btn.classList.toggle('expanded', certOpen);
            if (!certOpen) document.getElementById('certificate').scrollIntoView({ behavior: 'smooth' });
        }

        /* ── INITIAL HIDE ── */
        document.querySelectorAll('.hidden-proj, .hidden-cert').forEach(el => { el.style.display = 'none'; });

        /* ── SCROLL REVEAL ── */
        const revObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    revObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.07 });
        document.querySelectorAll('.reveal').forEach(el => {
            if (getComputedStyle(el).display !== 'none') revObs.observe(el);
        });

        /* ── CONTACT FORM ── */
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            if (!email.includes('@') || !email.includes('.')) {
                alert('Please enter a valid email address.');
                return;
            }

            const subject = `Message from ${name}`;
            const body = `${message}\n\n—\nFrom: ${name} (${email})`;
            window.location.href =
                `mailto:vanshsehgal6267@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });

        /* ── CONSOLE WELCOME ── */
        console.log('%c👨‍💻 Vansh Sehgal - Portfolio', 'font-size: 20px; font-weight: bold; color: #3B5BDB;');
        console.log('%cBuilt with ❤️ using HTML, CSS & JavaScript', 'font-size: 14px; color: #8A8A8A;');
        console.log('%c📧 vanshsehgal6267@gmail.com', 'font-size: 14px; color: #3B5BDB;');