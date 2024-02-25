const express = require('express');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(path.join(__dirname, 'data')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.get('/', (req, res) => {
    const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'toys.json'), 'utf8'));
    res.render('index', { jsonData });
});

app.post('/update-toy', (req, res) => {
    const updatedToy = req.body;
    const jsonDataPath = path.join(__dirname, 'data', 'toys.json');
    fs.readFile(jsonDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON data file:', err)
            res.status(500).send('Error updating toy data');
            return;
        }
        let jsonData = JSON.parse(data);
        const index = jsonData.toys.findIndex(toy => toy.id === updatedToy.id);
        if (index !== -1) {
            jsonData.toys[index] = updatedToy;
            fs.writeFile(jsonDataPath, JSON.stringify(jsonData, null, 2), 'utf8', err => {
                if (err) {
                    console.error('Error writing JSON data file:', err);
                    res.status(500).send('Error updating toy data');
                    return;
                }
                res.status(200).send('Toy data updated successfully');
            });
        } else {
            res.status(404).send('Toy not found');
        }
    });
});

app.post('/add-toy', (req, res) => {
    const newToy = req.body;
    newToy.id = uuid.v4();
    const jsonDataPath = path.join(__dirname, 'data', 'toys.json');
    fs.readFile(jsonDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON data file:', err);
            res.status(500).send('Error adding new toy');
            return;
        }
        let jsonData = JSON.parse(data);
        jsonData.toys.push(newToy);
        fs.writeFile(jsonDataPath, JSON.stringify(jsonData, null, 2), 'utf8', err => {
            if (err) {
                console.error('Error writing JSON data file:', err);
                res.status(500).send('Error adding new toy');
                return;
            }
        res.status(200).send('New toy added successfully');
        });
    });
});

app.delete('/delete-toy/:toyId', (req, res) => {
    const toyId = parseInt(req.params.toyId);
    const jsonDataPath = path.join(__dirname, 'data', 'toys.json');
    fs.readFile(jsonDataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON data file:', err);
            res.status(500).send('Error deleting toy');
            return;
        }
        let jsonData = JSON.parse(data);
        const index = jsonData.toys.findIndex(toy => toy.id === toyId);
        if (index !== -1) {
            jsonData.toys.splice(index, 1);
            fs.writeFile(jsonDataPath, JSON.stringify(jsonData, null, 2), 'utf8', err => {
                if (err) {
                    console.error('Error writing JSON data file:', err);
                    res.status(500).send('Error deleting toy');
                    return;
                }
            res.status(200).send('Toy deleted successfully');
        });
        } else {
            res.status(404).send('Toy not found');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
