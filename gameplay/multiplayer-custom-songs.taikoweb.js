export default class Plugin extends Patch{
	name = "Multiplayer Custom Songs"
	version = "23.01.10"
	description = "Extends netplay and session multiplayer to custom song lists, both players are required to have the same folders"
	author = "Katie Frogs"
	
	strings = {
		customSessionTutorial: {
			en: "Share this code with your friend to start playing together! Your friend should import the exact same folder as you, and use the Join Invite button on the session screen with the provided code."
		},
		joinInvite: {
			en: "Join Invite"
		},
		inviteDescription: {
			en: "Provide the invite code from your friend"
		},
		incorrectFolder: {
			en: "Folders do not match. To connect, both players must import the exact same folders."
		},
		incorrectInvite: {
			en: "The invite is not in the correct format."
		},
		customSessionError: {
			en: "Session Disconnected\n\nTo connect, both players must import the exact same folders."
		}
	}
	
	load(){
		this.addEdits(
			new EditFunction(SongSelect.prototype, "init").load(str => {
				return plugins.strReplace(str, 'if(!assets.customSongs)', ``)
			}),
			new EditFunction(SongSelect.prototype, "mouseDown").load(str => {
				return plugins.strReplace(str, ' && !assets.customSongs', ``)
			}),
			new EditFunction(SongSelect.prototype, "mouseMove").load(str => {
				return plugins.strReplace(str, ' && !assets.customSongs', ``)
			}),
			new EditFunction(SongSelect.prototype, "toSession").load(str => {
				return plugins.strReplace(str, ' || assets.customSongs', ``)
			}),
			new EditFunction(SongSelect.prototype, "redraw").load(str => {
				str = plugins.strReplace(str, ' && !assets.customSongs', ``)
				return plugins.insertBefore(str,
				`}else if(this.showWarning.name === "customSessionError"){
					var text = this.customMpStr("customSessionError")
				`, '}else if(this.showWarning.name === "loadSongError"){')
			}),
			new EditFunction(SongSelect.prototype, "toLoadSong").load(str => {
				return plugins.strReplace(str, ' && !assets.customSongs', ``)
			}),
			new EditFunction(SongSelect.prototype, "onusers").load(str => {
				return plugins.strReplace(str, ' |0', ``)
			}),
			new EditFunction(SongSelect.prototype, "toOptions").load(str => {
				return plugins.strReplace(str, ' || assets.customSongs', ``)
			}),
			new EditFunction(ImportSongs.prototype, "addTja").load(str => {
				return plugins.insertAfter(str, 'songObj.hash = hash', `
				songObj.id = hash`)
			}),
			new EditFunction(ImportSongs.prototype, "addOsu").load(str => {
				return plugins.insertAfter(str, 'songObj.hash = hash', `
				songObj.id = hash`)
			}),
			new EditFunction(Session.prototype, "init").load(str => {
				str = plugins.insertBefore(str,
				`if(assets.customSongs){
					this.customSongsHash = p2.customSongsHash()
					var leftButtons = document.createElement("div")
					leftButtons.classList.add("left-buttons")
					this.joinInvite = document.createElement("div")
					this.joinInvite.classList.add("taibtn", "stroke-sub", "link-btn")
					this.joinInvite.innerText = this.customMpStr("joinInvite")
					leftButtons.appendChild(this.joinInvite)
					this.endButton.parentNode.insertBefore(leftButtons, this.endButton)
				}
				`, 'if(touchEnabled){')
				str = plugins.strReplace(str, 'strings.session.linkTutorial', `assets.customSongs ? this.customMpStr("customSessionTutorial") : strings.session.linkTutorial`)
				str = plugins.insertAfter(str,
				'}else if(response.type === "songsel"){', `
					var nameMsg = p2.getMessage("name")
					if(assets.customSongs && (!nameMsg.value?.don?.customSongs || nameMsg.value.don.customSongs !== this.customSongsHash) || !assets.customSongs && nameMsg.value?.don?.customSongs){
						p2.otherConnected = false
						p2.session = false
						this.onEnd(false, true)
					}else{
				`)
				str = plugins.insertAfter(str,
				'pageEvents.send("session-start", "host")', `
				}`)
				str = plugins.insertBefore(str,
				`if(response.type === "gameend" && assets.customSongs){
					this.sendInviteRequest()
				}else if(response.type === "invite" && assets.customSongs){
					if(response.value){
						this.inviteCode = response.value
						this.sessionInvite.innerText = response.value + "-" + this.customSongsHash.slice(0, 5).toLowerCase()
						p2.hash(response.value)
					}else{
						p2.clearMessage("users")
						this.onEnd()
						pageEvents.send("session-start", "host")
					}
				}else `, 'if(response.type === "invite"){')
				return plugins.strReplace(str, 'p2.send("invite", {\n\t\t\tid: null,\n\t\t\tname: account.loggedIn ? account.displayName : null,\n\t\t\tdon: account.loggedIn ? account.don : null\n\t\t})', `this.sendInviteRequest()`)
			}),
			new EditFunction(Session.prototype, "mouseDown").load(str => {
				return plugins.insertBefore(str,
				`if(event.target === this.joinInvite){
					var code = prompt(this.customMpStr("inviteDescription"), "").trim()
					if(code){
						if(code.length === 11){
							code = code.toLowerCase().split("-")
							if(code[0].length === code[1].length && code[0] !== this.inviteCode){
								if(code[1] === this.customSongsHash.slice(0, 5).toLowerCase()){
									this.sessionInvite.innerText = ""
									p2.send("leave")
									p2.hash(code[0])
									return this.sendInviteRequest(code[0])
								}else{
									return alert(this.customMpStr("incorrectFolder"))
								}
							}
						}
						alert(this.customMpStr("incorrectInvite"))
					}
				}else `, 'if(event.target === this.endButton){')
			}),
			new EditFunction(Session.prototype, "onEnd").load((str, args) => {
				args.push("p2Disconnect")
				str = plugins.insertAfter(str, 'setTimeout(() => {', `
				if(p2Disconnect){
					p2.send("gameend")
					p2.otherConnected = false
					p2.session = false
					new SongSelect(false, false, this.touchEnabled, null, {
						name: "customSessionError"
					})
				}else{`)
				return plugins.insertBefore(str, `}`, '}, 500)')
			}),
			new EditFunction(Session.prototype, "clean").load(str => {
				return plugins.insertAfter(str,
				'delete this.sessionInvite', `
				if(assets.customSongs){
					delete this.joinInvite
				}`)
			}),
			new EditFunction(Search.prototype, "onClick").load(str => {
				return plugins.strReplace(str, 
				'var songId = parseInt(songEl.dataset.songId)',
				`var songId = Number(songEl.dataset.songId)
				if(isNaN(songId)){
					songId = songEl.dataset.songId
				}`)
			}),
			new EditFunction(Search.prototype, "keyPress").load(str => {
				return plugins.strReplace(str, 
				'this.proceed(parseInt(this.results[this.active].dataset.songId))',
				`var songId = Number(this.results[this.active].dataset.songId)
				if(isNaN(songId)){
					songId = this.results[this.active].dataset.songId
				}
				this.proceed(songId)`)
			}),
			new EditValue(p2, "customSongsHash").load(() => this.customSongsHash),
			new EditValue(Session.prototype, "customMpStr").load(() => this.customMpStr.bind(this)),
			new EditValue(Session.prototype, "sendInviteRequest").load(() => this.sendInviteRequest),
			new EditValue(SongSelect.prototype, "customMpStr").load(() => this.customMpStr.bind(this))
		)
	}
	customSongsHash(){
		return md5.base64(assets.songs.map(song => song.hash).join("")).slice(0, -2)
	}
	customMpStr(name){
		var str = this.strings[name]
		return plugins.getLocalTitle(str.en, str)
	}
	sendInviteRequest(id){
		var don = account.loggedIn ? {...account.don} : (assets.customSongs ? {} : null)
		if(assets.customSongs){
			don.customSongs = this.customSongsHash
		}
		p2.send("invite", {
			id: id || null,
			name: account.loggedIn ? account.displayName : null,
			don: don
		})
	}
	start(){
		if(assets.customSongs){
			assets.songs.forEach(song => song.id = song.hash)
		}
	}
	stop(){
		if(assets.customSongs){
			assets.songs.forEach(song => song.id = song.order)
		}
	}
}
