// ==UserScript==
// @name Plugins in Old Taiko Web
// @namespace plugins-in-old-taiko-web
// @icon https://gitlab.com/uploads/-/system/project/avatar/36006078/taiko-web-plugins.png?width=64
// @version 2023.1.20
// @author Katie Frogs
// @description Implements the plugin interface in older versions of taiko-web
// @homepage https://github.com/KatieFrogs/taiko-web-plugins
// @supportURL https://github.com/KatieFrogs/taiko-web-plugins/issues
// @match https://*.lv5.ac/
// @grant none
// @run-at document-start
// ==/UserScript==

var pluginsTranslations = {
	title: {
		ja: "プラグイン",
		en: "Plugins",
		ko: "플러그인"
	},
	unloadAll: {
		ja: "すべて無効にする",
		en: "Unload All",
		ko: "모두 해제"
	},
	warning: {
		ja: "%sを読み込もうとしています。プラグインは信頼できる場合のみ読み込むようにしてください。続行しますか？",
		en: "You are about to load %s. Plugins should only be loaded if you trust them. Continue?",
		ko: "%s을 로드하려고 합니다. 신뢰할 수 있는 플러그인만 로드하시기 바랍니다. 계속할까요?"
	},
	plugin: {
		ja: {
			one: "%sつのプラグイン",
			other: "%sつのプラグイン"
		},
		en: {
			one: "%s plugin",
			other: "%s plugins"
		},
		ko: {
			one: "%s 플러그인",
			other: "%s 플러그인들"
		}
	},
	author: {
		ja: "作成者：%s",
		en: "By %s",
		ko: "제작자:%s"
	},
	version: {
		ja: "Ver. %s",
		en: "Version %s",
		ko: "버전 %s"
	},
	browse: {
		ja: "参照する…",
		en: "Browse...",
		cn: "浏览…",
		tw: "開啟檔案…",
		ko: "찾아보기…"
	},
	noPlugins: {
		ja: null,
		en: "No .taikoweb.js plugin files have been found in the provided file list.",
		ko: "주어진 파일 리스트에서 .taikoweb.js 플러그인 파일들을 발견할 수 없습니다."
	}
}
var pluginsStrings = {}
var languageList = ["ja", "en", "cn", "tw", "ko"]
function separateStrings(){
	for(var j in languageList){
		var lang = languageList[j]
		pluginsStrings[lang] = {
			id: lang
		}
		var str = pluginsStrings[lang]
		var translateObj = function(obj, name, str){
			if("en" in obj){
				for(var i in obj){
					str[name] = obj[lang] || obj.en
				}
			}else if(obj){
				str[name] = {}
				for(var i in obj){
					translateObj(obj[i], i, str[name])
				}
			}
		}
		for(var i in pluginsTranslations){
			translateObj(pluginsTranslations[i], i, str)
		}
	}
}
separateStrings()
function pluginsStr(lang){
	if(!lang){
		lang = strings.id
	}
	return pluginsStrings[lang] || allStrings[lang].plugins || pluginsStrings.en
}

class Plugins{
	constructor(...args){
		this.init(...args)
	}
	init(){
		this.allPlugins = []
		this.pluginMap = {}
		this.hashes = []
		this.startOrder = []
	}
	add(script, options){
		options = options || {}
		var hash = md5.base64(script.toString())
		var isUrl = typeof script === "string" && !options.raw
		if(isUrl){
			hash = "url " + hash
		}else if(typeof script !== "string"){
			hash = "class " + hash
		}
		var name = options.name
		if(!name && isUrl){
			name = script
			var index = name.lastIndexOf("?")
			if(index !== -1){
				name = name.slice(0, index)
			}
			var index = name.lastIndexOf("/")
			if(index !== -1){
				name = name.slice(index + 1)
			}
			if(name.endsWith(".taikoweb.js")){
				name = name.slice(0, -".taikoweb.js".length)
			}else if(name.endsWith(".js")){
				name = name.slice(0, -".js".length)
			}
		}
		name = name || "plugin"
		if(this.hashes.indexOf(hash) !== -1){
			console.warn("Skip adding an already addded plugin: " + name)
			return
		}
		var baseName = name
		for(var i = 2; name in this.pluginMap; i++){
			name = baseName + i.toString()
		}
		var plugin = new PluginLoader(script, name, hash, options.raw)
		plugin.hide = !!options.hide
		this.allPlugins.push({
			name: name,
			plugin: plugin
		})
		this.pluginMap[name] = plugin
		this.hashes.push(hash)
		return plugin
	}
	remove(name){
		if(name in this.pluginMap){
			var hash = this.pluginMap[name].hash
			if(hash){
				var index = this.hashes.indexOf(hash)
				if(index !== -1){
					this.hashes.splice(index, 1)
				}
			}
			this.unload(name)
		}
		var index = this.allPlugins.findIndex(obj => obj.name === name)
		if(index !== -1){
			this.allPlugins.splice(index, 1)
		}
		var index = this.startOrder.indexOf(name)
		if(index !== -1){
			this.startOrder.splice(index, 1)
		}
		delete this.pluginMap[name]
	}
	load(name){
		return this.pluginMap[name].load()
	}
	loadAll(){
		for(var i = 0; i < this.allPlugins.length; i++){
			this.allPlugins[i].plugin.load()
		}
	}
	start(name){
		return this.pluginMap[name].start()
	}
	startAll(){
		for(var i = 0; i < this.allPlugins.length; i++){
			this.allPlugins[i].plugin.start()
		}
	}
	stop(name){
		return this.pluginMap[name].stop()
	}
	stopAll(){
		for(var i = this.startOrder.length; i--;){
			this.pluginMap[this.startOrder[i]].stop()
		}
	}
	unload(name){
		return this.pluginMap[name].unload()
	}
	unloadAll(){
		for(var i = this.startOrder.length; i--;){
			this.pluginMap[this.startOrder[i]].unload()
		}
		for(var i = this.allPlugins.length; i--;){
			this.allPlugins[i].plugin.unload()
		}
	}
	unloadImported(){
		for(var i = this.startOrder.length; i--;){
			var plugin = this.pluginMap[this.startOrder[i]]
			if(plugin.imported){
				plugin.unload()
			}
		}
		for(var i = this.allPlugins.length; i--;){
			var obj = this.allPlugins[i]
			if(obj.plugin.imported){
				obj.plugin.unload()
			}
		}
	}

