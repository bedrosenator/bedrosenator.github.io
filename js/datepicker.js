//todo add date formats
function DatePicker(options) {
    this.date = options.date || new Date;
    this.firstDayOfWeek = options.firstDayOfWeek ? options.firstDayOfWeek : "MO";
    this.events = {};
    this.datePickerWrap = document.createElement('div');
    this.datePickerWrap.classList.add(options.wrapperClassName ? options.wrapperClassName : 'datepicker-wrap');

    this.inputElem = document.querySelector(options.selector);
    this.daysNames = this.firstDayOfWeek == "MO" ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.ui = {};
    this.ui.classes = {
        table: 'datepicker-table',
        activeDate: 'active',
        prevMonthDate: 'prev-month-date',
        nextMonth: 'next-month',
        prevMonth: 'prev-month',
        currentMont: 'current-month'
    };

    this.init();
}

DatePicker.prototype.getDate = function () {
    return this.date;
};

DatePicker.prototype.init = function () {
    this.events.dateChanged = new Event('dateChanged');
    this.createTable();
    this.drawTable();
    this.setDatepickerPosition();
    this.inputElem.value = this.date;
    this.inputElem.addEventListener('click', this.showCalendar.bind(this));
    document.documentElement.addEventListener('click', this.hideCalendar.bind(this));
    this.table.addEventListener('click', this.setActiveDate.bind(this));
    this.nextMonth.addEventListener('click', this.setNextMonth.bind(this));
    this.prevMonth.addEventListener('click', this.setPrevMonth.bind(this));
    this.table.addEventListener('dateChanged', this.dateChangedHandler.bind(this));
    window.addEventListener('resize', this.windowSizeChanged.bind(this));
};

DatePicker.prototype.windowSizeChanged = function () {
    window.setTimeout(this.setDatepickerPosition.bind(this), 300);
};

DatePicker.prototype.dateChangedHandler = function () {
    this.refreshTable();
};

DatePicker.prototype.setNextMonth = function (e) {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate());
    this.table.dispatchEvent(this.events.dateChanged);
};

DatePicker.prototype.setPrevMonth = function () {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() - 1, this.date.getDate());
    this.table.dispatchEvent(this.events.dateChanged);
};

DatePicker.prototype.createTable = function () {
    this.table = document.createElement('table');
    this.table.style.display = 'none';
    this.table.className = this.ui.classes.table;
};

DatePicker.prototype.setActiveClass = function (date) {
};

DatePicker.prototype.showCalendar = function (e) {
    this.table.style.display = '';
};

DatePicker.prototype.hideCalendar = function (e) {
    var target = e.target;

    while (target !== null) {
        if (target.className == this.ui.classes.table || target == this.inputElem)
            return;
        target = target.parentNode;
    }

    this.table.style.display = 'none';
};

DatePicker.prototype.getTableOffset = function() {
    // +1 if starts from sunday. 0 if starts from MO
    var offset = this.firstDayOfWeek == "SU" ? 1 : 0;
    var day = new Date(this.date.getFullYear(), this.date.getMonth()).getDay();

    if (day == 0) {
        day = 7;
    }
    // - 1 because 0 day is last day of prev month
    return -((day - 1) + offset);
};

DatePicker.prototype.drawControlHeader = function() {
    var tr = document.createElement('tr');
    var td;

    td = document.createElement('td');
    td.innerHTML = '<';
    td.classList.add(this.ui.classes.nextMonth);
    this.prevMonth = td;
    tr.appendChild(td);
    td = document.createElement('td');
    td.colSpan = 5;
    td.innerHTML = this.months[this.date.getMonth()] + ' ' + this.date.getFullYear();
    td.classList.add(this.ui.classes.selectedMonth);
    this.selectedMonthHeader = td;
    tr.appendChild(td);
    td = document.createElement('td');
    td.innerHTML = '>';
    td.classList.add(this.ui.classes.nextMonth);
    this.nextMonth = td;
    tr.appendChild(td);
    this.table.appendChild(tr);
};

