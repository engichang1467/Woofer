const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const Woof = require('./models/Woofs')
const app = express()

// Prevent spans and swear words
const Filter = require('bad-words')
const rateLimit = require('express-rate-limit')

require('dotenv/config')

const filter = new Filter()

app.use(cors())
app.use(express.json())

// req = request, res = response
app.get('/', (req, res) => {
    res.json({
        message: 'Woofer! 🐕'
    })
})

app.get('/woofs', async (req, res) => {
    try {
        const woofs = await Woof.find()
        res.json(woofs)
    } catch (err) {
        res.json({message: err})
    }
})

function isValidWoof(woof)
{
    return woof.name && woof.name.toString().trim() !== '' && 
    woof.content && woof.content.toString().trim() !== ''
}


app.use(rateLimit({
    windowMs: 30 * 1000,  // User can only submit 1 woof every 30 seconds
    max: 1
}))

app.post('/woofs', async (req, res) => {
    // console.log(req.body)
    if (isValidWoof(req.body)) 
    {
        const woof = new Woof({ 
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            // created: new Date()
        })
        try {
            const savedWoof = await woof.save()
            res.json(savedWoof)
        } catch(err) {
            res.json({message: err})
        }
    } 
    else 
    {
        res.status(422)
        res.json({
            message: 'Hey! Name and Content are required'
        })
    }
})

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
     () => console.log('connected to DB!!'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})