	strFromFunc(func){
		var output = func.toString()
		return output.slice(output.indexOf("{") + 1, output.lastIndexOf("}"))
	}
	argsFromFunc(func){
		var output = func.toString()
		output = output.slice(0, output.indexOf("{"))
		output = output.slice(output.indexOf("(") + 1, output.lastIndexOf(")"))
		return output.split(",").map(str => str.trim()).filter(Boolean)
	}
	insertBefore(input, insertedText, searchString){
		var index = input.indexOf(searchString)
		if(index === -1){
			throw new Error("searchString not found: " + searchString)
		}
		return input.slice(0, index) + insertedText + input.slice(index)
	}
	insertAfter(input, searchString, insertedText){
		var index = input.indexOf(searchString)
		if(index === -1){
			throw new Error("searchString not found: " + searchString)
		}
		var length = searchString.length
		return input.slice(0, index + length) + insertedText + input.slice(index + length)
	}
	strReplace(input, searchString, insertedText, repeat=1){
		var position = 0
		for(var i = 0; i < repeat; i++){
			var index = input.indexOf(searchString, position)
			if(index === -1){
				if(repeat === Infinity){
					break
				}else{
					throw new Error("searchString not found: " + searchString)
				}
			}
			input = input.slice(0, index) + insertedText + input.slice(index + searchString.length)
			position = index + insertedText.length
		}
		return input
	}
	isObject(input){
		return input && typeof input === "object" && input.constructor === Object
	}
	deepMerge(target, ...sources){
		sources.forEach(source => {
			if(this.isObject(target) && this.isObject(source)){
				for(var i in source){
					if(this.isObject(source[i])){
						if(!target[i]){
							target[i] = {}
						}
						this.deepMerge(target[i], source[i])
					}else if(source[i]){
						target[i] = source[i]
					}
				}
			}
		})
		return target
	}
	arrayDel(array, item){
		var index = array.indexOf(item)
		if(index !== -1){
			array.splice(index, 1)
			return true
		}
		return false
	}

	hasSettings(){
		for(var i = 0; i < this.allPlugins.length; i++){
			var plugin = this.allPlugins[i].plugin
			if(plugin.loaded && (!plugin.hide || plugin.settings())){
				return true
			}
		}
		return false
	}
	getSettings(){
		var items = []
		for(var i = 0; i < this.allPlugins.length; i++){
			var obj = this.allPlugins[i]
			let plugin = obj.plugin
			if(!plugin.loaded){
				continue
			}
			if(!plugin.hide){
				let description
				let description_lang
				var module = plugin.module
				if(module){
					description = [
						module.description,
						module.author ? pluginsStr().author.replace("%s", module.author) : null,
						module.version ? pluginsStr().version.replace("%s", module.version) : null
					].filter(Boolean).join("\n")
					description_lang = {}
					languageList.forEach(lang => {
						description_lang[lang] = [
							this.getLocalTitle(module.description, module.description_lang, lang),
							module.author ? pluginsStr(lang).author.replace("%s", module.author) : null,
							module.version ? pluginsStr(lang).version.replace("%s", module.version) : null
						].filter(Boolean).join("\n")
					})
				}
				var name = module && module.name || obj.name
				var name_lang = module && module.name_lang
				items.push({
					name: name,
					name_lang: name_lang,
					description: description,
					description_lang: description_lang,
					type: "toggle",
					default: true,
					getItem: () => plugin.started,
					setItem: value => {
						if(plugin.name in this.pluginMap){
							if(plugin.started && !value){
								this.stop(plugin.name)
							}else if(!plugin.started && value){
								this.start(plugin.name)
							}
						}
					}
				})
			}
			var settings = plugin.settings()
			if(settings){
				settings.forEach(setting => {
					if(!setting.name){
						setting.name = name
						if(!setting.name_lang){
							setting.name_lang = name_lang
						}
					}
					if(typeof setting.getItem !== "function"){
						setting.getItem = () => {}
					}
					if(typeof setting.setItem !== "function"){
						setting.setItem = () => {}
					}
					if(!("indent" in setting) && !plugin.hide){
						setting.indent = 1
					}
					items.push(setting)
				})
			}
		}
		return items
	}
	getLocalTitle(title, titleLang, lang){
		if(titleLang){
			for(var id in titleLang){
				if(id === (lang || strings.id) && titleLang[id]){
					return titleLang[id]
				}
			}
		}
		return title
	}
}

class PluginLoader{
	constructor(...args){
		this.init(...args)
	}
	init(script, name, hash, raw){
		this.name = name
		this.hash = hash
		if(typeof script === "string"){
			if(raw){
				this.url = URL.createObjectURL(new Blob([script], {
					type: "application/javascript"
				}))
			}else{
				this.url = script
			}
		}else{
			this.class = script
		}
	}
	load(loadErrors){
		if(this.loaded){
			return Promise.resolve()
		}else if(!this.url && !this.class){
			if(loadErrors){
				return Promise.reject()
			}else{
				return Promise.resolve()
			}
		}else{
			return (this.url ? import(this.url) : Promise.resolve({
				default: this.class
			})).then(module => {
				if(this.url){
					URL.revokeObjectURL(this.url)
					delete this.url
				}else{
					delete this.class
				}
				this.loaded = true
				try{
					this.module = new module.default()
				}catch(e){
					this.error()
					var error = new Error()
					error.stack = "Error initializing plugin: " + this.name + "\n" + e.stack
					if(loadErrors){
						return Promise.reject(error)
					}else{
						console.error(error)
						return Promise.resolve()
					}
				}
				var output
				try{
					if(this.module.beforeLoad){
						this.module.beforeLoad(this)
					}
					if(this.module.load){
						output = this.module.load(this)
					}
				}catch(e){
					this.error()
					var error = new Error()
					error.stack = "Error in plugin load: " + this.name + "\n" + e.stack
					if(loadErrors){
						return Promise.reject(error)
					}else{
						console.error(error)
						return Promise.resolve()
					}
				}
				if(typeof output === "object" && output.constructor === Promise){
					return output.catch(e => {
						this.error()
						var error = new Error()
						error.stack = "Error in plugin load promise: " + this.name + (e ? "\n" + e.stack : "")
						if(loadErrors){
							return Promise.reject(error)
						}else{
							console.error(error)
							return Promise.resolve()
						}
					})
				}
			}, e => {
				this.error()
				plugins.remove(this.name)
				if(e.name === "SyntaxError"){
					var error = new SyntaxError()
					error.stack = "Error in plugin syntax: " + this.name + "\n" + e.stack
				}else{
					var error = e
				}
				if(loadErrors){
					return Promise.reject(error)
				}else{
					console.error(error)
					return Promise.resolve()
				}
			})
		}
	}
	start(orderChange, startErrors){
		if(!orderChange){
			plugins.startOrder.push(this.name)
		}
		return this.load().then(() => {
			if(!this.started && this.module){
				this.started = true
				try{
					if(this.module.beforeStart){
						this.module.beforeStart()
					}
					if(this.module.start){
						this.module.start()
					}
				}catch(e){
					this.error()
					var error = new Error()
					error.stack = "Error in plugin start: " + this.name + "\n" + e.stack
					if(startErrors){
						return Promise.reject(error)
					}else{
						console.error(error)
						return Promise.resolve()
					}
				}
			}
		})
	}
	stop(orderChange, noError){
		if(this.loaded && this.started){
			if(!orderChange){
				var stopIndex = plugins.startOrder.indexOf(this.name)
				if(stopIndex !== -1){
					plugins.startOrder.splice(stopIndex, 1)
					for(var i = plugins.startOrder.length; i-- > stopIndex;){
						plugins.pluginMap[plugins.startOrder[i]].stop(true)
					}
				}
			}

			this.started = false
			try{
				if(this.module.beforeStop){
					this.module.beforeStop()
				}
				if(this.module.stop){
					this.module.stop()
				}
			}catch(e){
				var error = new Error()
				error.stack = "Error in plugin stop: " + this.name + "\n" + e.stack
				console.error(error)
				if(!noError){
					this.error()
				}
			}

			if(!orderChange && stopIndex !== -1){
				for(var i = stopIndex; i < plugins.startOrder.length; i++){
					plugins.pluginMap[plugins.startOrder[i]].start(true)
				}
			}
		}
	}
	unload(error){
		if(this.loaded){
			if(this.started){
				this.stop(false, error)
			}
			this.loaded = false
			plugins.remove(this.name)
			if(this.module){
				try{
					if(this.module.beforeUnload){
						this.module.beforeUnload()
					}
					if(this.module.unload){
						this.module.unload()
					}
				}catch(e){
					var error = new Error()
					error.stack = "Error in plugin unload: " + this.name + "\n" + e.stack
					console.error(error)
				}
				delete this.module
			}
		}
	}
	error(){
		if(this.module && this.module.error){
			try{
				this.module.error()
			}catch(e){
				var error = new Error()
				error.stack = "Error in plugin error: " + this.name + "\n" + e.stack
				console.error(error)
			}
		}
		this.unload(true)
	}
	settings(){
		if(this.module && this.module.settings){
			try{
				var settings = this.module.settings()
			}catch(e){
				console.error(e)
				this.error()
				return
			}
			if(Array.isArray(settings)){
				return settings
			}
		}
	}
}

