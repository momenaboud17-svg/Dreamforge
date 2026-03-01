// ==================== DreamForge - ملف JavaScript الرئيسي ====================
// نسخة متقدمة مع تفاصيل دقيقة لتصميم المدينة وتأثيراتها البصرية

// ==================== البيانات الأساسية ====================
const APP_VERSION = '2.0.0';
const STORAGE_KEY = 'dreamForgeData_v2';

let userData = {
    version: APP_VERSION,
    dream: null,
    dreamCustomImage: null,
    level: 1,
    xp: 0,
    totalMinutes: 0,
    totalSessions: 0,
    streak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    joinDate: new Date().toISOString(),
    sessions: [],
    achievements: [],
    unlockedAchievements: [],
    title: "المبتدئ",
    settings: {
        darkMode: true,
        notifications: true,
        sound: false,
        weatherEffects: true,
        buildingAnimation: true
    },
    cityCustomizations: {
        colorScheme: 'default',
        buildingStyle: 'modern',
        specialLandmarks: []
    },
    studyStats: {
        totalFocus: 0,
        subjectsStats: {},
        bestDay: null,
        bestDayMinutes: 0
    }
};

// ==================== نظام XP والمستويات المحسن ====================
const LEVEL_SYSTEM = {
    // المستويات مع وصف دقيق للمدينة
    1: { xp: 0, name: "المستكشف", cityDesc: "أرض قاحلة", buildings: 1, lights: 0, details: "بداية الرحلة" },
    2: { xp: 100, name: "الزارع", cityDesc: "أرض محروثة", buildings: 2, lights: 1, details: "أول بذرة" },
    3: { xp: 250, name: "الحالم", cityDesc: "أساسات المدينة", buildings: 3, lights: 2, details: "وضع الأساس" },
    4: { xp: 450, name: "الباني الصغير", cityDesc: "أساسات متعددة", buildings: 4, lights: 3, details: "بداية البناء" },
    5: { xp: 700, name: "البناء", cityDesc: "بيت بسيط", buildings: 5, lights: 4, details: "أول منزل" },
    6: { xp: 1000, name: "المعماري", cityDesc: "بيوت صغيرة", buildings: 6, lights: 5, details: "حي سكني" },
    7: { xp: 1350, name: "المهندس", cityDesc: "مباني متوسطة", buildings: 7, lights: 6, details: "مركز تجاري" },
    8: { xp: 1750, name: "المخطط", cityDesc: "أبراج صغيرة", buildings: 8, lights: 7, details: "بداية الأبراج" },
    9: { xp: 2200, name: "المطور", cityDesc: "حي متكامل", buildings: 9, lights: 8, details: "منطقة سكنية" },
    10: { xp: 2700, name: "صاحب رؤية", cityDesc: "مؤسسة تعليمية", buildings: 10, lights: 9, details: "جامعة الأحلام" },
    11: { xp: 3250, name: "القائد", cityDesc: "مركز أبحاث", buildings: 11, lights: 10, details: "مختبرات علمية" },
    12: { xp: 3850, name: "المبدع", cityDesc: "مكتبة ضخمة", buildings: 12, lights: 11, details: "صرح ثقافي" },
    13: { xp: 4500, name: "المبتكر", cityDesc: "مستشفى متطور", buildings: 13, lights: 12, details: "مركز طبي" },
    14: { xp: 5200, name: "العبقري", cityDesc: "مدينة تكنولوجية", buildings: 14, lights: 13, details: "وادي السيليكون" },
    15: { xp: 5950, name: "الأسطورة", cityDesc: "مدينة متكاملة", buildings: 15, lights: 14, details: "مدينة الأحلام" },
    16: { xp: 6750, name: "الخالد", cityDesc: "مدينة مزدهرة", buildings: 16, lights: 15, details: "حركة ونشاط" },
    17: { xp: 7600, name: "العظيم", cityDesc: "عاصمة متألقة", buildings: 17, lights: 16, details: "أضواء ساطعة" },
    18: { xp: 8500, name: "الملهم", cityDesc: "مدينة المستقبل", buildings: 18, lights: 17, details: "تقنيات حديثة" },
    19: { xp: 9450, name: "الخرافي", cityDesc: "مدينة ذكية", buildings: 19, lights: 18, details: "ذكاء اصطناعي" },
    20: { xp: 10450, name: "أسطورة الأساطير", cityDesc: "مدينة مستقبلية", buildings: 20, lights: 19, details: "مدينة النور" },
    25: { xp: 15000, name: "حكيم الزمان", cityDesc: "مدينة ضوئية", buildings: 22, lights: 22, details: "أضواء النيون" },
    30: { xp: 20000, name: "نبي المستقبل", cityDesc: "مدينة فضائية", buildings: 25, lights: 25, details: "محطات فضائية" },
    35: { xp: 26000, name: "إله الإبداع", cityDesc: "مدينة الأحلام الكبرى", buildings: 28, lights: 28, details: "عجائب الدنيا" },
    40: { xp: 33000, name: "أسطورة الزمان", cityDesc: "مدينة خيالية", buildings: 32, lights: 32, details: "قلاع طائرة" },
    45: { xp: 41000, name: "خالق العوالم", cityDesc: "عالم متكامل", buildings: 36, lights: 36, details: "عجائب سبع" },
    50: { xp: 50000, name: "المطلق", cityDesc: "الجنة الشخصية", buildings: 40, lights: 40, details: "فردوس الأحلام" }
};

// ==================== نظام الإنجازات المتقدم ====================
const ACHIEVEMENTS = [
    {
        id: 'first_session',
        name: 'البداية',
        desc: 'أول جلسة مذاكرة',
        icon: '🌱',
        condition: (data) => data.sessions.length >= 1,
        xpReward: 50,
        hidden: false
    },
    {
        id: 'streak_3',
        name: 'المواظب',
        desc: '3 أيام متتالية',
        icon: '🔥',
        condition: (data) => data.streak >= 3,
        xpReward: 100,
        hidden: false
    },
    {
        id: 'streak_7',
        name: 'المثابر',
        desc: 'أسبوع كامل',
        icon: '⚡',
        condition: (data) => data.streak >= 7,
        xpReward: 200,
        hidden: false
    },
    {
        id: 'streak_30',
        name: 'البطل',
        desc: 'شهر كامل بدون انقطاع',
        icon: '🏆',
        condition: (data) => data.streak >= 30,
        xpReward: 500,
        hidden: false
    },
    {
        id: 'streak_100',
        name: 'الأسطورة',
        desc: '100 يوم متتالية',
        icon: '👑',
        condition: (data) => data.streak >= 100,
        xpReward: 1000,
        hidden: false
    },
    {
        id: 'hours_10',
        name: 'المجتهد',
        desc: '10 ساعات دراسة',
        icon: '📚',
        condition: (data) => data.totalMinutes >= 600,
        xpReward: 100,
        hidden: false
    },
    {
        id: 'hours_50',
        name: 'العالم',
        desc: '50 ساعة دراسة',
        icon: '🔬',
        condition: (data) => data.totalMinutes >= 3000,
        xpReward: 250,
        hidden: false
    },
    {
        id: 'hours_100',
        name: 'العبقري',
        desc: '100 ساعة دراسة (الشارة الذهبية)',
        icon: '🥇',
        condition: (data) => data.totalMinutes >= 6000,
        xpReward: 500,
        hidden: false
    },
    {
        id: 'hours_500',
        name: 'الخالد',
        desc: '500 ساعة دراسة',
        icon: '🏅',
        condition: (data) => data.totalMinutes >= 30000,
        xpReward: 1000,
        hidden: false
    },
    {
        id: 'hours_1000',
        name: 'أسطورة الزمن',
        desc: '1000 ساعة دراسة',
        icon: '⏳',
        condition: (data) => data.totalMinutes >= 60000,
        xpReward: 2000,
        hidden: false
    },
    {
        id: 'level_5',
        name: 'الباني',
        desc: 'الوصول للمستوى 5',
        icon: '🏗️',
        condition: (data) => data.level >= 5,
        xpReward: 150,
        hidden: false
    },
    {
        id: 'level_10',
        name: 'المهندس العظيم',
        desc: 'الوصول للمستوى 10',
        icon: '🏛️',
        condition: (data) => data.level >= 10,
        xpReward: 300,
        hidden: false
    },
    {
        id: 'level_20',
        name: 'صانع المدن',
        desc: 'الوصول للمستوى 20',
        icon: '🌆',
        condition: (data) => data.level >= 20,
        xpReward: 600,
        hidden: false
    },
    {
        id: 'level_30',
        name: 'حضارة',
        desc: 'الوصول للمستوى 30',
        icon: '🌃',
        condition: (data) => data.level >= 30,
        xpReward: 1000,
        hidden: false
    },
    {
        id: 'level_40',
        name: 'إمبراطورية',
        desc: 'الوصول للمستوى 40',
        icon: '🏰',
        condition: (data) => data.level >= 40,
        xpReward: 1500,
        hidden: false
    },
    {
        id: 'level_50',
        name: 'الجنة',
        desc: 'الوصول للمستوى 50',
        icon: '🌈',
        condition: (data) => data.level >= 50,
        xpReward: 2000,
        hidden: false
    },
    {
        id: 'focus_master',
        name: 'سيد التركيز',
        desc: '10 جلسات بتركيز 5',
        icon: '🧠',
        condition: (data) => data.sessions.filter(s => s.focus === 5).length >= 10,
        xpReward: 300,
        hidden: false
    },
    {
        id: 'hard_worker',
        name: 'محارب الصعاب',
        desc: '20 جلسة بصعوبة صعب',
        icon: '⚔️',
        condition: (data) => data.sessions.filter(s => s.difficulty === 'صعب').length >= 20,
        xpReward: 400,
        hidden: false
    },
    {
        id: 'subject_master',
        name: 'خبير المواد',
        desc: 'دراسة 5 مواد مختلفة',
        icon: '📖',
        condition: (data) => {
            const subjects = new Set(data.sessions.map(s => s.subject));
            return subjects.size >= 5;
        },
        xpReward: 200,
        hidden: false
    },
    {
        id: 'night_owl',
        name: 'بومة الليل',
        desc: '10 جلسات بعد منتصف الليل',
        icon: '🦉',
        condition: (data) => {
            const nightSessions = data.sessions.filter(s => {
                const hour = new Date(s.date).getHours();
                return hour >= 0 && hour < 5;
            });
            return nightSessions.length >= 10;
        },
        xpReward: 250,
        hidden: true
    },
    {
        id: 'perfect_day',
        name: 'اليوم المثالي',
        desc: '8 ساعات في يوم واحد',
        icon: '⭐',
        condition: (data) => {
            const sessionsByDay = {};
            data.sessions.forEach(s => {
                const day = s.date.split('T')[0];
                sessionsByDay[day] = (sessionsByDay[day] || 0) + s.minutes;
            });
            return Object.values(sessionsByDay).some(min => min >= 480);
        },
        xpReward: 500,
        hidden: false
    }
];

