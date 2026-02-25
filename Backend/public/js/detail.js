// --- EXTRACT SCHOLARSHIP ID FROM URL ---
const urlParams = new URLSearchParams(window.location.search);
const scholarshipId = urlParams.get('id');

// --- DOM ELEMENTS ---
const view = {
    loading: document.getElementById('loading-state'),
    error: document.getElementById('error-state'),
    wrap: document.getElementById('content-wrap'),

    // Data Fields
    type: document.getElementById('d-type'),
    name: document.getElementById('d-name'),
    provider: document.getElementById('d-provider'),
    amount: document.getElementById('d-amount'),
    category: document.getElementById('d-category'),
    deadline: document.getElementById('d-deadline'),
    desc: document.getElementById('d-desc'),

    benefitsSection: document.getElementById('d-benefits-section'),
    benefits: document.getElementById('d-benefits'),

    eligibility: document.getElementById('d-eligibility'),

    selectionSection: document.getElementById('d-selection-section'),
    selection: document.getElementById('d-selection'),

    docs: document.getElementById('d-docs'),
    seatsWrapper: document.getElementById('d-seats-wrapper'),
    seats: document.getElementById('d-seats'),
    applyBtn: document.getElementById('d-apply-btn')
};

async function loadDetails() {
    if (!scholarshipId) {
        showError();
        return;
    }

    try {
        // Fetch specific scholarship from backend
        const res = await fetch(`/api/scholarships/${scholarshipId}`);
        if (!res.ok) throw new Error("Not found");

        const data = await res.json();
        renderDetails(data);
    } catch (err) {
        console.error("Failed to load details:", err);
        showError();
    }
}

function renderDetails(item) {
    // 1. Map Data Safely (Handling MongoDB Schema variations)
    view.type.innerText = item.type || "Scholarship";
    view.name.innerText = item.name || "Unnamed Scholarship";
    view.provider.innerText = item.provider || "Government / Private Organization";

    view.amount.innerText = (item.benefits && item.benefits.length > 0) ? item.benefits[0] : "Amount Not Specified";
    view.category.innerText = Array.isArray(item.category) ? item.category.join(', ') : (item.category || "General");
    view.deadline.innerText = (item.dates && item.dates.end) ? new Date(item.dates.end).toLocaleDateString('en-IN') : "N/A";

    view.desc.innerText = item.description || "No detailed description provided for this scholarship.";

    // Formatting Seats intelligibly
    if (item.seats) {
        let parsedSeats = parseInt(item.seats);
        if (isNaN(parsedSeats) || parsedSeats > 999 || item.seats === "Not Disclosed") {
            view.seats.innerText = "Variable / Ongoing";
        } else {
            view.seats.innerText = item.seats;
        }
    } else {
        view.seatsWrapper.style.display = 'none';
    }

    // Advanced Info Arrays
    if (item.benefits && item.benefits.length > 0) {
        view.benefits.innerHTML = item.benefits.map(b => `<li>${b}</li>`).join('');
        view.benefitsSection.style.display = 'block';
    } else {
        view.benefitsSection.style.display = 'none';
    }

    if (item.selection_process) {
        view.selection.innerText = item.selection_process;
        view.selectionSection.style.display = 'block';
    } else {
        view.selectionSection.style.display = 'none';
    }

    // 2. Render Eligibility list intelligently
    let reqs = [];
    if (item.min_percentage) reqs.push(`Minimum ${item.min_percentage}% marks required in previous exam.`);
    if (item.income_limit > 0) reqs.push(`Annual family income must be less than ₹${item.income_limit.toLocaleString('en-IN')}.`);
    if (item.gender !== "All") reqs.push(`Restricted to ${item.gender} candidates only.`);
    if (item.state && item.state !== "All India" && item.state !== "") reqs.push(`Must be a resident of ${item.state}.`);
    if (item.education_level && item.education_level.length > 0) reqs.push(`Open to students pursuing: ${item.education_level.join(', ')}.`);

    if (reqs.length === 0) reqs.push("General Eligibility criteria apply. See official portal for details.");

    view.eligibility.innerHTML = reqs.map(r => `<li>${r}</li>`).join('');

    // 3. Render Documents list intelligently
    let docs = [];
    if (item.documents && item.documents.length > 0) {
        docs = item.documents;
    } else {
        // Fallback generic document list
        docs = [
            "Aadhaar Card or Identity Proof",
            "Previous Year Academic Marksheets",
            "Income Certificate (if applicable)",
            "Caste Certificate (if applicable)",
            "Bank Passbook Details",
            "Passport Size Photograph"
        ];
    }
    view.docs.innerHTML = docs.map(d => `<li>${d}</li>`).join('');

    // 4. Setup Apply Link
    view.applyBtn.href = item.official_link || "https://scholarships.gov.in/";

    // Hide Loading, Show Content
    view.loading.style.display = 'none';
    view.wrap.style.display = 'grid';
}

function showError() {
    view.loading.style.display = 'none';
    view.error.style.display = 'block';
}

// Initialize
document.addEventListener('DOMContentLoaded', loadDetails);
