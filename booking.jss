const SESSION_KEY = "servicehub_session";
const BOOKINGS_KEY = "servicehub_bookings";

let currentFilter = "All";


// =========================
// HELPERS
// =========================

function $(id) {
    return document.getElementById(id);
}

function getSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch (e) {
        return null;
    }
}

function getAllBookings() {
    try {
        return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveAllBookings(list) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
}

// Sirf current user (ya guest) ki bookings
function currentOwner() {
    const session = getSession();
    return session ? session.email : "guest";
}

function getMyBookings() {
    const owner = currentOwner();

    return getAllBookings().filter(function (b) {
        return b.owner === owner;
    });
}


// =========================
// NAVBAR
// =========================

function updateAuthUI() {
    const session = getSession();

    if (session) {
        $("userGreeting").innerText = "Hi, " + session.name.split(" ")[0];
        $("authBtn").innerText = "Logout";
    } else {
        $("userGreeting").innerText = "";
        $("authBtn").innerText = "Login";
        $("pageSub").innerText = "Aap guest ke tor par hain. Login karein to bookings apne account me save hongi.";
    }
}

function authAction() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
}


// =========================
// FILTERS
// =========================

function setFilter(filter) {
    currentFilter = filter;

    document.querySelectorAll(".filter").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.filter === filter);
    });

    renderBookings();
}


// =========================
// ACTIONS
// =========================

function cancelBooking(id) {
    if (!confirm("Kya aap ye booking cancel karna chahte hain?")) {
        return;
    }

    const all = getAllBookings();

    all.forEach(function (b) {
        if (b.id === id) {
            b.status = "Cancelled";