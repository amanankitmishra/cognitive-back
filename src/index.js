const express = require('express')
require('./db/mongoose')
const cors = require('cors'); 


//Routers
const userRouter = require('./routers/user');
const clientRouter = require('./routers/clients');


const app = express()

const port = process.env.PORT


app.use(cors())
// app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json())
app.use(userRouter);
app.use(clientRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})