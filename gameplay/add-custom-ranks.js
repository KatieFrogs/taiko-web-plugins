export default class Plugin extends Patch {
	name = "Custom Ranks"
	version = "22.06.10"
	description = "Add customs ranks according to user"
	author = "Glas"


	//Custom Rank List, edit as you wish.
	// Don't edit case '':
	method = `switch(name) {
				case '':
		rank = "";
		break;
				case 'Glas':
		rank = "Lena Admin";
		break;
				case 'bol':
		rank = "Charter";
		break;
				case '5':
		rank = "Charter";
		break;
				case '6':
		rank = "Charter";
		break;
				case '7':
		rank = "Charter";
		break;
				case '8':
		rank = "Charter";
		break;
				case '9':
		rank = "Charter";
		break;
				case '10':
		rank = "Charter";
		break;
	}`
	load() {
		this.log("load")
		this.addEdits(
			// Song Select Edits
			// Adds Rank to Song Select
			new EditFunction(SongSelect.prototype, "redraw").load(str => {
				str = plugins.insertBefore(str, this.method, `this.nameplateCache.get({`)
				return str
			}),
			// Score Result Edits
			// Prepares Custom Rank for Score Result
			new EditFunction(Scoresheet.prototype, "redraw").load(str => {
				str = plugins.insertBefore(str, `var rank = 'test'
					`, `var winW = innerWidth`)
				// Prepares Custom Rank for Score Result 2
				str = plugins.insertBefore(str, `rank: rank,
					`, `name: name,`)
				// Adds Custom Rank to Score Results
				str = plugins.insertBefore(str, this.method, `					this.nameplateCache.get({
						ctx: ctx,
						x: 259,`)
				return str
			}),

			// Gameplay Edits
			new EditFunction(View.prototype, "refresh").load(str => {
				// Defines rank for gameplay screen
				str = plugins.insertBefore(str, `var rank = "test"
					`, `var winW = innerWidth`)
				// Inserts rank value into gameplay (Mobile)
				str = plugins.insertBefore(str, this.method, `				this.draw.nameplate({
					ctx: ctx,
					x: 3,
					y: 3,
					scale: 0.8,`)
				// Adds rank to gameplay screen (Mobile)
				str = plugins.insertBefore(str, `rank: rank,

					`, `scale: 0.8,`)
				// Inserts rank value into gameplay (PC)
				str = plugins.insertBefore(str, this.method, `				this.draw.nameplate({
					ctx: ctx,
					x: 3,
					y: 3,
					name: name`)
				// Adds rank to gameplay screen (PC)
				str = plugins.insertBefore(str, `rank: rank,

					`, `					y: 3,
					name: name,`)
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
