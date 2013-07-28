/* 
* @file About SYSTEM
* @author Wade Penistone (Truemedia)
* @overview Core Regeneration Primer system used for providing information about a game, and links to external services
* @copyright Wade Penistone 2013
* @license MIT license ({@link http://opensource.org/licenses/MIT| See here})
* Git repo: {@link http://www.github.com/Truemedia/Regeneration-Primer| Regeneration Primer github repository}
* Author links: {@link http://youtube.com/MCOMediaCityOnline| YouTube} and {@link http://github.com/Truemedia| Github}
*/
define(["hgn!systems/about/about", "./Bootstrap"], function(window, jQuery) {
	return about = {
	 	init: function(){

			// Load view data via system's JSON
			jQuery.getJSON("systems/about/about.json", function(data){
			
				// Mustache
       			document.getElementById('about_window').innerHTML = window(data);
			});
			console.log("About window loaded");
		}
	}
});