// --- THEME TOGGLE LOGIC ---

// Wait for the DOM (HTML) to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Get the toggle checkbox
    const themeToggle = document.getElementById('theme-toggle');
    
    // Get the user's saved theme from localStorage, or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply the saved theme to the body
    document.body.setAttribute('data-theme', currentTheme);

    // Set the toggle's checked state to match the saved theme
    if (currentTheme === 'dark') {
        themeToggle.checked = true;
    }

    // Add a listener for when the toggle is clicked
    themeToggle.addEventListener('change', () => {
        let newTheme;
        
        // If the toggle is checked, set the theme to dark
        if (themeToggle.checked) {
            newTheme = 'dark';
        } else {
            // Otherwise, set it to light
            newTheme = 'light';
        }
        
        // Apply the new theme to the body
        document.body.setAttribute('data-theme', newTheme);
        
        // Save the user's choice in localStorage
        localStorage.setItem('theme', newTheme);
    });
});