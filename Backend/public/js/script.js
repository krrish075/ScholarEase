// --- 1. DYNAMIC DATA STORE (From Original Frontend Structure) ---
const DB = {
    scholarships: []
};

// --- INITIAL FETCH LOGIC ---
async function fetchScholarships() {
    try {
        const response = await fetch('/api/scholarships');
        if (response.ok) {
            const rawData = await response.json();

            // Map the backend's MongoDB schema into the format the frontend expects!
            DB.scholarships = rawData.map(item => ({
                id: item.id || item._id,
                name: item.name || "Unknown Scholarship",
                provider: item.provider || "Government / Associated",
                min_percentage: item.min_percentage || 0,
                // If backend provides a 'benefits' array, take the first string as amount
                amount: (item.benefits && item.benefits.length > 0) ? item.benefits[0] : "Amount Not Specified",
                // Extract deadline string
                deadline: (item.dates && item.dates.end) ? new Date(item.dates.end).toISOString().split('T')[0] : "N/A",
                category: Array.isArray(item.category) ? item.category.join(', ') : (item.category || "General"),
                income_limit: item.income_limit || 0,
                gender: item.gender || "All",
                state: item.state || "All India",
                education: Array.isArray(item.education_level) ? item.education_level.join(', ') : (item.education_level || "Any"),
                stream: item.stream || "All",
                year: Array.isArray(item.year_of_study) ? item.year_of_study.join(',') : (item.year_of_study || "All"),
                tags: [item.type || "Scholarship"],
                desc: item.description || "No description available."
            }));

            render(); // Re-render once data arrives
        } else {
            console.error("Backend error fetching scholarships.");
        }
    } catch (err) {
        console.error("Failed to connect to backend API:", err);
    }
}

// --- 2. CONFIGURATION & STATE ---
const State = {
    isParentMode: false,
    searchQuery: '',
    filters: {
        percentage: 0, // 0 = No filter
        income: 0, // Default 0 (Show All)
        category: 'All',
        gender: 'All',
        state: 'All', // Default All
        education: 'All',
        stream: 'All',
        year: 'All'
    },
    sortBy: 'relevance'
};

