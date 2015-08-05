var LogosItemView = Backbone.Marionette.ItemView.extend({

	template: "#logo_template",
	
	className: "logo-area",

	onShow: function() {
		var logos = this.collection.toJSON();

		console.log(logos);

		$('.logo-area').append('<div id="logoCarousel" class="carousel logo slide" data-ride="carousel">');

		$('#logoCarousel').append('<ol class="carousel-indicators logo">');

		for (var i=0; i<logos.length; i++) {
			if (i==0) {
				$('.carousel-indicators.logo').append('<li data-target="#logoCarousel" data-slide-to="' + i + '" class="active"></li>');
			}else{
				$('.carousel-indicators.logo').append('<li data-target="#logoCarousel" data-slide-to="' + i + '" class=""</li>');
			}
		}

		$('#logoCarousel').append('<div class="carousel-inner logo" role="listbox"></div>');

		for (var i=0; i<logos.length; i++) {
			if (i == 0) {
				$('.carousel-inner.logo').append('<div class="item logoCarouselImg active" id="itemLogo' + i + '"></div>');
			}else{
				$('.carousel-inner.logo').append('<div class="item logoCarouselImg" id="itemLogo' + i + '"></div>');
			}
			$('#itemLogo' + i).append('<center><img class="logoCarouselImg" src="' + logos[i].logo + '" style="height:100%;"></center>');
		}

		$('#logoCarousel').append('<a class="left logo carousel-control" href="#logoCarousel" role="button" data-slide="prev">');
		$('.left.logo').append('<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="sr-only">Previous</span>');

		$('#logoCarousel').append('<a class="right logo carousel-control" href="#logoCarousel" role="button" data-slide="next">');
		$('.right.logo').append('<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span>');

		$('.carousel.logo').carousel({
			interval: 4000
		})

	}

	
});
