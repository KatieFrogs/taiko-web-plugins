export default class Plugin extends Patch{
	name = "Custom Barline Scroll"
	version = "22.05.03"
	description = "Adds #BARLINESCROLL to the tja format, which can be used to set independent speed values on the measure lines, can be set to a floating point value or off"
	author = "Katie Frogs"
	
	load(){
		this.addEdits(
			new EditFunction(ParseTja.prototype, "parseCircles").load(str => {
				str = plugins.insertAfter(str, 'var lyricsLine = null', `
				var barlineScroll = null`)
				str = plugins.strReplace(str,
				'var speed = note.bpm * note.scroll / 60',
				`var speed = note.bpm * (barlineScroll === null ? note.scroll : barlineScroll) / 60`)
				str = plugins.strReplace(str,
				'var speed = bpm * scroll / 60',
				`var speed = bpm * (barlineScroll === null ? scroll : barlineScroll) / 60`)
				return plugins.insertBefore(str,
				`case "barlinescroll":
					var valueLower = value.toLowerCase().trim()
					if(!valueLower || valueLower === "off"){
						barlineScroll = null
					}else{
						barlineScroll = Math.max(0, parseFloat(value) || 0)
					}
					break
				`, 'case "lyric":')
			})
		)
	}
}
