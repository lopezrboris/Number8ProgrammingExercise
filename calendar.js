(function(){
    this.monthIndex = 0;
    this.currentMonth = 0;
    this.done = false;
    this.args = {};

    this.draw = function(args){
        this.args = args;
        var currentDate = new Date(this.args.startDate);
        while(!this.done){
            calendar.drawWeeks(currentDate);
            this.done = true;
        }
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
                var cell = $("<div class='col-md-1 cell'>X</div>");
                $(week).append(cell);
                dayIndex++;
            }
            // Draw date.
            while(dayIndex < 7 && dayCounter < this.args.days && currentDate.getMonth() == this.currentMonth){
                var cell = $("<div class='col-md-1 cell'>0</div>").text(currentDate.getDate());
                $(week).append(cell);
                currentDate = currentDate.add("day", 1);
                dayIndex++;
                dayCounter++;
            }

            // draw week.
            if(currentDate.getMonth() != this.currentMonth)
                while(dayIndex < 7){
                    var cell = $("<div class='col-md-1 cell'>X</div>");
                    $(week).append(cell);
                    dayIndex++;
                }
        }
        
        // draw week.
        while(dayIndex < 7){
            var cell = $("<div class='col-md-1 cell'>X</div>");
            $(week).append(cell);
            dayIndex++;
        }
    }

    this.drawHeaders = function (myDate) {
        if (myDate.getMonth() != calendar.currentMonth){
            if(calendar.monthIndex == 0){
                var header = $("<div>").addClass("row");
                $(header).append("<div class='seven-cols col-md-1' >S</div>")
                .append("<div class='seven-cols col-md-1' >M</div>").append("<div class='seven-cols col-md-1' >T</div>")
                .append("<div class='seven-cols col-md-1' >W</div>").append("<div class='seven-cols col-md-1' >T</div>")
                .append("<div class='seven-cols col-md-1' >F</div>").append("<div class='seven-cols col-md-1' >S</div>");
                $(number8calendar.tabCalendar).append(header);
            }

            if(calendar.monthIndex != 0)
            $(number8calendar.tabCalendar).append($("<br/>"));

            var labelMonth = number8calendar.months[myDate.getMonth()] + " " + myDate.getFullYear();
            subHeader = $("<div>").addClass("seven-cols row col-md-7 text-center month-label").text(labelMonth);
            $(number8calendar.tabCalendar).append(subHeader);
            calendar.monthIndex++;
            
            calendar.currentMonth = myDate.getMonth();
        }
    }
}).apply(calendar);

//calendar.init();