// ==================== عناصر DOM ====================
const splashScreen = document.getElementById('splash-screen');
const dreamSelectionScreen = document.getElementById('dream-selection-screen');
const mainScreen = document.getElementById('main-screen');
const sessionScreen = document.getElementById('session-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const achievementsScreen = document.getElementById('achievements-screen');
const profileScreen = document.getElementById('profile-screen');

// عناصر شاشة اختيار الحلم
const dreamPreview = document.getElementById('dream-preview');
const customDreamInput = document.getElementById('custom-dream-input');
const setCustomDreamBtn = document.getElementById('set-custom-dream-btn');
const dreamCards = document.querySelectorAll('.dream-card');

// عناصر الشاشة الرئيسية
const dreamTitleSpan = document.getElementById('dream-title');
const levelValueSpan = document.getElementById('level-value');
const userTitleSpan = document.getElementById('user-title');
const streakValueSpan = document.getElementById('streak-value');
const xpCurrentSpan = document.getElementById('xp-current');
const xpMaxSpan = document.getElementById('xp-max');
const xpProgressDiv = document.getElementById('xp-progress');
const xpPercentSpan = document.getElementById('xp-percent');
const nextLevelSpan = document.getElementById('next-level');
const xpNeededSpan = document.getElementById('xp-needed');
const totalHoursMiniSpan = document.getElementById('total-hours-mini');
const streakMiniSpan = document.getElementById('streak-mini');
const achievementsCountSpan = document.getElementById('achievements-count');
const reminderText = document.getElementById('reminder-text');
const refreshReminderBtn = document.getElementById('refresh-reminder');
const cityCanvas = document.getElementById('city-canvas');
const ctx = cityCanvas.getContext('2d');
const weatherDiv = document.getElementById('weather-effect');
const cityLevelSpan = document.getElementById('city-level');
const cityTimeSpan = document.getElementById('city-time');

// أزرار الإجراءات
const addSessionBtn = document.getElementById('add-session-btn');
const viewDashboardBtn = document.getElementById('view-dashboard-btn');
const viewAchievementsBtn = document.getElementById('view-achievements-btn');
const quickSessionBtn = document.getElementById('quick-session-btn');
const navItems = document.querySelectorAll('.nav-item');

// عناصر شاشة تسجيل الجلسة
const sessionForm = document.getElementById('session-form');
const subjectInput = document.getElementById('subject');
const minutesInput = document.getElementById('minutes');
const focusInput = document.getElementById('focus');
const focusValueSpan = document.getElementById('focus-value');
const sessionNotes = document.getElementById('session-notes');
const previewTimeXp = document.getElementById('preview-time-xp');
const previewDifficultyXp = document.getElementById('preview-difficulty-xp');
const previewFocusXp = document.getElementById('preview-focus-xp');
const previewStreakXp = document.getElementById('preview-streak-xp');
const previewTotalXp = document.getElementById('preview-total-xp');
const sessionBackBtn = document.getElementById('session-back-btn');
const cancelSessionBtn = document.getElementById('cancel-session-btn');

// عناصر لوحة التحكم
const totalHoursSpan = document.getElementById('total-hours');
const avgFocusSpan = document.getElementById('avg-focus');
const bestSubjectSpan = document.getElementById('best-subject');
const weakestSubjectSpan = document.getElementById('weakest-subject');
const dreamProgressBar = document.getElementById('dream-progress-bar');
const dreamPercentSpan = document.getElementById('dream-percent');
const currentLevelProgressSpan = document.getElementById('current-level-progress');
const subjectsListDiv = document.getElementById('subjects-list');
const streakDaysSpan = document.getElementById('streak-days');
const streakCalendarDiv = document.getElementById('streak-calendar');
const dashboardBackBtn = document.getElementById('dashboard-back-btn');
const refreshDashboardBtn = document.getElementById('refresh-dashboard');

// عناصر شاشة الإنجازات
const achievementsUnlockedSpan = document.getElementById('achievements-unlocked');
const achievementsTotalSpan = document.getElementById('achievements-total');
const achievementsProgressBar = document.getElementById('achievements-progress-bar');
const achievementsGridDiv = document.getElementById('achievements-grid');
const achievementsBackBtn = document.getElementById('achievements-back-btn');

// عناصر شاشة الملف الشخصي
const avatarPlaceholder = document.getElementById('avatar-placeholder');
const profileNameSpan = document.getElementById('profile-name');
const profileTitleSpan = document.getElementById('profile-title');
const joinDateSpan = document.getElementById('join-date');
const lastSessionSpan = document.getElementById('last-session');
const totalSessionsSpan = document.getElementById('total-sessions');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const notificationsToggle = document.getElementById('notifications-toggle');
const soundToggle = document.getElementById('sound-toggle');
const resetDataBtn = document.getElementById('reset-data-btn');
const editProfileBtn = document.getElementById('edit-profile');
const profileBackBtn = document.getElementById('profile-back-btn');

// عناصر إضافية
const toastContainer = document.getElementById('toast-container');
const confirmDialog = document.getElementById('confirm-dialog');
const dialogTitle = document.getElementById('dialog-title');
const dialogMessage = document.getElementById('dialog-message');
const dialogConfirm = document.getElementById('dialog-confirm');
const dialogCancel = document.getElementById('dialog-cancel');

// Chart.js instance
let weeklyChart = null;

// ==================== متغيرات المدينة المتقدمة ====================
let cityAnimationFrame = null;
let cityLights = [];
let cityParticles = [];
let weatherParticles = [];
let timeOfDay = 0; // 0-24 ساعة
let season = 'spring'; // spring, summer, autumn, winter
let specialEvents = [];

// ==================== دوال مساعدة ====================
function loadData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.version !== APP_VERSION) {
                // ترحيل البيانات للإصدار الجديد
                migrateData(parsed);
            } else {
                userData = parsed;
            }
        }
        
        // التأكد من وجود جميع الخصائص
        if (!userData.sessions) userData.sessions = [];
        if (!userData.achievements) userData.achievements = [];
        if (!userData.unlockedAchievements) userData.unlockedAchievements = [];
        if (!userData.studyStats) {
            userData.studyStats = {
                totalFocus: 0,
                subjectsStats: {},
                bestDay: null,
                bestDayMinutes: 0
            };
        }
        if (!userData.cityCustomizations) {
            userData.cityCustomizations = {
                colorScheme: 'default',
                buildingStyle: 'modern',
                specialLandmarks: []
            };
        }
        
        // تحديث الإنجازات
        checkAchievements();
        
    } catch (e) {
        console.error('Error loading data:', e);
        showToast('خطأ في تحميل البيانات', 'error');
    }
}

