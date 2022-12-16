export default class Plugin extends Patch{
	name = "Spartan Mode"
	version = "22.12.16"
	description = "End song on first bad hit"
	author = "Katie Frogs"
	
	actions = {
		good: "continue",
		ok: "continue",
		bad: "results"
	}
	
	actionOptions = [
		"continue",
		"results",
		"retry",
		"back_to_select_song"
	]
	strings = {
		continue: ["pauseOptions", 0],
		results: ["results"],
		retry: ["pauseOptions", 1],
		back_to_select_song: ["pauseOptions", 2]
	}
	
	load(){
		this.addEdits(
			new EditFunction(Game.prototype, "skipNote").load(str => {
				return plugins.insertBefore(str,
				`this.checkSpartanMode(-1)
				`, 'circle.played(-1')
			}),
			new EditFunction(Game.prototype, "checkScore").load(str => {
				str = plugins.insertBefore(str,
				`this.checkSpartanMode(score)
				`, 'circle.played(score')
				return plugins.insertBefore(str,
				`this.checkSpartanMode(-1)
				`, 'circle.played(-1')
			}),
			new EditValue(Game.prototype, "checkSpartanMode").load(() => this.checkSpartanMode),
			new EditValue(Game.prototype, "spartanActions").load(() => this.actions)
		)
	}
	checkSpartanMode(score){
		if(this.multiplayer || this.controller.autoPlayEnabled){
			return
		}
		var scoreConversion = {
			"450": "good",
			"230": "ok",
			"0": "bad",
			"-1": "bad"
		}
		switch(this.spartanActions[scoreConversion[score]]){
			case "results":
				var remainingNotes = this.songData.circles.filter(circle => {
					var type = circle.type
					return (type === "don" || type === "ka" || type === "daiDon" || type === "daiKa") && (!circle.branch || circle.branch.active) && !circle.isPlayed
				}).length
				this.globalScore.bad += remainingNotes
				this.fadeOutStarted = -Infinity
				break
			case "retry":
				if(!debugObj.debug || !debugObj.debug.measureNum){
					setTimeout(() => this.controller.restartSong())
				}
				break
			case "back_to_select_song":
				setTimeout(() => this.controller.songSelection())
				break
		}
	}
	settings(){
		var options_lang = {}
		this.actionOptions.forEach(opt => {
			options_lang[opt] = {}
			languageList.forEach(lang => {
				var str = allStrings[lang]
				this.strings[opt].forEach(string => {
					str = str[string]
				})
				options_lang[opt][lang] = str
			})
		})
		return Object.keys(this.actions).map(name => {
			var name_lang = {}
			languageList.forEach(lang => name_lang[lang] = allStrings[lang][name])
			return {
				name: strings[name],
				name_lang: name_lang,
				description: null,
				description_lang: {},
				type: "select",
				options: this.actionOptions,
				options_lang: options_lang,
				default: this.actions[name],
				getItem: () => this.actions[name],
				setItem: value => {
					this.actions[name] = value
				}
			}
		})
	}
}
