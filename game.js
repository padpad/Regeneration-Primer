/* 
* @file Game file/script
* @author Wade Penistone (Truemedia)
* @overview Base script containing entire game instance and methods for controlling all the low levels functions of the game (launching, saving, closing, pausing ect)
* @copyright Wade Penistone 2013
* @license MIT license ({@link http://opensource.org/licenses/MIT| See here})
* Git repo: {@link http://www.github.com/Truemedia/Regeneration-Primer| Regeneration Primer github repository}
* Author links: {@link http://youtube.com/MCOMediaCityOnline| YouTube} and {@link http://github.com/Truemedia| Github}
*/
// Logic for the most important game events
define(function(require, exports, module) {
	return game = {
			
		// Session variables
		session: {},
		
		/* Game starts here (launcher) */
		launch: function() {
			
			game.chooseCharacter();
		},
		
		/* Choose character (Step 1) */
		chooseCharacter: function() {
			
			var jQuery = require('jQuery');
    		jQuery(document).ready( function(jQuery) {
				
				// CHARACTER SELECTION EVENT
				jQuery('#characterselection_partial').on("click", ".start_session", function(event){

					// Specific character chosen
					if(jQuery(this).attr("id") == "use_picked_char"){
						console.log("Using players choosen character: "+this.value);
						game.session.character = this.value;
					} else {
					// Choose a random character for the player
						console.log("Using random character");
						jQuery.getJSON("packages/characterselection/info/characters_advanced.json", function(all_characters_info) {
							number_of_chars = all_characters_info.characters.length - 1;
							var random_char_id = Math.floor((Math.random()*number_of_chars)+1);
							var random_char_name = all_characters_info.characters[random_char_id].identifierReference;
							game.session.character = random_char_name;
						});
					}
					
					// Deactivate selection screen
					require('characterselection.PKG').deactivate();
					
					// Activate next step
					game.chooseMap();
				});	
			});
		},
		
		/* Choose map (Step 2) */
		chooseMap: function() {

			require('diydie.PKG').init();
			
			var jQuery = require('jQuery');
    		jQuery(document).ready( function(jQuery) {
				
				// MAP SELECTION EVENT
				jQuery('#maps_partial').on("click", ".map_select", function(event){
					
					game.session.map = jQuery(this).val();
					var enabled = !jQuery(this).hasClass("disabled");
					
					// Map is enabled, will now load
					if (enabled) {
						
						// Deactivate selection screen
						require('diydie.PKG').deactivate();
						
						// Start session
						console.log("Map has been choosen: "+game.session.map);
						game.startSession(game.session.character);
					}
				});
			});
		},
		
		/* Startup the actual game environment (once the player is happy to start) */
		startSession: function(characterselected) {
			/* ..and Start the game up */
			// TODO: Hide Dev notices nicer
			var jQuery = require('jQuery');
    		jQuery('#marquee_partial').toggle();
    		
    		// Load session packages
    		var app = require('app');
    		app.session_packages(characterselected);
    		
    		// Start up MelonJS instance
    		window.onReady(function() 
    		{
    			game.onload();
    		});
		},
		
		/* Load up the game map and object instances */
		onload: function() {
			
			// Setup canvas
			var height_scroller_width = 15;
			if (!me.video.init('stage', parseInt(document.body.clientWidth) - height_scroller_width, 720)) {
				alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
				return;
			}
			
			// Build maps and map resources
			var maps = require('diydie.PKG').compileMaps();
			
			// Setup human interface devices input
			me.loader.onload = game.loaded.bind(this);
			
			// Setup all image and map data resources
			me.loader.preload(maps);

			// Load everything & display a loading screen
			me.state.change(me.state.LOADING);
		},
		
		loaded: function() {
			// set the "Play/Ingame" Screen Object
			me.state.set(me.state.PLAY, this);

			// enable the keyboard (to navigate in the map)
			require('controls.PKG').bindKeyboard();

			// start the game
			me.state.change(me.state.PLAY);
		},
		
		reset: function()
		{	
			me.game.reset();
			
			// Load a level/map
			me.levelDirector.loadLevel(game.session.map);		
		},

		
		/* Actions performed while game is running */
		onUpdateFrame: function()
		{
		
			// Check for any interaction with keyboard
			require('controls.PKG').observeKeyboard();

			// Update the frame counter
			me.timer.update();

			// Update our sprites
			me.game.update();
		
			// Draw the rest of the game
			me.game.draw();
		}
	}
});