// RequireJS config
require.config({
	baseUrl: "",
	paths: {
		/* Core dependencies */
        'jQuery': "dependencies/jqueryUI/jquery-1.9.1", // jQuery core
        'Crafty': "dependencies/craftyjs/crafty-local", // Crafty core
        'KO': "dependencies/knockout/build/output/knockout-latest", // KnockoutJS core
        'jQ.xslt': "libs/jquery.xslt", // jQuery XSLT plugin (JXON)
        'jQ.xml2json': "libs/jquery.xml2json", // jQuery XML2JSON plugin (JXON)
                
        /* Game modules */
        'config': "javascript/config", // Game Config Variables
        'scores': "javascript/scores", // Scoring system
        'audio': "resource_managers/audio/audio", // Audio
        'health': "javascript/health", // Health
        'debug': "javascript/game_director/debug", // Debugging
        'init': "javascript/init", // Initialize functions
        'sprites': "javascript/sprites", // Sprites
        'controls': "javascript/controls", // Controls
        'diydie': "javascript/maps/diydie", // Current MAP
        'spawner': "javascript/spawner/spawner", // Spawner
        'gameobjects': "javascript/gameobjects", // Game Objects
        'gamedirector': "javascript/game_director/game_director", // Game Director
        'tooltip': "javascript/tooltip", // Tooltips
        'windows': "javascript/windows", // AJAX-XSLT templates
        'Gun.MOD': "interfaces/gun/gun.module", // Gun module
        
        /* jQuery plugins */
        'jQ.flyoff': "libs/jquery.flyoffpage.full", // Fly off animation
        
        /* jQuery UI files */
        'jQ.ui.widget': "dependencies/jqueryUI/ui/jquery.ui.widget", // Core widget file
        'jQ.ui.progressbar': "dependencies/jqueryUI/ui/jquery.ui.progressbar", // Progress bar
        'jQ.ui.tooltip': "dependencies/jqueryUI/ui/jquery.ui.tooltip" // Tooltip
    },
    shim: {
    	// Dependencies
    	'jQuery': {
            exports: 'jQuery'
        },
        'Crafty': {
            exports: 'Crafty'
        },
        // jQuery plugins
        'jQ.xslt': {
            deps: ['jQuery'],
            exports: 'jQuery'
        },
        'jQ.xml2json': {
            deps: ['jQuery'],
            exports: 'jQuery'
        },
        'jQ.flyoff': {
            deps: ['jQuery'],
            exports: 'jQuery'
        },
        // jQuery UI 
        'jQ.ui.widget': {
            deps: ['jQuery'],
            exports: 'jQuery'
        },
        'jQ.ui.progressbar': {
            deps: ['jQuery', 'jQ.ui.widget'],
            exports: 'jQuery'
        },
        'jQ.ui.tooltip': {
            deps: ['jQuery', 'jQ.ui.widget'],
            exports: 'jQuery'
        },
        // General game files
        'config': ['jQuery', 'Crafty'],
        'scores': ['jQuery', 'Crafty'],
        'audio': ['jQuery', 'Crafty'],
        'health': ['jQuery', 'Crafty'],
        'debug': ['jQuery', 'Crafty'],
        'init': ['jQuery', 'Crafty'],
        'sprites': ['jQuery', 'Crafty'],
        'controls': ['jQuery', 'Crafty'],
        'diydie': ['jQuery', 'Crafty'],
        'spawner': ['jQuery', 'Crafty'],
        'gameobjects': ['jQuery', 'Crafty'],
        'gamedirector': ['jQuery', 'Crafty', 'spawner'],
        'windows': ['jQuery', 'Crafty']
    }
});
// JavaScript includes
require(['jQ.xslt', 'config', 'scores', 'audio', 'health', 'debug', 'init', 'sprites', 'controls', 'diydie', 'spawner', 'gameobjects', 'gamedirector', 'windows', 'Gun.MOD', 'jQ.flyoff'], function(jQuery, Crafty, scores, audio, health, debug, init, sprites, controls, diydie, spawner, gameobjects, gamedirector, windows, Gun) {
    // Game starts here (bootstrap)
    
    jQuery(document).ready( function(jQuery){
    	// Setup initial scoring system
		scores.initialGameScoreValues();
	
		// Enable Music/Audio dialogue/Sounds
		audio.initGameAudio();
	
		// Load header and footer
		windows.init(['header', 'footer']);
	
		// When character chosen
		jQuery(".char_select").click(function (){
			/* Delete selection screen */
			jQuery(".character_selection_row").remove();
			/* Show option to bring up selection screen.. */
			jQuery("#char_selection_screen").html("<a href='index.html'>Rechoose character</a>");
			/* ..and Start the game up */
			// Initializer
			init.initGame();

			// Setup all images as sprites
			sprites.setup();

			// Controls
			controls.mapper();

			// Generate Map
			diydie.generateWorld();

			// Put in the Game Objects
			gameobjects.gameObjects(this.value);
	
			// Initialize Game Director
			gamedirector.initGameDirector(this.value);
	
			// Initialize session windows
			windows.init(["inventory", "marquee"]);
		
			// Hook up life bars
			health.lifeSetup();
		
			// Enable debugging (but hide from view)
			debug.initDebugger();
			
			// New gun module interface 
			// TODO: Use this standard for all other modules, or evolve upon it
			Gun.init();
			
			// Adapt to new scene
			windows.RearrangeForCanvas();
		});	
	
		// Give yourself points
		jQuery(".score_submit").click(function (){
			var player_id = this.value; // Button click = relevant to player
			jQuery.getJSON("constants/numbers_as_words.json", function(json) {
   				var player_number_as_word = json[player_id]; // so we can use database keys without numbers
   				scores.incrementScore(player_number_as_word);
			});
		});
	
		// Give everyone points
		jQuery("#points_incrementer").click(function (){
			jQuery.getJSON("constants/numbers_as_words.json", function(json) {
				jQuery.each(json, function(key, player_number_as_word) {
					console.log(player_number_as_word);
   					scores.incrementScore(player_number_as_word); // one, two, three, four, five, six, seven, eight
				});
			});
		});
	
		/* Marquee event handlers */
		// Mute or unmute audio
		jQuery('#marquee_window').on("click", "#audio_toggle", function(event){
			audio.toggleAudio(event);
		});
		jQuery('#marquee_window').on("mouseenter", "#audio_toggle", function(event){
			controls.hints("audio", event);
		});
		jQuery('#marquee_window').on("mouseleave", "#audio_toggle", function(event){
			controls.hints("audio", event);
		});
		
		// Enable or disable debugging UI
		jQuery('#marquee_window').on("click", "#debug_toggle", function(event){
			debug.pointsDebugger(event);
		});
		jQuery('#marquee_window').on("mouseenter", "#debug_toggle", function(event){
			controls.hints("debug", event);
		});
		jQuery('#marquee_window').on("mouseleave", "#debug_toggle", function(event){
			controls.hints("debug", event);
		});
		
		// Show control hints
		jQuery('#marquee_window').on("mouseenter", "#controls_tooltip", function(event){
			controls.hints("controls", event);
		});
		jQuery('#marquee_window').on("mouseleave", "#controls_tooltip", function(event){
			controls.hints("controls", event);
		});
		/* /Marquee event handlers */
	
		return jQuery.noConflict(true);
	});
});