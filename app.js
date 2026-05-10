import { authReady } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

window.login = async function () {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const msg = document.getElementById("msg");

    try {
        const auth = await authReady;

        await signInWithEmailAndPassword(auth, email, password);

        msg.innerText = "Login successful";

        // redirect to dashboard
        window.location.href = "dashboard.html";

    } catch (error) {
        msg.innerText = error.message;
    }
};