export default class Plugin extends Patch{
	name = "Custom Scroll Speed"
	version = "22.02.11"
	description = "Changes the speed the notes scroll at in game"
	author = "Katie Frogs"
	
	load(){
		var speed = 0.5
		
		this.addEdits(
			new EditFunction(View.prototype, "drawCircles").load(str => {
				return str.replace(/circle\.speed.*?$/m, "circle.speed * " + speed)
			}),
			new EditFunction(View.prototype, "drawCircle").load(str => {
				return str.replace(/circle\.speed.*?$/m, "circle.speed * " + speed)
			}),
			new EditFunction(View.prototype, "drawMeasures").load(str => {
				return str.replace(/measure\.speed.*?\)/g, "measure.speed * " + speed + ")")
			})
		)
	}
}