function migrateData(oldData) {
    // ترحيل البيانات من الإصدارات القديمة
    userData = {
        ...userData,
        ...oldData,
        version: APP_VERSION,
        settings: {
            ...userData.settings,
            ...(oldData.settings || {})
        },
        cityCustomizations: {
            ...userData.cityCustomizations,
            ...(oldData.cityCustomizations || {})
        },
        studyStats: {
            ...userData.studyStats,
            ...(oldData.studyStats || {})
        }
    };
    saveData();
}

function saveData() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {
        console.error('Error saving data:', e);
        showToast('خطأ في حفظ البيانات', 'error');
    }
}

function showToast(message, type = 'info', title = '') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <i class="toast-icon">${icons[type] || 'ℹ️'}</i>
        <div class="toast-content">
            <div class="toast-title">${title || getToastTitle(type)}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function getToastTitle(type) {
    const titles = {
        success: 'أحسنت!',
        error: 'خطأ',
        warning: 'تنبيه',
        info: 'معلومة'
    };
    return titles[type] || 'تنبيه';
}

function showConfirm(title, message, onConfirm) {
    dialogTitle.textContent = title;
    dialogMessage.textContent = message;
    confirmDialog.classList.remove('hidden');
    
    const handleConfirm = () => {
        confirmDialog.classList.add('hidden');
        onConfirm();
        dialogConfirm.removeEventListener('click', handleConfirm);
        dialogCancel.removeEventListener('click', handleCancel);
    };
    
    const handleCancel = () => {
        confirmDialog.classList.add('hidden');
        dialogConfirm.removeEventListener('click', handleConfirm);
        dialogCancel.removeEventListener('click', handleCancel);
    };
    
    dialogConfirm.addEventListener('click', handleConfirm);
    dialogCancel.addEventListener('click', handleCancel);
}

// ==================== نظام المستويات المحسن ====================
function getLevelData(level) {
    // البحث عن المستوى في النظام
    const exactLevel = LEVEL_SYSTEM[level];
    if (exactLevel) return exactLevel;
    
    // إذا لم يكن المستوى موجوداً، نحسب القيم تقريبياً
    const baseXP = getXPForLevel(level);
    return {
        xp: baseXP,
        name: `المستوى ${level}`,
        cityDesc: `مدينة المستوى ${level}`,
        buildings: Math.min(40, Math.floor(level * 0.8) + 1),
        lights: Math.min(40, Math.floor(level * 0.8)),
        details: `تطور المستوى ${level}`
    };
}

function getXPForLevel(level) {
    if (LEVEL_SYSTEM[level]) return LEVEL_SYSTEM[level].xp;
    
    // معادلة تقريبية للمستويات العالية
    if (level > 50) {
        return 50000 + (level - 50) * 2000;
    }
    
    // إيجاد أقرب مستوى معروف
    const levels = Object.keys(LEVEL_SYSTEM).map(Number).sort((a, b) => a - b);
    let prevLevel = 1;
    for (const lvl of levels) {
        if (lvl > level) break;
        prevLevel = lvl;
    }
    
    const nextLevel = levels.find(l => l > level) || 50;
    const prevXP = LEVEL_SYSTEM[prevLevel].xp;
    const nextXP = LEVEL_SYSTEM[nextLevel].xp;
    const step = (nextXP - prevXP) / (nextLevel - prevLevel);
    
    return Math.floor(prevXP + step * (level - prevLevel));
}

function calculateLevel(xp) {
    for (let level = 50; level >= 1; level--) {
        if (getXPForLevel(level) <= xp) {
            return level;
        }
    }
    return 1;
}

// ==================== نظام الإنجازات ====================
function checkAchievements() {
    let newAchievements = [];
    
    ACHIEVEMENTS.forEach(achievement => {
        if (!userData.unlockedAchievements.includes(achievement.id)) {
            if (achievement.condition(userData)) {
                unlockAchievement(achievement);
                newAchievements.push(achievement);
            }
        }
    });
    
    if (newAchievements.length > 0) {
        updateAchievementsUI();
    }
}

function unlockAchievement(achievement) {
    userData.unlockedAchievements.push(achievement.id);
    userData.achievements.push(achievement.name);
    
    // إضافة XP كمكافأة
    if (achievement.xpReward) {
        addXP(achievement.xpReward, false); // false يعني لا تتحقق الإنجازات مرة أخرى
    }
    
    // عرض إشعار
    showToast(`حصلت على إنجاز: ${achievement.name}`, 'success', '🎉 إنجاز جديد!');
    
    // إضافة تأثير بصري
    addAchievementEffect(achievement);
}

function addAchievementEffect(achievement) {
    // إضافة تأثير احتفالي في المدينة
    specialEvents.push({
        type: 'achievement',
        achievement: achievement,
        time: Date.now(),
        duration: 5000
    });
}

function updateAchievementsUI() {
    if (!achievementsScreen.classList.contains('hidden')) {
        renderAchievements();
    }
    
    // تحديث عداد الإنجازات في الصفحة الرئيسية
    if (achievementsCountSpan) {
        achievementsCountSpan.textContent = userData.unlockedAchievements.length;
    }
}

