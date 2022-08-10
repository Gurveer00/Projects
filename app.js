const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoconnect= require('./util/database').mongoconnect;
const User= require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findbyId('62eb55658ded9ce419075b8b')
    .then(user=>{
        req.user=new User(user.username, user.email, user.cart, user._id);
        next();
    })
    .catch(err=>{
        console.log(err);
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoconnect(()=>{
    app.listen(3000);
})