DatePicker.prototype.refreshTable = function () {
    this.removeTableBody();
    this.drawTableBody();
    this.selectedMonthHeader.innerHTML = this.months[this.date.getMonth()] + ' ' + this.date.getFullYear();
};

DatePicker.prototype.drawHeader = function () {
    var tr = document.createElement('tr');
    var td, i;

    for (i = 0; i < this.daysNames.length; i++) {
        td = document.createElement('th');
        td.innerHTML = this.daysNames[i];
        tr.appendChild(td);
    }
    this.table.appendChild(tr);
};

DatePicker.prototype.removeTableBody = function () {
    this.table.removeChild(this.tBody)
};

DatePicker.prototype.drawTableBody = function () {
    var td;
    var tr;
    var a;
    var i, j;
    var year = this.date.getFullYear();
    var month = this.date.getMonth();
    var tableOffset = this.getTableOffset();
    var DAYS_PER_PAGE = 6 * 7;
    var todayDate = new Date();
    var currentMonthDate;
    this.tBody = document.createElement('tbody');

    //append table body
    tr = document.createElement('tr');
    for (i = 1, j = tableOffset; i <= DAYS_PER_PAGE; i++) {
        currentMonthDate = new Date(year, month, ++j);
        a = document.createElement('a');
        td = document.createElement('td');
        td.dataset.year = currentMonthDate.getFullYear();
        td.dataset.month = currentMonthDate.getMonth();
        a.innerHTML = currentMonthDate.getDate();
        a.href = 'javascript:;';
        td.dataset.day = currentMonthDate.getDate();
        td.appendChild(a);


        if (currentMonthDate.getMonth() !== this.date.getMonth()) {
            td.className = this.ui.classes.prevMonthDate;
        }

        if (currentMonthDate.getTime() == new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()).getTime()) {
            td.className = this.ui.classes.activeDate;
        }
        tr.appendChild(td);

        if (i > 1 && i % 7 == 0) {
            this.tBody.appendChild(tr);
            tr = document.createElement('tr');
        }
    }

    this.tBody.appendChild(tr);
    this.table.appendChild(this.tBody);
    this.datePickerWrap.appendChild(this.table);
    this.inputElem.parentNode.appendChild(this.datePickerWrap);

};

DatePicker.prototype.setDatepickerPosition = function() {
    var inputElemCoords = this.inputElem.getBoundingClientRect();
    var inputElemHeight = inputElemCoords.bottom - inputElemCoords.top;
    this.datePickerWrap.style.top = inputElemCoords.bottom + 15 + "px";
    this.datePickerWrap.style.left = inputElemCoords.left + "px";
    this.datePickerWrap.style.position = 'absolute';
};

DatePicker.prototype.drawTable = function() {
    this.drawControlHeader();
    //append header with weeks names
    this.drawHeader();
    this.drawTableBody();
};

DatePicker.prototype.setActiveDate = function(e) {
    var target = e.target;
    var activeItem;
    while(target !== null) {
        if (target.tagName == 'TD' && target.dataset.year) {
            activeItem = document.querySelector('td.active');
            if (activeItem)
                activeItem.classList.remove('active');
            target.classList.add('active');
            this.inputElem.value = new Date(target.dataset.year, target.dataset.month, target.dataset.day);
            return;
        }
        target = target.parentNode;
    }
};

Date.prototype.getDaysInMonth = function(year, month) {
    return 33 - new Date(year, month, 33).getDate();
};

DatePicker.prototype.getFirstDayInMonth = function (year, month) {
    return (new Date(year, month, 1)).getDay();
};

DatePicker.prototype.getLastDayInMonth = function (year, month) {
    return (new Date(year, month + 1, 0)).getDay();
};

DatePicker.prototype.getWeeksCountInMonth = function (year, month) {
    var firstOfMonth = new Date(year, month, 1);
    var lastOfMonth = new Date(year, month + 1, 0);

    var used = firstOfMonth.getDay() + lastOfMonth.getDate();

    return Math.ceil( used / 7);
};

DatePicker.prototype.getLocalDay = function (date) {
    var day = date.getDay();

    if (day == 0) {
        day = 7;
    }

    return day;
};