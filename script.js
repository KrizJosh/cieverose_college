// ===== DOM ELEMENTS =====
const DOM = {
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    navMenu: document.getElementById('nav-menu'),
    backToTopBtn: document.getElementById('back-to-top'),
    searchBtn: document.getElementById('search-btn'),
    searchModal: document.getElementById('search-modal'),
    searchModalClose: document.getElementById('search-modal-close'),
    calendarMonthYear: document.getElementById('current-month-year'),
    calendarDays: document.getElementById('calendar-days'),
    eventTabs: document.querySelectorAll('.event-tab'),
    eventContents: document.querySelectorAll('.event-content'),
    accordionHeaders: document.querySelectorAll('.accordion-header'),
    prevMonthBtn: document.getElementById('prev-month'),
    nextMonthBtn: document.getElementById('next-month')
};



// ===== ACCORDION SYSTEM =====
function initializeAccordions() {
    DOM.accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            if (!content) return;
            
            const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
            
            // Close all accordions in the same container first
            const parent = header.closest('.accordion');
            if (parent) {
                parent.querySelectorAll('.accordion-content').forEach(item => {
                    item.style.maxHeight = '0px';
                });
                parent.querySelectorAll('.accordion-header').forEach(header => {
                    header.classList.remove('active');
                });
            }
            
            // Toggle the clicked accordion
            if (!isOpen) {
                content.style.maxHeight = content.scrollHeight + "px";
                header.classList.add('active');
            } else {
                content.style.maxHeight = '0px';
                header.classList.remove('active');
            }
        });
    });
}



// ===== CONFIGURATION =====
const CONFIG = {
    autoSlideInterval: 5000,
    minSwipeDistance: 50,
    scrollOffset: 100
};

// ===== STATE MANAGEMENT =====
const State = {
    currentDate: new Date(),
    carouselInstances: new Map(),
    isMobileMenuOpen: false,
    activeEventTab: 'js-prom'
};

// ===== LOADING ANIMATION =====
function initializeLoading() {
    window.addEventListener('load', () => {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                setTimeout(() => loadingOverlay.remove(), 500);
            }, 1000);
        }
    });
}

// ===== MOBILE MENU MANAGEMENT =====
function initializeMobileMenu() {
    if (!DOM.mobileMenuBtn || !DOM.navMenu) return;
    
    DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking on links
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            if (State.isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (State.isMobileMenuOpen && 
            !DOM.navMenu.contains(e.target) && 
            !DOM.mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    State.isMobileMenuOpen = !State.isMobileMenuOpen;
    DOM.navMenu.classList.toggle('show');
    DOM.mobileMenuBtn.innerHTML = State.isMobileMenuOpen ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    DOM.mobileMenuBtn.setAttribute('aria-expanded', State.isMobileMenuOpen);
}

function closeMobileMenu() {
    State.isMobileMenuOpen = false;
    DOM.navMenu.classList.remove('show');
    DOM.mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
}

// ===== SCROLL MANAGEMENT =====
function initializeScrollHandlers() {
    // Back to top button
    if (DOM.backToTopBtn) {
        window.addEventListener('scroll', throttle(() => {
            const isVisible = window.scrollY > 500;
            DOM.backToTopBtn.classList.toggle('visible', isVisible);
        }, 100));

        DOM.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            scrollToSection(targetId);
            
            if (State.isMobileMenuOpen) {
                closeMobileMenu();
            }
        });
    });
}

