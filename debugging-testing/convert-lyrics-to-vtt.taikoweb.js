export default class Plugin extends Patch{
	name = "Convert Lyrics to vtt"
	version = "22.11.11"
	description = "Adds an option to the pause screen to download converted lyrics in WEBVTT format"
	author = "Katie Frogs"
	
	load(){
		this.addEdits(
			new EditFunction(View.prototype, "init").load(str => {
				return plugins.insertAfter(str,
				'this.pauseOptions = strings.pauseOptions', `
				if(controller.lyrics){
					this.pauseOptions = [...this.pauseOptions, "Convert Lyrics"]
					this.pauseLyrics = this.pauseOptions.length - 1
				}`)
			}),
			new EditFunction(View.prototype, "pauseConfirm").load(str => {
				return plugins.insertAfter(str,
				'switch(pos){', `
				case this.pauseLyrics:
					this.getVtt()
					break`)
			}),
			new EditValue(View.prototype, "timeSeconds").load(() => this.timeSeconds),
			new EditValue(View.prototype, "getVtt").load(() => this.getVtt)
		)
	}
	timeSeconds(ms){
		var s = ms / 1000
		var m = Math.floor(s / 60)
		var h = Math.floor(m / 60)
		s = (s % 60).toFixed(3).padStart(6, "0")
		m = (m % 60).toString().padStart(2, "0")
		if(h === 0){
			return [m, s].join(":")
		}else{
			return [h.toString().padStart(2, "0"), m, s].join(":")
		}
	}
	getVtt(){
		if(!this.controller.lyrics){
			return
		}
		var lyricsText = [
			["WEBVTT Offset: 0"],
			...this.controller.lyrics.lines.filter(line => line.text).map(line => [
				this.timeSeconds(line.start) + " --> " + this.timeSeconds(line.end),
				line.text
			].join("\n"))
		].join("\n\n") + "\n"
		
		var blob = new Blob([lyricsText], {
			type: "application/octet-stream"
		})
		
		var url = URL.createObjectURL(blob)
		var link = document.createElement("a")
		link.href = url
		if("download" in HTMLAnchorElement.prototype){
			link.download = this.controller.selectedSong.title + ".vtt"
		}else{
			link.target = "_blank"
		}
		link.innerText = "."
		link.style.opacity = "0"
		document.body.appendChild(link)
		setTimeout(() => {
			link.click()
			document.body.removeChild(link)
			setTimeout(() => {
				URL.revokeObjectURL(url)
			}, 5000)
		})
	}
}
