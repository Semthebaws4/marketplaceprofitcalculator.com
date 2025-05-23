// Create and add overlay to the page
const overlay = document.createElement('div');
overlay.id = 'auth-overlay';
overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-primary, #1a1a1a);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-family: Arial, sans-serif;
`;

const overlayContent = document.createElement('div');
overlayContent.style.cssText = `
    text-align: center;
    padding: 40px;
    background-color: var(--bg-secondary, #2d2d2d);
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;
overlayContent.innerHTML = `
    <h2 style="color: var(--accent-color, #4CAF50); margin-bottom: 20px;">Marketplace Winst Calculator</h2>
    <p style="color: var(--text-secondary, #b3b3b3);">Login vereist</p>
`;
overlay.appendChild(overlayContent);
document.body.appendChild(overlay);

// Basic Authentication credentials
const credentials = {
    username: 'Winst',
    password: 'Winstcompany'
};

// Check if user is already authenticated
function isAuthenticated() {
    return sessionStorage.getItem('authenticated') === 'true';
}

// Authenticate user
function authenticate(username, password) {
    if (username === credentials.username && password === credentials.password) {
        sessionStorage.setItem('authenticated', 'true');
        return true;
    }
    return false;
}

// Show login prompt
function showLoginPrompt() {
    const username = prompt('Gebruikersnaam:');
    const password = prompt('Wachtwoord:');
    
    if (username && password) {
        if (authenticate(username, password)) {
            overlay.style.display = 'none';
            return;
        } else {
            alert('Ongeldige inloggegevens');
            showLoginPrompt();
        }
    } else {
        showLoginPrompt();
    }
}

// Clear any existing authentication on new session
if (!document.cookie.includes('authCheck')) {
    sessionStorage.removeItem('authenticated');
    document.cookie = 'authCheck=1; path=/';
}

// Check authentication on page load
if (!isAuthenticated()) {
    // Show overlay and prompt
    overlay.style.display = 'flex';
    setTimeout(showLoginPrompt, 100);
} else {
    // Hide overlay if authenticated
    overlay.style.display = 'none';
}

// Add logout functionality
function logout() {
    sessionStorage.removeItem('authenticated');
    document.cookie = 'authCheck=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    overlay.style.display = 'flex';
    showLoginPrompt();
} 