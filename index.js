const express = require('express');
const app = express();
const BoxSDK = require('box-node-sdk');

// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;

const sdkConfig = {
    boxAppSettings: {
        clientID: "f61ovzp5e2hknwclrm1dnhmfmzc20qj7",
        clientSecret: "h6mHgCmHmeCwlVCf40aHHOWnC6tqYVof"
    },
    enterpriseID: "1000690348",
    box_subject_type: "enterprise",
    box_subject_id: "1000690348",
    grant_type: "client_credentials",
}
const sdk = BoxSDK.getPreconfiguredInstance(sdkConfig)
const client = sdk.getAnonymousClient();

// Initialize the SDK with your app credentials
// var sdk = new BoxSDK({
//     clientID: '1rcqsqivxd3hd6tr7f7mhnd04jpq872z',
//     clientSecret: 's1wKcKFhJV9xmDnC54AbQ7athOvAXiCV'
// });

// Create a basic API client, which does not automatically refresh the access token
// var client = sdk.getBasicClient('lxGRTJZeu1J40bkK45mBgcqBLHT7MsI3');

// handling CORS
app.use((req, res, next) => {
    // res.header("Access-Control-Allow-Origin",
    //  "http://localhost:4200");
    const allowedOrigins = ['http://localhost:4200', 'https://seancahall2.github.io/'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// route for handling requests from the Angular client
app.get('/api/message', (req, res) => {
    res.json({
        message:
            'Hello GEEKS FOR GEEKS Folks from the Express server!'
    });
});

// DO SEARCH
// route for handling requests from the Angular client
app.get('/api/search', (req, res) => {
    console.log('search term', req.query.searchTerm);

    // Search for description docs matching "searchTerm"
    client.search.query(
        req.query.searchTerm,
        {
            fields: 'name,id,description,tags',
            // file_extensions: 'pdf,doc',
            limit: 200,
            offset: 0,
            ancestor_folder_ids: "165682361236,165679997956,165680323304,165681470106,173746409655,165681353082,165681298231"
            // content_types: ["tags"]
        })
        .then(results => {
            console.log('Data received!');
            res.json({
                data: results
            });

        });
});

// route for handling requests from the Angular client
app.get('/api/searchByTag', (req, res) => {
    console.log('search by tag', req.query.tag);

    // Search for PDF or Word documents matching the provided tag
    client.search.query(
        req.query.tag,
        {
            fields: 'name,id,description,tags',
            query: req.query.tag,
            limit: 200,
            offset: 0,
            content_types: ["tags"]
        })
        .then(results => {
            console.log('Data received!');
            res.json({
                data: results
            });
        });
});


app.get('/api/filesByFolder', (req, res) => {

    var BoxSDK = require('box-node-sdk');

    // Initialize the SDK with your app credentials
    var sdk = new BoxSDK({
        clientID: '1rcqsqivxd3hd6tr7f7mhnd04jpq872z',
        clientSecret: 'bhCUuokWcnMFDdZIx6D21gsDFDdR467o'
    });

    // Create a basic API client, which does not automatically refresh the access token
    var client = sdk.getBasicClient('Cdm14KoIRAIzXga587BfcDvrXXfs0w61');

    client.folders.getItems(
        '114825448225',
        {
            usemarker: 'false',
            fields: 'name',
            offset: 0,
            limit: 25
        })
        .then(data => {
            console.log('Data received!');
            res.json({
                data: data.entries
            });


        })
        .catch(err => console.log('Got an error!', err));

});

app.get('/api/auth', (req, res) => {

    console.log('here!');

    var BoxSDK = require('box-node-sdk');

    // Initialize the SDK with your app credentials
    var sdk = new BoxSDK({
        clientID: '1rcqsqivxd3hd6tr7f7mhnd04jpq872z',
        clientSecret: 'bhCUuokWcnMFDdZIx6D21gsDFDdR467o'
    });

    // Create a basic API client, which does not automatically refresh the access token
    var client = sdk.getBasicClient('sLhEy6xN6c6ZEjN6zvs3QDOi1sEDbwS7');
    res.json({
        client:
            client
    });
});

app.get('/api/dojson', (req, res) => {
    const fs = require('fs');

    let rawdata = fs.readFileSync('./assets/data/tags.json');
    let tagData = JSON.parse(rawdata);
    console.log(tagData);
    res.json({
        message:
            'Success!'
    });
});

app.get('/api/writeJson', (req, res) => {
    const fs = require('fs');

    let rawdata = require('./app/tag-array.json');
    // let tagData = JSON.parse(rawdata);
    let tagObject = { tag: req.query.tag, count: req.query.count };
    rawdata.tagDataDad.push(tagObject);

    let data = JSON.stringify(rawdata);
    console.log('data', data);
    fs.writeFileSync('./app/tag-array.json', data);
    console.log('Data written to file');

    res.json({
        message:
            'Success!',
        data: rawdata
    });
});

app.get('/api/getFileInfo', (req, res) => {
    var BoxSDK = require('box-node-sdk');
    console.log('id in node: ' + req.query.id);
    // Initialize the SDK with your app credentials
    var sdk = new BoxSDK({
        clientID: '1rcqsqivxd3hd6tr7f7mhnd04jpq872z',
        clientSecret: 'bhCUuokWcnMFDdZIx6D21gsDFDdR467o'
    });

    // Create a basic API client, which does not automatically refresh the access token
    var client = sdk.getBasicClient('JRexxo9ozfNR6YCRVeYLpGrWjw5cyUYI');

    client.files.get('1017868008921')
        .then(file => {
            console.log('File info received!');
            res.json({
                data: file
            });
        });

});

// Listen on `port` and 0.0.0.0
app.listen(port, "0.0.0.0", function () {
    console.log('Server listening on some port ' + port + '!');
});