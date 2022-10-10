const express = require('express');
const route = express.Router();
const path = require('path');
const axios = require('axios');
const User = require('../model/user');
const Pages = require('../model/pages');
const md5 = require('md5');
const sendMail = require('./mail');

route.get('/algorithm-visualizer', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'algorithm.html'));
});

route.get('/', (req, res)=>{
    let sess = req.session;
    if(sess.email){
        return res.redirect('/home');
    }
    let quote = '';
    let author = '';
    axios.get('https://zenquotes.io/api/today')
    .then(response => {
        // console.log(response.data);
        quote = response.data[0].q;
        author = response.data[0].a;
        res.render('index', {quote: quote, author: author});
    }).catch(error => {
            console.log(error);
            quote = 'Quote not found';
            author = 'Author not found';
        res.render('index', { quote: quote, author: author });
    });
});

route.get('/home', async (req, res) => {
    if(req.session.email){
        const pages = await Pages.find({username: req.session.email});
        console.log(pages);
        res.render('dashboard', {session: req.session, posts: pages});
    }else{
        res.redirect('/');
    }
})

route.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

route.get('/signup', (req, res)=>{
    let quote = '';
    let author = '';
    axios.get('https://api.quotable.io/random')
    .then(response => {
        quote = response.data.content;
        author = response.data.author;
        res.render('signup', {quote: quote, author: author});
    }).catch(error => {
            console.log(error);
            quote = 'I can shake off everything as i write; my sorrows disappear, my courage is reborn.';
            author = 'Anne Frank';
        res.render('signup', { quote: quote, author: author });
    });
});

route.get('/api/user/activate/:token',async (req, res)=>{
    let token = req.params.token;
    try{
        const user = await User.findOne({authenticationToken: token});
        if(user && user.authenticated == false){
            user.authenticated = true;
            user.save();
            res.render('activate', {message: 'Account Activated Successfully'});
        }else{
            res.redirect('/');
        }
    }catch(err){
        console.log(err);
        res.status(500);
    };
});

route.post('/signup',async (req, res)=>{
    let emailTo = req.body.email;
    let password = req.body.password;
    
    // Find user if it already exists
    const user = await User.findOne({username : emailTo});
    if(user){
        res.render('alreadyexist', {email: emailTo, quote : 'You are already within our minds and hearts, Much love open your book now', author: 'Kashif, Admin & Developer'});
    }else{
        // console.log(activationToken);
        let createToken = emailTo + password + Date.now() + Math.floor(Math.random()*100);
        const activationToken = md5(createToken);
        const createNewUser = new User({
            username: emailTo,
            password: password,
            authenticationToken : activationToken
        });
        createNewUser.save();
        let homeUrl = "http://itswriter.herokuapp.com/api/user/activate/"+activationToken;
        let subject = "Account Activation : Writer";
        let message = '<h1 style="text-align: center">Welcome to Writer</h1>, <br><strong>your one and only online-blogger cum diary entry. Fully secured and encrypted.</strong><br />';
        message += '<h2 style="color: purple; text-align: center">Please activate your account using this Link</h2><br />';
        message += '<a href="'+homeUrl+'" style="background-color: purple; color: #fff; height: 40px; width: auto; padding: 5px; text-align:center;">Activate Account</a><br> ';
        message += '<br /> or Paste this link in a browser:<br>  '+homeUrl+'<br /> Happy Writing!<br /> <h3>Team Writer</h3>';
        sendMail(emailTo, subject, message);
        res.render('activate', {message: 'Please check your email for activation link'});
    }
});     

route.post('/signin', async (req, res)=>{
    let email = req.body.email;
    let password = req.body.password;
    try{
        const user = await User.findOne({username : email});
        if(!user){
            res.render('signin', {error: 'User not found', quote : 'You are not within our minds and hearts, Much love open your book now', author: 'Kashif, Admin & Developer'});
        }else{
            if(user.password === password){
                if(user.authenticated){
                req.session.id = user._id;
                req.session.email = email;
                req.session.fullName = user.firstName + ' ' + user.lastName;
                req.session.firstName = user.firstName;
                req.session.lastName = user.lastName;
                req.session.profileImage = user.profilePicture;
                req.session.followers = user.followers;
                req.session.following = user.following;
                req.session.authenticated = user.authenticated;
                req.session.gender = user.gender;
                req.session.bio = user.bio;
                res.redirect('/home');
                }else{
                    res.render('signin',{error: 'Inactive account please check mail to activate it', quote : 'You are not within our minds and hearts, Much love open your book now', author: 'Kashif, Admin & Developer'} )
                }
            }else{
                res.render('signin', {error: 'Wrong username or password ', quote : 'It seems you dont know yourself right now!, Much love open your book now', author: 'Kashif, Admin & Developer'});
            }
        }
    }catch(err){
        console.log(err);
    }
});

