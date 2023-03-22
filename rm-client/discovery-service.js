const dgram = require('dgram');
const crypto = require("crypto");
var request = require("request");
const xml2js = require('xml2js');
var os = require('os');

const mqttClient = require('./mqtt-client.js');

const parser = new xml2js.Parser({ explicitArray: false });

const PORT = 3702; // WS-Discovery default port
const MULTICAST_ADDRESS = '239.255.255.250'; // Default broadcast address
uniqueId = ''

function discovery() {
  try {
    var startPort = 65554;
    var networkInterfaces = os.networkInterfaces();
    Object.entries(networkInterfaces).forEach(([key, value]) => {
      value.filter((x) => x.family == "IPv4").forEach((i) => {
        exec(i.address);
      })})
  }
  catch (err) {
    console.log(err);
  }
}


function exec(address) {
  const socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });

  socket.on('listening', () => {
    socket.setBroadcast(true);
    socket.addMembership(MULTICAST_ADDRESS);
  });

  socket.on('message', (msg, rinfo) => {
    console.log('\nReceived message from ' + rinfo.address + ':' + rinfo.port + ':');
    console.log(msg.toString());
    // Match the probe request
    isMatchingRequest(msg.toString()).then(({ isMatching, endpointReference }) => {
      if (isMatching == true) {
        // Send SOAP Req
        generateGetReq(rinfo.address, endpointReference).then(({ model, friendlyName, fwVersion, serialNumber }) => {
          // Send reader data thru MQTT to the Angular App
          mqttClient.publish('zebra/discovery', { result: "Success", model, friendlyName, fwVersion, serialNumber });
        }).catch(err => {
          console.error(err);
        });
      }
    }).catch(err => {
      console.error(err);
    });
  });

  socket.bind(65534, address, () => {
        uniqueId = crypto.randomUUID(); // Probe request
        discoveryRequest = `<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope
      xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
      xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing"
      xmlns:wsd="http://schemas.xmlsoap.org/ws/2005/04/discovery"
      xmlns:wsdp="http://schemas.xmlsoap.org/ws/2006/02/devprof">
      <soap:Header>
        <wsa:To>urn:schemas-xmlsoap-org:ws:2005:04:discovery</wsa:To>
        <wsa:Action>http://schemas.xmlsoap.org/ws/2005/04/discovery/Probe</wsa:Action>
        <wsa:MessageID>${uniqueId}</wsa:MessageID>
      </soap:Header>
      <soap:Body>
        <wsd:Probe>
          <wsd:Types
            xmlns:_0="http://standards.iso.org/iso/24791-3/2009/rdmp">_0:ISO24791-3
          </wsd:Types>
        </wsd:Probe>
      </soap:Body>
    </soap:Envelope>`
        // Send discovery request
        socket.send(discoveryRequest, 0, discoveryRequest.length, PORT, MULTICAST_ADDRESS, (err, bytes) => {
          if (err) {
            console.error('Error sending WS-Discovery message:', err);
            socket.close();
          } else {
            console.log('WS-Discovery message sent:', discoveryRequest);
          }
        });
      });
}

function isMatchingRequest(xml) {
  return new Promise((resolve, reject) => {
    parser.parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        try {
          const action = result['SOAP-ENV:Envelope']['SOAP-ENV:Header']['wsa:Action'];
          const probeReqId = result['SOAP-ENV:Envelope']['SOAP-ENV:Header']['wsa:RelatesTo'];
          const endpointReference = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['wsd:ProbeMatches']['wsd:ProbeMatch']['wsa:EndpointReference']['wsa:Address'];

          // Match probe request together with action
          const isMatching = action == "http://schemas.xmlsoap.org/ws/2005/04/discovery/ProbeMatches" //&&uniqueId == probeReqId temp bypass probeReqIdValidation ;

          return resolve({ isMatching, endpointReference });
        }
        catch (err) {
          reject(err);
        }
      }
    });
  });
}


function generateGetReq(ipAdd, endpointReference) {
  return new Promise((resolve, reject) => {
    // Get hostname and other info
    const getRequest = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope
    xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
    xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing">
    <soap:Header>
      <wsa:To>${endpointReference}</wsa:To>
      <wsa:Action>http://schemas.xmlsoap.org/ws/2004/09/transfer/Get</wsa:Action>
      <wsa:MessageID>urn:uuid:d6d1837b-ecc3-4698-b890-d963d6f646e8</wsa:MessageID>
      <wsa:ReplyTo>
        <wsa:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:Address>
      </wsa:ReplyTo>
      <wsa:From>
        <wsa:Address>${endpointReference}</wsa:Address>
      </wsa:From>
    </soap:Header>
    <soap:Body/>
  </soap:Envelope>`

    request.post({
      rejectUnauthorized: false,
      url: "http://" + ipAdd + ":9876/" + endpointReference,
      method: "POST",
      headers: {
        'Content-Type': 'application/xml',
      },
      body: getRequest
    }, function (error, response, body) {
      if (error) {
        console.log(error)
      } else {
        console.log(body)
        // Get Hostname and send data thru MQTT
        parser.parseString(body, (err, result) => {
          if (err) {
            reject(err);
          } else {
            try {
              const model = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['wsm:Metadata']['wsm:MetadataSection'][0]['wdp:ThisModel']['wdp:ModelNumber'];
              const friendlyName = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['wsm:Metadata']['wsm:MetadataSection'][1]['wdp:ThisDevice']['wdp:FriendlyName'];;
              const fwVersion = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['wsm:Metadata']['wsm:MetadataSection'][1]['wdp:ThisDevice']['wdp:FirmwareVersion'];
              const serialNumber = result['SOAP-ENV:Envelope']['SOAP-ENV:Body']['wsm:Metadata']['wsm:MetadataSection'][1]['wdp:ThisDevice']['wdp:SerialNumber'];
              return resolve({ model, friendlyName, fwVersion, serialNumber });
            }
            catch (err) {
              reject(err);
            }
          }
        });
      }
    });

  })
}

exports.discovery = discovery;