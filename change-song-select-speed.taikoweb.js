export default class Plugin extends Patch{
	name = "Change Song Select Speed"
	version = "22.02.16"
	description = "Changes the song selection scroll speed"
	author = "Katie Frogs"
	
	load(){
		var speed = 0.5
		
		this.addEdits(
			new EditFunction(SongSelect.prototype, "init").load(str => {
				return plugins.insertAfter(str, 'speed: 400', `/ ${speed}`)
			})
		)
	}
}
