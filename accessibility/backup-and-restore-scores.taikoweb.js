export default class Plugin extends Patch{
	name = "Backup and Restore Scores"
	version = "23.01.05"
	description = "Save and load score data to a file"
	author = "Katie Frogs"
	
	settingsOpts = {
		saveScores: {
			name: "Save Scores",
			name_lang: {},
			description: "Exports all the crowns and scores to a .json file",
			description_lang: {},
			options: ["Download"],
			options_lang: {},
			setItem: this.export.bind(this)
		},
		loadScores: {
			name: "Load Scores",
			name_lang: {},
			description: "Imports all the scores from a .json file, merging with existing ones",
			description_lang: {},
			options: ["Browse..."],
			options_lang: {},
			setItem: this.import.bind(this)
		}
	}
	
	strings = {
		scoresInvalid: "Selected file is not a valid scores file",
		scoresInvalid_lang: {},
		noScores: "No scores were found in the provided file",
		noScores_lang: {},
		scoresImported: "%s scores imported",
		scoresImported_lang: {},
		scoresNotImported: "Scores could not be imported, please try again",
		scoresNotImported_lang: {}
	}
	
	selectSupported = SettingsView.prototype.getValue.toString().indexOf("current.options_lang") !== -1
	
	export(){
		var obj = {}
		if(account.loggedIn){
			obj.display_name = account.displayName
			obj.don = account.don
		}else{
			obj.display_name = strings.defaultName
			obj.don = defaultDon
		}
		obj.scores = scoreStorage.prepareScores(scoreStorage.scoreStrings)
		obj.status = "ok"
		if(account.loggedIn){
			obj.username = account.username
		}else{
			obj.username = allStrings.en.defaultName
		}
		
		var text = JSON.stringify(obj) + "\n"
		var blob = new Blob([text], {
			type: "application/octet-stream"
		})
		
		var url = URL.createObjectURL(blob)
		var link = document.createElement("a")
		link.href = url
		if("download" in HTMLAnchorElement.prototype){
			link.download = "taiko-web scores.json"
		}else{
			link.target = "_blank"
		}
		link.innerText = "."
		link.style.opacity = "0"
		document.body.appendChild(link)
		setTimeout(() => {
			link.click()
			document.body.removeChild(link)
			setTimeout(() => {
				URL.revokeObjectURL(url)
			}, 5000)
		})
	}
	
	import(){
		this.cleanup()
		pageEvents.add(window, "song-select", this.cleanup.bind(this), this)
		var browse = document.createElement("input")
		this.browseButton = browse
		pageEvents.add(browse, "change", this.browseChange.bind(this))
		browse.type = "file"
		browse.style.width = "1px"
		browse.style.height = "1px"
		browse.style.opacity = "0"
		document.body.appendChild(browse)
		setTimeout(() => {
			browse.click()
		})
	}
	
	browseChange(event){
		if(event.target.files.length){
			var file = new LocalFile(event.target.files[0])
			file.read().then(data => {
				try{
					var obj = JSON.parse(data)
				}catch(e){
					alert(plugins.getLocalTitle(this.strings.scoresInvalid, this.strings.scoresInvalid_lang))
				}
				if(Array.isArray(obj.scores) && obj.scores.length){
					var scores = {}
					obj.scores.forEach(scoreObj => {
						var hash = scoreObj.hash
						var scoreString = scoreObj.score
						if(typeof hash === "string" && typeof scoreString === "string" && hash && scoreString){
							var songAdded = false
							var diffArray = scoreString.split(";")
							for(var i in scoreStorage.difficulty){
								if(diffArray[i]){
									var crown = parseInt(diffArray[i].slice(0, 1)) || 0
									var score = {
										crown: scoreStorage.crownValue[crown] || ""
									}
									var scoreArray = diffArray[i].slice(1).split(",")
									for(var j in scoreStorage.scoreKeys){
										var name = scoreStorage.scoreKeys[j]
										var value = parseInt(scoreArray[j] || 0, 36) || 0
										if(value < 0){
											value = 0
										}
										score[name] = value
									}
									if(!songAdded){
										scores[hash] = {title: null}
										songAdded = true
									}
									scores[hash][scoreStorage.difficulty[i]] = score
								}
							}
						}
					})
					var amount = 0
					for(var hash in scores){
						var oldScore = scoreStorage.scores[hash]
						if(oldScore){
							var increased = false
							for(var i in scoreStorage.difficulty){
								var diff = scoreStorage.difficulty[i]
								var oldDiff = scoreStorage.scores[hash][diff]
								var newDiff = scores[hash][diff]
								if(oldDiff && newDiff){
									if(oldDiff.points < newDiff.points){
										if(oldDiff.crown === "gold" || oldDiff.crown === "silver" && !newDiff.crown){
											newDiff.crown = oldDiff.crown
										}
										scoreStorage.scores[hash][diff] = newDiff
										increased = true
									}else if(newDiff.crown === "gold" && oldDiff.crown !== "gold" || newDiff.crown && !oldDiff.crown){
										oldDiff.crown = newDiff.crown
										increased = true
									}
								}else if(!oldDiff && newDiff){
									scoreStorage.scores[hash][diff] = newDiff
									increased = true
								}
							}
							if(increased){
								amount++
							}
						}else{
							scoreStorage.scores[hash] = scores[hash]
							amount++
						}
					}
					if(amount){
						return scoreStorage.save().then(() => {
							alert(plugins.getLocalTitle(this.strings.scoresImported, this.strings.scoresImported_lang).replace("%s", amount.toString()))
						}, () => {
							alert(plugins.getLocalTitle(this.strings.scoresNotImported, this.strings.scoresNotImported_lang))
						})
					}else{
						alert(plugins.getLocalTitle(this.strings.scoresImported, this.strings.scoresImported_lang).replace("%s", amount.toString()))
					}
				}else{
					alert(plugins.getLocalTitle(this.strings.noScores, this.strings.noScores_lang))
				}
			}).finally(() => {
				this.cleanup()
			})
		}
	}
	
	cleanup(){
		pageEvents.remove(window, "song-select", this)
		if(this.browseButton){
			pageEvents.remove(this.browseButton, "change")
			this.browseButton.remove()
			this.browseButtons = null
		}
	}
	
	unload(){
		this.cleanup()
	}
	
	settings(){
		return Object.keys(this.settingsOpts).map(name => {
			var str = this.settingsOpts[name]
			return {
				name: str.name,
				name_lang: str.name_lang,
				description: str.description,
				description_lang: str.description_lang,
				type: this.selectSupported ? "select" : "toggle",
				options: str.options,
				options_lang: str.options_lang,
				default: this.selectSupported ? str.options[0] : false,
				getItem: () => this.selectSupported ? str.options[0] : false,
				setItem: str.setItem
			}
		})
	}
}