// --- 3. DOM ELEMENTS ---
const els = {
    grid: document.getElementById('scholarship-grid'),
    parentToggle: document.getElementById('parent-mode-toggle'),
    body: document.body,
    searchInput: document.getElementById('search-input'),
    searchBtn: document.querySelector('.search-bar button'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    chat: {
        window: document.getElementById('chat-window'),
        msgs: document.getElementById('chat-messages'),
        input: document.getElementById('chat-input')
    }
};

// --- 4. CORE FUNCTIONS ---

// Render Logic
function render() {
    els.grid.innerHTML = '';
    const fragment = document.createDocumentFragment();

    let list = applyFilters(DB.scholarships);
    list = applySort(list);

    if (list.length === 0) {
        els.grid.innerHTML = `<div style="text-align:center; grid-column: 1/-1; padding: 40px; color:white;">No scholarships found. Try adjusting your filters.</div>`;
        return;
    }

    list.forEach(item => {
        const card = createScholarshipCard(item);
        fragment.appendChild(card);
    });

    // Optimize: Only humanize the new fragment if parent mode is active, avoiding full DOM scan
    if (State.isParentMode) humanizeText(fragment);

    els.grid.appendChild(fragment);
}

function applyFilters(data) {
    return data.filter(item => {
        // Search Logic 
        const query = State.searchQuery.toLowerCase().trim();
        const searchPass = !query ||
            item.name.toLowerCase().includes(query) ||
            item.provider.toLowerCase().includes(query) ||
            item.stream.toLowerCase().includes(query) ||
            ('' + item.year).includes(query) ||
            item.tags.some(tag => tag.toLowerCase().includes(query));

        // Income Logic:
        const incomePass = item.income_limit === 0 || item.income_limit >= State.filters.income;

        // Percentage Logic:
        const scorePass = !item.min_percentage || (State.filters.percentage === 0) || (State.filters.percentage >= item.min_percentage);

        // Category Logic:
        let catPass = false;
        if (State.filters.category === 'All') catPass = true;
        else if (State.filters.category === 'General' && item.category.includes('General')) catPass = true;
        else if (State.filters.category === 'OBC' && item.category.includes('OBC')) catPass = true;
        else if (State.filters.category === 'SC/ST' && (item.category.includes('SC') || item.category.includes('ST'))) catPass = true;

        const genderPass = State.filters.gender === 'All' || item.gender === 'All' || item.gender === State.filters.gender;
        const statePass = State.filters.state === 'All' || item.state === 'All India' || (item.state === 'Maharashtra' && State.filters.state === 'Maharashtra');

        // Education Logic
        let eduPass = true;
        if (State.filters.education !== 'All') {
            const reqEdu = State.filters.education;
            const itemEdu = item.education;
            if (itemEdu.includes(reqEdu)) eduPass = true;
            else if (itemEdu.includes('Undergraduate') && reqEdu === 'Undergraduate') eduPass = true;
            else if (itemEdu.includes('Class 10-12') && (reqEdu === 'Class 10' || reqEdu === 'Class 12')) eduPass = true;
            else if (itemEdu.includes('Class 11, Class 12') && reqEdu === 'Class 12') eduPass = true;
            else {
                eduPass = false;
            }
        }

        // Stream Logic
        let streamPass = true;
        if (State.filters.stream !== 'All') {
            if (item.stream === 'All') streamPass = true;
            else streamPass = item.stream.toLowerCase().includes(State.filters.stream.toLowerCase()) || State.filters.stream.toLowerCase().includes(item.stream.toLowerCase());
        }

        // Year Logic
        let yearPass = true;
        if (State.filters.year !== 'All') {
            if (item.year === 'All') yearPass = true;
            else {
                const yearsArray = item.year.split(',');
                yearPass = yearsArray.includes(State.filters.year);
            }
        }

        return searchPass && incomePass && scorePass && catPass && genderPass && statePass && eduPass && streamPass && yearPass;
    });
}

function applySort(data) {
    const d = [...data]; // Copy
    if (State.sortBy === 'amount-high') {
        return d.sort((a, b) => {
            const getVal = (str) => {
                if (str.includes('Full') || str.includes('100%')) return 1000000;
                return parseInt(str.replace(/[^0-9]/g, '')) || 0;
            };
            return getVal(b.amount) - getVal(a.amount);
        });
    } else if (State.sortBy === 'deadline') {
        return d.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (State.sortBy === 'merit-low') {
        // Sort by Min Percentage Required (Low to High - Easier to Harder)
        return d.sort((a, b) => (a.min_percentage || 0) - (b.min_percentage || 0));
    }
    return d; // relevance (default ID order)
}

function createScholarshipCard(item) {
    const card = document.createElement('div');
    card.className = 'scholarship-card glass-panel animate-pop';

    // Note: We avoid setting data-orig manually in HTML where possible to let humanizeText handle it safely via innerText
    // But for consistency with existing CSS/logic, we keep the structure.
    card.innerHTML = `
        <span class="tag">${item.tags[0]}</span>
        <h3 class="humanize">${item.name}</h3>
        <p style="opacity: 0.7; font-size: 0.9em; margin: 5px 0;">${item.provider} | ${item.stream}</p>
        
        <div style="margin: 15px 0; border-top: 1px solid var(--glass-border); padding-top: 10px;">
        <div style="margin: 15px 0; border-top: 1px solid var(--glass-border); padding-top: 10px;">
            <div class="row-between" style="font-size:0.85em; opacity:0.8; margin-bottom: 8px; align-items: start;">
                 <span class="humanize" data-orig="Edu" style="opacity:0.8;">Edu</span>
                 <small style="text-align:right; max-width: 60%; line-height:1.2;">${item.education}</small>
            </div>
             <div class="row-between" style="font-size:0.9em; margin-bottom: 8px; align-items: start;">
                 <span class="humanize" data-orig="Stream" style="opacity:0.8;">Stream</span>
                 <strong style="text-align: right;">${item.stream}</strong>
            </div>
             <div class="row-between" style="margin-bottom: 8px; align-items: start;">
                <span class="humanize" data-orig="Year" style="opacity:0.8;">Year</span>
                <small style="text-align: right; font-weight: bold;">${item.year === 'All' ? 'Any Year' : item.year}</small>
            </div>
            <div class="row-between" style="font-size:0.85em; opacity:0.8; margin-bottom: 8px; align-items: start;">
                 <span class="humanize" data-orig="State" style="opacity:0.8;">State</span>
                 <small style="text-align:right; max-width: 60%; line-height:1.2; font-weight: bold; color: #fff;">${item.state !== 'All India' ? item.state : 'All States (India)'}</small>
            </div>
            
            <div class="row-between" style="margin-bottom: 8px; align-items: start; margin-top: 12px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top:8px;">
                <span class="humanize" data-orig="Amount" style="opacity:0.8;">Amount</span>
                <strong style="color: var(--accent-color); text-align: right;">${item.amount}</strong>
            </div>
            <div class="row-between" style="margin-bottom: 8px; align-items: start;">
                <span class="humanize" data-orig="Min Score" style="opacity:0.8;">Min Score</span>
                <strong style="text-align: right;">${item.min_percentage ? item.min_percentage + '%' : 'None'}</strong>
            </div>
            <div class="row-between" style="margin-bottom: 8px; align-items: start;">
                <span class="humanize" data-orig="Deadline" style="opacity:0.8;">Deadline</span>
                <strong style="text-align: right;">${item.deadline}</strong>
            </div>
        </div>
        </div>

        <button class="btn btn-primary" style="width:100%" onclick="window.location.href='detail.html?id=${item.id}'">
            <span class="humanize" data-orig="View Details">View Details</span>
        </button>
    `;
    return card;
}



// Parent Mode Logic
function toggleParentMode() {
    State.isParentMode = !State.isParentMode;
    if (State.isParentMode) {
        els.body.classList.add('parent-mode');
        // Optimize: Use requestAnimationFrame to decouple logic from event
        requestAnimationFrame(() => humanizeText());
        updateToggleText("👨‍👩‍👧‍👦 Parent Mode: ON");
    } else {
        els.body.classList.remove('parent-mode');
        requestAnimationFrame(() => revertText());
        updateToggleText("👨‍👩‍👧‍👦 Parent Mode: OFF");
    }
}

function updateToggleText(text) {
    const label = els.parentToggle.querySelector('span');
    if (label) label.innerText = text;
}

// "Humanizer" Dictionary
const DICTIONARY = {
    "Amount": "Money You Get",
    "Deadline": "Last Date",
    "View Details": "Read More",
    "Scholarship": "Free Education Money",
    "Find Your Perfect Scholarship": "Find Money for School",
    "Discover opportunities": "Look for help",
    "For": "Who?",
    "Edu": "Class Level",
    "Min Score": "Pass Marks Needed",
    "Year": "College Year",
    "Stream": "Subject Area",
    "Filters": "Choose what you want",
    "Top Recommendations": "Best Choices For You"
};

function humanizeText(root = document) {
    const elements = root.querySelectorAll('.humanize');

    // Batch Reads (checking dict) to minimalize layout thrashing if we were reading layout props (though innerText is partial layout)
    elements.forEach(el => {
        // If data-orig exists, use it. If not, capture innerText as orig.
        let orig = el.getAttribute('data-orig');
        if (!orig) {
            orig = el.innerText;
            el.setAttribute('data-orig', orig);
        }

        if (DICTIONARY[orig]) {
            el.innerText = DICTIONARY[orig];
        }
    });
}

function revertText(root = document) {
    const elements = root.querySelectorAll('.humanize');
    elements.forEach(el => {
        const orig = el.getAttribute('data-orig');
        if (orig) el.innerText = orig;
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    if (els.parentToggle) els.parentToggle.addEventListener('click', toggleParentMode);

    // Search Listener - Input and Button
    if (els.searchInput) {
        // Search-as-you-type
        els.searchInput.addEventListener('input', (e) => {
            State.searchQuery = e.target.value;
            render();
        });

        // Enter key
        els.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                State.searchQuery = els.searchInput.value;
                render();
            }
        });
    }

    // Explicit Button Click
    if (els.searchBtn) {
        els.searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (els.searchInput) {
                State.searchQuery = els.searchInput.value;
                render();
            }
        });
    }

    // Filter Listeners
    document.getElementById('filter-category').addEventListener('change', (e) => { State.filters.category = e.target.value; render(); });
    document.getElementById('filter-gender').addEventListener('change', (e) => { State.filters.gender = e.target.value; render(); });
    document.getElementById('filter-state').addEventListener('change', (e) => { State.filters.state = e.target.value; render(); });

    // Existing Filters
    const eduEl = document.getElementById('filter-education');
    if (eduEl) eduEl.addEventListener('change', (e) => { State.filters.education = e.target.value; render(); });

    // NEW Filters
    const streamEl = document.getElementById('filter-stream');
    if (streamEl) streamEl.addEventListener('change', (e) => { State.filters.stream = e.target.value; render(); });

    const yearEl = document.getElementById('filter-year');
    if (yearEl) yearEl.addEventListener('change', (e) => { State.filters.year = e.target.value; render(); });

    const incEl = document.getElementById('filter-income');
    const incVal = document.getElementById('income-val');
    if (incEl) incEl.addEventListener('input', (e) => {
        State.filters.income = parseInt(e.target.value);
        if (incVal) incVal.innerText = `₹${(State.filters.income / 100000).toFixed(1)}L`;
        render();
    });

    const scoreEl = document.getElementById('filter-score');
    const scoreVal = document.getElementById('score-val');
    if (scoreEl) scoreEl.addEventListener('input', (e) => {
        State.filters.percentage = parseInt(e.target.value);
        if (scoreVal) scoreVal.innerText = `${State.filters.percentage}%`;
        render();
    });

    // Sorting Listener
    const sortEl = document.getElementById('sort-select');
    if (sortEl) sortEl.addEventListener('change', (e) => { State.sortBy = e.target.value; render(); });

    // Initial Render
    fetchScholarships(); // Fetches and calls render() automatically
    checkLogin();
    console.log("ScholarEase Nexus Loaded.");
});


