function DatePicker(options) {
    options = options || {};
    //input element of datePicker
    this.inputElem = document.getElementById(options.id);

    //init date
    this.date = options.date.year && options.date.month ? new Date(options.date.year, options.date.month - 1) : new Date();

    this.uiClasses = {
        wrap: 'booba-datepicker-wrap',
        calendar: 'calendar-table',
        day: 'calendar-day',
        header: 'calendar-header',
        title: 'calendar-title',
        nextMonth: 'next-month',
        prevMonth: 'prev-month'
    };

    // calendar body
    this.calendar;
    
    this.weekStart = options.weekStart;

    // calendar header
    this.header;

    //calendar wrapper
    this.calendarWrap;

    //month in header
    this.month;

    //week days
    this.weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    //months
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    //arrow next in header
    this.nextArrow;

    //arrow prev in the header
    this.prevArrow;

    this.init();

};

DatePicker.prototype.init = function() {
    if (this.weekStart == 1) {
        var day = this.weekDays.splice(0, 1);
        this.weekDays.push(day[0]);
    }
    
    this.setInputElemDate();
    this.generateWrap();
    this.generateHeader();
    this.generateCalendar();
    
    this.calendarWrap.addEventListener('click', this.setDate.bind(this));
    this.nextMonth.addEventListener('click', this.showNextMonth.bind(this));

};

DatePicker.prototype.formatDate = function(options) {
    var options = options || {};
    var separator = options.separator || '-';
    var date = options.date || this.date;

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if(day < 10) day = "0" + day;
    if(month < 10) month = "0" + month;

    return day + separator + month + separator + year;
};

DatePicker.prototype.setDate = function(e) {
    var target = e.target;
    var day = target.dataset.day;
//    debugger;
    if (target.tagName !== 'A' || !day) return;
    
    this.setActiveClass(day);
    this.date.setDate(day);
    this.setInputElemDate();
};

DatePicker.prototype.setActiveClass = function(day) {
    var links = this.calendar.getElementsByTagName('a');
    //clear active
    for (var i = 0; i < links.length; i++) {
        if (links[i].classList.contains('active')) {
            links[i].classList.remove('active');
        }
    }
    //set active
    for (var i = 0; i < links.length; i++) {
        if (links[i].dataset.day == day) {
            links[i].classList.add('active');
        }
    }
};

/**
 * set date of input element
 * @returns {undefined}
 */
DatePicker.prototype.setInputElemDate = function() {
    this.inputElem.value = this.formatDate();
};

DatePicker.prototype.showNextMonth = function(e) {
    if(e.target.className !== this.uiClasses.nextMonth) return;
    //set next month
    this.date.setMonth(this.date.getMonth() + 1);

    this.clearCalendar();
    this.updateTitle();
    this.generateCalendar();

};
/**
 *
 * @returns {void}
 */
DatePicker.prototype.showPrevMonth = function() {};

DatePicker.prototype.generateWrap = function() {
    this.calendarWrap = document.createElement('div');
    this.calendarWrap.className = this.uiClasses.wrap;
};

/**
 * generates controls next arrow, previous arrow and month in header
 *
 * @returns {undefined}
 */
DatePicker.prototype.generateHeader = function() {
    this.header = document.createElement('div');
    this.header.className = this.uiClasses.header;

    this.nextMonth = document.createElement('a');
    this.nextMonth.className = this.uiClasses.nextMonth;
    this.nextMonth.innerHTML = '>';
    this.header.appendChild(this.nextMonth);

    this.prevMonth = document.createElement('a');
    this.prevMonth.className = this.uiClasses.prevMonth;
    this.prevMonth.innerHTML = '<';
    this.header.appendChild(this.prevMonth);

    this.title = document.createElement('div');
    this.title.className = this.uiClasses.title;
    this.title.innerHTML = this.months[this.date.getMonth()] + ' ' + this.date.getFullYear();
    this.header.appendChild(this.title);

    this.calendarWrap.appendChild(this.header);
    return this.header;

};

DatePicker.prototype.generateWeekDays = function() {
    var tr = document.createElement('tr');
    var td;

    for (var i = 0; i < this.weekDays.length; i++) {
        td = document.createElement('td');
        td.innerHTML = this.weekDays[i];
        tr.appendChild(td);
    }
    
    this.calendar.appendChild(tr);

};

DatePicker.prototype.updateTitle = function() {
    this.title.innerHTML = this.months[this.date.getMonth()] + ' ' + this.date.getFullYear();
};

DatePicker.prototype.clearCalendar = function() {
    //debugger;
    var cells = this.calendar.childNodes;

    while(this.calendar.lastChild) {
        this.calendar.removeChild(this.calendar.lastChild);
    }

    this.calendar.parentNode.removeChild(this.calendar);

    //console.log(this.calendar.childNodes.length);
};



DatePicker.prototype.generateCalendar = function() {
    var date = this.date;
    var daysInMonth = date.daysInMonth();
    var weekStart = this.getMonthStartDay();
    var prevMonthDays = new Date(this.date.getMonth() - 1).getMonth();
    prevMonthDays = new Date(this.date.getFullYear(), prevMonthDays).daysInMonth();
    var prevMonthStartDay = prevMonthDays - weekStart;
    
    var td;
    var tr;
    var a;
    var totalCells =  weekStart + daysInMonth;
    var nextMonthDays = 1;
    
    //remove calendar table if exist
    if(this.calendar && this.calendar.hasChildNodes()) {
        this.clearCalendar();
    } else {
        this.calendar = document.createElement('table');
    }

    this.calendar.className = this.uiClasses.calendar;
    
    this.generateWeekDays();
    
    for (var i = 1, k = 0; i < totalCells, k <= daysInMonth; i++) {

        tr = document.createElement('tr');

        for (var j = 1; j <= 7; j++) {
            if (i > weekStart) k++;
            td = document.createElement('td');
            a = document.createElement('a');

            a.dataset.day = k;
            a.className = this.uiClasses.day;
            a.innerHTML = k;

            if(k == (this.date.getDate())) {
                a.className += ' active';
            }

            if (i <= weekStart) {
                a.innerHTML = ++prevMonthStartDay;
                a.className += ' not-active';
            }

            if(k > daysInMonth) {
                a.innerHTML = nextMonthDays++;
                a.className += ' not-active';
            }

            td.appendChild(a);
            tr.appendChild(td);

            i++;
        }

        this.calendar.appendChild(tr);
        tr = '';
    }


    this.calendarWrap.appendChild(this.calendar);

    //insert into document
    this.inputElem.parentNode.insertBefore(this.calendarWrap, this.inputElem.nextSibling);
};
DatePicker.prototype.showCalendar = function() {

};
DatePicker.prototype.hideCalendar = function() {};

//??
DatePicker.refreshCalendar = function() {};

Date.prototype.daysInMonth = function(month) {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};

DatePicker.prototype.getMonthStartDay = function() {
    var date = new Date(this.date.getFullYear(), this.date.getMonth());
    // if week starts from SUNDAY
    if (this.weekStart == 7) {
        return date.getDay();
    }
    // if week starts from MONDAY
    if (date == 0) {
        date = 7;
    }    
    
    return date.getDay() - 1;
};