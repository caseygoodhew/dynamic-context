# dynamic-context

Dynamic context manages your mutation stack  allowing your application to easily share context in an idempotent way.

#### What does that actually mean? 
When you change an individual value, an entirely new context is created - all of the original values are copied forward and only the new value is actually changed.

```bash
> npm install -S dynamic-context
```
```javascript
const _context = require('dynamic-context');

const homer = _context(['firstName', 'lastName']).lastName('Simpson').firstName('Homer');
const marge = homer.firstname('Marge');

console.log(`${homer.firstName()} ${homer.lastName()}`);
// Homer Simpson
console.log(`${marge.firstName()} ${marge.lastName()}`);
// Marge Simpson
```

Values can also be changed via a setter, which allows you to clear a value that you've previously defined.
```javascript
const _context = require('dynamic-context');

const homer = _context(['firstName', 'lastName']).lastName('Simpson').firstName('Homer');
const marge = homer.set('firstName', 'Marge');
const unknown = homer.set('firstName');

console.log(`${homer.firstName()} ${homer.lastName()}`);
// Homer Simpson
console.log(`${marge.firstName()} ${marge.lastName()}`);
// Marge Simpson
console.log(`${unknown.firstName()} ${unknown.lastName()}`);
// undefined Simpson
```

You can also access the parent context which allows you to traverse up the context tree.
```javascript
const _context = require('dynamic-context');

const homer = _context(['firstName', 'lastName', 'relation']).lastName('Simpson').firstName('Homer');
const bart = homer.relation('son').firstName('Bart');
const lisa = homer.relation('daughter').firstName('Lisa');

console.log(`${bart.firstName()} ${bart.lastName()} ${bart.relation()} of ${bart.parent().firstName()}`);
// Bart Simpson son of Homer
console.log(`${lisa.firstName()} ${lisa.lastName()} ${lisa.relation()} of ${lisa.parent().firstName()}`);
// Lisa Simpson daughter of Homer
```

Whilst individual values are idempotent, they are subject to the same variability as all other javascript objects. 
```javascript
const _context = require('dynamic-context');

const obj = {
  firstName: 'Homer',
  lastName: 'Simpson'
}

const homer = _context(['person']).person(obj);
obj.firstName = 'Marge';

console.log(`${homer.person().firstName} ${homer.person().lastName}`);
// Marge Simpson <<-- notice that the name may not be what you expected
```

