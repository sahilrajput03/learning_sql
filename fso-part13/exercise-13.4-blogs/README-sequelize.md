## Subtle pagination

````js
const s = JSON.stringify;
const p = JSON.parse;
app.get("/api/notes", async (req, res) => {
  const page = 2; // Page values : 1, 2, 3...
  const limit = 2; // limit means itemsPerPage; Fetch all records via ```limit: null```
  const offset = (page - 1) * limit;
  let notes;
  try {
    notes = await Note.findAndCountAll({
      limit,
      offset,
    });
    console.log("my notes:", p(s(notes, null, 2))); // Parsing the object makes the printed object colored accordingly to the data types.
    notes.totalPages = Math.ceil(notes.count / limit);
    notes.currentPage = page;
    notes.limit = limit;
    // notes.count is the total sum of records of `note` in the notes table.
    // notes.rows is the records for current page.
    res.json(notes); // notes.count is the total number of records(not pages).
  } catch (error) {
    res.json({ ERORR_MESSAGE: String(error), more: error });
  }
});
````

## Model Querying - Finders

Docs [here](https://sequelize.org/master/manual/model-querying-finders.html).

Though

```js
const project = await Project.findOne({ where: { title: "My Title" } });
const project = await Project.findByPk(123);
const project = await project.findAll();
if (project === null) {
  console.log("Not found!");
}
```

**\*For ready made pagination please refer that specific topic above**

[Docs in Sequelize](https://sequelize.org/v5/manual/models-usage.html#manipulating-the-dataset-with-limit--offset--order-and-group)

```js
// AMAZING PAGINATION WITH SEQUELIZE:
// step over(skip~sahil) the first n items using offset, and take next p items. Results include starting from 3rd element.
const project = await Project.findAll({ offset: 3, limit: 2 });
// default (limit) : null
// default (offset) : 0 or null. BEWARE: Setting limit as 0 will always return 0 results.
```

```js
const [user, created] = await User.findOrCreate({
  where: { username: "sdepold" },
  defaults: {
    job: "Technical Lead JavaScript",
  },
});
// created: boolean, if true its just created else older existing record is returned.
// user: record, either created or existing.
// TIP: If the `defaults` do not contain values for every column, Sequelize will take the values given to where (if present). ~sahil: We dont' need to pass username property in `defaults`.
```

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
let p = JSON.parse;
console.log(s(note)); // rocks!
console.log(s(notes)); // rocks!

console.log(p(s(note))); // super rocks!
console.log(p(s(notes))); // super rocks!
// super rocks = coz it prints the colors according to data types of each entity as well
```
