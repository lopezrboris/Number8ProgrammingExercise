var initArgs = {
    startDate: new Date(),
    days: 80,
    countryCode: "US",
    hollydays: []
};
//var hollydays = [new Date('2018-')]
(function(){

    this.tabCalendar = $(".calendar");
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
    "October", "November", "December"];
    this.index = 0;

    $.fn.extend({
        entradaEntera: function () {
            $(this).keypress(function validate(e) {
                e = e || event;
                return /[0-9]/i.test(String.fromCharCode(e.charCode || e.keyCode));
            });
            return $(this);
        },
        fecha: function () {
            if ($(this).datepicker) $(this).datepicker("getDate"); else return null;
        },
        fechaConHoras: function () {
            if ($(this).datepicker) return generador.formatearFecha($(this).datepicker("getDate")); else return null;
        },
        fechaSinHoras: function () {
            if ($(this).datepicker) return generador.formatearFechaSinHoras($(this).datepicker("getDate")); else return null;
        },
        esTablaSimple: function (data, options) {
            $(this)[0].data = data;
            $(this)[0].options = options;
            options.esTablaSimple = true;
            var table = "#" + this["0"].id;
            return generador.crearTabla(data, table, options);
        },
        esTabla: function (data, options) {
            var dtable = $(this).dataTable();
            dtable.fnDestroy();

            $(this)[0].data = data;
            $(this)[0].options = options;
            if (options.esTablaInsercion)
                $(this)[0].optionsInsercion = options.optionsInsercion;
            var table = "#" + this["0"].id;
            var tabla = generador.crearTabla(data, table, options).hacerDataTable(options);

            if (options.switches && $(table + " .tb-switch").length) {
                $(table + ' .tb-switch').each(function (index, element) {
                    var switchery = new Switchery(element, {
                        color: options.switchColor || '#041E42'
                    });
                });
            }


            return tabla;
        },
        esSpinner: function (opciones) {
            $(this).spinner({
                min: opciones.minimo || 0,
                max: opciones.maximo || 100,
                step: opciones.paso || 1
            }).entradaEntera().focus(function () { $(this).select() }).parent().addClass("form-control campo-spinner");
            $(this).parent().find("a.ui-spinner-button.ui-spinner-up.ui-corner-tr").addClass(" ui-button ui-widget ui-state-default ui-button-text-only ui-state-hover hand")
                .append($('<span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-n">▲</span></span>'));
            $(this).parent().find("a.ui-spinner-button.ui-spinner-down.ui-corner-br").addClass(" ui-button ui-widget ui-state-default ui-button-text-only ui-state-hover hand")
                .append($('<span class="ui-button-text"><span class="ui-icon ui-icon-triangle-1-s">▼</span></span>'));
            if (opciones.enlace)
                $(this).val(opciones.enlace.registro[opciones.enlace.clave]);
            var cambio = function (input) {
                opciones.enlace.registro[opciones.enlace.clave] = $(input).val();
                if (opciones.seleccion)
                    opciones.seleccion($(input).val());
            };
            $(this).parent().find("a.ui-spinner-up").click(function () { cambio($(this).parent().find("input")); });
            $(this).parent().find("a.ui-spinner-down").click(function () { cambio($(this).parent().find("input")); });
            $(this).on("change", function (evento) { cambio(evento.target); });
        },
        isCalendar: function (options) {
            $(this).datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: 'dd/mm/yy',
                //minDate: options.sinFechaMinima ? null : new Date(),
                constrainInput: true,
                showOtherMonths: true,
                selectOtherMonths: true,
                afterShow: function (inst) {
                    manejadori18n.hacerTooltip(".ui-datepicker-calendar thead span");
                    manejadori18n.hacerTooltip(".ui-datepicker-prev", { orientacion: "top" });
                    manejadori18n.hacerTooltip(".ui-datepicker-next", { orientacion: "top" });
                },
                onClose: options ? options.onclose || function () { } : function () { },
                onSelect: function () {
                    options.enlace.registro[options.enlace.clave] = options.enlace.formato ? $(this).datepicker({ dateFormat: options.enlace.formato }).val() : $(this).datepicker("getDate");
                    if (options.seleccion)
                        options.seleccion();
                }
            }).datepicker('widget').wrap('<div class="ll-skin-melon"/>');

            $(this).datepicker("setDate", moment(options.enlace.registro[options.enlace.clave]).toDate());
            options.enlace.registro[options.enlace.clave] = options.enlace.formato ? $(this).datepicker({ dateFormat: options.enlace.formato }).val() : $(this).datepicker("getDate");

            return $(this);
        }
    });

    Date.prototype.add = function (interval, unidades) {
        switch (interval.toLowerCase()) {
            case 'year': this.setFullYear(this.getFullYear() + unidades); break;
            case 'quarter': this.setMonth(this.getMonth() + 3 * unidades); break;
            case 'month': this.setMonth(this.getMonth() + unidades); break;
            case 'week': this.setDate(this.getDate() + 7 * unidades); break;
            case 'day': case 'día': this.setDate(this.getDate() + unidades); break;
            case 'hour': this.setTime(this.getTime() + unidades * 3600000); break;
            case 'minute': this.setTime(this.getTime() + unidades * 60000); break;
            case 'second': this.setTime(this.getTime() + unidades * 1000); break;
            default: break;
        }
        return this;
    }
    Array.prototype.contains = function (o, comparer) {
        var defaultEqualityComparer = function (a, b) {
            return a === b || a.valueOf() === b.valueOf();
        };
        comparer = comparer || defaultEqualityComparer;
        var l = this.length;
        while (l-- > 0)
            if (comparer(this[l], o) === true) return true;
        return false;
    };

    this.init = function(){
        this.initcontrols();
        this.drawCalendar();
    }

    this.initcontrols = function(){
        $("#startDate").isCalendar({ enlace: { registro: initArgs, clave: "startDate" } });
        //$("#numDays").esSpinner({ enlace: { registro: initArgs, clave: "startDate" } }).refres() ;
        $("#numDays").esSpinner({ minimo: 0, maximo: 100, paso: 1, enlace: { registro: initArgs, clave: "days" } });
    }

    this.drawCalendar = function(){
        calendar.draw(initArgs);       
    }

    

}).apply(number8calendar);

number8calendar.init();