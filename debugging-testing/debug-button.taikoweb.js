export default class Plugin extends Patch{
	name = "Debug Button"
	version = "22.11.03"
	description = "Adds a button to access the debug window"
	author = "Katie Frogs"
	
	load(){
		var promises = []
		var css = []
		
		promises.push(this.loadCssBackground("touch_debug.png", touch_debug()).then(image => {
			this.touchDebug = image
			css.push(loader.cssRuleset({
				"#touch-debug-btn": {
					"background-image": "url(\"" + this.touchDebug.src + "\")",
					"cursor": "pointer"
				}
			}))
			this.addEdits(
				new EditValue(assets.image, "touch_debug").load(() => image)
			)
		}))
		
		this.addEdits(
			new EditFunction(View.prototype, "init").load(str => {
				return plugins.insertBefore(str,
				`this.touchButtons = document.getElementById("touch-buttons")
				if(!this.controller.touchEnabled){
					this.touchButtons.style.display = "block"
					document.getElementById("touch-full-btn").style.display = "none"
					document.getElementById("touch-pause-btn").style.display = "none"
				}
				this.debugButton = document.createElement("div")
				this.debugButton.id = "touch-debug-btn"
				pageEvents.add(this.debugButton, ["click", "touchend"], debug)
				this.touchButtons.insertBefore(this.debugButton, this.touchButtons.firstChild)
				`, 'if(this.controller.touchEnabled){')
			}),
			new EditFunction(View.prototype, "clean").load(str => {
				return plugins.insertAfter(str,
				'if(this.multiplayer !== 2){', `
				pageEvents.remove(this.debugButton, ["click", "touchend"])
				this.touchButtons.removeChild(this.debugButton)
				delete this.debugButton
				delete this.touchButtons`)
			})
		)
		return Promise.all(promises).then(() => {
			this.style = document.createElement("style")
			this.style.appendChild(document.createTextNode(css.join("\n")))
		})
	}
	start(){
		document.head.appendChild(this.style)
	}
	stop(){
		document.head.removeChild(this.style)
	}
	unload(){
		delete this.style
		loader.assetsDiv.removeChild(this.touchDebug)
		URL.revokeObjectURL(this.touchDebug.src)
		delete this.touchDebug
	}
	loadCssBackground(filename, url){
		return loader.ajax(url, request => {
			request.responseType = "blob"
		}).then(blob => {
			var image = document.createElement("img")
			var promise = pageEvents.load(image)
			image.id = filename
			image.src = URL.createObjectURL(blob)
			loader.assetsDiv.appendChild(image)
			return promise.then(() => image)
		})
	}
}

function touch_debug(){
	return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAQAAACSR7JhAAACvUlEQVR4Ae2ZA4wkWxhGv2cHz7Zt22b8bK85tj0TjD0TrW0jXtu2rbPhTbo66OlbuTuoc9qlL9XF/1dAQEBAQEBAhJyvL9WkDTohLD2hDWrSlzpf1jyp+eJ6viOGJEtj+I7rEZqvJ2XF5zpyK42cwS/O0Mit6Ig+t1lTR55hG3CUYaSTaGk6wzgKbOMZdERPRrtNzb+VbcB4buMR/qK7pX/xCLcxHtjGrWh+dNvYl6IRGM+V1HHSJ+u4kvFAI0JfKgqarucMR7mNGo76aA23cZQzXI+aFAUbvgOG8RAHffYhhgHfoQ2KghMxQDo/s9dnfyYdiEEnFAUkAwn0ZafP9iERSEIoCkgCEunNVp/t7UesXmzy2V5dOtZ8hJEF7SXWMISR4e0lVjHCSMm5jDWbKebzXwgjf5nfpzDbdaw3EC9Qxh\
ReRx7fYAplvIB4w22sGhShte5ireVuFKF3sMZVrBjUBmPdxFrBVcjjo9SyhCXU8AjyeBUr3Kytak+wV1hthq3mZU+oaneb/AweMAu+kLmeQ8cFZtgDzHB7gBhtFv102LAnzbDRro9bg82i3wkb9rYZNth1rCqz6DvDht1uhlW5jZXGRcjYEDKsDhkvIs1VrNV8g0K8BrMNMZprUIjfsNpFrHU8gDxeyFfkkM2XXIg8PsA6N39iK2qDre62rQ9RhH7ocpOfxcUIcRkPonB5kMsQ4mJmuT1A/MMDpLKEjeRyI8LITeSykSWk8gD/OD5uhWzGcQgjcZ6xnMYKO7Qaq9rLLcZEhJFJ7SXWSj7FyMrgrrr9xerpfywSgGSERdntR7b57I+kAbHohFWRcrfP2hQpTUn3VirY76MV3GpKupYF8GqO+GS1pwBu2S54mD+It/QPHrZvF3ibK2l0tzTNvrniqBVl37iLpcjSWIvGXTtoc7Z7AgICAg\
ICAs4CX8F1TdER+6wAAAAASUVORK5CYII="
}
