function handleLogin(e) {
    e.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');

    const username = usernameInput ? usernameInput.value : '';
    const password = passwordInput ? passwordInput.value : '';

    const credentials = {
        "admin": "meridian2026"
    };

    if (username === "admin" && password === credentials.admin) {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'track.html';
    } else {
        if (loginError) {
            loginError.textContent = 'Invalid username or password.';
        }
    }
}

function checkAuth() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
}

function trackShipment() {
    const trackingIdInput = document.getElementById('trackingId');
    const resultsDiv = document.getElementById('results');

    if (!trackingIdInput || !resultsDiv) {
        if (resultsDiv) resultsDiv.innerHTML = 'Error: Required elements not found.';
        return;
    }

    const trackingId = trackingIdInput.value.trim().toUpperCase();

    if (!trackingId) {
        resultsDiv.innerHTML = 'Please enter a tracking ID.';
        return;
    }

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const shipment = data.find(s => s.id === trackingId);

            if (!shipment) {
                resultsDiv.innerHTML = 'Tracking number not found.';
                return;
            }

            let html = `<h3>Shipment Details for ${shipment.id}</h3>\n<p><strong>Status:</strong> ${shipment.status}</p>\n<p><strong>Origin:</strong> ${shipment.origin}</p>\n<p><strong>Destination:</strong> ${shipment.destination}</p>\n<p><strong>Estimated Delivery:</strong> ${shipment.eta}</p>\n<h4>Tracking History:</h4>\n<div class=\"timeline\">\n`;

            if (shipment.history && shipment.history.length > 0) {
                shipment.history.forEach(event => {
                    html += `<div class=\"timeline-item\">\n<div class=\"timeline-date\">${event.date}</div>\n<div class=\"timeline-content\">\n<strong>${event.event}</strong> at ${event.location}\n</div>\n</div>\n`;
                });
            } else {
                html += `<p>No history available.</p>\n`;
            }

            html += `</div>`;
            resultsDiv.innerHTML = html;
        })
        .catch(error => {
            console.error('Fetch error:', error);
            resultsDiv.innerHTML = 'Error fetching tracking data. Please try again later.';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('track.html')) {
        checkAuth();
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const trackButton = document.getElementById('trackButton');
    if (trackButton) {
        trackButton.addEventListener('click', trackShipment);
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});