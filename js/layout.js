MyApp.module('Layout', function (Layout, MyApp, Backbone) {

    Layout.Root = Backbone.Marionette.LayoutView.extend({
        el: 'body',
        regions: {
            mapCanvas: "#map-canvas",
            chartArea: "#chart-area",
            header: "#header",
            summaryHeader: "#sumHeader"
        }
    });
});



