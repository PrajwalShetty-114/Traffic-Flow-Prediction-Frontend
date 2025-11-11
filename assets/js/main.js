// main.js - Logic for sitewide features like the mobile navigation.

// First, we select the two elements we need to control: the hamburger button and the navigation menu.
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// Safety: only attach listeners if both elements exist in the DOM.
if (hamburger && navLinks) {
    // Ensure ARIA is set for accessibility
    hamburger.setAttribute('aria-controls', 'nav-links');
    hamburger.setAttribute('aria-expanded', 'false');

    // Now, we add a 'click' event listener to the hamburger button.
    // This means the code inside will run every time the hamburger is clicked.
    hamburger.addEventListener('click', () => {
        const isActive = navLinks.classList.toggle('nav-active');
        // Reflect the state in ARIA
        hamburger.setAttribute('aria-expanded', String(isActive));
    });
}