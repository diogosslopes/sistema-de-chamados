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
    console.log(req.body.obs)
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

    db.query(SQL, [client, created, obs, priority, status, subject,  type, userEmail, userId], (err, result)=>{
        console.log(err)
    })
})
app.post("/registerobs", (req, res)=>{
    console.log(req.body.obs)
    const {client} = req.body
    const {created} = req.body
    const {obs} = req.body
    const {taskId} = req.body


    let SQL = "INSERT INTO obs(taskId, obs, client, created) VALUES(?,?,?,?)"

    db.query(SQL, [taskId, obs, client, created], (err, result)=>{
        console.log(err)
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