function scrollToSection(sectionId) {
    const targetElement = document.querySelector(sectionId);
    if (targetElement) {
        const nav = document.querySelector('nav');
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===== SEARCH MODAL =====
function initializeSearchModal() {
    if (!DOM.searchBtn || !DOM.searchModal || !DOM.searchModalClose) return;
    
    DOM.searchBtn.addEventListener('click', openSearchModal);
    DOM.searchModalClose.addEventListener('click', closeSearchModal);
    
    DOM.searchModal.addEventListener('click', (e) => {
        if (e.target === DOM.searchModal) {
            closeSearchModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.searchModal.classList.contains('active')) {
            closeSearchModal();
        }
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', throttle(performSearch, 300));
    }
}

function openSearchModal() {
    DOM.searchModal.classList.add('active');
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.focus();
}

function closeSearchModal() {
    DOM.searchModal.classList.remove('active');
}

function performSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length < 2) return;
    
    // Implement search logic here
    console.log('Searching for:', searchTerm);
}

// ===== CALENDAR FUNCTIONALITY =====
const ACADEMIC_EVENTS = {
    '2025-7-15': { title: 'First Day of Classes', type: 'academic' },
    '2025-8-15': { title: 'Midterm Examinations', type: 'exam' },
    '2025-8-21': { title: 'National Heroes Day', type: 'holiday' },
    '2025-9-1': { title: 'Buwan ng Wika Celebration', type: 'event' },
    '2025-9-15': { title: 'Preliminary Examinations', type: 'exam' },
    '2025-10-6': { title: 'Teachers Day', type: 'event' },
    '2025-11-30': { title: 'Bonifacio Day', type: 'holiday' },
    '2025-12-25': { title: 'Christmas Day', type: 'holiday' },
    '2025-11-1': { title: 'All Saints Day', type: 'holiday' },
    '2026-1-8': { title: 'Feast of the Immaculate Conception of Mary', type: 'holiday' },
    '2025-10-31': { title: 'All Saints Day Eve', type: 'holiday' },
    '2025-7-27': { title: 'Proclamation No. 729', type: 'holiday' },
    '2025-7-21': { title: 'Ninoy Aquino Day', type: 'holiday' },
    '2025-10-27': { title: 'Final Examinations', type: 'exam' },
    '2025-12-15': { title: 'Christmas Program', type: 'event' },
    '2025-12-20': { title: 'Start of Christmas Break', type: 'holiday' },
    '2026-1-5': { title: 'Classes Resume', type: 'academic' },
    '2026-4-18': { title: 'Good Friday', type: 'holiday' },
    '2026-4-17': { title: 'Maundy Thursday', type: 'holiday' },
    '2026-4-9': { title: 'Araw ng Kagitingan', type: 'holiday' },
    '2026-2-14': { title: 'Valentines Day Celebration', type: 'event' },
    '2026-2-25': { title: 'EDSA Revolution Anniversary', type: 'holiday' },
    '2026-4-1': { title: 'Eid\'l Fitr (Feast of Ramadhan)', type: 'holiday' },
    '2026-1-1': { title: 'New Year\'s Day', type: 'holiday' }
};

function initializeCalendar() {
    if (!DOM.prevMonthBtn || !DOM.nextMonthBtn || !DOM.calendarMonthYear || !DOM.calendarDays) return;
    
    DOM.prevMonthBtn.addEventListener('click', () => navigateCalendar(-1));
    DOM.nextMonthBtn.addEventListener('click', () => navigateCalendar(1));
    
    renderCalendar();
    addQuickMonthNavigation();
    updateSelectValues();
}

function navigateCalendar(direction) {
    State.currentDate.setMonth(State.currentDate.getMonth() + direction);
    renderCalendar();
    updateSelectValues();
}

function renderCalendar() {
    const year = State.currentDate.getFullYear();
    const month = State.currentDate.getMonth();
    const today = new Date();
    
    // Update month/year display
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    DOM.calendarMonthYear.textContent = `${monthNames[month]} ${year}`;
    
    // Clear previous days
    DOM.calendarDays.innerHTML = '';
    
    // Get calendar data
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Add day headers
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(day => {
        const dayElement = createElement('div', 'calendar-day-header', day);
        DOM.calendarDays.appendChild(dayElement);
    });
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
        DOM.calendarDays.appendChild(createElement('div', 'calendar-day empty'));
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${month + 1}-${day}`;
        const eventData = ACADEMIC_EVENTS[dateKey];
        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        
        const dayElement = createCalendarDay(day, eventData, isToday, dateKey);
        DOM.calendarDays.appendChild(dayElement);
    }
}

function createCalendarDay(day, eventData, isToday, dateKey) {
    const dayElement = createElement('div', 'calendar-day');
    dayElement.innerHTML = `<span class="calendar-date">${day}</span>`;
    
    // Add today class
    if (isToday) dayElement.classList.add('today');
    
    // Add event data
    if (eventData) {
        dayElement.classList.add('event', eventData.type);
        dayElement.innerHTML += `<div class="calendar-event">${eventData.title}</div>`;
        dayElement.setAttribute('data-tooltip', eventData.title);
        
        // Add event interactions
        dayElement.addEventListener('mouseenter', showEventTooltip);
        dayElement.addEventListener('mouseleave', hideEventTooltip);
    }
    
    // Add click handler
    dayElement.addEventListener('click', () => selectCalendarDay(dayElement, day, eventData));
    
    return dayElement;
}

function selectCalendarDay(dayElement, day, eventData) {
    if (dayElement.classList.contains('empty')) return;
    
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add new selection
    dayElement.classList.add('selected');
    updateEventsList(day, eventData);
}

function updateEventsList(day, eventData) {
    const eventsList = document.getElementById('key-dates-list');
    if (!eventsList) return;
    
    eventsList.innerHTML = '';
    
    const li = createElement('li');
    if (eventData) {
        li.innerHTML = `
            <span class="date-badge">${day}</span>
            <div class="event-details">
                <div class="event-title">${eventData.title}</div>
                <div class="event-type ${eventData.type}">
                    ${eventData.type.charAt(0).toUpperCase() + eventData.type.slice(1)}
                </div>
            </div>
        `;
    } else {
        li.innerHTML = `
            <div class="event-details">
                <div class="event-title">No events scheduled for this date</div>
            </div>
        `;
    }
    
    eventsList.appendChild(li);
}

// Tooltip functions
function showEventTooltip() {
    const tooltipText = this.getAttribute('data-tooltip');
    if (!tooltipText) return;
    
    const tooltip = createElement('div', 'event-tooltip', tooltipText);
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 10}px`;
}

function hideEventTooltip() {
    const tooltip = document.querySelector('.event-tooltip');
    if (tooltip) tooltip.remove();
}

// Quick navigation
function addQuickMonthNavigation() {
    const calendarHeader = document.querySelector('.calendar-header');
    if (!calendarHeader || document.getElementById('month-select')) return;
    
    const quickNav = createElement('div', 'calendar-quick-nav');
    quickNav.innerHTML = `
        <select id="month-select" aria-label="Select month">
            ${[...Array(12).keys()].map(i => 
                `<option value="${i}">${new Date(2000, i).toLocaleString('default', {month: 'long'})}</option>`
            ).join('')}
        </select>
        <select id="year-select" aria-label="Select year">
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
        </select>
    `;
    
    calendarHeader.appendChild(quickNav);
    
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    
    if (monthSelect) {
        monthSelect.addEventListener('change', (e) => {
            State.currentDate.setMonth(parseInt(e.target.value));
            renderCalendar();
            updateSelectValues();
        });
    }
    
    if (yearSelect) {
        yearSelect.addEventListener('change', (e) => {
            State.currentDate.setFullYear(parseInt(e.target.value));
            renderCalendar();
            updateSelectValues();
        });
    }
}

function updateSelectValues() {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    
    if (monthSelect) monthSelect.value = State.currentDate.getMonth();
    if (yearSelect) yearSelect.value = State.currentDate.getFullYear();
}

// ===== EVENT TABS =====
function initializeEventTabs() {
    DOM.eventTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchEventTab(tabId);
        });
    });
}

