export default class Plugin extends Patch {
	name = "Custom Ranks"
	version = "22.06.10"
	description = "Add customs ranks according to user"
	author = "Glas"


	//Custom Rank List, edit as you wish.
	method = `switch(name) {
				case 'Glas':
		rank = "Lena Admin";
		break;
				case 'bol':
		rank = "Charter";
		break;
				case 'NotTang':
		rank = "Rank 1";
		break;
				case 'Meowgister':
		rank = "Charter";
		break;
	}`
	load() {
		this.log("load")
		this.addEdits(
			// Adds custom rank to Song Select
			new EditFunction(SongSelect.prototype, "redraw").load(str => {
				str = plugins.insertBefore(str, this.method, `this.nameplateCache.get({`)
				return str
			}),
			// Prepares Custom Rank for Gameplay
			new EditFunction(View.prototype, "refresh").load(str => {
				str = plugins.insertBefore(str, `var rank = 'test'
					`, `var winW = innerWidth`)
				return str
			}),
			// Prepares Custom Rank for Gameplay 2
			new EditFunction(View.prototype, "refresh").load(str => {
				str = plugins.insertBefore(str, `rank: rank,
					`, `scale: 0.8,`)
				return str
			}),

			// Adds Custom Rank to Gameplay
			new EditFunction(View.prototype, "refresh").load(str => {
				str = plugins.insertBefore(str, this.method, `				this.draw.nameplate({
					ctx: ctx,
					x: 3,
					y: 3,`)
				return str
			}),
			// Prepares Custom Rank for Score Result
			new EditFunction(Scoresheet.prototype, "redraw").load(str => {
				str = plugins.insertBefore(str, `var rank = 'test'
					`, `var winW = innerWidth`)
				return str
			}),
			// Prepares Custom Rank for Score Result 2
			new EditFunction(Scoresheet.prototype, "redraw").load(str => {
				str = plugins.insertBefore(str, `rank: rank,
					`, `name: name,`)
				return str
			}),

			// Adds Custom Rank to Score Results
			new EditFunction(Scoresheet.prototype, "redraw").load(str => {
				str = plugins.insertBefore(str, this.method, `					this.nameplateCache.get({
						ctx: ctx,
						x: 259,`)
				return str
			}),

		)
	}
	start() {
		this.log("start")
	}
	stop() {
		this.log("stop")
	}
	unload() {
		this.log("unload")
	}
}
