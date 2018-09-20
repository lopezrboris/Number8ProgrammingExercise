var initArgs = {
    startDate: new Date(2008,7,15),
    days: 30,
    countryCode: "US",
    hollyDays: {
        "US": [new Date(2008,8,1), new Date(2019,0,1),new Date(2019,0,21),new Date(2019,1,18),new Date(2019,4,27)
        ,new Date(2019,6,4),new Date(2019,9,14),new Date(2019,10,11),new Date(2019,10,28),new Date(2019,11,25)],
        "BO": [new Date(2019,0,1), new Date(2019,0,22), new Date(2019,0,24), new Date(2019,1,10)
            , new Date(2019,1,12), new Date(2019,1,13), new Date(2019,2,19), new Date(2019,2,23)
            , new Date(2019,2,30), new Date(2019,3,12), new Date(2019,3,15), new Date(2019,4,1)
            , new Date(2019,4,25), new Date(2019,4,27), new Date(2019,4,31), new Date(2019,5,21)
            , new Date(2019,5,24), new Date(2019,6,16), new Date(2019,7,6), new Date(2019,7,17)
            , new Date(2019,8,14), new Date(2019,8,24), new Date(2019,9,11), new Date(2019,10,2)
            , new Date(2019,10,10), new Date(2019,10,18), new Date(2019,11,25)]
    }
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
        isSpinner: function (opciones) {
            $(this).spinner({
                min: opciones.minimo || 0,
                max: opciones.maximo || 100,
                step: opciones.paso || 1
            }).entradaEntera().focus(function () { $(this).select() }).parent().addClass("form-control field-spinner");
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
        },
        isAutocomplete: function (opciones) {
            var itemSeleccionado = null;
            if (opciones && opciones.data) {
                var items = [], hash = {};
                $(this).empty();

                $.each(opciones.data, function (index, item) {
                    if (opciones.clave) {
                        hash[item[opciones.clave]] = item;
                        if (opciones.labelCompuesto) {
                            var c1 = item[opciones.labelCompuesto.claves.split(",")[0]];
                            var c2 = item[opciones.labelCompuesto.claves.split(",")[1]];
                            var c3 = item[opciones.labelCompuesto.claves.split(",")[2]];
                            //var texto = generador.generarPlantilla(opciones.labelCompuesto.plantilla)({ clave1: c1, clave2: c2, clave3: c3 }).toUpperCase();
                            var texto = opciones.labelCompuesto.plantilla.replace("${clave1}", c1).replace("${clave2}", c2).replace("${clave3}", c3).toUpperCase();
                        } else {
                            var texto = item[opciones.valor].toUpperCase();
                        }

                        items.push({ value: item[opciones.clave], label: texto });
                    } else {
                        var keys = Object.keys(item);
                        hash[item[keys[0]]] = item;
                        items.push({ value: item[keys[0]], label: item[keys[1]].toUpperCase() });
                    }
                });
                $(this).autocomplete({
                    source: items,
                    select: function (e, item) {
                        itemSeleccionado = hash[item.item.value];
                        if (opciones.labelCompuesto)
                            $(this).val(opciones.labelCompuesto.label ? itemSeleccionado[opciones.labelCompuesto.label] : item.item.label);
                        else
                            $(this).val(item.item.label);

                        if (opciones.seleccion)
                            opciones.seleccion(itemSeleccionado);

                        if (opciones.enlace)
                            opciones.enlace.registro[opciones.enlace.clave] = item.item.value;
                        return false;
                    },
                    response: function () {
                        itemSeleccionado = null;
                        return false;
                    }
                });
                $(this).blur(function () {
                    if (!itemSeleccionado) {
                        var texto = $(this)[0].value;
                        var encontrados = items.where(function (item) { return item.label.toUpperCase() == texto.toUpperCase() });
                        if (opciones.enlace)
                            if (encontrados.length) {
                                itemSeleccionado = hash[encontrados[0].value];
                                if (opciones.enlace)
                                    opciones.enlace.registro[opciones.enlace.clave] = itemSeleccionado;
                            } else
                                opciones.enlace.registro[opciones.enlace.clave] = 0;
                    }
                });
                if (opciones.enlace) {
                    itemSeleccionado = hash[opciones.enlace.registro[opciones.enlace.clave]];
                    if (itemSeleccionado)
                        $(this).val(itemSeleccionado[Object.keys(itemSeleccionado)[1]]);
                }
            }
            return $(this);
        },
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
    Date.prototype.withoutTime = function () {
        var d = new Date(this);
        d.setHours(0, 0, 0, 0);
        return d;
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
    Array.prototype.where = Array.prototype.filter || function (predicate, context) {
        context = context || window;
        var arr = [];
        var l = this.length;
        for (var i = 0; i < l; i++)
            if (predicate.call(context, this[i], i, this) === true) arr.push(this[i]);
        return arr;
    };

    this.init = function(){
        this.initcontrols();
        this.autocompleted({id:"US", text:"US"});
    }

    this.initcontrols = function(){
        var countryCode = [{id:"US", text:"US"}, {id:"BO", text:"BO"}];
        
        $("#startDate").isCalendar({ enlace: { registro: initArgs, clave: "startDate" }, seleccion: number8calendar.drawCalendar  });
        $("#numDays").isSpinner({ minimo: 0, maximo: 1000, paso: 1, enlace: { registro: initArgs, clave: "days" }, seleccion: number8calendar.drawCalendar });
        $("#countryCode").isAutocomplete({ data: countryCode, enlace: { registro: initArgs, clave: "countryCode" }, seleccion: number8calendar.autocompleted });
    }

    this.autocompleted = function(countryCode){
        $("#holydaysSummary").text(countryCode? "Selected: "+ countryCode.text : "Unknowed country code");
        setTimeout(() => {
            number8calendar.drawCalendar();
        }, 200);
    }

    this.drawCalendar = function(){
        initArgs.days = $("#numDays").val();
        calendar.draw(initArgs);  
    }

    

}).apply(number8calendar);

number8calendar.init();