import { initializeApp } from "firebase/app";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    setPersistence,
    browserSessionPersistence
} from "firebase/auth";

// FIREBASE CONFIG (FROM VITE ENV)

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// VALIDATION (IMPORTANT FIX FOR YOUR ERROR)
if (!firebaseConfig.apiKey) {
    throw new Error("Firebase config missing. Check .env file (VITE_FIREBASE_API_KEY)");
}

// INIT FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// SESSION ONLY LOGIN
await setPersistence(auth, browserSessionPersistence);

// DOM
const authForm = document.getElementById("authForm");
const status = document.getElementById("status");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const forgotPasswordLink = document.getElementById("forgotPassword");

let isLoginMode = true;

// TOGGLE LOGIN / SIGNUP
document.addEventListener("click", (e) => {
    if (e.target.id === "switchMode") {
        isLoginMode = !isLoginMode;

        formTitle.innerText = isLoginMode ? "Sign In" : "Sign Up";
        submitBtn.innerText = isLoginMode ? "Continue" : "Create Account";
        forgotPasswordLink.style.display = isLoginMode ? "block" : "none";

        document.getElementById("toggleText").innerHTML =
            isLoginMode
                ? `Don't have an account? <span id="switchMode">Sign Up</span>`
                : `Already have an account? <span id="switchMode">Sign In</span>`;
    }
});

// FORGOT PASSWORD
forgotPasswordLink.addEventListener("click", async () => {
    const email = document.getElementById("email").value;

    if (!email) {
        status.style.color = "red";
        status.innerHTML = "Enter your email first.";
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        status.style.color = "lightgreen";
        status.innerHTML = "Reset email sent.";
    } catch (err) {
        status.style.color = "red";
        status.innerHTML = err.message;
    }
});

// LOGIN / SIGNUP
authForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        status.innerHTML = isLoginMode ? "Logging in..." : "Creating account...";

        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }

        sessionStorage.setItem("verified", "true");

        status.style.color = "lightgreen";
        status.innerHTML = "Success. Redirecting...";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (error) {
        status.style.color = "red";

        let msg = error.code.replace("auth/", "").replaceAll("-", " ");
        status.innerHTML = msg.charAt(0).toUpperCase() + msg.slice(1);
    }
});

// BLOCK BACK BUTTON
history.pushState(null, null, location.href);
window.onpopstate = () => history.go(1);
