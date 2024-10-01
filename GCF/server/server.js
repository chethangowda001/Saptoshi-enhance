const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const checkCookie = require('./middleware/authentication')


const bidsRoutes = require('./routes/bidsRoutes');
const participantsRoutes = require('./routes/participantsRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const AdminUsersRoutes = require('./routes/AdminUsersRoutes')

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));
app.use(cookieParser('token'))
app.use('/public', express.static('public'));


const mongoURI = 'mongodb://localhost:27017/SaptosiGCF';
mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected...');
  })
  .catch(err => console.log(err));

app.use('/users', AdminUsersRoutes )
app.use('/bids',  bidsRoutes);
app.use('/participants', participantsRoutes);
app.use('/payments',  paymentsRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
