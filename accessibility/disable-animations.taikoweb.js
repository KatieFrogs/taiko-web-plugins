export default class Plugin extends Patch{
	name = "Disable Animations"
	version = "22.03.16"
	description = "Turn off most of the animated elements in the game"
	author = "Katie Frogs"
	
	disabledAnimations = {
		"title screen proceed": true,
		"highlight": true,
		"dropzone fade": true,
		"loading gif": true,
		// song select
		"song select background": true,
		"song select background fade": true,
		"song select move": true,
		"song select fade in": true,
		"song select ura fade": true,
		"song select ura arrow": true,
		// in-game
		"pause don": true,
		"don background": true,
		"song background": true,
		"taiko pressed keys": true,
		"taiko pressed keys fade": true,
		"combo change": true,
		"bar pressed keys": true,
		"judge score jump": true,
		"judge score fade": false,
		"note faces": true,
		"note explosion": true,
		"pause note explosion": true,
		"note shadow": true,
		"note shadow fade out": true,
		"flying notes": true,
		"flying note fade": true,
		"go go time fire fade": true,
		"pause go go time fire": true,
		"go go time fireworks": true,
		"pause go go time fireworks": true,
		"branch bar change": false,
		"branch text change": true,
		// results
		"results fade in": true,
		"results object fade in": true,
		"results crown": true,
		"results countup": true,
		"results tetsuo and hana": true,
		"results mikoshi": true,
		"results flowers": true,
		"results fade out": true,
	}
	
	load(){
		var d = this.disabledAnimations
		this.addEdits(
			new EditFunction(SongSelect.prototype, "init").load(str => {
				if(d["song select move"])
					str = plugins.strReplace(str, 'speed: 400', `speed: 0`)
				return str
			}),
			new EditFunction(SongSelect.prototype, "redraw").load(str => {
				if(d["song select move"]){
					str = plugins.strReplace(str,
					'(key === "right" || key === "left") ? 20',
					`(key === "right" || key === "left") ? 150`)
					str = plugins.insertBefore(str, `resize && `, 'this.state.moveMS && ms < this.state.moveMS + changeSpeed')
					str = plugins.insertAfter(str,
					'var elapsed = ms - this.state.moveMS', `
					if(this.state.move){
						this.state.waitPreview = ms + 400
						if(this.previewing !== null){
							this.endPreview()
						}
					}`)
				}
				if(d["song select fade in"]){
					str = plugins.strReplace(str,
					'if(screen === "titleFadeIn"){',
					`if(false){`)
				}
				if(d["song select ura fade"])
					str = plugins.insertBefore(str,
					`alphaFade = alphaFade < 0.5 ? 0 : 1
					`, 'this.draw.alpha(alphaFade, ctx, ctx => {')
				if(d["song select ura arrow"])
					str = plugins.strReplace(str, '((ms - this.state.screenMS) % 1200) / 1200', `0`)
				if(d["highlight"]){
					str = plugins.strReplace(str, 'highlight = 1', `highlight = 2`, 6)
					str = plugins.insertBefore(str, `false && `, '!p2.session && screen === "song"){')
					str = plugins.strReplace(str,
					'highlight: highlight,',
					`highlight: highlight ? 1 : 0,`, 3)
				}
				return str
			}),
			new EditFunction(View.prototype, "refresh").load(str => {
				if(d["highlight"])
					str = plugins.strReplace(str, 'highlight = 1', `highlight = 2`, 2)
				if(d["combo change"])
					str = plugins.insertBefore(str,
				`comboScale = 0
				`, 'var glyphW = 51')
				if(d["taiko pressed keys"])
					str = plugins.strReplace(str,
					'for(var i = 0; i < keys.length; i++){',
					`for(var i = 0; i < 0; i++){`)
				if(d["taiko pressed keys fade"])
					str = plugins.strReplace(str, 'keyMS > 70 && !this.touchEnabled', `false`)
				if(d["judge score jump"])
					str = plugins.insertAfter(str, 'var fadeOut = scoreMS > 250 && !this.touchEnabled', `
				yOffset = 0`)
				if(d["judge score fade"])
					str = plugins.insertAfter(str, 'var fadeOut = scoreMS > 250 && !this.touchEnabled', `
				fadeOut = 0`)
				if(d["branch bar change"])
					str = plugins.strReplace(str, 'this.branchAnimate && ms <= this.branchAnimate.ms + 300', `false`)
				if(d["branch text change"])
					str = plugins.strReplace(str, 'this.branchAnimate && ms - this.branchAnimate.ms < 310 && ms >= this.branchAnimate.ms', `false`)
				if(d["bar pressed keys"])
					str = plugins.strReplace(str, 'keyTime[sound] > ms - 130', `false`)
				if(d["note explosion"])
					str = plugins.strReplace(str, 'this.assets.drawAssets("notes")', ``)
				if(d["note shadow"])
					str = plugins.strReplace(str, 'scoreMS < 300 && this.currentScore.type', `false`)
				if(d["note shadow fade out"])
					str = plugins.strReplace(str, 'scoreMS > 120 && !this.touchEnabled', `false`)
				if(d["go go time fireworks"])
					str = plugins.strReplace(str,
					'!this.touchEnabled && !this.portrait && !this.multiplayer',
					`false`)
				return str
			}),
			new EditFunction(View.prototype, "drawAnimatedCircles").load(str => {
				if(d["flying notes"]){
					str = plugins.insertAfter(str,
					`if(circle.fixedPos`, ' || typeof circle.fixedPos === "undefined"')
					str = plugins.insertBefore(str,
					`else{
						continue
					}`, 'var animPoint = (ms - animT) / 490')
					str = plugins.insertAfter(str,
					'if(ms < animT + 810){', `
					continue;`)
				}
				if(d["flying notes"] || d["flying note fade"]){
					str = plugins.strReplace(str, 'circle.animationEnded = true', ``)
				}
				return str
			}),
			new EditFunction(View.prototype, "updateNoteFaces").load(str => {
				if(d["note faces"])
					str = plugins.strReplace(str, 'this.controller.getCombo() >= 50', `false`)
				return str
			}),
			new EditFunction(View.prototype, "updateCombo").load(str => {
				if(d["pause don"])
					str = `return;` + str
				return str
			}),
			new EditFunction(ViewAssets.prototype, "init").load(str => {
				if(d["pause don"])
					str = plugins.insertAfter(str, '"background", frame => {', `
				frame = 0`)
				if(d["pause note explosion"])
					str = plugins.insertAfter(str, '"notes", frame => {', `
				frame = 0`)
				if(d["go go time fire fade"]){
					str = plugins.strReplace(str, '3 - Math.min(200, elapsed) / 100', `1`)
					str = plugins.strReplace(str, 'Math.min(200, elapsed) / 200', `1`)
					str = plugins.strReplace(str, '1 - Math.min(100, elapsed) / 100', `0`)
				}
				if(d["pause go go time fire"])
					str = plugins.insertAfter(str, '"bar", frame => {', `
				frame = 0`)
				if(d["pause go go time fireworks"])
					str = plugins.insertAfter(str, '"foreground", frame => {', `
				frame = 0`)
				return str
			}),
			new EditFunction(Scoresheet.prototype, "redraw").load(str => {
				if(d["results fade in"])
					str = plugins.insertBefore(str,
					`bgOffset = (bgOffset < winH / 4) ? 0 : winH / 2
					`, 'if(bgOffset){')
				if(d["results object fade in"]){
					str = plugins.insertAfter(str, 'this.draw.alpha(Math.min(1, elapsed / 400)', ` < 0.5 ? 0 : 1`)
					str = plugins.insertAfter(str, 'this.draw.alpha(Math.min(1, (elapsed - 800) / 500)', ` < 0.5 ? 0 : 1`)
					str = plugins.strReplace(str,
					'ctx.globalAlpha = Math.min(1, Math.max(0, (elapsed - (3100 + failedOffset)) / 500)) * 0.5',
					`ctx.globalAlpha = 0.5`)
				}
				if(d["results crown"]){
					str = plugins.strReplace(str, 'Math.min(1, (elapsed - 1200) / 450)', `1`)
					str = plugins.insertBefore(str,
					`crownScale = 1
					shine = 0
					`, 'if(this.state.screen === "fadeIn" && elapsed >= 1200')
				}
				return str
			}),
			new EditFunction(Scoresheet.prototype, "getNumber").load(str => {
				if(d["results countup"])
					str = plugins.strReplace(str, 'this.numbers[numberPos % 30]', `"."`)
				return str
			}),
			new EditFunction(Account.prototype, "accountForm").load(str => {
				if(d["pause don"])
					str = plugins.strReplace(str, 'matchMedia("(prefers-reduced-motion: reduce)").matches', `true`)
				return str
			})
		)
		if(d["loading gif"]){
			var image = assets.image["dancing-don"]
			var canvas = document.createElement("canvas")
			canvas.width = image.width
			canvas.height = image.height
			var ctx = canvas.getContext("2d")
			ctx.drawImage(image, 0, 0)
			var promise = new Promise(resolve => {
				try{
					canvas.toBlob(resolve)
				}catch(e){
					resolve()
				}
			}).then(blob => {
				if(blob){
					var image = document.createElement("img")
					var promise = pageEvents.load(image)
					image.id = "dancing-don2.gif"
					image.src = URL.createObjectURL(blob)
					return promise.then(() => {
						loader.assetsDiv.appendChild(image)
						this.newDancingDon = image
						this.addEdits(
							new EditValue(assets.image, "dancing-don").load(() => this.newDancingDon)
						)
					}, () => Promise.resolve())
				}
			})
		}else{
			var promise = Promise.resolve()
		}
		return promise.then(() => {
			var css = []
			var playState = []
			if(d["song select background"])
				playState.push("#song-select")
			if(d["don background"])
				playState.push(".donbg>div")
			if(d["song background"])
				playState.push("#layer2")
			if(d["title screen proceed"])
				playState.push("#title-proceed")
			if(d["results tetsuo and hana"])
				playState.push("#tetsuo", "#tetsuo-in", "#hana", "#hana-in")
			if(d["results mikoshi"])
				playState.push("#mikoshi", "#mikoshi-in")
			if(playState.length)
				css.push(loader.cssRuleset({
					[playState.join(", ")]: {
						"animation-play-state": "paused !important"
					}
				}))
			var animation = []
			if(d["highlight"])
				animation.push(".setting-box", ".setting-value")
			if(d["results mikoshi"])
				animation.push("#mikoshi-out")
			if(d["results flowers"])
				animation.push("#flowers1-in", "#flowers2-in")
			if(animation.length)
				css.push(loader.cssRuleset({
					[animation.join(", ")]: {
						"animation": "none !important"
					}
				}))
			var transition = []
			if(d["song select background fade"])
				transition.push("#song-select")
			if(d["dropzone fade"])
				transition.push("#dropzone")
			if(d["results tetsuo and hana"])
				transition.push("#tetsuo", "#hana")
			if(d["results flowers"])
				transition.push("#flowers1", "#flowers2")
			if(transition.length){
				css.push(loader.cssRuleset({
					[transition.join(", ")]: {
						"transition": "none !important"
					}
				}))
			}
			if(d["highlight"])
				css.push(loader.cssRuleset({
					".view-content:not(:hover) .setting-box.selected, .setting-box:hover": {
						"border-color": "#ff0"
					},
					".setting-value.selected": {
						"border-color": "#e29e06"
					}
				}))
			if(d["results flowers"])
				css.push(loader.cssRuleset({
					"#tetsuohana.dance #flowers1-in, #tetsuohana.dance #flowers2-in": {
						"background-position-y": "calc(-318px * var(--scale)) !important"
					}
				}))
			if(d["results fade out"])
				css.push(loader.cssRuleset({
					"#fade-screen": {
						"display": "none"
					}
				}))
			if(d["loading gif"])
				css.push(loader.cssRuleset({
					"#loading-don": {
						"background-image": this.newDancingDon ? `url("${this.newDancingDon.src}")` : "none"
					}
				}))
			if(css.length){
				this.style = document.createElement("style")
				this.style.appendChild(document.createTextNode(css.join("\n")))
			}
		})
	}
	start(){
		if(this.style){
			document.head.appendChild(this.style)
		}
	}
	stop(){
		if(this.style && this.style.parentNode){
			this.style.parentNode.removeChild(this.style)
		}
	}
	unload(){
		if(this.newDancingDon && this.newDancingDon.parentNode){
			URL.revokeObjectURL(this.newDancingDon.src)
			this.newDancingDon.parentNode.removeChild(this.newDancingDon)
		}
		delete this.newDancingDon
		delete this.style
	}
}
