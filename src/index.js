const express = require('express')
require('./db/mongoose')
const cors = require('cors'); 

const path = require('path');


//Routers
const userRouter = require('./routers/user');
const clientRouter = require('./routers/clients');
const oleadsRouter = require('./routers/oleads');
const enquiryRouter = require('./routers/enquiry');
const boqRouter = require('./routers/boq');
const proposalRouter = require('./routers/proposal');
const salesOrderRouter = require('./routers/salesOrder');
const meetingRouter = require('./routers/meeting');
const analyticsRouter = require('./routers/analytics');
const productRouter = require('./routers/product');
const vendorRouter = require('./routers/vendors');

const settingsRouter = require('./routers/settings');


const app = express()

const port = process.env.PORT


app.use(cors())
app.use('/uploads', express.static('uploads'));


app.use(express.json());
app.use(userRouter);
app.use(clientRouter);
app.use(oleadsRouter);
app.use(enquiryRouter);
app.use(boqRouter);
app.use(proposalRouter);
app.use(salesOrderRouter);
app.use(meetingRouter);
app.use(analyticsRouter);
app.use(productRouter);
app.use(vendorRouter);
app.use(settingsRouter);

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})