class EditValue{
	constructor(...args){
		this.init(...args)
	}
	init(parent, name){
		if(name){
			if(!parent){
				throw new Error("Parent is not defined")
			}
			this.name = [parent, name]
			this.delete = !(name in parent)
		}else{
			this.original = parent
		}
	}
	load(callback){
		this.loadCallback = callback
		return this
	}
	start(){
		if(this.name){
			this.original = this.name[0][this.name[1]]
		}
		try{
			var output = this.loadCallback(this.original)
		}catch(e){
			console.error(this.loadCallback)
			var error = new Error()
			error.stack = "Error editing the value of " + this.getName() + "\n" + e.stack
			throw error
		}
		if(typeof output === "undefined"){
			console.error(this.loadCallback)
			throw new Error("Error editing the value of " + this.getName() + ": A value is expected to be returned")
		}
		if(this.name){
			this.name[0][this.name[1]] = output
		}
		return output
	}
	stop(){
		if(this.name){
			if(this.delete){
				delete this.name[0][this.name[1]]
			}else{
				this.name[0][this.name[1]] = this.original
			}
		}
		return this.original
	}
	getName(){
		var name = "unknown"
		try{
			if(this.name){
				var name = (
					typeof this.name[0] === "function" && this.name[0].name
					|| (
						typeof this.name[0] === "object" && typeof this.name[0].constructor === "function" && (
							this.name[0] instanceof this.name[0].constructor ? (() => {
								var consName = this.name[0].constructor.name || ""
								return consName.slice(0, 1).toLowerCase() + consName.slice(1)
							})() : this.name[0].constructor.name + ".prototype"
						)
					) || name
				) + (this.name[1] ? "." + this.name[1] : "")
			}
		}catch(e){
			name = "error"
		}
		return name
	}
	unload(){
		delete this.name
		delete this.original
		delete this.loadCallback
	}
}

class EditFunction extends EditValue{
	start(){
		if(this.name){
			this.original = this.name[0][this.name[1]]
		}
		if(typeof this.original !== "function"){
			console.error(this.loadCallback)
			var error = new Error()
			error.stack = "Error editing the function value of " + this.getName() + ": Original value is not a function"
			throw error
		}
		var args = plugins.argsFromFunc(this.original)
		try{
			var output = this.loadCallback(plugins.strFromFunc(this.original), args)
		}catch(e){
			console.error(this.loadCallback)
			var error = new Error()
			error.stack = "Error editing the function value of " + this.getName() + "\n" + e.stack
			throw error
		}
		if(typeof output === "undefined"){
			console.error(this.loadCallback)
			throw new Error("Error editing the function value of " + this.getName() + ": A value is expected to be returned")
		}
		try{
			var output = Function(...args, output)
		}catch(e){
			console.error(this.loadCallback)
			var error = new SyntaxError()
			var blob = new Blob([output], {
				type: "application/javascript"
			})
			var url = URL.createObjectURL(blob)
			error.stack = "Error editing the function value of " + this.getName() + ": Could not evaluate string, check the full string for errors: " + url + "\n" + e.stack
			setTimeout(() => {
				URL.revokeObjectURL(url)
			}, 5 * 60 * 1000)
			throw error
		}
		if(this.name){
			this.name[0][this.name[1]] = output
		}
		return output
	}
}

class Patch{
	constructor(...args){
		this.init(...args)
	}
	init(){
		this.edits = []
		this.addedLanguages = []
	}
	addEdits(...args){
		args.forEach(arg => this.edits.push(arg))
	}
	addLanguage(lang, forceSet, fallback="en"){
		if(fallback){
			lang = plugins.deepMerge({}, allStrings[fallback], lang)
		}
		this.addedLanguages.push({
			lang: lang,
			forceSet: forceSet
		})
	}
	beforeStart(){
		this.edits.forEach(edit => edit.start())
		this.addedLanguages.forEach(obj => {
			settings.addLang(obj.lang, obj.forceSet)
		})
	}
	beforeStop(){
		for(var i = this.edits.length; i--;){
			this.edits[i].stop()
		}
		for(var i = this.addedLanguages.length; i--;){
			settings.removeLang(this.addedLanguages[i].lang)
		}
	}
	beforeUnload(){
		this.edits.forEach(edit => edit.unload())
	}
	log(...args){
		var name = this.name || "Plugin"
		console.log(
			"%c[" + name + "]",
			"font-weight: bold;",
			...args
		)
	}
}

function readFile(file, arrayBuffer, encoding){
	var reader = new FileReader()
	var promise = pageEvents.load(reader).then(event => event.target.result)
	reader[arrayBuffer ? "readAsArrayBuffer" : "readAsText"](file, encoding)
	return promise
}

