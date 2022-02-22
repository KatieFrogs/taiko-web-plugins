export default class Plugin extends Patch{
	name = "Custom Scroll Speed"
	version = "22.02.22"
	description = "Changes the speed the notes scroll at in game"
	author = "Katie Frogs"
	
	scrollRate = 0.5
	
	strings = {
		scrollRate: {
			name: "Scroll Speed Multiplier",
			name_lang: {},
			description: null,
			description_lang: {},
			format: "%sx",
			format_lang: {}
		}
	}
	
	load(){
		this.addEdits(
			new EditFunction(Controller.prototype, "init").load(str => {
				return plugins.insertAfter(str,
				'this.view = new View(this)', `
				if(this.view.getScrollRate() < 1){
					this.saveScore = false
				}`)
			}),
			new EditFunction(View.prototype, "drawCircles").load(str => {
				return plugins.insertAfter(str, 'circle.speed', ` * this.getScrollRate()`)
			}),
			new EditFunction(View.prototype, "drawCircle").load(str => {
				return plugins.insertAfter(str, 'circle.speed', ` * this.getScrollRate()`)
			}),
			new EditFunction(View.prototype, "drawMeasures").load(str => {
				str = plugins.strReplace(str, 'measure.speed)', `measure.speed * this.getScrollRate())`)
				str = plugins.strReplace(str, 'measure.speed)', `measure.speed * this.getScrollRate())`)
				return plugins.strReplace(str, 'measure.speed)', `measure.speed * this.getScrollRate())`)
			}),
			new EditValue(View.prototype, "getScrollRate").load(() => this.getScrollRate.bind(this))
		)
	}
	getScrollRate(){
		return this.scrollRate
	}
	settings(){
		var str = this.strings.scrollRate
		return [{
			name: str.name,
			name_lang: str.name_lang,
			description: str.description,
			description_lang: str.description_lang,
			format: str.format,
			format_lang: str.format_lang,
			type: "number",
			min: 0,
			fixedPoint: 2,
			step: 1,
			default: this.scrollRate,
			getItem: () => this.scrollRate,
			setItem: value => {
				this.scrollRate = value
			}
		}]
	}
}