route.get('/forgot', async (req, res)=>{
    res.render('forgot', {error: "", quote: 'I can shake off everything as i write; my sorrows disappear, my courage is reborn.', author: 'Anne Frank'});
});

route.post('/forgotPassword', async (req, res)=>{
    const email = req.body.email;
    try{
        const user = await User.findOne({username : email});
        if(user){
            authenticationToken = user.authenticationToken;
            const url = "http://itswriter.herokuapp.com/account/resetpassword/" + authenticationToken;
            let subject = "Account Password Reset | Writer";
            let message = "<h1 style='text-align: center;'>Writer</h1><br />";
            message += "<h2 style='text-align: center; font-weight: bold; color: purple;'>Link to reset password is: </h2><br />";
            message += "<a href='"+url+"' style='background-color: purple; color: #fff; height: 40px; width: auto; padding: 5px; text-align:center;'>Reset Password</a><br> ";
            message += "or copy paste the link: <br>  "+url+" in your browser. <br />";
            message += "<br /> Happy Writing!<br /> <h3>Team Writer</h3>";
            sendMail(email, subject, message);
            res.render('forgotPassword');
        }else{
            res.render('forgot', {error: 'User not found', quote : 'I can shake off everything as i write; my sorrows disappear, my courage is reborn.', author: 'Anne Frank'});
        }
    }catch(err){
        console.log(err);
    }
});

route.get('/account/resetpassword/:token', async (req, res)=>{
    const token = req.params.token;
    try{
        const user = await User.findOne({authenticationToken : token});
        if(user){
            res.render('resetpassword', {email: user.username , error: "", quote: 'I can shake off everything as i write; my sorrows disappear, my courage is reborn.', author: 'Anne Frank'});
        }else{
            res.status(404).render('404');
        }
    }catch(err){
        console.log(err);
    }
});

route.post('/resetpassword', async (req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    try{
        const user = await User.findOne({username : email});
        if(user){
            user.password = password;
            let newToken = password + Date.now() + Math.floor(Math.random()*100);
            user.authenticationToken = md5(newToken);
            user.save();
            res.render('resetpassword', {email: user.username , error: 'Password Changed Succesfully', quote: 'I can shake off everything as i write; my sorrows disappear, my courage is reborn.', author: 'Anne Frank'});
        }else{
            res.status(500).send("Something went wrong");
        }
    }catch(err){
        console.log(err);
    }
});

route.get('/account', (req, res) => {
    if(req.session.email){
        res.render('account', {session: req.session});
    }else{
        res.redirect('/');
    }
});

route.get('/write', (req, res) => {
    if(req.session.email){
        res.render('write', {session: req.session});
    }else{
        res.redirect('/');
    }
});

route.get('/profile', (req, res) => {
    if(req.session.email){
        res.render('profile', {session: req.session});
    }else{
        res.redirect('/');
    }
});

route.post('/updateprofile', async (req, res)=>{
        let email = req.session.email;
        let firstName = req.body.first;
        let lastName = req.body.last;
        let gender = req.body.gender;
        let bio = req.body.bio;
        let profilePicture = req.body.avatar;
        const user = await User.findOne({username: email});
        if(user && user.username == email){
            if(firstName != '' || firstName != null){
                user.firstName = firstName;
            }
            if(lastName != '' || lastName != null){
                user.lastName = lastName;
            }
            if(bio != '' || bio != null){
                user.bio = bio;
            }
            if(profilePicture != '' || profilePicture != null){
                user.profilePicture = profilePicture;
            }
            if(gender != ''){
                user.gender = gender;
            }
            const saveData = await user.save();
            if(saveData){
                req.session.firstName = firstName;
                req.session.lastName = lastName;
                req.session.profileImage = profilePicture;
                req.session.gender = gender;
                req.session.bio = bio;
                req.session.save();
                res.redirect('/profile');
            }else{
                res.redirect('/profile');
            }
        }
});

