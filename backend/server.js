// variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Project = require('./models/project');
const bodyParser = require('body-parser');
const engines = require('consolidate');
const fileMiddleware = require('./middlewares/file.js');
const { toASCII } = require('punycode');

// app config
const app = express();
const PORT = process.env.PORT || 3000;
const URL = 'mongodb+srv://andrey:6aO4W0r4d2OQZn2b@cluster0.fbzfo.mongodb.net/portfolio?retryWrites=true&w=majority';

// middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../dist/')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileMiddleware.single('project'));
app.set('view engine', 'pug');
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '../dist/views'));

// connect to mongodb and listen
async function start() {
    try {
        await mongoose.connect(URL, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        app.listen(PORT, () => console.log('server has been started'));
    } catch (e) {
        process.exit(1);
    }
}

start();

// routes
// home page
app.get('/', (req, res) => res.render('index'));

// admin page
app.get('/admin', (req, res) => {
    if (process.env.AUTH) {
        res.redirect('/admin-panel');
    } else {
        res.render('admin');
    }
});

// admin panel page
app.get('/admin-panel', async(req, res) => {
    const projects = await Project.find();

    if (!process.env.AUTH) {
        res.redirect('/admin');
    } else {
        res.render('admin-panel', {
            projects
        });
    }
});

// post projects
app.post('/get/projects', async(req, res) => {
    const projects = await req.body;

    Project.create(projects, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
});

// get projects
app.get('/get/projects', (req, res) => {
    Project.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
});

// authentication to admin
app.post('/auth/login', async(req, res) => {
    try {
        const { name, password } = await req.body;

        if (name === 'Admin' && password === 'gT92HvQTKwDQsjQh') {
            process.env.AUTH = true;
            res.redirect('/admin-panel');
        } else {
            res.status(400).send({ message: 'Введены неверные данные' });
        }
    } catch (e) {
        res.status(500).send({ message: `Произошла ошибка, попробуйте снова` });
    }
});

// add to database changes from admin panel
app.post('/add/project', async(req, res) => {
    try {
        const { title_main, title_img, img } = await req.body;

        const newProject = await new Project({
            title: title_main,
            titleImages: title_img,
            imgUrl: img
        })

        const toChange = {
            title: title_main
        }

        if (img) {
            toChange.imgUrl = img.path;
        }

        Object.assign(newProject, toChange);

        await newProject.save();

        res.redirect('/');
    } catch (e) {
        res.status(500).send({ message: 'Произошла ошибка, попробуйте снова ' + e.message });
    }
});

// remove project
app.post('/remove/project', async(req, res) => {
    const { name } = await req.body;

    Project.deleteMany({ title: name }, (err) => {
        if (err) return res.status(400).send({ message: 'Попробуйте снова, произошла ошибка' });

        res.redirect('/');
    });
});