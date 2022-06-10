export default class Plugin extends Patch{
	name = "Language: Spanish (Latin America)"
	name_lang = {
		"es-419": "Idioma: Español (Latinoamérica)"
	}
	version = "22.03.11"
	description = ""
	author = "Glas, Katie Frogs"
	
	strings = {
		id: "es-419",
		name: "Español (Latinoamérica)",
		regex: /^es$|^es-(?!ES$)/,
		font: "spanishFont, TnT, Meiryo, sans-serif",
		intl: "es-419",
		preferEn: true,
		
		taikoWeb: "Taiko Web",
		titleProceed: "Has clic o presiona Enter!",
		titleDisclaimer: "Este simulador no-oficial no está afiliado a BANDAI NAMCO.",
		titleCopyright: null,
		selectSong: "Seleccionar canción",
		selectDifficulty: "Seleccionar dificultad",
		back: "Regresar",
		random: "Aleatoria",
		randomSong: "Canción Aleatoria",
		howToPlay: "Como Jugar",
		aboutSimulator: "Acerca del simulador",
		gameSettings: "Opciones del juego",
		songOptions: "Opciones de canción",
		none: "Ninguno",
		auto: "Auto",
		netplay: "Multijugador",
		easy: "Fácil",
		normal: "Normal",
		hard: "Difícil",
		oni: "Extremo",
		songBranch: "Notas Divergentes",
		defaultName: "Don-chan",
		default2PName: "Katsu-chan",
		notLoggedIn: "No Conectado",
		sessionStart: "Comienza una sesión en linea",
		sessionEnd: "Terminar sesión",
		scoreSaveFailed: "No se pudo conectar con el servidor, tu puntaje no ha sido guardado. \n\n Por favor inicia sesión nuevamente o recarga la pagina para guardar tu puntaje nuevamente",
		loadSongError: "No se pudo cargar la canción %s con el id %s.\n\n%s",
		accessNotGrantedError: "No se otorgaron permisos para acceder a este archivo.",
		loading: "Cargando",
		waitingForP2: "Esperando al otro jugador...",
		cancel: "Cancelar",
		note: {
			don: "Don",
			ka: "Ka",
			daiDon: "DON",
			daiKa: "KA",
			drumroll: "¡Redobleー!",
			daiDrumroll: "REDOBLEー!!",
			balloon: "Globo"
		},
		ex_note: {
			don: ["Do", "Do"],
			ka: ["Ka"],
			daiDon: ["DON", "DON"],
			daiKa: ["KA"]
		},
		combo: "Combo",
		clear: "Completado",
		good: "BIEN",
		ok: "OK",
		bad: "MAL",
		branch: {
			normal: "Normal",
			advanced: "Profesional",
			master: "Maestro"
		},
		pauseOptions: [
			"Continuar",
			"Reintentar",
			"Regresar al menú principal"
		],
		results: "Resultados",
		points: "pts",
		maxCombo: "Combo máximo",
		drumroll: "Redobles",
		errorOccured: "Ha ocurrido un error, recarga la pagina por favor.",
		tutorial: {
			basics: [
				"Cuando una nota esté sobre el marco, es tu momento de golpear el tambor!",
				"Para las notas rojas, golpea el centro del tambor (%s or %s)...",
				"...y para las notas azules, golpea el borde!! (%s or %s)",
				"Se puede jugar con controles USB!"
			],
			otherControls: "Otros controles",
			otherTutorial: [
				"%s — pausa el juego",
				"%s y %s mientras escojes una canción — cambia de categoría",
				"%s mientras escojes dificultad — activa el modo automático",
				"%s mientras escojes dificultad — activa el modo 2 jugadores"
			],
			ok: "OK",
			key: {
				ctrl: null,
				shift: null,
				leftArrow: null,
				rightArrow: null,
				esc: null,
				join: null,
				or: " o "
			}
		},
		about: {
			bugReporting: [
				"Este Simulador aun esta en desarrollo.",
				"Por favor reporta cualquier error que encuentres.",
				"Puedes reportar los errores en nuestro repositorio de Git o vía email."
			],
			diagnosticWarning: "Asegurate de incluir los siguientes datos de diagnostico!",
			issueTemplate: "###### Describe el problema que tuviste abajo, También incluye in screenshot y la información de diagnostico.",
			issues: "Incidencias"
		},
		session: {
			multiplayerSession: "Sesión Multijugador",
			linkTutorial: "Comparte este enlace con tu amigo para jugar juntos! NO Cierres esta ventana mientras se conecta al juego.",
			cancel: "Cancelar"
		},
		settings: {
			language: {
				name: "Idioma"
			},
			resolution: {
				name: "Resolución del juego",
				high: "Alto",
				medium: "Medio",
				low: "Bajo",
				lowest: "Lo mas bajo"
			},
			touchAnimation: {
				name: "Animación de toque"
			},
			keyboardSettings: {
				name: "Mapeo del teclado",
				ka_l: "Borde izquierdo",
				don_l: "Superficie izquierda",
				don_r: "Superficie derecha",
				ka_r: "Borde derecho"
			},
			gamepadLayout: {
				name: "Configuración del Gamepad",
				a: "Tipo A",
				b: "Tipo B",
				c: "Tipo C"
			},
			latency: {
				name: "Latencia",
				value: "Audio: %s, Video: %s",
				calibration: "Calibración de latencia",
				audio: "Audio",
				video: "Video",
				drumSounds: "Sonidos del Tambor"
			},
			easierBigNotes: {
				name: "Notas grandes mas fáciles"
			},
			showLyrics: {
				name: "Mostrar letras"
			},
			on: "Encendido",
			off: "Apagado",
			default: "Reiniciar configuración",
			ok: "OK"
		},
		calibration: {
			title: "Calibración de latencia",
			ms: "%sms",
			back: "Regresar a opciones",
			retryPrevious: "Reintentar Anterior",
			start: "Comenzar",
			finish: "Terminar",
			audioHelp: {
				title: "Calibración de latencia de audio",
				content: "Escucha el sonido que suena en el fondo.\n\nGolpea la superficie del tambor (%s or %s) cuando lo escuches!",
				contentAlt: "Escucha un sonido de fondo.\n\nGolpea la superficie del tambor (%s or %s) cuando lo escuches!"
			},
			audioComplete: "Calibración de latencia de audio completada!",
			videoHelp: {
				title: "Calibración de latencia de video",
				content: "Esta vez no habrán sonidos.\n\nEn cambio, observa las notas parpadeantes con forma de circulo, golpea el tambor cuando según vayan apareciendo!"
			},
			videoComplete: "Calibración de latencia de video completada!",
			results: {
				title: "Resultados de calibración de latencia",
				content: "Latencia de Audio: %s\nLatencia de Video: %s\n\nPuedes configurar estos valores manualmente en el menú de opciones."
			}
		},
		account: {
			username: "Usuario",
			enterUsername: "Ingrese Usuario",
			password: "Contraseña",
			enterPassword: "Ingrese Contraseña",
			repeatPassword: "Repetir contraseña",
			remember: "Recordar datos",
			login: "Iniciar sesión",
			register: "Crear cuenta",
			privacy: "Privacidad",
			registerAccount: "Registrar Cuenta",
			passwordsDoNotMatch: "Las contraseñas no coinciden",
			newPasswordsDoNotMatch: "Las nuevas contraseñas no coinciden",
			cannotBeEmpty: "%s no puede estar vació",
			error: "Ha ocurrido un error mientras procesamos tu solicitud",
			logout: "Cerrar Sesión",
			back: "Regresar",
			cancel: "Cancelar",
			save: "Guardar",
			displayName: "Nombre a mostrar",
			customdon: {
				bodyFill: "Cuerpo",
				faceFill: "Cara",
				reset: "Reiniciar"
			},
			changePassword: "Cambiar Contraseña",
			currentNewRepeat: [
				"Contraseña Actual",
				"Nueva Contraseña",
				"Repetir nueva contraseña"
			],
			deleteAccount: "Eliminar cuenta",
			verifyPassword: "Verifica la contraseña para eliminar esta cuenta"
		},
		serverError: {
			not_logged_in: "No conectado",
			invalid_username: "Usuario Invalido, un usuario puede solo contener letras, números y guion-bajo. Ademas debe tener entre 3 y 20 caracteres de largo",
			username_in_use: "Ya existe un usuario con este nombre",
			invalid_password: "No se puede usar esta contraseña, por favor verifica que tu contraseña tenga al menos 6 caracteres de largo",
			invalid_username_password: "Usuario o contraseña inválidos",
			invalid_display_name: "No se puede usar este nombre, por favor verifica que tu nuevo nombre tenga hasta 25 caracteres de largo",
			invalid_don: "No se pudo guardar tu Don personalizado",
			current_password_invalid: "La contraseña actual no coincide",
			invalid_new_password: "No se puede usar este contraseña, por favor verifica que al menos tenga 6 caracteres de largo como minimo",
			verify_password_invalid: "La contraseña de verificación no coincide",
			invalid_csrf: "Ha expirado el Token de seguridad. Por favor recarga la pagina."
		},
		browserSupport: {
			browserWarning: "Estas usando un navegador no compatible (%s)",
			details: "Detalles...",
			failedTests: "Las siguientes pruebas han fallado:",
			supportedBrowser: "Por favor utilice un navegador compatible como %s"
		},
		creative: {
			creative: "Creativo",
			maker: "Creador:"
		},
		withLyrics: "Con letras",
		customSongs: {
			title: "Lista personalizada",
			default: "Lista de canciones por defecto",
			description: [
				"Escoje una carpeta con archivos de partitura Taiko en formato TJA para jugar tu lista personalizada!"
			],
			localFolder: "Carpeta Local...",
			gdriveFolder: "Google Drive...",
			gdriveAccount: "Cambiar cuentas",
			dropzone: "Arrastra tus archivos aquí",
			importError: "Error al importar",
			noSongs: "No se han encontrado archivos de partitura Taiko en la carpeta que entregaste."
		},
		gpicker: {
			locale: "es-419",
			myDrive: "Mi unidad",
			starred: "Destacados",
			sharedWithMe: "Compartidos conmigo",
			authError: "Error de Autenticación: %s",
			cookieError: "Esta función requiere Cookies de terceros."
		},
		plugins: {
			title: "Módulos",
			unloadAll: "Desactivar todos",
			warning: "Vas a cargar %s. Los módulos solo deberían ser cargados si confias en ellos, ¿Deseas continuar?",
			plugin: {
				one: "modulo de %s",
				other: "módulos de %s",
				many: "módulos de %s"
			},
			author: "por %s",
			version: "Versión %s"
		},
		search: {
			search: "Buscar Canciones",
			searchInput: "Busca canciones aquí...",
			noResults: "No se han encontrado resultados.",
			tip: "Tip:",
			tips: [
				"Abre la ventana de búsqueda presionando CTRL+F!",
				"Usa uno o mas filtros de búsqueda! Todos los que quieras!",
				"Filtra por genero musical utilizando la palabra clave \"genre:\"! (Ej: \"genre:variety\", \"genre:namco\")",
				"Usa filtros como \"oni:10\" para buscar canciones con una dificultad en particular!",
				"Los filtros de dificultad también soportan rangos! Intenta con: \"ura:1-5\"!",
				"¿Quieres ver solamente tus Full Combos? Intenta con: \"gold:any\", \"gold:oni\", etc.!",
				"¿Quieres solo ver canciones creativas/custom? Prueba con el filtro \"creative:yes\"!",
				"Busca canciones que tengan letras/lyrics disponibles con el filtro \"lyrics:yes\" !",
				"¿Te gustaría probar algo nuevo? Utiliza el filtro \"played:no\" para ver canciones que no hayas jugado nunca antes!",
				"¿Buscas canciones hechas por un creador en particular? Utiliza el filtro \"maker:<name>\"!"
			]
		},
		categories: {
			"Pop": "Pop",
			"Anime": "Anime",
			"VOCALOID™ Music": "Música VOCALOID™",
			"Variety": "Variados",
			"Classical": "Clásica",
			"Game Music": "Musica de Juegos",
			"NAMCO Original": "Originales de NAMCO"
		}
	}
	
	load(){
		this.addLanguage(this.strings)
		
		this.font = new FontFace("spanishFont", "url('" + spanishFont() + "')")
		return this.font.load().then(font => document.fonts.add(font))
	}
	unload(){
		if(this.font){
			document.fonts.delete(this.font)
			delete this.font
		}
	}
}

