console.log("Starting note.js");

var addNode = (title, body) =>{
  console.log("Title:" + title + " Body: " + body);
};

var getAll = () =>{
  console.log("Get All Notes");
}

var getNote = (title)=>{
  console.log("Read Title: " + title);
}

var removeNote = (title)=>{
  console.log("Remove Title: " + title);
}

module.exports = {
  addNode,
  getAll,
  getNote,
  removeNote
}
