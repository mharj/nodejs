var b64_sha512crypt = require("sha512crypt-node").b64_sha512crypt;

/**
 * Simple Password wrapper class
 * var Password = require('./password.js');
 * var password = new Password("$6$....");
 * 
 * @param {string} hashString password hash string
 * @returns {Password} object
 */
module.exports = function (hashString) {
	var salt = null;
	var hash = null;
	/**
	 * split password parts and set salt + hash
	 * @param {string} hashString
	 * @returns {undefined}
	 */
	var makeSplit = function(hashString) {
		var parts = hashString.split("$");
		if ( parts[1] === "6" && parts[2].length >= 8 && parts[2].length <= 16 ) {
			salt = parts[2];
			hash = parts[3];
		}		
	};
	var makeSalt = function (count){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for( var i=0; i < count; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
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
	
	/**
	 * get as password string
	 * @returns {String}
	 */
	this.getAsString = function () {
		if ( salt === null || hash === null ) {
			return null;
		}
		return "$6$"+salt+"$"+hash;
	};
	
	/**
	 * compare password and hash
	 * @param {string} password
	 * @returns {Boolean} is match
	 */
	this.isValid = function (password) {
		if ( salt === null || hash === null ) {
			return false;
		}
		return ( b64_sha512crypt(password, salt ) === this.getAsString() );
	};
	
	/**
	 * generate password hash and return current instance
	 * var Password = require('./password.js');
	 * var password = new Password().create("password");
	 * 
	 * @param {string} password
	 * @returns {self} for chain
	 */
	this.create = function (password) {
		makeSplit( b64_sha512crypt( password , makeSalt(8) ));
		return this;
	};
};
