// DOM Elements
const header = document.querySelector('.header');
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.querySelector('.nav-list');
const navLinks = document.querySelectorAll('.nav-link');
const typingElement = document.querySelector('.typing-text');
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('form-feedback');

// 1. Sticky Navbar Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 2. Theme Toggle Logic
const themeBtn = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeBtn.querySelector('i');

// Check local storage for theme
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    body.classList.add('light-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
}

themeBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
});

// 2. Mobile Menu Toggle
mobileMenu.addEventListener('click', () => {
    navList.classList.toggle('active');
    mobileMenu.classList.toggle('active'); // Optional: animate hamburger
});

// Close mobile menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navList.classList.remove('active');
    });
});

// 3. Typing Animation
const titles = ['MERN Stack Developer', 'AI Enthusiast', 'Problem Solver'];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeDelay = 100;
let eraseDelay = 50;
let newTitleDelay = 2000;

function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
        // Remove char
        typingElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typeDelay = eraseDelay;
    } else {
        // Add char
        typingElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typeDelay = 100;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
        // Finished typing current title
        typeDelay = newTitleDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Finished deleting current title
        isDeleting = false;
        titleIndex++;
        if (titleIndex >= titles.length) {
            titleIndex = 0;
        }
    }

    setTimeout(type, typeDelay);
}

document.addEventListener('DOMContentLoaded', type);

// 4. Smooth Scrolling for Anchor Links (Optional generic handler)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // Offset for fixed header
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// 5. Form Validation
// 5. Form Validation & Formspree Integration
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    // Simple Validation
    const inputs = [nameInput, emailInput, messageInput];
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 500);
        }
    });

    if (!isValid) return;

    // Show Loading State
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

    const formData = new FormData(contactForm);

    try {
        const response = await fetch(contactForm.action, {
            method: contactForm.method,
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Success
            formFeedback.innerHTML = `Thanks for your message! I'll get back to you soon.`;
            formFeedback.className = 'success-msg fade-in';
            contactForm.reset();
        } else {
            // Error from Formspree
            const data = await response.json();
            if (Object.hasOwn(data, 'errors')) {
                formFeedback.innerHTML = data["errors"].map(error => error["message"]).join(", ");
            } else {
                formFeedback.innerHTML = "Oops! There was a problem submitting your form.";
            }
            formFeedback.className = 'error-msg fade-in';
        }
    } catch (error) {
        // Network Error
        formFeedback.innerHTML = "Oops! There was a problem submitting your form.";
        formFeedback.className = 'error-msg fade-in';
    } finally {
        // Reset Button
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';

        // Remove message after 5 seconds
        setTimeout(() => {
            formFeedback.innerHTML = '';
            formFeedback.className = '';
        }, 5000);
    }
});
