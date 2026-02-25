document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadProfile();
});

let currentUser = null;

function checkAuth() {
    const stored = localStorage.getItem('currentUser');
    if (!stored) {
        window.location.href = 'index.html';
        return;
    }
    currentUser = JSON.parse(stored);
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-btn-dash').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.getElementById('tab-recommendations').style.display = 'none';
    document.getElementById('tab-saved').style.display = 'none';

    document.getElementById('tab-' + tabId).style.display = 'grid';
}

async function loadProfile() {
    if (!currentUser || !currentUser.token) return;

    try {
        const res = await fetch('http://localhost:3000/api/user/me', {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const data = await res.json();

        if (data.success) {
            const u = data.user;
            // Populate form
            if (u.category) document.getElementById('user-category').value = u.category;
            if (u.education_level) document.getElementById('user-education').value = u.education_level;
            if (u.stream) document.getElementById('user-stream').value = u.stream;
            if (u.year) document.getElementById('user-year').value = u.year;
            if (u.income) document.getElementById('user-income').value = u.income;
            if (u.state) document.getElementById('user-state').value = u.state;
            if (u.gender) document.getElementById('user-gender').value = u.gender;

            // Load recommendations after profile is loaded
            loadRecommendations();

            const savedIds = u.savedScholarships || [];
            if (savedIds.length > 0) {
                // To display saved, we would ideally pass the array of IDs to an endpoint,
                // or just fetch all and filter client side for prototype sake.
                loadSaved(savedIds);
            }
        }
    } catch (e) {
        console.error("Failed to load profile", e);
    }
}

async function saveProfile(e) {
    e.preventDefault();
    if (!currentUser || !currentUser.token) return;

    const btn = document.getElementById('save-profile-btn');
    btn.innerText = "Saving...";

    const payload = {
        category: document.getElementById('user-category').value,
        education_level: document.getElementById('user-education').value,
        stream: document.getElementById('user-stream').value,
        year: document.getElementById('user-year').value,
        income: document.getElementById('user-income').value,
        state: document.getElementById('user-state').value,
        gender: document.getElementById('user-gender').value
    };

    try {
        const res = await fetch('http://localhost:3000/api/user/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
            btn.innerText = "Saved Successfully!";
            setTimeout(() => btn.innerText = "Save Profile", 2000);

            // Update local user object
            currentUser.profileCompleted = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Reload recommendations
            loadRecommendations();
        } else {
            btn.innerText = "Error Saving";
            setTimeout(() => btn.innerText = "Save Profile", 2000);
        }
    } catch (e) {
        console.error("Error saving profile", e);
        btn.innerText = "Network Error";
        setTimeout(() => btn.innerText = "Save Profile", 2000);
    }
}

async function loadRecommendations() {
    const container = document.getElementById('tab-recommendations');
    container.innerHTML = '<p>Loading recommendations...</p>';

    try {
        const res = await fetch('http://localhost:3000/api/user/recommendations', {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const data = await res.json();

        if (data.success) {
            renderCards(data.recommendations, container);
        } else {
            container.innerHTML = '<p>Failed to load recommendations.</p>';
        }
    } catch (e) {
        console.error(e);
        container.innerHTML = '<p>Network error loading recommendations.</p>';
    }
}

// For prototyping: fetch all and filter saved IDs
async function loadSaved(savedIds) {
    const container = document.getElementById('tab-saved');
    if (savedIds.length === 0) {
        container.innerHTML = '<p>You haven\'t saved any scholarships yet.</p>';
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/scholarships');
        let all = await res.json();
        const savedData = all.filter(s => savedIds.includes(s.id));
        renderCards(savedData, container, true);
    } catch (e) {
        console.error(e);
    }
}

async function toggleBookmark(scholarshipId, event) {
    if (event) event.stopPropagation(); // Prevent card click

    const isAdding = !event.target.classList.contains('fas');
    const endpoint = isAdding ? '/api/user/save_scholarship' : '/api/user/remove_scholarship';

    try {
        const res = await fetch(`http://localhost:3000${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: JSON.stringify({ scholarshipId })
        });
        const data = await res.json();
        if (data.success) {
            // Re-render saved list
            loadSaved(data.savedScholarships);
            // Alert or visual feedback could be added here
            if (isAdding) {
                event.target.classList.remove('far');
                event.target.classList.add('fas');
                event.target.style.color = '#fbbf24'; // yellow
            } else {
                event.target.classList.remove('fas');
                event.target.classList.add('far');
                event.target.style.color = 'inherit';
            }
        }
    } catch (e) {
        console.error("Bookmark Error", e);
    }
}

function renderCards(scholarships, container, isSavedTab = false) {
    container.innerHTML = '';
    if (!scholarships || scholarships.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1;">No scholarships found. Update your profile to see more matches!</p>';
        return;
    }

    scholarships.forEach(item => {
        const amount = (item.benefits && item.benefits.length > 0) ? item.benefits[0] : "Amount Not Specified";
        const deadline = (item.dates && item.dates.end) ? new Date(item.dates.end).toISOString().split('T')[0] : "N/A";

        let bookmarkIcon = '<i class="far fa-bookmark" onclick="toggleBookmark(' + item.id + ', event)" style="cursor:pointer; font-size: 1.2em; position:absolute; top: 20px; right: 20px;"></i>';
        if (isSavedTab) {
            bookmarkIcon = '<i class="fas fa-bookmark" onclick="toggleBookmark(' + item.id + ', event)" style="cursor:pointer; font-size: 1.2em; position:absolute; top: 20px; right: 20px; color: #fbbf24;"></i>';
        }

        const card = document.createElement('div');
        card.className = 'scholarship-card glass-panel';
        card.innerHTML = `
            ${bookmarkIcon}
            <span class="tag">${item.type || "Scholarship"}</span>
            <h3 style="padding-right: 30px;">${item.name}</h3>
            <p style="opacity: 0.7; font-size: 0.9em; margin: 5px 0;">${item.provider || "Provider Unknown"} | ${item.stream || "Any Stream"}</p>
            
            <div style="margin: 15px 0; border-top: 1px solid var(--glass-border); padding-top: 10px;">
                <div class="row-between" style="margin-bottom: 8px; align-items: start;">
                    <span style="opacity:0.8;">Amount</span>
                    <strong style="color: var(--accent-color); text-align: right;">${amount}</strong>
                </div>
                <div class="row-between" style="margin-bottom: 8px; align-items: start;">
                    <span style="opacity:0.8;">Deadline</span>
                    <strong style="text-align: right;">${deadline}</strong>
                </div>
            </div>

            <button class="btn btn-primary" style="width:100%" onclick="window.location.href='detail.html?id=${item.id}'">
                View Details
            </button>
        `;
        container.appendChild(card);
    });
}
