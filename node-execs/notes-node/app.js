console.log("Starting app.js");
const fs = require('fs');
const os = require('os');

const _ = require('lodash');
const yargs = require('yargs');

// const notes = require('./notes.js');
const notesDao = require('./notesDao.js');

const appYargsTitleOptions = {
  description: 'Title of Note',
  alias: 't',
  demand: true
}
const appYargsBodyOptions = {
  description: 'Body of Note',
  alias: 'b',
  demand: true
}

const argv = yargs.command('add','Add a Note',{
  title: appYargsTitleOptions,
  body: appYargsBodyOptions
}).command('remove', 'Remove a Note',{
  title: appYargsTitleOptions
}).command('read', 'Read a Note', {
  title: appYargsTitleOptions
}).command('list','List all Notes')
.help('h').argv;
// var argvInfo = process.argv;
// console.log("Yargs...");
// console.log(argv);

var noteList = [];
var command = argv._[0];
var title = yargs.argv.title;
var body = yargs.argv.body;
var noteObj = {
  "title": title,
  "body": body
}

try{
  noteList = notesDao.getAllNotesDao();
  var dupTitleFlag = noteList.filter( value => {return value.title == title;});
}catch(e){
  console.log("Error app.js: " + e);
}

if(command == "add"){
  console.log("Add a new Note:");
  if(dupTitleFlag.length > 0){
    console.log("Duplicate Notes make sure you enter an Unique Note Title");
    return;
  }
  noteList.push(noteObj);
  notesDao.addNoteDao(noteList);
}else if(command == "read"){
  console.log("Read a Note:");
  var returnNote = notesDao.readNoteDao(title);
  if(returnNote != null && returnNote.length > 0){
    notesDao.logNote(returnNote[0]);
  }else{
    console.log("Not Such Note Found!");
  }
}else if(command == "remove"){
  console.log("Remove a Note:");
  var removeResult = notesDao.removeNoteDao(title);
  console.log("Remove Status: " + removeResult);
}else if(command == "list"){
  console.log("All the Functions:");
  var allNotes = notesDao.getAllNotesDao();
  var counter = 0;
  // for(var eachNote of allNotes){
  //   counter++;
  //   console.log("Index: " + counter);
  //   notesDao.logNote(eachNote);
  // }
  allNotes.forEach(eachOne => {
    counter++;
    notesDao.logNote(eachOne);
  });
}else{
  console.log("Undefined Funtions:");
}

// var array = [1,2,3,4,5,4,3,2,"1", '1',"Cheng"];
//
//
// var sum = notes.add(100, 200);
//
// console.log(_.isString(sum));
// console.log(_.isString(sum + ""));
//
// console.log(_.uniq(array));
//
// console.log("Sum: " + sum);
