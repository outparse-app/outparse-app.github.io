import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { 
getAuth, 
createUserWithEmailAndPassword, 
sendEmailVerification 
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';
import { 
getFirestore, 
doc, 
setDoc 
} from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_AUTH_DOMAIN",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_STORAGE_BUCKET",
messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('error-message');
const submitBtn = document.getElementById('submitBtn');

signupForm.addEventListener('submit', async (e) => {
e.preventDefault();
submitBtn.disabled = true;
submitBtn.innerHTML = 'Creating account...';

const fullName = document.getElementById('fullName').value.trim();
const email = document.getElementById('email').value.trim();
const password = document.getElementById('password').value;

try {
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const user = userCredential.user;

await sendEmailVerification(user);

await setDoc(doc(db, "users", user.uid), {
fullName: fullName,
email: email,
createdAt: new Date(),
emailVerified: false,
lastLogin: null
});

window.location.href = '/verify-email';
} catch (error) {
console.error('Signup error:', error);
submitBtn.disabled = false;
submitBtn.innerHTML = 'Continue <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg>';

let errorMsg = 'An error occurred. Please try again.';
switch (error.code) {
case 'auth/email-already-in-use':
errorMsg = 'This email is already registered.';
break;
case 'auth/invalid-email':
errorMsg = 'Please enter a valid email address.';
break;
case 'auth/weak-password':
errorMsg = 'Password should be at least 8 characters.';
break;
}

errorMessage.textContent = errorMsg;
errorMessage.style.display = 'block';
}
});
});

window.togglePassword = function() {
const passwordField = document.getElementById('password');
const toggleIcon = document.getElementById('toggle-icon');
if (passwordField.type === 'password') {
passwordField.type = 'text';
toggleIcon.innerHTML = '<path d="M11.885 14.988l3.104-3.098.011.11c0 1.654-1.346 3-3 3l-.115-.012zm8.048-8.032l-3.274 3.268c.212.554.341 1.149.341 1.776 0 2.757-2.243 5-5 5-.631 0-1.229-.13-1.785-.344l-2.377 2.372c1.276.588 2.671.972 4.177.972 7.733 0 11.985-8.449 11.985-8.449s-1.415-2.478-4.067-4.595zm1.431-3.536l-18.619 18.58-1.382-1.422 3.455-3.447c-3.022-2.45-4.818-5.58-4.818-5.58s4.446-7.551 12.015-7.551c1.825 0 3.456.426 4.886 1.075l3.081-3.075 1.382 1.42zm-13.751 10.922l1.519-1.515c-.077-.264-.132-.538-.132-.827 0-1.654 1.346-3 3-3 .291 0 .567.055.833.134l1.518-1.515c-.704-.382-1.496-.619-2.351-.619-2.757 0-5 2.243-5 5 0 .852.235 1.641.613 2.342z"/>';
} else {
passwordField.type = 'password';
toggleIcon.innerHTML = '<path d="M12 9c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.239-5 5s2.238 5 5 5 5-2.239 5-5-2.238-5-5-5zm11 5c0 4.418-8 11-11 11s-11-6.582-11-11 8-11 11-11 11 6.582 11 11z"/>';
}
};