function switchEventTab(tabId) {
    // Update tabs
    DOM.eventTabs.forEach(t => t.classList.remove('active'));
    DOM.eventContents.forEach(c => c.classList.remove('active'));
    
    // Activate selected tab
    const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
    const activeContent = document.getElementById(tabId);
    
    if (activeTab && activeContent) {
        activeTab.classList.add('active');
        activeContent.classList.add('active');
        State.activeEventTab = tabId;
        
        // Initialize carousel for active tab
        const activeCarousel = activeContent.querySelector('.event-carousel');
        if (activeCarousel) {
            initializeCarousel(activeCarousel);
        }
    }
}

// ===== CAROUSEL SYSTEM =====
function initializeCarousels() {
    document.querySelectorAll('.event-carousel').forEach(carousel => {
        initializeCarousel(carousel);
    });
}

function initializeCarousel(carousel) {
    const container = carousel.querySelector('.carousel-container');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    if (!container || slides.length === 0) return;
    
    const carouselState = {
        currentSlide: 0,
        autoSlideInterval: null,
        isPaused: false
    };
    
    State.carouselInstances.set(carousel, carouselState);
    
    function showSlide(index) {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        carouselState.currentSlide = index;
        
        // Update scroll position
        container.scrollTo({
            left: container.clientWidth * index,
            behavior: 'smooth'
        });
        
        // Update indicators and slides
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
        
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        showSlide(carouselState.currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(carouselState.currentSlide - 1);
    }
    
    function startAutoSlide() {
        stopAutoSlide();
        if (!carouselState.isPaused) {
            carouselState.autoSlideInterval = setInterval(nextSlide, CONFIG.autoSlideInterval);
        }
    }
    
    function stopAutoSlide() {
        clearInterval(carouselState.autoSlideInterval);
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    
    container.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });
    
    container.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        const distance = touchStartX - touchEndX;
        
        if (Math.abs(distance) >= CONFIG.minSwipeDistance) {
            distance > 0 ? nextSlide() : prevSlide();
        }
        
        startAutoSlide();
    }, { passive: true });
    
    // Pause on hover
    container.addEventListener('mouseenter', () => {
        carouselState.isPaused = true;
        stopAutoSlide();
    });
    
    container.addEventListener('mouseleave', () => {
        carouselState.isPaused = false;
        startAutoSlide();
    });
    
    // Initialize
    showSlide(0);
    startAutoSlide();
}


