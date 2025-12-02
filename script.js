// Mock member data
const MOCK_MEMBERS = [
    {
        id: 1,
        name: "Shinchan",
        role: "Lead Developer",
        photo: "images/1.svg",
        skills: ["React", "TypeScript", "Node.js", "GraphQL"],
        bio: "Full-stack developer passionate about building scalable web applications and mentoring junior developers.",
        location: "San Francisco"
    },
    {
        id: 2,
        name: "Alex Patel",
        role: "UI/UX Designer",
        photo: "images/2.svg",
        skills: ["Figma", "Design Systems", "Prototyping"],
        bio: "Creating beautiful and intuitive user experiences with a focus on accessibility and user-centered design.",
        location: "New York"
    },
    {
        id: 3,
        name: "Maya Christopher Nolen",
        role: "Backend Engineer",
        photo: "images/3.svg",
        skills: ["Python", "Django", "PostgreSQL", "Docker"],
        bio: "Backend specialist with expertise in distributed systems and database optimization.",
        location: "Austin"
    },
    {
        id: 4,
        name: "James Tripathi",
        role: "Mobile Developer",
        photo: "images/4.svg",
        skills: ["React Native", "iOS", "Android", "Firebase"],
        bio: "Building cross-platform mobile apps that deliver native performance and user experience.",
        location: "Seattle"
    },
    {
        id: 5,
        name: "Elena Sharma",
        role: "DevOps Engineer",
        photo: "images/5.svg",
        skills: ["Kubernetes", "AWS", "CI/CD", "Terraform"],
        bio: "Automating deployments and ensuring reliable infrastructure for high-traffic applications.",
        location: "Boston"
    },
    {
        id: 6,
        name: "David Singh Rajpoot",
        role: "Data Scientist",
        photo: "images/6.svg",
        skills: ["Python", "TensorFlow", "Data Analysis", "ML"],
        bio: "Extracting insights from data and building machine learning models for predictive analytics.",
        location: "San Francisco"
    }
];

// State
let members = [];
let filteredMembers = [];
let searchQuery = "";
let activeFilters = {
    role: null,
    skill: null,
    location: null
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    setupEventListeners();
    showSplashScreen();
});

// Theme management
function initializeTheme() {
    const stored = localStorage.getItem('theme') || 'light';
    if (stored === 'dark') {
        document.documentElement.classList.add('dark');
        document.getElementById('moon-icon').style.display = 'none';
        document.getElementById('sun-icon').style.display = 'block';
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('moon-icon').style.display = isDark ? 'none' : 'block';
    document.getElementById('sun-icon').style.display = isDark ? 'block' : 'none';
}

// Splash screen
function showSplashScreen() {
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        fetchMembers();
    }, 2500);
}

// Event listeners
function setupEventListeners() {
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    document.getElementById('retry-button').addEventListener('click', fetchMembers);
}

// Search handler
function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase();
    filterMembers();
}

// Fetch members
async function fetchMembers() {
    showLoading();
    hideError();
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In production: const response = await fetch('/members');
        // const data = await response.json();
        
        members = MOCK_MEMBERS;
        filteredMembers = [...members];
        
        hideLoading();
        renderFilters();
        renderMembers();
        updateMemberCount();
    } catch (error) {
        hideLoading();
        showError();
        console.error('Failed to fetch members:', error);
    }
}

// Filter members
function filterMembers() {
    filteredMembers = members.filter(member => {
        const matchesSearch = !searchQuery ||
            member.name.toLowerCase().includes(searchQuery) ||
            member.bio.toLowerCase().includes(searchQuery);
        
        const matchesRole = !activeFilters.role || member.role === activeFilters.role;
        const matchesSkill = !activeFilters.skill || member.skills.includes(activeFilters.skill);
        const matchesLocation = !activeFilters.location || member.location === activeFilters.location;
        
        return matchesSearch && matchesRole && matchesSkill && matchesLocation;
    });
    
    renderMembers();
    updateMemberCount();
    updateClearButton();
}

// Render filters
function renderFilters() {
    const roles = [...new Set(members.map(m => m.role))];
    const skills = [...new Set(members.flatMap(m => m.skills))];
    const locations = [...new Set(members.map(m => m.location))];
    
    renderFilterBadges('role-filters', roles, 'role');
    renderFilterBadges('skill-filters', skills, 'skill');
    renderFilterBadges('location-filters', locations, 'location');
}

function renderFilterBadges(containerId, items, filterType) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    items.forEach(item => {
        const badge = document.createElement('span');
        badge.className = 'filter-badge';
        badge.textContent = item;
        
        if (activeFilters[filterType] === item) {
            badge.classList.add('active');
        }
        
        badge.addEventListener('click', () => toggleFilter(filterType, item));
        container.appendChild(badge);
    });
}

function toggleFilter(type, value) {
    if (activeFilters[type] === value) {
        activeFilters[type] = null;
    } else {
        activeFilters[type] = value;
    }
    
    renderFilters();
    filterMembers();
}

function clearFilters() {
    activeFilters = { role: null, skill: null, location: null };
    renderFilters();
    filterMembers();
}

function updateClearButton() {
    const hasActiveFilters = Object.values(activeFilters).some(v => v !== null);
    document.getElementById('clear-filters').style.display = hasActiveFilters ? 'flex' : 'none';
}

// Render members
function renderMembers() {
    const container = document.getElementById('members-grid');
    const noResults = document.getElementById('no-results');
    
    if (filteredMembers.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    container.innerHTML = '';
    
    filteredMembers.forEach((member, index) => {
        const card = createMemberCard(member, index);
        container.appendChild(card);
    });
}

function createMemberCard(member, index) {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const displayedSkills = member.skills.slice(0, 3);
    const remainingSkills = member.skills.length - 3;
    
    card.innerHTML = `
        <div class="member-image-container">
            <img src="${member.photo}" alt="${member.name}" class="member-image">
            <div class="member-image-overlay"></div>
        </div>
        <div class="member-content">
            <h3 class="member-name">${member.name}</h3>
            <p class="member-role">${member.role}</p>
            <p class="member-bio">${member.bio}</p>
            <div class="member-skills">
                ${displayedSkills.map(skill => `<span class="skill-badge">${skill}</span>`).join('')}
                ${remainingSkills > 0 ? `<span class="skill-badge more">+${remainingSkills}</span>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Update member count
function updateMemberCount() {
    document.getElementById('member-count').textContent = filteredMembers.length;
}

// Loading/Error states
function showLoading() {
    document.getElementById('loading-state').style.display = 'block';
    document.getElementById('members-grid').style.display = 'none';
    document.getElementById('filter-panel').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('members-grid').style.display = 'grid';
    document.getElementById('filter-panel').style.display = 'flex';
}

function showError() {
    document.getElementById('error-state').style.display = 'flex';
    document.getElementById('members-grid').style.display = 'none';
}

function hideError() {
    document.getElementById('error-state').style.display = 'none';
}
