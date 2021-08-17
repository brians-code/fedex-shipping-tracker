const express = require('express');
const soap = require('soap');
const cors = require('cors');
const appRoot = require('app-root-path');
const app = express();
const port = 3001;
app.use(cors())

const wsdl = appRoot + '/TrackService_v19.wsdl';

const authenticationParams = {
    'WebAuthenticationDetail': {
        'UserCredential': {
            'Key': 'duuG58RmL8VkMXOH',
            'Password': 'HX2DaqJXmtesTqCxfXOdWbnQw',
        }
    },
    'ClientDetail': {
        'AccountNumber': '510087240',
        'MeterNumber': '100702736',
    },
}

const fedexTrackRequestParams = (code) => {
    return {
        ...authenticationParams,
        'Version': {
            'ServiceId': 'trck',
            'Major': '19',
            'Intermediate': '0',
            'Minor': '0'
        },
        'SelectionDetails': [{
            'PackageIdentifier': {
                'Type': 'TRACKING_NUMBER_OR_DOORTAG',
                'Value': code,
            },
        }]
    };
};

app.get('/', function(req, res) {
    res.send('GET /track/:code');
});

app.get('/track', function(req, res) {
    soap.createClient(wsdl, function(err, client) {
        err ? res.send(err) : res.send(client.describe());
    });
});

app.get('/track/:code', (req, res) => {
    const code = req.params.code;
    soap.createClient(wsdl, function(err, client) {
        err ? res.send(err) : client.track(fedexTrackRequestParams(code), function(err, result) {
            err ? res.send(err) : res.json(result);
        });
    });
});

app.listen(port, () => {
    console.log(`FEDEX Tracker listening at http://0.0.0.0:${port}`);
});
