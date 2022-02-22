export default class Plugin extends Patch{
	name = "Millisecond Accuracy"
	name_lang = {
		ja: "ミリ秒単位の精度"
	}
	version = "22.02.22"
	description = "Replaces the judge score with the accuracy in milliseconds"
	description_lang = {
		ja: "判定点数をミリ秒単位の精度に置き換えます"
	}
	author = "Katie Frogs"
	
	load(){
		this.addEdits(
			new EditFunction(CanvasDraw.prototype, "score").load(str => {
				str = plugins.insertBefore(str, `!config.text && `, 'strings.good ===')
				return str.replace(/strings\.(good|ok|bad),/g, "config.text || $&")
			}),
			new EditFunction(Game.prototype, "checkScore").load(str => {
				return plugins.insertBefore(str,
				`this.lastRelative = relative
				`, 'relative = Math.abs(relative)')
			}),
			new EditFunction(View.prototype, "refresh").load(str => {
				return plugins.insertAfter(str, "scale: 1.35 * mul,",`
				text: (this.controller.game.lastRelative >= 0 ? "+" : "") + Math.floor(this.controller.game.lastRelative).toString(),`)
			}),
			new EditFunction(Mekadon.prototype, "playNow").load(str => {
				return plugins.insertBefore(str,
				`this.game.lastRelative = this.getMS() - ms
				`, 'this.controller.displayScore')
			})
		)
	}
}
