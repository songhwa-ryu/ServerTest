const express = require('express')
const app = express()
const cors = require('cors')
const { Client } = require('pg')
//const dbInfo = { } // require('../DB/dbInfo')
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:false}))

const dbInfo = {
    user:'dllwujxicncmqb'
    ,password:'b0b7a4db64bd1588ee574ecfcd53946fcae19de8b74dc7c529f37a51470dc3a9'
    ,port:5432
    ,host:'ec2-54-85-56-210.compute-1.amazonaws.com'
    ,database:'dl73h2u11pksr'
    ,ssl:{rejectUnauthorized:false}
}

app.get('/', (req,res)=>{
    res.send('Success')
})

app.get('/kor',(req, res)=>{
    res.send('안녕하세요')
})

app.get('/eng',(req, res)=>{
    res.send('Hello')
})

app.get('/jap',(req, res)=>{
    res.send('おはよう！')
})

app.get('/language_all/', (req, res)=>{
    const client = new Client(dbInfo)
    client.connect()
    client.query('SELECT language, msg FROM public."Language"',(err, result)=>{
        res.send(result.rows)
    })
})

app.get('/language/:lan', (req, res)=>{
    //console.log('aaa', req.params.lan)
    const lan = req.params.lan
    const client = new Client(dbInfo)
    client.connect()
    client.query('SELECT language, msg FROM public."Language" WHERE language = $1',[lan],(err, result)=>{
        res.send(result.rows)
    })
})

app.post('/reg', (req, res)=>{

    const lan = req.body.lan
    const msg = req.body.msg

    const client = new Client(dbInfo)
    client.connect()
    client.query('INSERT INTO public."Language" VALUES ($1 ,$2)',[lan,msg],(err, result)=>{
        if(err){
            console.log('Error', err)
        }else{
            res.send('OK')
        }
    })
})

app.post('/del', (req, res)=>{

    const item = req.body.item
    console.log(item)

    const client = new Client(dbInfo)
    client.connect()
    client.query('DELETE FROM public."Language" WHERE language = $1',[item], (err, result)=>{
        if(err){
            console.log('Error',err)
        }else{
            res.send('OK')
        }
    })
})

app.post('/mod', (req, res)=>{
    const lan = req.body.lan
    const lan_mod = req.body.lan_mod
    const msg = req.body.msg

    console.log(lan, lan_mod, msg)


    const client = new Client(dbInfo)
    client.connect()
    client.query('UPDATE public."Language" SET language = $1, msg = $2 WHERE language = $3'
                , [lan_mod, msg, lan]
                , (err, result)=>{
        if(err){
            console.log('Error',err)
        }else{
            res.send('OK')
        }
    })
})

app.post('/language/',(req, res)=>{

    const lan = req.body.lan
    const msg1 = req.body.msg

    let msg = ''

    const client = new Client(dbInfo)
    client.connect()
    .then(()=>{
        console.log('connection ok')
    })
    .catch((err)=>{
        console.log('error',err)
    })

    client.query('SELECT msg FROM public."Language" WHERE language = $1',[lan], (err, result)=>{

        console.log(result.rowCount)

        if(err){
            console.log('Error',err)
        }else{
            if(result.rowCount==0){

                client.query('INSERT INTO public."Language" VALUES ($1 ,$2)',[lan, msg1] ,(err, result)=>{
                    if(err){
                        console.log('Error',err)
                    }else{
                        client.query('SELECT msg FROM public."Language" WHERE language = $1',[lan], (err, result)=>{
                            res.send(result.rows[0].msg)
                        })
                    }
                })

            }else{
                res.send(result.rows[0].msg)
            }
        }
    })
})

// process / enviroment 환경변수 / 이게 있으면 쓰고 아니면 3000을 쓰겠다
app.listen(process.env.PORT || 3000, ()=>{
    console.log('Start Server On Port 3000')
})