// =========================
// STORAGE KEYS
// =========================

const USERS_KEY = "servicehub_users";
const SESSION_KEY = "servicehub_session";


// =========================
// HELPERS
// =========================

function $(id) {
    return document.getElementById(id);
}

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

// Password ko plain text me save nahi karte, SHA-256 hash save hota hai
async function hashPassword(password) {
    if (window.crypto && window.crypto.subtle) {
        const bytes = new TextEncoder().encode(password);
        const buffer = await crypto.subtle.digest("SHA-256", bytes);

        return Array.from(new Uint8Array(buffer))
            .map(function (b) { return b.toString(16).padStart(2, "0"); })
            .join("");
    }

    // Fallback agar browser crypto support na kare
    return btoa(unescape(encodeURIComponent(password)));
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function goToHome() {
    window.location.href = "index.html";
}


// =========================
// UI
// =========================

function showTab(tab) {
    const isLogin = tab === "login";

    $("loginForm").classList.toggle("hidden", !isLogin);
    $("signupForm").classList.toggle("hidden", isLogin);

    $("tabLogin").classList.toggle("active", isLogin);
    $("tabSignup").classList.toggle("active", !isLogin);

    $("loginError").innerText = "";
    $("signupError").innerText = "";
}

function togglePassword(inputId, button) {
    const input = $(inputId);
    const show = input.type === "password";

    input.type = show ? "text" : "password";
    button.innerText = show ? "Hide" : "Show";
}

function continueAsGuest() {
    localStorage.removeItem(SESSION_KEY);
    goToHome();
}


// =========================
// LOGIN
// =========================

$("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = $("loginEmail").value.trim().toLowerCase();
    const password = $("loginPassword").value;
    const error = $("loginError");

    error.innerText = "";

    if (!email || !password) {
        error.innerText = "Email aur password dono likhein.";
        return;
    }

    if (!isValidEmail(email)) {
        error.innerText = "Sahi email address likhein.";
        return;
    }

    const users = getUsers();
    const user = users[email];

    if (!user) {
        error.innerText = "Is email se koi account nahi mila. Pehle sign up karein.";
        return;
    }

    const hash = await hashPassword(password);

    if (hash !== user.password) {
        error.innerText = "Password galat hai.";
        return;
    }

    setSession({ name: user.name, email: email });
    goToHome();
});


// =========================
// SIGN UP
// =========================

$("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = $("signupName").value.trim();
    const email = $("signupEmail").value.trim().toLowerCase();
    const password = $("signupPassword").value;
    const confirm = $("signupConfirm").value;
    const error = $("signupError");

    error.innerText = "";

    if (!name || !email || !password || !confirm) {
        error.innerText = "Sab fields fill karein.";
        return;
    }

    if (!isValidEmail(email)) {
        error.innerText = "Sahi email address likhein.";
        return;
    }

    if (password.length < 6) {
        error.innerText = "Password kam az kam 6 characters ka hona chahiye.";
        return;
    }

    if (password !== confirm) {
        error.innerText = "Dono passwords match nahi kar rahe.";
        return;
    }

    const users = getUsers();

    if (users[email]) {
        error.innerText = "Is email se account pehle se bana hua hai.";
        return;
    }

    users[email] = {
        name: name,
        password: await hashPassword(password)
    };

    saveUsers(users);
    setSession({ name: name, email: email });
    goToHome();
});


// =========================
// Pehle se logged in ho to seedha home
// =========================

if (localStorage.getItem(SESSION_KEY)) {
    goToHome();
}