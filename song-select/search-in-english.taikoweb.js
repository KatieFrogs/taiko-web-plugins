export default class Plugin extends Patch {
    name = "Search In English"
    version = "22.05.28"
    description = "Search by english title name."
    author = "mirusu400"

    showInEnglish = true
    maxResultCount = 50

    strings = {
        showInEnglish: {
            name: "Show result in English",
            name_lang: {},
            description: "Add search english title and subtitle name to result.",
            description_lang: {},
            format_lang: {}
        },
        maxResultCount: {
            name: "Search results count",
            name_lang: {},
            description: "If you set too high value, it may cause performance issue.",
            description_lang: {},
            format_lang: {}
        }
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
            // Advanced search results
            new EditFunction(Search.prototype, "perform").load(str => {
                return plugins.strReplace(str, `var maxResults = totalFilters > 0 && !query ? 100 : 50`,
                    `var maxResults = this.getMaxResultCount()`
                )
            }),
            new EditValue(Search.prototype, "getMaxResultCount").load(() =>
                this.getMaxResultCount.bind(this)
            ),
            new EditFunction(Search.prototype, "perform").load(str => {
                return plugins.strReplace(str, `return a[1] ? score1 : -Infinity`,
                    `return a[1] ? score1 : a[2] ? -9999 : a[3] ? -10000 : -Infinity`
                )
            }),

            // Render new search results
            new EditFunction(Search.prototype, "createResult").load(str => {
                return plugins.insertBefore(str,
                    `
                    var enTitle = song.title_lang.en
                    var enSubTitle = song.subtitle_lang.en
                    `,
                    `var id = "default"`
                )
            }),
            new EditFunction(Search.prototype, "createResult").load(str => {
                return plugins.insertBefore(str, `
                    if(this.getShowInEnglish()) {
                        if(enTitle){
                            resultInfoDiv.appendChild(document.createElement("br"))
                            var reusltInfoEnTitle = document.createElement("span")
                            reusltInfoEnTitle.classList.add("song-search-result-subtitle")
                            
                            reusltInfoEnTitle.appendChild(this.highlightResult(enTitle, result[2]))
                            reusltInfoEnTitle.setAttribute("alt", enTitle)
                            reusltInfoEnTitle.style.fontSize = "0.5em"
                            reusltInfoEnTitle.style.marginTop = "0.2em"
                            
                            resultInfoDiv.appendChild(reusltInfoEnTitle)
                        }
                        if((enSubTitle) && (enSubTitle != enTitle)){
                            if (!(enTitle)){
                                resultInfoDiv.appendChild(document.createElement("br"))
                            }
                            var reusltInfoEnSubtitle = document.createElement("span")
                            reusltInfoEnSubtitle.classList.add("song-search-result-subtitle")
                            
                            reusltInfoEnSubtitle.appendChild(this.highlightResult(enSubTitle, result[3]))
                            reusltInfoEnSubtitle.setAttribute("alt", enSubTitle)
                            reusltInfoEnSubtitle.style.fontSize = "0.5em"
                            reusltInfoEnSubtitle.style.marginTop = "0.2em"
                            reusltInfoEnSubtitle.style.marginLeft = "0.3em"
                            
                            
                            resultInfoDiv.appendChild(reusltInfoEnSubtitle)
                        }
                    }
                `,
                    `resultDiv.appendChild(resultInfoDiv)`
                )
            }),
            new EditValue(Search.prototype, "getShowInEnglish").load(() =>
                this.getShowInEnglish.bind(this)
            )


        )
    }

    getShowInEnglish() {
        return this.showInEnglish
    }
    getMaxResultCount() {
        return this.maxResultCount
    }
    settings() {
        var showInEnglish = this.strings.showInEnglish
        var maxResultCount = this.strings.maxResultCount
        return [{
            name: showInEnglish.name,
            name_lang: showInEnglish.name_lang,
            description: showInEnglish.description,
            description_lang: showInEnglish.description_lang,
            type: "toggle",
            default: this.showInEnglish,
            getItem: () => this.showInEnglish,
            setItem: value => {
                this.showInEnglish = value
            }
        },
        {
            name: maxResultCount.name,
            name_lang: maxResultCount.name_lang,
            description: maxResultCount.description,
            description_lang: maxResultCount.description_lang,
            type: "number",
            min: 1,
            max: 200,
            step: 5,
            default: this.maxResultCount,
            getItem: () => this.maxResultCount,
            setItem: value => {
                this.maxResultCount = value
            }
        },

        ]
    }
}
