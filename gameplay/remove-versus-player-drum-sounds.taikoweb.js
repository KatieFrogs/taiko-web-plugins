export default class Plugin extends Patch{
	name = "Remove versus player drum sounds"
	version = "22.05.27"
	description = "Remove versus player drum sounds, you can hear sfx only you play."
	author = "mirusu400"
	
	strings = {

	}
	
	load(){
		this.addEdits(
			new EditFunction(Controller.prototype, "init").load(str => {
				return plugins.insertAfter(str, `this.multiplayer = multiplayer`, `
					this.player = this.multiplayer ? p2.player : 1
				`)
			}),
			new EditFunction(Controller.prototype, "playSound").load(str => {
				return plugins.insertBefore(str, `
					if (this.player == 1 && this.snd == "_p2") return;
					if (this.player == 2 && this.snd == "_p1") return;
					`,
					`assets.sounds[id + (noSnd ? "" : this.snd)].play(time)`
				)
			}),
			new EditFunction(Controller.prototype, "playSound").load(str => {
				return plugins.strReplace(str, `id + (noSnd ? "" : this.snd)`,
					`id`
				)
			}),
		)
	}

	settings(){
		return []
	}
}