// --- 6. CHATBOT (Real Logic) ---
function toggleChat() {
    const win = els.chat.window;
    if (win) win.style.display = win.style.display === 'none' ? 'flex' : 'none';
}

function sendChat() {
    const text = els.chat.input.value.trim().toLowerCase();
    if (!text) return;

    // 1. User Message
    addMsg(els.chat.input.value, 'user');
    els.chat.input.value = '';

    // 2. Bot Logic
    let reply = "I'm still learning! Try searching above.";

    if (text.includes('hello') || text.includes('hi')) {
        reply = "Hello! I can help you find deadlines and amounts. Ask me 'When is the deadline for Tata?'";
    }
    else if (text.includes('deadline') || text.includes('when') || text.includes('date')) {
        const found = DB.scholarships.find(s => text.includes(s.name.toLowerCase().split(' ')[0].toLowerCase())); // fuzzy match first word
        if (found) reply = `The deadline for ${found.name} is ${found.deadline}.`;
        else reply = "Which scholarship? I couldn't find that name in my database.";
    }
    else if (text.includes('money') || text.includes('amount') || text.includes('how much')) {
        const found = DB.scholarships.find(s => text.includes(s.name.toLowerCase().split(' ')[0].toLowerCase()));
        if (found) reply = `You will receive ${found.amount}.`;
        else reply = "Which scholarship are you asking about?";
    }

    // 3. Bot Reply
    setTimeout(() => addMsg(reply, 'bot'), 400);
}

