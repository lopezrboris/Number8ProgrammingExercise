(function(){
    this.monthIndex = 0;
    this.currentMonth = 0;
    this.args = {};

    this.draw = function(args){
        this.reset();
        this.args = args;
        $(number8calendar.tabCalendar).empty();
        var currentDate = new Date(this.args.startDate);
        calendar.drawWeeks(currentDate);
    }

    this.reset = function(){
        this.monthIndex = 0;
        this.currentMonth = null;
        this.args = {};
    }

    this.drawWeeks = function(currentDate){
        var dayIndex = 0;
        var dayCounter = 0;
        while(dayCounter < this.args.days){
            // draw headers.
            calendar.drawHeaders(currentDate);
            dayIndex = 0;
            var week = $("<div>").addClass("row");
            $(number8calendar.tabCalendar).append(week);
            // draw week.
            while(dayIndex < currentDate.getDay() && currentDate.getMonth() == this.currentMonth){
                var cell = $("<div class='col-md-1 cell invalid-date'>&nbsp;</div>");
                $(week).append(cell);
                dayIndex++;
            }
            // Draw date.
            while(dayIndex < 7 && dayCounter < this.args.days && currentDate.getMonth() == this.currentMonth){
                var cell = $("<div class='col-md-1 cell'>0</div>").text(currentDate.getDate());
                if([0,6].contains(currentDate.getDay()))
                    $(cell).addClass("weekend");
                else{
                    if(this.args.hollyDays[this.args.countryCode].where(function (holyDay){ 
                        return holyDay.getMonth() == currentDate.getMonth() && holyDay.getDate() == currentDate.getDate();
                    }).length > 0){
                        calendar.args.days++;
                        $(cell).addClass("holyDay");
                    }
                    else
                        $(cell).addClass("weekday");
                    }
                $(week).append(cell);
                currentDate = currentDate.add("day", 1);
                dayIndex++;
                dayCounter++;
            }

            // draw week.
            if(currentDate.getMonth() != this.currentMonth)
                while(dayIndex < 7){
                    var cell = $("<div class='col-md-1 cell invalid-date'>&nbsp;</div>");
                    $(week).append(cell);
                    dayIndex++;
                }
        }
        
        // draw week.
        while(dayIndex < 7){
            var cell = $("<div class='col-md-1 cell invalid-date'>&nbsp;</div>");
            $(week).append(cell);
            dayIndex++;
        }
    }

    this.drawHeaders = function (myDate) {
        if (myDate.getMonth() != calendar.currentMonth){
            if(calendar.monthIndex == 0){
                var header = $("<div class='row'/>");
                $(header).append("<div class='col-md-1' >S</div>")
                .append("<div class='col-md-1' >M</div>").append("<div class='col-md-1' >T</div>")
                .append("<div class='col-md-1' >W</div>").append("<div class='col-md-1' >T</div>")
                .append("<div class='col-md-1' >F</div>").append("<div class='col-md-1' >S</div>");
                $(number8calendar.tabCalendar).append(header);
            }

            if(calendar.monthIndex != 0)
            $(number8calendar.tabCalendar).append($("<br/>"));

            var labelMonth = number8calendar.months[myDate.getMonth()] + " " + myDate.getFullYear();
            var xxx = $("<div class='row'/>");
            subHeader = $("<div class='col-md-7 text-center month-label'/>").text(labelMonth);
            $(xxx).append(subHeader);
            $(number8calendar.tabCalendar).append(xxx);
            calendar.monthIndex++;
            
            calendar.currentMonth = myDate.getMonth();
        }
    }
}).apply(calendar);

//calendar.init();