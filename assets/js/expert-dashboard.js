// expert-dashboard.js
// This script builds the dynamic UI based on the selected model.

document.addEventListener('DOMContentLoaded', () => {
    console.log('expert-dashboard: DOMContentLoaded');

    // --- 1. GET THE SELECTED MODEL ---
    const selectedModel = localStorage.getItem('selectedPredictionModel') || 'xgboost';
    console.log('expert-dashboard: selectedModel ->', selectedModel);

    // --- 2. GET OUR HTML CONTAINERS ---
    const title = document.getElementById('control-panel-title');
    const formContainer = document.getElementById('dynamic-form-container');
    const vizContainer = document.getElementById('dynamic-viz-container');
    const predictButton = document.getElementById('expert-predict-btn');
    console.log('expert-dashboard: DOM elements', { title, formContainer, vizContainer, predictButton });

    // This object will store the user's choices.
    let userSelections = { model: selectedModel };

    // A variable to hold our Chart.js instance, so we can destroy it later
    let activeChart = null;

    // The single, new API route for all expert models
    const EXPERT_API_URL = 'http://localhost:3000/api/expert-predict';

    // --- 3. CALL THE CORRECT UI BUILDER ---
    switch (selectedModel) {
        case 'xgboost':
            console.log('expert-dashboard: building XGBoost UI');
            buildXGBoostUI();
            break;
        case 'lstm':
            console.log('expert-dashboard: building LSTM UI');
            buildLstmUI();
            break;
        case 'catboost':
            console.log('expert-dashboard: building CatBoost UI');
            buildCatBoostUI();
            break;
        case 'randomforest':
            console.log('expert-dashboard: building RandomForest UI');
            buildRandomForestUI();
            break;
        case 'kmeans':
            console.log('expert-dashboard: building KMeans UI');
            buildKMeansUI();
            break;
        case 'hybrid':
            console.log('expert-dashboard: building Hybrid UI');
            buildHybridUI();
            break;
        default:
            console.log('expert-dashboard: unknown model, defaulting to XGBoost');
            buildXGBoostUI();
    }

    // =================================================================
    // --- 4. UI BUILDER FUNCTIONS ---
    // (These functions build the HTML and call the logic initializers)
    // =================================================================

    // (All build functions: buildXGBoostUI, buildLstmUI, buildCatBoostUI, 
    // buildRandomForestUI, buildKMeansUI, buildHybridUI, 
    // and buildStandardPredictorUI remain EXACTLY THE SAME as before)

    function buildXGBoostUI() {
        console.log('buildXGBoostUI: start');
        title.textContent = 'XGBoost: Performance Predictor';
        buildStandardPredictorUI();
        setTimeout(() => initializeStandardPredictorLogic('xgboost'), 0);
        console.log('buildXGBoostUI: done');
    }

    function buildLstmUI() {
        console.log('buildLstmUI: start');
        title.textContent = 'LSTM: Future Forecaster';
        formContainer.innerHTML = `
            <div class="control-group">
                <label>📍 Step 1: Choose Your Location</label> <p class="info-text">Click anywhere on the map to place a pin.<br>
                <strong>Selected:</strong> <span id="expert-selected-road">None</span></p>
            </div>
            <div class="control-group">
                <label>🗓️ Step 2: Select Forecast Date</label>
                <input type="date" id="lstm-date-picker" class="control-group-input">
            </div>
        `;
        vizContainer.innerHTML = `
            <div id="expert-map"></div>
            <div id="expert-results-card" class="hidden">
                <h3>24-Hour Forecast for <span id="expert-results-road-name"></span></h3>
                <div id="expert-results-content">
                    <canvas id="lstm-line-chart"></canvas>
                </div>
            </div>
        `;
        predictButton.classList.remove('hidden');
        setTimeout(initializeLstmLogic, 0);
        console.log('buildLstmUI: done');
    }

    function buildCatBoostUI() {
        console.log('buildCatBoostUI: start');
        title.textContent = 'CatBoost: Smart Context Predictor';
        formContainer.innerHTML = `
            <div class="control-group">
                <label>📍 Step 1: Choose Your Location</label> <p class="info-text">Click anywhere on the map to place a pin.<br>
                <strong>Selected:</strong> <span id="expert-selected-road">None</span></p>
            </div>
            <div class="control-group">
                <label>⏰ Step 2: Set Prediction Time</label>
                <div class="button-group">
                    <button class="time-btn active">Next Hour</button>
                </div>
            </div>
            <div class="control-group">
                <label>🎟️ Step 3: Select Local Event (Optional)</label>
                <select id="catboost-event-select" class="control-group-input">
                    <option value="None">None</option>
                    <option value="Cricket Match">Cricket Match</option>
                    <option value="Public Festival">Public Festival</option>
                    <option value="VIP Movement">VIP Movement</option>
                </select>
            </div>
        `;
        vizContainer.innerHTML = `
            <div id="expert-map"></div>
            <div id="expert-results-card" class="hidden">
                <h3>Prediction for <span id="expert-results-road-name"></span></h3>
                <div id="expert-results-content"></div>
                <hr>
                <div id="expert-chart-container">
                    <canvas id="catboost-bar-chart"></canvas>
                </div>
            </div>
        `;
        predictButton.classList.remove('hidden');
        setTimeout(initializeCatBoostLogic, 0);
        console.log('buildCatBoostUI: done');
    }

    function buildRandomForestUI() {
        console.log('buildRandomForestUI: start');
        title.textContent = 'Random Forest: Speed Specialist';
        buildStandardPredictorUI();
        setTimeout(() => initializeStandardPredictorLogic('randomforest'), 0);
        console.log('buildRandomForestUI: done');
    }

    function buildKMeansUI() {
        console.log('buildKMeansUI: start');
        title.textContent = 'K-Means: Pattern Detective';
        formContainer.innerHTML = `
            <div class="control-group">
                <label>📍 Step 1: Choose Your Location</label> <p class="info-text">Click anywhere on the map to analyze historical patterns for that area.<br>
                <strong>Selected:</strong> <span id="expert-selected-road">None</span></p>
            </div>
        `;
        vizContainer.innerHTML = `
            <div id="expert-map"></div>
            <div id="expert-results-card" class="hidden">
                <h3>Historical Patterns for <span id="expert-results-road-name"></span></h3>
                <div id="expert-results-content">
                    <p>Select a location and click "Find Patterns" to see its typical traffic profiles.</p>
                </div>
                <div id="expert-chart-container" style="height: 400px; margin-top: 20px;">
                    <canvas id="kmeans-pie-chart"></canvas>
                </div>
            </div>
        `;
        predictButton.textContent = 'Find Patterns';
        predictButton.classList.remove('hidden');
        setTimeout(initializeKMeansLogic, 0);
        console.log('buildKMeansUI: done');
    }

    function buildHybridUI() {
        console.log('buildHybridUI: start');
        title.textContent = 'Hybrid: Ultimate Accuracy Engine';
        buildStandardPredictorUI();
        setTimeout(() => initializeStandardPredictorLogic('hybrid'), 0);
        console.log('buildHybridUI: done');
    }

    function buildStandardPredictorUI() {
        console.log('buildStandardPredictorUI: start');
        formContainer.innerHTML = `
            <div class="control-group">
                <label>📍 Step 1: Choose Your Location</label> <p class="info-text">Click anywhere on the map to place a pin.<br>
                <strong>Selected:</strong> <span id="expert-selected-road">None</span></p>
            </div>
            <div class="control-group">
                <label>⏰ Step 2: Set Prediction Time</label>
                <div class="button-group">
                    <button class="time-btn active">Next Hour</button>
                    <button class="time-btn">Next 3 Hours</button>
                </div>
            </div>
        `;
        vizContainer.innerHTML = `
            <div id="expert-map"></div>
            <div id="expert-results-card" class="hidden">
                <h3>Prediction for <span id="expert-results-road-name"></span></h3>
                <div id="expert-results-content"></div>
            </div>
        `;
        predictButton.classList.remove('hidden');
        console.log('buildStandardPredictorUI: done');
    }


    // =================================================================
    // --- 5. UI LOGIC FUNCTIONS ---
    // (These functions initialize the logic for each UI)
    // =================================================================

    function initializeStandardPredictorLogic(modelName) {
        console.log('initializeStandardPredictorLogic: modelName ->', modelName);
        userSelections.predictionTime = 'Next Hour';
        const map = L.map('expert-map').setView([12.9716, 77.5946], 12);
        console.log('initializeStandardPredictorLogic: map created');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        // Ensure leaflet correctly paints tiles after responsive layout changes
        setTimeout(() => { try { map.invalidateSize(); } catch (e) { } }, 200);
        window.addEventListener('resize', () => { try { map.invalidateSize(); } catch (e) { } });

        const timeButtons = document.querySelectorAll('.time-btn');
        const selectedRoadText = document.getElementById('expert-selected-road');
        const resultsCard = document.getElementById('expert-results-card');
        const resultsRoadName = document.getElementById('expert-results-road-name');
        const resultsContent = document.getElementById('expert-results-content');

        // --- THIS IS THE CHANGE ---
        // We only need one marker, not a layer group
        let selectionMarker = null;
        setupDynamicMapClick(map, selectedRoadText, (marker) => {
            selectionMarker = marker; // Save the new marker
            console.log('initializeStandardPredictorLogic: marker created ->', marker.getLatLng());
        });
        // --- END OF CHANGE ---

        for (let i = 0; i < timeButtons.length; i++) {
            timeButtons[i].addEventListener('click', () => {
                for (let j = 0; j < timeButtons.length; j++) {
                    timeButtons[j].classList.remove('active');
                }
                timeButtons[i].classList.add('active');
                userSelections.predictionTime = timeButtons[i].textContent;
                console.log('initializeStandardPredictorLogic: predictionTime set ->', userSelections.predictionTime);
            });
        }

        predictButton.addEventListener('click', async () => {
            // --- REVERTED BACK TO COORDINATES ---
            console.log("Predict button clicked, checking userSelections:", userSelections); // Keep this log
            if (!userSelections.coordinates) { // Check for coordinates again
                alert('Please select a location on the map first!');
                return;
            }
            // --- END OF REVERT ---

            // --- REMOVED THE TEMP CODE THAT CREATED dummyJunctionName and dataToSend ---

            console.log('Sending EXPERT request with:', userSelections); // Log the original userSelections
            predictButton.textContent = 'Predicting...';

            try {
                const response = await fetch(EXPERT_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // --- REVERTED BACK TO SENDING userSelections ---
                    body: JSON.stringify(userSelections), // Send the original object
                });
                // --- END OF REVERT ---

                console.log('Received response status:', response.status); // Keep logs
                if (!response.ok) throw new Error('Prediction request failed');
                const result = await response.json();
                console.log('Prediction result:', result); // Keep logs

                // Display logic remains the same
                if (modelName === 'randomforest') {
                    displayRandomForestResults(result, selectionMarker, resultsCard, resultsRoadName, resultsContent);
                } else {
                    displayXGBoostResults(result, selectionMarker, resultsCard, resultsRoadName, resultsContent);
                }
            } catch (error) {
                console.error('Error during prediction:', error);
                resultsContent.innerHTML = `<p style="color:red;">Failed to get prediction.</p>`;
                resultsCard.classList.remove('hidden');
            } finally {
                predictButton.textContent = 'Generate Prediction';
                console.log('predictButton: request completed, button text reset'); // Keep logs
            }
        });
    }

    function initializeLstmLogic() {
        console.log('initializeLstmLogic: start');
        userSelections.selectedDate = null;
        const map = L.map('expert-map').setView([12.9716, 77.5946], 12);
        console.log('initializeLstmLogic: map created');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        setTimeout(() => { try { map.invalidateSize(); } catch (e) { } }, 200);
        window.addEventListener('resize', () => { try { map.invalidateSize(); } catch (e) { } });

        const datePicker = document.getElementById('lstm-date-picker');
        const selectedRoadText = document.getElementById('expert-selected-road');
        const resultsCard = document.getElementById('expert-results-card');
        const resultsRoadName = document.getElementById('expert-results-road-name');

        setupDynamicMapClick(map, selectedRoadText);
        console.log('initializeLstmLogic: map click setup complete');

        datePicker.addEventListener('change', () => {
            userSelections.selectedDate = datePicker.value;
            console.log('initializeLstmLogic: selectedDate ->', userSelections.selectedDate);
        });

        predictButton.addEventListener('click', async () => {
            console.log('LSTM predict clicked: userSelections ->', userSelections);
            if (!userSelections.coordinates) {
                alert('Please select a location on the map first!');
                return;
            }
            if (!userSelections.selectedDate) {
                alert('Please select a date first!');
                return;
            }
            predictButton.textContent = 'Forecasting...';
            try {
                const response = await fetch(EXPERT_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userSelections),
                });
                if (!response.ok) throw new Error('Forecast request failed');
                const forecast = await response.json();
                console.log('LSTM forecast received:', forecast);

                resultsRoadName.textContent = `Lat: ${userSelections.coordinates.lat.toFixed(4)}, Lng: ${userSelections.coordinates.lng.toFixed(4)}`;
                displayLstmResults(forecast);
                resultsCard.classList.remove('hidden');
            } catch (error) {
                console.error('Error during forecast:', error);
                resultsCard.classList.add('hidden');
            } finally {
                predictButton.textContent = 'Generate Prediction';
                console.log('LSTM predict finished');
            }
        });
    }

    function initializeCatBoostLogic() {
        console.log('initializeCatBoostLogic: start');
        userSelections.predictionTime = 'Next Hour';
        userSelections.event = 'None';
        const map = L.map('expert-map').setView([12.9716, 77.5946], 12);
        console.log('initializeCatBoostLogic: map created');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        setTimeout(() => { try { map.invalidateSize(); } catch (e) { } }, 200);
        window.addEventListener('resize', () => { try { map.invalidateSize(); } catch (e) { } });

        const eventSelect = document.getElementById('catboost-event-select');
        const selectedRoadText = document.getElementById('expert-selected-road');
        const resultsCard = document.getElementById('expert-results-card');
        const resultsRoadName = document.getElementById('expert-results-road-name');

        setupDynamicMapClick(map, selectedRoadText);
        console.log('initializeCatBoostLogic: map click setup complete');

        eventSelect.addEventListener('change', () => {
            userSelections.event = eventSelect.value;
            console.log('initializeCatBoostLogic: event ->', userSelections.event);
        });

        predictButton.addEventListener('click', async () => {
            console.log('CatBoost predict clicked: userSelections ->', userSelections);
            if (!userSelections.coordinates) {
                alert('Please select a location on the map first!');
                return;
            }
            predictButton.textContent = 'Predicting...';
            try {
                const response = await fetch(EXPERT_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userSelections),
                });
                if (!response.ok) throw new Error('Prediction request failed');
                const result = await response.json();
                console.log('CatBoost result:', result);

                resultsRoadName.textContent = `Lat: ${userSelections.coordinates.lat.toFixed(4)}, Lng: ${userSelections.coordinates.lng.toFixed(4)}`;
                displayCatBoostResults(result);
                resultsCard.classList.remove('hidden');
            } catch (error) {
                console.error('Error during prediction:', error);
                resultsCard.classList.add('hidden');
            } finally {
                predictButton.textContent = 'Generate Prediction';
                console.log('CatBoost predict finished');
            }
        });
    }

    function initializeKMeansLogic() {
        console.log('initializeKMeansLogic: start');
        const selectedRoadText = document.getElementById('expert-selected-road');
        const resultsCard = document.getElementById('expert-results-card');
        const resultsRoadName = document.getElementById('expert-results-road-name');
        const resultsContent = document.getElementById('expert-results-content');

        const map = L.map('expert-map').setView([12.9716, 77.5946], 12);
        console.log('initializeKMeansLogic: map created');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        setupDynamicMapClick(map, selectedRoadText);
        console.log('initializeKMeansLogic: map click setup complete');

        predictButton.addEventListener('click', async () => {
            console.log('KMeans predict clicked: userSelections ->', userSelections);
            if (!userSelections.coordinates) {
                alert('Please select a location on the map first!');
                return;
            }
            predictButton.textContent = 'Finding...';
            try {
                const response = await fetch(EXPERT_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userSelections),
                });
                if (!response.ok) throw new Error('Pattern request failed');
                const patterns = await response.json();
                console.log('KMeans patterns received:', patterns);

                resultsRoadName.textContent = `Lat: ${userSelections.coordinates.lat.toFixed(4)}, Lng: ${userSelections.coordinates.lng.toFixed(4)}`;
                resultsContent.innerHTML = `<p>This location typically experiences the following traffic patterns:</p>`;
                displayKMeansResults(patterns);
                resultsCard.classList.remove('hidden');
            } catch (error) {
                console.error('Error finding patterns:', error);
                resultsCard.classList.add('hidden');
            } finally {
                predictButton.textContent = 'Find Patterns';
                console.log('KMeans predict finished');
            }
        });
    }


    // =================================================================
    // --- 6. HELPER & DISPLAY FUNCTIONS ---
    // =================================================================

    /**
     * --- THIS IS THE NEW CORE FUNCTION ---
     * Reusable function to set up dynamic map clicking
     */
    function setupDynamicMapClick(map, selectedRoadText, onMarkerCreated) {
        let currentMarker = null;

        map.on('click', (e) => {
            console.log('map click event:', e.latlng);
            const coordinates = e.latlng;

            // Save coordinates to our main selection object
            userSelections.coordinates = {
                lat: coordinates.lat,
                lng: coordinates.lng
            };

            // Update the text in the control panel
            selectedRoadText.textContent = `Lat: ${coordinates.lat.toFixed(4)}, Lng: ${coordinates.lng.toFixed(4)}`;

            // Remove the old marker if it exists
            if (currentMarker) {
                map.removeLayer(currentMarker);
            }

            // Add a new marker to the map
            currentMarker = L.marker(coordinates).addTo(map)
                .bindPopup(`Selected Location`)
                .openPopup();

            // This is a "callback" to give the new marker back to the calling function
            if (onMarkerCreated) {
                onMarkerCreated(currentMarker);
                console.log('setupDynamicMapClick: onMarkerCreated called with ->', currentMarker.getLatLng());
            }
        });
    }

    /**
     * Reusable function to display XGBoost & Hybrid results
     */
    function displayXGBoostResults(result, marker, resultsCard, resultsRoadName, resultsContent) {
        console.log('displayXGBoostResults: called with result ->', result);
        resultsRoadName.textContent = `Lat: ${userSelections.coordinates.lat.toFixed(4)}, Lng: ${userSelections.coordinates.lng.toFixed(4)}`;
        let resultsHTML = `
            <p><strong>Model:</strong> ${selectedModel.toUpperCase()}</p>
            <p><strong>Congestion Level:</strong> ${result.predictions.congestion.label} (${result.predictions.congestion.level * 100}%)</p>
            <p><strong>Average Speed:</strong> ${result.predictions.avgSpeed} km/h</p>
        `;
        // We can't show an alternative route if we don't have a route, so this logic is simplified.
        resultsContent.innerHTML = resultsHTML;
        resultsCard.classList.remove('hidden');

        // We can't color a road, but we could change the marker icon
        // For now, we'll just show the card.
    }

    /**
     * Displays Random Forest results (Focus on Speed)
     */
    function displayRandomForestResults(result, marker, resultsCard, resultsRoadName, resultsContent) {
        console.log('displayRandomForestResults: called with result ->', result);
        resultsRoadName.textContent = `Lat: ${userSelections.coordinates.lat.toFixed(4)}, Lng: ${userSelections.coordinates.lng.toFixed(4)}`;
        let resultsHTML = `
            <p><strong>Model:</strong> ${selectedModel.toUpperCase()}</p>
            <h3 style="font-size: 2.5rem; color: #fca311; margin: 10px 0;">${result.predictions.avgSpeed} km/h</h3>
            <p><strong>Predicted Average Speed</strong></p>
        `;
        resultsContent.innerHTML = resultsHTML;
        resultsCard.classList.remove('hidden');
    }

    // ... (displayLstmResults, displayCatBoostResults, displayKMeansResults remain the same as before) ...
    function displayLstmResults(forecast) {
        console.log('displayLstmResults: called with forecast ->', forecast);
        if (activeChart) activeChart.destroy();
        const ctx = document.getElementById('lstm-line-chart').getContext('2d');
        activeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: forecast.labels,
                datasets: [{
                    label: 'Predicted Congestion',
                    data: forecast.data,
                    borderColor: '#e94560',
                    backgroundColor: 'rgba(233, 69, 96, 0.2)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, max: 1.2, ticks: { color: '#e4e4e4' } },
                    x: { ticks: { color: '#e4e4e4' } }
                },
                plugins: { legend: { labels: { color: '#e4e4e4' } } }
            }
        });
    }

    function displayCatBoostResults(result) {
        console.log('displayCatBoostResults: called with result ->', result);
        const resultsContent = document.getElementById('expert-results-content');
        resultsContent.innerHTML = `
            <p><strong>Congestion Level:</strong> ${result.congestion * 100}%</p>
            <p><strong>Average Speed:</strong> ${result.avgSpeed} km/h</p>
        `;
        if (activeChart) activeChart.destroy();
        const ctx = document.getElementById('catboost-bar-chart').getContext('2d');
        activeChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: result.featureImportance.labels,
                datasets: [{
                    label: 'Feature Importance',
                    data: result.featureImportance.data,
                    backgroundColor: ['#e94560', '#fca311', '#0f3460']
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y',
                scales: {
                    x: { beginAtZero: true, ticks: { color: '#e4e4e4' } },
                    y: { ticks: { color: '#e4e4e4' } }
                },
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Prediction Factors', color: '#e4e4e4' }
                }
            }
        });
    }

    function displayKMeansResults(patterns) {
        console.log('displayKMeansResults: called with patterns ->', patterns);
        if (activeChart) activeChart.destroy();
        const ctx = document.getElementById('kmeans-pie-chart').getContext('2d');
        activeChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: patterns.labels,
                datasets: [{
                    label: 'Pattern Percentage',
                    data: patterns.data,
                    backgroundColor: [
                        'rgba(233, 69, 96, 0.7)',
                        'rgba(252, 163, 17, 0.7)',
                        'rgba(15, 52, 96, 0.7)',
                        'rgba(228, 228, 228, 0.7)'
                    ],
                    borderColor: '#1a1a2e',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: '#e4e4e4' }
                    }
                }
            }
        });
    }
});