// Username  ==> Email
route.get('/@:email', async (req, res) => {
        let email = req.params.email;
        try{
            const user = await User.findOne({username: email});
            let noFollower = user.followers.length;
            let noFollowing = user.following.length;
            if(!user){
                res.status(404).render('404');
            }
            if(user){
                console.log('rendering account');
                console.log(req.session.email);
                let avatar1 = '/public/assets/users_icon/' + user.profilePicture;
                res.render('account', {user: user, avatar:avatar1, numFollower: noFollower, numFollowing: noFollowing, bio: user.bio});
            }else{
                res.redirect('/');
            }
        }catch(err){
            console.log(err);
            res.status(500);
        }

});

route.get('/@:email/followers', async (req, res) => {
    let email = req.params.email;
    try{
        const user = await User.findOne({email: email});
        if(user){
            console.log(user.followers.length);
            res.render('followers', {session: req.session, user: user});
        }else{
            res.redirect('/');
        }
    }catch(err){
        console.log(err);
        res.status(500);
    }
});


route.get('/@:email/following', async (req, res) => {
    let email = req.params.email;
    try{
        const user = await User.findOne({email: email});
        if(user){
            res.render('following', {session: req.session, user: user});
        }else{
            res.redirect('/');
        }
    }catch(err){
        console.log(err);
        res.status(500);
    }
});

route.get('/@:email/diary', async (req, res) => {
    let email = req.params.email;
    try{
        const user = await User.findOne({email: email});
        if(user){
            res.render('diary', {session: req.session, user: user});
        }else{
            res.redirect('/');
        }
    }catch(err){
        console.log(err);
        res.status(500);
    }
});

route.get('/@:email/diary/:id', async (req, res) => {
    let email = req.params.email;
    let id = req.params.id;
    try{
        const user = await User.findOne({email: email});
        if(user){
            const diary = await Diary.findOne({_id: id});
            res.render('diary-single', {session: req.session, user: user, diary: diary});
        }else{
            res.redirect('/');
        }
    }catch(err){
        console.log(err);
        res.status(500);
    }
});

route.get('/checkAvailable', async (req, res) => {
    let uname = req.query.uname;
    const user = await User.findOne({uname: uname});
    if(user){
        res.send('false');
    }else{
        res.send('true');
    }
});

route.get('/followers', async (req, res) => {
    if(req.session.email){
        let email = req.session.email;
        const user = await User.findOne({email: email});
        if(user){
            res.render('followers', {session: req.session, user: user});
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
});

route.get('/following', async (req, res) => {
    if(req.session.email){
        let email = req.session.email;
        const user = await User.findOne({email: email});
        if(user){
            res.render('following', {session: req.session, user: user});
        }else{
            res.redirect('/');
        }
    }else{
        res.redirect('/');
    }
});

route.get('/top-trending', async (req, res) => {
    // sort based on likes length
    const pages = await Pages.find({writeStatus: 'public'});
    const users = [];
    let session = req.session;
    if(!req.session){
        session.username = 'Unknown';
    }
    for(let i = 0; i < pages.length; i++){
        const user = await User.findOne({username: pages[i].username});
        users.push(user);
    }

    res.render('top-trending', {pages: pages, users: users, session: session});
});


route.post('/save-post', async (req, res) => {
    if(req.session){
        const title = req.body.title;
        const content = req.body.content;
        const writeStatus = req.body.writeStatus;
        const user = await User.findOne({username: req.session.email});
        let readTime = calculateReadTime(content);
        if(user){
            const page = new Pages({
                userId: user._id,
                username: user.username,
                title : title,
                content: content,
                writeStatus: writeStatus,
                readTime: readTime
            });
            const savePage = await page.save();
            if(savePage){
                // res.status(200).send('success');
                res.redirect('/home');
            }else{
                // res.status(404).send('error');
                res.redirect('/');

            }
        }
    }else{
        // res.status(500).send('error');
        res.redirect('/');
    }

});

function calculateReadTime(content){
    let words = content.split(' ');
    let time = words.length / 200;
    // convert into minutes
    let minutes = Math.floor(time);
    return minutes + ' min';
}


module.exports = route;