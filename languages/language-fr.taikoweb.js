export default class Plugin extends Patch{
	name = "Language: French"
	name_lang = {
		fr: "Langue: Français"
	}
	version = "22.03.30"
	description = ""
	author = "Nameless, lilyuwuu"
	
	strings = {
		id: "fr",
		name: "Français",
		regex: /^fr$|^fr-/,
		font: "TnT, Meiryo, sans-serif",
		intl: "fr-CA",
		preferEn: true,
		
		taikoWeb: "Taiko Web",
		titleProceed: "Cliquez ou appuyez sur ENTRÉE!",
		titleDisclaimer: "Ce simulateur non-officiel n'a pas d'affiliation avec BANDAI NAMCO.",
		titleCopyright: null,
		selectSong: "Choix de la chanson",
		selectDifficulty: "Choix de la difficulté",
		back: "Retour",
		random: "Aléatoire",
		randomSong: "Chanson Aléatoire",
		howToPlay: "Comment Jouer",
		aboutSimulator: "À Propos du Simulateur",
		gameSettings: "Paramètres de jeu",
		songOptions: "Options de Chanson",
		none: "Aucun",
		auto: "Auto",
		netplay: "Netplay",
		easy: "Facile",
		normal: "Normal",
		hard: "Difficile",
		oni: "Extrême",
		songBranch: "Notes Divergentes",
		defaultName: "Don-chan",
		default2PName: "Katsu-chan",
		notLoggedIn: "Pas connecté(e)",
		sessionStart: "Commencer une Session en Ligne!",
		sessionEnd: "Finir Session en Ligne",
		scoreSaveFailed: "Connection au serveur échouée, votre score ne sera pas sauvegardé.\n\nVeuillez vous connecter ou rafraîchissez la page pour renvoyer votre score.",
		loadSongError: "La chanson %s avec l'ID %s ne pouvait pas être chargée.\n\n%s",
		accessNotGrantedError: "La permission d'accéder le fichier ne pouvait pas être autorisée",
		loading: "Chargement...",
		waitingForP2: "Attente de l'autre joueur...",
		cancel: "Annuler",
		note: {
			don: "Don",
			ka: "Ka",
			daiDon: "DON",
			daiKa: "KA",
			drumroll: "Roul. tambourー!!",
			daiDrumroll: "ROUL. TAMBOURー!!",
			balloon: "Ballon"
		},
		ex_note: {
			don: ["Do", "Do"],
			ka: ["Ka"],
			daiDon: ["DON", "DON"],
			daiKa: ["KA"]
		},
		combo: "Combo",
		clear: "Terminé",
		good: "BON",
		ok: "OK",
		bad: "MAUVAIS",
		branch: {
			normal: "Normal",
			advanced: "Profesionnel",
			master: "Maître"
		},
		pauseOptions: [
			"Continuer",
			"Recommencer",
			"Retour au choix de chanson"
		],
		results: "Résultats",
		points: "pts",
		maxCombo: "Combo MAX",
		drumroll: "Roulements",
		errorOccured: "Une erreur s'est produite, veuillez rafraîchir la page",
		tutorial: {
			basics: [
				"Tu dois tambouriner au moment où la note passe sur le cadre!",
				"Pour les notes rouges, frappe la surface du tambour (%s or %s)...",
				"...et pour les notes bleues, frappe le rebord! (%s or %s)",
				"Les manettes USB sont également supportés!"
			],
			otherControls: "D'autres contrôles:",
			otherTutorial: [
				"%s — mettre jeu en pause",
				"%s et %s pendant la sélection d'une chanson — naviguer les catégories",
				"%s pendant la sélection d'une difficulté — activer mode Automatique",
				"%s pendant la sélection d'une difficulté — activer mode 2J"
			],
			ok: "OK",
			key: {
				ctrl: "CTRL",
				shift: "⇧ MAJ",
				leftArrow: "←",
				rightArrow: "→",
				esc: "ÉCHAP.",
				join: "+",
				or: " où "
			}
		},
		about: {
			bugReporting: [
				"Ce simulateur est encore en cours de développement.",
				"Veuillez rapporter tout sorte de bug que vous trouvez.",
				"Vous pouvez rapporter les bugs soit via notre repositoire Git ou par e-mail."
			],
			diagnosticWarning: "Soyez certain d'inclure les données diagnostiques suivantes!",
			issueTemplate: "###### Décrivez le problème que vous avez ci-dessous. Veuillez inclure une capture d'écran et l'information diagnostique.",
			issues: "Problèmes"
		},
		session: {
			multiplayerSession: "Session Multijoueur",
			linkTutorial: "Partagez ce lien avec votre ami pour commencer à jouer ensemble! Ne quittez pas cet écran pendant qu'il se joint à toi.",
			cancel: "Annuler"
		},
		settings: {
			language: {
				name: "Langue"
			},
			resolution: {
				name: "Résolution du Jeu",
				high: "Haute",
				medium: "Moyen",
				low: "Basse",
				lowest: "Plus basse"
			},
			touchAnimation: {
				name: "Animation tactile"
			},
			keyboardSettings: {
				name: "Paramètres du Jeu",
				ka_l: "Côté Gauche",
				don_l: "Surface Gauche",
				don_r: "Surface Droite",
				ka_r: "Côté Droit"
			},
			gamepadLayout: {
				name: "Configuration de la Manette",
				a: "Type A",
				b: "Type B",
				c: "Type C"
			},
			latency: {
				name: "Latence",
				value: "Audio: %s, Vidéo: %s",
				calibration: "Calibration de la Latence",
				audio: "Audio",
				video: "Vidéo",
				drumSounds: "Sons du Tambour"
			},
			easierBigNotes: {
				name: "Notes Grandes Faciles:"
			},
			showLyrics: {
				name: "Montrer Paroles"
			},
			on: "Activé",
			off: "Désactivé",
			default: "Remettre à Défauts",
			ok: "OK"
		},
		calibration: {
			title: "Calibration de la Latence",
			ms: "%sms",
			back: "Retourner aux Paramètres",
			retryPrevious: "Réessayer Précédent",
			start: "Commencer",
			finish: "Terminer",
			audioHelp: {
				title: "Calibration de la Latence Audio",
				content: "Écoute le son qui joue dans l'arrière-plan.\n\nFrappe la surface du tambour au rythme (%s or %s) pendant que vous l'entendiez!",
				contentAlt: "Écoute le son qui joue dans l'arrière-plan.\n\nFrappe la surface du tambour au rythme pendant que vous l'entendiez"
			},
			audioComplete: "Calibration de la Latence Audio complétée!",
			videoHelp: {
				title: "Calibration de la Latence Vidéo",
				content: "Cette fois-ci, il n'y aura pas de son.\n\nAu lieu de cela, surveillez les notes qui clignotent sur le cadre en forme de cercle, frappez le tambour lorsqu'elles apparaissent!"
			},
			videoComplete: "Calibration de la Latence Vidéo complétée!",
			results: {
				title: "Résultats de calibration de la latence",
				content: "Latence sonore: %s\nLatence vidéo: %s\n\nVous pouvez modifier ces chiffres de latence dans les paramètres."
			}
		},
		account: {
			username: "Nom d'utilisateur",
			enterUsername: "Entrer nom d'util",
			password: "Mot de passe",
			enterPassword: "Entrer mot de passe",
			repeatPassword: "Répéter mot de passe",
			remember: "Se souvenir de moi",
			login: "Se connecter",
			register: "Enregistrer",
			privacy: "Confidentialité",
			registerAccount: "Enregistrer Compte",
			passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
			newPasswordsDoNotMatch: "Les nouv. mot de passes ne correspond pas",
			cannotBeEmpty: "%s ne peut pas être vide",
			error: "Une erreur s'est produite lors de votre requête",
			logout: "Déconnecter",
			back: "Retour",
			cancel: "Annuler",
			save: "Sauvegarder",
			displayName: "Nom montré",
			customdon: {
				bodyFill: "Corps",
				faceFill: "Visage",
				reset: "Réinitialiser"
			},
			changePassword: "Changer mot de passe",
			currentNewRepeat: [
				"Mot de Passe Actuel",
				"Nouveau Mot de Passe",
				"Répéter Nouveau Mot de Passe"
			],
			deleteAccount: "Supprimer Compte",
			verifyPassword: "Vérifiez votre mot de passe pour confirmer la suppression du compte"
		},
		serverError: {
			not_logged_in: "Non connecté(e)",
			invalid_username: "Nom d'utilisateur invalide, un nom d'util. peut seulement contenir des chiffres, des lettres et des traits de soulignement, et doit comporter entre 3 et 20 caractères",
			username_in_use: "Un utilisateur existe déjà avec ce nom",
			invalid_password: "Impossible d'utiliser ce mot de passe, veuillez vérifier que votre mot de passe comporte au moins 6 caractères",
			invalid_username_password: "Nom d'util. ou mot de passe est invalide",
			invalid_display_name: "Impossible d'utiliser ce nom, veuillez vérifier que votre nouveau nom comporte au maximum 25 caractères",
			invalid_don: "La sauvegarde du Don perso a échoué",
			current_password_invalid: "Le mot de passe actuel ne correspond pas",
			invalid_new_password: "Impossible d'utiliser ce mot de passe, veuillez vérifier que votre nouveau mot de passe comporte au moins 6 caractères",
			verify_password_invalid: "Le mot de passe de vérification ne correspond pas",
			invalid_csrf: "Jeton de sécurité expiré. Veuillez rafraîchir la page."
		},
		browserSupport: {
			browserWarning: "Vous utilisez un navigateur non pris en charge (%s)",
			details: "Détails...",
			failedTests: "Les tests suivants ont échoué:",
			supportedBrowser: "Veuillez utiliser un navigateur pris en charge, tel que %s"
		},
		creative: {
			creative: "Créatif",
			maker: "Créateur:"
		},
		withLyrics: "Avec paroles",
		customSongs: {
			title: "Chansons Personnalisées",
			default: "Chansons Créatives",
			description: [
				"Choisissez un dossier contenant des fichiers Taiko au format TJA pour jouer sur une liste de chansons personnalisées!"
			],
			localFolder: "Fichier Local...",
			gdriveFolder: "Google Drive...",
			gdriveAccount: "Changer de Compte...",
			dropzone: "Mettre fichiers ici",
			importError: "Erreur d'Importation",
			noSongs: "Il n'y a pas de fichiers TJA qui sont trouvés."
		},
		gpicker: {
			locale: "fr-ca",
			myDrive: "Mon Drive",
			starred: "Marqués d'une étoile",
			sharedWithMe: "Partagés avec moi",
			authError: "Erreur d'auth: %s",
			cookieError: "Cette fonction nécessite des cookies tiers."
		},
		plugins: {
			title: "Plugins",
			unloadAll: "Décharger Tout",
			warning: "Vous êtes sur le point de charger %s. Les plugins ne doivent être chargés que si vous leur faites confiance. Continuer?",

			plugin: {
				one: "%s plugin",
				other: "%s plugins",
				many: "%s plugins"
			},
			author: "Par %s",
			version: "Version %s",
			browse: "Parcourir...",
			noPlugins: "Aucun fichier plugin .taikoweb.js n'a été trouvé dans la liste de fichiers fournie."
		},
		search: {
			search: "Recherche de Chansons",
			searchInput: "Rechercher pour des chansons...",
			noResults: "Pas de résultat(s) trouvé(s).",
			tip: "Astuce:",
			tips: [
				"Ouvrez la fenêtre de recherche en appuyant sur CTRL+F!",
				"Mélangez et associez autant de filtres de recherche que vous le souhaitez!",
				"Triez par genre en utilisant le mot-clé \"genre:\"! (p. ex. \"genre:variety\", \"genre:namco\")",
				"Utilisez des filtres comme \"oni:10\" pour rechercher des chansons avec une difficulté particulière!",
				"Les filtres de difficulté prennent également en charge les portées! Essayez \"ura:1-5\"!",
				"Vous voulez voir vos combos complets? Essayez \"gold:any\", \"gold:oni\", etc.!",
				"Vous voulez seulement voir des chansons créatives? Utilisez le filtre \"creative:yes\"!",
				"Trouvez des chansons avec les paroles activées en utilisant le filtre \"lyrics:yes\"!",
				"Vous avez envie d'essayer quelque chose de nouveau? Utilisez le filtre \"played:no\" pour seulement voir des chansons que vous n'avez pas encore jouées!",
				"Vous recherchez des chansons créatives d'un créateur précis? Utilisez le filtre \"maker:<name>\"!"
			]
		},
		categories: {
			"Pop": "Pop",
			"Anime": "Anime",
			"VOCALOID™ Music": "Musique VOCALOID™",
			"Variety": "Variété",
			"Classical": "Classique",
			"Game Music": "Musique de Jeu",
			"NAMCO Original": "NAMCO Original"
		}
	}
	
	load(){
		this.addLanguage(this.strings)
	}
}