class RemoteFile{
	constructor(...args){
		this.init(...args)
	}
	init(url){
		this.url = url
		try{
			this.path = new URL(url).pathname
		}catch(e){
			this.path = url
		}
		if(this.path.startsWith("/")){
			this.path = this.path.slice(1)
		}
		if(this.url.startsWith("data:")){
			this.name = "datauri"
			if(this.url.startsWith("data:audio/ogg")){
				this.name += ".ogg"
			}
		}else{
			this.name = this.path
			var index = this.name.lastIndexOf("/")
			if(index !== -1){
				this.name = this.name.slice(index + 1)
			}
		}
	}
	arrayBuffer(){
		return loader.ajax(this.url, request => {
			request.responseType = "arraybuffer"
		})
	}
	read(encoding){
		if(encoding){
			return this.blob().then(blob => readFile(blob, false, encoding))
		}else{
			return loader.ajax(this.url)
		}
	}
	blob(){
		return loader.ajax(this.url, request => {
			request.responseType = "blob"
		})
	}
}

class LocalFile{
	constructor(...args){
		this.init(...args)
	}
	init(file, path){
		this.file = file
		this.path = path || file.webkitRelativePath || file.name
		this.webkitRelativePath = this.path
		this.url = this.path
		this.name = file.name
	}
	arrayBuffer(){
		return readFile(this.file, true)
	}
	read(encoding){
		return readFile(this.file, false, encoding)
	}
	blob(){
		return Promise.resolve(this.file)
	}
}

class CustomSongs2{
	constructor(...args){
		this.init(...args)
	}
	init(touchEnabled, noPage){
		this.loaderDiv = document.createElement("div")
		this.loaderDiv.innerHTML = assets.pages["loadsong"]
		var loadingText = this.loaderDiv.querySelector("#loading-text")
		this.setAltText(loadingText, strings.loading)
		this.locked = false
		this.mode = "main"
	}
	setAltText(element, text){
		element.innerText = text
		element.setAttribute("alt", text)
	}
	importLocal(files){
		if(!files.length){
			return Promise.reject("cancel")
		}
		this.locked = true
		this.loading(true)

		var importSongs = new ImportSongs()
		return importSongs.load(files).then(this.songsLoaded.bind(this), e => {
			this.locked = false
			this.loading(false)
			if(e === "nosongs"){
				this.showError(strings.customSongs.noSongs, "nosongs")
			}else if(e !== "cancel"){
				return Promise.reject(e)
			}
			return false
		})
	}
	loading(show){
		if(show){
			loader.screen.appendChild(this.loaderDiv)
		}else if(this.loaderDiv.parentNode){
			this.loaderDiv.parentNode.removeChild(this.loaderDiv)
		}
	}
	songsLoaded(songs){
		if(songs){
			var length = songs.length
			assets.songs = songs
			assets.customSongs = true
			assets.customSelected = +localStorage.getItem("customSelected")
		}
		pageEvents.send("import-songs", length)
		this.clean()
		return songs && songs.length
	}
	showError(text, errorName){
		this.locked = false
		this.loading(false)
		var error = new Error(text)
		error.name = errorName
		throw error
	}
	hideError(confirm){
		if(this.mode !== "error"){
			return
		}
		this.mode = "main"
		this.errorDiv.style.display = ""
		assets.sounds[confirm ? "se_don" : "se_cancel"].play()
	}
	clean(){
		delete this.loaderDiv
	}
}

class Search{
	onClick(){
		var songId = parseInt(songEl.dataset.songId)
	}
	keyPress(){
		this.proceed(parseInt(this.results[this.active].dataset.songId))
	}
}

