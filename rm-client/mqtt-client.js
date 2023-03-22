const mqtt = require('mqtt')

const host = 'localhost'
const port = '1997'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `ws://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
})

function publish(topic, object) {
    
  const json = JSON.stringify(object);
  console.log(json);

  client.publish(topic, json, { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
}

exports.publish = publish;