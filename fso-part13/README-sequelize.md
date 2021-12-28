## raw way of querying

```js
const notes = await sequelize.query("SELECT * FROM notes", {
  type: QueryTypes.SELECT,
});
```

## What is `underscored: true`

That means that, if the name of the model, as in our case is "Note", then the name of the corresponding table is the plural of the name written in a small initial letter, i.e. notes. If, on the other hand, the name of the model would be "two-part", e.g. StudyGroup, then the name of the table would be study_groups.

```js
  underscored: true,

```

## create vs. save method of the model

Instead of the create method, it would be possible to save in a database using first method build to create a Model-object from the desired data, and calling the save method on it:

Calling the build method does not save the object in the database yet, so it is still possible to edit the object before the actually save event:

```js
// i.e., intead of
const note = await Note.create(req.body);

//  we can use
const note = Note.build(req.body);
note.important = true;
await note.save();
```

## Way to remove unnecessary shit from the fetched data from db

```js
const notes = await Note.findAll();
console.log(
  "my notes:",
  notes.map((n) => n.toJSON()) // In the case of a collection of objects, the method toJSON does not work directly, the method must be called separately for each object in the collection.
);
```

```js
const note = await Note.findByPk(req.params.id);
console.log("my note::", note.toJSON()); // In addition to the note information, all sorts of other things are printed on the console. We can reach the desired result by calling the model-object method toJSON:
```

**Best simply:**

```js
let s = JSON.stringify;
console.log(s(note)); // rocks!
console.log(s(notes)); // rocks!
```
