// Remove the Google AI import as it's not needed
// import { GoogleGenerativeAI } from "@google/generative-ai";

// Weather functionality
function refreshWeather() {
    const weatherInfo = document.getElementById('current-weather');
    const weatherAlerts = document.getElementById('weather-alerts');

    // Real weather data fetch
    fetch('https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=auto:ip')
        .then(response => response.json())
        .then(data => {
            weatherInfo.innerHTML = `
                <h3>Current Weather</h3>
                <p>Temperature: ${data.current.temp_c}°C</p>
                <p>Condition: ${data.current.condition.text}</p>
                <p>Humidity: ${data.current.humidity}%</p>
                <p>Wind: ${data.current.wind_kph} km/h</p>
            `;
        })
        .catch(error => {
            weatherInfo.innerHTML = '<p>Unable to fetch weather data</p>';
        });

    // Fetch weather alerts
    fetch('https://api.weatherapi.com/v1/alerts.json?key=YOUR_API_KEY&q=auto:ip')
        .then(response => response.json())
        .then(data => {
            if (data.alerts && data.alerts.length > 0) {
                weatherAlerts.innerHTML = '<h3>Active Alerts</h3>' + 
                    data.alerts.map(alert => `
                        <div class="alert">
                            <h4>${alert.event}</h4>
                            <p>${alert.desc}</p>
                        </div>
                    `).join('');
            } else {
                weatherAlerts.innerHTML = '<h3>Active Alerts</h3><p>No active weather alerts at this time.</p>';
            }
        });
}

// Incident reporting functionality
function submitReport(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Send report to backend
    fetch('/api/incidents/report', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Report submitted successfully! Reference number: ' + data.referenceNumber);
        form.reset();
        closeIncidentReporting();
    })
    .catch(error => {
        alert('Error submitting report. Please try again.');
    });
}

// Travel Safety Data
const travelAdvisories = {
    fetchAdvisories: function() {
        fetch('https://www.travel-advisory.info/api')
            .then(response => response.json())
            .then(data => {
                const advisoryList = document.getElementById('advisory-list');
                advisoryList.innerHTML = this.formatAdvisories(data.data);
            })
            .catch(error => {
                document.getElementById('advisory-list').innerHTML = 
                    '<p>Unable to fetch travel advisories. Please try again later.</p>';
            });
    },

    formatAdvisories: function(data) {
        // Format the advisory data
        return Object.entries(data)
            .map(([country, info]) => `
                <div class="advisory-item">
                    <h4>${country}</h4>
                    <p>Risk Level: ${info.advisory.score}/5</p>
                    <p>${info.advisory.message}</p>
                </div>
            `).join('');
    }
};

// Update showTravelSafety function
function showTravelSafety() {
    const modal = document.getElementById('travel-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Update the closeTravelSafety function
function closeTravelSafety() {
    const modal = document.getElementById('travel-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Incident reporting functionality
function showIncidentReporting() {
    const modal = document.getElementById('incident-modal');
    modal.style.display = 'block';
}

function closeIncidentReporting() {
    const modal = document.getElementById('incident-modal');
    modal.style.display = 'none';
}

function submitReport(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    alert('Report submitted successfully! Emergency services have been notified.');
    form.reset();
    closeIncidentReporting();
}

// Safety Precautions Data
const homeSafetyTips = [
    "Install smoke detectors and check batteries regularly",
    "Keep a first aid kit readily available",
    "Have an emergency evacuation plan",
    "Store emergency contact numbers",
    "Secure hazardous materials properly"
];

const workplaceSafetyTips = [
    "Know emergency exit locations",
    "Follow proper equipment handling procedures",
    "Report hazardous conditions immediately",
    "Keep workspace clean and organized",
    "Use appropriate safety gear"
];

const publicSafetyTips = [
    "Stay aware of your surroundings",
    "Keep valuables secure",
    "Know local emergency numbers",
    "Follow traffic safety rules",
    "Avoid walking alone at night"
];

// Function to populate safety tips
function populateSafetyTips() {
    const homeTips = document.getElementById('home-safety-tips');
    const workTips = document.getElementById('workplace-safety-tips');
    const publicTips = document.getElementById('public-safety-tips');

    homeSafetyTips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        homeTips.appendChild(li);
    });

    workplaceSafetyTips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        workTips.appendChild(li);
    });

    publicSafetyTips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        publicTips.appendChild(li);
    });
}

