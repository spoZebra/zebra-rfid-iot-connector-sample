const express = require('express')
const xml2js = require('xml2js');
const cors = require('cors');
const discoveryClient = require('./discovery-service.js');

const app = express()
const port = 3000

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.post('/rm/discovery/', (req, res) => {
    console.log(req.body);
    discoveryClient.discovery();
    res.send();
})

app.post('/rm/login/', (req, res) => {
    body = req.body;
    const data = `<?xml version="1.0" encoding="UTF-8"?>
  <rm:command epcglobal:creationDate="2001-12-17T09:30:47.0Z" epcglobal:schemaVersion="0.0" xsi:schemaLocation="urn:epcglobal:rm:xsd:1 ../../../schemas/RmCommand.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:rm="urn:epcglobal:rm:xsd:1" xmlns:epcglobal="urn:epcglobal:xsd:1" xmlns:motorm="urn:motorfid:rm:xsd:1">
      <rm:id>99</rm:id>
      <rm:targetName>myFX</rm:targetName>
      <motorm:readerDevice>
          <motorm:doLogin>
          <motorm:username>${body.username}</motorm:username>
          <motorm:password>${body.password}</motorm:password>
          <motorm:forceLogin>true</motorm:forceLogin>
          </motorm:doLogin>
      </motorm:readerDevice>
  </rm:command>`;

    var request = require("request");
    request.post({
        rejectUnauthorized: false,
        url: `https://${body.hostname}/control`,
        method: "POST",
        headers: {
            'Content-Type': 'application/xml',
        },
        body: data
    }, async function (error, response, body) {
        if (error) {
            res.send(error)
        } else {
            const result = await parseXml(body);
            const sessionID = result['g1:reply']['g3:readerDevice']['g3:doLogin']['g3:sessionID'];
            console.log(sessionID);
            res.send({ sessionID });
        }
    });
})


app.post('/rm/set-config/:sessionId', (req, res) => {
    body = req.body;
    const data = `<?xml version="1.0" encoding="utf-8"?>
  <rm:command epcglobal:creationDate="2001-12-17T09:30:47.0Z"
              epcglobal:schemaVersion="0.0"
              xsi:schemaLocation="urn:epcglobal:rm:xsd:1 ../../../schemas/RmCommand.xsd"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xmlns:rm="urn:epcglobal:rm:xsd:1"
              xmlns:epcglobal="urn:epcglobal:xsd:1"
              xmlns:motorm="urn:motorfid:rm:xsd:1">
    <rm:id>99</rm:id>
    <rm:targetName>MyFX7500</rm:targetName>
    <motorm:readerDevice>
      <motorm:sessionID>${req.params.sessionId}</motorm:sessionID>
      <motorm:importCloudConfigToReader>
        <motorm:CloudConfigData>${body}</motorm:CloudConfigData>
        </motorm:importCloudConfigToReader>
      </motorm:readerDevice>
    </rm:command>`;

    var request = require("request");
    request.post({
        rejectUnauthorized: false,
        url: `https://${body.host}/control`,
        method: "POST",
        headers: {
            'Content-Type': 'application/xml',
        },
        body: data
    }, async function (error, response, body) {
        if (error) {
            res.send(error)
        } else {
            const result = await parseXml(body);
            console.log(result);
            res.send(result);
        }
    });
})

app.post('/rm/connect/:sessionId', (req, res) => {
    body = req.body;
    const data = `<?xml version="1.0" encoding="UTF-8"?>
    <rm:command xmlns:rm="urn:epcglobal:rm:xsd:1" xmlns:epcglobal="urn:epcglobal:xsd:1" xmlns:motorm="urn:motorfid:rm:xsd:1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" epcglobal:creationDate="2001-12-17T09:30:47.0Z" epcglobal:schemaVersion="0.0" xsi:schemaLocation="urn:epcglobal:rm:xsd:1 ../../../schemas/RmCommand.xsd">
       <rm:id>104</rm:id>
       <rm:targetName />
       <motorm:readerDevice>
          <motorm:sessionID>${sessionID}</motorm:sessionID>
          <motorm:connectToCloud />
       </motorm:readerDevice>
    </rm:command>`;

    var request = require("request");
    request.post({
        rejectUnauthorized: false,
        url: `https://${body.host}/control`,
        method: "POST",
        headers: {
            'Content-Type': 'application/xml',
        },
        body: data
    }, async function (error, response, body) {
        if (error) {
            res.send(error)
        } else {
            const result = await parseXml(body);
            console.log(result);
            res.send(result);
        }
    });
});


const parseXml = async (xml) => {
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xml);
    return result;
};


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})