// ===== DYNAMIC CONTENT =====
const CONTENT_DATA = {
    announcements: [
        { date: '2025-07-01', title: 'Enrollment for SY 2025-2026', content: 'Enrollment for the new school year starts on July 1, 2025. Please complete your requirements early.' },
        { date: '2025-07-15', title: 'First Day of Classes', content: 'Classes for SY 2025-2026 begin on July 15, 2025. All students are expected to attend.' },
        { date: '2025-08-15', title: 'Midterm Examinations', content: 'Midterm examinations will be held from August 15-20, 2025. Please prepare accordingly.' }
    ],
    events: [
        { date: '2025-08-21', title: 'National Heroes Day', time: 'Whole Day', location: 'No Classes' },
        { date: '2025-09-01', title: 'Buwan ng Wika Celebration', time: '8:00 AM - 3:00 PM', location: 'School Grounds' },
        { date: '2025-10-06', title: 'Teachers Day Celebration', time: '8:00 AM - 12:00 PM', location: 'School Auditorium' }
    ],
    news: [
        { title: 'Sportsfest 2025 Champions', excerpt: 'Congratulations to the Blue Team for winning this years Sportsfest competition.', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
        { title: 'Science Fair Winners', excerpt: 'Our students won 3 awards at the regional science fair competition.', image: 'https://images.unsplash.com/photo-1581094288338-231b058b38b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' }
    ]
};

function populateDynamicContent() {
    populateAnnouncements();
    populateEvents();
    populateNews();
}

function populateAnnouncements() {
    const container = document.getElementById('announcements-container');
    if (!container) return;
    
    CONTENT_DATA.announcements.forEach(item => {
        const element = createElement('div', 'announcement-item');
        element.innerHTML = `
            <div class="announcement-date">${formatDate(item.date)}</div>
            <div class="announcement-title">${item.title}</div>
            <div>${item.content}</div>
        `;
        container.appendChild(element);
    });
}

function populateEvents() {
    const container = document.getElementById('events-container');
    if (!container) return;
    
    CONTENT_DATA.events.forEach(event => {
        const eventDate = new Date(event.date);
        const element = createElement('div', 'event-item');
        element.innerHTML = `
            <div class="event-date">
                <span class="event-day">${eventDate.getDate()}</span>
                <span class="event-month">${eventDate.toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div class="event-details">
                <div class="event-title">${event.title}</div>
                <div class="event-time">${event.time}</div>
                <div class="event-location">${event.location}</div>
            </div>
        `;
        container.appendChild(element);
    });
}

function populateNews() {
    const container = document.getElementById('news-container');
    if (!container) return;
    
    CONTENT_DATA.news.forEach(newsItem => {
        const element = createElement('div', 'news-item');
        element.innerHTML = `
            <img src="${newsItem.image}" alt="${newsItem.title}" class="news-image" loading="lazy">
            <div class="news-title">${newsItem.title}</div>
            <div class="news-excerpt">${newsItem.excerpt}</div>
        `;
        container.appendChild(element);
    });
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// ===== QUICK ACTIONS =====
function initializeQuickActions() {
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.id === 'search-btn') return;
            
            if (this.querySelector('.fa-calendar')) {
                scrollToSection('#calendar');
            } else if (this.querySelector('.fa-envelope')) {
                scrollToSection('#contact');
            }
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function createElement(tag, className = '', content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function enhanceAccessibility() {
    // Add skip to content functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) mainContent.focus();
        });
    }
    
    // Improve keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initializePerformanceOptimizations() {
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== ERROR HANDLING =====
function initializeErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('Script error:', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        e.preventDefault();
    });
}

