// model-selection.js
// This script runs on the modelSelection.html page.

document.addEventListener('DOMContentLoaded', () => {
   // --- NEW: LOTTIE ANIMATION LOADER ---
const lottieAnimations = {
        'lottie-xgboost': 'assets/lottie/xgboost.json',
        'lottie-lstm': 'assets/lottie/lstm.json',
        'lottie-catboost': 'assets/lottie/catboost.json',
        'lottie-randomforest': 'assets/lottie/randomforest.json',
        'lottie-kmeans': 'assets/lottie/kmeans.json',
        'lottie-hybrid': 'assets/lottie/hybrid.json'
    };
    //

    for (const id in lottieAnimations) {
        const container = document.getElementById(id);
        if (container) {
            const player = document.createElement('lottie-player');
            player.setAttribute('src', lottieAnimations[id]);
            player.setAttribute('background', 'transparent');
            player.setAttribute('speed', '1');
            player.setAttribute('loop', '');
            player.setAttribute('autoplay', '');
            container.appendChild(player);
        }
    }
    // --- END LOTTIE ---
   
    // Select all the model cards (match actual HTML class)
    const modelCards = document.querySelectorAll('.model-card-wrapper');

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