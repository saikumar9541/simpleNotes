const express = require('express');
const app = express();
const port = 3000;
const Mongoclient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/simple_notes";
const dbname = 'simple_notes';
var db;
const bodyParser = require('body-parser')
const cors = require("cors");
const { ObjectID, ObjectId } = require('bson');

app.use(cors());
app.use(bodyParser());

Mongoclient.connect(url,(err,client)=>{
    if(err) throw err;
    db=client.db(dbname);
    console.log(`connected to database`);
})

async function getAllNotes(){
    try{
        const res = await db.collection('notes').find({trash_id:false}).toArray();
        return res;
    }
    catch(e){
        console.log(e);
    }
}

async function getTrashItems(){
    try{
    const trashNotes = await db.collection('notes').find({trash_id:true}).toArray();
    return trashNotes;
    }
    catch(e){
        console.log(e);
    }
}

app.get('/getAllNotes', async(req,res)=>{
    try{
       const response = await getAllNotes();
       const jsonRes = JSON.stringify(response)
       res.send(jsonRes);
    }
    catch(e){
        console.log(e);
    }
});

app.get('/getSpecificNote/:noteid',async(req, res)=>{
    try{
        const note =await db.collection('notes').findOne({_id:ObjectId(req.params.noteid)});
        const jsonRes = JSON.stringify(note);
        res.send(jsonRes);
    }
    catch(e){
        console.log(e);
    }
})

app.get('/trashItems',async(req, res)=>{
    try{
        const trashNotes = await getTrashItems();
        const jsonResponse = JSON.stringify(trashNotes);
        res.send(jsonResponse);
    }
    catch(e){
        console.log(e);
    }
})

app.post('/moveTotrashBin/:noteid',async(req, res)=>{
    try{
        await db.collection('notes').findOneAndUpdate({_id:ObjectId(req.params.noteid)},{
            $set:{trash_id:true}});
            const response = await getAllNotes()
            const jsonRes = JSON.stringify(response)
            res.send(jsonRes);
    }
    catch(e){
        console.log(e);
    }
});

app.post('/updateNote/:noteid',async(req, res)=>{
    try{
    const data = req.body.val;
    var title = data.split('\n')[0];
    var description = data.substring(title.length+1,data.length);
    if(title.length==0 && description.length==0){
        title = "title";
        description = "content";
    }
    await db.collection('notes').findOneAndUpdate({_id:ObjectId(req.params.noteid)},{
        $set:{title:title,description:description}});
    const record = await db.collection('notes').findOne({_id:ObjectId(req.params.noteid)});
    var response;
    if(record.trash_id){
        response = await getTrashItems();
    }
    else{
        response = await getAllNotes()
    }
    const jsonRes = JSON.stringify(response)
    res.send(jsonRes);
}
catch(e){
    console.log(e);
}
});



app.post('/newNote', async(req,res)=>{
    try{
    var newNote = {
        "title":"Title",
        "description":"content",
        "trash_id":false
    }
    db.collection('notes').insertOne(newNote);
    const response = await getAllNotes();
    const jsonRes = JSON.stringify(response);
    res.send(jsonRes);
}
catch(e){
    console.log(e);
}
})


app.listen(port,()=>{
    console.log(`server is listening to ${port}`);
})