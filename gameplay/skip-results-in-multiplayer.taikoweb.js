export default class Plugin extends Patch{
	name = "Skip Results in Multiplayer"
	version = "22.05.23"
	description = "Enables skipping the results screen in multiplayer, however, the other player will not get to see the full results screen without the plugin"
	author = "Katie Frogs"
	
	load(){
		this.addEdits(
			new EditFunction(Scoresheet.prototype, "init").load(str => {
				str = plugins.insertAfter(str, 'if(this.session){', `
				var noteValue = p2.getMessage("note")
				if(noteValue){
					if(noteValue.skipResults){
						this.toScoresShown(true)
					}else if(noteValue.donSound){
						this.playSound("neiro_1_don", p2.player === 1 ? 1 : 0)
					}
				}`)
				return plugins.insertBefore(str,
				`if(response.type === "note" && response.value){
					if(response.value.skipResults){
						this.toScoresShown(true)
					}else if(response.value.donSound){
						this.playSound("neiro_1_don", p2.player === 1 ? 1 : 0)
					}
				}else `, 'if(response.type === "songsel"){')
			})
		),
		this.addEdits(
			new EditFunction(Scoresheet.prototype, "redraw").load(str => {
				return plugins.strReplace(str, 'this.session ? "" : "pointer"', `"pointer"`)
			})
		),
		this.addEdits(
			new EditFunction(Scoresheet.prototype, "toScoresShown").load((str, args) => {
				args.push("fromP2")
				str = plugins.strReplace(str, '!p2.session', `this.state.screen === "fadeIn"`)
				str = plugins.insertBefore(str,
				`if(!p2.session)
				`, 'this.controller.playSound')
				return str + `
				if(p2.session){
					if(fromP2){
						this.playSound("neiro_1_don", p2.player === 1 ? 1 : 0)
					}else{
						this.playSound("neiro_1_don", p2.player === 1 ? 0 : 1)
						p2.send("note", {
							score: 450,
							ms: 0,
							dai: 0,
							skipResults: true
						})
					}
				}`
			})
		),
		this.addEdits(
			new EditFunction(Scoresheet.prototype, "toSongsel").load(str => {
				str = plugins.insertAfter(str, 'if(!fromP2', ` && !p2.session`)
				return str + `
				if(p2.session && !fromP2){
					this.playSound("neiro_1_don", p2.player === 1 ? 0 : 1)
					p2.send("note", {
						score: 450,
						ms: 0,
						dai: 0,
						donSound: true
					})
					p2.send("songsel")
				}`
			})
		)
	}
}
