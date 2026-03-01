// Service Worker لـ DreamForge PWA
const CACHE_NAME = 'dreamforge-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
    'https://fonts.gstatic.com/s/cairo/v28/SLXVc1nY6HkvangtZmpcWmhzfH5lWWgcQyyS4J0.woff2'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('تم فتح الكاش');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('حذف الكاش القديم:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// استراتيجية التخزين المؤقت: Network First مع Fallback إلى Cache
self.addEventListener('fetch', (event) => {
    // تجاهل طلبات التحليلات والإحصائيات
    if (event.request.url.includes('chrome-extension') || 
        event.request.url.includes('analytics')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // نسخ الاستجابة للتخزين المؤقت
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // إذا فشل الشبكة، استخدم الكاش
                return caches.match(event.request).then((response) => {
                    if (response) {
                        return response;
                    }
                    
                    // إذا كان الملف غير موجود في الكاش، حاول إرجاع صفحة الخطأ
                    if (event.request.mode === 'navigate') {
                        return caches.match('/offline.html');
                    }
                });
            })
    );
});

// مزامنة خلفية للإشعارات
self.addEventListener('sync', (event) => {
    if (event.tag === 'study-reminder') {
        event.waitUntil(sendStudyReminder());
    }
});

// إرسال إشعار تذكير
function sendStudyReminder() {
    return self.registration.showNotification('DreamForge - تذكير بالمذاكرة', {
        body: 'حان وقت بناء حلمك! سجل جلستك الآن',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            url: '/'
        },
        actions: [
            {
                action: 'open',
                title: 'فتح التطبيق'
            },
            {
                action: 'dismiss',
                title: 'تجاهل'
            }
        ]
    });
}

// التعامل مع النقر على الإشعار
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});