export default class Plugin extends Patch{
	name = "Language: French"
	name_lang = {
		fr: "Langue : Français"
	}
	version = "22.03.11"
	description = ""
	author = "Animenosekai, Katie Frogs"
	
	strings = {
		id: "fr",
		name: "Français",
		regex: /^fr$|^fr-/,
		font: "TnT, Meiryo, sans-serif",
		intl: "fr",
		preferEn: true,
		
		taikoWeb: "Taiko Web",
		titleProceed: "Appuyez sur Entrée!",
		titleDisclaimer: "Ce simulateur non-officiel n'est pas affilié à BANDAI NAMCO.",
		titleCopyright: null,
		selectSong: "Choix de la chanson",
		selectDifficulty: "Choix de la difficulté",
		back: "Retour",
		random: "Aléatoire",
		randomSong: "Chanson Aléatoire",
		howToPlay: "Comment Jouer",
		aboutSimulator: "A propos du Simulateur",
		gameSettings: "Paramètres",
		songOptions: "Paramètres de la chanson",
		none: "Aucun",
		auto: "Automatique",
		netplay: "Jouer en Ligne",
		easy: "Facile",
		normal: "Normal",
		hard: "Difficile",
		oni: "Extrême",
		songBranch: "Notes divergentes",
		defaultName: "Don-chan",
		default2PName: "Katsu-chan",
		notLoggedIn: "Non connecté",
		sessionStart: "Commencer une Partie en Ligne!",
		sessionEnd: "Finir la Partie en Ligne",
		scoreSaveFailed: "Connexion au serveur impossible, votre score n'a pas été sauvegardé.\n\nReconnectez-vous ou rafraîchissez la page pour réessayer de sauvegarder.",
		loadSongError: "Un problème est survenue lors du chargement de la chanson %s avec l'ID %s.\n\n%s",
		accessNotGrantedError: null,
		loading: "Chargement...",
		waitingForP2: "En attente d'un autre joueur...",
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
		good: "BIEN",
		ok: "OK",
		bad: "MAUVAIS",
		branch: {
			normal: "Normal",
			advanced: "Professionnel",
			master: "Maître"
		},
		pauseOptions: [
			"Continuer",
			"Réessayer",
			"Retour au choix de la chanson"
		],
		results: "Résultats",
		points: "pts",
		maxCombo: "Combo MAX",
		drumroll: "Roul. de tambour",
		errorOccured: "Une erreur est survenue, merci de rafraîchir la page",
		tutorial: {
			basics: [
				"Tu dois tambouriner au moment où la note passe sur le cadre!",
				"Pour les notes rouges, tambourine la surface (%s ou %s)...",
				"...et pour les notes bleues, tambourine le rebord! (%s ou %s)",
				"Les manettes USB sont aussi supportés!"
			],
			otherControls: "Autres Contrôles",
			otherTutorial: [
				"%s — mettre en pause",
				"%s et %s pendant la sélection d'une chanson — changer de catégorie",
				"%s pendant la sélection d'une difficulté — activer le mode automatique",
				"%s pendant la sélection d'une difficulté — activer le mode 2 Joueurs"
			],
			ok: "OK",
			key: {
				ctrl: "CTRL",
				shift: "⇧ MAJ",
				leftArrow: "←",
				rightArrow: "→",
				esc: "ÉCHAP",
				join: "+",
				or: " ou "
			}
		},
		about: {
			bugReporting: [
				"Ce simulateur est encore en phase de développement.",
				"Merci de signaler tout bug que vous trouvez.",
				"Vous pouvez les signaler depuis notre projet Git ou par email."
			],
			diagnosticWarning: "Assurez-vous d'inclure les choses suivantes!",
			issueTemplate: "###### Décrivez le problem que vous avez ci-dessous. Merci d'inclure une capture d'écran et les informations de diagnostique.",
			issues: "Problèmes"
		},
		session: {
			multiplayerSession: "Session Multijoueur",
			linkTutorial: "Partagez ce lien avec vos amis pour jouer ensemble! Ne quittez pas cet écran pendant qu'ils rejoignent.",
			cancel: "Annuler"
		},
		settings: {
			language: {
				name: "Langue"
			},
			resolution: {
				name: "Résolution du Jeu",
				high: "Elevé",
				medium: "Moyen",
				low: "Faible",
				lowest: "Très Faible"
			},
			touchAnimation: {
				name: "Animation du Toucher"
			},
			keyboardSettings: {
				name: "Paramètres du Clavier",
				ka_l: "Rebord Gauche",
				don_l: "Surface Gauche",
				don_r: "Surface Droite",
				ka_r: "Rebord Droite"
			},
			gamepadLayout: {
				name: "Réglage du type de manette",
				a: "Type A",
				b: "Type B",
				c: "Type C"
			},
			latency: {
				name: "Latence",
				value: "Audio: %s, Vidéo: %s",
				calibration: "Calibrage de la Latence",
				audio: "Audio",
				video: "Vidéo",
				drumSounds: "Sons du Tambour"
			},
			easierBigNotes: {
				name: "Grosses Notes plus Simples"
			},
			showLyrics: {
				name: "Afficher les Paroles"
			},
			on: "Activé",
			off: "Désactivé",
			default: "Réinitialiser",
			ok: "OK"
		},
		calibration: {
			title: "Calibrage de la Latence",
			ms: "%sms",
			back: "Retour aux Paramètres",
			retryPrevious: "Réessayer le Précédent",
			start: "Commencer",
			finish: "Terminer",
			audioHelp: {
				title: "Calibrage de la Latence Audio",
				content: "Ecoutez la musique qui se joue en fond.\n\nFrappez la surface du tambour (%s ou %s) en rythme!",
				contentAlt: "Ecoutez la musique qui se joue en fond.\n\nFrappez la surface du tambour en rythme!"
			},
			audioComplete: "Calibrage de la Latence Audio terminée!",
			videoHelp: {
				title: "Calibrage de la Latence Vidéo",
				content: "Cette fois-ci il n'y aura pas de son.\n\nA la place, regardez les notes sur le cadre et frappez le tambour quand elles apparaissent!"
			},
			videoComplete: "Calibrage de la Latence Vidéo terminée!",
			results: {
				title: "Résultats de la Calibration de la Latence",
				content: "Latence Audio: %s\nLatence Vidéo: %s\n\nVous pouvez configurer ces latences dans les paramètres."
			}
		},
		account: {
			username: "Nom d'Utilisateur",
			enterUsername: "Entrez votre Nom d'Utilisateur",
			password: "Mot de Passe",
			enterPassword: "Entrez votre Mot de Passe",
			repeatPassword: "Réécrivez votre Mot de Passe",
			remember: "Se Souvenir de Moi",
			login: "Se connecter",
			register: "S'inscrire",
			privacy: "Confidentialité",
			registerAccount: "Créer un Compte",
			passwordsDoNotMatch: "Les Mots de Passe ne correspondent pas",
			newPasswordsDoNotMatch: "Les nouveaux Mots de Passe ne correspondent pas",
			cannotBeEmpty: "%s ne peut être vide",
			error: "Une erreur est survenue lors du traitement de votre requête",
			logout: "Se Déconnecter",
			back: "Retour",
			cancel: "Annuler",
			save: "Sauvegarder",
			displayName: "Nom Affiché",
			customdon: {
				bodyFill: "Corps",
				faceFill: "Visage",
				reset: "Réinitialiser"
			},
			changePassword: "Changer le Mot de Passe",
			currentNewRepeat: [
				"Mot de Passe Actuel",
				"Nouveau Mot de Passe",
				"Réécrivez le Nouveau Mot de Passe"
			],
			deleteAccount: "Supprimer le Compte",
			verifyPassword: "Vérifiez le Mot de Passe pour supprimer ce compte"
		},
		serverError: {
			not_logged_in: "Non connecté",
			invalid_username: "Nom d'Utilisateur invalide, un nom d'utilisateur ne peut contenir que des lettres, des chiffres et des underscores, et doit comporter entre 3 et 20 caractères",
			username_in_use: "Un utilisateur existe déjà avec ce nom d'utilisateur",
			invalid_password: "Impossible d'utiliser ce Mot de Passe, vérifiez qu'il fait au moins 6 caractères",
			invalid_username_password: "Nom d'Utilisateur ou Mot de Passe Invalide",
			invalid_display_name: "Impossible d'utiliser ce nom, vérifiez qu'il ne fait pas plus de 25 caractères",
			invalid_don: "Echec de la sauvegarde de votre Don",
			current_password_invalid: "Le Mot de Passe actuel ne correspond pas",
			invalid_new_password: "Impossible d'utiliser ce Mot de Passe, vérifiez qu'il fait au moins 6 caractères",
			verify_password_invalid: "Le Mot de Passe de vérification ne correspond pas",
			invalid_csrf: "Le Jeton de Sécurité a expiré. Merci de rafraîchir la page."
		},
		browserSupport: {
			browserWarning: "Vous utilisez un navigateur non supporté (%s)",
			details: "Détails...",
			failedTests: "Les tests suivants ont échoués:",
			supportedBrowser: "Merci d'utiliser un navigateur supporté comme %s"
		},
		creative: {
			creative: "Créatif",
			maker: "Créateur:"
		},
		withLyrics: "Avec les Paroles",
		customSongs: {
			title: "Liste des chansons personnalisées",
			default: "Liste des chansons par défaut",
			description: [
				"Sélectionnez un dossier avec des fichiers chart Taiko dans le format TJA pour jouer avec des chansons personnalisées!"
			],
			localFolder: "Dossier local",
			gdriveFolder: "Google Drive...",
			gdriveAccount: "Changer de compte",
			dropzone: "Déposez les fichiers ici",
			importError: "Erreur d'import",
			noSongs: "Aucun fichier Taiko Chart trouvé dans le dossier sélectionné."
		},
		gpicker: {
			locale: "fr",
			myDrive: "Mon Drive",
			starred: "Suivis",
			sharedWithMe: "Partagés avec moi",
			authError: "Erreur d'authentification: %s",
			cookieError: "Cette fonction nécessite des cookies tiers."
		},
		plugins: {
			title: null,
			unloadAll: null,
			warning: null,
			plugin: null,
			author: null,
			version: null
		},
		search: {
			search: null,
			searchInput: null,
			noResults: null,
			tip: null,
			tips: null
		},
		categories: {
			"Pop": "Pop",
			"Anime": "Anime",
			"VOCALOID™ Music": "VOCALOID™ Music",
			"Variety": "Variétés",
			"Classical": "Classique",
			"Game Music": "Música de juegos",
			"NAMCO Original": "NAMCO Original"
		}
	}
	
	load(){
		this.addLanguage(this.strings)
	}
}
