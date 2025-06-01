
class ArtechApp {
    constructor() {
        this.config = {
            phoneNumber: '51951111937',
            email: 'edagarchaynaleon@gmail.com',
            slideInterval: 3000
        };
        
        this.state = {
            statsAnimated: false,
            currentSlide: 0
        };
        
        this.elements = {};
        this.intervals = {};
    }

    // ========== INICIALIZACIÓN ==========
    init() {
        console.log('🔨 Artech - Carpintería cargada correctamente');
        
        this.cacheElements();
        this.initializeFeatures();
        this.setupEventListeners();
        this.removeLoader();
    }

    cacheElements() {
        this.elements = {
            header: document.querySelector('header'),
            nav: document.querySelector('nav'),
            menu: document.querySelector('.menu'),
            menuToggle: document.querySelector('.menu-toggle'),
            hero: document.querySelector('.hero'),
            statsSection: document.querySelector('.stats'),
            stats: document.querySelectorAll('.stat-item h3'),
            indicators: document.querySelectorAll('.indicator'),
            loader: document.querySelector('.loader')
        };
    }

    initializeFeatures() {
        this.initMobileMenu();
        this.initSmoothScrolling();
        this.initHeaderScroll();
        this.initAnimations();
        this.initButtons();
        this.initSocialLinks();
        this.initHeroSlideshow();
        this.initMobileOptimizations();
        this.initImageErrorHandling();
    }

    // ========== MENÚ MÓVIL ==========
    initMobileMenu() {
        this.createMobileMenuButton();
        this.setupMobileMenuEvents();
    }

    createMobileMenuButton() {
        if (!this.elements.menuToggle && this.elements.nav) {
            const menuToggle = document.createElement('div');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '<span></span><span></span><span></span>';
            
            this.elements.nav.parentNode.insertBefore(menuToggle, this.elements.nav.nextSibling);
            this.elements.menuToggle = menuToggle;
        }
    }

