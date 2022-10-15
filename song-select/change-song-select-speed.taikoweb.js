export default class Plugin extends Patch {
	name = "Change Song Select Speed"
	name_lang = {
		tw: "改變歌曲的選擇速度"
	}
	version = "22.02.22"
	description = "Changes the song selection scroll speed"
	description = {
		tw: "改變歌曲選擇的滾動速度"
	}
	author = "Katie Frogs"

	selectRate = 0.5

	strings = {
		selectRate: {
			name: "Song Select Speed",
			name_lang: {
				tw: "歌曲選擇速度"
			},
			description: null,
			description_lang: {},
			format: "%sx",
			format_lang: {}
		}
	}

	load() {
		this.addEdits(
			new EditFunction(SongSelect.prototype, "init").load(str => {
				return plugins.insertAfter(str, 'speed: 400', `/ this.getSelectRate()`)
			}),
			new EditValue(SongSelect.prototype, "getSelectRate").load(() => this.getSelectRate.bind(this))
		)
	}
	getSelectRate() {
		return this.selectRate
	}
	settings() {
		var str = this.strings.selectRate
		return [{
			name: str.name,
			name_lang: str.name_lang,
			description: str.description,
			description_lang: str.description_lang,
			format: str.format,
			format_lang: str.format_lang,
			type: "number",
			min: 0.25,
			fixedPoint: 2,
			step: 25,
			default: this.selectRate,
			getItem: () => this.selectRate,
			setItem: value => {
				this.selectRate = value
			}
		}]
	}
}
