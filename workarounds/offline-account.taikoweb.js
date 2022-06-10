export default class Plugin extends Patch{
	name = "Offline Account"
	version = "22.02.22"
	description = "Allows setting your name and customizing your Don without logging in"
	author = "Katie Frogs"
	
	load(){
		this.offlineAccount = {
			loggedIn: true,
			username: "Don-chan",
			displayName: "Don-chan",
			don: {
				body_fill: defaultDon.body_fill,
				face_fill: defaultDon.face_fill
			}
		}
		this.loadAccount()
		
		this.addEdits(
			new EditValue(gameConfig, "accounts").load(() => true),
			new EditValue(window, "account").load(() => {
				return this.offlineAccount
			}),
			new EditFunction(Account.prototype, "accountForm").load(str => {
				str = plugins.strReplace(str, 'this.items.push(this.logoutButton)', ``)
				return str + `
				this.accountPass.style.display = "none"
				this.accountDel.style.display = "none"
				this.logoutButton.style.display = "none"`
			}),
			new EditValue(Account.prototype, "request").load(() => this.request.bind(this)),
			new EditFunction(ScoreStorage.prototype, "load").load(str => {
				return plugins.strReplace(str, 'account.loggedIn', `false`)
			}),
			new EditFunction(scoreStorage, "load").load(str => {
				return str.replace('account.loggedIn', `false`)
			}),
			new EditFunction(ScoreStorage.prototype, "write").load(str => {
				return plugins.strReplace(str, 'account.loggedIn', `false`)
			}),
			new EditFunction(scoreStorage, "write").load(str => {
				return str.replace('account.loggedIn', `false`)
			}),
			new EditFunction(ScoreStorage.prototype, "sendToServer").load(str => {
				return plugins.strReplace(str, 'if(account.loggedIn){', `if(false){`)
			}),
			new EditFunction(scoreStorage, "sendToServer").load(str => {
				return str.replace('if(account.loggedIn){', `if(false){`)
			})
		)
	}
	
	request(url, obj, get){
		switch(url){
			case "account/display_name":
				this.offlineAccount.username = obj.display_name
				this.offlineAccount.displayName = obj.display_name
				this.saveAccount()
				return Promise.resolve({
					display_name: this.offlineAccount.displayName
				})
			case "account/don":
				this.offlineAccount.don.body_fill = obj.body_fill
				this.offlineAccount.don.face_fill = obj.face_fill
				this.saveAccount()
				return Promise.resolve({
					don: this.offlineAccount.don
				})
			default:
				return Promise.reject({
					status: "error"
				})
		}
	}
	saveAccount(){
		localStorage.setItem("offlineAccount", JSON.stringify({
			name: this.offlineAccount.displayName,
			don: this.offlineAccount.don
		}))
	}
	loadAccount(){
		var account = localStorage.getItem("offlineAccount")
		if(account){
			try{
				account = JSON.parse(account)
			}catch(e){}
		}
		if(account){
			if(account.name){
				this.offlineAccount.username = account.name
				this.offlineAccount.displayName = account.name
			}
			if(account.don){
				if(account.don.body_fill){
					this.offlineAccount.don.body_fill = account.don.body_fill
				}
				if(account.don.face_fill){
					this.offlineAccount.don.face_fill = account.don.face_fill
				}
			}
		}
	}
	
	unload(){
		delete this.offlineAccount
	}
}