function renderAchievements() {
    if (!achievementsGridDiv) return;
    
    achievementsGridDiv.innerHTML = '';
    const unlocked = userData.unlockedAchievements;
    
    ACHIEVEMENTS.forEach(achievement => {
        const isUnlocked = unlocked.includes(achievement.id);
        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.desc}</div>
            ${achievement.xpReward ? `<div class="achievement-points">+${achievement.xpReward} XP</div>` : ''}
        `;
        
        achievementsGridDiv.appendChild(card);
    });
    
    // تحديث الإحصائيات
    achievementsUnlockedSpan.textContent = unlocked.length;
    achievementsTotalSpan.textContent = ACHIEVEMENTS.length;
    const percent = (unlocked.length / ACHIEVEMENTS.length) * 100;
    achievementsProgressBar.style.width = percent + '%';
}

// ==================== نظام XP ====================
function addXP(amount, checkAchievementsFlag = true) {
    userData.xp += amount;
    
    // حساب المستوى الجديد
    const newLevel = calculateLevel(userData.xp);
    if (newLevel > userData.level) {
        const oldLevel = userData.level;
        userData.level = newLevel;
        
        // تأثير رفع المستوى
        onLevelUp(oldLevel, newLevel);
    }
    
    // تحديث اللقب
    updateTitle();
    
    if (checkAchievementsFlag) {
        checkAchievements();
    }
    
    saveData();
    updateUI();
}

function onLevelUp(oldLevel, newLevel) {
    // تأثيرات رفع المستوى
    showToast(`تهانينا! وصلت للمستوى ${newLevel}`, 'success', '🌟 رفع مستوى!');
    
    // إضافة تأثير احتفالي في المدينة
    specialEvents.push({
        type: 'levelup',
        level: newLevel,
        time: Date.now(),
        duration: 8000
    });
    
    // إضافة إنجاز تلقائي للمستوى
    const levelAchievement = ACHIEVEMENTS.find(a => a.id === `level_${newLevel}`);
    if (levelAchievement && !userData.unlockedAchievements.includes(levelAchievement.id)) {
        unlockAchievement(levelAchievement);
    }
}

function updateTitle() {
    const levelData = getLevelData(userData.level);
    userData.title = levelData.name;
    
    if (userTitleSpan) {
        userTitleSpan.textContent = userData.title;
    }
}

// ==================== نظام الجلسات ====================
function calculateSessionXP(minutes, difficulty, focus, streak) {
    let xp = Math.floor(minutes / 30) * 50; // XP أساسي
    
    // مكافأة الصعوبة
    if (difficulty === 'صعب') {
        xp = Math.floor(xp * 1.2);
    } else if (difficulty === 'متوسط') {
        xp = Math.floor(xp * 1.1);
    }
    
    // مكافأة التركيز
    if (focus >= 4) xp += 20;
    else if (focus >= 3) xp += 10;
    
    // مكافأة السلسلة
    if (streak >= 30) xp += 50;
    else if (streak >= 14) xp += 30;
    else if (streak >= 7) xp += 20;
    else if (streak >= 3) xp += 10;
    
    return xp;
}

function handleSessionSubmit(e) {
    e.preventDefault();
    
    const subject = subjectInput.value.trim();
    const minutes = parseInt(minutesInput.value);
    const focus = parseInt(focusInput.value);
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
    const notes = sessionNotes.value.trim();
    
    if (!subject) {
        showToast('الرجاء إدخال اسم المادة', 'error');
        return;
    }
    
    if (minutes < 5 || minutes > 480) {
        showToast('الدقائق يجب أن تكون بين 5 و 480', 'error');
        return;
    }
    
    // حساب XP
    const xpEarned = calculateSessionXP(minutes, difficulty, focus, userData.streak);
    
    // تسجيل الجلسة
    const session = {
        id: Date.now(),
        date: new Date().toISOString(),
        subject,
        minutes,
        focus,
        difficulty,
        notes,
        xpEarned,
        timeOfDay: new Date().getHours()
    };
    
    userData.sessions.push(session);
    userData.totalMinutes += minutes;
    userData.totalSessions++;
    userData.studyStats.totalFocus += focus;
    
    // تحديث إحصائيات المواد
    if (!userData.studyStats.subjectsStats[subject]) {
        userData.studyStats.subjectsStats[subject] = {
            totalMinutes: 0,
            sessions: 0,
            totalFocus: 0
        };
    }
    userData.studyStats.subjectsStats[subject].totalMinutes += minutes;
    userData.studyStats.subjectsStats[subject].sessions++;
    userData.studyStats.subjectsStats[subject].totalFocus += focus;
    
    // تحديث أفضل يوم
    const today = new Date().toISOString().split('T')[0];
    const todayMinutes = getTodayMinutes();
    if (todayMinutes > (userData.studyStats.bestDayMinutes || 0)) {
        userData.studyStats.bestDay = today;
        userData.studyStats.bestDayMinutes = todayMinutes;
    }
    
    // تحديث streak
    updateStreak();
    
    // إضافة XP
    addXP(xpEarned);
    
    // إضافة تأثير بصري في المدينة
    addStudyEffect(subject, minutes, xpEarned);
    
    showToast(`تم تسجيل الجلسة بنجاح! +${xpEarned} XP`, 'success');
    
    // العودة للشاشة الرئيسية
    showMainScreen();
    
    // إعادة تعيين النموذج
    sessionForm.reset();
    minutesInput.value = 30;
    focusInput.value = 3;
    focusValueSpan.textContent = '3/5';
    updateXpPreview();
}

function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    
    if (!userData.lastStudyDate) {
        userData.streak = 1;
    } else if (userData.lastStudyDate === today) {
        // تم التسجيل اليوم بالفعل، لا تغيير
    } else {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (userData.lastStudyDate === yesterday) {
            userData.streak++;
        } else {
            userData.streak = 1;
        }
    }
    
    userData.lastStudyDate = today;
    
    // تحديث أطول سلسلة
    if (userData.streak > userData.longestStreak) {
        userData.longestStreak = userData.streak;
    }
}

function getTodayMinutes() {
    const today = new Date().toISOString().split('T')[0];
    return userData.sessions
        .filter(s => s.date.split('T')[0] === today)
        .reduce((sum, s) => sum + s.minutes, 0);
}

function addStudyEffect(subject, minutes, xp) {
    // إضافة تأثير بصري للمدينة عند الدراسة
    cityParticles.push({
        x: Math.random() * cityCanvas.width,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: 1,
        type: 'study',
        value: `+${xp}`,
        life: 100
    });
}

// ==================== تحديث الواجهة ====================
function updateUI() {
    if (!userData.dream) {
        showDreamSelection();
        return;
    }
    
    // تحديث معلومات المستخدم
    if (dreamTitleSpan) dreamTitleSpan.textContent = userData.dream;
    if (levelValueSpan) levelValueSpan.textContent = userData.level;
    if (userTitleSpan) userTitleSpan.textContent = userData.title;
    if (streakValueSpan) streakValueSpan.textContent = userData.streak;
    
    // تحديث شريط XP
    const currentLevelXP = getXPForLevel(userData.level);
    const nextLevelXP = getXPForLevel(userData.level + 1) || (currentLevelXP + 1000);
    const xpInCurrentLevel = userData.xp - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;
    const percent = Math.min(100, Math.round((xpInCurrentLevel / xpNeeded) * 100));
    
    if (xpCurrentSpan) xpCurrentSpan.textContent = userData.xp;
    if (xpMaxSpan) xpMaxSpan.textContent = nextLevelXP;
    if (xpProgressDiv) xpProgressDiv.style.width = percent + '%';
    if (xpPercentSpan) xpPercentSpan.textContent = percent + '%';
    if (nextLevelSpan) nextLevelSpan.textContent = userData.level + 1;
    if (xpNeededSpan) xpNeededSpan.textContent = xpNeeded - xpInCurrentLevel;
    
    // تحديث الإحصائيات السريعة
    if (totalHoursMiniSpan) {
        const hours = (userData.totalMinutes / 60).toFixed(1);
        totalHoursMiniSpan.textContent = hours;
    }
    if (streakMiniSpan) streakMiniSpan.textContent = userData.streak;
    if (achievementsCountSpan) {
        achievementsCountSpan.textContent = userData.unlockedAchievements.length;
    }
    
    // تحديث المدينة
    drawCity();
    
    // تحديث تأثيرات الطقس
    updateWeatherEffect();
    
    // تحديث التذكير
    updateReminder();
}

function showDreamSelection() {
    splashScreen.classList.add('hidden');
    dreamSelectionScreen.classList.remove('hidden');
    mainScreen.classList.add('hidden');
    sessionScreen.classList.add('hidden');
    dashboardScreen.classList.add('hidden');
    achievementsScreen.classList.add('hidden');
    profileScreen.classList.add('hidden');
}

function showMainScreen() {
    splashScreen.classList.add('hidden');
    dreamSelectionScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    sessionScreen.classList.add('hidden');
    dashboardScreen.classList.add('hidden');
    achievementsScreen.classList.add('hidden');
    profileScreen.classList.add('hidden');
    
    // تحديث التنقل النشط
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.screen === 'main') {
            item.classList.add('active');
        }
    });
    
    updateUI();
}

function showSessionScreen() {
    splashScreen.classList.add('hidden');
    dreamSelectionScreen.classList.add('hidden');
    mainScreen.classList.add('hidden');
    sessionScreen.classList.remove('hidden');
    dashboardScreen.classList.add('hidden');
    achievementsScreen.classList.add('hidden');
    profileScreen.classList.add('hidden');
    
    // إعادة تعيين النموذج
    sessionForm.reset();
    minutesInput.value = 30;
    focusInput.value = 3;
    focusValueSpan.textContent = '3/5';
    updateXpPreview();
}

function showDashboard() {
    splashScreen.classList.add('hidden');
    dreamSelectionScreen.classList.add('hidden');
    mainScreen.classList.add('hidden');
    sessionScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
    achievementsScreen.classList.add('hidden');
    profileScreen.classList.add('hidden');
    
    // تحديث التنقل النشط
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.screen === 'dashboard') {
            item.classList.add('active');
        }
    });
    
    updateDashboard();
}

function showAchievements() {
    splashScreen.classList.add('hidden');
    dreamSelectionScreen.classList.add('hidden');
    mainScreen.classList.add('hidden');
    sessionScreen.classList.add('hidden');
    dashboardScreen.classList.add('hidden');
    achievementsScreen.classList.remove('hidden');
    profileScreen.classList.add('hidden');
    
    // تحديث التنقل النشط
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.screen === 'achievements') {
            item.classList.add('active');
        }
    });
    
    renderAchievements();
}

function showProfile() {
    splashScreen.classList.add('hidden');
    dreamSelectionScreen.classList.add('hidden');
    mainScreen.classList.add('hidden');
    sessionScreen.classList.add('hidden');
    dashboardScreen.classList.add('hidden');
    achievementsScreen.classList.add('hidden');
    profileScreen.classList.remove('hidden');
    
    // تحديث التنقل النشط
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.screen === 'profile') {
            item.classList.add('active');
        }
    });
    
    updateProfile();
}

// ==================== تحديث لوحة التحكم ====================
function updateDashboard() {
    // إحصائيات عامة
    const totalHours = (userData.totalMinutes / 60).toFixed(1);
    totalHoursSpan.textContent = totalHours;
    
    const avgFocus = userData.sessions.length ?
        (userData.studyStats.totalFocus / userData.sessions.length).toFixed(1) : 0;
    avgFocusSpan.textContent = avgFocus;
    
    // أفضل وأضعف مادة
    const subjects = userData.studyStats.subjectsStats;
    let bestSubject = null;
    let worstSubject = null;
    
    for (const [subject, stats] of Object.entries(subjects)) {
        const avgFocus = stats.totalFocus / stats.sessions;
        
        if (!bestSubject || avgFocus > bestSubject.avgFocus) {
            bestSubject = { name: subject, avgFocus, totalMinutes: stats.totalMinutes };
        }
        if (!worstSubject || avgFocus < worstSubject.avgFocus) {
            worstSubject = { name: subject, avgFocus, totalMinutes: stats.totalMinutes };
        }
    }
    
    bestSubjectSpan.textContent = bestSubject ? bestSubject.name : '-';
    weakestSubjectSpan.textContent = worstSubject ? worstSubject.name : '-';
    
    // نسبة تقدم الحلم
    const dreamPercent = Math.min(100, Math.round((userData.level / 50) * 100));
    dreamProgressBar.style.width = dreamPercent + '%';
    dreamPercentSpan.textContent = dreamPercent + '%';
    currentLevelProgressSpan.textContent = userData.level;
    
    // قائمة المواد
    renderSubjectsList();
    
    // سلسلة الأيام
    streakDaysSpan.textContent = userData.streak;
    renderStreakCalendar();
    
    // الرسم البياني
    updateWeeklyChart();
}

function renderSubjectsList() {
    if (!subjectsListDiv) return;
    
    subjectsListDiv.innerHTML = '';
    const subjects = userData.studyStats.subjectsStats;
    
    const sortedSubjects = Object.entries(subjects)
        .sort((a, b) => b[1].totalMinutes - a[1].totalMinutes);
    
    sortedSubjects.forEach(([subject, stats]) => {
        const avgFocus = (stats.totalFocus / stats.sessions).toFixed(1);
        const hours = (stats.totalMinutes / 60).toFixed(1);
        
        const item = document.createElement('div');
        item.className = 'subject-item';
        item.innerHTML = `
            <span class="subject-name">${subject}</span>
            <div class="subject-stats">
                <span><i class="fas fa-clock"></i> ${hours} س</span>
                <span><i class="fas fa-brain"></i> ${avgFocus}</span>
                <span><i class="fas fa-layer-group"></i> ${stats.sessions} جلسة</span>
            </div>
        `;
        
        subjectsListDiv.appendChild(item);
    });
}

function renderStreakCalendar() {
    if (!streakCalendarDiv) return;
    
    streakCalendarDiv.innerHTML = '';
    const today = new Date();
    
    // عرض آخر 7 أيام
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // التحقق إذا كان هناك جلسة في هذا اليوم
        const hasSession = userData.sessions.some(s => s.date.split('T')[0] === dateStr);
        
        const dayDiv = document.createElement('div');
        dayDiv.className = `calendar-day ${hasSession ? 'active' : ''}`;
        dayDiv.textContent = date.getDate();
        
        streakCalendarDiv.appendChild(dayDiv);
    }
}

function updateWeeklyChart() {
    // تجهيز بيانات آخر 7 أيام
    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        last7Days.push(d.toISOString().split('T')[0]);
    }
    
    const studyMinutesPerDay = Array(7).fill(0);
    userData.sessions.forEach(s => {
        const sessionDate = s.date.split('T')[0];
        const index = last7Days.indexOf(sessionDate);
        if (index !== -1) {
            studyMinutesPerDay[index] += s.minutes;
        }
    });
    
    // تحويل الدقائق إلى ساعات للرسم البياني
    const studyHoursPerDay = studyMinutesPerDay.map(m => (m / 60).toFixed(1));
    
    const ctx = document.getElementById('weekly-chart')?.getContext('2d');
    if (!ctx) return;
    
    if (weeklyChart) weeklyChart.destroy();
    
    weeklyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['منذ 6 أيام', 'منذ 5 أيام', 'منذ 4 أيام', 'منذ 3 أيام', 'قبل يومين', 'الأمس', 'اليوم'],
            datasets: [{
                label: 'ساعات الدراسة',
                data: studyHoursPerDay,
                borderColor: '#27ae60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#f39c12',
                pointBorderColor: '#fff',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return `${context.raw} ساعة`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'ساعات'
                    },
                    ticks: {
                        callback: (value) => value + ' س'
                    }
                }
            }
        }
    });
}

// ==================== تحديث الملف الشخصي ====================
function updateProfile() {
    if (avatarPlaceholder) {
        // اختيار رمز تعبيري بناءً على الحلم
        const dreamIcons = {
            'طبيب': '👨‍⚕️',
            'مهندس': '👷',
            'مبرمج': '💻',
            'عالم': '🔬',
            'كاتب': '✍️'
        };
        avatarPlaceholder.textContent = dreamIcons[userData.dream] || '🚀';
    }
    
    if (profileNameSpan) {
        profileNameSpan.textContent = userData.dream || 'الباني';
    }
    
    if (profileTitleSpan) {
        profileTitleSpan.textContent = userData.title;
    }
    
    if (joinDateSpan) {
        const joinDate = new Date(userData.joinDate);
        joinDateSpan.textContent = joinDate.toLocaleDateString('ar-EG');
    }
    
    if (lastSessionSpan) {
        if (userData.sessions.length > 0) {
            const lastDate = new Date(userData.sessions[userData.sessions.length - 1].date);
            lastSessionSpan.textContent = lastDate.toLocaleDateString('ar-EG');
        } else {
            lastSessionSpan.textContent = 'لا توجد جلسات';
        }
    }
    
    if (totalSessionsSpan) {
        totalSessionsSpan.textContent = userData.totalSessions;
    }
    
    // تحديث الإعدادات
    if (darkModeToggle) darkModeToggle.checked = userData.settings.darkMode;
    if (notificationsToggle) notificationsToggle.checked = userData.settings.notifications;
    if (soundToggle) soundToggle.checked = userData.settings.sound;
}

// ==================== تصميم المدينة المتقدم ====================
function drawCity() {
    if (!ctx || !cityCanvas) return;
    
    // مسح الرسمة السابقة
    ctx.clearRect(0, 0, cityCanvas.width, cityCanvas.height);
    
    // تحديث وقت اليوم (يتغير ببطء)
    timeOfDay = (timeOfDay + 0.001) % 24;
    
    // رسم السماء حسب وقت اليوم
    drawSky();
    
    // رسم السحب
    drawClouds();
    
    // رسم النجوم في الليل
    if (timeOfDay < 6 || timeOfDay > 18) {
        drawStars();
    }
    
    // رسم القمر أو الشمس
    drawSunOrMoon();
    
    // رسم التضاريس
    drawTerrain();
    
    // رسم المباني حسب المستوى والحلم
    drawBuildings();
    
    // رسم الإضاءة
    drawLights();
    
    // رسم العناصر الخاصة بالحلم
    drawDreamElements();
    
    // رسم الجسور والطرق
    drawRoadsAndBridges();
    
    // رسم الأشجار والحدائق
    drawNature();
    
    // رسم تأثيرات الطقس
    drawWeatherEffects();
    
    // رسم الجسيمات (تأثيرات الدراسة)
    drawParticles();
    
    // رسم الأحداث الخاصة
    drawSpecialEvents();
}

function drawSky() {
    // تدرج السماء حسب الوقت
    let topColor, bottomColor;
    
    if (timeOfDay < 6) { // الفجر
        topColor = '#0a0a1a';
        bottomColor = '#4a2a1a';
    } else if (timeOfDay < 8) { // شروق الشمس
        topColor = '#2a1a2a';
        bottomColor = '#c46a2a';
    } else if (timeOfDay < 16) { // النهار
        topColor = '#2a4a8a';
        bottomColor = '#8ac4e0';
    } else if (timeOfDay < 18) { // الغروب
        topColor = '#6a2a4a';
        bottomColor = '#e08a4a';
    } else { // الليل
        topColor = '#0a0a1a';
        bottomColor = '#1a2a3a';
    }
    
    const gradient = ctx.createLinearGradient(0, 0, 0, cityCanvas.height);
    gradient.addColorStop(0, topColor);
    gradient.addColorStop(1, bottomColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, cityCanvas.width, cityCanvas.height);
}

function drawStars() {
    const numStars = 50 + Math.floor(timeOfDay * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    for (let i = 0; i < numStars; i++) {
        const x = (i * 173) % cityCanvas.width;
        const y = (i * 97) % (cityCanvas.height * 0.6);
        const size = 1 + Math.sin(i) * 1.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + Math.sin(Date.now() * 0.001 + i) * 0.3})`;
        ctx.fill();
    }
}

