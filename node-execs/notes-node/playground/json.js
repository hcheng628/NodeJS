const fs = require('fs');


var memoryStrPerson = null;
var memoryObjPerson = null;

var db_file = "note-db.json";





fs.writeFile(db_file, personString, (err) => {
  if (err) throw err;
  console.log('It\'s saved!');
    fs.readFile('Notes.json', 'utf8', (err, data) => {
      if (err) throw err;
      console.log(data);
      memoryStrPerson = data;
      console.log("memoryStrPerson: " + memoryStrPerson);
      memoryObjPerson = JSON.parse(memoryStrPerson);
      console.log(typeof memoryObjPerson);
      console.log(memoryObjPerson.name);
      console.log(memoryObjPerson.age);
    });
});
