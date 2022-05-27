export default class Plugin extends Patch {
    name = "Search Result In English"
    version = "22.05.27"
    description = "Add search english title and subtitle name to result."
    author = "mirusu400"
    strings = {

    }

    load() {
        this.addEdits(
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
                `,
                    `resultDiv.appendChild(resultInfoDiv)`
                )
            })
        )
    }

    settings() {
        return []
    }
}
