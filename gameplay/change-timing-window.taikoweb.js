export default class Plugin extends Patch{
	name = "Change Timing Window"
	version = "22.02.28"
	description = "Custom input interval for in-game notes"
	author = "Katie Frogs"
	
	score = {
		good: 25,
		ok: 75,
		bad: 108
	}
	disableMultiplayer = true
	
	strings = {
		good: {
			name: "GOOD",
			name_lang: {},
			description: "Default: 25ms",
			description_lang: {},
			format: "%sms",
			format_lang: {}
		},
		ok: {
			name: "OK",
			name_lang: {},
			description: "Default: 75ms",
			description_lang: {},
			format: "%sms",
			format_lang: {}
		},
		bad: {
			name: "BAD",
			name_lang: {},
			description: "Default: 108ms",
			description_lang: {},
			format: "%sms",
			format_lang: {}
		}
	}
	
	load(){
		languageList.forEach(lang => {
			Object.keys(this.strings).forEach(name => {
				this.strings[name].name_lang[lang] = allStrings[lang][name]
				this.strings[name].format_lang[lang] = allStrings[lang].calibration.ms
			})
		})
		
		this.addEdits(
			new EditFunction(GameRules.prototype, "init").load(str => {
				return plugins.insertBefore(str,
				`this.good = this.getTiming("good")
				this.ok = this.getTiming("ok")
				this.bad = this.getTiming("bad")
				if(this.good > 25 || this.ok > 75){
					game.controller.saveScore = false
				}
				`, 'this.daiLeniency')
			}),
			new EditValue(GameRules.prototype, "getTiming").load(() => this.getTiming.bind(this))
		)
	}
	getTiming(name){
		if(name === "bad"){
			return Math.max(...Object.values(this.score))
		}else{
			return this.score[name]
		}
	}
	start(){
		if(this.disableMultiplayer){
			p2.disable()
		}
	}
	stop(){
		if(this.disableMultiplayer){
			p2.enable()
		}
	}
	settings(){
		return Object.keys(this.strings).map(name => {
			var str = this.strings[name]
			return {
				name: str.name,
				name_lang: str.name_lang,
				description: str.description,
				description_lang: str.description_lang,
				format: str.format,
				format_lang: str.format_lang,
				type: "number",
				min: 0,
				default: this.score[name],
				getItem: () => this.score[name],
				setItem: value => {
					this.score[name] = value
				}
			}
		})
	}
}
