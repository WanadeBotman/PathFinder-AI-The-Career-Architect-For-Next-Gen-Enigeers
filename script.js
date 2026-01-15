const DB = {
    frontend: {
        title: "Frontend Architect",
        tasks: ["Master Semantic HTML & Modern CSS", "Reactive Logic with JavaScript", "Component Lifecycle & Props", "State Management (Redux/Zustand)"],
        nexus: [
            { name: "Kevin Powell", icon: "fa-brands fa-youtube", desc: "The King of CSS", link: "https://www.youtube.com/@KevinPowell" },
            { name: "MDN Web Docs", icon: "fa-solid fa-file-code", desc: "The Bible of Web", link: "https://developer.mozilla.org/" }
        ]
    },
    backend: {
        title: "System Engineer",
        tasks: ["Node.js Runtime & Event Loop", "Database Normalization (SQL)", "REST & GraphQL Design", "Microservices & Docker"],
        nexus: [
            { name: "Hussein Nasser", icon: "fa-solid fa-server", desc: "Advanced Architecture", link: "https://www.youtube.com/@hnasr" },
            { name: "Postman Docs", icon: "fa-solid fa-bolt", desc: "API Mastery", link: "https://learning.postman.com/docs/getting-started/introduction/" }
        ]
    },
    security: {
        title: "Cyber Defense Specialist",
        tasks: ["Network Fundamentals & Protocols", "Cryptography & Encryption", "Ethical Hacking & Penetration Testing", "Security Tools (Firewalls, IDS/IPS)", "Incident Response & Forensics"],
        nexus: [
            { name: "John Hammond", icon: "fa-brands fa-youtube", desc: "Cybersecurity Education", link: "https://www.youtube.com/@_JohnHammond" },
            { name: "OWASP", icon: "fa-solid fa-shield-halved", desc: "Web App Security", link: "https://owasp.org/" },
            { name: "TryHackMe", icon: "fa-solid fa-terminal", desc: "Practical Hacking Labs", link: "https://tryhackme.com/" }
        ]
    },
    data: {
        title: "AI / Machine Learning Engineer",
        tasks: ["Python for Data Science", "Statistics & Probability", "Machine Learning Algorithms", "Deep Learning with TensorFlow/PyTorch", "Data Engineering & Big Data"],
        nexus: [
            { name: "Andrew Ng", icon: "fa-brands fa-youtube", desc: "Machine Learning Pioneer", link: "https://www.youtube.com/@AndrewNgML" },
            { name: "Coursera ML Course", icon: "fa-solid fa-graduation-cap", desc: "Comprehensive Learning", link: "https://www.coursera.org/learn/machine-learning" },
            { name: "Kaggle", icon: "fa-solid fa-chart-line", desc: "Data Science Competitions", link: "https://www.kaggle.com/" }
        ]
    }
};

let state = JSON.parse(localStorage.getItem('PF_STATE')) || {
    xp: 0,
    level: 1,
    completedTasks: {},
    currentPath: null,
    startTime: null,
    totalTimeSpent: 0
};

window.onload = () => {
    updateUI();
    if(localStorage.getItem('PF_THEME') === 'light') toggleTheme(false);
};

function navigate(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(id).classList.remove('hidden');
    document.getElementById('nav-' + id).classList.add('active');
}

function generatePath() {
    const choice = document.getElementById('career-choice').value;
    const path = DB[choice];
    
    const roadmap = document.getElementById('roadmap-content');
    roadmap.innerHTML = `
        <div class="card">
            <h2 class="text-gradient">${path.title}</h2>
            <div style="margin-top: 2rem">
                ${path.tasks.map((t, i) => `
                    <div class="task-box">
                        <input type="checkbox" onchange="earnXP(25)" id="task-${i}">
                        <label for="task-${i}">${t}</label>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    const nexus = document.getElementById('nexus-grid');
    nexus.innerHTML = path.nexus.map(n => `
        <div class="card" style="text-align: center; padding: 3rem">
            <i class="${n.icon}" style="font-size: 3rem; margin-bottom: 1.5rem; color: var(--primary)"></i>
            <h3>${n.name}</h3>
            <p style="color: var(--muted); margin-top: 10px">${n.desc}</p>
        </div>
    `).join('');

    navigate('roadmap');
}

