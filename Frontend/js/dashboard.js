// ============================================================
//  ScholarEase — Dashboard Logic
//  Handles: Auth check, profile load/display/edit, recommendations, saved
// ============================================================

const API = 'http://localhost:3000';
let currentUser = null;
let profileData   = null;
let isEditMode    = false;

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadProfileAndData();
});

function checkAuth() {
    const stored = localStorage.getItem('currentUser');
    if (!stored) { window.location.href = 'index.html'; return; }
    currentUser = JSON.parse(stored);
    if (!currentUser || !currentUser.token) { window.location.href = 'index.html'; }
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ---- TAB SWITCHING ----
function switchTab(tabName) {
    // pills
    document.querySelectorAll('.tab-pill').forEach(b => b.classList.remove('active'));
    const active = document.getElementById('tab-btn-' + tabName);
    if (active) active.classList.add('active');

    // panels
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('panel-' + tabName);
    if (panel) panel.classList.add('active');
}

// ---- LOAD ALL PROFILE DATA ----
async function loadProfileAndData() {
    if (!currentUser?.token) return;

    try {
        const res  = await fetch(`${API}/api/user/me`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const data = await res.json();

        if (data.success) {
            profileData = data.user;
            populateHero(profileData);
            populateDisplayValues(profileData);
            loadRecommendations();
            loadSaved(profileData.savedScholarships || []);
        }
    } catch (e) {
        console.error('Failed to load profile:', e);
        showToast('Could not connect to server.', 'error');
    }
}

// ---- HERO CARD ----
function populateHero(u) {
    // Avatar initials
    const name = u.name || 'User';
    document.getElementById('user-avatar').textContent = name.charAt(0).toUpperCase();
    document.getElementById('hero-name').textContent   = name;
    document.getElementById('hero-email').textContent  = u.email || '—';

    // Profile status
    const pill = document.getElementById('profile-status-pill');
    const cta  = document.getElementById('complete-cta');
    if (u.profileCompleted) {
        pill.className = 'profile-complete-pill pill-complete';
        pill.innerHTML = '<i class="fas fa-circle-check"></i> Profile Complete';
        cta.innerHTML  = '<i class="fas fa-pen"></i> Edit Profile';
    } else {
        pill.className = 'profile-complete-pill pill-incomplete';
        pill.innerHTML = '<i class="fas fa-circle-exclamation"></i> Profile Incomplete';
        cta.innerHTML  = '<i class="fas fa-user-edit"></i> Complete Profile';
        // Auto-switch to profile tab for new users
        if (!u.profileCompleted) switchTab('profile');
    }

    // Badges
    const badges = document.getElementById('hero-badges');
    badges.innerHTML = '';
    const items = [
        { val: u.education_level, cls: 'badge-blue',   icon: 'fa-book-open' },
        { val: u.stream !== 'All' ? u.stream : null, cls: 'badge-purple', icon: 'fa-flask' },
        { val: u.category,        cls: 'badge-green',  icon: 'fa-users' },
        { val: u.state && u.state !== 'All India' ? u.state : null, cls: 'badge-orange', icon: 'fa-location-dot' },
    ];
    items.forEach(({ val, cls, icon }) => {
        if (!val) return;
        const b = document.createElement('span');
        b.className = `badge ${cls}`;
        b.innerHTML = `<i class="fas ${icon}"></i> ${val}`;
        badges.appendChild(b);
    });
}

// ---- DISPLAY (READ) MODE ----
function populateDisplayValues(u) {
    const set = (id, val, fallback = 'Not set') => {
        const el = document.getElementById(id);
        if (!el) return;
        if (val && val !== 'All') {
            el.textContent = val;
            el.classList.remove('empty');
        } else {
            el.textContent = fallback;
            el.classList.add('empty');
        }
    };

    set('disp-category',  u.category);
    set('disp-education', u.education_level);
    set('disp-stream',    u.stream);
    set('disp-year',      u.year ? `Year ${u.year}` : null);
    set('disp-income',    u.income ? `₹ ${parseInt(u.income).toLocaleString('en-IN')}` : null);
    set('disp-state',     u.state);
    set('disp-gender',    u.gender);
    set('disp-cgpa',      u.cgpa ? `${u.cgpa}` : null);

    // Sync select/input editors to current values (for when editing later)
    const selects = {
        'edit-category':  u.category,
        'edit-education': u.education_level,
        'edit-stream':    u.stream,
        'edit-year':      u.year,
        'edit-state':     u.state,
        'edit-gender':    u.gender,
    };
    Object.entries(selects).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el && val) el.value = val;
    });
    if (u.income) document.getElementById('edit-income').value = u.income;
    if (u.cgpa)   document.getElementById('edit-cgpa').value   = u.cgpa;
}

// ---- EDIT / SAVE TOGGLE ----
function toggleEdit() {
    if (!isEditMode) {
        enterEditMode();
    } else {
        saveProfile();
    }
}

function enterEditMode() {
    isEditMode = true;
    // Show inputs, hide displays
    document.querySelectorAll('.form-display').forEach(d => d.style.display = 'none');
    document.querySelectorAll('.editor').forEach(e => {
        e.style.display = 'block';
        e.disabled = false;
    });
    document.getElementById('edit-save-icon').className  = 'fas fa-floppy-disk';
    document.getElementById('edit-save-label').textContent = 'Save Changes';
    document.getElementById('cancel-btn').style.display  = 'inline-flex';
}

function cancelEdit() {
    isEditMode = false;
    document.querySelectorAll('.form-display').forEach(d => d.style.display = 'block');
    document.querySelectorAll('.editor').forEach(e => {
        e.style.display = 'none';
        e.disabled = true;
    });
    document.getElementById('edit-save-icon').className  = 'fas fa-pen';
    document.getElementById('edit-save-label').textContent = 'Edit Profile';
    document.getElementById('cancel-btn').style.display  = 'none';
}

