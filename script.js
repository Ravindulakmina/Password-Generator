// Function to hash the password using SHA-1
async function sha1(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Function to check if password is compromised using HIBP API
async function checkPasswordHIBP(password) {
    const hash = await sha1(password);
    const prefix = hash.slice(0, 5); // First 5 characters for k-anonymity
    const suffix = hash.slice(5); // Rest of the hash

    try {
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        const data = await response.text();
        const isCompromised = data.includes(suffix.toUpperCase());

        return isCompromised ? "HIBP Status - Password has been compromised!" : "HIBP Status - Password is safe!";
    } catch (error) {
        return "Error checking password security";
    }
}

// Function to evaluate password strength
function evaluateStrength(password) {
    const criteria = [
        /.{8,}/, // Minimum 8 characters
        /[A-Z]/, // At least one uppercase letter
        /[a-z]/, // At least one lowercase letter
        /[0-9]/, // At least one digit
        /[!@#$%^&*()_+~`|}{[\]:;?><,./-]/ // At least one special character
    ];
    const strength = criteria.reduce((acc, regex) => (regex.test(password) ? acc + 1 : acc), 0);

    let feedback = '';
    switch (strength) {
        case 5:
            feedback = 'Very Strong';
            break;
        case 4:
            feedback = 'Strong';
            break;
        case 3:
            feedback = 'Medium';
            break;
        case 2:
            feedback = 'Weak';
            break;
        default:
            feedback = 'Very Weak';
    }
    document.getElementById('password-strength').innerText = `Password Strength: ${feedback}`;
}

// Function to generate a password
async function generatePassword() {
    const length = document.getElementById('password-length').value || 12; // Default to 12 if empty
    const includeUppercase = document.getElementById('include-uppercase').checked;
    const includeNumbers = document.getElementById('include-numbers').checked;
    const includeSymbols = document.getElementById('include-symbols').checked;

    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let characters = lowercase;
    if (includeUppercase) characters += uppercase;
    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    // Set the generated password in the input field
    document.getElementById('password').value = password;

    // Check if password is compromised and display the result
    const securityStatus = await checkPasswordHIBP(password);
    document.getElementById('password-security').innerText = securityStatus;

    // Evaluate and display password strength
    evaluateStrength(password);
}

// Function to copy the password to the clipboard
function copyPassword() {
    const password = document.getElementById('password');
    password.select();
    password.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand('copy');
    swal("Password copied to clipboard!");
}

// Display content after loading
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    loadingScreen.style.display = 'none';
    mainContent.style.display = 'block';
});





