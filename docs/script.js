// Heimdahl Interactive Web Controller

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initNavigation();
    initCounters();
    initAnimations();
    initContactForms();
});

// Navigation Functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Statistics Counters
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const marketSection = document.querySelector('.hero-stats');
    if (marketSection) observer.observe(marketSection);
}

function animateCounters() {
    document.querySelectorAll('.market-number').forEach(counter => {
        const target = counter.textContent;
        const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
        if (isNaN(numericValue)) return;
        const suffix = target.replace(/[0-9.]/g, '');
        
        let current = 0;
        const duration = 2000;
        const step = numericValue / (duration / 50);
        
        const timer = setInterval(() => {
            current += step;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            if (suffix.includes('B')) {
                counter.textContent = `${current.toFixed(1)}B`;
            } else if (suffix.includes('%')) {
                counter.textContent = `${Math.round(current)}%`;
            } else {
                counter.textContent = `${Math.round(current)}${suffix}`;
            }
        }, 50);
    });
}

// Scroll Animations
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.gallery-item, .feature-card, .app-card').forEach(el => {
        observer.observe(el);
    });
}

// Contact Form
async function initContactForms() {
    const form = document.querySelector('.contact-form');
    const btn = document.getElementById('submit-btn');
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Sending...';
        }

        const formData = new FormData(form);
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('Thank you! Your message has been sent to the Heimdahl team.');
                form.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    alert(data.errors.map(error => error.message).join(", "));
                } else {
                    alert('Oops! There was a problem submitting your form.');
                }
            }
        } catch (error) {
            alert('Oops! There was a problem connecting to the server.');
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Send Message';
            }
        }
    });
}
