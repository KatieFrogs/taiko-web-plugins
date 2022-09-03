export default class Plugin extends Patch{
	name = "Fumen File Format"
	version = "22.09.04"
	description = "Adds support for using Fumen files in the custom song list"
	author = "Katie Frogs"
	
	async load(){
		this.addEdits(
			new EditFunction(ImportSongs.prototype, "init").load(str => {
				return plugins.insertBefore(str,
				`this.musicInfoXml = this.otherFiles.musicInfoXml || {}
				this.songStars = this.otherFiles.songStars || {}
				this.starsRegex = /^\\d+,\\d+,\\d+,\\d+(?:,\\d+)?$/
				this.duetRegex = /_[enhmx]_[12]\\.bin$/
				this.notFumen = [
					"tuning.bin",
					"tuning_ext.bin",
					"music_attribute.bin",
					"music_order.bin",
					"musicinfo.bin",
					"wordlist.bin",
					"songinfo.bin"
				]
				this.nshPreview = this.otherFiles.nshPreview || {}
				this.otherFilenames = this.otherFiles.otherFilenames || {}
				this.binSongs = {}
				this.binFiles = []
				`, 'this.songs = []')
			}),
			new EditFunction(ImportSongs.prototype, "load").load(str => {
				str = plugins.insertBefore(str,
				`this.otherFilenames[name] = file
				`, 'this.otherFiles[path] = file')
				str = plugins.insertBefore(str,
				`if(name.endsWith(".bin")){
					var pathNoName = path.slice(0, -name.length)
					if(this.notFumen.indexOf(name) === -1 && !pathNoName.endsWith("/duet/") && pathNoName.indexOf("/fumen_hitnarrow/") === -1 && pathNoName.indexOf("/fumen_hitwide/") === -1 && !this.duetRegex.test(name)){
						this.binFiles.push({
							file: file
						})
						this.otherFiles[path] = file
					}
				}else `, 'if(name.endsWith(".tja")')
				str = plugins.insertBefore(str,
				`name.startsWith("song_") && name.endsWith(".nsh") || `, 'name === "genre.ini"')
				str = plugins.insertBefore(str,
				`name.endsWith(".xml") || name === "songstars.txt" || `, 'name === "songtitle.txt"')
				str = plugins.insertBefore(str,
				`var validDiff = ["_e", "_n", "_h", "_m", "_x"]
				var getSort = input => {
					var name = input.slice(0, -4)
					var index = validDiff.indexOf(name.slice(-2))
					if(index !== -1){
						var song = name.slice(0, -2)
						var diff = index
					}else{
						var song = name
						var diff = 3
					}
					if(song.startsWith("ex_")){
						song = song.slice(3)
						diff += 5
					}
					return [song, diff]
				}
				this.binFiles.sort((a, b) => {
					var [aSong, aDiff] = getSort(a.file.name)
					var [bSong, bDiff] = getSort(b.file.name)
					if(aSong === bSong){
						return aDiff > bDiff ? 1 : -1
					}else{
						return aSong > bSong ? 1 : -1
					}
				})
				this.binFiles.forEach((a, i) => a.index = i)
				`, 'var metaPromises = []')
				return plugins.insertBefore(str,
				`this.binFiles.forEach(fileObj => {
					songPromises.push(this.addBin(fileObj).catch(e => console.warn(e)))
				})
				`, 'this.tjaFiles.forEach(fileObj => {')
			}),
			new EditFunction(ImportSongs.prototype, "loaded").load(str => {
				str = plugins.insertBefore(str,
				`assets.otherFiles.musicInfoXml = this.musicInfoXml
				assets.otherFiles.songStars = this.songStars
				assets.otherFiles.nshPreview = this.nshPreview
				assets.otherFiles.otherFilenames = this.otherFilenames
				`, 'assets.otherFiles.songTitle = this.songTitle')
				return plugins.insertBefore(str,
				`var lastUra = null
				for(var i in this.songs){
					var song = this.songs[i]
					if(lastUra){
						if(song.chart.oni && !song.chart.easy && !song.chart.normal && !song.chart.hard && !song.chart.ura){
							var name = song.chart.oni.name.toLowerCase()
							if(name.startsWith("ex_") && name.endsWith("_m.bin") && name.slice(3, -6) === lastUra){
								delete this.songs[i]
								lastUra = null
								continue
							}
						}
						lastUra = null
					}
					if(song.courses.ura && song.chart.ura){
						var name = song.chart.ura.name.toLowerCase()
						if(name.endsWith("_x.bin")){
							name = name.slice(0, -6)
						}else if(name.startsWith("ex_") && name.endsWith("_m.bin")){
							name = name.slice(3, -6)
						}
						lastUra = name
					}
					if(song.md5){
						var hash = song.md5.base64().slice(0, -2)
						delete song.md5
						song.hash = hash
						scoreStorage.songTitles[song.title] = song.hash
						var score = scoreStorage.get(hash, false, true)
						if(score){
							score.title = song.title
						}
					}
				}
				`,'this.songs = this.songs.filter')
			}),
			new EditFunction(ImportSongs.prototype, "addMeta").load(str => {
				str = plugins.insertBefore(str,
				`this.binFiles.forEach(filesLoop)
				`, 'this.tjaFiles.forEach(filesLoop)')
				str = plugins.insertBefore(str,
				`(name.endsWith(".xml") || name.startsWith("song_") && name.endsWith(".nsh")) ? data : `, 'data.replace(/\\0/g, "").split("\\n")')
				str = plugins.insertBefore(str,
				`if(name.endsWith(".xml")){
					var fullToHalf = {
						"\\u2010": "-",
						"\\u2015": "-",
						"\\u2019": "'",
						"\\u2032": "'"
					}
					var chr = String.fromCharCode
					for(var i = 0; i < 26; i++){
						if(i < 10){
							fullToHalf[chr(0xff10 + i)] = chr(0x30 + i)
						}
						fullToHalf[chr(0xff21 + i)] = chr(0x41 + i)
						fullToHalf[chr(0xff41 + i)] = chr(0x61 + i)
					}
					var fullWidthRegex = /[\\u2010\\u2015\\u2019\\u2032\\uff10-\\uff19\\uff21-\\uff3a\\uff41-\\uff5a]/g
					var xmlDoc = new DOMParser().parseFromString(data, "text/xml")
					var getXmlVal = (element, name) => {
						var tag = element.getElementsByTagName(name)[0]
						if(tag && tag.firstChild){
							return tag.firstChild.data
						}
					}
					var firstTag = xmlDoc.firstElementChild
					if(firstTag.tagName === "boost_serialization"){
						var musicInfo = firstTag.firstElementChild
						var dataTags = musicInfo.getElementsByTagName("Data")
						for(var i = 0; i < dataTags.length; i++){
							var id = getXmlVal(dataTags[i], "musicid")
							var genre = getXmlVal(dataTags[i], "genrename")
							if(genre === "ボーカロイド"){
								genre += "™曲"
							}
							var title = getXmlVal(dataTags[i], "musicname").replace(fullWidthRegex, a => fullToHalf[a]).trim()
							var info = this.musicInfoXml[id] || {}
							if(title){
								info.title = title
							}
							if(genre){
								info.genre = genre
							}
							this.musicInfoXml[id] = info
						}
					}else if(firstTag.tagName === "songs"){
						var songTags = firstTag.getElementsByTagName("song")
						for(var i = 0; i < songTags.length; i++){
							var id = getXmlVal(songTags[i], "id")
							var title = getXmlVal(songTags[i], "japaneseText") || ""
							title = title.replace(fullWidthRegex, a => fullToHalf[a]).trim()
							var ura = false
							if(this.uraRegex.test(title)){
								ura = true
								title = title.replace(this.uraRegex, "")
								if(id.startsWith("ex_")){
									id = id.slice(3)
								}
							}
							var stars = this.songStars[id] || {}
							if(!ura){
								var easy = +getXmlVal(songTags[i], "starEasy")
								if(easy){
									stars.easy = easy
								}
								var normal = +getXmlVal(songTags[i], "starNormal")
								if(normal){
									stars.normal = normal
								}
								var hard = +getXmlVal(songTags[i], "starHard")
								if(hard){
									stars.hard = hard
								}
							}
							var oni = +getXmlVal(songTags[i], "starMania")
							if(oni){
								if(ura){
									stars.ura = oni
								}else{
									stars.oni = oni
								}
							}
							if(id){
								this.songStars[id] = stars
								if(title){
									var info = this.musicInfoXml[id] || {}
									info.title = title
									this.musicInfoXml[id] = info
								}
							}
						}
					}
				}else if(name.startsWith("song_") && name.endsWith(".nsh")){
					var nsh = new Uint8Array(data)
					this.nshPreview[name.slice(5, -4)] = struct.Unpack(">I", nsh.slice(0xe0, 0xe0 + struct.CalcLength(">I")))[0] / 1000
				}else if(name === "songstars.txt"){
					var diffs = ["easy", "normal", "hard", "oni", "ura"]
					var lastTitle
					for(var i = 0; i < data.length; i++){
						var line = data[i].trim()
						if(line){
							if(this.starsRegex.test(line) && lastTitle){
								var stars = {}
								var array = line.split(",")
								for(var j in array){
									stars[diffs[j]] = parseInt(array[j])
								}
								this.songStars[lastTitle] = stars
							}else{
								lastTitle = line
							}
						}
					}
				}else `, 'if(name === "genre.ini"){')
				return plugins.strReplace(str, 'return file.read(name === "songtitle.txt" ? undefined : "sjis")', `
				if(name.startsWith("song_") && name.endsWith(".nsh")){
					var readPromise = file.arrayBuffer()
				}else{
					var unicodeFile = name.endsWith(".xml") || name === "songstars.txt" || name === "songtitle.txt"
					var readPromise = file.read(unicodeFile ? undefined : "sjis")
				}
				return readPromise`)
			}),
			new EditFunction(LoadSong.prototype, "run").load(str => {
				str = plugins.insertBefore(str,
				`song.type === "bin" ? data : `, 'data.replace(/\\0/g, "").split("\\n")')
				return plugins.strReplace(str, 'this.addPromise(chart.read(song.type === "tja" ? "sjis" : "")',
				`if(song.type === "bin"){
					var chartRead = chart.arrayBuffer()
				}else{
					var chartRead = chart.read(song.type === "tja" ? "sjis" : "")
				}
				this.addPromise(chartRead`)
			}),
			new EditFunction(Controller.prototype, "init").load(str => {
				return plugins.insertBefore(str,
				`if(selectedSong.type === "bin"){
					try{
						this.parsedSongData = new ParseBin(songData, selectedSong.difficulty, selectedSong.stars, selectedSong.offset, false, selectedSong.originalDiff)
					}catch(e){
						this.game = {}
						this.keyboard = this.view = {clean: () => {}}
						this.run = () => {}
						var title = this.selectedSong.title
						if(title !== this.selectedSong.originalTitle){
							title += " (" + this.selectedSong.originalTitle + ")"
						}
						setTimeout(() => this.songSelection(false, {
							name: "loadSongError",
							title: title,
							id: this.selectedSong.folder,
							error: e
						}), 500)
						return
					}
					if(this.parsedSongData.branches && selectedSong.originalDiff){
						selectedSong.difficulty = selectedSong.originalDiff
					}
				}else `, 'if(selectedSong.type === "tja"){')
			}),
			new EditFunction(Controller.prototype, "restartSong").load(str => {
				str = plugins.insertBefore(str,
				`this.selectedSong.type === "bin" ? data : `, 'data.replace(/\\0/g, "").split("\\n")')
				return plugins.strReplace(str, 'this.addPromise(promises, chart.read(this.selectedSong.type === "tja" ? "sjis" : undefined)',
				`if(this.selectedSong.type === "bin"){
					var chartRead = chart.arrayBuffer()
				}else{
					var chartRead = chart.read(this.selectedSong.type === "tja" ? "sjis" : undefined)
				}
				this.addPromise(promises, chartRead`)
			}),
			new EditFunction(SongSelect.prototype, "getUnloaded").load(str => {
				str = plugins.strReplace(str, 'return file.read(currentSong.type',
				`if(currentSong.type === "bin"){
					var diffPromises = []
					for(let diff in file){
						if(diff !== "separateDiff"){
							diffPromises.push(file[diff].arrayBuffer().then(data => {
								currentSong.chart[diff] = new CachedFile(data, file[diff])
								return importSongs.addBin({
									file: currentSong.chart[diff],
									index: currentSong.id
								})
							}))
						}
					}
					var importPromise = Promise.all(diffPromises)
				}else{
					var importPromise = file.read(currentSong.type`)
				return plugins.strReplace(str, '}).then(() => {\n\t\t\tvar imported',
				`})
				}
				return importPromise.then(() => {
					var imported`)
			}),
			new EditFunction(Game.prototype, "init").load(str => {
				return plugins.insertBefore(str,
				`this.songData.soulPoints || `, 'this.rules.soulPoints(combo)')
			}),
			new EditFunction(SoundBuffer.prototype, "load").load(str => {
				return plugins.strReplace(str,
				'var decoder = file.name.endsWith(".ogg") ? this.oggDecoder : this.audioDecoder',
				`var decoder = this.audioDecoder
				if(file.name.endsWith(".ogg")){
					decoder = this.oggDecoder
				}else{
					for(var i in this.vgmExt){
						if(file.name.endsWith(this.vgmExt[i])){
							return this.vgmDecoder(file).catch(error => {
								return Promise.reject([error, file.url])
							}).then(buffer => {
								return new Sound(gain || {soundBuffer: this}, buffer)
							})
						}
					}
				}`)
			}),
			new EditFunction(CustomSongs.prototype, "localFolder").load(str => {
				return plugins.insertBefore(str, `false && `, 'typeof showDirectoryPicker === "function"')
			}),
			new EditValue(SoundBuffer.prototype, "vgmDecoder").load(() => this.vgmDecoder.bind(this)),
			new EditValue(SoundBuffer.prototype, "vgmExt").load(() => this.vgmExt),
			new EditValue(window, "ParseBin").load(() => this.ParseBin),
			new EditValue(window, "FileObj").load(() => this.FileObj),
			new EditValue(window, "struct").load(() => new JSPack()),
			new EditValue(ImportSongs.prototype, "addBin").load(() => this.addBin),
			new EditValue(ImportSongs.prototype, "findMusic").load(() => this.findMusic),
			new EditValue(ImportSongs.prototype, "vgmExt").load(() => this.vgmExt)
		)
		
		this.douyou = {
			aliases: ["童謡"],
			id: assets.categories.length + 1,
			title: "Children/Folk",
			title_lang: {
				en: "Children/Folk",
				ja: "どうよう"
			},
			songSkin: {
				background: "#ff4e8a",
				bg_img: "bg_genre_6.png",
				border: ["#ffc1da", "#c6004e"],
				outline: "#c3005c",
				infoFill: "#a20024",
				sort: 3.5
			}
		}
		this.vgmExt = [".nus3bank", ".nub", ".acb", ".idsp", ".at3"]
		
		var workerScript = await (await fetch("https://katiefrogs.github.io/vgmstream-web/js/cli-worker.js")).text()
		var workerUrl = URL.createObjectURL(new Blob([workerScript], {
			type: "application/javascript"
		}))
		this.cliWorker = new this.WorkerWrapper(workerUrl)
		return this.cliWorker.load().finally(() => {
			URL.revokeObjectURL(workerUrl)
		})
	}
	
	ParseBin = class{
		constructor(file, difficulty, stars, offset, metaOnly, originalDiff){
			this.difficulty = difficulty
			this.stars = stars
			this.offset = (offset || 0) * -1000
			this.originalDiff = originalDiff
			this.soundOffset = 0
			this.branchNames = ["normal", "advanced", "master"]
			this.metadata = {}
			var fumen = this.readFumen(new Uint8Array(file), metaOnly)
			if(!metaOnly){
				this.measures = []
				this.beatInfo = {}
				this.circles = []
				this.events = []
				this.writeCircles(fumen)
			}
		}
		readFumen(inputFile, metaOnly){
			var file = new FileObj(inputFile)
			var size = file.array.length
			
			var noteTypes = {
				0x1: "don", // ドン
				0x2: "don", // ド
				0x3: "don", // コ
				0x4: "ka", // カッ
				0x5: "ka", // カ
				0x6: "drumroll",
				0x7: "daiDon",
				0x8: "daiKa",
				0x9: "daiDrumroll",
				0xa: "balloon",
				0xb: "daiDon", // hands
				0xc: "balloon", // kusudama
				0xd: "daiKa", // hands
				0xe: "daiDon", // wii huge
				0xf: "daiKa", // wii huge
				0x10: "don", 0x11: "don", 0x12: "don", // wii hidden, good hit on the huge note
				0x13: "ka", 0x14: "ka",
				0x15: "don", 0x16: "don", 0x17: "don", // ok hit on the huge note
				0x18: "ka", 0x19: "ka",
				0x1a: "don", 0x1b: "don", 0x1c: "don", // bomb
				0x62: "drumroll" // ?
			}
			var song = {}
			
			var readStruct = function(format, seek){
				if(seek){
					file.seek(seek)
				}
				return struct.Unpack(order + format, file.read(struct.CalcLength(order + format))) || []
			}
			
			var order = ""
			var measuresBig = readStruct(">I", 0x200)[0]
			var measuresLittle = readStruct("<I", 0x200)[0]
			if(measuresBig < measuresLittle){
				order = ">"
				var totalMeasures = measuresBig
			}else{
				order = "<"
				var totalMeasures = measuresLittle
			}
			
			var hasBranches = this.getBool(readStruct("B", 0x1b0)[0])
			this.branches = hasBranches
			if(metaOnly){
				return
			}
			song["branches"] = hasBranches
			
			// soulPointsStruct: good 4, ok 4, bad 4
			var soulPointsStruct = readStruct("iii", 0x1bc)
			song["soulPoints"] = {
				"good": soulPointsStruct[0],
				"ok": soulPointsStruct[1],
				"bad": soulPointsStruct[2]
			}
			
			file.seek(0x208)
			for(var measureNumber = 0; measureNumber < totalMeasures; measureNumber++){
				var measure = {}
				// measureStruct: bpm 4, offset 4, gogo 1, hidden 1, dummy 2, branchInfo 4 * 6, dummy 4
				var measureStruct = readStruct("ffBBHiiiiiii")
				measure["bpm"] = measureStruct[0]
				measure["fumenOffset"] = measureStruct[1]
				if(measureNumber === 0){
					measure["offset"] = measure["fumenOffset"] + 240000 / measure["bpm"]
				}else{
					var prev = song[measureNumber - 1]
					measure["offset"] = prev["offset"] + measure["fumenOffset"] + 240000 / measure["bpm"] - prev["fumenOffset"] - 240000 / prev["bpm"]
				}
				measure["gogo"] = this.getBool(measureStruct[2])
				measure["hidden"] = this.getBool(measureStruct[3])
				
				for(var branchNumber = 0; branchNumber < 3; branchNumber++){
					var branch = {}
					// branchStruct: totalNotes 2, dummy 2, speed 4
					var branchStruct = readStruct("HHf")
					var totalNotes = branchStruct[0]
					branch["speed"] = branchStruct[2]
					
					for(var noteNumber = 0; noteNumber < totalNotes; noteNumber++){
						var note = {}
						// noteStruct: type 4, pos 4, item 4, dummy 4, init 2, diff 2, duration 4
						var noteStruct = readStruct("ififHHf")
						var noteType = noteStruct[0]
						
						if(!(noteType in noteTypes)){
							throw new Error("Unknown note type '" + noteType.toString(16).toUpperCase() + "' at offset 0x" + (file.tell() - 0x18).toString(16))
						}
						
						note["type"] = noteTypes[noteType]
						note["fumenType"] = noteType
						note["pos"] = noteStruct[1]
						
						if(noteType === 0xa || noteType === 0xc){
							// Balloon hits
							note["hits"] = noteStruct[4]
						}else if(!("scoreInit" in song)){
							song["scoreInit"] = noteStruct[4]
							song["scoreDiff"] = noteStruct[5] / 4
						}
						
						if(noteType === 0x6 || noteType === 0x9 || noteType === 0xa || noteType === 0xc){
							// Drumroll and balloon duration in ms
							note["duration"] = noteStruct[6]
						}
						branch[noteNumber] = note
						
						if(noteType === 0x6 || noteType === 0x9 || noteType === 0x62){
							// Drumrolls have 8 dummy bytes at the end
							file.seek(0x8, file.SEEK_CUR)
						}
					}
					
					branch["length"] = totalNotes
					measure[this.branchNames[branchNumber]] = branch
				}
				
				song[measureNumber] = measure
				if(file.tell() >= size){
					break
				}
			}
			
			song["length"] = totalMeasures
			
			file.close()
			return song
		}
		getBool(number){
			return number === 0x1 ? true : number === 0x0 ? false : number
		}
		writeCircles(song){
			if(!song || song.length === 0){
				return
			}
			var branches = song["branches"]
			
			var noteText = {
				0x2: strings.ex_note.don[0],
				0x3: strings.ex_note.don[1],
				0x5: strings.ex_note.ka[0],
				0x11: strings.ex_note.don[0],
				0x12: strings.ex_note.don[1],
				0x14: strings.ex_note.ka[0],
				0x16: strings.ex_note.don[0],
				0x17: strings.ex_note.don[1],
				0x19: strings.ex_note.ka[0],
				0x1b: strings.ex_note.don[0],
				0x1c: strings.ex_note.don[1]
			}
			
			if(branches){
				if(this.originalDiff === "easy" || this.originalDiff === "normal"){
					var diffBranch = {
						easy: 0,
						normal: 1,
						hard: 2
					}
				}else{
					var diffBranch = {
						normal: 0,
						hard: 1,
						oni: 2
					}
				}
				var selectedBranch = this.branchNames[diffBranch[this.difficulty]]
				this.branches = []
			}else{
				var selectedBranch = this.branchNames[0]
			}
			var circleID = 0
			
			if(song["scoreInit"] && song["scoreDiff"]){
				this.scoreinit = song["scoreInit"]
				this.scorediff = song["scoreDiff"]
			}
			this.soulPoints = song["soulPoints"]
			var lastBpm = null
			var lastGogo = false
			for(var i = 0; i < song["length"]; i++){
				var measure = song[i]
				var branch = song[i][selectedBranch]
				if(i === 0){
					this.beatInfo.beatInterval = 60000 / measure["bpm"]
					lastBpm = measure["bpm"]
				}
				this.measures.push({
					ms: measure["offset"],
					originalMS: measure["offset"],
					speed: measure["bpm"] * branch["speed"] / 60,
					visible: measure["hidden"],
					branch: false,
					branchFirst: false
				})
				if(lastBpm !== measure["bpm"] || lastGogo !== measure["gogo"]){
					circleID++
					this.events.push(new Circle({
						id: circleID,
						start: measure["offset"] - this.offset,
						type: "event",
						txt: "",
						speed: measure["bpm"] * branch["speed"] / 60,
						gogoTime: measure["gogo"],
						beatMS: 60000 / measure["bpm"],
						branch: false,
						section: false
					}))
					lastBpm = measure["bpm"]
					lastGogo = measure["gogo"]
				}
				for(var j = 0; j < branch["length"]; j++){
					var note = branch[j]
					var noteType = note["type"]
					var offset = measure["offset"] + note["pos"] - this.offset
					circleID++
					var circleObj = {
						id: circleID,
						start: offset,
						type: noteType,
						txt: noteText[note["fumenType"]] || strings.note[noteType] || "",
						speed: measure["bpm"] * branch["speed"] / 60,
						gogoTime: measure["gogo"],
						beatMS: 60000 / measure["bpm"],
						branch: false,
						section: false
					}
					if(noteType === "drumroll" || noteType === "daiDrumroll"){
						circleObj.endTime = offset + note["duration"]
						circleObj.originalEndTime = offset + note["duration"]
					}else if(noteType === "balloon"){
						circleObj.endTime = offset + note["duration"]
						circleObj.originalEndTime = offset + note["duration"]
						circleObj.requiredHits = note["hits"]
					}
					this.circles.push(new Circle(circleObj))
				}
			}
			if(branches){
				var branchObj = {
					ms: 0,
					originalMS: 0,
					active: selectedBranch,
					type: "accuracy",
					requirement: selectedBranch === "normal" ? {
						advanced: 101,
						master: 101
					} : selectedBranch === "advanced" ? {
						advanced: -1,
						master: 101
					} : {
						advanced: -1,
						master: -1
					}
				}
				this.branches.push(branchObj)
				if(this.measures.length >= 1){
					this.measures[0].nextBranch = branchObj
				}
			}
		}
	}
	
	FileObj = class{
		constructor(array){
			this.array = array
			this.pos = 0
			this.SEEK_SET = 0
			this.SEEK_CUR = 1
			this.SEEK_END = 2
		}
		seek(target, whence){
			if(whence === this.SEEK_CUR){
				this.pos += target
			}else if(whence === this.SEEK_END){
				this.pos = this.array.length - target
			}else{
				this.pos = target
			}
		}
		read(size = -1){
			var pos = this.pos
			if(size === -1){
				this.pos = this.array.length
				return this.array.slice(pos)
			}else{
				this.pos = pos + size
				return this.array.slice(pos, pos + size)
			}
		}
		tell(){
			return this.pos
		}
		close(){
			delete this.array
		}
	}
	
	WorkerWrapper = class{
		constructor(url){
			this.symbol = 0
			this.allEvents = new Map()
			this.worker = new Worker(url)
			this.worker.addEventListener("message", event => this.messageEvent(event.data))
			this.worker.addEventListener("error", event => this.messageEvent({
				subject: "load",
				error: "Error loading " + url
			}))
			this.on("load").then(() => {
				this.loaded = true
			}, error => {
				alert(error)
			})
		}
		send(subject, ...content){
			return this.load().then(() => {
				return new Promise((resolve, reject) => {
					var symbol = ++this.symbol
					this.on(symbol).then(resolve, reject)
					return this.worker.postMessage({
						symbol: symbol,
						subject: subject,
						content: content
					})
				})
			})
		}
		messageEvent(data){
			var addedType = this.allEvents.get(data.symbol || data.subject)
			if(addedType){
				addedType.forEach(callback => {
					if(data.error){
						var error = new Error(data.error.message)
						for(var i in data.error){
							error[i] = data.error[i]
						}
						callback.reject(error)
					}else{
						callback.resolve(data.content)
					}
				})
				this.allEvents.delete(data.subject)
			}
		}
		load(){
			if(this.loaded){
				return Promise.resolve(this.worker)
			}else if(this.loadError){
				return Promise.reject()
			}else{
				return this.on("load")
			}
		}
		on(type){
			return new Promise((resolve, reject) => {
				var addedType = this.allEvents.get(type)
				if(!addedType){
					addedType = new Set()
					this.allEvents.set(type, addedType)
				}
				addedType.add({
					resolve: resolve,
					reject: reject
				})
			})
		}
	}
	
	addBin(fileObj){
		var file = fileObj.file
		var index = fileObj.index
		var category = fileObj.category
		var category_id = fileObj.category_id
		if(!this.limited){
			var filePromise = file.arrayBuffer()
		}else{
			var filePromise = Promise.resolve()
		}
		return filePromise.then(dataRaw => {
			var bin = new ParseBin(dataRaw, "oni", 0, 0, true)
			var dir = file.path.toLowerCase()
			dir = dir.slice(0, dir.lastIndexOf("/") + 1)
			var songName = file.name.slice(0, -4)
			var songName2 = songName.toLowerCase()
			var diffLetter = "m"
			var ura = false
			var mergedUra = false
			if(songName2.endsWith("_e") || songName2.endsWith("_n") || songName2.endsWith("_h") || songName2.endsWith("_m") || songName2.endsWith("_x")){
				if(songName2.endsWith("_x")){
					var mergedUra = true
				}
				diffLetter = songName.slice(-1).toLowerCase()
				songName = songName.slice(0, -2)
			}
			if(songName2.startsWith("ex_")){
				var e = dir + songName
				var n = dir + songName.slice(3)
				var f = this.otherFiles
				if(!bin.branches && diffLetter === "m" &&
					!f[e + "_e.bin"] && !f[e + "_n.bin"] && !f[e + "_h.bin"] &&
					(f[n + "_e.bin"] || f[n + "_n.bin"] || f[n + "_h.bin"] || f[n + "_m.bin"]) &&
					!f[n + "_x.bin"]
				){
					mergedUra = true
				}else{
					ura = true
				}
				songName = songName.slice(3)
			}
			songName2 = songName.toLowerCase()
			var songTitle = songName
			var mergedSong
			var binSongsDir = dir + (ura ? "ex_" : "") + songName2
			var binSong = this.binSongs[binSongsDir]
			if(!bin.branches){
				mergedSong = binSong
			}
			if(mergedSong){
				var songObj = mergedSong
			}else{
				var songObj = {
					id: index + 1,
					order: index + 1,
					type: "bin",
					chart: {separateDiff: true},
					courses: {},
					music: this.findMusic(dir, songName),
					title: songTitle + (ura ? "（裏）" : ""),
					subtitle: null,
					preview: 0,
					category: category || this.getCategory(file),
					md5: binSong ? binSong.md5 : (this.limited ? null : md5.create()),
					custom: true
				}
				if(this.limited){
					songObj.unloaded = true
				}
				if(songName2 in this.musicInfoXml){
					songTitle = this.musicInfoXml[songName2].title
					songObj.title = songTitle + (ura ? "（裏）" : "")
					songObj.category = this.musicInfoXml[songName2].genre
				}
				if(songObj.category && songObj.category.toLowerCase() in this.categoryAliases){
					songObj.category_id = this.categoryAliases[songObj.category.toLowerCase()]
				}
				if(songName2 in this.nshPreview){
					songObj.preview = this.nshPreview[songName2]
				}
				var titleLang = {}
				var titleLangAdded = false
				for(var id in allStrings){
					if(songName2 in this.songTitle && this.songTitle[songName2][id]){
						titleLang[id] = this.songTitle[songName2][id] + (ura ? "（裏）" : "")
						titleLangAdded = true
					}else if(songTitle in this.songTitle && this.songTitle[songTitle][id]){
						titleLang[id] = this.songTitle[songTitle][id] + (ura ? "（裏）" : "")
						titleLangAdded = true
					}
				}
				if(titleLangAdded){
					songObj.title_lang = titleLang
				}
			}
			if(!this.limited){
				songObj.md5.update(dataRaw)
			}
			var diff = {
				e: "easy",
				n: "normal",
				h: "hard",
				m: "oni",
				x: "ura"
			}
			var diffPos = mergedUra ? "x" : diffLetter
			var stars = 0
			if(bin.branches){
				var branchTitle = (input, id, original) => {
					if(ura){
						input = input.slice(0, -3)
					}
					if(original){
						if(songName in this.songStars){
							stars = this.songStars[songName][diff[diffPos]] || 0
						}else if(input in this.songStars){
							stars = this.songStars[input][diff[diffPos]] || 0
						}
					}
					var diffName = allStrings[id][diffPos === "x" ? "oni" : diff[diffPos]]
					return input + " (" + diffName + ")" + ((ura || diffPos === "x") ? "（裏）" : "")
				}
				songObj.title = branchTitle(songObj.title, strings.id, true)
				for(var id in songObj.title_lang){
					songObj.title_lang[id] = branchTitle(songObj.title_lang[id], id)
				}
				if(diffPos === "x"){
					diffPos = "m"
				}
				songObj.chart = file
				if(diff[diffPos] === "easy" || diff[diffPos] === "normal"){
					songObj.courses = {
						easy: {stars: stars, branch: true},
						normal: {stars: stars, branch: true},
						hard: {stars: stars, branch: true},
						oni: null,
						ura: null
					}
				}else{
					songObj.courses = {
						easy: null,
						normal: {stars: stars, branch: true},
						hard: {stars: stars, branch: true},
						oni: {stars: stars, branch: true},
						ura: null
					}
				}
				songObj.originalDiff = diff[diffPos]
			}else{
				if(songName in this.songStars){
					stars = this.songStars[songName][diff[diffPos]] || 0
				}else if(songObj.title in this.songStars){
					stars = this.songStars[songObj.title][diff[diffPos]] || 0
				}
				songObj.courses[diff[diffPos]] = {stars: stars, branch: false}
				songObj.chart[diff[diffPos]] = file
			}
			if(!mergedSong){
				this.songs[index] = songObj
				if(!bin.branches){
					this.binSongs[binSongsDir] = songObj
				}
			}
		})
	}
	
	findMusic(dir, songName){
		var extensions = [".ogg", ".wav", ...this.vgmExt]
		for(var i in extensions){
			var audio = this.otherFiles[dir + "song_" + songName + extensions[i]]
			if(audio){
				return audio
			}
		}
		for(var i in extensions){
			var audio = this.otherFilenames["song_" + songName + extensions[i]]
			if(audio){
				return audio
			}
		}
		return "muted"
	}
	
	async vgmDecoder(file){
		var data = new Uint8Array(await file.arrayBuffer())
		var name = Math.random() + file.name
		
		var output = await this.cliWorker.send("convertFile", data, name, true)
		
		return new Promise((resolve, reject) => {
			return snd.buffer.audioDecoder(output.arrayBuffer, resolve, reject)
		})
	}
	
	start(){
		assets.categories.push(this.douyou)
	}
	
	stop(){
		var index = assets.categories.indexOf(this.douyou)
		if(index !== -1){
			assets.categories.splice(index, 1)
		}
	}
	
	unload(){
		this.cliWorker.worker.terminate()
	}
}