function drawSunOrMoon() {
    const centerX = cityCanvas.width * 0.8;
    let centerY;
    
    if (timeOfDay < 6) { // القمر في الفجر
        centerY = cityCanvas.height * 0.3;
        drawMoon(centerX, centerY);
    } else if (timeOfDay < 8) { // الشمس في الشروق
        centerY = cityCanvas.height * 0.7;
        drawSun(centerX, centerY);
    } else if (timeOfDay < 16) { // الشمس في السماء
        centerY = cityCanvas.height * 0.2;
        drawSun(centerX, centerY);
    } else if (timeOfDay < 18) { // الشمس في الغروب
        centerY = cityCanvas.height * 0.7;
        drawSun(centerX, centerY, true);
    } else { // القمر في الليل
        centerY = cityCanvas.height * 0.3;
        drawMoon(centerX, centerY);
    }
}

function drawSun(x, y, isSunset = false) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 50);
    if (isSunset) {
        gradient.addColorStop(0, '#ff8c00');
        gradient.addColorStop(0.5, '#ff4500');
        gradient.addColorStop(1, '#ff0000');
    } else {
        gradient.addColorStop(0, '#ffff00');
        gradient.addColorStop(0.5, '#ffa500');
        gradient.addColorStop(1, '#ff8c00');
    }
    
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // أشعة الشمس
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const dx = Math.cos(angle) * 60;
        const dy = Math.sin(angle) * 60;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + dx, y + dy);
        ctx.stroke();
    }
}

