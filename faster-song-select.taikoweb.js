export default class Plugin extends Patch{
	name = "Faster Song Select"
	version = "22.02.11"
	description = "Scrolling through the songs becomes twice as fast"
	author = "Katie Frogs"
	
	load(){
		this.addEdits(
			new EditFunction(SongSelect.prototype, "init").load(str => {
				return plugins.strReplace(str, "speed: 800,", "speed: 400,")
			}),
			new EditFunction(SongSelect.prototype, "redraw").load(str => {
				return plugins.strReplace(str, "if(ms >= this.pressedKeys[key] + 50){", "if(ms >= this.pressedKeys[key] + (this.state.screen === \"song\" && (key === \"right\" || key === \"left\") ? 20 : 50)){")
			})
		)
	}
}

if(typeof GM_info === "object"){
	addEventListener("ready", () => plugins.add(Plugin)?.start())
}
