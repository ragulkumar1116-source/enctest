import { authReady } from "./firebase.js";
import { 
    createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { 
    getDatabase, 
    ref, 
    set 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

window.register = async function () {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const msg = document.getElementById("msg");

    try {
        const auth = await authReady;

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        // Save user data in Realtime Database
        const db = getDatabase();
        await set(ref(db, "users/" + user.uid), {
            name: name,
            email: email,
            role: role,
            createdAt: Date.now()
        });

        msg.innerText = "Registration successful";

        // redirect to login
        window.location.href = "index.html";

    } catch (error) {
        msg.innerText = error.message;
    }
};