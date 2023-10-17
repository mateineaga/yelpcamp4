const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });        //se foloseste UserSchema pentru a crea un utilizator care se va stoca in mongo
        const registeredUser = await User.register(user, password);   //se face automat hash la password cu salt, si se adauga la user
        req.login(registeredUser, err => {   //helper din passport care te logheaza automat dupa ce iti creezi un cont
            if (err) {
                return next(err)
            }
            req.flash('success', 'Welcome to yelp camp')
            res.redirect('/campgrounds')
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    //middleware de verificare a autentificarii locale, nu pe google, facebook sau altceva, in cazul in care esueaza 
    //autentificarea te redirectioneaza pe /login
    req.flash('success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) { //metoda adaugata de passport pentru a da logout
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}