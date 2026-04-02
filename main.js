(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 700px)').matches;

    const loader = document.getElementById('preloader');
    if (loader) {
        window.addEventListener('load', () => {
            window.setTimeout(() => {
                requestAnimationFrame(() => loader.classList.add('hidden'));
            }, 700);
        }, { once: true });
    }

    const header = document.getElementById('spHeader');
    if (header) {
        let ticking = false;
        const updateHeader = () => {
            header.classList.toggle('scrolled', window.scrollY > 40);
            ticking = false;
        };
        updateHeader();
        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateHeader);
            }
        }, { passive: true });
    }

    const ham = document.getElementById('hamburger');
    const nav = document.getElementById('mobileNav');
    if (ham && nav) {
        const setMenuState = (open) => {
            ham.classList.toggle('open', open);
            nav.classList.toggle('open', open);
            ham.setAttribute('aria-expanded', String(open));
            ham.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            document.body.classList.toggle('nav-open', open);
        };

        setMenuState(false);
        ham.addEventListener('click', () => setMenuState(!nav.classList.contains('open')));
        nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuState(false)));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') setMenuState(false);
        });
    }

    const slides = document.querySelectorAll('.hero-slide-bg');
    if (slides.length > 1 && !prefersReducedMotion && !isSmallScreen) {
        let idx = 0;
        window.setInterval(() => {
            slides[idx].classList.remove('active');
            idx = (idx + 1) % slides.length;
            slides[idx].classList.add('active');
        }, 6000);
    }

    const revealItems = document.querySelectorAll('[data-aos]');
    if (revealItems.length) {
        if ('IntersectionObserver' in window && !prefersReducedMotion) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

            revealItems.forEach((item) => {
                item.style.transitionDelay = `${item.dataset.aosDelay || 0}ms`;
                revealObserver.observe(item);
            });
        } else {
            revealItems.forEach((item) => item.classList.add('visible'));
        }
    }

    const statsRows = document.querySelectorAll('.stats-row');
    if (statsRows.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.querySelectorAll('.counter').forEach((counter) => {
                    const target = Number(counter.dataset.target || 0);
                    const duration = 900;
                    const startTime = performance.now();

                    const tick = (now) => {
                        const progress = Math.min((now - startTime) / duration, 1);
                        counter.textContent = String(Math.floor(target * progress));
                        if (progress < 1) {
                            requestAnimationFrame(tick);
                        } else {
                            counter.textContent = String(target);
                        }
                    };

                    requestAnimationFrame(tick);
                });

                observer.unobserve(entry.target);
            });
        }, { threshold: 0.4 });

        statsRows.forEach((row) => counterObserver.observe(row));
    }

    const pointsTrack = document.querySelector('.points-track');
    const pointsBars = document.querySelectorAll('.points-bar-fill');
    if (pointsTrack && pointsBars.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
        const widths = Array.from(pointsBars, (bar) => bar.style.width);
        pointsBars.forEach((bar) => {
            bar.style.width = '0';
        });

        const pointsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                pointsBars.forEach((bar, index) => {
                    window.setTimeout(() => {
                        bar.style.width = widths[index];
                    }, index * 100);
                });

                observer.disconnect();
            });
        }, { threshold: 0.3 });

        pointsObserver.observe(pointsTrack);
    }

    window.filterRules = (cat, btn) => {
        document.querySelectorAll('.rfb-btn').forEach((button) => button.classList.remove('active'));
        if (btn) btn.classList.add('active');

        document.querySelectorAll('.rules-section').forEach((section) => {
            const sectionCat = section.dataset.cat;
            const show = cat === 'all' || sectionCat === cat || sectionCat === 'all';
            section.style.display = show ? '' : 'none';
        });

        document.querySelectorAll('.rules-divider').forEach((divider) => {
            divider.style.display = cat === 'all' ? '' : 'none';
        });
    };

    window.toggleFaq = (element) => {
        const item = element.closest('.faq-item');
        if (!item) return;

        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach((faq) => faq.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    };
})();
