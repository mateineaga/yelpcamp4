if (process.env.NODE_ENV !== 'production') {     //cand ruleaza programul in mod normal este in developer mode, nu in production
    require('dotenv').config();
}

// YZLolZGwAYslypb6
// mongodb+srv://matei:<password>@cluster0.u8z4i6b.mongodb.net/?retryWrites=true&w=majority

const express = require('express')
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')

const mongoSanitize = require('express-mongo-sanitize')
const MongoStore = require('connect-mongo');

// const Campground = require('./models/campground');
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')  //routing din folderul routes
const reviewRoutes = require('./routes/reviews')  //routing
const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp';
// 
mongoose.connect(dbUrl) //comanda universala de conectare a mongoose
    .then(() => {
        console.log('connetion database open')
    })
    .catch(err => {
        console.log('oh no error')
        console.log(err)
    })

app.engine('ejs', ejsMate) //activare ejsMate
app.set('view engine', 'ejs') //activate EJS
app.set('views', path.join(__dirname, 'views')) //seteaza ca orice folder din care se ruleaza app.js sa fie vazut ca views

app.use(express.urlencoded({ extended: true }))  //pt ca req.body se da submit ca fiind empty
app.use(methodOverride('_method')); //activate method override
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());

const store = MongoStore.create({   //setup pentru session store, unde se stocheaza sesiunea
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'secret'
    }
});

const sessionConfig = {    //declararea parametrilor sesiunii
    store,  
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //se adauga rezultatul inmultirii (o saptamana in milisecunde) si dicteaza cat sa dureze sesiunea de cookies
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}



store.on('error', function(e){
    console.log('session store error', e)
})

app.use(session(sessionConfig))   //setarea sesiunii, a codului secret, cat dureaza un cookie, etc
app.use(flash());

app.use(passport.initialize());   //
app.use(passport.session());      //pentru a pastra un login mai mult timp, nu necesita logarea utilizatorului de fiecare data cand e accesat site-ul
passport.use(new LocalStrategy(User.authenticate()));  //foloseste passport-local, si este folosit autentificarea sub datele/schema User-ului

passport.serializeUser(User.serializeUser());  //cum sa serialize un user, cum sa stochezi user-ul in session;
passport.deserializeUser(User.deserializeUser()); //cum sa scoti User din session


app.use((req, res, next) => {   //middleware care permite accesarea variabilei succes care stocheaza mesajul din req.flash, putand fi accesat in alte fisiere gen boilerplate, index, show etc
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeUser', async (req, res) => {
//     const user = new User({ email: 'matei@gmail.com', username: 'mateiul' })
//     const newUser = await User.register(user, 'matei');
//     res.send(newUser);
// })



app.use('/campgrounds', campgroundRoutes)    //routing
app.use('/campgrounds/:id/reviews', reviewRoutes)    //routing
app.use('/', userRoutes);



app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'oh no, something wrong'
    res.status(statusCode).render('error', { err })

})

app.listen(3000, () => {
    console.log('serving on port 3000!')
})