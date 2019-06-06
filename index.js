const express=require('express')
var fs=require('fs')
const bodyParser=require('body-parser')
const {setup}=require('./setup')
//const {ledge}=require('./firebase')
const port=process.env.PORT || 3000
const hbs=require('hbs')
const app=express()
process.env.PWD = process.cwd()
let jsonData = JSON.parse(fs.readFileSync('gradients.json', 'utf-8'));
var colorizer=(callback)=>{
var x=jsonData[Math.floor(Math.random()*334)].colors
callback(x)
}
app.use(express.static(process.env.PWD + '/public/img'));
app.set('view-engine','hbs');
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

var obj;
app.get('/',(req,res)=>{
colorizer((x)=>{
res.render("index.hbs",{begin:x[0],end:x[1]})
});
})
app.use('/profile',(req,res,next)=>{
setup(req.body.username,req.body.password,(d,f,p,i,t,pr,newincreased,newdecreased,name,branch)=>{
if(t!==undefined)
{
colorizer((x)=>{
res.render('profile.hbs',{
d,f,
p,
i,t,
pr,
color:p>85?"success":(p>75?"info":(p>65?"warning":"danger")),newincreased,newdecreased,
colorn:newincreased>85?"success":(newincreased>75?"info":(newincreased>65?"warning":"danger")),
colord:newdecreased>85?"success":(newdecreased>75?"info":(newdecreased>65?"warning":"danger")),
name,
branch,
begin:x[0],
end:x[1]
})
})
//ledge(name,branch)
}
else
{
res.sendFile(__dirname+"/public/error.html")

}
})

})

app.get('/miniLedger',(req,res)=>{
res.sendFile(__dirname+"/public/miniledger.html");
})

app.post('/profileMini',(req,res)=>{
setup(req.body.username,req.body.password,(d,f,p,i,t,pr,newincreased,newdecreased,name,branch)=>{
if(t!==undefined)
{
res.render('profileMini.hbs',{
d,f,
p,
i,t,
pr,
newincreased,newdecreased,name,branch

})
//ledge(name,branch)
}
else
res.sendFile(__dirname+"/public/errorMini.html")

})
})
app.get('/apiHelp',(req,res)=>{
res.render('apiHelp.hbs')
})
app.get('/api',(req,res)=>{
var username=req.query.username;
var password=req.query.password;
if(username&&password)
{
setup(username,password,(d,f,p,i,t,pr,newincreased,newdecreased,name,branch)=>{
if(t!==undefined)
{res.status(200);
res.send({name,branch,percentage:p,daysNeeded:d,daysFree:f,totalLectures:t,totalPresent:pr,attendanceAfterInc:newincreased,attendanceAfterDec:newdecreased})
}
else
{
res.status(404);
res.send("<h1>Error!! Please supply valid credentials</h1>")
}

})
}
else
{
res.status(404);
res.send("<h1>Error!! Please supply valid credentials</h1>")
}
})
app.post('/api',(req,res)=>{
var username=req.body.username;
var password=req.body.password;
if(username&&password)
{
setup(username,password,(d,f,p,i,t,pr,newincreased,newdecreased,name,branch)=>{
if(t!==undefined)
{res.status(200);
res.send({name,branch,percentage:p,daysNeeded:d,daysFree:f,totalLectures:t,totalPresent:pr,attendanceAfterInc:newincreased,attendanceAfterDec:newdecreased})
}
else
{
res.status(404);
res.send("<h1>Error!! Please supply valid credentials</h1>")
}

})
}
else
{
res.status(404);
res.send("<h1>Error!! Please supply valid credentials</h1>")

}
})


app.listen(port)
