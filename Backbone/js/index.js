var RowModel = Backbone.Model.extend({
    defaults: {
        id: '',
        name: ''
    },
    initialize: function(){
        this.set("Birthdate", this.formatBirthday(this.get("Birthdate")));
    },
    formatBirthday: function(bday){
        var birthdate = new Date(Date.parse(bday));
        var year = birthdate.getFullYear();
        var month = birthdate.getMonth();
        var day = birthdate.getDate();
        if (month < 10){ month = "0" + month; }
        if (day < 10){ day = "0" + day; }
        var formatted = year + "-" + month + "-" + day;
        return formatted;
    }
});

var RowCollection = Backbone.Collection.extend({
    model: RowModel,
    url: "/ratings",
    comparator: function(row){
        return row.get("ID");
    },
    sortByField: function(field){
        this.comparator = function(row){
            return row.get(field);
        };
        this.sort();
    }
});

var TableModel = Backbone.Model.extend({
    defaults: {
        fields: [],
        rows: new RowCollection()
    }
});

var RowView = Backbone.View.extend({
    tagName: 'tr',
    className: 'row',
    template: _.template($('#row-template').html()),
    events: {
        "click .delete": "deleteRow"
    },
    initialize: function(){
        this.render();
    },
    render: function(){
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    deleteRow: function(){
        this.model.destroy(); // deletes the model
        this.remove(); // deletes the view
    }
});

var TableView = Backbone.View.extend({
    template: _.template($("#table-template").html()),
    events: {
        'click th': 'changeSort'
    },
    initialize: function() {
        // save reference to the row collection
        this.rowCollection = this.model.attributes.rows;
        // render the table
        this.render();
    },
    render: function(){
        // compile and append the template
        var rendered = this.template(this.model.attributes);
        this.$el.html(rendered);
        // initialize, render, append row view for each row model 
        var $table = $("#table");
        this.rowCollection.each(function(model){
            var rowView = new RowView({ model: model });
            $table.append(rowView.el);
        });
        return this;
    },
    changeSort: function(e){
        var field = e.currentTarget.innerText;
        this.rowCollection.sortByField(field);
        this.render();
    }
});

var table = new TableView({
    el: $("#table-container"),
    model: new TableModel({
        fields: ["ID", "Name", "Birthdate", "Gender", "Address", "City", "State"],
        rows: new RowCollection([
            {"ID":"0","Name":"Caitlin","Birthdate":"Tue Apr 17 1984 00:00:00 GMT-0800 (PST)","Gender":"Female","Address":"56 W State St. #2","City":"Chicago","State":"IL"},
            {"ID":"1","Name":"Terrence","Birthdate":"Mon Dec 01 1986 00:00:00 GMT-0800 (PST)","Gender":"Male","Address":"1120 Milwaukee Ave.","City":"Chicago","State":"IL"},
            {"ID":"2","Name":"Michael","Birthdate":"Mon Feb 05 1990 00:00:00 GMT-0800 (PST)","Gender":"Male","Address":"6660 Campus Dr.","City":"St. Louis","State":"MO"},
            {"ID":"3","Name":"Chris","Birthdate":"Tue Aug 13 1985 00:00:00 GMT-0700 (PDT)","Gender":"Male","Address":"514 N. Paulina St.","City":"Chicago","State":"IL"},
            {"ID":"4","Name":"Gabrielle","Birthdate":"Mon Jan 15 1973 00:00:00 GMT-0800 (PST)","Gender":"Female","Address":"1940 Brooktree Ct.","City":"Westlake Village","State":"CA"}
        ])
    })
});