function spanishFont(){
	return "data:font/woff2;base64,d09GMgABAAAAAAP4ABAAAAAAB4AAAAOgAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAABlYAglIICAkREQgKhVCEbAsOAAE2AiQDGAQgBYFAByAMExckGBgb9QVRlC1KGeIjtRuu8bK6wfP0Xu+5M9lsHoxKwBbkV5sG7CKo/PenasbS2MLco0wLeNIhXqDEOsYE6X3t1WVRaW7iFqReK1LZq25MFAdG2ES3bhHQBohaKtNxYCkUAH26gpycd1MaC+nHA2I5AfAFKN2gagmKs4Lvurvdnek6q1AAtG5EIpJSGY3wBtnnWVgoYAU3+G7bC4+2lnYuOxBBIyYIkYgCFL8v0NEgNA7Crxm5Q8gk23beZMmUGaY+DhDbRgFgAuAJmCBOkHsyXj+uhseFh0Y0Di/tqnpVRiTcrXc3ZpHHpBwu1B7usQeBs92fJG9M3yojMjZZXNoGOXM+7w7aEzJPRZG42n3i2tE/o\
hNv5FLWVZOkBTBoXNSSsOFhC8Clbh6oO09G1L1Td7mTWiFiO3sh80KE1RH17jZL9FJZGjw3ea1vzdzkMamOC4GuOnpE+IiCB1VsHl6l0cmV8mQu/378LLGaK3Solqf23Tj0SJ0lqDP8xDN7JeeGLw32alVkhFAtPDvUrLoityOb9SSEFPGY1Iu5W09YWxu8UcTm/U/+Njp2rHzmvoB6Ma0SOuUrFhpaLKRS++k+k3ytQomex47FJiwr9LNQr/y5+/WLjT2UKzFx0D7PYpZvv1wWkb0aln3TwvDx98zSLDz4frBPy1WWj793t6jo4Ll0sUPb+jVLqqAgb4e3di+xxZVWN6JrXe1WrnPb+VO3Zam3oFLJtNzddieUjqyhsiQ+GjeKKQmRisbWJjn8Ax2hZZceSGnbLtBrc86YvOUTSsWmmu777s6636RANs9uhQMDNs+PLvKtfpaiwUz7XcJj0ykzIjbQOThbSrXUiFP5vCLiQgc586R+n\
O1qmLdcqwKl81ul62kd60vxxIBaOetk5okaWmtDqN+D2rXNJ2XLZt336HYsk9ovSmXmulq0RHhFxIjSQhu6+Pr4mj57XwZFX1sbWAMABBB4ketYm2Y+hX9bHgYA6+td6g7wpOyNYyTbq3Ue3QKwUAAI/C2eggGAzoOQ+6YBtLfIK4brVmRVs0lGAJN+m6kBBdZmADhpiEYMNwBgCYJCgcLCBE1+fMFAUREc+FP1PBNFS6A1UJJudKMTUJZudKX3dHxP2tGGWHKSlewJChJL60YushQ+J9lTObcarksbetKLDmjFEmu9TAPAv+vkhN9ze/FKNesfEBsiDgA0mDIG8UXy/AeMbPZqjusWgHzRiu5+oZDdSMInIE9XAAA="
}
