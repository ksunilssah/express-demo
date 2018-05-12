const express = require('express');

const port = '5050';
const app = express();

//Index route
app.get('/', (request, response) => {
    response.send({
        'id': 1,
        'name': 'index page'
    });
});

//About route
app.get('/about', (request, response) => {
    response.send({
        'id': 1,
        'name': 'About us'
    });
});

app.listen(port, () => console.log(`Express Server is listening at ${port} `))