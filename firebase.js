import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let app, auth;

async function initFirebase() {
    const res = await fetch("./firebase-config.json", {
        cache: "no-store"
    });

    const config = await res.json();

    app = initializeApp(config);
    auth = getAuth(app);

    return auth;
}

// export ready auth after initialization
export const authReady = initFirebase();
export { auth };