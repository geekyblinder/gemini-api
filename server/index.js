const express=require('express');
const cors=require('cors');
const {runImagetoText} =require('./gemini')


require('dotenv').config();
const app=express();
app.use(express.raw({ type: 'application/octet-stream', limit: '50mb' }));
app.use(cors());
app.use(express.json());

app.post('/getanswer',async (req,res)=>{
var prompt = req.body.prompt;
var answer = await runTexttoText(prompt);
res.send({'answer':answer});
});

app.post('/image',async (req,res)=>{
    var prompt = req.headers.prompt;
    var blob=req.body;
    var answer = await runImagetoText(prompt,blob);
    console.log(answer);
    res.send({'message':answer});
    });


app.listen('5000',()=>{
    console.log('server running at port 5000');
});