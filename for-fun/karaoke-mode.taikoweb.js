export default class Plugin extends Patch{
	name = "Karaoke Mode"
	name_lang = {
		ja: "カラオケモード",
		cn: "卡拉OK模式",
		tw: "卡拉OK模式",
		ko: "가라오케 모드"
	}
	version = "22.04.01"
	description = "Instrumental and Vocal song modes for taiko.bui.pm"
	author = "Bui, Katie Frogs"
	
	vocalMode = false
	
	strings = {
		vocalMode: {
			name: "Vocal Mode",
			name_lang: {},
			description: null,
			description_lang: {}
		}
	}
	
	load(pluginLoader){
		plugins.pluginMap.default?.unload()
		plugins.pluginMap.pantomime?.unload()
		this.pluginLoader = pluginLoader
	}
	getHash(song){
		return this.vocalMode ? song.unique.b : song.unique.a
	}
	getMusic(song){
		if(this.pluginLoader.started && song.unique){
			return new RemoteFile("https://af22.taiko.uk/" + this.getHash(song) + ".ogg")
		}else{
			return new RemoteFile("https://s2.taiko.uk/ese/music/" + song.music_hash + ".ogg")
		}
	}
	getPreview(song){
		if(this.pluginLoader.started && song.unique){
			return new RemoteFile("https://af22.taiko.uk/preview/" + this.getHash(song) + "_preview_" + song.preview + ".ogg")
		}else{
			return new RemoteFile("https://s2.taiko.uk/ese/preview/" + song.music_hash + "_preview_" + song.preview + ".ogg")
		}
	}
	clearCache(toggleVocal){
		setTimeout(() => {
			assets.songs_ese?.forEach(song => {
				song.music = this.getMusic(song)
				if(song.preview > 0){
					song.previewMusic = this.getPreview(song)
				}
				if("sound" in song){
					song.sound.clean()
					delete song.sound
				}
			})
		}, 100)
	}
	start(){
		this.clearCache()
	}
	stop(){
		this.clearCache()
	}
	settings(){
		var str = this.strings.vocalMode
		return [{
			name: str.name,
			name_lang: str.name_lang,
			description: str.description,
			description_lang: str.description_lang,
			format: str.format,
			format_lang: str.format_lang,
			type: "toggle",
			default: this.vocalMode,
			getItem: () => this.vocalMode,
			setItem: value => {
				this.vocalMode = value
				this.clearCache(true)
			}
		}]
	}
}
