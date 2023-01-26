export default class Plugin extends Patch{
	name = "Donkey Konga Mode"
	version = "23.01.26"
	description = "Adds support for custom Donkey Konga charts (GAME:Konga)"
	author = "Katie Frogs"
	
	strings = {
		pon: {
			ja: "ポン",
			en: "Pon"
		},
		pa: {
			ja: "パッ",
			en: "Pa"
		},
		pink: {
			en: "D"
		},
		clap: {
			ja: "チャッ",
			en: "Clap"
		},
		ex_note: {
			pon: {
				ja: ["ポ", "ポ"],
				en: ["Po", "Po"]
			},
			pa: {
				ja: ["パ", "パ"],
				en: ["Pa", "Pa"]
			},
			pink: {
				en: ["D", "D"]
			},
			clap: {
				ja: ["チャッ", "チャッ"],
				en: ["Clap", "Clap"]
			}
		}
	}
	assetFiles = {
		"neiro_1_pon.ogg": neiro_1_pon,
		"neiro_1_pa.ogg": neiro_1_pa,
		"neiro_1_clap.ogg": neiro_1_clap
	}
	
	load(){
		var promises = []
		for(let name in this.assetFiles){
			let id = this.getFilename(name)
			var file = this.assetFiles[name]
			promises.push(this.loadSound(file, name, snd.sfxGain).then(sound => {
				var soundL = sound.copy(snd.sfxGainL)
				var soundR = sound.copy(snd.sfxGainR)
				this.addEdits(
					new EditValue(assets.sounds, id + "_p1").load(() => soundL),
					new EditValue(assets.sounds, id + "_p2").load(() => soundR)
				)
			}))
		}
		promises.push(this.loadImg(notes_bongo, "notes_bongo.png").then(image => {
			this.notesBongo = image
			this.addEdits(
				new EditValue(assets.image, "notes_bongo").load(() => image)
			)
			this.canvasList = []
			for(var i = 0; i < 4; i++){
				let canvas = document.createElement("canvas")
				canvas.width = 12
				canvas.height = 64
				var ctx = canvas.getContext("2d")
				ctx.drawImage(image, 66, 64 * i, 12, 64, 0, 0, 12, 64)
				this.canvasList.push(canvas)
				this.addEdits(
					new EditValue(assets.image, "notes_bongo_drumroll" + (i + 1).toString()).load(() => canvas)
				)
			}
		}))
		this.addEdits(
			new EditValue(ParseTja.prototype, "bongoTxt").load(() => this.bongoTxt.bind(this)),
			new EditFunction(ParseTja.prototype, "init").load(str => {
				str = plugins.insertAfter(str, '"1": {name: "don",', ` bongoName: "pon", bongoTxt: this.bongoTxt("pon"),`)
				str = plugins.insertAfter(str, '"2": {name: "ka",', ` bongoName: "pa", bongoTxt: this.bongoTxt("pa"),`)
				str = plugins.insertAfter(str, '"3": {name: "daiDon",', ` bongoName: "pink", bongoTxt: this.bongoTxt("pink"),`)
				str = plugins.insertAfter(str, '"4": {name: "daiKa",', ` bongoName: "clap", bongoTxt: this.bongoTxt("clap"),`)
				str = plugins.insertAfter(str, '"5": {name: "drumroll",', ` bongoName: "ponDrumroll",`)
				str = plugins.insertAfter(str, '"6": {name: "daiDrumroll",', ` bongoName: "pinkDrumroll", bongoTxt: strings.note.drumroll,`)
				str = plugins.insertAfter(str, '"A": {name: "daiDon",', ` bongoName: "pink", bongoTxt: this.bongoTxt("pink"),`)
				str = plugins.insertAfter(str, '"B": {name: "daiKa",', ` bongoName: "clap", bongoTxt: this.bongoTxt("clap"),`)
				str = plugins.insertAfter(str,
				'this.noteTypes = {', `
				"H": {name: "drumroll", bongoName: "clapDrumroll", txt: strings.note.drumroll},
				"I": {name: "drumroll", bongoName: "paDrumroll", txt: strings.note.drumroll},`)
				return plugins.insertAfter(str, 'this.noteTypes_ex = strings.ex_note;', `
				this.bongoNoteTypes_ex = {
					pon: this.bongoTxt("ex_note", "pon"),
					pa: this.bongoTxt("ex_note", "pa"),
					pink: this.bongoTxt("ex_note", "pink"),
					clap: this.bongoTxt("ex_note", "clap")
				}`)
			}),
			new EditFunction(ParseTja.prototype, "parseMetadata").load(str => {
				return plugins.insertBefore(str,
				`}else if(name === "game"){
					value = value.toLowerCase()
					if(value === "konga"){
						currentCourse.bongoMode = true
					}
				`, '}else if(name === "balloon"){')
			}),
			new EditFunction(ParseTja.prototype, "parseCircles").load(str => {
				str = plugins.insertAfter(str,
				'note.text = this.noteTypes_ex[note.type][alldon_pos != null ? (i - alldon_pos) % 2 : 0];', `
				if(note.bongoType){
					note.bongoText = this.bongoNoteTypes_ex[note.bongoType][alldon_pos != null ? (i - alldon_pos) % 2 : 0]
				}`)
				str = plugins.insertAfter(str,
				'id: circleID,', `
				bongoType: note.bongoType,
				bongoTxt: note.bongoTxt,`)
				str = plugins.insertAfter(str,
				'case "5": case "6": case "7": case "9":', ` case "H": case "I":`)
				str = plugins.strReplace(str,
				'type: type.name,',
				`type: type.name,
				bongoType: type.bongoName,
				bongoTxt: type.bongoTxt,`, 2)
				return plugins.insertAfter(str,
				'this.scorediff = meta.scorediff', `
				this.bongoMode = meta.bongoMode`)
			}),
			new EditFunction(Circle.prototype, "init").load(str => {
				return plugins.insertAfter(str,
				'this.section = config.section', `
				this.bongoType = config.bongoType
				this.bongoText = config.bongoTxt`)
			}),
			new EditFunction(Game.prototype, "init").load(str => {
				return plugins.insertAfter(str,
				'this.songData = songData', `
				this.bongoMode = songData.bongoMode`)
			}),
			new EditFunction(Game.prototype, "checkPlays").load(str => {
				str = plugins.insertBefore(str,
				`if(this.bongoMode){
					this.checkKey(["don_l", "don_r"], circle, "pink")
				}else `, 'this.checkKey(["don_l", "don_r"], circle, "daiDon")')
				str = plugins.insertBefore(str,
				`if(this.bongoMode){
					this.checkKey(["don_l"], circle, "pa")
				}else `, 'this.checkKey(["don_l"], circle, "don")')
				str = plugins.insertBefore(str,
				`if(this.bongoMode){
					this.checkKey(["don_r"], circle, "pon")
				}else `, 'this.checkKey(["don_r"], circle, "don")')
				return plugins.insertBefore(str,
				`if(this.bongoMode){
					if(ka_l){
						this.checkKey(["ka_l"], circle, "clap")
					}
					if(ka_r){
						this.checkKey(["ka_r"], circle, "clap")
					}
				}else `, 'if(ka_l && ka_r){')
			}),
			new EditFunction(Game.prototype, "checkScore").load(str => {
				str = plugins.strReplace(str,
				'var type = circle.type',
				`var type = this.bongoMode ? (circle.bongoType || circle.type) : circle.type`)
				str = plugins.insertBefore(str,
				`keysDon = keysDon || check === "pon" || check === "pa" || check === "pink"
				keyDai = keyDai || check === "pink"
				typeDai = typeDai || type === "pink"
				var keysPon = check === "pon" || check === "pink"
				var keysPa = check === "pa" || check === "pink"
				var keysPink = check === "pink"
				var keysClap = check === "clap"
				var typePon = type === "pon" || type === "pink"
				var typePa = type === "pa" || type === "pink"
				var typePink = type === "pink"
				var typeClap = type === "clap"
				`, 'var keyTime = this.controller.getKeyTime()')
				str = plugins.insertAfter(str, 'if(typeDon || typeKa', ` || typePon || typePa || typePink || typeClap`)
				str = plugins.insertAfter(str, 'if(keysDon && typeDon || keysKa && typeKa', ` || keysPon && typePon || keysPa && typePa || keysPink && typePink || keysClap && typeClap`)
				str = plugins.strReplace(str,
				'circleStatus = circle.daiFailed.status',
				`if(type === "pink"){
					circleStatus = -1
					score = 0
				}else{
					circleStatus = circle.daiFailed.status
				}`)
				str = plugins.strReplace(str,
				'circle.played(score, score === 0 ? typeDai : keyDai)',
				`circle.played(circleStatus === -1 ? -1 : score, score === 0 ? typeDai : keyDai)`)
				str = plugins.strReplace(str,
				'this.controller.displayScore(score, false, typeDai && keyDai)',
				`this.controller.displayScore(score, circleStatus === -1, type === "pink" ? false : typeDai && keyDai)`)
				str = plugins.strReplace(str,
				'dai: typeDai ? (keyDai ? 2 : 1)',
				`dai: typeDai ? (keyDai ? 2 : (typePink ? 0 : 1))`)
				return plugins.insertBefore(str,
				`if(keysPon && type === "ponDrumroll" || keysPa && type === "paDrumroll" || keysClap && type === "clapDrumroll"){
					this.checkDrumroll(circle)
				}else if((keysPon || keysPa) && type === "pinkDrumroll"){
					this.checkDrumroll(circle, keysPa)
					if(keyDai){
						this.checkDrumroll(circle, keysPa)
					}
				}else `, 'if(keysDon && type === "balloon"){')
			}),
			new EditFunction(Game.prototype, "checkDrumroll").load(str => {
				str = plugins.strReplace(str,
				'var dai = circle.type === "daiDrumroll"',
				`var dai = this.bongoMode ? false : circle.type === "daiDrumroll"
				var bongoSound = null`)
				str = plugins.insertBefore(str,
				`if(this.bongoMode){
					if(circle.bongoType === "ponDrumroll"){
						var sound = "don"
						var bongoSound = "pon"
					}else if(circle.bongoType === "paDrumroll"){
						var sound = "don"
						var bongoSound = "pa"
					}else if(circle.bongoType === "pinkDrumroll"){
						var don_l = "don_l" in keyTime ? keyTime["don_l"] : -Infinity
						var don_r = "don_r" in keyTime ? keyTime["don_r"] : -Infinity
						var sound = "don"
						var bongoSound = don_l <= don_r ? "pon" : "pa"
					}else if(circle.bongoType === "clapDrumroll"){
						var sound = "ka"
						var bongoSound = "clap"
					}
				}else `, 'if(circle.type === "drumroll"){')
				return plugins.insertAfter(str,
				'type: sound,',
				`bongoType: bongoSound,`)
			}),
			new EditFunction(View.prototype, "drawCircle").load(str => {
				str = plugins.strReplace(str,
				'var type = circle.type',
				`var type = this.controller.game.bongoMode ? (circle.bongoType || circle.type) : circle.type
				var bongoID = 0`)
				str = plugins.insertBefore(str,
				`if(type === "pon"){
					size = circleSize
					faceID = noteFace.small
					bongoID = 1
				}else if(type === "pa"){
					size = circleSize
					faceID = noteFace.small
					bongoID = 2
				}else if(type === "pink"){
					size = circleSize
					faceID = noteFace.small
					bongoID = 3
				}else if(type === "clap"){
					size = circleSize
					faceID = noteFace.small
					bongoID = 4
				}else if(type === "ponDrumroll" || type === "paDrumroll" || type === "pinkDrumroll" || type === "clapDrumroll"){
					if(type === "ponDrumroll"){
						bongoID = 1
					}else if(type === "paDrumroll"){
						bongoID = 2
					}else if(type === "pinkDrumroll"){
						bongoID = 3
					}else if(type === "clapDrumroll"){
						bongoID = 4
					}
					size = circleSize
					faceID = noteFace.small
					endX = this.msToPos(endTime - circleMs, speed)
					drumroll = endX > 50 ? 2 : 1
					
					var drawSize = size * bigCircleSize / circleSize * (106 / 172) / (44 / 64)
					var rollW = (drawSize * 2 + 8) / 64 * 12
					
					this.draw.pattern({
						ctx: ctx,
						img: assets.image["notes_bongo_drumroll" + bongoID],
						x: circlePos.x,
						y: circlePos.y - drawSize - 4,
						w: endX + 1,
						h: drawSize * 2 + 8,
						dx: circlePos.x + endX,
						dy: circlePos.y - drawSize - 4,
						scale: 64 / (drawSize * 2 + 8)
					})
					ctx.drawImage(assets.image["notes_bongo"],
						78, 64 * (bongoID - 1),
						32, 64,
						circlePos.x + endX,
						circlePos.y - drawSize - 4,
						(drawSize * 2 + 8) / 2,
						drawSize * 2 + 8
					)
				}else `, 'if(type === "don" ||')
				str = plugins.strReplace(str,
				'var text = circle.text',
				`var text = this.controller.game.bongoMode ? (circle.bongoText || circle.text) : circle.text`)
				return plugins.insertBefore(str,
				`if(bongoID && (!fade || fade < 1)){
					var drawSize = size * bigCircleSize / circleSize * (106 / 172) / (44 / 64)
					ctx.drawImage(assets.image["notes_bongo"],
						0, 64 * (bongoID - 1),
						64, 64,
						circlePos.x - drawSize - 4,
						circlePos.y - drawSize - 4,
						drawSize * 2 + 8,
						drawSize * 2 + 8
					)
				}else `, 'if(!fade || fade < 1){')
			}),
			new EditFunction(GameRules.prototype, "init").load(str => {
				return plugins.insertBefore(str,
				`if(game.bongoMode){
					this.good = 3 / 2 * frame
					this.ok = 9 / 2 * frame
					this.bad = 15 / 2 * frame
					if(this.difficulty === "hard"){
						this.gaugeClear = 40 / 50
					}
				}
				`, 'this.daiLeniency = 2 * frame')
			}),
			new EditFunction(Mekadon.prototype, "play").load(str => {
				str = plugins.strReplace(str,
				'type = circle.type',
				`type = this.game.bongoMode ? (circle.bongoType || circle.type) : circle.type`, 2)
				str = plugins.strReplace(str,
				'type === "daiDrumroll"',
				`type === "daiDrumroll" || type === "ponDrumroll" || type === "paDrumroll" || type === "pinkDrumroll" || type === "clapDrumroll"`, 2)
				return str
			}),
			new EditFunction(Mekadon.prototype, "playNow").load(str => {
				str = plugins.strReplace(str,
				'var type = circle.type',
				`var type = this.game.bongoMode ? (circle.bongoType || circle.type) : circle.type`)
				str = plugins.insertAfter(str, 'type === "daiDrumroll"', ` || type === "ponDrumroll" || type === "paDrumroll" || type === "pinkDrumroll" || type === "clapDrumroll"`)
				str = plugins.insertBefore(str,
				`if(type === "pon"){
					type = "pa"
				}else if(type === "pa" || type === "clap"){
					type = "pon"
				}else `, 'if(type === "don" || type === "daiDon"){')
				str = plugins.insertBefore(str,
				`if(type === "pon" || type === "ponDrumroll"){
					this.setKey("don_r", ms)
					this.lr = true
				}else if(type === "pa" || type === "paDrumroll"){
					this.setKey("don_l", ms)
					this.lr = false
				}else if(type === "pink" && playDai){
					this.setKey("don_l", ms)
					this.setKey("don_r", ms)
					this.lr = false
					keyDai = true
				}else if(type === "pinkDrumroll"){
					this.setKey(this.lr ? "don_l" : "don_r", ms)
					this.lr = !this.lr
				}else if(type === "clap" || type === "clapDrumroll"){
					this.setKey(this.lr ? "ka_l" : "ka_r", ms)
					this.lr = !this.lr
				}else `, 'if(type === "daiDon" && playDai')
				str = plugins.insertAfter(str, 'if(type === "daiDon" && playDai', ` || type === "pink" && playDai`)
				str = plugins.insertAfter(str, 'if(type === "drumroll" || type === "daiDrumroll"', ` || type === "ponDrumroll" || type === "paDrumroll" || type === "pinkDrumroll" || type === "clapDrumroll"`)
				return plugins.strReplace(str,
				'this.controller.displayScore(score, false, keyDai)',
				`this.controller.displayScore(score, false, type === "pink" ? false : keyDai)`)
			}),
			new EditFunction(GameInput.prototype, "checkKeySound").load(str => {
				return plugins.insertBefore(str,
				`if(this.game.bongoMode){
					if(sound === "don"){
						var don_l = "don_l" in this.keyTime ? this.keyTime["don_l"] : -Infinity
						var don_r = "don_r" in this.keyTime ? this.keyTime["don_r"] : -Infinity
						sound = don_l <= don_r ? "pon" : "pa"
					}else if(sound === "ka"){
						sound = "clap"
					}
				}
				`, 'this.controller.playSound("neiro_1_" + sound)')
			})
		)
		return Promise.all(promises)
	}
	unload(){
		loader.assetsDiv.removeChild(this.notesBongo)
		URL.revokeObjectURL(this.notesBongo.src)
		delete this.notesBongo
		this.canvasList.forEach(canvas => {
			canvas.width = 1
			canvas.height = 1
		})
		delete this.canvasList
	}
	bongoTxt(key1, key2){
		var str = this.strings[key1]
		if(key2){
			str = str[key2]
		}
		return plugins.getLocalTitle(str.en, str)
	}
	getFilename(name){
		return name.slice(0, name.lastIndexOf("."))
	}
	loadSound(file, name, gain){
		var id = this.getFilename(name)
		return gain.load(new RemoteFile(file())).then(sound => {
			this.addEdits(new EditValue(assets.sounds, id).load(() => sound))
			return sound
		})
	}
	loadImg(file, name){
		return loader.ajax(file(), request => {
			request.responseType = "blob"
		}).then(blob => {
			var image = document.createElement("img")
			var promise = pageEvents.load(image)
			image.id = name
			image.src = URL.createObjectURL(blob)
			loader.assetsDiv.appendChild(image)
			return promise.then(() => image)
		})
	}
}

