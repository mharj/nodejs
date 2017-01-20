Simple SHA512 crypt wrapper 
```javascript
var Password = require('./password.js');
var user1 = new Password("$6$XTzaLxCR$RJLMngsKDqbF1oW2o49d4AsUUkVqDvvAdJolu83F/U.r7G.bWKlmnAuRJuQE.SRuUlv99/OCOtg27uFY3bBji1");
console.log( user1.isValid("secret")?"yes":"no" );

var user2 = new Password().create("secret");
console.log( user2.isValid("secret")?"yes":"no" );
```
