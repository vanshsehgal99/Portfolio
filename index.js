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

