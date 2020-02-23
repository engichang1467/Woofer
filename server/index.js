const express = require('express')
const cors = require('cors')
const monk = require('monk')
// Prevent spans and swear words
const Filter = require('bad-words')
const rateLimit = require('express-rate-limit')

const app = express()

const db = monk(process.env.MONGO_URI || 'localhost/woofer')
const woofs = db.get('woofs')
const filter = new Filter()

app.use(cors())
app.use(express.json())

// req = request, res = response
app.get('/', (req, res) => {
    res.json({
        message: 'Woofer! 🐕'
    })
})

app.get('/woofs', (req, res) => {
    woofs
    .find()
    .then( woofs => {
        res.json(woofs)
    })
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

app.post('/woofs', (req, res) => {
    // console.log(req.body)
    if (isValidWoof(req.body)) 
    {
        const woof = { 
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        }
        woofs
            .insert(woof)
            .then(createdWoof => {
                res.json(createdWoof)
            })
    } 
    else 
    {
        res.status(422)
        res.json({
            message: 'Hey! Name and Content are required'
        })
    }
})

app.listen(5000, () => {
    console.log('Listening on http://localhost:5000')
})