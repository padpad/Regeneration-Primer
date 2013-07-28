/* 
* @file Character Selection SYSTEM 
* @author Wade Penistone (Truemedia)
* @overview Core Regeneration Primer system used for selecting a character to play as
* @copyright Wade Penistone 2013
* @license MIT license ({@link http://opensource.org/licenses/MIT| See here})
* Git repo: {@link http://www.github.com/Truemedia/Regeneration-Primer| Regeneration Primer github repository}
* Author links: {@link http://youtube.com/MCOMediaCityOnline| YouTube} and {@link http://github.com/Truemedia| Github}
*/
define(["hgn!systems/characterselection/characterselection", "./jQuery", "./Crafty"], function(window, jQuery, Crafty) {
	return characterselection = {
		/* Based on modified UI design posted on Bootsnipp (https://bootsnipp.com/snipps/carousel-extended) */
		init: function(){
			// Load up list of characters to choose from
			jQuery.getJSON("systems/characterselection/info/characters_advanced.json", function(data){

				// Mustache
       			document.getElementById('characters_window').innerHTML = window(data);
 				
 				jQuery(document).ready(function() {
 					// Setup UI
 					characterselection.selectionScreen();
				}); 
			});
		},
		registerEvents: function (game){ /* jQuery event handlers (for Character Selection) */
			// Mute or unmute audio
			jQuery('#characterselection_window').on("mouseover", ".character_container", function(event){
				characterselection.highlightWindow(event, this);
			});
			jQuery('#characterselection_window').on("mouseleave", ".character_container", function(event){
				characterselection.unhighlightWindow(event, this);
			});
		/* /jQuery event handlers (for Character Selection) */ },
		highlightWindow: function(event, selector){
			jQuery(selector).children("div").addClass("hover_char");
			jQuery(selector).children("button").children("span").removeClass("ui-icon-closethick");
			jQuery(selector).children("button").children("span").addClass("ui-icon-check");
			jQuery(selector).addClass("highlight_button");
			characterselection.registerSounds();
		},
		unhighlightWindow: function(event, selector){
			jQuery(selector).children("div").removeClass("hover_char");
			jQuery(selector).children("button").children("span").removeClass("ui-icon-check");
			jQuery(selector).children("button").children("span").addClass("ui-icon-closethick");
			jQuery(selector).removeClass("highlight_button");
		},
		registerSounds: function(){
			// TODO: Find appropriate sound and register then add case function to play
			//Crafty.audio.play("char_hover",1,0.2);
		},
		/* Produces the UI for character selection screen */
		selectionScreen: function(){
			jQuery('#myCarousel').carousel({
				interval: 5000
			});
 
			jQuery('#carousel-text').html(jQuery('#slide-content-1').html());
 
			// Handles the carousel thumbnails
			jQuery('[id^=carousel-selector-]').click( function(){
				var id_selector = jQuery(this).attr("id");
				var id = id_selector.substr(id_selector.length -1);
				var id = parseInt(id);
				jQuery('#myCarousel').carousel(id -1);
			});

			// When the carousel slides, auto update the text
			jQuery('#myCarousel').on('slid', function (e) {
				var id = jQuery('.item.active').data('slide-number');
				jQuery('#carousel-text').html(jQuery('#slide-content-'+id).html());
			});	
		}
	}
});