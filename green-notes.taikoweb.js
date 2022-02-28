export default class Plugin extends Patch{
	name = "Green Notes"
	version = "22.02.28"
	description = "Adds support for green notes (G) and ad-lib notes (F) in custom charts"
	author = "Katie Frogs"
	
	load(){
		var promise = snd.sfxGain.load(new RemoteFile(se_hidden())).then(sound => {
			assets.sounds["se_hidden"] = sound
			assets.sounds["se_hidden_p1"] = sound.copy(snd.sfxGainL)
			assets.sounds["se_hidden_p2"] = sound.copy(snd.sfxGainR)
		})
		
		this.addEdits(
			new EditFunction(CanvasDraw.prototype, "score").load(str => {
				str = plugins.insertAfter(str, 'strings.good === "良"', ` && config.score !== "adlib"`)
				return plugins.insertBefore(str,
				`else if(config.score === "adlib"){
					if(config.results){
						ctx.textAlign = "right"
					}
					ctx.strokeStyle = "#ef9100"
					ctx.fillStyle = "#fff"
					ctx.strokeText("AD-LIB", 0, 4)
					ctx.fillText("AD-LIB", 0, 4)
				}
				`, '}\n\t\tctx.restore()')
			}),
			new EditFunction(Controller.prototype, "init").load(str => {
				return plugins.insertAfter(str, '["don", "ka", "daiDon", "daiKa"', `, "green"`)
			}),
			new EditFunction(Controller.prototype, "displayScore").load((str, args) => {
				args.push("adlib")
				return plugins.insertAfter(str, 'bigNote', `, adlib`)
			}),
			new EditFunction(Game.prototype, "init").load(str => {
				str = plugins.insertAfter(str, 'gauge: 0,', `
				adlib: 0,
				adlibTotal: 0,`)
				return plugins.insertAfter(str, 'type === "daiKa"', ` || type === "green"`)
			}),
			new EditFunction(Game.prototype, "skipNote").load(str => {
				str = plugins.insertBefore(str,
				`if(circle.type !== "adlib"){
				`, 'this.sectionNotes.push(0)')
				return plugins.insertAfter(str,
				'this.updateGlobalScore(0, 1)', `
				}`)
			}),
			new EditFunction(Game.prototype, "checkPlays").load(str => {
				return plugins.insertBefore(str,
				`if((don_l || don_r) && (ka_l || ka_r)){
					this.checkKey(["don_l", "don_r", "ka_l", "ka_r"], circle, "green")
				}else `, 'if(keyTime["don"] >= keyTime["ka"]){')
			}),
			new EditFunction(Game.prototype, "checkScore").load(str => {
				str = plugins.insertAfter(str, 'var typeDai = type === "daiDon" || type === "daiKa"', `  || type === "green"
				var keyGreen = check === "green"
				typeDon = type === "don" || type === "daiDon" || type === "adlib"
				typeKa = type === "ka" || type === "daiKa" || type === "adlib"
				var typeAdlib = type === "adlib"
				var typeGreen = type === "green"`)
				str = plugins.insertAfter(str, 'typeDon || typeKa', ` || typeGreen`)
				str = plugins.insertAfter(str, 'keysDon && typeDon || keysKa && typeKa', ` || typeGreen`)
				str = plugins.insertBefore(str, `typeGreen ? !keyGreen : `, 'typeDai && !keyDai')
				str = plugins.insertBefore(str,
				` if(typeGreen){
					return true
				}else`, '{\n\t\t\t\t\t\tcircleStatus = circle.daiFailed.status')
				str = plugins.strReplace(str,
				'circle.played(score, score === 0 ? typeDai : keyDai)\n\t\t\t\tthis.controller.displayScore(score, false, typeDai && keyDai)',
				`circle.played(score, score === 0 ? typeDai : (keyDai || typeGreen))
				if(!typeAdlib || score){
					this.controller.displayScore(score, false, typeDai && keyDai || typeGreen, typeAdlib)
				}`)
				str = plugins.strReplace(str,
				'this.updateCombo(score)\n\t\t\tthis.updateGlobalScore(score, typeDai && keyDai ? 2 : 1, circle.gogoTime)',
				`if(!typeAdlib || score){
					this.updateCombo(score)
					var doubleScore = typeDai && keyDai || typeGreen
					this.updateGlobalScore(score, doubleScore ? 2 : 1, circle.gogoTime)
					this.sectionNotes.push(score === 450 ? 1 : (score === 230 ? 0.5 : 0))
				}
				if(typeAdlib && score){
					this.globalScore.adlib++
				}`)
				str = plugins.strReplace(str,
				'dai: typeDai ? (keyDai ? 2 : 1) : 0',
				`dai: typeDai ? (keyDai ? 2 : 1) : (typeGreen ? 2 : 0)`)
				str = plugins.strReplace(str, 'keysDon && type === "balloon"', `(keysDon || keyGreen) && type === "balloon"`)
				str = plugins.insertBefore(str, ` || keyGreen`, ') && (type === "drumroll" || type === "daiDrumroll")')
				return plugins.strReplace(str,
				'if(keyDai){\n\t\t\t\t\tthis.checkDrumroll(circle, keysKa)',
				`if(keyDai || keyGreen){
					this.checkDrumroll(circle, keysKa || keyGreen)`)
			}),
			new EditFunction(Game.prototype, "updateCurrentCircle").load(str => {
				return plugins.insertBefore(str,
				`if(circles[this.currentCircle] && circles[this.currentCircle].type === "adlib"){
					this.globalScore.adlibTotal++
				}
				`, 'do{')
			}),
			new EditFunction(GameInput.prototype, "checkKeySound").load(str => {
				return plugins.insertBefore(str,
				`if(circle.type === "adlib"){
					var relative = Math.abs(currentTime - circle.ms)
					if(relative < this.game.rules.ok){
						this.controller.playSound("se_hidden")
						return
					}
				}else `, 'if(circle.type === "balloon"){')
			}),
			new EditFunction(Mekadon.prototype, "playNow").load(str => {
				str = plugins.insertAfter(str, 'if(type === "don" || type === "daiDon"', ` || type === "adlib"`)
				str = plugins.insertBefore(str, 
				`else if(type === "adlib"){
					type = "don"
				}
				`, 'if(type === "daiDon" && playDai){')
				str = plugins.insertAfter(str, 'this.lr = !this.lr', `
				}else if(type === "green"){
					this.setKey("ka_l", ms)
					this.setKey("don_r", ms)
					this.lr = false
					keyDai = true`)
				str = plugins.insertAfter(str, 'this.controller.displayScore(score, false, keyDai', `, circle.type === "adlib"`)
				return plugins.insertBefore(str,
				`if(circle.type === "adlib" && score){
					this.game.globalScore.adlib++
				}
				`, 'this.game.sectionNotes.push')
			}),
			new EditFunction(ParseTja.prototype, "init").load(str => {
				return plugins.insertAfter(str, '"B": {name: "daiKa", txt: strings.note.daiKa}', `,
				"F": {name: "adlib", txt: false},
				"G": {name: "green", txt: strings.note.green}`)
			}),
			new EditFunction(ParseTja.prototype, "parseCircles").load(str => {
				return plugins.insertAfter(str, 'case "A": case "B":', ` case "F": case "G":`)
			}),
			new EditFunction(Scoresheet.prototype, "redraw").load(str => {
				str = plugins.insertBefore(str,
				`var showAdlib = false
				for(var p = 0; p < players; p++){
					var results = this.results[p]
					if(results.adlibTotal > 0){
						showAdlib = true
					}
				}
				`, 'var rules = this.controller.game.rules')
				str = plugins.insertAfter(str, '{fill: "#ffc700"}\n\t\t\t\t\t])', `
				if(showAdlib){
					this.draw.score({
						ctx: ctx,
						score: "adlib",
						x: 1149,
						y: 273,
						results: true
					})
					this.draw.layeredText({
						ctx: ctx,
						text: "%",
						x: 971 + 270,
						y: 196 + 80,
						fontSize: 26,
						fontFamily: this.numbersFont,
						align: "right"
					}, [
						{outline: "#000", letterBorder: 9},
						{fill: "#fff"}
					])
				}`)
				str = plugins.insertBefore(str,
				`if(showAdlib){
					printNumbers.push("adlib")
				}
				`, 'if(!this.state["countupTime0"]){')
				str = plugins.strReplace(str,
				'var currentTime = lastTime + 500 + results[printNumbers[i]].length * 30 * this.frame',
				`if(printNumbers[i] === "adlib"){
					var resultsNumber = (results.adlibTotal > 0 ? Math.floor(results.adlib / results.adlibTotal * 100) : 0).toString()
				}else{
					var resultsNumber = results[printNumbers[i]]
				}
				var currentTime = lastTime + 500 + resultsNumber.length * 30 * this.frame`)
				str = plugins.insertAfter(str,
				'var start = this.state["countupTime" + p][printNumbers[i]]', `
				var isAdlib = printNumbers[i] === "adlib"
				if(isAdlib){
					var resultsNumber = (results.adlibTotal > 0 ? Math.floor(results.adlib / results.adlibTotal * 100) : 0).toString()
				}else{
					var resultsNumber = results[printNumbers[i]]
				}`)
				str = plugins.strReplace(str,
				'text: this.getNumber(results[printNumbers[i]], start, elapsed),',
				`text: this.getNumber(resultsNumber, start, elapsed),`)
				str = plugins.insertAfter(str, 'x: 971 + 270 * Math.floor(i / 3)', ` - (isAdlib ? 25 : 0)`)
				return plugins.strReplace(str,
				'letterSpacing: 1,',
				`letterSpacing: isAdlib ? -1 : 1,`)
			}),
			new EditValue(allStrings.en.note, "green").load(() => "Green"),
			new EditValue(allStrings.ja.note, "green").load(() => "グリーン"),
			new EditValue(allStrings.cn.note, "green").load(() => "绿"),
			new EditValue(allStrings.tw.note, "green").load(() => "綠"),
			new EditValue(allStrings.ko.note, "green").load(() => "녹색"),
			new EditFunction(View.prototype, "refresh").load(str => {
				str = plugins.insertBefore(str,
				`var drawScore = this.currentScore.adlib ? "adlib" : scores[this.currentScore.type]
				`, 'var yOffset = scoreMS < 70 ? scoreMS * (13 / 70) : 0')
				return plugins.strReplace(str, 'score: scores[this.currentScore.type],', `score: drawScore,`)
			}),
			new EditFunction(View.prototype, "drawCircle").load(str => {
				return plugins.insertBefore(str,
				`}else if(type === "green"){
					fill = "#5eb956"
					size = bigCircleSize
					faceID = noteFace.big
				`, '}else if(type === "balloon"){')
			}),
			new EditFunction(View.prototype, "displayScore").load((str, args) => {
				args.push("adlib")
				return plugins.insertAfter(str,
				'this.currentScore.bigNote = bigNote', `
				this.currentScore.adlib = adlib`)
			})
		)
		return promise
	}
	unload(){
		delete assets.sounds["se_hidden"]
		delete assets.sounds["se_hidden_p1"]
		delete assets.sounds["se_hidden_p2"]
	}
}

function se_hidden(){
	return "data:audio/ogg;base64,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"
}
