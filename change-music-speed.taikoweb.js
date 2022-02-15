export default class Plugin extends Patch{
	name = "Change Music Speed"
	version = "22.02.15"
	description = "Slow down or speed up the music in game"
	author = "Katie Frogs"
	
	load(){
		var playbackRate = 1.25
		
		this.addEdits(
			new EditValue(Sound.prototype, "play").load(func => {
				var str = plugins.strFromFunc(func)
				var args = plugins.argsFromFunc(func)
				args.push("playbackRate")
				str = plugins.insertBefore(str,
				`if(playbackRate){
					source.playbackRate.value = playbackRate
				}
				`, 'source.start')
				return Function(...args, str)
			}),
			new EditValue(Sound.prototype, "playLoop").load(func => {
				var str = plugins.strFromFunc(func)
				var args = plugins.argsFromFunc(func)
				args.push("playbackRate")
				str = plugins.insertAfter(str, 'this.play(time, true, seek1, until', `, playbackRate`)
				return Function(...args, str)
			}),
			new EditFunction(Game.prototype, "playMainMusic").load(str => {
				str = plugins.insertBefore(str,
				`ms = this.elapsedTime * ${playbackRate} + this.controller.offset
				`, 'this.mainAsset.play(')
				return plugins.insertAfter(str,
				'this.mainAsset.play((ms < 0 ? -ms : 0) / 1000, false, Math.max(0, ms / 1000)', `, undefined, ${playbackRate}`)
			}),
			new EditFunction(Controller.prototype, "init").load(str => {
				return plugins.insertBefore(str,
				`this.parsedSongData.beatInfo.beatInterval /= ${playbackRate}
				this.parsedSongData.circles.map(circle => {
					circle.beatMS /= ${playbackRate}
					circle.ms /= ${playbackRate}
					circle.originalMS /= ${playbackRate}
					circle.endTime /= ${playbackRate}
					circle.originalEndTime /= ${playbackRate}
					circle.lastFrame = circle.ms + 100
					circle.speed *= ${playbackRate}
				})
				this.parsedSongData.measures.map(measure => {
					measure.ms /= ${playbackRate}
					measure.originalMS /= ${playbackRate}
					measure.speed *= ${playbackRate}
				})
				this.offset /= ${playbackRate}
				this.parsedSongData.offset /= ${playbackRate}
				this.parsedSongData.soundOffset /= ${playbackRate}
				
				if(this.lyrics){
					this.lyrics.vttOffset /= ${playbackRate}
					this.lyrics.lines.map(line => {
						line.start /= ${playbackRate}
						line.end /= ${playbackRate}
					})
				}
				`, 'this.game = new Game')
			}),
			new EditFunction(SongSelect.prototype, "previewLoaded").load(str => {
				return plugins.insertAfter(str, 'this.preview.playLoop(delay / 1000, false, prvTime', `, undefined, undefined, ${playbackRate}`)
			})
		)
	}
}

if(typeof GM_info === "object"){
	addEventListener("ready", () => plugins.add(Plugin)?.start())
}
