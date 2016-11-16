function DatePicker(options) {
    this.date = options.date || new Date;
    this.inputElem = document.getElementById('datepicker');
    this.dateSeparator = options.dateSeparator || '-';
    this.days = days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.wrapTable = null;

    this.nextMonth = null;
    this.prevMonth = null;

    this.init();
}

DatePicker.prototype.init = function() {
    //console.log(this.inputElem.value);
    this.drawTable();
    //show calendar by click
    this.inputElem.addEventListener('click', this.showCalendar.bind(this));
    //hide calendar

    this.setDate();
    console.log(document.getElementsByClassName('next-month')[0]);
    document.getElementsByClassName('next-month')[0].addEventListener('click', this.setNextMonth.bind(this));
    document.querySelector('.prev-month').addEventListener('click', this.setPrevMonth.bind(this));

    document.documentElement.addEventListener('click', this.hideCalendar.bind(this));

};

DatePicker.prototype.getWeekDays = function(days) {
    var weekDays = {};

    weekDays = this.days;

    return weekDays;
};

DatePicker.prototype.setNextMonth = function(e) {
    //debugger;
    if(e.target.className !== 'next-month') return;

    this.date.setMonth(this.date.getMonth() + 1);
    this.setDate();
    this.drawTable();
    this.showCalendar();
};

DatePicker.prototype.setPrevMonth = function(e) {
    if(e.target.className !== 'prev-month') return;

    this.date.setMonth(this.date.getMonth() - 1);
    this.setDate();
    this.drawTable();
    this.showCalendar();
};
/**
 * set date into input onload and by click
 * @param e
 * return void
 */
DatePicker.prototype.setDate = function(options) {
    options = options || {};
    var date = this.date;
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if(day < 10) day = "0" + day;
    if(month < 10) month = "0" + month;
    this.inputElem.value = day + this.dateSeparator + month + this.dateSeparator + year;
};

DatePicker.prototype.showCalendar = function() {
    this.wrapTable.style.display = '';
};

DatePicker.prototype.hideCalendar = function(e) {
    var target = e.target;


    if(target.className === this.inputElem.className || target.className === this.nextMonth.className ||
        target.className === this.prevMonth.className) return; //|| e.target.className === this.wrapTable.className) return;
//debugger;

    /*while(target !== this) {
        console.log(target);
        if(target.parentNode !== null)
            target = target.parentNode;
    }*/
    this.wrapTable.style.display = 'none';

};

DatePicker.prototype.getWeekDaysDecorator = function() {
    var weekDays = this.getWeekDays();
    var tr = document.createElement('tr');
    var td, text;
    for(var i = 0; i < weekDays.length; i++) {
        td = document.createElement('td');
        text = document.createTextNode(weekDays[i]);

        td.appendChild(text);
        tr.appendChild(td);
    }

    return tr;
};

DatePicker.prototype.createNextMonthArrow = function() {
    this.nextMonth = document.createElement('a');
    this.nextMonth.href = 'javascript:;';
    this.nextMonth.innerHTML = '&#x203A;';
    this.nextMonth.className = 'next-month';
};

DatePicker.prototype.createPrevMonthArrow = function() {
    this.prevMonth = document.createElement('a');
    this.prevMonth.href = 'javascript:;';
    this.prevMonth.innerHTML = '&#x2039';
    this.prevMonth.className = 'prev-month';
};

DatePicker.prototype.createMonthName = function(months) {
    if(!this.monthName) {
        this.monthName = monthName = document.createElement('td');
        this.monthName = document.createElement('td');
        this.monthName.colSpan = 5;
        this.monthName.innerHTML = months[this.date.getMonth()];
        this.monthName.className = 'month-name';
    } else {
        this.monthName.innerHTML = months[this.date.getMonth()];
    }

    return this.monthName;
};

DatePicker.prototype.getCalendarHead = function() {
//debugger;
    if(!this.headerWrap ) {
        this.headerWrap = document.createElement('div');
        var tr = document.createElement('tr');
        var nextMonthTd = document.createElement('td');
        var prevMonthTd = document.createElement('td');
        this.headerWrap.className = 'header-wrap';
        var table = document.createElement('table');
        this.createNextMonthArrow();
        this.createPrevMonthArrow();
        nextMonthTd.appendChild(this.nextMonth);
        prevMonthTd.appendChild(this.prevMonth);
        var tds = [];
        this.monthName = this.createMonthName(this.months);
        tds = [prevMonthTd, this.monthName, nextMonthTd];
        for(var i = 0; i < tds.length; i++) {
            tr.appendChild(tds[i]);
        }
        table.appendChild(tr);
        this.headerWrap.appendChild(table);
    }

    //var months = this.months;
    this.monthName = this.createMonthName(this.months);

    return this.headerWrap;
};
//todo refresh table after click to next month and prev
DatePicker.prototype.drawTable = function() {

    //shows from wich day week starts
    var startDayOfWeek = new Date(this.date.getYear(),this.date.getMonth(), 1).getDay() + 1;
    var daysInMonth = this.date.daysInMonth();
    var weekDays = this.getWeekDaysDecorator();
    var head = this.getCalendarHead();
debugger;

    if(this.calendarTable && this.calendarTable.children.length) {
        //debugger;
        var tableChildren = this.calendarTable;

        while(tableChildren.lastChild) {
            tableChildren.removeChild(tableChildren.lastChild);
        }
    }
    this.calendarTable = document.createElement('table');
    this.calendarTable.className = 'calendar-table';
    var tr, td, a;
    if(!this.wrapTable) {
        this.wrapTable = document.createElement('div');
        this.wrapTable.className = 'booba-datepicker-wrap';
        this.wrapTable.style.display = 'none';
        this.wrapTable.appendChild(head);
    }
    //this.calendar


    this.calendarTable.appendChild(weekDays);
    this.wrapTable.appendChild(this.calendarTable);


    for (var i = 1; i < daysInMonth + startDayOfWeek; i++) {
        //day = daysInMonth - startDayOfWeek;
        tr = document.createElement('tr');
        for(var j = 1; j <= 7; j++) {

            td = document.createElement('td');
            a = document.createElement('a');
            a.href = "javascript:;";

            td.appendChild(a);
            if(i > daysInMonth + startDayOfWeek ) td.innerHTML = '&nbsp';
            if(i < 7 && j <= startDayOfWeek) {
                td.innerHTML = '&nbsp'
            }
            a.dataset.date = i - startDayOfWeek;
            a.innerHTML = i - startDayOfWeek;


            tr.appendChild(td);
            i++;
        }
        this.calendarTable.appendChild(tr);
        tr = '';
    }
    document.body.appendChild(this.wrapTable);
};

Date.prototype.daysInMonth = function(month) {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};

