export default class Plugin extends Patch{
	name = "Loading Background"
	version = "22.05.15"
	description = "Shows a custom loading background if a loading.png file is in the same directory as the chart"
	author = "Katie Frogs"
	
	load(){
		this.addEdits(
			new EditFunction(ImportSongs.prototype, "addTja").load(str => {
				return plugins.insertBefore(str,
				`songObj.loadingBg = this.otherFiles[file.path.slice(0, file.path.lastIndexOf("/") + 1).toLowerCase() + "loading.png"]
				`, 'if(titleLangAdded){')
			}),
			new EditFunction(ImportSongs.prototype, "addOsu").load(str => {
				return plugins.insertBefore(str,
				`songObj.loadingBg = this.otherFiles[file.path.slice(0, file.path.lastIndexOf("/") + 1).toLowerCase() + "loading.png"]
				`, 'if(title){')
			}),
			new EditFunction(SongSelect.prototype, "toLoadSong").load(str => {
				str = plugins.insertBefore(str,
				`var loadingBg
				if(selectedSong.loadingBg){
					var promise = selectedSong.loadingBg.blob().then(blob => {
						var blobUrl = URL.createObjectURL(blob)
						var img = document.createElement("img")
						var promise2 = pageEvents.load(img).then(() => {
							assets.image["loading.png"] = img
							loader.assetsDiv.appendChild(img)
							loadingBg = blobUrl
						}, () => Promise.resolve())
						img.id = "loading.png"
						img.src = blobUrl
						return promise2
					}, () => Promise.resolve())
				}else{
					var promise = Promise.resolve()
				}
				promise.then(() => {
				`, 'new LoadSong({')
				str = plugins.insertAfter(str, '"lyrics": selectedSong.lyrics', `,
				loadingBg: loadingBg`)
				return str + `
				})`
			}),
			new EditFunction(LoadSong.prototype, "run").load(str => {
				return plugins.insertBefore(str,
				`if(song.loadingBg){
					this.loadingBg = song.loadingBg
					var loadSongDiv = document.getElementById("load-song")
					loadSongDiv.style.backgroundImage = "url('" + this.loadingBg + "')"
					loadSongDiv.style.backgroundSize = "cover"
					this.addPromise(new Promise(resolve => setTimeout(resolve, 1000)))
				}
				`, 'this.songObj = songObj')
			}),
			new EditFunction(LoadSong.prototype, "clean").load(str => {
				return str + `
				if(this.loadingBg){
					loader.assetsDiv.removeChild(assets.image["loading.png"])
					delete assets.image["loading.png"]
					URL.revokeObjectURL(this.loadingBg)
				}`
			})
		)
	}
}
