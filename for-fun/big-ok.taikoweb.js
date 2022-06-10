export default class Plugin extends Patch{
	name = "Big OK"
	version = "22.02.11"
	description = "When you get an OK judge score, the whole screen becomes a big OK"
	author = "Katie Frogs"
	
	load(){
		this.addEdits(
			new EditFunction(View.prototype, "refresh").load(str => {
				return plugins.insertBefore(str,
				`if(this.currentScore.type === 230){
					this.showOk = true
				}
				if(this.showOk && !this.multiplayer){
					ctx.fillStyle = "#000"
					ctx.fillRect(0, 0, winW + frameLeft, winH + frameTop)
					this.draw.score({
						ctx: ctx,
						score: "ok",
						x: winW / 2,
						y: frameTop + winH / 2 - 600 / 2,
						scale: 720 / 40,
						align: "center"
					})
				}
				`, '// Pause screen')
			})
		)
	}
}
