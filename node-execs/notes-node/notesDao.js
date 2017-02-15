const fileSystem = require('fs');
const notes_db = "notes-db.json";

var addNoteDao = (inNote) => {
  console.log("addNoteDao");
  var inNoteStr = JSON.stringify(inNote);
  try{
    // fileSystem.appendFileSync(notes_db,inNoteStr);
    fileSystem.writeFileSync(notes_db,inNoteStr);
  }catch(e){
    console.error("Error addNoteDao: " + e);
  }
}



var removeNoteDao = (inTitle) => {
  console.log("removeNoteDao");
  var noteList = getAllNotesDao();
  var initSize = noteList.length;
  if(noteList.length >0){
    noteList = noteList.filter( value => {
      return value.title != inTitle;
    });
  }
  addNoteDao(noteList);
  if(noteList.length == initSize){
    return "Title: " + inTitle + " NOT FOUND.";
  }else{
    return "REMOVE - SUCCESS";
  }
}

var updateNodeDao = () => {
  console.log("updateNodeDao");

}

var readNoteDao = (inTitle) => {
  console.log("readNoteDao");
  var returnNote = getAllNotesDao();
  var foundNote = [];
  if(returnNote.length > 0){
    foundNote = returnNote.filter(value =>{
      return value.title == inTitle;
    });
  }
  return foundNote;
}

var getAllNotesDao = () => {
  console.log("getAllNotesDao");
  var noteListStr;
  try{
    noteListStr = fileSystem.readFileSync(notes_db);
  }catch(e){
    console.error("Error getAllNotesDao: " + e);
  }
  return JSON.parse(noteListStr);
}

var logNote = (inNote) => {
  debugger;
  if(inNote == null){
    return;
  }else{
    console.log("Note:");
    console.log("Title: " + inNote.title);
    console.log("Body: "+ inNote.body);
  }
}

module.exports = {
  addNoteDao,
  removeNoteDao,
  updateNodeDao,
  readNoteDao,
  getAllNotesDao,
  logNote
}
