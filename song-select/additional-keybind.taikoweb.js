export default class Plugin extends Patch {
    name = "Additional Shortcuts"
    version = "22.05.27"
    description = `Add additional shortcuts.
        Ctrl+P => Open Plugin Setting
        Ctrl+S => Open Settings
        Ctrl+R => Select Random Song
        Ctrl+C => Select Custom Song
        Ctrl+M => Mute Song (You can also mute song by pressing Q key)
    `



    author = "mirusu400"


    strings = {

    }

    load() {
        this.addEdits(
            new EditFunction(SongSelect.prototype, "init").load(str => {
                return plugins.strReplace(str, `search: ["f"]`, `
                    search: ["f"],
                    plugin: ["p"],
                    setting: ["s"],
                    random: ["r"],
                    custom: ["c"],
                    mute: ["m"]
                `)
            }),

            new EditFunction(SongSelect.prototype, "keyPress").load(str => {
                return plugins.insertBefore(str,
                    `
                        if(event && event.keyCode && event.keyCode === 80 && ctrl){ // Ctrl+P => Open Plugin Setting
                            this.toPlugins()
                            if(event){
                                event.preventDefault()
                            }
                        }
                        if (event && event.keyCode && event.keyCode === 83 && ctrl) { // Ctrl+S => Settings
                            this.toSettings()
                            if(event){
                                event.preventDefault()
                            }
                        }
                        if (event && event.keyCode && event.keyCode === 82 && ctrl) { // Ctrl+R => Random
                            do{
                                var i = Math.floor(Math.random() * this.songs.length)
                            }while(!this.songs[i].courses)
                            this.setSelectedSong(i)
                            this.lastRandom = true
                            this.playBgm(false)
                            this.toSelectDifficulty(false, playVoice=false)
                            pageEvents.send("song-select-random")
                            if(event){
                                event.preventDefault()
                            }
                        }
                        if (event && event.keyCode && event.keyCode === 67 && ctrl) { // Ctrl+C => Custom song
                            this.toCustomSongs()
                            if(event){
                                event.preventDefault()
                            }
                        }
                        if (event && event.keyCode && event.keyCode === 77 && ctrl) { // Ctrl+M => Mute song
                            this.endPreview(true)
				            this.playBgm(false)
                            if(event){
                                event.preventDefault()
                            }
                        }
                    `,
                    `if(event && event.keyCode && event.keyCode === 70 && ctrl){`)
            })
        )
    }

    settings() {
        return []
    }
}