function drawMoon(x, y) {
    // القمر
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fillStyle = '#f0f0f0';
    ctx.fill();
    
    // فوهات القمر
    ctx.fillStyle = '#d0d0d0';
    ctx.beginPath();
    ctx.arc(x - 10, y - 5, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 5, y + 8, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 12, y - 8, 3, 0, Math.PI * 2);
    ctx.fill();
}

function drawClouds() {
    if (userData.settings.weatherEffects === false) return;
    
    const numClouds = 3;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    
    for (let i = 0; i < numClouds; i++) {
        const x = (Date.now() * 0.01 + i * 200) % (cityCanvas.width + 200) - 100;
        const y = 50 + i * 40;
        
        drawCloud(x, y, 60, 30);
    }
}

function drawCloud(x, y, width, height) {
    ctx.beginPath();
    ctx.arc(x, y, height * 0.8, 0, Math.PI * 2);
    ctx.arc(x + width * 0.3, y - height * 0.2, height * 0.7, 0, Math.PI * 2);
    ctx.arc(x + width * 0.6, y, height * 0.9, 0, Math.PI * 2);
    ctx.arc(x + width, y + height * 0.2, height * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
}// ==================== الجزء الثاني: تفاصيل المدينة المتقدمة ====================

function drawTerrain() {
    const groundY = cityCanvas.height - 60;
    
    // رسم الأرض
    ctx.fillStyle = '#2d4a2d';
    ctx.fillRect(0, groundY, cityCanvas.width, 60);
    
    // رسم تفاصيل الأرض (عشب، حجارة)
    ctx.fillStyle = '#3d5a3d';
    for (let i = 0; i < cityCanvas.width; i += 20) {
        const variation = Math.sin(i * 0.1) * 5;
        ctx.fillRect(i, groundY + 50 + variation, 10, 5);
    }
    
    // رسم العشب
    ctx.strokeStyle = '#4a6a4a';
    ctx.lineWidth = 2;
    for (let i = 0; i < cityCanvas.width; i += 15) {
        const height = 10 + Math.sin(i * 0.2 + Date.now() * 0.001) * 5;
        ctx.beginPath();
        ctx.moveTo(i, groundY);
        ctx.lineTo(i - 5, groundY - height);
        ctx.lineTo(i + 5, groundY - height);
        ctx.closePath();
        ctx.fillStyle = '#3d6a3d';
        ctx.fill();
    }
}

function drawBuildings() {
    const levelData = getLevelData(userData.level);
    const numBuildings = Math.min(40, levelData.buildings);
    const groundY = cityCanvas.height - 60;
    
    // توزيع المباني بشكل غير منتظم
    const buildingPositions = [];
    for (let i = 0; i < numBuildings; i++) {
        let x;
        if (i < 10) {
            // المباني الأولى في المنتصف
            x = cityCanvas.width * 0.3 + (i * 35);
        } else {
            // المباني الأحدث تنتشر
            x = 50 + (i * 25) % (cityCanvas.width - 200);
        }
        
        // إضافة بعض العشوائية
        x += Math.sin(i) * 15;
        
        buildingPositions.push(x);
    }
    
    // رسم المباني حسب المستوى
    buildingPositions.forEach((x, index) => {
        const buildingHeight = 50 + (index * 5) + Math.sin(index) * 20;
        const buildingWidth = 30 + Math.sin(index * 2) * 10;
        const y = groundY - buildingHeight;
        
        // اختيار نمط المبنى حسب المستوى والحلم
        if (userData.level >= 20) {
            drawModernBuilding(x, y, buildingWidth, buildingHeight, index);
        } else if (userData.level >= 10) {
            drawClassicBuilding(x, y, buildingWidth, buildingHeight, index);
        } else {
            drawSimpleBuilding(x, y, buildingWidth, buildingHeight, index);
        }
        
        // إضافة تفاصيل حسب الحلم
        addDreamDetailsToBuilding(x, y, buildingWidth, buildingHeight, index);
    });
}

function drawSimpleBuilding(x, y, width, height, index) {
    // المبنى الأساسي
    const brightness = 100 + (index % 3) * 30;
    ctx.fillStyle = `hsl(210, 50%, ${brightness}%)`;
    ctx.fillRect(x, y, width, height);
    
    // السقف
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.lineTo(x + width / 2, y - 15);
    ctx.lineTo(x + width + 5, y);
    ctx.fill();
    
    // نافذة
    ctx.fillStyle = '#f1c40f';
    ctx.fillRect(x + 10, y + 20, 10, 15);
}

function drawClassicBuilding(x, y, width, height, index) {
    // مبنى كلاسيكي بتفاصيل أكثر
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, `hsl(${200 + index * 5}, 70%, 60%)`);
    gradient.addColorStop(1, `hsl(${200 + index * 5}, 70%, 40%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    
    // أعمدة زخرفية
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(x - 3, y, 3, height);
    ctx.fillRect(x + width, y, 3, height);
    
    // نوافذ متعددة
    ctx.fillStyle = '#f1c40f';
    for (let i = 0; i < 3; i++) {
        ctx.fillRect(x + 5 + i * 8, y + 20, 5, 10);
        ctx.fillRect(x + 5 + i * 8, y + 40, 5, 10);
    }
    
    // شرفة
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 5, y + height - 10, width + 10, 5);
}

function drawModernBuilding(x, y, width, height, index) {
    // مبنى حديث مع تأثيرات زجاجية
    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, `hsl(${180 + index * 10}, 80%, 70%)`);
    gradient.addColorStop(1, `hsl(${180 + index * 10}, 80%, 50%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    
    // تأثير زجاجي
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = 'white';
    ctx.fillRect(x + 5, y + 5, width - 10, height - 10);
    ctx.globalAlpha = 1;
    
    // نوافذ عصرية
    ctx.fillStyle = '#00ffff';
    for (let i = 0; i < 4; i++) {
        ctx.fillRect(x + 5 + i * 7, y + 15, 5, 20);
        ctx.fillRect(x + 5 + i * 7, y + 45, 5, 20);
    }
    
    // هوائي
    ctx.strokeStyle = '#c0c0c0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y - 5);
    ctx.lineTo(x + width / 2, y - 20);
    ctx.stroke();
}

function addDreamDetailsToBuilding(x, y, width, height, index) {
    const dream = userData.dream;
    
    // إضافة رموز خاصة بكل حلم
    if (dream === 'طبيب' && index % 3 === 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#ff0000';
        ctx.fillText('⚕️', x + 5, y - 10);
    } else if (dream === 'مهندس' && index % 4 === 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#ffa500';
        ctx.fillText('🏗️', x + 5, y - 10);
    } else if (dream === 'مبرمج' && index % 5 === 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#00ff00';
        ctx.fillText('💻', x + 5, y - 10);
    } else if (dream === 'عالم' && index % 6 === 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('🔬', x + 5, y - 10);
    } else if (dream === 'كاتب' && index % 7 === 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#f39c12';
        ctx.fillText('📖', x + 5, y - 10);
    } else if (dream === 'رائد أعمال' && index % 8 === 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#ffd700';
        ctx.fillText('💼', x + 5, y - 10);
    } else if (dream === 'فنان' && index % 9 === 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#ff69b4';
        ctx.fillText('🎨', x + 5, y - 10);
    } else if (dream === 'معلم' && index % 10 === 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#4169e1';
        ctx.fillText('👨‍🏫', x + 5, y - 10);
    } else if (dream === 'طيار' && index % 11 === 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#87ceeb';
        ctx.fillText('✈️', x + 5, y - 10);
    } else if (dream === 'محامي' && index % 12 === 0) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#808080';
        ctx.fillText('⚖️', x + 5, y - 10);
    }
}

function drawLights() {
    const levelData = getLevelData(userData.level);
    const numLights = levelData.lights;
    
    for (let i = 0; i < numLights; i++) {
        const x = 100 + (i * 50) % (cityCanvas.width - 200);
        const y = cityCanvas.height - 100 - (i % 3) * 20;
        
        // ضوء متلألئ
        const brightness = 0.5 + Math.sin(Date.now() * 0.002 + i) * 0.3;
        ctx.fillStyle = `rgba(255, 255, 200, ${brightness})`;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // هالة الضوء
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function drawRoadsAndBridges() {
    const groundY = cityCanvas.height - 60;
    
    // رسم الطرق الرئيسية
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, groundY - 5, cityCanvas.width, 5);
    
    // خطوط الطريق
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 30]);
    
    ctx.beginPath();
    ctx.moveTo(0, groundY - 2);
    ctx.lineTo(cityCanvas.width, groundY - 2);
    ctx.stroke();
    
    ctx.setLineDash([]); // إعادة تعيين
    
    // رسم جسر إذا كان المستوى عالياً
    if (userData.level >= 15) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(200, groundY - 80, 100, 20);
        
        // أعمدة الجسر
        ctx.fillStyle = '#a0522d';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(210 + i * 40, groundY - 60, 10, 60);
        }
    }
}

