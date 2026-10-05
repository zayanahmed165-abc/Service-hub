const SESSION_KEY = "servicehub_session";
const REQUESTS_KEY = "servicehub_provider_requests";


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

function getRequests() {
    try {
        return JSON.parse(localStorage.getItem(REQUESTS_KEY)) || [];
    } catch (e) {
        return [];
    }
}


// =========================
// NAVBAR
// =========================

function updateAuthUI() {
    const session = getSession();

    if (session) {
        $("userGreeting").innerText = "Hi, " + session.name.split(" ")[0];
        $("authBtn").innerText = "Logout";

        // Naam pehle se bhar do
        $("pName").value = session.name;
    } else {
        $("userGreeting").innerText = "";
        $("authBtn").innerText = "Login";
    }
}

function authAction() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "login.html";
}


// =========================
// FORM
// =========================

$("providerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = $("pName").value.trim();
    const phone = $("pPhone").value.trim();
    const category = $("pCategory").value;
    const city = $("pCity").value;
    const price = Number($("pPrice").value);
    const experience = $("pExperience").value;
    const about = $("pAbout").value.trim();
    const error = $("providerError");

    error.innerText = "";

    if (!name || !phone || !category || !city || !$("pPrice").value || experience === "" || !about) {
        error.innerText = "Please sab fields fill karein.";
        return;
    }

    const digits = phone.replace(/[\s\-+]/g, "");

    if (!/^\d{10,13}$/.test(digits)) {
        error.innerText = "Please sahi phone number likhein.";
        return;
    }

    if (price < 100) {
        error.innerText = "Starting price kam az kam Rs. 100 honi chahiye.";
        return;
    }

    if (Number(experience) < 0 || Number(experience) > 60) {
        error.innerText = "Experience 0 se 60 saal ke beech likhein.";
        return;
    }

    if (about.length < 20) {
        error.innerText = "About me kam az kam 20 characters likhein.";
        return;
    }

    const session = getSession();
    const requests = getRequests();

    requests.push({
        id: Date.now(),
        owner: session ? session.email : "guest",
        name: name,
        phone: phone,
        category: category,
        city: city,
        price: price,
        experience: Number(experience),
        about: about,
        status: "Under Review",
        createdAt: new Date().toISOString()
    });

    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));

    $("successText").innerText =
        name + ", aapki " + category + " provider ki application " +
        city + " ke liye save ho gayi hai. Status: Under Review.";

    $("formCard").classList.add("hidden");
    $("successCard").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
});


// =========================
// START
// =========================

updateAuthUI();