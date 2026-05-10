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

// FIREBASE CONFIG FROM ENV

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

// INITIALIZE FIREBASE

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// SESSION ONLY LOGIN

await setPersistence(auth, browserSessionPersistence);

// DOM ELEMENTS

const authForm = document.getElementById("authForm");
const status = document.getElementById("status");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const forgotPasswordLink = document.getElementById("forgotPassword");

let isLoginMode = true;

// TOGGLE MODE

document.addEventListener("click", (e) => {

    if (e.target.id === "switchMode") {

        isLoginMode = !isLoginMode;

        formTitle.innerText =
            isLoginMode ? "Sign In" : "Sign Up";

        submitBtn.innerText =
            isLoginMode ? "Continue" : "Create Account";

        forgotPasswordLink.style.display =
            isLoginMode ? "block" : "none";

        document.getElementById("toggleText").innerHTML =
            isLoginMode
            ? `Don't have an account?
               <span id="switchMode">Sign Up</span>`
            : `Already have an account?
               <span id="switchMode">Sign In</span>`;
    }
});

// FORGOT PASSWORD

forgotPasswordLink.addEventListener("click", async () => {

    const email = document.getElementById("email").value;

    if (!email) {

        status.style.color = "var(--error)";
        status.innerHTML = "Enter your email first.";

        return;
    }

    try {

        await sendPasswordResetEmail(auth, email);

        status.style.color = "var(--accent)";
        status.innerHTML =
            "Reset email sent successfully.";

    } catch (error) {

        status.style.color = "var(--error)";
        status.innerHTML = error.message;
    }
});

// LOGIN / SIGNUP

authForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        status.style.color = "#fff";

        status.innerHTML =
            isLoginMode
            ? "Authenticating..."
            : "Creating account...";

        if (isLoginMode) {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        } else {

            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
        }

        // SESSION VERIFY

        sessionStorage.setItem(
            "verified",
            "true"
        );

        status.style.color = "var(--accent)";
        status.innerHTML =
            "Login successful. Redirecting...";

        setTimeout(() => {

            window.location.replace(
                "dashboard.html"
            );

        }, 1200);

    } catch (error) {

        console.error(error);

        status.style.color = "var(--error)";

        let msg = error.code
            .replace("auth/", "")
            .replaceAll("-", " ");

        status.innerHTML =
            msg.charAt(0).toUpperCase() +
            msg.slice(1);
    }
});

// BLOCK BACK BUTTON

history.pushState(null, null, location.href);

window.onpopstate = function () {
    history.go(1);
};
