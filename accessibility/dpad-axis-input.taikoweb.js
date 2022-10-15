export default class Plugin extends Patch {
	name = "D-pad Axis Input"
	name_lang = {
		tw: "D-pad 軸輸入"
	}
	version = "22.06.07"
	description = "Binds axis input to D-pad for gamepads"
	description_lang = {
		tw: "將軸的輸入和遊戲板的 D-pad 結合起來"
	}
	author = "Katie Frogs"

	leftRightAxis = 0
	upDownAxis = 1

	strings = {
		leftRightAxis: {
			name: "左右軸",
			name_lang: {},
			description: "The number for the left-right axis, can be checked on gamepad-tester.com",
			description_lang: {
				tw: "左右軸的數字，可以到「gamepad-tester.com」查看"
			}
		},
		upDownAxis: {
			name: "上下軸",
			name_lang: {},
			description: "The number for the up-down axis, can be checked on gamepad-tester.com",
			description_lang: {
				tw: "上下軸的數字，可以到「gamepad-tester.com」查看"
			}
		}
	}

	load() {
		this.addEdits(
			new EditFunction(Gamepad.prototype, "play").load(str => {
				return plugins.insertBefore(str,
					`var leftRightAxis = this.getLeftRightAxis()
				var upDownAxis = this.getUpDownAxis()
				if(axes.length >= leftRightAxis){
					force.l = force.l || axes[leftRightAxis] <= -0.5
					force.r = force.r || axes[leftRightAxis] >= 0.5
				}
				if(axes.length >= upDownAxis){
					force.u = force.u || axes[upDownAxis] <= -0.5
					force.d = force.d || axes[upDownAxis] >= 0.5
				}
				if(leftRightAxis === 0 || upDownAxis === 0){
					force.lsl = false
					force.lsr = false
				}
				if(leftRightAxis === 1 || upDownAxis === 1){
					force.lsu = false
					force.lsd = false
				}
				`, 'if(axes.length >= 10){')
			}),
			new EditValue(Gamepad.prototype, "getLeftRightAxis").load(() => this.getLeftRightAxis.bind(this)),
			new EditValue(Gamepad.prototype, "getUpDownAxis").load(() => this.getUpDownAxis.bind(this))
		)
	}
	getLeftRightAxis() {
		return this.leftRightAxis
	}
	getUpDownAxis() {
		return this.upDownAxis
	}
	settings() {
		return Object.keys(this.strings).map(name => {
			var str = this.strings[name]
			return {
				name: str.name,
				name_lang: str.name_lang,
				description: str.description,
				description_lang: str.description_lang,
				type: "number",
				min: 0,
				default: this[name],
				getItem: () => this[name],
				setItem: value => {
					this[name] = value
				}
			}
		})
	}
}
