export default class Plugin extends Patch{
	name = "Show BPM"
	name_lang = {
		ja: "BPMを表示する"
	}
	version = "22.02.11"
	description = "Displays the current BPM in game"
	author = "Katie Frogs"
	
	load(){
		this.addEdits(
			new EditFunction(View.prototype, "refresh").load(str => {
				return plugins.insertBefore(str, `
				this.draw.layeredText({
					ctx: ctx,
					text: "BPM: " + (1000 / this.beatInterval * 60).toString(),
					fontSize: 30,
					fontFamily: this.font,
					x: 10,
					y: frameTop + (this.portrait ? 500 : 400),
					width: 600,
					align: "left"
				}, [
					{outline: "#000", letterBorder: 10},
					{fill: "#fff"}
				])
				`, '// Pause screen')
			})
		)
	}
}

if(typeof GM_info === "object"){
	addEventListener("ready", () => plugins.add(Plugin)?.start())
}
