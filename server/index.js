const PORT = 3000 
const express = require("express")
const fs = require("fs").promises
const cors = require('cors')
const app = express()


app.use(cors({
  origin: '*'
}));

app.use(express.json())

app.get('/poll', async (req,res) => {
  let data = JSON.parse(await fs.readFile('./data.json', 'utf-8'))  
  // console.log(data)
  const totalVotes = Object.values(data).reduce((acc, prev) => acc += prev, 0)
  console.log(totalVotes)
  data = Object.entries(data).map(([key, value]) => ({
      label: key,
      percentage: (((100 * value) / totalVotes) || 0).toFixed(0)
    })
  )
  console.log(data)
  res.json(data)
})

app.post('/poll', async (req, res) => {
  console.log(req.body)
  const data = JSON.parse(await fs.readFile('./data.json', 'utf-8'))  
  data[req.body.add] += 1
  console.log(data)

  await fs.writeFile('./data.json', JSON.stringify(data));

  res.json(`${req.body.add} got 1 more vote`);
})

app.listen(5000, () => console.log('connect to server on port 3000'))


