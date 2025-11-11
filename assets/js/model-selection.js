// model-selection.js
// This script runs on the modelSelection.html page.

document.addEventListener('DOMContentLoaded', () => {
    // Select all the model cards
    const modelCards = document.querySelectorAll('.model-select-card');

    // Loop through each card
    for (let i = 0; i < modelCards.length; i++) {
        const card = modelCards[i];
        
        // Add a click listener to the entire card
        card.addEventListener('click', () => {
            // Get the model name from the 'data-model' attribute
            const selectedModel = card.getAttribute('data-model');
            
            // 1. Save the choice to localStorage
            // This is how the next page knows which model to load.
            localStorage.setItem('selectedPredictionModel', selectedModel);
            
            // 2. Give user feedback (optional)
            // Protect against missing data-model attribute
            const displayName = selectedModel ? selectedModel.toUpperCase() : 'EXPERT';
            alert('Loading the ' + displayName + ' expert dashboard...');
            
            // 3. Redirect the user to the NEW expert page
            window.location.href = 'expert-dashboard.html';
        });
    }
});