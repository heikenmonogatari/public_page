MyApp.module('Layout', function (Layout, MyApp, Backbone) {

    Layout.Root = Backbone.Marionette.LayoutView.extend({
        el: 'body',
        regions: {
            mapContainer: "#map-container",
            header: "#header",
            summaryHeader: "#sumHeader",
            periodContainer: "#period-container",
            countContainer: "#count-container",
            yesterdayContainer: "#yesterday-container",
            chartContainer: "#chart-container"
        }
    });
});



