const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')

const db = mysql.createPool({
    host: "179.188.16.167",
    user: "chamadosfacil",
    password: "Centr0#3127",
    database: "chamadosfacil"
})

app.use(cors())
app.use(express.json())

app.post("/registeruser", (req, res)=>{
    const {name} = req.body
    const {email} = req.body
    const {adress} = req.body
    const {password} = req.body

    let SQL = "INSERT INTO users(adress, email, name, password) VALUES(?,?,?,?)"

    db.query(SQL, [adress, email, name, password], (err, result)=>{
        console.log(err)
    })
})

app.post("/registertask", (req, res)=>{
    const {client} = req.body
    const {created} = req.body
    const {obs} = req.body
    const {priority} = req.body
    const {status} = req.body
    const {subject} = req.body
    // const {taskImages} = req.body
    const {type} = req.body
    const {userEmail} = req.body
    const {userId} = req.body

    let SQL = "INSERT INTO tasks(client, created, obs, priority, status, subject, type, userEmail, userId) VALUES(?,?,?,?,?,?,?,?,?)"
               
    db.query(SQL, [client, created, obs, priority, status, subject, type, userEmail, userId], (err, result)=>{
        if (err) console.log(err)
        else res.send(result)
    })
})
app.post("/searchtask", (req, res)=>{
    const {client} = req.body
    const {created} = req.body
    const {obs} = req.body
    const {userEmail} = req.body
    const {userId} = req.body

    let SQL = "select * from tasks where client = ? and created = ? and obs = ? and userEmail = ? and userId = ?"
               
    db.query(SQL, [client, created, obs, userEmail, userId], (err, result)=>{
        if (err) console.log(err)
        else res.send(result)
    })
})

app.post("/registerobs", (req, res)=>{
    console.log(req.body)
    const {client} = req.body
    const {created} = req.body
    const {obs} = req.body
    const {taskid} = req.body


    let SQL = "INSERT INTO obs(taskid, obs, client, created) VALUES(?,?,?,?)"

    db.query(SQL, [taskid, obs, client, created], (err, result)=>{
        if (err) console.log(err)
        else res.send(result)
    })
})



app.get("/getLastTask", (req, res)=>{
    let SQL = "SELECT taskId FROM tasks ORDER BY taskId DESC LIMIT 1"

    db.query(SQL, (err, result)=>{
        if (err) console.log(err)
        else res.send(result)
    })
})
app.get("/getTasks", (req, res)=>{
    let SQL = "SELECT * from tasks"

    db.query(SQL, (err, result)=>{
        if (err) console.log(err)
        else res.send(result)
    })
})

app.listen(3001, () =>{
    console.log("rodandoooo")
})