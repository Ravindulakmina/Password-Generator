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




async function generatePassword() {
  const length = parseInt(document.getElementById('password-length').value) || 12;
  const includeUppercase = document.getElementById('include-uppercase').checked;
  const includeNumbers = document.getElementById('include-numbers').checked;
  const includeSymbols = document.getElementById('include-symbols').checked;

  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

  let allChars = lowercase;
  let guaranteedChars = [];

  if (includeUppercase) {
      allChars += uppercase;
      guaranteedChars.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
  }

  if (includeNumbers) {
      allChars += numbers;
      guaranteedChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
  }

  if (includeSymbols) {
      allChars += symbols;
      guaranteedChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
  }

  // Always add at least one lowercase character
  guaranteedChars.push(lowercase[Math.floor(Math.random() * lowercase.length)]);

  // Fill the rest of the password
  let password = guaranteedChars.join('');
  for (let i = guaranteedChars.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the final password
  password = password.split('').sort(() => Math.random() - 0.5).join('');

  document.getElementById('password').innerText = password;
  const securityStatus = await checkPasswordHIBP(password);
  document.getElementById('password-security').innerText = securityStatus;

  evaluateStrength(password);
}


// Function to copy the password to the clipboard
function copyPassword() {
    const passwordElement = document.getElementById('password');
    const password = passwordElement.innerText;
  
    if (!password) {
      swal("No password to copy! Please generate a password first.");
      return;
    }
  
    navigator.clipboard.writeText(password)
      .then(() => {
        swal("Password copied to clipboard!");
      })
      .catch(err => {
        console.error("Failed to copy password: ", err);
        swal("Something went wrong while copying.");
      });
  }
  
  

// Display content after loading
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    loadingScreen.style.display = 'none';
    mainContent.style.display = 'block';
});


//password save function and download
function savePassword() {
    const password = document.getElementById('password').innerText;
  
    if (!password) {
      swal("No password to save! Please generate a password first.");
      return;
    }
  
    // Suggest default name with date + time
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // "2025-04-22"
    const time = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // "14-35-22"
    const defaultName = `password-${date}_${time}`;
  
    // Prompt user for custom file name
    let fileName = prompt("Enter file name:", defaultName);
    if (!fileName) {
      swal("File save cancelled.");
      return;
    }
  
    // Ensure .txt extension
    if (!fileName.endsWith(".txt")) {
      fileName += ".txt";
    }
  
    const blob = new Blob([password], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }
  



// passworl length live counter
const rangeInput = document.getElementById("password-length");
  const rangeValue = document.getElementById("range-value");

  // Initial set
  rangeValue.innerText = rangeInput.value;

  // Update on input change
  rangeInput.addEventListener("input", function () {
    rangeValue.innerText = this.value;
  });