// ===== CONTACT SECTION FUNCTIONALITY =====
function initializeContactSection() {
    updateOfficeStatus();
    setInterval(updateOfficeStatus, 60000);
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

function updateOfficeStatus() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    
    if (!statusIndicator || !statusText) return;
    
    if (day === 0) {
        statusIndicator.className = 'status-indicator closed';
        statusText.textContent = 'Closed today';
    } else if (day === 6) {
        if (hour >= 9 && hour < 12) {
            statusIndicator.className = 'status-indicator open';
            statusText.textContent = `Open - Closes at 12:00 PM`;
        } else if (hour < 9) {
            statusIndicator.className = 'status-indicator closed';
            statusText.textContent = `Opens at 9:00 AM`;
        } else {
            statusIndicator.className = 'status-indicator closed';
            statusText.textContent = 'Closed for the day';
        }
    } else {
        if (hour >= 8 && hour < 17) {
            statusIndicator.className = 'status-indicator open';
            const closingTime = 17 - hour - 1;
            const closingMinutes = 60 - minutes;
            statusText.textContent = `Open - Closes in ${closingTime}h ${closingMinutes}m`;
        } else if (hour < 8) {
            statusIndicator.className = 'status-indicator closed';
            statusText.textContent = `Opens at 8:00 AM`;
        } else {
            statusIndicator.className = 'status-indicator closed';
            statusText.textContent = 'Closed for the day';
        }
    }
}

function openDirections() {
    window.open('https://maps.app.goo.gl/8PD8L7VCfyoL6Fca7', '_blank');
}

function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    if (!name || !email || !message) return;
    
    const nameValue = name.value;
    const emailValue = email.value;
    const messageValue = message.value;
    
    if (!nameValue || !emailValue || !messageValue) {
        alert('Please fill in all fields');
        return;
    }
    
    console.log('Contact form submitted:', { name: nameValue, email: emailValue, message: messageValue });
    alert('Thank you for your message! We will get back to you soon.');
    e.target.reset();
}

// ===== DARK MODE TOGGLE =====
function initializeDarkMode() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (!darkModeToggle) return;
    
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    const currentTheme = localStorage.getItem('theme') || 
                       (prefersDarkScheme.matches ? 'dark' : 'light');
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
    }
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            localStorage.setItem('theme', 'light');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    });
}

