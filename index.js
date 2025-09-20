document.addEventListener('DOMContentLoaded', function() {
    const viewMoreBtn = document.querySelector('.view-more-btn');
    const hiddenCertificates = document.querySelectorAll('.certificate-card.hidden');

    if (viewMoreBtn && hiddenCertificates.length > 0) {
        viewMoreBtn.addEventListener('click', function() {
            // Show all hidden certificates
            hiddenCertificates.forEach(certificate => {
                certificate.classList.remove('hidden');
                certificate.style.animation = 'fadeIn 0.5s ease forwards';
            });

            // Hide the button after showing certificates
            viewMoreBtn.style.display = 'none';
        });
    }
});

// Add this CSS animation to your index.css file


document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        // Toggle Navigation
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');

        // Animate Links
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Select all sections and elements you want to animate
    const fadeElements = document.querySelectorAll('section, .project-card, .certificate-card');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // Optional: remove the class when element is out of view
                // entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    // Add fade-in-section class and start observing each element
    fadeElements.forEach((element, index) => {
        element.classList.add('fade-in-section');
        // Optional: Add delay classes for cascading effect
        element.classList.add(`delay-${index % 3 + 1}`);
        fadeInObserver.observe(element);
    });
});

