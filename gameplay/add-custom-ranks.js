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
				case 'NotTang':
		rank = "Rank 1";
		break;
				case 'Meowgister':
		rank = "Charter";
		break;
				case 'Dormin':
		rank = "Spammer";
		break;
				case 'colinmcguire':
		rank = "Makima's Dog";
		break;
				case 'sakurada0291':
		rank = "Summertime Melodies";
		break;
				case 'Thusuzzee':
		rank = "nekos.best";
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
			// Adds Rank to Song Select
			new EditFunction(SongSelect.prototype, "redraw").load(str => {
				str = plugins.insertBefore(str, this.method, `this.nameplateCache.get({`)
				return str
			}),
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

			//////// Below needs refactoring/rewrite.

			// Defines rank for gameplay screen
			new EditFunction(View.prototype, "refresh").load(str => {
				str = plugins.insertBefore(str, `var rank = "test"
					`, `var winW = innerWidth`)
				return str
			}),

			new EditFunction(View.prototype, "refresh").load(str => {
				str = plugins.insertBefore(str, this.method, `var winH = lastHeight`)
				return str
			}),
			// Inserts rank value into gameplay (Mobile)
			new EditFunction(View.prototype, "refresh").load(str => {
				str = plugins.insertBefore(str, this.method, `				this.draw.nameplate({
					ctx: ctx,
					x: 3,
					y: 3,
					scale: 0.8,`)
				return str
			}),
			// Adds rank to gameplay screen (Mobile)
			new EditFunction(View.prototype, "refresh").load(str => {
				str = plugins.insertBefore(str, `rank: rank,

					`, `scale: 0.8,`)
				return str
			}),
			// Inserts rank value into gameplay (PC)
			new EditFunction(View.prototype, "refresh").load(str => {
				str = plugins.insertBefore(str, this.method, `				this.draw.nameplate({
					ctx: ctx,
					x: 3,
					y: 3,
					name: name`)
				return str
			}),
			// Adds rank to gameplay screen (PC)
			new EditFunction(View.prototype, "refresh").load(str => {
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
