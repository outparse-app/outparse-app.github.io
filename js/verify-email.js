import { getAuth, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';

const auth = getAuth();

document.addEventListener('DOMContentLoaded', () => {
const resendLink = document.getElementById('resendLink');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

resendLink.addEventListener('click', async (e) => {
e.preventDefault();
const user = auth.currentUser;

if (user) {
try {
await sendEmailVerification(user);
successMessage.textContent = 'Verification email sent successfully!';
successMessage.style.display = 'block';
errorMessage.style.display = 'none';
} catch (error) {
console.error('Error resending verification email:', error);
errorMessage.textContent = 'Failed to send verification email. Please try again.';
errorMessage.style.display = 'block';
successMessage.style.display = 'none';
}
} else {
errorMessage.textContent = 'No user found. Please sign in again.';
errorMessage.style.display = 'block';
successMessage.style.display = 'none';
}
});
});