if(typeof GM_info === "object"){
	addEventListener("ready", () => plugins.add(Plugin)?.start())
}

// https://github.com/pgriess/node-jspack
function JSPack(){var k,n=!1;this._DeArray=function(g,c,a){return[g.slice(c,c+a)]};this._EnArray=function(g,c,a,b){for(var d=0;d<a;g[c+d]=b[d]?b[d]:0,d++);};this._DeChar=function(g,c){return String.fromCharCode(g[c])};this._EnChar=function(g,c,a){g[c]=a.charCodeAt(0)};this._DeInt=function(g,c){var a=n?k.len-1:0,b=n?-1:1,d=a+b*k.len,e;var f=0;for(e=1;a!=d;f+=g[c+a]*e,a+=b,e*=256);k.bSigned&&f&Math.pow(2,8*k.len-1)&&(f-=Math.pow(2,8*k.len));return f};this._EnInt=function(g,c,a){var b=n?k.len-1:0,d=
n?-1:1,e=b+d*k.len;for(a=a<k.min?k.min:a>k.max?k.max:a;b!=e;g[c+b]=a&255,b+=d,a>>=8);};this._DeString=function(g,c,a){for(var b=Array(a),d=0;d<a;b[d]=String.fromCharCode(g[c+d]),d++);return b.join("")};this._EnString=function(g,c,a,b){for(var d,e=0;e<a;g[c+e]=(d=b.charCodeAt(e))?d:0,e++);};this._De754=function(g,c){var a=k.mLen;var b=8*k.len-k.mLen-1;var d=(1<<b)-1;var e=d>>1;var f=n?0:k.len-1;var h=n?1:-1;var m=g[c+f];f+=h;var l=-7;var p=m&(1<<-l)-1;m>>=-l;for(l+=b;0<l;p=256*p+g[c+f],f+=h,l-=8);
b=p&(1<<-l)-1;p>>=-l;for(l+=a;0<l;b=256*b+g[c+f],f+=h,l-=8);switch(p){case 0:p=1-e;break;case d:return b?NaN:Infinity*(m?-1:1);default:b+=Math.pow(2,a),p-=e}return(m?-1:1)*b*Math.pow(2,p-a)};this._En754=function(g,c,a){var b;var d=k.mLen;var e=8*k.len-k.mLen-1;var f=(1<<e)-1;var h=f>>1;var m=0>a?1:0;a=Math.abs(a);if(isNaN(a)||Infinity==a){a=isNaN(a)?1:0;var l=f}else l=Math.floor(Math.log(a)/Math.LN2),1>a*(b=Math.pow(2,-l))&&(l--,b*=2),a=1<=l+h?a+k.rt/b:a+k.rt*Math.pow(2,1-h),2<=a*b&&(l++,b/=2),l+
h>=f?(a=0,l=f):1<=l+h?(a=(a*b-1)*Math.pow(2,d),l+=h):(a=a*Math.pow(2,h-1)*Math.pow(2,d),l=0);h=n?k.len-1:0;for(f=n?-1:1;8<=d;g[c+h]=a&255,h+=f,a/=256,d-=8);l=l<<d|a;for(e+=d;0<e;g[c+h]=l&255,h+=f,l/=256,e-=8);g[c+h-f]|=128*m};this._sPattern="(\\d+)?([AxcbBhHsfdiIlL])";this._lenLut={A:1,x:1,c:1,b:1,B:1,h:2,H:2,s:1,f:4,d:8,i:4,I:4,l:4,L:4};this._elLut={A:{en:this._EnArray,de:this._DeArray},s:{en:this._EnString,de:this._DeString},c:{en:this._EnChar,de:this._DeChar},b:{en:this._EnInt,de:this._DeInt,len:1,
bSigned:!0,min:-Math.pow(2,7),max:Math.pow(2,7)-1},B:{en:this._EnInt,de:this._DeInt,len:1,bSigned:!1,min:0,max:Math.pow(2,8)-1},h:{en:this._EnInt,de:this._DeInt,len:2,bSigned:!0,min:-Math.pow(2,15),max:Math.pow(2,15)-1},H:{en:this._EnInt,de:this._DeInt,len:2,bSigned:!1,min:0,max:Math.pow(2,16)-1},i:{en:this._EnInt,de:this._DeInt,len:4,bSigned:!0,min:-Math.pow(2,31),max:Math.pow(2,31)-1},I:{en:this._EnInt,de:this._DeInt,len:4,bSigned:!1,min:0,max:Math.pow(2,32)-1},l:{en:this._EnInt,de:this._DeInt,
len:4,bSigned:!0,min:-Math.pow(2,31),max:Math.pow(2,31)-1},L:{en:this._EnInt,de:this._DeInt,len:4,bSigned:!1,min:0,max:Math.pow(2,32)-1},f:{en:this._En754,de:this._De754,len:4,mLen:23,rt:Math.pow(2,-24)-Math.pow(2,-77)},d:{en:this._En754,de:this._De754,len:8,mLen:52,rt:0}};this._UnpackSeries=function(g,c,a,b){for(var d=k.de,e=[],f=0;f<g;e.push(d(a,b+f*c)),f++);return e};this._PackSeries=function(g,c,a,b,d,e){for(var f=k.en,h=0;h<g;f(a,b+h*c,d[e+h]),h++);};this.Unpack=function(g,c,a){n="<"!=g.charAt(0);
a=a?a:0;for(var b=new RegExp(this._sPattern,"g"),d,e,f,h=[];d=b.exec(g);){e=void 0==d[1]||""==d[1]?1:parseInt(d[1]);f=this._lenLut[d[2]];if(a+e*f>c.length)return;switch(d[2]){case "A":case "s":h.push(this._elLut[d[2]].de(c,a,e));break;case "c":case "b":case "B":case "h":case "H":case "i":case "I":case "l":case "L":case "f":case "d":k=this._elLut[d[2]],h.push(this._UnpackSeries(e,f,c,a))}a+=e*f}return Array.prototype.concat.apply([],h)};this.PackTo=function(g,c,a,b){n="<"!=g.charAt(0);for(var d=new RegExp(this._sPattern,
"g"),e,f,h,m=0;e=d.exec(g);){f=void 0==e[1]||""==e[1]?1:parseInt(e[1]);h=this._lenLut[e[2]];if(a+f*h>c.length)return!1;switch(e[2]){case "A":case "s":if(m+1>b.length)return!1;this._elLut[e[2]].en(c,a,f,b[m]);m+=1;break;case "c":case "b":case "B":case "h":case "H":case "i":case "I":case "l":case "L":case "f":case "d":k=this._elLut[e[2]];if(m+f>b.length)return!1;this._PackSeries(f,h,c,a,b,m);m+=f;break;case "x":for(e=0;e<f;e++)c[a+e]=0}a+=f*h}return c};this.Pack=function(g,c){return this.PackTo(g,Array(this.CalcLength(g)),
0,c)};this.CalcLength=function(g){for(var c=new RegExp(this._sPattern,"g"),a,b=0;a=c.exec(g);)b+=(void 0==a[1]||""==a[1]?1:parseInt(a[1]))*this._lenLut[a[2]];return b}}