function drawNature() {
    const groundY = cityCanvas.height - 60;
    const levelData = getLevelData(userData.level);
    
    // عدد الأشجار يتناسب مع المستوى
    const numTrees = Math.floor(levelData.buildings / 3);
    
    for (let i = 0; i < numTrees; i++) {
        const x = 50 + (i * 70) % (cityCanvas.width - 150);
        drawTree(x, groundY - 20);
    }
    
    // حدائق
    if (userData.level >= 10) {
        ctx.fillStyle = '#2e8b57';
        ctx.fillRect(400, groundY - 30, 150, 30);
        
        // زهور
        for (let i = 0; i < 5; i++) {
            const fx = 420 + i * 25;
            drawFlower(fx, groundY - 35);
        }
    }
}

function drawTree(x, y) {
    // جذع الشجرة
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 5, y - 30, 10, 40);
    
    // أوراق الشجرة
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(x, y - 40, 20, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x - 12, y - 50, 15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 12, y - 50, 15, 0, Math.PI * 2);
    ctx.fill();
}

function drawFlower(x, y) {
    // ساق الزهرة
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 15);
    ctx.stroke();
    
    // بتلات الزهرة
    ctx.fillStyle = '#ff69b4';
    ctx.beginPath();
    ctx.arc(x - 3, y - 20, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + 3, y - 20, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x, y - 23, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x, y - 17, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // وسط الزهرة
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(x, y - 20, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawWeatherEffects() {
    if (!userData.settings.weatherEffects) return;
    
    const weather = getCurrentWeather();
    
    if (weather === 'fog') {
        drawFog();
    } else if (weather === 'rain') {
        drawRain();
    } else if (weather === 'snow' && season === 'winter') {
        drawSnow();
    }
}

function getCurrentWeather() {
    // تحديد الطقس بناءً على الانقطاع
    if (!userData.lastStudyDate) return 'clear';
    
    const last = new Date(userData.lastStudyDate);
    const now = new Date();
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 30) return 'fog';
    if (diffDays >= 14) return 'rain';
    if (diffDays >= 7) return 'cloudy';
    return 'clear';
}

function drawFog() {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.fillRect(0, 0, cityCanvas.width, cityCanvas.height);
    
    // طبقات ضباب متحركة
    for (let i = 0; i < 5; i++) {
        const y = 100 + i * 80 + Math.sin(Date.now() * 0.001 + i) * 20;
        const x = (Date.now() * 0.02 + i * 200) % (cityCanvas.width + 400) - 200;
        
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(x, y, 150, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.globalAlpha = 1;
}

function drawRain() {
    for (let i = 0; i < 100; i++) {
        const x = (Date.now() * 0.1 + i * 50) % cityCanvas.width;
        const y = (Date.now() * 0.5 + i * 30) % cityCanvas.height;
        
        ctx.strokeStyle = 'rgba(100, 100, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 5, y + 15);
        ctx.stroke();
    }
}

function drawSnow() {
    for (let i = 0; i < 50; i++) {
        const x = (Date.now() * 0.05 + i * 70) % cityCanvas.width;
        const y = (Date.now() * 0.2 + i * 40) % cityCanvas.height;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawParticles() {
    // تحديث مواقع الجسيمات
    cityParticles = cityParticles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        
        if (p.life > 0) {
            // رسم الجسيم
            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = `rgba(39, 174, 96, ${p.life / 100})`;
            ctx.fillText(p.value, p.x, p.y);
            return true;
        }
        return false;
    });
}

function drawSpecialEvents() {
    const now = Date.now();
    
    specialEvents = specialEvents.filter(event => {
        const age = now - event.time;
        if (age > event.duration) return false;
        
        if (event.type === 'levelup') {
            drawFireworks(event.level);
        } else if (event.type === 'achievement') {
            drawConfetti(event.achievement);
        }
        
        return true;
    });
}

function drawFireworks(level) {
    const time = Date.now() * 0.01;
    const centerX = cityCanvas.width / 2;
    const centerY = cityCanvas.height / 3;
    
    for (let i = 0; i < 5; i++) {
        const angle = (time + i * 72) * 0.1;
        const radius = 50 + Math.sin(time + i) * 20;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.fillStyle = `hsl(${time + i * 72}, 100%, 50%)`;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawConfetti(achievement) {
    const time = Date.now() * 0.01;
    
    for (let i = 0; i < 20; i++) {
        const x = (time * 10 + i * 50) % cityCanvas.width;
        const y = (time * 5 + i * 30) % cityCanvas.height;
        
        ctx.fillStyle = `hsl(${i * 18}, 100%, 50%)`;
        ctx.fillRect(x, y, 5, 10);
    }
}

function updateWeatherEffect() {
    if (!weatherDiv) return;
    
    const weather = getCurrentWeather();
    
    weatherDiv.className = 'weather';
    if (weather === 'fog') {
        weatherDiv.classList.add('fog');
        reminderText.textContent = '🌫️ ضباب يلف المدينة... تحتاج للدراسة لتبديده';
    } else if (weather === 'rain') {
        weatherDiv.classList.add('rain');
        reminderText.textContent = '🌧️ مطر يهطل على المدينة... عد للدراسة لتشرق الشمس';
    } else if (weather === 'cloudy') {
        weatherDiv.classList.add('cloudy');
        reminderText.textContent = '☁️ غيوم تغطي السماء... أسبوع بدون مذاكرة';
    } else {
        reminderText.textContent = '✨ كل ساعة تذاكرها الآن = لبنة في مستقبلك';
    }
    
    // تحديث وقت المدينة
    if (cityTimeSpan) {
        const hour = Math.floor(timeOfDay);
        const minute = Math.floor((timeOfDay % 1) * 60);
        cityTimeSpan.textContent = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
    
    if (cityLevelSpan) {
        cityLevelSpan.textContent = userData.level;
    }
}

function updateReminder() {
    const quotes = [
        'كل ساعة تذاكرها الآن = لبنة في مستقبلك',
        'الحلم ينتظرك... ابنه ساعة بساعة',
        'أنت تبني مدينة أحلامك',
        'المستقبل ملك لمن يذاكر اليوم',
        'ساعة مذاكرة = تقدم حقيقي',
        'المدينة تنمو معك... استمر',
        'كل XP يقربك لحلمك',
        'أنت مهندس مستقبلك',
        'ابنِ حلمك ساعة بساعة',
        'المستوى القادم أقرب مما تتصور'
    ];
    
    if (reminderText && !reminderText.textContent.includes('ضباب') && 
        !reminderText.textContent.includes('مطر') && !reminderText.textContent.includes('غيوم')) {
        const random = Math.floor(Math.random() * quotes.length);
        reminderText.textContent = quotes[random];
    }
}

// ==================== معاينة XP ====================
function updateXpPreview() {
    const minutes = parseInt(minutesInput.value) || 30;
    const focus = parseInt(focusInput.value) || 3;
    const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value || 'متوسط';
    
    let timeXp = Math.floor(minutes / 30) * 50;
    let difficultyXp = 0;
    let focusXp = 0;
    let streakXp = 0;
    
    if (difficulty === 'صعب') {
        difficultyXp = Math.floor(timeXp * 0.2);
    } else if (difficulty === 'متوسط') {
        difficultyXp = Math.floor(timeXp * 0.1);
    }
    
    if (focus >= 4) focusXp = 20;
    else if (focus >= 3) focusXp = 10;
    
    if (userData.streak >= 30) streakXp = 50;
    else if (userData.streak >= 14) streakXp = 30;
    else if (userData.streak >= 7) streakXp = 20;
    else if (userData.streak >= 3) streakXp = 10;
    
    const totalXp = timeXp + difficultyXp + focusXp + streakXp;
    
    if (previewTimeXp) previewTimeXp.textContent = timeXp;
    if (previewDifficultyXp) previewDifficultyXp.textContent = difficultyXp;
    if (previewFocusXp) previewFocusXp.textContent = focusXp;
    if (previewStreakXp) previewStreakXp.textContent = streakXp;
    if (previewTotalXp) previewTotalXp.textContent = totalXp;
}

// ==================== أحداث ====================
function initEventListeners() {
    // اختيار الحلم
    dreamCards.forEach(card => {
        card.addEventListener('click', () => {
            userData.dream = card.dataset.dream;
            saveData();
            showMainScreen();
            showToast(`تم اختيار حلم ${card.dataset.dream}`, 'success');
        });
    });
    
    if (setCustomDreamBtn) {
        setCustomDreamBtn.addEventListener('click', () => {
            const custom = customDreamInput.value.trim();
            if (custom) {
                userData.dream = custom;
                saveData();
                showMainScreen();
                showToast(`تم اختيار حلم ${custom}`, 'success');
            }
        });
    }
    
    // أزرار التنقل
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const screen = item.dataset.screen;
            
            switch(screen) {
                case 'main':
                    showMainScreen();
                    break;
                case 'session':
                    showSessionScreen();
                    break;
                case 'dashboard':
                    showDashboard();
                    break;
                case 'achievements':
                    showAchievements();
                    break;
                case 'profile':
                    showProfile();
                    break;
            }
        });
    });
    
    // أزرار الإجراءات الرئيسية
    if (addSessionBtn) addSessionBtn.addEventListener('click', showSessionScreen);
    if (viewDashboardBtn) viewDashboardBtn.addEventListener('click', showDashboard);
    if (viewAchievementsBtn) viewAchievementsBtn.addEventListener('click', showAchievements);
    
    if (quickSessionBtn) {
        quickSessionBtn.addEventListener('click', () => {
            subjectInput.value = 'مادة سريعة';
            minutesInput.value = 25;
            focusInput.value = 4;
            focusValueSpan.textContent = '4/5';
            updateXpPreview();
            showSessionScreen();
        });
    }
    
    // أزرار العودة
    if (sessionBackBtn) sessionBackBtn.addEventListener('click', showMainScreen);
    if (cancelSessionBtn) cancelSessionBtn.addEventListener('click', showMainScreen);
    if (dashboardBackBtn) dashboardBackBtn.addEventListener('click', showMainScreen);
    if (achievementsBackBtn) achievementsBackBtn.addEventListener('click', showMainScreen);
    if (profileBackBtn) profileBackBtn.addEventListener('click', showMainScreen);
    
    // تحديث معاينة XP
    if (minutesInput) {
        minutesInput.addEventListener('input', () => {
            updateXpPreview();
        });
    }
    
    if (focusInput) {
        focusInput.addEventListener('input', () => {
            focusValueSpan.textContent = focusInput.value + '/5';
            updateXpPreview();
        });
    }
    
    document.querySelectorAll('input[name="difficulty"]').forEach(radio => {
        radio.addEventListener('change', updateXpPreview);
    });
    
    // نموذج الجلسة
    if (sessionForm) sessionForm.addEventListener('submit', handleSessionSubmit);
    
    // تحديث التذكير
    if (refreshReminderBtn) {
        refreshReminderBtn.addEventListener('click', updateReminder);
    }
    
    // تحديث لوحة التحكم
    if (refreshDashboardBtn) {
        refreshDashboardBtn.addEventListener('click', () => {
            updateDashboard();
            showToast('تم تحديث الإحصائيات', 'success');
        });
    }
    
    // إعدادات الملف الشخصي
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
            userData.settings.darkMode = e.target.checked;
            saveData();
            // تطبيق الوضع الليلي على الصفحة
            if (e.target.checked) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        });
    }
    
    if (notificationsToggle) {
        notificationsToggle.addEventListener('change', (e) => {
            userData.settings.notifications = e.target.checked;
            saveData();
        });
    }
    
    if (soundToggle) {
        soundToggle.addEventListener('change', (e) => {
            userData.settings.sound = e.target.checked;
            saveData();
        });
    }
    
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', () => {
            showConfirm(
                'تأكيد إعادة التعيين',
                'هل أنت متأكد؟ سيتم حذف جميع بياناتك ولا يمكن التراجع عن هذا الإجراء.',
                () => {
                    localStorage.removeItem(STORAGE_KEY);
                    location.reload();
                }
            );
        });
    }
    
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            const newDream = prompt('أدخل حلمك الجديد:', userData.dream);
            if (newDream && newDream.trim()) {
                userData.dream = newDream.trim();
                saveData();
                updateProfile();
                showToast('تم تحديث الحلم بنجاح', 'success');
            }
        });
    }
}

// ==================== التهيئة ====================
function init() {
    loadData();
    initEventListeners();
    
    // إخفاء شاشة البداية بعد ثانيتين
    setTimeout(() => {
        if (userData.dream) {
            showMainScreen();
        } else {
            showDreamSelection();
        }
    }, 2000);
    
    // بدء رسم المدينة
    function animate() {
        if (!mainScreen.classList.contains('hidden')) {
            drawCity();
        }
        requestAnimationFrame(animate);
    }
    animate();
    
    // تحديث الوقت كل دقيقة
    setInterval(() => {
        if (mainScreen.classList.contains('hidden')) return;
        drawCity();
    }, 60000);
    
    // التحقق من الإنجازات كل دقيقة
    setInterval(() => {
        if (userData.dream) {
            checkAchievements();
        }
    }, 60000);
}

// بدء التطبيق
document.addEventListener('DOMContentLoaded', init);