function completeTask(path, taskIndex) {
    if(!state.completedTasks[path]) state.completedTasks[path] = {};
    state.completedTasks[path][taskIndex] = !state.completedTasks[path][taskIndex];

    const xpGain = state.completedTasks[path][taskIndex] ? 25 : -25;
    earnXP(xpGain);
    updateProgressDashboard();
}

function earnXP(amt) {
    state.xp += amt;
    if(state.xp >= 100) {
        state.xp = 0;
        state.level++;
        alert("✨ LEVEL UP: You are now a Level " + state.level + " Architect!");
    } else if(state.xp < 0) {
        state.xp = 0;
    }
    updateUI();
    localStorage.setItem('PF_STATE', JSON.stringify(state));
}

function updateUI() {
    document.getElementById('xp-fill').style.width = state.xp + '%';
    document.getElementById('level-label').innerText = 'Lvl. ' + (state.level < 10 ? '0' + state.level : state.level);
}

function toggleTheme(shouldToggle = true) {
    if(shouldToggle) document.body.classList.toggle('light-theme');
    localStorage.setItem('PF_THEME', document.body.classList.contains('light-theme') ? 'light' : 'dark');
}

// Quiz functionality
function selectQuizOption(value) {
    document.getElementById('quiz-question').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    const path = DB[value];
    document.getElementById('recommended-path').textContent = path.title;
    localStorage.setItem('PF_RECOMMENDED', value);
}

function startRecommendedPath() {
    const recommended = localStorage.getItem('PF_RECOMMENDED');
    if(recommended) {
        document.getElementById('career-choice').value = recommended;
        navigate('planner');
    }
}

// Progress Dashboard
function updateProgressDashboard() {
    document.getElementById('total-xp').textContent = state.xp;
    document.getElementById('current-level').textContent = state.level;
    document.getElementById('time-spent').textContent = Math.floor(state.totalTimeSpent / 3600) + 'h';

    let totalCompleted = 0;
    Object.values(state.completedTasks).forEach(pathTasks => {
        totalCompleted += Object.values(pathTasks).filter(Boolean).length;
    });
    document.getElementById('completed-tasks').textContent = totalCompleted;

    // Update path progress
    const pathProgress = document.getElementById('path-progress');
    pathProgress.innerHTML = Object.keys(DB).map(path => {
        const completed = state.completedTasks[path] ? Object.values(state.completedTasks[path]).filter(Boolean).length : 0;
        const total = DB[path].tasks.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return `
            <div class="path-progress-item">
                <span>${DB[path].title}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <span>${completed}/${total}</span>
            </div>
        `;
    }).join('');

    // Update achievements
    const achievements = document.getElementById('achievements-list');
    const achievementList = [];
    if(state.level >= 5) achievementList.push('🏆 Level 5 Architect');
    if(totalCompleted >= 10) achievementList.push('🎯 Task Master');
    if(Object.keys(state.completedTasks).length >= 2) achievementList.push('🌟 Path Explorer');
    achievements.innerHTML = achievementList.length > 0 ?
        achievementList.map(a => `<div class="achievement">${a}</div>`).join('') :
        '<p>No achievements yet. Keep learning!</p>';
}

// Social Sharing
function shareRoadmap(platform) {
    const currentPath = document.querySelector('#roadmap-content h2')?.textContent || 'My Career Path';
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out my career path: ${currentPath} - Built with PathFinder AI!`);

    let shareUrl;
    switch(platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
    }

    if(shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function exportRoadmap() {
    const content = document.getElementById('roadmap-content').innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-career-roadmap.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize quiz event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.quiz-option').forEach(button => {
        button.addEventListener('click', () => selectQuizOption(button.dataset.value));
    });

    // Initialize progress dashboard when navigating to progress
    document.getElementById('nav-progress').addEventListener('click', updateProgressDashboard);
});
