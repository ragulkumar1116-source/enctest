import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    setPersistence,
    browserSessionPersistence
} 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* =========================
   SAFE ENV READER
   ========================= */

// Prevent crash if env is undefined
const env = import.meta.env || {};

// DEBUG (remove later if needed)
console.log("ENV CHECK:", env);

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: env.VITE_FIREBASE_DATABASE_URL,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

/* =========================
   VALIDATION (IMPORTANT)
   ========================= */

if (!firebaseConfig.apiKey) {
    throw new Error(
        "Firebase config missing. Check .env file (VITE_FIREBASE_API_KEY)"
    );
}

/* =========================
   INIT FIREBASE
   ========================= */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* Session-only login */
setPersistence(auth, browserSessionPersistence);

/* =========================
   DOM ELEMENTS
   ========================= */

const authForm = document.getElementById("authForm");
const status = document.getElementById("status");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const forgotPasswordLink = document.getElementById("forgotPassword");

let isLoginMode = true;

/* =========================
   TOGGLE LOGIN / SIGNUP
   ========================= */

document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "switchMode") {

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

/* =========================
   FORGOT PASSWORD
   ========================= */

forgotPasswordLink.addEventListener("click", async () => {
    const email = document.getElementById("email").value;

    if (!email) {
        status.style.color = "red";
        status.innerHTML = "Enter your email first.";
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);

        status.style.color = "green";
        status.innerHTML = "Reset email sent successfully.";
    } catch (error) {
        status.style.color = "red";
        status.innerHTML = error.message;
    }
});

/* =========================
   LOGIN / SIGNUP
   ========================= */

authForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        status.style.color = "#fff";
        status.innerHTML = isLoginMode
            ? "Authenticating..."
            : "Creating account...";

        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }

        sessionStorage.setItem("verified", "true");

        status.style.color = "green";
        status.innerHTML = "Success. Redirecting...";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1200);

    } catch (error) {
        console.error(error);

        status.style.color = "red";

        let msg = (error.code || error.message)
            .replace("auth/", "")
            .replaceAll("-", " ");

        status.innerHTML = msg.charAt(0).toUpperCase() + msg.slice(1);
    }
});

/* =========================
   BLOCK BACK BUTTON
   ========================= */

history.pushState(null, null, location.href);

window.onpopstate = function () {
    history.go(1);
};
