export default class Plugin extends Patch {
	name = "Custom Barlines"
	name_lang = {
		tw: "自定義小節線"
	}
	version = "22.06.02"
	description = "Adds #BARLINESCROLL and #BARLINE to the tja format. #BARLINESCROLL can be used to set independent speed values on the measure lines, can be set to a floating point value or off. #BARLINE can insert measure lines anywhere in the chart."
	description_lang = {
		tw: "新增「#BARLINESCROLL」和「#BARLINE」到 tja 格式\n#BARLINESCROLL 可以設定在指定的測量線內設定獨立的速度數值，可以設置成小數點或是關閉（off）\n#BARLINE 可以插入測量線到譜面中的任何位置"
	}
	author = "Katie Frogs"

	load() {
		this.addEdits(
			new EditFunction(ParseTja.prototype, "parseCircles").load(str => {
				str = plugins.insertAfter(str, 'var lyricsLine = null', `
				var barlineScroll = null
				var customBarLine = false`)
				str = plugins.strReplace(str,
					'var speed = note.bpm * note.scroll / 60',
					`var speed = note.bpm * (note.barlineScroll === null ? note.scroll : note.barlineScroll) / 60`)
				str = plugins.strReplace(str,
					'var speed = bpm * scroll / 60',
					`var speed = bpm * (barlineScroll === null ? scroll : barlineScroll) / 60`)
				str = plugins.insertBefore(str,
					`if(i !== 0 && note.customBarLine){
					this.measures.push({
						ms: note.start,
						originalMS: note.start,
						speed: note.bpm * (note.barlineScroll === null ? note.scroll : note.barlineScroll) / 60,
						visible: barLine,
						branch: currentBranch,
						branchFirst: false
					})
				}
				`, 'if("lyricsLine" in note){')
				str = plugins.insertBefore(str,
					`case "barlinescroll":
					var valueLower = value.toLowerCase().trim()
					if(!valueLower || valueLower === "off"){
						barlineScroll = null
					}else{
						barlineScroll = Math.max(0, parseFloat(value) || 0)
					}
					break
				case "barline":
					customBarLine = true
					break
				`, 'case "lyric":')
				str = plugins.insertBefore(str,
					`circleObj.barlineScroll = barlineScroll
				circleObj.customBarLine = customBarLine
				customBarLine = false
				`, 'currentMeasure.push(circleObj)')
				return plugins.insertBefore(str,
					`circleObj2.barlineScroll = barlineScroll
				circleObj2.customBarLine = customBarLine
				customBarLine = false
				`, 'currentMeasure.push(circleObj2)')
			})
		)
	}
}