function neiro_1_pon(){
	return "data:audio/ogg;base64,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\
UWYaMJFx6AQkNWBABRAACAMYgxxZhRCkIpJTRKQQkllApCaamklElIrbXWMimptdZaJaW0llrLoKTWWmuZhNZaa60AALADBwCwAwuh0JCVAEAeAACCjFKMOeccNUYpxpxzjhqjFGPOOUeVUso55yCklCrFnHMOUkoZc8455yiljDnnnHOUUuecc845SqmUzjnnHKVUSuecc45SKiVjzjknAACowAEAIMBGkc0JRoIKDVkJAKQCABgcx7I8z/NM0TQtSdI0URRF01RVS5I0TRRNUTVVlWVpmiiapqq6Lk3TNFE0TVV1Xarqeaapqq7rulRX9ExTVV1XlgEAAAAAAAAAAAABAOAJDgBABTasjnBSNBZYaMhKACADAAAxBiFkDELIGIQUQggppRASAAAw4AAAEGBCGSg0ZCUAkAoAABijlHPOSUmlQogx5yCU0lKFEGPOQSilpagxxiCUklJrUWOMQSglpdaiayGUklJKrUXXQiglpdZai1\
KqVEpqrcUYpVSplNZaizFKqXNKrcUYY5RS95Rai7HWKKV0MsYYY63NOedkjDHGWgsAQGhwAAA7sGF1hJOiscBCQ1YCAHkAAAhCSjHGGGMQIaUYY8wxh5BSjDHGGFSKMcYcYw5CyBhjjDEHIWSMMeecgxAyxhhjzkEInXOOMecghNA5x5hzEELnnGPMOQihc4wx5pwAAKACBwCAABtFNicYCSo0ZCUAEA4AABjDmHOMOQadhAoh5yB0DkIqqVQIOQehcxBKSal4DjopIZRSSirFcxBKCaGUlForLoZSSiilpNRSkTGEUkopJaXWijGmhJBSSqm1VowxoYRUUkoptmKMjaWk1FprrRVjbCwlldZaa60YY4xrKbUWY6zFGGNcS6mlGGssxhjje2otxlhjMcYYn1tqKaZcCwAweXAAgEqwcYaVpLPC0eBCQ1YCALkBAAhCSjHGmGPOOeecc85JpRhzzjnnIIQQQgghlEox5pxzzkEHIYQQQi\
gZc845ByGEEEIIIYRQUuqYcw5CCCGEEEIIIaXUOecghBBCCCGEEEJKqXPOQQghhBBCCCGElFIIIYQQQgghhBBCCCmllEIIIYQQQgghlBJSSimFEEIIJYQSSgglpJRSCiGEEEIppYRSQkkppRRCCKWUUEopoZSQUkoppRBCKKWUUEopJaWUUkollFJKKSWUUEpKKaWUSiihlFBKKaWUlFJKKZVSSikllFJKCSmllFJKqZRSSimllFJSSimllFIppZRSSimlpJRSSimlUkoppZQSSkkppZRSSqWUUEoppZRSUkoppZRKCqWUUkoppQAAoAMHAIAAIyotxE4zrjwCRxQyTECFhqwEAFIBAABCKKWUUkopNYxRSimllFKKHKSUUkoppZRSSimllFJKKZVSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoBwN\
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"
}
function neiro_1_pa(){
	return "data:audio/ogg;base64,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\
UWYaMJFx6AQkNWBABRAACAMYgxxZhRCkIpJTRKQQkllApCaamklElIrbXWMimptdZaJaW0llrLoKTWWmuZhNZaa60AALADBwCwAwuh0JCVAEAeAACCjFKMOeccNUYpxpxzjhqjFGPOOUeVUso55yCklCrFnHMOUkoZc8455yiljDnnnHOUUuecc845SqmUzjnnHKVUSuecc45SKiVjzjknAACowAEAIMBGkc0JRoIKDVkJAKQCABgcx7I8z/NM0TQtSdI0URRF01RVS5I0TRRNUTVVlWVpmiiapqq6Lk3TNFE0TVV1Xarqeaapqq7rulRX9ExTVV1XlgEAAAAAAAAAAAABAOAJDgBABTasjnBSNBZYaMhKACADAAAxBiFkDELIGIQUQggppRASAAAw4AAAEGBCGSg0ZCUAkAoAABijlHPOSUmlQogx5yCU0lKFEGPOQSilpagxxiCUklJrUWOMQSglpdaiayGUklJKrUXXQiglpdZai1\
KqVEpqrcUYpVSplNZaizFKqXNKrcUYY5RS95Rai7HWKKV0MsYYY63NOedkjDHGWgsAQGhwAAA7sGF1hJOiscBCQ1YCAHkAAAhCSjHGGGMQIaUYY8wxh5BSjDHGGFSKMcYcYw5CyBhjjDEHIWSMMeecgxAyxhhjzkEInXOOMecghNA5x5hzEELnnGPMOQihc4wx5pwAAKACBwCAABtFNicYCSo0ZCUAEA4AABjDmHOMOQadhAoh5yB0DkIqqVQIOQehcxBKSal4DjopIZRSSirFcxBKCaGUlForLoZSSiilpNRSkTGEUkopJaXWijGmhJBSSqm1VowxoYRUUkoptmKMjaWk1FprrRVjbCwlldZaa60YY4xrKbUWY6zFGGNcS6mlGGssxhjje2otxlhjMcYYn1tqKaZcCwAweXAAgEqwcYaVpLPC0eBCQ1YCALkBAAhCSjHGmGPOOeecc85JpRhzzjnnIIQQQgghlEox5pxzzkEHIYQQQi\
gZc845ByGEEEIIIYRQUuqYcw5CCCGEEEIIIaXUOecghBBCCCGEEEJKqXPOQQghhBBCCCGElFIIIYQQQgghhBBCCCmllEIIIYQQQgghlBJSSimFEEIIJYQSSgglpJRSCiGEEEIppYRSQkkppRRCCKWUUEopoZSQUkoppRBCKKWUUEopJaWUUkollFJKKSWUUEpKKaWUSiihlFBKKaWUlFJKKZVSSikllFJKCSmllFJKqZRSSimllFJSSimllFIppZRSSimlpJRSSimlUkoppZQSSkkppZRSSqWUUEoppZRSUkoppZRKCqWUUkoppQAAoAMHAIAAIyotxE4zrjwCRxQyTECFhqwEAFIBAABCKKWUUkopNYxRSimllFKKHKSUUkoppZRSSimllFJKKZVSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoBwN\
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"
}
function neiro_1_clap(){
	return "data:audio/ogg;base64,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\
UWYaMJFx6AQkNWBABRAACAMYgxxZhRCkIpJTRKQQkllApCaamklElIrbXWMimptdZaJaW0llrLoKTWWmuZhNZaa60AALADBwCwAwuh0JCVAEAeAACCjFKMOeccNUYpxpxzjhqjFGPOOUeVUso55yCklCrFnHMOUkoZc8455yiljDnnnHOUUuecc845SqmUzjnnHKVUSuecc45SKiVjzjknAACowAEAIMBGkc0JRoIKDVkJAKQCABgcx7I8z/NM0TQtSdI0URRF01RVS5I0TRRNUTVVlWVpmiiapqq6Lk3TNFE0TVV1Xarqeaapqq7rulRX9ExTVV1XlgEAAAAAAAAAAAABAOAJDgBABTasjnBSNBZYaMhKACADAAAxBiFkDELIGIQUQggppRASAAAw4AAAEGBCGSg0ZCUAkAoAABijlHPOSUmlQogx5yCU0lKFEGPOQSilpagxxiCUklJrUWOMQSglpdaiayGUklJKrUXXQiglpdZai1\
KqVEpqrcUYpVSplNZaizFKqXNKrcUYY5RS95Rai7HWKKV0MsYYY63NOedkjDHGWgsAQGhwAAA7sGF1hJOiscBCQ1YCAHkAAAhCSjHGGGMQIaUYY8wxh5BSjDHGGFSKMcYcYw5CyBhjjDEHIWSMMeecgxAyxhhjzkEInXOOMecghNA5x5hzEELnnGPMOQihc4wx5pwAAKACBwCAABtFNicYCSo0ZCUAEA4AABjDmHOMOQadhAoh5yB0DkIqqVQIOQehcxBKSal4DjopIZRSSirFcxBKCaGUlForLoZSSiilpNRSkTGEUkopJaXWijGmhJBSSqm1VowxoYRUUkoptmKMjaWk1FprrRVjbCwlldZaa60YY4xrKbUWY6zFGGNcS6mlGGssxhjje2otxlhjMcYYn1tqKaZcCwAweXAAgEqwcYaVpLPC0eBCQ1YCALkBAAhCSjHGmGPOOeecc85JpRhzzjnnIIQQQgghlEox5pxzzkEHIYQQQi\
gZc845ByGEEEIIIYRQUuqYcw5CCCGEEEIIIaXUOecghBBCCCGEEEJKqXPOQQghhBBCCCGElFIIIYQQQgghhBBCCCmllEIIIYQQQgghlBJSSimFEEIIJYQSSgglpJRSCiGEEEIppYRSQkkppRRCCKWUUEopoZSQUkoppRBCKKWUUEopJaWUUkollFJKKSWUUEpKKaWUSiihlFBKKaWUlFJKKZVSSikllFJKCSmllFJKqZRSSimllFJSSimllFIppZRSSimlpJRSSimlUkoppZQSSkkppZRSSqWUUEoppZRSUkoppZRKCqWUUkoppQAAoAMHAIAAIyotxE4zrjwCRxQyTECFhqwEAFIBAABCKKWUUkopNYxRSimllFKKHKSUUkoppZRSSimllFJKKZVSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoBwN\
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"
}
function notes_bongo(){
	return "data:image/png;base64,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"
}