// Function to show Safety Precautions modal
function showSafetyPrecautions() {
    const modal = document.getElementById('safety-modal');
    modal.style.display = 'block';
    
    // Clear existing tips before populating
    document.getElementById('home-safety-tips').innerHTML = '';
    document.getElementById('workplace-safety-tips').innerHTML = '';
    document.getElementById('public-safety-tips').innerHTML = '';
    
    // Populate safety tips
    populateSafetyTips();
}

// Function to close Safety Precautions modal
function closeSafetyPrecautions() {
    const modal = document.getElementById('safety-modal');
    modal.style.display = 'none';
}

// Function to show Emergency Contacts modal
function showEmergencyContacts() {
    const modal = document.getElementById('emergency-modal');
    modal.style.display = 'block';
}

// Function to close Emergency Contacts modal
function closeEmergencyContacts() {
    const modal = document.getElementById('emergency-modal');
    modal.style.display = 'none';
}

// Close modals when clicking outside
window.onclick = function(event) {
    const safetyModal = document.getElementById('safety-modal');
    const emergencyModal = document.getElementById('emergency-modal');
    
    if (event.target == safetyModal) {
        safetyModal.style.display = 'none';
    }
    if (event.target == emergencyModal) {
        emergencyModal.style.display = 'none';
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const safetyModal = document.getElementById('safety-modal');
    const emergencyModal = document.getElementById('emergency-modal');
    if (event.target == safetyModal) {
        safetyModal.style.display = 'none';
    }
    if (event.target == emergencyModal) {
        emergencyModal.style.display = 'none';
    }
}

function showEmergencyContacts() {
    const modal = document.getElementById('emergency-modal');
    modal.style.display = 'block';
}

function closeEmergencyContacts() {
    const modal = document.getElementById('emergency-modal');
    modal.style.display = 'none';
}

window.onclick = function(event) {
    const safetyModal = document.getElementById('safety-modal');
    const emergencyModal = document.getElementById('emergency-modal');
    const travelModal = document.getElementById('travel-modal');
    const incidentModal = document.getElementById('incident-modal');
    
    if (event.target == safetyModal) {
        safetyModal.style.display = 'none';
    }
    if (event.target == emergencyModal) {
        emergencyModal.style.display = 'none';
    }
    if (event.target == travelModal) {
        travelModal.style.display = 'none';
    }
    if (event.target == incidentModal) {
        incidentModal.style.display = 'none';
    }
}

function showTravelSafety() {
    const modal = document.getElementById('travel-modal');
    modal.style.display = 'block';
    
    const advisoryList = document.getElementById('advisory-list');
    advisoryList.innerHTML = `
        <div class="advisory-item">
            <h4>General Travel</h4>
            <p>Always check local guidelines and restrictions before traveling.</p>
        </div>
        <div class="advisory-item">
            <h4>International Travel</h4>
            <p>Ensure your passports and visas are up to date.</p>
        </div>
        <div class="advisory-item">
            <h4>Health Safety</h4>
            <p>Check required vaccinations and health insurance coverage.</p>
        </div>
    `;
}

function closeTravelSafety() {
    const modal = document.getElementById('travel-modal');
    modal.style.display = 'none';
}

// Add alerts data and functions
const alerts = [
    {
        type: 'weather',
        title: 'Weather Alert',
        message: 'Heavy rainfall expected in the next 48 hours. Potential for flash flooding in low-lying areas.',
        source: 'National Weather Service',
        time: '3:12:50 AM'
    },
    {
        type: 'health',
        title: 'Health Advisory',
        message: 'Increased cases of seasonal flu reported. Travelers are advised to practice good hygiene and consider vaccination.',
        source: 'Department of Health',
        time: '3:12:50 AM'
    },
    {
        type: 'travel',
        title: 'Travel Advisory for India',
        message: 'Recent security incidents reported in Phagwara. Travelers should exercise increased caution, especially in crowded areas.',
        source: 'Foreign Travel Advisory',
        time: '3:12:55 AM'
    }
];

function createAlert(alert) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alert.type}`;
    
    alertDiv.innerHTML = `
        <h2>${alert.title}</h2>
        <p>${alert.message}</p>
        <small>Source: ${alert.source}</small>
        <span class="time">${alert.time}</span>
    `;
    
    return alertDiv;
}

function renderAlerts() {
    const container = document.querySelector('.alerts-container');
    if (container) {
        container.innerHTML = '';
        alerts.forEach(alert => {
            container.appendChild(createAlert(alert));
        });
    }
}
// Add this at the top of your existing script.js
if (typeof window.chatbotInitialized === 'undefined') {
    window.chatbotInitialized = true;
}

document.addEventListener('DOMContentLoaded', function() {
    renderAlerts();
    // ... keep other existing initialization code ...
});