const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://10.0.0.41')
const interact = require('./interact.js')

client.on('connect', function () {
  publishdevs()
  interact.events.on('updatecolor', function (device) {
    client.publish(`rpilc/state/${device}`, JSON.stringify(interact.mqtt(device)))
  })
  interact.events.on('newdevice', function (device) {
    const name = interact.getdata(device).name
    client.publish(`homeassistant/light/${device}/config`, JSON.stringify(new Configmsg(device, name)))
  })
  interact.events.on('removedevice', function (device) {
    client.publish(`homeassistant/light/${device}/config`, '')
  })
  client.subscribe('rpilc/set/+', function (err) {
    if (!err) {
    //   client.publish(`rpilc/set`, 'lor')
    }
  })
})

client.on('message', function (topic, message) {
  topic = topic.toString()
  message = JSON.parse(message.toString())
  const device = topic.replace('rpilc/set/', '')
  if (message.state === 'ON') {
    if (message.effect !== undefined) {
      switch (message.effect) {
        case 'set old color':
          interact.setoldcolor(device)
          return
          
        default:
          break
      }
    }
    if (message.color === undefined) {
      if (message.brightness !== undefined) {
        interact.setbrightness(device, message.brightness)
      }
      interact.togle(device, 'on')
      return
    }
    interact.setcolor(device, message.color)
    if (message.brightness !== undefined) {
      interact.setbrightness(device, message.brightness)
    }
    return
  }
  if (message.state === 'OFF') {
    interact.togle(device, 'off')
  }
})

function Configmsg (id, name) {
  this.name = name
  this.unique_id = id
  this.cmd_t = `rpilc/set/${id}`
  this.stat_t = `rpilc/state/${id}`
  this.schema = 'json'
  this.rgb = true
  this.effect = true
  this.fx_list = ['set old color']
  this.brightness = true
  this.bri_scl = 100
}

function reportdevices () {
  const devs = interact.listdevices()
  const config = []
  devs.forEach(device => {
    config.push(new Configmsg(device[0], device[1]))
  })
  return config
}

function publishdevs () {
  const devs = reportdevices()
  devs.forEach(conf => {
    client.publish(`homeassistant/light/${conf.unique_id}/config`, JSON.stringify(conf))
  })
}
