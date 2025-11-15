// dashboard.js - The core logic for the prediction dashboard.

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INITIALIZE THE MAP ---
    // ---------------------------------
    const map = L.map('map').setView([12.9716, 77.5946], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Fix for responsive displays: Leaflet needs to be invalidated when container size changes
    // Call once after a small timeout and on window resize so map tiles render correctly on small screens.
    setTimeout(() => { try { map.invalidateSize(); } catch (e) { /* ignore */ } }, 200);
    window.addEventListener('resize', () => { try { map.invalidateSize(); } catch (e) { } });

    
    // --- 2. HANDLE USER INPUT & SELECTIONS ---
    // ------------------------------------------
    const userSelections = {
        roadId: null,
        predictionTime: 'Next Hour',
        predictionType: 'Congestion'
    };
    
    // Select all the HTML elements we need to interact with
    const timeButtons = document.querySelectorAll('.time-btn');
    const typeButtons = document.querySelectorAll('.predict-type-btn');
    const predictButton = document.getElementById('predict-btn');
    const selectedRoadText = document.getElementById('selected-road');
    const resultsCard = document.getElementById('results-card');
    const resultsRoadName = document.getElementById('results-road-name');
    const resultsContent = document.getElementById('results-content');
    
    // Function to handle clicks on button groups
    function setupButtonGroup(buttons, selectionKey) {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener('click', () => {
                for (let j = 0; j < buttons.length; j++) {
                    buttons[j].classList.remove('active');
                }
                buttons[i].classList.add('active');
                userSelections[selectionKey] = buttons[i].textContent;
            });
        }
    }
    setupButtonGroup(timeButtons, 'predictionTime');
    setupButtonGroup(typeButtons, 'predictionType');


    // --- 3. FETCH ROADS & MAKE MAP INTERACTIVE ---
    // -------------------------------------------
    let roadLayers = {}; // To store map layers for easy access

    async function fetchRoads() {
        const backendURL = 'https://traffic-prediction-backend-1n7l.onrender.com/api/roads';
        try {
            const response = await fetch(backendURL);
            if (!response.ok) throw new Error('Network response was not ok');
            const roads = await response.json();
            
            // --- NEW: Draw roads on the map ---
            for (let i = 0; i < roads.length; i++) {
                const road = roads[i];
                // NOTE: The dummy .path property should be replaced with real GeoJSON data.
                // For now, we'll simulate a simple line. A real path would be more complex.
                const dummyPath = [
                    [12.9716 + (Math.random() - 0.5) * 0.1, 77.5946 + (Math.random() - 0.5) * 0.1],
                    [12.9716 + (Math.random() - 0.5) * 0.1, 77.5946 + (Math.random() - 0.5) * 0.1]
                ];
                
                const roadLayer = L.polyline(dummyPath, { color: 'blue', weight: 5 });
                
                roadLayer.on('click', () => {
                    // Update user selection
                    userSelections.roadId = road.id;
                    userSelections.roadName = road.name; // Store name for display
                    selectedRoadText.textContent = road.name;
                    console.log('User selections updated:', userSelections);

                    // Optional: Highlight the selected road
                    // First, reset all road colors
                    for (const key in roadLayers) {
                        roadLayers[key].setStyle({ color: 'blue' });
                    }
                    // Then, highlight the clicked one
                    roadLayer.setStyle({ color: 'yellow' });
                });
                
                roadLayer.addTo(map);
                roadLayers[road.id] = roadLayer; // Store the layer
            }
        } catch (error) {
            console.error('There was a problem fetching the roads data:', error);
        }
    }
    fetchRoads();


    // --- 4. PREDICTION LOGIC ---
    // ---------------------------
    predictButton.addEventListener('click', async () => {
        // Simple validation: check if a road has been selected
        if (!userSelections.roadId) {
            alert('Please select a road on the map first!');
            return;
        }

        console.log('Sending prediction request with:', userSelections);
        predictButton.textContent = 'Predicting...'; // Provide user feedback

        try {
            const response = await fetch('https://traffic-prediction-backend-1n7l.onrender.com/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userSelections),
            });

            if (!response.ok) throw new Error('Prediction request failed');
            
            const result = await response.json();
            displayResults(result);

        } catch (error) {
            console.error('Error during prediction:', error);
            resultsContent.innerHTML = '<p style="color:red;">Failed to get prediction. Is the server running?</p>';
            resultsCard.classList.remove('hidden');
        } finally {
            predictButton.textContent = 'Generate Prediction'; // Reset button text
        }
    });

    
    // --- 5. DISPLAY RESULTS ---
    // --------------------------
    function displayResults(result) {
        // Update the text in the results card
        resultsRoadName.textContent = userSelections.roadName;
        let resultsHTML = `
            <p><strong>Congestion Level:</strong> ${result.predictions.congestion.label} (${result.predictions.congestion.level * 100}%)</p>
            <p><strong>Average Speed:</strong> ${result.predictions.avgSpeed} km/h</p>
        `;
        
        if (result.alternativeRoute) {
            resultsHTML += `<hr><p><strong>Alternative Route:</strong> ${result.alternativeRoute.roadId} (Saves ~${result.alternativeRoute.timeSaved})</p>`;
        }
        
        resultsContent.innerHTML = resultsHTML;

        // --- TODO: Update Chart.js logic here ---

        // Un-hide the results card
        resultsCard.classList.remove('hidden');

        // --- NEW: Update map colors based on results ---
        const congestionLevel = result.predictions.congestion.level;
        let roadColor = 'green';
        if (congestionLevel > 0.4) roadColor = 'orange';
        if (congestionLevel > 0.7) roadColor = 'red';
        
        // Update the color of the selected road
        if (roadLayers[userSelections.roadId]) {
            roadLayers[userSelections.roadId].setStyle({ color: roadColor });
        }
    }
});