    setupMobileMenuEvents() {
        if (!this.elements.menuToggle || !this.elements.menu) return;

        // Toggle del menú
        this.elements.menuToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Cerrar menú al hacer click en enlaces
        const menuLinks = this.elements.menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Cerrar menú al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!this.elements.menu.contains(e.target) && 
                !this.elements.menuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.elements.menuToggle.classList.toggle('active');
        this.elements.menu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    closeMobileMenu() {
        this.elements.menuToggle?.classList.remove('active');
        this.elements.menu?.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    // ========== NAVEGACIÓN SUAVE ==========
    initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToElement(`#${targetId}`);
            });
        });
    }

    scrollToElement(selector, offset = 80) {
        const element = document.querySelector(selector);
        if (!element) return;

        const headerHeight = this.elements.header?.offsetHeight || 0;
        const targetPosition = element.offsetTop - headerHeight - offset + 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // ========== HEADER DINÁMICO ==========
    initHeaderScroll() {
        if (!this.elements.header) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                this.elements.header.style.backgroundColor = 'rgba(245, 224, 199, 0.95)';
                this.elements.header.style.backdropFilter = 'blur(10px)';
            } else {
                this.elements.header.style.backgroundColor = '#f5e0c7f0';
                this.elements.header.style.backdropFilter = 'none';
            }
        });
    }

    // ========== ANIMACIONES ==========
    initAnimations() {
        this.initStatsAnimation();
        this.initScrollAnimations();
    }

    initStatsAnimation() {
        if (!this.elements.statsSection || !this.elements.stats.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.state.statsAnimated) {
                    this.animateStats();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.elements.statsSection);
    }

    animateStats() {
        this.elements.stats.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            const isPlus = stat.textContent.includes('+');
            const increment = finalValue / 50;
            let currentValue = 0;

            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    stat.textContent = finalValue + (isPlus ? '+' : '');
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(currentValue) + (isPlus ? '+' : '');
                }
            }, 30);
        });

        this.state.statsAnimated = true;
    }

    initScrollAnimations() {
        const elements = document.querySelectorAll('.service-card, .quality-item, .project-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });
    }

    // ========== BOTONES INTERACTIVOS ==========
    initButtons() {
        this.initServiceButtons();
        this.initQuoteButtons();
    }

    initServiceButtons() {
        const serviceButtons = document.querySelectorAll('.service-card .btn');
        
        serviceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.animateButton(button);
                
                const serviceTitle = button.closest('.service-card')?.querySelector('h3')?.textContent;
                const message = `¡Hola! Me interesa el servicio de "${serviceTitle}". ¿Podrían darme más información y un presupuesto?`;
                
                this.sendWhatsAppMessage(message);
            });
        });
    }

    initQuoteButtons() {
        const quoteButtons = document.querySelectorAll('.quote-btn, .hero .btn');
        
        quoteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.animateButton(button, true);
                this.scrollToElement('#contacto');
            });
        });
    }

    animateButton(button, withScale = false) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            const transform = withScale ? 'translateY(-3px) scale(1.05)' : 'translateY(-3px)';
            button.style.transform = transform;
        }, 150);
    }

    // ========== SLIDESHOW DEL HERO ==========
    initHeroSlideshow() {
        if (!this.elements.hero || !this.elements.indicators.length) return;

        this.slideImages = [
            'images/portada3.jpg',
            'images/portada4.avif'
        ];

        this.preloadImages();
        this.setupSlideshow();
        this.startAutoSlide();
    }

    preloadImages() {
        this.slideImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    setupSlideshow() {
        // Establecer primera imagen
        this.setSlideBackground(0);

        // Event listeners para indicadores
        this.elements.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Pausar en hover
        this.elements.hero.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });

        this.elements.hero.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
    }

    setSlideBackground(index) {
        const imageUrl = this.slideImages[index];
        this.elements.hero.style.backgroundImage = 
            `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1)), url('${imageUrl}')`;
        this.updateSlideIndicators(index);
    }

    updateSlideIndicators(activeIndex) {
        this.elements.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndex);
        });
    }

    goToSlide(index) {
        this.state.currentSlide = index;
        this.setSlideBackground(index);
        this.restartAutoSlide();
    }

    nextSlide() {
        this.state.currentSlide = (this.state.currentSlide + 1) % this.slideImages.length;
        this.setSlideBackground(this.state.currentSlide);
    }

    startAutoSlide() {
        this.intervals.slideshow = setInterval(() => {
            this.nextSlide();
        }, this.config.slideInterval);
    }

    stopAutoSlide() {
        if (this.intervals.slideshow) {
            clearInterval(this.intervals.slideshow);
            this.intervals.slideshow = null;
        }
    }

    restartAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }

    // ========== REDES SOCIALES ==========
    initSocialLinks() {
        const socialLinks = document.querySelectorAll('.footer-social a');
        
        socialLinks.forEach(link => {
            const icon = link.querySelector('i');
            if (!icon) return;

            if (icon.classList.contains('fa-whatsapp')) {
                link.href = `https://wa.me/${this.config.phoneNumber}`;
                link.target = '_blank';
            } else if (icon.classList.contains('fa-facebook-f') || 
                      icon.classList.contains('fa-instagram')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const platform = icon.classList.contains('fa-facebook-f') ? 'Facebook' : 'Instagram';
                    alert(`¡Próximamente nuestro ${platform}! Por ahora contáctanos por WhatsApp.`);
                });
            }
        });
    }

    // ========== OPTIMIZACIONES MÓVILES ==========
    initMobileOptimizations() {
        // Detectar dispositivos táctiles
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }

        // Lazy loading para imágenes
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }

    initImageErrorHandling() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.addEventListener('error', function() {
                this.style.cssText = `
                    background-color: #f0f0f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #999;
                    font-size: 14px;
                `;
                this.alt = 'Imagen no disponible';
            });
        });
    }

    // ========== EVENT LISTENERS GLOBALES ==========
    setupEventListeners() {
        // Cambios de orientación
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                window.scrollTo(0, window.scrollY + 1);
                window.scrollTo(0, window.scrollY - 1);
            }, 100);
        });

        // Resize de ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });

        // Manejo de errores
        window.addEventListener('error', (e) => {
            if (e.filename?.includes('images/')) {
                console.warn('Imagen no encontrada:', e.filename);
                return true;
            }
        });
    }

    // ========== UTILIDADES PÚBLICAS ==========
    sendWhatsAppMessage(message = '¡Hola! Me interesa sus servicios de carpintería.') {
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${this.config.phoneNumber}?text=${encodedMessage}`;
        window.open(url, '_blank');
    }

    toggleElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = element.style.display === 'none' ? 'block' : 'none';
        }
    }

    removeLoader() {
        if (this.elements.loader) {
            this.elements.loader.style.opacity = '0';
            setTimeout(() => this.elements.loader.remove(), 300);
        }
    }
}

// ========== INICIALIZACIÓN ==========
document.addEventListener('DOMContentLoaded', () => {
    const app = new ArtechApp();
    app.init();

    // Exponer funciones útiles globalmente
    window.sendWhatsAppMessage = (message) => app.sendWhatsAppMessage(message);
    window.scrollToElement = (selector, offset) => app.scrollToElement(selector, offset);
    window.toggleElement = (selector) => app.toggleElement(selector);
});