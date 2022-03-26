export default class Plugin extends Patch{
	name = "Language: English"
	name_lang = {
		en: "Language: English"
	}
	version = "22.03.26"
	description = ""
	author = ""
	
	strings = {
		id: "en2",
		name: "English",
		regex: /^en$|^en-/,
		font: "TnT, Meiryo, sans-serif",
		intl: "en-GB",
		preferEn: true,
		
		taikoWeb: "Taiko Web",
		titleProceed: "Click or Press Enter!",
		titleDisclaimer: "This unofficial simulator is unaffiliated with BANDAI NAMCO.",
		titleCopyright: "Taiko no Tatsujin ©&™ 2011 BANDAI NAMCO Entertainment Inc.",
		selectSong: "Select Song",
		selectDifficulty: "Select Difficulty",
		back: "Back",
		random: "Random",
		randomSong: "Random Song",
		howToPlay: "How to Play",
		aboutSimulator: "About Simulator",
		gameSettings: "Game Settings",
		songOptions: "Song Options",
		none: "None",
		auto: "Auto",
		netplay: "Netplay",
		easy: "Easy",
		normal: "Normal",
		hard: "Hard",
		oni: "Extreme",
		songBranch: "Diverge Notes",
		defaultName: "Don-chan",
		default2PName: "Katsu-chan",
		notLoggedIn: "Not logged in",
		sessionStart: "Begin an Online Session!",
		sessionEnd: "End Online Session",
		scoreSaveFailed: "Could not connect to the server, your score has not been saved.\n\nPlease log in or refresh the page to try saving the score again.",
		loadSongError: "Could not load song %s with ID %s.\n\n%s",
		accessNotGrantedError: "Permission to access the file was not granted",
		loading: "Loading...",
		waitingForP2: "Waiting for Another Player...",
		cancel: "Cancel",
		note: {
			don: "Don",
			ka: "Ka",
			daiDon: "DON",
			daiKa: "KA",
			drumroll: "Drum rollー!!",
			daiDrumroll: "DRUM ROLLー!!",
			balloon: "Balloon"
		},
		ex_note: {
			don: ["Do", "Do"],
			ka: ["Ka"],
			daiDon: ["DON", "DON"],
			daiKa: ["KA"]
		},
		combo: "Combo",
		clear: "Clear",
		good: "GOOD",
		ok: "OK",
		bad: "BAD",
		branch: {
			normal: "Normal",
			advanced: "Professional",
			master: "Master"
		},
		pauseOptions: [
			"Continue",
			"Retry",
			"Back to Select Song"
		],
		results: "Results",
		points: "pts",
		maxCombo: "MAX Combo",
		drumroll: "Drumroll",
		errorOccured: "An error occurred, please refresh",
		tutorial: {
			basics: [
				"When a note overlaps the frame, that is your cue to hit the drum!",
				"For red notes, hit the surface of the drum (%s or %s)...",
				"...and for blue notes, hit the rim! (%s or %s)",
				"USB controllers are also supported!"
			],
			otherControls: "Other controls",
			otherTutorial: [
				"%s — pause game",
				"%s and %s while selecting song — navigate categories",
				"%s while selecting difficulty — enable autoplay mode",
				"%s while selecting difficulty — enable 2P mode"
			],
			ok: "OK",
			key: {
				ctrl: "CTRL",
				shift: "⇧ SHIFT",
				leftArrow: "←",
				rightArrow: "→",
				esc: "ESC",
				join: "+",
				or: " or "
			}
		},
		about: {
			bugReporting: [
				"This simulator is still in development.",
				"Please report any bugs you find.",
				"You can report bugs either via our Git repository or email."
			],
			diagnosticWarning: "Be sure to include the following diagnostic data!",
			issueTemplate: "###### Describe the problem you are having below. Please include a screenshot and the diagnostic information.",
			issues: "Issues"
		},
		session: {
			multiplayerSession: "Multiplayer Session",
			linkTutorial: "Share this link with your friend to start playing together! Do not leave this screen while they join.",
			cancel: "Cancel"
		},
		settings: {
			language: {
				name: "Language"
			},
			resolution: {
				name: "Game Resolution",
				high: "High",
				medium: "Medium",
				low: "Low",
				lowest: "Lowest"
			},
			touchAnimation: {
				name: "Touch Animation"
			},
			keyboardSettings: {
				name: "Keyboard Settings",
				ka_l: "Left Rim",
				don_l: "Left Surface",
				don_r: "Right Surface",
				ka_r: "Right Rim"
			},
			gamepadLayout: {
				name: "Gamepad Layout",
				a: "Type A",
				b: "Type B",
				c: "Type C"
			},
			latency: {
				name: "Latency",
				value: "Audio: %s, Video: %s",
				calibration: "Latency Calibration",
				audio: "Audio",
				video: "Video",
				drumSounds: "Drum Sounds"
			},
			easierBigNotes: {
				name: "Easier Big Notes"
			},
			showLyrics: {
				name: "Show Lyrics"
			},
			on: "On",
			off: "Off",
			default: "Reset to Defaults",
			ok: "OK"
		},
		calibration: {
			title: "Latency Calibration",
			ms: "%sms",
			back: "Back to Settings",
			retryPrevious: "Retry Previous",
			start: "Start",
			finish: "Finish",
			audioHelp: {
				title: "Audio Latency Calibration",
				content: "Listen to a sound playing in the background.\n\nHit the surface of the drum (%s or %s) as you hear it!",
				contentAlt: "Listen to a sound playing in the background.\n\nHit the surface of the drum as you hear it!"
			},
			audioComplete: "Audio Latency Calibration completed!",
			videoHelp: {
				title: "Video Latency Calibration",
				content: "This time there will be no sounds.\n\nInstead, watch for notes blinking on the circle-shaped frame, hit the drum as they appear!"
			},
			videoComplete: "Video Latency Calibration completed!",
			results: {
				title: "Latency Calibration Results",
				content: "Audio latency: %s\nVideo latency: %s\n\nYou can configure these latency values in the settings."
			}
		},
		account: {
			username: "Username",
			enterUsername: "Enter Username",
			password: "Password",
			enterPassword: "Enter Password",
			repeatPassword: "Repeat Password",
			remember: "Remember me",
			login: "Log In",
			register: "Register",
			privacy: "Privacy",
			registerAccount: "Register account",
			passwordsDoNotMatch: "Passwords do not match",
			newPasswordsDoNotMatch: "New passwords do not match",
			cannotBeEmpty: "%s cannot be empty",
			error: "An error occurred while processing your request",
			logout: "Log Out",
			back: "Back",
			cancel: "Cancel",
			save: "Save",
			displayName: "Displayed Name",
			customdon: {
				bodyFill: "Body",
				faceFill: "Face",
				reset: "Reset"
			},
			changePassword: "Change Password",
			currentNewRepeat: [
				"Current Password",
				"New Password",
				"Repeat New Password"
			],
			deleteAccount: "Delete Account",
			verifyPassword: "Verify password to delete this account"
		},
		serverError: {
			not_logged_in: "Not logged in",
			invalid_username: "Invalid username, a username can only contain letters, numbers, and underscores, and must be between 3 and 20 characters long",
			username_in_use: "A user already exists with that username",
			invalid_password: "Cannot use this password, please check that your password is at least 6 characters long",
			invalid_username_password: "Invalid Username or Password",
			invalid_display_name: "Cannot use this name, please check that your new name is at most 25 characters long",
			invalid_don: "Could not save your custom Don",
			current_password_invalid: "Current password does not match",
			invalid_new_password: "Cannot use this password, please check that your new password is at least 6 characters long",
			verify_password_invalid: "Verification password does not match",
			invalid_csrf: "Security token expired. Please refresh the page."
		},
		browserSupport: {
			browserWarning: "You are running an unsupported browser (%s)",
			details: "Details...",
			failedTests: "The following tests have failed:",
			supportedBrowser: "Please use a supported browser such as %s"
		},
		creative: {
			creative: "Creative",
			maker: "Maker:"
		},
		withLyrics: "With lyrics",
		customSongs: {
			title: "Custom Song List",
			default: "Creative Song List",
			description: [
				"Pick a folder with Taiko chart files in TJA format to play on a custom song list!"
			],
			localFolder: "Local Folder...",
			gdriveFolder: "Google Drive...",
			gdriveAccount: "Switch Accounts",
			dropzone: "Drop files here",
			importError: "Import Error",
			noSongs: "No Taiko chart files have been found in the provided folder."
		},
		gpicker: {
			locale: "en-GB",
			myDrive: "My Drive",
			starred: "Starred",
			sharedWithMe: "Shared with me",
			authError: "Auth error: %s",
			cookieError: "This function requires third party cookies."
		},
		plugins: {
			title: "Plugins",
			unloadAll: "Unload All",
			warning: "You are about to load %s. Plugins should only be loaded if you trust them. Continue?",
			// The next string uses the following code to select the correct string:
			// new Intl.PluralRules(strings.intl).select(number)
			plugin: {
				one: "%s plugin",
				other: "%s plugins"
			},
			author: "By %s",
			version: "Version %s",
			browse: "Browse...",
			noPlugins: "No .taikoweb.js plugin files have been found in the provided file list."
		},
		search: {
			search: "Search Songs",
			searchInput: "Search for songs...",
			noResults: "No results found.",
			tip: "Tip:",
			tips: [
				"Open the search window by pressing CTRL+F!",
				"Mix and match as many search filters as you want!",
				"Filter by genre by using the \"genre:\" keyword! (e.g. \"genre:variety\", \"genre:namco\")",
				"Use filters like \"oni:10\" to search for songs with a particular difficulty!",
				"Difficulty filters support ranges, too! Try \"ura:1-5\"!",
				"Want to see your full combos? Try \"gold:any\", \"gold:oni\", etc.!",
				"Only want to see creative songs? Use the \"creative:yes\" filter!",
				"Find songs with lyrics enabled with the \"lyrics:yes\" filter!",
				"Feel like trying something new? Use the \"played:no\" filter to only see songs you haven't played yet!",
				"Looking for creative courses from a specific creator? Use the \"maker:<name>\" filter!"
			]
		},
		categories: {
			"Pop": "Pop",
			"Anime": "Anime",
			"VOCALOID™ Music": "VOCALOID™ Music",
			"Variety": "Variety",
			"Classical": "Classical",
			"Game Music": "Game Music",
			"NAMCO Original": "NAMCO Original"
		}
	}
	
	load(){
		this.addLanguage(this.strings)
	}
}