function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = `msg ${type}`;
    d.innerText = text;
    d.style.marginBottom = '10px';
    d.style.padding = '8px 12px';
    d.style.borderRadius = '10px';
    d.style.maxWidth = '80%';

    if (type === 'user') {
        d.style.background = 'white';
        d.style.color = '#333';
        d.style.alignSelf = 'flex-end';
    } else {
        d.style.background = 'rgba(255,255,255,0.1)';
        d.style.alignSelf = 'flex-start';
    }

    els.chat.msgs.appendChild(d);
    els.chat.msgs.scrollTop = els.chat.msgs.scrollHeight;
}

// --- 7. AUTHENTICATION (Persistence) ---
function toggleLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
}

async function handleLogin() {
    const nameEl = document.getElementById('login-name');
    const emailEl = document.getElementById('login-email');
    const passwordEl = document.getElementById('login-password'); // Optional for UI consistency

    const name = nameEl ? nameEl.value : 'Student';
    const email = emailEl ? emailEl.value : '';
    const password = passwordEl ? passwordEl.value : '7276@Amit'; // Default fallback login if missing in UI

    if (!email) {
        alert("Please enter your email to login");
        return;
    }

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
            const user = { name: data.user.name || name, email, isLoggedIn: true };
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateUIForLogin(user);
            toggleLoginModal();
        } else {
            alert(data.message || "Invalid credentials!");
        }
    } catch (e) {
        console.error("Login Error:", e);
        alert("Could not reach backend API!");
    }
}

function checkLogin() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
        const user = JSON.parse(stored);
        if (user.isLoggedIn) updateUIForLogin(user);
    }
}

function updateUIForLogin(user) {
    const btn = document.getElementById('login-btn');
    if (btn) {
        btn.innerHTML = `<i class='fas fa-user-circle'></i> Hi, ${user.name}`;
        btn.onclick = () => {
            if (confirm("Logout?")) {
                localStorage.removeItem('currentUser');
                location.reload();
            }
        };
    }
}