async function saveProfile() {
    const btn = document.getElementById('edit-save-btn');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;"></div> Saving...';

    const payload = {
        category:        document.getElementById('edit-category').value,
        education_level: document.getElementById('edit-education').value,
        stream:          document.getElementById('edit-stream').value,
        year:            document.getElementById('edit-year').value,
        income:          document.getElementById('edit-income').value,
        state:           document.getElementById('edit-state').value,
        gender:          document.getElementById('edit-gender').value,
        cgpa:            document.getElementById('edit-cgpa').value,
    };

    try {
        const res  = await fetch(`${API}/api/user/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
            profileData = { ...profileData, ...payload, profileCompleted: true };
            localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, profileCompleted: true }));

            cancelEdit();
            populateHero(profileData);
            populateDisplayValues(profileData);
            loadRecommendations();   // Refresh recommendations
            showToast('Profile saved! Recommendations updated.', 'success');
        } else {
            showToast('Failed to save. Try again.', 'error');
        }
    } catch (e) {
        console.error('Save error:', e);
        showToast('Network error. Check your connection.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-floppy-disk" id="edit-save-icon"></i> <span id="edit-save-label">Save Changes</span>';
    }
}

// ---- RECOMMENDATIONS ----
async function loadRecommendations() {
    const grid = document.getElementById('rec-grid');
    grid.innerHTML = '<div class="loading-pulse"><div class="spinner"></div> Finding your matches...</div>';

    try {
        const res  = await fetch(`${API}/api/user/recommendations`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        const data = await res.json();

        if (data.success) {
            const recs = data.recommendations || [];
            document.getElementById('rec-count').textContent = recs.length;
            renderRecCards(recs, grid);
        } else {
            grid.innerHTML = '<div class="empty-state"><span class="icon">🎓</span><h3>No recommendations</h3><p>Complete your profile to see personalized scholarship matches.</p></div>';
        }
    } catch (e) {
        console.error(e);
        grid.innerHTML = '<div class="empty-state"><span class="icon">⚠️</span><h3>Could not load</h3><p>Make sure the backend is running.</p></div>';
    }
}

function renderRecCards(scholarships, container) {
    container.innerHTML = '';
    if (!scholarships || scholarships.length === 0) {
        container.innerHTML = `<div class="empty-state">
            <span class="icon">🔍</span>
            <h3>No matches found</h3>
            <p>Update your profile details to discover scholarships matched to your qualifications.</p>
            <button class="btn btn-accent" onclick="switchTab('profile')" style="margin-top:10px;">
                <i class="fas fa-user-edit"></i> Update Profile
            </button>
        </div>`;
        return;
    }

    scholarships.forEach(item => {
        const amount   = (item.benefits && item.benefits.length > 0) ? item.benefits[0] : 'See Details';
        const deadline = (item.dates && item.dates.end)
            ? new Date(item.dates.end).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'N/A';
        const stream   = item.stream || 'Any Stream';
        const minPct   = item.min_percentage ? `${item.min_percentage}%` : 'None';

        const card = document.createElement('div');
        card.className = 'rec-card';
        card.innerHTML = `
            <span class="match-label"><i class="fas fa-check-circle"></i> Matched</span>
            <span class="type-tag"><i class="fas fa-graduation-cap"></i> ${item.type || 'Scholarship'}</span>
            <h3>${item.name}</h3>
            <p class="provider"><i class="fas fa-building" style="opacity:0.5; margin-right:4px;"></i>${item.provider || 'Government / Associated'}</p>

            <div class="rec-info-row">
                <span class="label">💰 Amount</span>
                <span class="value value-green">${amount}</span>
            </div>
            <div class="rec-info-row">
                <span class="label">📚 Stream</span>
                <span class="value">${stream}</span>
            </div>
            <div class="rec-info-row">
                <span class="label">📊 Min Score</span>
                <span class="value">${minPct}</span>
            </div>
            <div class="rec-info-row">
                <span class="label">📅 Deadline</span>
                <span class="value value-yellow">${deadline}</span>
            </div>

            <div class="rec-card-footer">
                <button class="btn-view" onclick="window.location.href='detail.html?id=${item.id}'">
                    <i class="fas fa-arrow-right"></i> View Details
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// ---- SAVED SCHOLARSHIPS ----
async function loadSaved(savedIds) {
    const grid = document.getElementById('saved-grid');

    if (!savedIds || savedIds.length === 0) {
        grid.innerHTML = `<div class="empty-state">
            <span class="icon">🔖</span>
            <h3>Nothing saved yet</h3>
            <p>Browse scholarships and bookmark the ones you like — they'll appear here.</p>
            <a href="index.html" class="btn btn-accent" style="margin-top:10px; text-decoration:none;">
                <i class="fas fa-search"></i> Browse Scholarships
            </a>
        </div>`;
        return;
    }

    grid.innerHTML = '<div class="loading-pulse"><div class="spinner"></div> Loading saved...</div>';

    try {
        const res  = await fetch(`${API}/api/scholarships`);
        const all  = await res.json();
        const saved = all.filter(s => savedIds.includes(s.id));
        renderRecCards(saved, grid);
    } catch (e) {
        console.error(e);
        grid.innerHTML = '<p style="color:var(--text-muted); padding:40px 0;">Could not load saved scholarships.</p>';
    }
}

// ---- TOAST ----
function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className   = `show ${type}`;
    t.innerHTML   = `<i class="fas ${type === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${msg}`;
    setTimeout(() => { t.className = ''; }, 3500);
}