// ===== INITIALIZATION ===== 122225
function initializeApp() {
    try { 
        initializeLoading();
        initializeMobileMenu();
        initializeScrollHandlers();
        initializeSearchModal();
        initializeCalendar();
        initializeEventTabs();
        initializeCarousels();
        initializeAccordions();
        initializeQuickActions();
        populateDynamicContent();
        enhanceAccessibility();
        initializePerformanceOptimizations();
        initializeErrorHandling();
        initializeContactSection();
        initializeDarkMode();
        initializeEmailContact();
        
        if (DOM.accordionHeaders.length > 0) {
            const firstHeader = DOM.accordionHeaders[0];
            const firstContent = firstHeader.nextElementSibling;
            if (firstContent) {
                firstContent.style.maxHeight = firstContent.scrollHeight + "px";
            }
        }
        
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
        
        console.log('Cieverose College website initialized successfully');
        
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}



// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}





// 122225
// ===== EMAIL CONTACT FORM =====
function initializeEmailContact() {
    const emailForm = document.getElementById('email-contact-form');
    const enableCC = document.getElementById('enable-cc');
    const ccRecipients = document.getElementById('cc-recipients');
    const fileInput = document.getElementById('email-attachments');
    const fileList = document.getElementById('file-list');
    const formStatus = document.getElementById('form-status');
    
    if (!emailForm) return;
    
    // Toggle CC options
    if (enableCC) {
        enableCC.addEventListener('change', function() {
            ccRecipients.style.display = this.checked ? 'flex' : 'none';
        });
    }
    
    // File attachment handling
    if (fileInput) {
        // Drag and drop
        const dropZone = fileInput.parentElement.querySelector('.file-upload-label');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            dropZone.style.backgroundColor = '#e9ecef';
            dropZone.style.borderColor = 'var(--primary-color)';
        }
        
        function unhighlight() {
            dropZone.style.backgroundColor = '';
            dropZone.style.borderColor = '';
        }
        
        dropZone.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            fileInput.files = files;
            updateFileList();
        }
        
        fileInput.addEventListener('change', updateFileList);
        
        function updateFileList() {
            fileList.innerHTML = '';
            const files = Array.from(fileInput.files);
            
            if (files.length === 0) {
                return;
            }
            
            files.forEach((file, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                
                const fileSize = formatFileSize(file.size);
                
                fileItem.innerHTML = `
                    <div class="file-info">
                        <i class="fas fa-file file-icon"></i>
                        <span class="file-name">${file.name}</span>
                    </div>
                    <span class="file-size">${fileSize}</span>
                    <button type="button" class="remove-file" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                fileList.appendChild(fileItem);
            });
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-file').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    removeFile(index);
                });
            });
        }
        
        function removeFile(index) {
            const dt = new DataTransfer();
            const files = Array.from(fileInput.files);
            
            files.forEach((file, i) => {
                if (i !== index) {
                    dt.items.add(file);
                }
            });
            
            fileInput.files = dt.files;
            updateFileList();
        }
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }
    
    // Form submission
    emailForm.addEventListener('submit', handleEmailSubmit);
    emailForm.addEventListener('reset', resetForm);
    
    async function handleEmailSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = new FormData();
        formData.append('name', document.getElementById('sender-name').value);
        formData.append('email', document.getElementById('sender-email').value);
        formData.append('subject', document.getElementById('email-subject').value);
        formData.append('category', document.getElementById('email-category').value);
        formData.append('message', document.getElementById('email-message').value);
        
        // Add CC recipients if enabled
        if (enableCC && enableCC.checked) {
            const ccPrimary = document.getElementById('cc-primary').value;
            const ccSecondary = document.getElementById('cc-secondary').value;
            
            if (ccPrimary) formData.append('cc[]', ccPrimary);
            if (ccSecondary) formData.append('cc[]', ccSecondary);
        }
        
        // Add attachments
        if (fileInput && fileInput.files.length > 0) {
            Array.from(fileInput.files).forEach(file => {
                formData.append('attachments[]', file);
            });
        }
        
        // Disable submit button
        const submitBtn = emailForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        try {
            // In a real implementation, you would send this to your backend
            // For now, we'll simulate the email sending
            
            // Prepare email parameters for mailto: fallback
            const emailParams = prepareEmailParams();
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showFormStatus('success', 'Email sent successfully! We will respond within 24-48 hours.');
            
            // Clear form
            emailForm.reset();
            if (fileList) fileList.innerHTML = '';
            if (ccRecipients) ccRecipients.style.display = 'none';
            
            // Provide mailto: fallback link
            setTimeout(() => {
                const mailtoLink = document.createElement('a');
                mailtoLink.href = emailParams;
                mailtoLink.textContent = 'If the email client didn\'t open, click here';
                mailtoLink.style.display = 'block';
                mailtoLink.style.marginTop = '10px';
                mailtoLink.style.color = 'var(--primary-color)';
                mailtoLink.target = '_blank';
                formStatus.appendChild(mailtoLink);
            }, 1000);
            
        } catch (error) {
            showFormStatus('error', 'Failed to send email. Please try again or use the contact numbers provided.');
            console.error('Email sending error:', error);
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Email';
        }
    }
    
    function validateForm() {
        const requiredFields = emailForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            field.style.borderColor = '#ddd';
            
            if (!field.value.trim()) {
                field.style.borderColor = '#dc3545';
                isValid = false;
            }
        });
        
        // Validate email format
        const emailField = document.getElementById('sender-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailField.value && !emailRegex.test(emailField.value)) {
            emailField.style.borderColor = '#dc3545';
            showFormStatus('error', 'Please enter a valid email address.');
            isValid = false;
        }
        
        // Validate file size
        if (fileInput && fileInput.files.length > 0) {
            const maxSize = 10 * 1024 * 1024; // 10MB
            Array.from(fileInput.files).forEach(file => {
                if (file.size > maxSize) {
                    showFormStatus('error', `File "${file.name}" exceeds the 10MB size limit.`);
                    isValid = false;
                }
            });
        }
        
        return isValid;
    }
    
    function prepareEmailParams() {
        const name = encodeURIComponent(document.getElementById('sender-name').value);
        const email = encodeURIComponent(document.getElementById('sender-email').value);
        const subject = encodeURIComponent(document.getElementById('email-subject').value);
        const message = encodeURIComponent(document.getElementById('email-message').value);
        const category = document.getElementById('email-category').value;
        
        // Primary email recipient (you can change this)
        let to = 'info@cieverosecollege.edu.ph';
        
        // Add CC if enabled
        let cc = '';
        if (enableCC && enableCC.checked) {
            const ccPrimary = document.getElementById('cc-primary').value;
            const ccSecondary = document.getElementById('cc-secondary').value;
            
            if (ccPrimary) cc += encodeURIComponent(ccPrimary);
            if (ccSecondary) cc += (cc ? ',' : '') + encodeURIComponent(ccSecondary);
        }
        
        // Add category to subject if selected
        let fullSubject = subject;
        if (category) {
            const categories = {
                admission: '[Admission]',
                academic: '[Academic]',
                scholarship: '[Scholarship]',
                feedback: '[Feedback]',
                complaint: '[Complaint]',
                partnership: '[Partnership]',
                other: '[Other]'
            };
            fullSubject = `${categories[category] || ''} ${subject}`.trim();
        }
        
        // Construct mailto URL
        let mailto = `mailto:${to}?subject=${encodeURIComponent(fullSubject)}&body=From: ${name} (${email})%0A%0A${message}`;
        
        if (cc) {
            mailto += `&cc=${cc}`;
        }
        
        return mailto;
    }
    
    function showFormStatus(type, message) {
        formStatus.className = `form-status ${type}`;
        formStatus.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        formStatus.style.display = 'block';
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 10000);
    }
    
    function resetForm() {
        if (fileList) fileList.innerHTML = '';
        if (ccRecipients) ccRecipients.style.display = 'none';
        if (enableCC) enableCC.checked = false;
        formStatus.style.display = 'none';
        
        // Reset border colors
        emailForm.querySelectorAll('.form-control').forEach(field => {
            field.style.borderColor = '';
        });
    }
}