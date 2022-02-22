export default class Plugin extends Patch{
	name = "Display Game Cache"
	version = "22.02.11"
	description = "Appends cached assets below the game"
	author = "Katie Frogs"
	
	load(){
		this.addEdits(
			new EditFunction(CanvasCache.prototype, "resize").load(str => {
				return plugins.insertAfter(str,
				'this.ctx = this.canvas.getContext("2d")', `
				document.body.appendChild(this.canvas)`)
			}),
			new EditFunction(CanvasCache.prototype, "clean").load(str => {
				return plugins.insertAfter(str,
				'this.resize(1, 1, 1)', `
				document.body.removeChild(this.canvas)`)
			}),
			new EditValue(document.body.style, "overflow").load(() => "auto")
		)
	}
}