class PluginsInOld extends Patch{
	name = "Plugins in Old Taiko Web"
	load(){
		this.style = document.createElement("style")
		this.style.appendChild(document.createTextNode(`
		.plugin-browse-button{
			position: relative;
			overflow: hidden;
		}
		#plugin-browse{
			position: absolute;
			font-size: inherit;
			top: -0.1em;
			left: -0.1em;
			right: -0.1em;
			bottom: -0.1em;
			border-radius: 0.5em;
			opacity: 0;
			cursor: pointer;
		}
		#plugin-browse::-webkit-file-upload-button{
			cursor: pointer;
		}
		.setting-value{
			position: relative;
		}`))
		this.addEdits(
			new EditValue(allStrings.ja, "intl").load(() => "ja"),
			new EditValue(allStrings.en, "intl").load(() => "en-GB"),
			new EditValue(allStrings.cn, "intl").load(() => "zh-Hans"),
			new EditValue(allStrings.tw, "intl").load(() => "zh-Hant"),
			new EditValue(allStrings.ko, "intl").load(() => "ko"),
			new EditValue(strings, "plural").load(() => new Intl.PluralRules(strings.intl)),
			new EditFunction(settings, "setLang").load(str => {
				return plugins.insertBefore(str,
				`strings.plural = new Intl.PluralRules(lang.intl)
				`, 'if(!noEvent){')
			}),
			new EditValue(settings, "addLang").load(() => this.addLang),
			new EditValue(settings, "removeLang").load(() => this.removeLang),
			new EditValue(SettingsView.prototype, "pluginsStr").load(() => pluginsStr),
			new EditFunction(SettingsView.prototype, "init").load((str, args) => {
				args.push("settingsItems", "noSoundStart")
				str = plugins.insertAfter(str, 'this.songId = songId', `
				this.customSettings = !!settingsItems
				this.settingsItems = settingsItems || settings.items
				this.locked = false`)
				str = plugins.insertBefore(str,
				`if(!noSoundStart)
					`, 'assets.sounds["bgm_settings"].playLoop')
				str = plugins.insertBefore(str,
				`if(this.customSettings){
					pageEvents.add(window, "language-change", event => this.setLang(), this.windowSymbol)
				}
				`, 'var gamepadEnabled = false')
				str = plugins.strReplace(str, 'for(let i in settings.items){\n\t\t\tvar current = settings.items[i]',
				`for(let i in this.settingsItems){
					var current = this.settingsItems[i]`)
				str = plugins.insertAfter(str, 'settingBox.classList.add("setting-box")', `
				if(current.indent){
					settingBox.style.marginLeft = (2 * current.indent || 0).toString() + "em"
				}`)
				str = plugins.strReplace(str, 'var name = strings.settings[i].name\n\t\t\tthis.setAltText(nameDiv, name)',
				`if(current.name || current.name_lang){
					var name = this.getLocalTitle(current.name, current.name_lang)
				}else{
					var name = strings.settings[i].name
				}
				this.setAltText(nameDiv, name)
				if(current.description || current.description_lang){
					settingBox.title = this.getLocalTitle(current.description, current.description_lang) || ""
				}`)
				str = plugins.strReplace(str, 'this.getValue(i, valueDiv)',
				`let outputObject = {
					id: i,
					settingBox: settingBox,
					nameDiv: nameDiv,
					valueDiv: valueDiv,
					name: current.name,
					name_lang: current.name_lang,
					description: current.description,
					description_lang: current.description_lang
				}
				if(current.type === "number"){
					["min", "max", "fixedPoint", "step", "sign", "format", "format_lang"].forEach(opt => {
						if(opt in current){
							outputObject[opt] = current[opt]
						}
					})
					outputObject.valueText = document.createTextNode("")
					valueDiv.appendChild(outputObject.valueText)
					var buttons = document.createElement("div")
					buttons.classList.add("latency-buttons")
					buttons.title = ""
					var buttonMinus = document.createElement("span")
					buttonMinus.innerText = "-"
					buttons.appendChild(buttonMinus)
					this.addTouchRepeat(buttonMinus, event => {
						this.numberAdjust(outputObject, -1)
					})
					var buttonPlus = document.createElement("span")
					buttonPlus.innerText = "+"
					buttons.appendChild(buttonPlus)
					this.addTouchRepeat(buttonPlus, event => {
						this.numberAdjust(outputObject, 1)
					})
					valueDiv.appendChild(buttons)
					this.addTouch(settingBox, event => {
						if(event.target.tagName !== "SPAN"){
							this.setValue(i)
						}
					}, true)
				}else{
					this.addTouchEnd(settingBox, event => this.setValue(i))
				}`)
				str = plugins.strReplace(str, 'this.addTouchEnd(settingBox, event => this.setValue(i))\n\t\t\tthis.items.push({\n\t\t\t\tid: i,\n\t\t\t\tsettingBox: settingBox,\n\t\t\t\tnameDiv: nameDiv,\n\t\t\t\tvalueDiv: valueDiv\n\t\t\t})\n\t\t}\n\t\tthis.items.push({\n\t\t\tid: "default",\n\t\t\tsettingBox: this.defaultButton\n\t\t})\n\t\tthis.addTouch(this.defaultButton, this.defaultSettings.bind(this))',
				`	this.items.push(outputObject)
					this.getValue(i, valueDiv)
				}
				var selectBack = this.items.length === 0
				if(this.customSettings){
					var form = document.createElement("form")
					this.browse = document.createElement("input")
					this.browse.id = "plugin-browse"
					this.browse.type = "file"
					this.browse.multiple = true
					this.browse.accept = ".taikoweb.js"
					pageEvents.add(this.browse, "change", this.browseChange.bind(this))
					form.appendChild(this.browse)
					this.browseButton = document.createElement("div")
					this.browseButton.classList.add("taibtn", "stroke-sub", "plugin-browse-button")
					this.browseText = document.createTextNode("")
					this.browseButton.appendChild(this.browseText)
					this.browseButton.appendChild(form)
					this.defaultButton.parentNode.insertBefore(this.browseButton, this.defaultButton)
					this.items.push({
						id: "browse",
						settingBox: this.browseButton
					})
				}
				this.showDefault = !this.customSettings || plugins.allPlugins.filter(obj => obj.plugin.imported).length
				if(this.showDefault){
					this.items.push({
						id: "default",
						settingBox: this.defaultButton
					})
					this.addTouch(this.defaultButton, this.defaultSettings.bind(this))
				}else{
					this.defaultButton.parentNode.removeChild(this.defaultButton)
				}`)
				str = plugins.insertAfter(str, 'this.addTouch(this.endButton, this.onEnd.bind(this))', `
				if(selectBack){
					this.selected = this.items.length - 1
					this.endButton.classList.add("selected")
				}
				if(!this.customSettings){`)
				str = plugins.strReplace(str, 'this.latencySetValue(current, event.type === "touchstart")', `this.latencySetValue(current, event.type === "touchend")`)
				str = plugins.insertBefore(str, `, true`, ')\n\t\t\tif(current !== "calibration"){')
				str = plugins.insertBefore(str,
				`}
				`, 'this.setStrings()')
				return plugins.strReplace(str, 'pageEvents.send("settings")',
				`if(this.customSettings){
					pageEvents.send("plugins")
				}else{
					pageEvents.send("settings")
				}`)
			}),
			new EditFunction(SettingsView.prototype, "addTouch").load(str => {
				return plugins.insertBefore(str,
				`if(event.cancelable)
					`, 'event.preventDefault()')
			}),
			new EditFunction(SettingsView.prototype, "getValue").load(str => {
				str = plugins.strReplace(str,
				'var current = settings.items[name]\n\t\tvar value = settings.getItem(name)',
				`if(!this.items){
					return
				}
				var current = this.settingsItems[name]
				if(current.getItem){
					var value = current.getItem()
				}else{
					var value = settings.getItem(name)
				}`)
				str = plugins.strReplace(str,
				'value = strings.settings[name][value]',
				`if(current.options_lang && current.options_lang[value]){
					value = this.getLocalTitle(value, current.options_lang[value])
				}else if(!current.getItem){
					value = strings.settings[name][value]
				}`)
				str = plugins.insertBefore(str,
				`else if(current.type === "number"){
					var mul = Math.pow(10, current.fixedPoint || 0)
					this.items[name].value = value * mul
					value = Intl.NumberFormat(strings.intl, current.sign ? {
						signDisplay: "always"
					} : undefined).format(value)
					if(current.format || current.format_lang){
						value = this.getLocalTitle(current.format, current.format_lang).replace("%s", value)
					}
					this.items[name].valueText.data = value
					return
				}
				`, 'valueDiv.innerText = value')
				return str
			}),
			new EditFunction(SettingsView.prototype, "setValue").load(str => {
				str = plugins.strReplace(str,
				'var current = settings.items[name]\n\t\tvar value = settings.getItem(name)',
				`if(this.locked){
					return
				}
				var promise
				var current = this.settingsItems[name]
				if(current.getItem){
					var value = current.getItem()
				}else{
					var value = settings.getItem(name)
				}`)
				str = plugins.insertBefore(str,
				`if(this.mode === "number"){
					return this.numberBack(this.items[this.selected])
				}
				`, 'if(this.selected === selectedIndex){')
				str = plugins.strReplace(str, 'settings.setItem(name, value)',
				`else if(current.type === "number"){
					this.mode = "number"
					selected.settingBox.style.animation = "none"
					selected.valueDiv.classList.add("selected")
					this.playSound("se_don")
					return
				}
				if(current.setItem){
					promise = current.setItem(value)
				}else{
					settings.setItem(name, value)
				}
				(promise || Promise.resolve()).then(() => {`)
				return plugins.insertAfter(str, 'this.setLang(allStrings[value])\n\t\t}', `
				})`)
			}),
			new EditFunction(SettingsView.prototype, "keyPressed").load(str => {
				str = plugins.insertBefore(str,
				`if(this.locked){
					return
				}
				`, 'if(pressed){')
				str = plugins.insertAfter(str, 'this.defaultSettings()', `
				}else if(selected.id === "browse"){
					if(event){
						this.playSound("se_don")
						this.browse.click()
					}`)
				str = plugins.strReplace(str,
				'}while(this.items[this.selected].id === "default" && name !== "left")',
				`}while((this.items[this.selected].id === "default" || this.items[this.selected].id === "browse") && name !== "left")`)
				return plugins.insertAfter(str,
				'this.latencySetAdjust(latencySelected, (name === "up" || name === "right") ? 1 : -1)', `
						if(event){
							event.preventDefault()
						}
					}
				}else if(this.mode === "number"){
					if(name === "confirm" || name === "back"){
						this.numberBack(selected)
						this.playSound(name === "confirm" ? "se_don" : "se_cancel")
					}else if(name === "up" || name === "right" || name === "down" || name === "left"){
						this.numberAdjust(selected, (name === "up" || name === "right") ? 1 : -1)
						if(event){
							event.preventDefault()
						}`)
			}),
			new EditFunction(SettingsView.prototype, "keyboardSet").load(str => {
				return plugins.strReplace(str, 'settings.items', `this.settingsItems`)
			}),
			new EditFunction(SettingsView.prototype, "gamepadSet").load(str => {
				return plugins.strReplace(str, 'settings.items', `this.settingsItems`)
			}),
			new EditFunction(SettingsView.prototype, "gamepadBack").load(str => {
				return plugins.strReplace(str, 'settings.items', `this.settingsItems`)
			}),
			new EditFunction(SettingsView.prototype, "latencySet").load(str => {
				return plugins.strReplace(str, 'settings.items', `this.settingsItems`)
			}),
			new EditFunction(SettingsView.prototype, "latencyBack").load(str => {
				return plugins.strReplace(str, 'settings.items', `this.settingsItems`)
			}),
			new EditValue(SettingsView.prototype, "numberAdjust").load(() => this.numberAdjust),
			new EditValue(SettingsView.prototype, "numberBack").load(() => this.numberBack),
			new EditFunction(SettingsView.prototype, "defaultSettings").load(str => {
				str = plugins.insertBefore(str,
				`if(this.customSettings){
					plugins.unloadImported()
					this.clean(true)
					this.playSound("se_don")
					return setTimeout(() => this.restart(), 500)
				}
				`, 'if(this.mode === "keyboard"){')
				return plugins.strReplace(str, 'settings.items', `this.settingsItems`)
			}),
			new EditValue(SettingsView.prototype, "browseChange").load(() => this.browseChange),
			new EditFunction(SettingsView.prototype, "onEnd").load(str => {
				str = plugins.insertBefore(str,
				`if(this.mode === "number"){
					this.numberBack(this.items[this.selected])
				}
				`, 'this.clean()')
				return plugins.strReplace(str, '"settings"', `this.customSettings ? "plugins" : "settings"`)
			}),
			new EditValue(SettingsView.prototype, "restart").load(() => this.restart),
			new EditValue(SettingsView.prototype, "getLocalTitle").load(() => this.getLocalTitle),
			new EditFunction(SettingsView.prototype, "setLang").load(str => {
				str = plugins.insertBefore(str,
				`if(lang)
					`, 'settings.setLang(lang)')
				return plugins.strReplace(str, 'var name = strings.settings[item.id].name\n\t\t\t\tthis.setAltText(item.nameDiv, name)',
				`if(item.name || item.name_lang){
					var name = this.getLocalTitle(item.name, item.name_lang)
				}else{
					var name = strings.settings[item.id].name
				}
				this.setAltText(item.nameDiv, name)
				if(item.description || item.description_lang){
					item.settingBox.title = this.getLocalTitle(item.description, item.description_lang) || ""
				}`)
			}),
			new EditFunction(SettingsView.prototype, "setStrings").load(str => {
				str = plugins.insertBefore(str, `this.customSettings ? this.pluginsStr().title : `, 'strings.gameSettings')
				str = plugins.insertAfter(str, 'this.setAltText(this.endButton, strings.settings.ok)', `
				if(this.customSettings){
					this.browseText.data = this.pluginsStr().browse
					this.browseButton.setAttribute("alt", this.pluginsStr().browse)
				}else{`)
				return plugins.strReplace(str,
				'this.setAltText(this.defaultButton, strings.settings.default)',
				`}
				if(this.showDefault){
					this.setAltText(this.defaultButton, this.customSettings ? this.pluginsStr().unloadAll : strings.settings.default)
				}`)
			}),
			new EditFunction(SettingsView.prototype, "clean").load((str, args) => {
				args.push("noSoundStop")
				str = plugins.insertBefore(str,
				`if(this.customSettings){
					pageEvents.remove(window, "language-change", this.windowSymbol)
				}
				if(!noSoundStop)
					`, 'assets.sounds["bgm_settings"].stop()')
				str = plugins.insertBefore(str,
				`if(this.customSettings){
					pageEvents.remove(this.browse, "change")
					delete this.browse
					delete this.browseButton
					delete this.browseText
				}else{
					`, 'this.removeTouch(this.gamepadSettings)')
				str = plugins.insertAfter(str, 'this.removeTouch(this.latencyEndButton)', `
				}`)
				return plugins.strReplace(str,
				'){\n\t\t\t\t\tURL.revokeObjectURL(assets.image[i].src)',
				` || i.startsWith("results_")){
					var img = assets.image[i]
					URL.revokeObjectURL(img.src)
					if(img.parentNode){
						img.parentNode.removeChild(img)
					}`)
			}),
			new EditValue(SongSelect.prototype, "pluginsStr").load(() => pluginsStr),
			new EditFunction(SongSelect.prototype, "init").load(str => {
				str = plugins.insertBefore(str,
				`"plugins": {
					sort: 0,
					background: "#f6bba1",
					border: ["#fde9df", "#ce7553"],
					outline: "#ce7553"
				}, `, '"default": {')
				str = plugins.insertAfter(str, 'music: song.music,', `
				chart: song.chart,
				lyricsFile: song.lyricsFile,`)
				str = plugins.insertAfter(str, 'action: "browse",\n\t\t\t\tcategory: strings.random\n\t\t\t})\n\t\t}',
				`this.songs.push({
					title: this.pluginsStr().title,
					skin: this.songSkin.plugins,
					action: "plugins",
					category: strings.random
				})`)
				return plugins.strReplace(str, 'speed: 800', `speed: 400 * 2`)
			}),
			new EditFunction(SongSelect.prototype, "toSelectDifficulty").load(str => {
				return plugins.insertAfter(str,
				'this.toBrowse()', `
				}else if(currentSong.action === "plugins"){
					this.toPlugins()`)
			}),
			new EditValue(SongSelect.prototype, "toPlugins").load(() => this.toPlugins),
			new EditValue(ImportSongs.prototype, "pluginsStr").load(() => pluginsStr),
			new EditFunction(SongSelect.prototype, "diffSelMouse").load(str => {
				return plugins.strReplace(str,
				'if(223 < x && x < 367 && 132 < y && y < 436){\n\t\t\t\treturn Math.floor((x - 223) / ((367 - 223) / 2))',
				`if(223 < x && x < 223 + 72 * this.diffOptions.length && 132 < y && y < 436){
					return Math.floor((x - 223) / 72)`)
			}),
			new EditFunction(SongSelect.prototype, "redraw").load(str => {
				return plugins.strReplace(str,
				'ms >= this.pressedKeys[key] + 50',
				`ms >= this.pressedKeys[key] + (this.state.screen === "song" && (key === "right" || key === "left") ? 20 : 50)`)
			}),
			new EditFunction(ImportSongs.prototype, "init").load((str, args) => {
				args.push("otherFiles")
				str = plugins.insertBefore(str,
				`if(!songSelect && !otherFiles){
					return
				}
				if(songSelect){
				`, 'this.songSelect = songSelect')
				str = plugins.insertBefore(str,
				`}else{
					var files = otherFiles
				}
				this.pluginFiles = []
				this.plugins = []
				`, 'this.tjaFiles = []')
				str = plugins.insertBefore(str,
				`if(name.endsWith(".taikoweb.js")){
					this.pluginFiles.push({
						file: file,
						index: i
					})
				}else `, 'if(name.endsWith(".tja")){')
				str = plugins.insertBefore(str,
				`this.pluginAmount = 0
				if(this.pluginFiles.length){
					var pluginPromises = []
					this.pluginFiles.forEach(fileObj => {
						pluginPromises.push(this.addPlugin(fileObj).catch(e => console.warn(e)))
					})
					return Promise.all(pluginPromises).then(() => {
						var startPromises = []
						if(this.plugins.length && confirm(this.pluginsStr().warning.replace("%s",
							this.pluginsStr().plugin[strings.plural.select(this.plugins.length)].replace("%s",
								this.plugins.length.toString()
							)
						))){
							this.plugins.forEach(obj => {
								var plugin = plugins.add(obj.data, {
									name: obj.name,
									raw: true
								})
								if(plugin){
									this.pluginAmount++
									plugin.imported = true
									startPromises.push(plugin.start())
								}
							})
						}
						return Promise.all(startPromises).then(this.loaded.bind(this))
					})
				}
				`, 'var metaPromises = []')
				str = plugins.insertBefore(str, `return `, 'Promise.all(metaPromises)')
				return plugins.insertBefore(str, `return `, 'Promise.all(songPromises)')
			}),
			new EditValue(ImportSongs.prototype, "load").load(() => this.importSongsLoad),
			new EditValue(ImportSongs.prototype, "addPlugin").load(() => this.addPlugin),
			new EditFunction(ImportSongs.prototype, "loaded").load(str => {
				return plugins.insertBefore(str,
				`if(!this.songSelect){
					if(this.songs.length){
						return Promise.resolve(this.songs)
					}else{
						if(this.pluginAmount || Object.keys(this.assetFiles).length){
							return Promise.resolve()
						}else{
							return Promise.reject("nosongs")
						}
					}
					return this.clean()
				}
				`, 'if(this.stylesheet.length){')
			}),
			new EditValue(loader, "cssRuleset").load(() => this.cssRuleset),
			new EditValue(p2, "disabled").load(() => 0),
			new EditFunction(p2, "open").load(str => {
				return plugins.insertBefore(str,
				`if(!this.closed || this.disabled){
					return
				}
				`, 'this.closed = false')
			}),
			new EditValue(p2, "enable").load(() => this.p2enable),
			new EditValue(p2, "disable").load(() => this.p2disable),
			new EditFunction(snd.sfxGain.soundBuffer, "load").load(str => {
				return plugins.insertBefore(str,
				`if(typeof url.arrayBuffer === "function"){
					var loadPromise = url.arrayBuffer()
				}else `, 'if(local){')
			}),
			new EditFunction(SongSelect.prototype, "getLocalTitle").load(str => {
				return plugins.strReplace(str,
				'if(id === strings.id && titleLang[id]){',
				`if(id === "en" && strings.preferEn && !(strings.id in titleLang) && titleLang.en || id === strings.id && titleLang[id]){`)
			}),
			new EditFunction(Account.prototype, "accountForm").load(str => {
				return plugins.insertAfter(str,
				'this.redrawRunning = true', `
				this.redrawPaused = 'matchMedia("(prefers-reduced-motion: reduce)").matches' === 'true'`)
			}),
			new EditFunction(Account.prototype, "customdonRedraw").load(str => {
				return plugins.insertAfter(str,
				'var frame = ', `this.redrawPaused ? 0 : `)
			}),
			new EditFunction(LoadSong.prototype, "run").load(str => {
				str = plugins.strReplace(str,
				'if(songObj.chart){',
				`if(songObj.chart && !songObj.chart.separateDiff && !(songObj.chart instanceof RemoteFile)){`)
				return plugins.strReplace(str,
				'if(songObj.music){',
				`if(songObj.music && !(songObj.chart instanceof RemoteFile)){`)
			}),
			new EditFunction(Controller.prototype, "restartSong").load(str => {
				str = plugins.strReplace(str,
				'if(songObj.chart &&',
				`if(songObj.chart && !songObj.chart.separateDiff && !(songObj.chart instanceof RemoteFile) &&`)
				return plugins.strReplace(str,
				'if(songObj.lyricsFile){',
				`if(songObj.lyricsFile && !(songObj.lyricsFile instanceof RemoteFile)){`)
			}),
		)
	}
	start(){
		document.head.appendChild(this.style)
		if(assets && assets.songsDefault){
			assets.songsDefault.forEach(song => {
				var directory = gameConfig.songs_baseurl + song.id + "/"
				var songExt = song.music_type ? song.music_type : "mp3"
				song.music = new RemoteFile(directory + "main." + songExt)
				if(song.type === "tja"){
					song.chart = new RemoteFile(directory + "main.tja")
				}else{
					song.chart = {separateDiff: true}
					for(var diff in song.courses){
						if(song.courses[diff]){
							song.chart[diff] = new RemoteFile(directory + diff + ".osu")
						}
					}
				}
				if(song.lyrics){
					song.lyricsFile = new RemoteFile(directory + "main.vtt")
				}
			})
		}
	}
	stop(){
		if(this.style.parentNode){
			this.style.parentNode.removeChild(this.style)
		}
		if(assets && assets.songsDefault){
			assets.songsDefault.forEach(song => {
				if(song.music instanceof RemoteFile){
					delete song.music
				}
				delete song.chart
				delete song.lyricsFile
			})
		}
	}
	addLang(lang, forceSet){
		allStrings[lang.id] = lang
		if(lang.categories){
			assets.categories.forEach(category => {
				if("title_lang" in category && lang.categories[category.title_lang.en]){
					category.title_lang[lang.id] = lang.categories[category.title_lang.en]
				}
			})
		}
		languageList.push(lang.id)
		this.allLanguages.push(lang.id)
		this.items.language.default = this.getLang()
		if(forceSet){
			this.storage.language = lang.id
		}else{
			try{
				this.storage.language = localStorage.getItem("lang")
			}catch(e){}
			if(this.items.language.options.indexOf(this.storage.language) === -1){
				this.storage.language = null
			}
		}
		if(settings.getItem("language") === lang.id){
			settings.setLang(lang)
		}
	}
	removeLang(lang){
		delete allStrings[lang.id]
		assets.categories.forEach(category => {
			if("title_lang" in category){
				delete category.title_lang[lang.id]
			}
		})
		var index = languageList.indexOf(lang.id)
		if(index !== -1){
			languageList.splice(index, 1)
		}
		var index = this.allLanguages.indexOf(lang.id)
		if(index !== -1){
			this.allLanguages.splice(index, 1)
		}
		this.items.language.default = this.getLang()
		try{
			this.storage.language = localStorage.getItem("lang")
		}catch(e){}
		if(this.items.language.options.indexOf(this.storage.language) === -1){
			this.storage.language = null
		}
		if(lang.id === strings.id){
			settings.setLang(allStrings[this.getItem("language")])
		}
	}
	numberAdjust(selected, add){
		var selectedItem = this.items[this.selected]
		var mul = Math.pow(10, selected.fixedPoint || 0)
		selectedItem.value += add * ("step" in selected ? selected.step : 1)
		if("max" in selected && selectedItem.value > selected.max * mul){
			selectedItem.value = selected.max * mul
		}else if("min" in selected && selectedItem.value < selected.min * mul){
			selectedItem.value = selected.min * mul
		}else{
			this.playSound("se_ka")
		}
		var valueText = Intl.NumberFormat(strings.intl, selected.sign ? {
			signDisplay: "always"
		} : undefined).format(selectedItem.value / mul)
		if(selected.format || selected.format_lang){
			valueText = this.getLocalTitle(selected.format, selected.format_lang).replace("%s", valueText)
		}
		selectedItem.valueText.data = valueText
	}
	numberBack(selected){
		this.mode = "settings"
		selected.settingBox.style.animation = ""
		selected.valueDiv.classList.remove("selected")
		var current = this.settingsItems[selected.id]
		var promise
		var mul = Math.pow(10, selected.fixedPoint || 0)
		var value = selected.value / mul
		if(current.setItem){
			promise = current.setItem(value)
		}else{
			settings.setItem(selected.id, value)
		}
		(promise || Promise.resolve()).then(() => {
			this.getValue(selected.id, selected.valueText)
		})
	}
	browseChange(event){
		this.locked = true
		var files = []
		for(var i = 0; i < event.target.files.length; i++){
			files.push(new LocalFile(event.target.files[i]))
		}
		var customSongs = new CustomSongs(this.touchEnabled, true)
		customSongs.importLocal(files).then(() => {
			this.clean(true)
			return this.restart()
		}).catch(e => {
			if(e){
				var message = e.message
				if(e.name === "nosongs"){
					message = this.pluginsStr().noPlugins
				}
				if(message){
					alert(message)
				}
			}
			this.locked = false
			this.browse.form.reset()
			return Promise.resolve()
		})
	}
	restart(){
		if(this.mode === "number"){
			this.numberBack(this.items[this.selected])
		}
		return new SettingsView(this.touchEnabled, this.tutorial, this.songId, undefined, this.customSettings ? plugins.getSettings() : undefined, true)
	}
	getLocalTitle(title, titleLang){
		if(titleLang){
			for(var id in titleLang){
				if(id === strings.id && titleLang[id]){
					return titleLang[id]
				}
			}
		}
		return title
	}
	toPlugins(){
		this.playSound("se_don")
		this.clean()
		setTimeout(() => {
			new SettingsView(this.touchEnabled, false, undefined, undefined, plugins.getSettings())
		}, 500)
	}
	importSongsLoad(files){
		return this.init(null, null, files)
	}
	addPlugin(fileObj){
		var file = fileObj.file
		var filePromise = file.read()
		return filePromise.then(dataRaw => {
			var name = file.name.slice(0, file.name.lastIndexOf(".taikoweb.js"))
			this.plugins.push({
				name: name,
				data: dataRaw
			})
		})
	}
	cssRuleset(rulesets){
		var css = []
		for(var selector in rulesets){
			var declarationsObj = rulesets[selector]
			var declarations = []
			for(var property in declarationsObj){
				var value = declarationsObj[property]
				declarations.push("\t" + property + ": " + value + ";")
			}
			css.push(selector + "{\n" + declarations.join("\n") + "\n}")
		}
		return css.join("\n")
	}
	p2enable(){
		this.disabled = Math.max(0, this.disabled - 1)
		setTimeout(this.open.bind(this), 100)
	}
	p2disable(){
		this.disabled++
		this.close()
	}
}

