export default class Plugin extends Patch {
    name = "Rainbow Crown"
    version = "22.03.2"
    description = "Adds Rainbow Crown"
    author = "purerosefallen/Katie Frogs"

    load() {

        this.addEdits(
            // Rainbow Crown #1
            new EditFunction(CanvasDraw.prototype, "crown").load(str => {
                str = plugins.strReplace(str, `if(config.type === "gold"){`, `if(config.type === "rainbow"){ // TODO
				grd.addColorStop(0, "#ffffc5")
				grd.addColorStop(0.23, "#ffff44")
				grd.addColorStop(0.53, "#efbd12")
				grd.addColorStop(0.83, "#ffff44")
				grd.addColorStop(1, "#efbd12")
			}else if(config.type === "gold"){`)
                return str
            }),
            // Rainbow Crown #2
            new EditFunction(Scoresheet.prototype, "redraw").load(str => {
                str = plugins.strReplace(str, `crownType = results.bad === "0" ? "gold" : "silver"`, `crownType = results.bad === "0" ? (results.ok === "0" ? "rainbow" : "gold") : "silver"`)
                return str
            }),
            // Rainbow Crown #3
            new EditFunction(Scoresheet.prototype, "redraw").load(str => {
                str = plugins.strReplace(str, `if(crownType === "gold"){`, `if(crownType === "gold" || crownType === "rainbow"){ // TODO: sound effect of donder full combo`)
                return str
            }),
            // Rainbow Crown #4
            new EditFunction(Scoresheet.prototype, "saveScore").load(str => {
                str = plugins.strReplace(str, `crown = this.resultsObj.bad === 0 ? "gold" : "silver"`, `crown = this.resultsObj.bad === 0 ? (this.resultsObj.ok === 0 ? "rainbow" : "gold") : "silver"`)
                return str
            }),
            // Rainbow Crown #4.5
            new EditFunction(Scoresheet.prototype, "saveScore").load(str => {
                str = plugins.strReplace(str, `if(oldScore && (oldScore.crown === "gold" || oldScore.crown === "silver" && !crown)){`, `if(oldScore && (oldScore.crown === "rainbow" || oldScore.crown === "gold" && (crown === "silver" || !crown) || oldScore.crown === "silver" && !crown)){`)
                return str
            }),
            // Rainbow Crown #5
            new EditFunction(Scoresheet.prototype, "saveScore").load(str => {
                str = plugins.strReplace(str, `}else if(oldScore && (crown === "gold" && oldScore.crown !== "gold" || crown && !oldScore.crown)){`, `}else if(oldScore && ((crown === "rainbow" && oldScore.crown !== "rainbow") || crown === "gold" && (oldScore.crown === "silver"  ||!oldScore.crown) || crown && !oldScore.crown)){`)
                return str
            }),
            // Rainbow Crown #6 (<3 Katie)
            new EditFunction(ScoreStorage.prototype, "init").load(str => {
                return plugins.insertAfter(str,
                    'this.crownValue = ["", "silver", "gold"', `, "rainbow"`)
            }),
            // Rainbow Crown #6.2 (<3 Katie)
            new EditValue(window, "scoreStorage").load(() => {
                var scoreStorage2 = new ScoreStorage()
                scoreStorage2.load(scoreStorage.prepareScores(scoreStorage.scoreStrings))
                return scoreStorage2
            }),
            // Rainbow Crown #7
            new EditFunction(CanvasDraw.prototype, "crown").load(str => {
                str = plugins.strReplace(str, `grd.addColorStop(0, "#ffffc5")
				grd.addColorStop(0.23, "#ffff44")
				grd.addColorStop(0.53, "#efbd12")
				grd.addColorStop(0.83, "#ffff44")
				grd.addColorStop(1, "#efbd12")`, `grd.addColorStop(0,"#0000ff")
				grd.addColorStop(0.15,"#00ffff")
				grd.addColorStop(0.35,"#00ff88")
				grd.addColorStop(0.5,"#ffffff")
				grd.addColorStop(0.65,"#ffff00")
				grd.addColorStop(0.85,"#ff8800")
				grd.addColorStop(1,"#ff00ff")`)
                return str
            }),
            // Rainbow Crown #8
            new EditFunction(Controller.prototype, "gameEnded").load(str => {
                str = plugins.strReplace(str, `if(score.bad === 0){`, `if(score.ok === 0 && score.bad === 0){ // TODO: donder fullcombo
				vp = "fullcombo"
				this.playSound("v_fullcombo", 1.350)
			}else if(score.bad === 0){`)
                return str
            }),
        )
    }


}


