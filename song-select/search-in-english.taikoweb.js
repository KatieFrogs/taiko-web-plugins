export default class Plugin extends Patch {
    name = "Search In English"
    version = "22.05.27"
    description = "Search by english title name."
    author = "mirusu400"
    
    strings = {

    }

    load() {
        this.addEdits(
            new EditFunction(SongSelect.prototype, "init").load(str => {
                return plugins.insertAfter(str, `song.subtitlePrepared = subtitle ? fuzzysort.prepare(this.search.normalizeString(subtitle)) : null`, `
					var enTitle = song.title_lang.en
			        song.enTitlePrepared = enTitle ? fuzzysort.prepare(this.search.normalizeString(enTitle)) : null
                    var enSubTitle = song.subtitle_lang.en
                    song.enSubTitlePrepared = enSubTitle ? fuzzysort.prepare(this.search.normalizeString(enSubTitle)) : null
				`)
            }),
            new EditFunction(Search.prototype, "perform").load(str => {
                return plugins.strReplace(str, `["titlePrepared", "subtitlePrepared"]`,
                    `["titlePrepared", "subtitlePrepared", "enTitlePrepared", "enSubTitlePrepared"]`
                )
            }),
            new EditFunction(Search.prototype, "perform").load(str => {
                return plugins.strReplace(str, `return a[1] ? score1 : -Infinity`,
                    `return a[1] ? score1 : a[2] ? -9999 : a[3] ? -19999 : -Infinity`
                )
            })
        )
    }

    settings() {
       return []
    }
}
