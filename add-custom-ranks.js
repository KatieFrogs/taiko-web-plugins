export default class Plugin extends Patch {
	name = "Custom Ranks"
	version = "22.05.24"
	description = "Add customs ranks according to user"
	author = "Glas"

	//Copy & Paste cases for more users.

	load() {
	method = `switch(name) {
				case 'Glas':
		rank = "Lena";
		break;
				case 'Insert name':
		rank = "Title";
		break;
				case 'Insert name 2':
		rank = "Title";
		break;
	}`

		this.log("load")
		this.addEdits(
			// Custom Ranks - For Song Select
			new EditFunction(SongSelect.prototype, "redraw").load(str => {
				str = plugins.insertBefore(str, `${method}`, `this.nameplateCache.get({`)
				return str
			}),
				// Custom Ranks Pre - For GamePlay
				new EditFunction(View.prototype, "refresh").load(str => {
					str = plugins.insertBefore(str, `var rank = 'test'
					`, `var winW = innerWidth`)
					return str
				}),
				// Custom Ranks Pre - For GamePlay 2
				new EditFunction(View.prototype, "refresh").load(str => {
					str = plugins.insertBefore(str, `rank: rank,
					`, `scale: 0.8,`)
					return str
				}),
				
				// Custom Ranks - For GamePlay

				new EditFunction(View.prototype, "refresh").load(str => {
					str = plugins.insertBefore(str, `${method}`)
					return str
				}),
			// Custom Ranks - For Results screen


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
