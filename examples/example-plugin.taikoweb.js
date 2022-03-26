export default class Plugin extends Patch{
	name = "Example Plugin"
	version = "22.02.11"
	description = "Replaces the judge score with great/cool/miss"
	author = "Katie Frogs"
	
	load(){
		this.log("load")
		this.addEdits(
			new EditValue(allStrings.en, "good").load(() => "GREAT"),
			new EditValue(allStrings.en, "ok").load(() => "COOL"),
			new EditValue(allStrings.en, "bad").load(() => "MISS")
		)
	}
	start(){
		this.log("start")
	}
	stop(){
		this.log("stop")
	}
	unload(){
		this.log("unload")
	}
}
