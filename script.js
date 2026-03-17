document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.c-header');
    const menuButton = document.querySelector('.c-header__menu-toggle');
    const nav = document.querySelector('#primary-navigation');
    const navLinks = [...document.querySelectorAll('.c-nav__link[href^="#"]')];
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!menuButton || !nav || navLinks.length === 0) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopMedia = window.matchMedia('(min-width: 992px)');

    const getHeaderOffset = () => {
        if (!header) return 0;
        const styles = window.getComputedStyle(header);
        const marginBottom = Number.parseFloat(styles.marginBottom) || 0;
        return header.getBoundingClientRect().height + marginBottom + 12;
    };

    const setMenuState = (open) => {
        nav.classList.toggle('c-nav--open', open);
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Close main menu' : 'Open main menu');
    };

    const setActiveLink = (id) => {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };

    const smoothScrollToSection = (id, updateHash = true) => {
        const target = document.getElementById(id);
        if (!target) return;

        const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
        window.scrollTo({
            top: Math.max(top, 0),
            behavior: reducedMotion.matches ? 'auto' : 'smooth'
        });

        if (updateHash) {
            history.pushState(null, '', `#${id}`);
        }

        setActiveLink(id);
    };

    const getMostVisibleSectionId = () => {
        const viewportHeight = window.innerHeight;
        const midpoint = getHeaderOffset() + viewportHeight * 0.35;

        for (const section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= midpoint && rect.bottom >= midpoint) {
                return section.id;
            }
        }

        const firstVisible = sections.find((section) => section.getBoundingClientRect().top >= 0);
        return firstVisible?.id || sections[sections.length - 1]?.id || '';
    };

    menuButton.addEventListener('click', () => {
        const isOpen = nav.classList.contains('c-nav--open');
        setMenuState(!isOpen);
    });

    document.addEventListener('click', (event) => {
        if (!nav.classList.contains('c-nav--open')) return;
        if (!nav.contains(event.target) && !menuButton.contains(event.target)) {
            setMenuState(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuState(false);
            menuButton.focus();
        }
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            event.preventDefault();
            const id = href.slice(1);
            smoothScrollToSection(id);
            setMenuState(false);
        });
    });

    let activeObserver = null;
    if ('IntersectionObserver' in window) {
        activeObserver = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visible?.target?.id) {
                    setActiveLink(visible.target.id);
                }
            },
            {
                threshold: [0.2, 0.4, 0.65],
                rootMargin: `-${Math.round(getHeaderOffset())}px 0px -45% 0px`
            }
        );

        sections.forEach((section) => activeObserver.observe(section));
    } else {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                const id = getMostVisibleSectionId();
                if (id) setActiveLink(id);
                ticking = false;
            });
        }, { passive: true });
    }

    window.addEventListener('hashchange', () => {
        const id = window.location.hash.replace('#', '');
        if (!id) return;
        smoothScrollToSection(id, false);
    });

    desktopMedia.addEventListener('change', (event) => {
        if (event.matches) {
            setMenuState(false);
        }
    });

    const initialId = window.location.hash.replace('#', '') || sections[0]?.id;
    if (initialId) {
        setActiveLink(initialId);
        if (window.location.hash) {
            requestAnimationFrame(() => smoothScrollToSection(initialId, false));
        }
    }

    setMenuState(false);
});
