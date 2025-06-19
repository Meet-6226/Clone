document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const sidebar = document.querySelector('.product__container__sidebar');
    const menuToggle = document.querySelector('.product__navigation .fa-bars');
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    const todayBtn = document.getElementById('todayBtn');
    const currentWeekEl = document.getElementById('currentWeek');
    const weekdaysEl = document.querySelector('.calendar-weekdays');
    const timeSlotsEl = document.querySelector('.calendar-time-slots');
    
    // Calendar state
    let currentDate = new Date();
    
    // Initialize the calendar
    function initCalendar() {
        // Set up event listeners
        setupEventListeners();
        // Render the calendar
        renderCalendar();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Toggle sidebar on mobile
        if (menuToggle) {
            menuToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                sidebar.classList.toggle('show');
            });
        }
        
        // Navigation buttons
        if (prevWeekBtn) prevWeekBtn.addEventListener('click', goToPreviousWeek);
        if (nextWeekBtn) nextWeekBtn.addEventListener('click', goToNextWeek);
        if (todayBtn) todayBtn.addEventListener('click', goToToday);
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024 && 
                !sidebar.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', handleResize);
    }
    
    // Navigation functions
    function goToPreviousWeek() {
        currentDate.setDate(currentDate.getDate() - 7);
        renderCalendar();
    }
    
    function goToNextWeek() {
        currentDate.setDate(currentDate.getDate() + 7);
        renderCalendar();
    }
    
    function goToToday() {
        currentDate = new Date();
        renderCalendar();
    }
    
    // Handle window resize
    function handleResize() {
        // Add any responsive behavior here
    }
    
    // Render the calendar
    function renderCalendar() {
        renderWeekView();
        updateCurrentWeekText();
    }
    
    // Render week view
    function renderWeekView() {
        // Clear previous content
        weekdaysEl.innerHTML = '';
        timeSlotsEl.innerHTML = '';
        
        // Get the start of the week (Monday)
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
        
        // Add empty cell for time labels column
        const timeLabelHeader = document.createElement('div');
        timeLabelHeader.className = 'time-label-header';
        weekdaysEl.appendChild(timeLabelHeader);
        
        // Render weekdays header with full day names
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const date = new Date(startOfWeek);
        const today = new Date();
        
        weekdays.forEach((day, index) => {
            const dayEl = document.createElement('div');
            dayEl.className = 'weekday';
            
            const dayName = document.createElement('div');
            dayName.className = 'day-name';
            dayName.textContent = day.substring(0, 3);
            
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = date.getDate();
            
            // Check if this is today's date
            if (date.getDate() === today.getDate() && 
                date.getMonth() === today.getMonth() && 
                date.getFullYear() === today.getFullYear()) {
                dayEl.classList.add('current-day');
            }
            dayEl.appendChild(dayName);
            dayEl.appendChild(dayNumber);
            weekdaysEl.appendChild(dayEl);
            // Move to next day
            date.setDate(date.getDate() + 1);
        });
        
        // Create time slots container
        const timeSlotsContainer = document.createElement('div');
        timeSlotsContainer.className = 'time-slots-container';
        
        // Create time slots (8 AM to 8 PM)
        for (let hour = 7; hour <= 20; hour++) {
            // Create time label
            const timeLabel = document.createElement('div');
            timeLabel.className = 'time-label';
            timeLabel.textContent = `${hour}:00`;
            timeSlotsContainer.appendChild(timeLabel);
            
            // Create day cells for this time slot
            for (let i = 0; i <=7; i++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'day-cell';
                // Day cell content can be added here
                timeSlotsContainer.appendChild(dayCell);
            }
        }
        timeSlotsEl.appendChild(timeSlotsContainer);
    }
    
    // Update the current week text
    function updateCurrentWeekText() {
        if (!currentWeekEl) return;
        
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const options = { month: 'long', day: 'numeric' };
        const startStr = startOfWeek.toLocaleDateString(undefined, options);
        const endStr = endOfWeek.toLocaleDateString(undefined, { ...options, month: startOfWeek.getMonth() === endOfWeek.getMonth() ? undefined : 'long' });
        
        currentWeekEl.textContent = `${startStr} - ${endStr} ${startOfWeek.getFullYear()}`;
    }
    
    // Expose functions to global scope for HTML onclick handlers
    window.sidebarFeature = function() {
        if (window.innerWidth <= 1024) {
            sidebar.classList.toggle('show');
        } else {
            // Toggle sidebar on desktop if needed
            const isHidden = sidebar.style.transform === 'translateX(-100%)';
            sidebar.style.transform = isHidden ? 'translateX(0)' : 'translateX(-100%)';
            document.querySelector('.product__container__content').style.marginLeft = isHidden ? '240px' : '0';
        }
    };
    // Initialize the calendar
    initCalendar();
    
    // Close the DOMContentLoaded event listener
});