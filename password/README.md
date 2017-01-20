Simple SHA512 crypt wrapper 
```javascript
var Password = require('./password.js');
var user1 = new Password("$6$...");
console.log( user1.isValid(password)?"yes":"no" );

var user2 = new Password().create("secret");
console.log( user2.isValid("secret")?"yes":"no" );
```
