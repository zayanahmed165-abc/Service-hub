// =========================
// DATA
// =========================

const providers = {
    "Ali Electrician": {
        service: "Professional Electrical Services",
        rating: "⭐ 4.9",
        location: "📍 Karachi, Pakistan",
        price: "Rs. 1,000",
        icon: "👨‍🔧",
        about: "Experienced electrician providing reliable services for homes and businesses.",
        services: [
            "Electrical Repair",
            "Wiring & Installation",
            "Fan & Light Installation",
            "Home Electrical Maintenance"
        ]
    },

    "Ahmed Plumbing": {
        service: "Professional Plumbing Services",
        rating: "⭐ 4.8",
        location: "📍 Karachi, Pakistan",
        price: "Rs. 800",
        icon: "👨‍🔧",
        about: "Skilled plumber handling leakage, fittings and water line problems quickly.",
        services: [
            "Leakage Repair",
            "Pipe Fitting",
            "Bathroom & Kitchen Fittings",
            "Water Tank Installation"
        ]
    },

    "Sarah Tutor": {
        service: "Computer Science Tutor",
        rating: "⭐ 5.0",
        location: "📍 Karachi, Pakistan",
        price: "Rs. 1,500",
        icon: "👩‍🏫",
        about: "Patient tutor helping students with programming and computer science concepts.",
        services: [
            "Programming Basics",
            "Python & C++",
            "Data Structures",
            "Exam Preparation"
        ]
    }
};

// Abhi kaunsa provider select hai (Book Now ke liye)
let currentProvider = "";


// =========================
// HELPERS
// =========================

function $(id) {
    return document.getElementById(id);
}

function openModal(id) {
    $(id).style.display = "flex";
}

function closeModal(id) {
    $(id).style.display = "none";
}


// =========================
// LOGIN
// =========================

const SESSION_KEY = "servicehub_session";

function getSession() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch (e) {
        return null;
    }
}

// Navbar button: logged out ho to login page, logged in ho to logout
function login() {
    if (getSession()) {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = "login.html";
    } else {
        window.location.href = "login.html";
    }
}

function updateAuthUI() {
    const session = getSession();

    if (session) {
        $("userGreeting").innerText = "Hi, " + session.name.split(" ")[0];
        $("authBtn").innerText = "Logout";

        // Booking form me naam aur pehle se bhar do
        $("customerName").value = session.name;
    } else {
        $("userGreeting").innerText = "";
        $("authBtn").innerText = "Login";
    }
}

document.addEventListener("DOMContentLoaded", updateAuthUI);


// =========================
// SEARCH
// =========================

function searchService() {
    const query = $("searchInput").value.trim().toLowerCase();
    const location = $("location").value.toLowerCase();

    const cards = document.querySelectorAll(".provider-card");
    let visibleCount = 0;

    cards.forEach(function (card) {
        const keywords = card.dataset.keywords.toLowerCase();
        const cardLocation = card.dataset.location.toLowerCase();

        const matchesQuery = query === "" || keywords.includes(query);
        const matchesLocation = location === "" || cardLocation === location;

        if (matchesQuery && matchesLocation) {
            card.style.display = "";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    $("noResults").style.display = visibleCount === 0 ? "block" : "none";

    $("providers").scrollIntoView({ behavior: "smooth" });
}

function selectCategory(category) {
    $("searchInput").value = category;
    searchService();
}

// Enter dabane par bhi search ho
$("searchInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        searchService();
    }
});


// =========================
// PROVIDER PROFILE
// =========================

function viewProvider(name) {
    const selected = providers[name];

    if (!selected) {
        return;
    }

    currentProvider = name;

    $("providerName").innerText = name;
    $("providerService").innerText = selected.service;
    $("providerRating").innerText = selected.rating;
    $("providerLocation").innerText = selected.location;
    $("providerPrice").innerText = selected.price;
    $("profileIcon").innerText = selected.icon;
    $("providerAbout").innerText = selected.about;

    const list = $("providerServices");
    list.innerHTML = "";

    selected.services.forEach(function (item) {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
    });

    openModal("providerModal");
}

function closeProvider() {
    closeModal("providerModal");
}


// =========================
// BOOKING
// =========================

function bookFromProfile() {
    closeProvider();
    openBooking(currentProvider);
}

function openBooking(name) {
    currentProvider = name;
    $("selectedProvider").innerText = "Provider: " + name;

    // Aaj se pehle ki date select nahi ho sakti
    const today = new Date().toISOString().split("T")[0];
    $("bookingDate").min = today;

    openModal("bookingModal");
}

function closeBooking() {
    closeModal("bookingModal");
}

function submitBooking() {
    const name = $("customerName").value.trim();
    const phone = $("customerPhone").value.trim();
    const address = $("serviceAddress").value.trim();
    const date = $("bookingDate").value;
    const details = $("bookingDetails").value.trim();

    if (!name || !phone || !address || !date) {
        alert("Please naam, phone, address aur date fill karein.");
        return;
    }

    // Simple phone check: 10 se 13 digits (spaces, +, - allowed)
    const digits = phone.replace(/[\s\-+]/g, "");

    if (!/^\d{10,13}$/.test(digits)) {
        alert("Please sahi phone number likhein.");
        return;
    }

    // Booking save karo (My Bookings page isi se dikhata hai)
    const session = getSession();
    let savedBookings = [];

    try {
        savedBookings = JSON.parse(localStorage.getItem("servicehub_bookings")) || [];
    } catch (err) {
        savedBookings = [];
    }

    savedBookings.push({
        id: Date.now(),
        owner: session ? session.email : "guest",
        provider: currentProvider,
        name: name,
        phone: phone,
        address: address,
        date: date,
        details: details,
        status: "Pending"
    });

    localStorage.setItem("servicehub_bookings", JSON.stringify(savedBookings));

    alert(
        "Booking confirmed!\n\n" +
        "Provider: " + currentProvider + "\n" +
        "Name: " + name + "\n" +
        "Date: " + date + "\n" +
        "Address: " + address +
        (details ? "\nDetails: " + details : "")
    );

    // Form clear karke modal band
    $("customerName").value = "";
    $("customerPhone").value = "";
    $("serviceAddress").value = "";
    $("bookingDate").value = "";
    $("bookingDetails").value = "";

    closeBooking();
}


// =========================
// MODAL: bahar click ya Esc se band
// =========================

window.addEventListener("click", function (e) {
    if (e.target === $("providerModal")) {
        closeProvider();
    }

    if (e.target === $("bookingModal")) {
        closeBooking();
    }
});

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeProvider();
        closeBooking();
    }
});