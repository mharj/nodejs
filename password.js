var b64_sha512crypt = require("sha512crypt-node").b64_sha512crypt;

function makeSalt(count){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < count; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports = function (hashString) {
	var salt = null;
	var hash = null;
	var makeSplit = function(hashString) {
		var parts = hashString.split("$");
		if ( parts[1] === "6" && parts[2].length === 8 ) {
			salt = parts[2];
			hash = parts[3];
		}		
	};
	if ( hashString ) {
		makeSplit(hashString);
	}
	this.getHash = function () {
		return hash;
	};
	this.getSalt = function () {
		return salt;
	};
	this.getAsString = function () {
		if ( salt === null || hash === null ) {
			return null;
		}
		return "$6$"+salt+"$"+hash;
	};
	this.isValid = function (password) {
		if ( salt === null || hash === null ) {
			return false;
		}
		return (b64_sha512crypt(password, salt ) === this.getAsString() );
	};
	this.create = function (password) {
		makeSplit(b64_sha512crypt(password, makeSalt(8) ));
	};
};