function ready(){
	if(typeof CustomSongs !== "undefined"){
		console.error("[Plugins in Old Taiko Web] Cannot run on new taiko-web")
		return
	}
	window.Plugins = Plugins
	window.PluginLoader = PluginLoader
	window.EditValue = EditValue
	window.EditFunction = EditFunction
	window.Patch = Patch
	window.readFile = readFile
	window.RemoteFile = RemoteFile
	window.LocalFile = LocalFile
	window.CustomSongs = CustomSongs2
	window.Search = Search
	var classes = [
		About, Account, Settings, SongSelect, AutoScore, CanvasAsset, CanvasCache, CanvasDraw, CanvasTest, Circle, Controller, Debug, InputSlider,
		Game, GameInput, Gamepad, GameRules, ImportSongs, Keyboard, LoadSong, Logo, Lyrics, Mekadon, P2Connection, ParseOsu, ParseTja, Scoresheet,
		ScoreStorage, Session, Settings, SettingsView, SongSelect, SoundBuffer, SoundGain, Sound, Titlescreen, Tutorial, View, ViewAssets
	]
	classes.forEach(cls => {
		var str = cls.toString()
		var needle1 = "class "
		var index1 = str.indexOf(needle1)
		if(index1 !== -1){
			var pos = index1 + needle1.length
			var needle2 = "{"
			var index2 = str.indexOf(needle2, pos)
			if(index2 !== -1){
				var name = str.slice(pos, index2).trim()
				if(name){
					pos = index2 + needle2.length
					var needle3 = "constructor"
					var index3 = str.indexOf(needle3, pos)
					if(index3 !== -1){
						var str = name + " = " + str.slice(0, index3 + needle3.length) + "(...args){\n\t\tthis.init(...args)\n\t}\n\tinit" + str.slice(index3 + needle3.length)
						return window.eval(str)
					}
				}
			}
		}
		throw new Error("Error attempting to fix class:", cls)
	})
	window.plugins = new Plugins()
	var plugin = plugins.add(PluginsInOld, {
		name: PluginsInOld.name,
		hide: true
	})
	plugin?.start()
}

if(typeof perf !== "undefined" && perf.allImg){
	ready()
}else{
	addEventListener("ready", ready, {once: true})
}
