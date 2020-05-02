const val = document.getElementById('rgbValue')
const joe = colorjoe.rgb('rgbPicker', 'black')
const socket = io.connect()

const clientdata = {
  Version: '2.0',
  type: 'Client'
}

let ServerData

socket.on('devicelist', function (list) {
  updatedevicelist(list)
  askdata()
})
socket.on('data', function (data) {
  const selecteddevice = $('input[name=devices]:checked').attr('id')
  if (data.id === selecteddevice) {
    console.log(data)
    ServerData = data
    UpdateColorValsInput(data.color)
    joe.setnu(data.color.hex)
    upcolors(data.savedcolors)
    UpdateColorBar(data)
    UpdateCycleMode(data.cycle)
  }
})

socket.on('config', function (config) {
  UpdateConfigUI(config)
})

socket.on('clientevent', function (obj) {
  clientevents(obj)
})

socket.on('updatecolor', function (c) {
  ServerData.color = c.color
  const selecteddevice = $('input[name=devices]:checked').attr('id')
  if (c.id === selecteddevice) {
    joe.setnu(c.color.hex)
    UpdateColorBar(c)
    UpdateColorValsInput(c.color)
  }
})

socket.on('cycle', function (data) {
  console.log(data)
  const selecteddevice = $('input[name=devices]:checked').attr('id')
  if (data.id === selecteddevice) {
    UpdateCycleMode(data.cycle)
  }
})

socket.on('SaveColor', function (SavedColors) {
  ServerData.SavedColors = SavedColors
  upcolors(SavedColors)
})

socket.on('updates', function (updateinfo) {
  UpdateUpdatesUI(updateinfo)
})

joe.on('change', function (c) {
  const device = $('input[name=devices]:checked').attr('id')
  const data = {
    color: {
      rgb: {
        r: Math.round(255 * c.red()),
        g: Math.round(255 * c.green()),
        b: Math.round(255 * c.blue())
      },
      hex: c.hex().replace(/#/g, '')
    }
  }

  UpdateColorBar(data)
  socket.emit('previewcolor', device, data.color.rgb)
})

joe.on('done', function (c) {
  emitcolor(c.hex())
})

function emitcolor (color) {
  const device = $('input[name=devices]:checked').attr('id')
  socket.emit('setcolor', device, color)
}

function fadeone (color) {
  const device = $('input[name=devices]:checked').attr('id')
  socket.emit('fadeone', device, color)
}

function setoldcolor () {
  const device = $('input[name=devices]:checked').attr('id')
  socket.emit('setoldcolor', device)
}

function setoncolor () {
  const device = $('input[name=devices]:checked').attr('id')
  socket.emit('setoncolor', device)
}

function setrgbval () {
  emitcolor({
    r: document.getElementById('r').value,
    g: document.getElementById('g').value,
    b: document.getElementById('b').value
  })
}

function sethexval () {
  emitcolor(document.getElementById('hex').value)
}

function togglestate () {
  const device = $('input[name=devices]:checked').attr('id')
  socket.emit('togglestate', device)
};

function fade () {
  const device = $('input[name=devices]:checked').attr('id')
  const cycle = {
    ison: document.getElementById('CycleState').checked, // true / false
    colors: Object.values(cylclr),
    speed: document.getElementById('cyclespeed').value,
    effect: document.getElementById('cycleeffect').value
  }
  socket.emit('cycle', device, { ison: cycle.ison, colors: cycle.colors, effect: cycle.effect, speed: cycle.speed })
};

function UpdateConfigUI (config) {
  if (config.AutoGen) {
    UIkit.modal('#config').show()
    document.getElementById('welcome').innerHTML = 'Welcome to RPiLC - Install'
    document.getElementById('close0').style.visibility = 'hidden'
    document.getElementById('close1').style.visibility = 'hidden'
  }
  document.getElementById('rp').value = config.gpio_pin.red
  document.getElementById('gp').value = config.gpio_pin.green
  document.getElementById('bp').value = config.gpio_pin.blue
  document.getElementById('serverport').value = config.server_settings.webserverport
  $('#debug').prop('checked', config.server_settings.debug)
  document.getElementById('startupcolor').value = config.RPiLC_settings.startupcolor
  document.getElementById('oncolor').value = config.RPiLC_settings.on_color
}

function config () {
  const config = {}
  config.red = document.getElementById('rp').value
  config.green = document.getElementById('gp').value
  config.blue = document.getElementById('bp').value
  config.port = document.getElementById('serverport').value
  config.debug = document.getElementById('debug').checked
  config.startcolor = document.getElementById('startupcolor').value
  config.oncolor = document.getElementById('oncolor').value
  socket.emit('config', config)
}

function UpdateCycleMode (cycle) {
  UpdateColorCycleListUI(cycle.colors)
  $('#CycleState').prop('checked', cycle.ison)
  document.getElementById('cyclespeed').value = cycle.speed
  document.getElementById('cycleeffect').value = cycle.effect
}

function UpdateColorBar (data) {
  document.getElementById('colorbar').style.background = '#' + data.color.hex
  // document.getElementById('logo').style.stroke = "#"+data.ColorVals.CurrentHEX;
  document.getElementById('R').style.fill = 'rgb(' + data.color.rgb.r + ', 0, 0)'
  document.getElementById('R').style.stroke = 'rgb(' + data.color.rgb.r + ', 0, 0)'
  document.getElementById('G').style.fill = 'rgb(0,' + data.color.rgb.g + ',0)'
  document.getElementById('G').style.stroke = 'rgb(0,' + data.color.rgb.g + ',0)'
  document.getElementById('B').style.fill = 'rgb(0,0,' + data.color.rgb.b + ')'
  document.getElementById('B').style.stroke = 'rgb(0,0,' + data.color.rgb.b + ')'
}

function UpdateColorValsInput (c) {
  document.getElementById('r').value = c.rgb.r
  document.getElementById('g').value = c.rgb.g
  document.getElementById('b').value = c.rgb.b
  document.getElementById('hex').value = c.hex
}

function notification (message, status, pos, time) {
  UIkit.notification({
    message: message,
    status: status,
    pos: pos,
    timeout: time
  })
}

function clientevents (obj) {
  switch (obj.type) {
    case 'notification':
      notification(obj.message, obj.status, obj.pos, obj.time)
      break

    case 'restart':
      notification(obj.message, obj.status, obj.pos, obj.time)
      setTimeout(() => location.reload(), obj.time)
      break

    default:
      break
  }
}

function askdata () {
  const device = $('input[name=devices]:checked').attr('id')
  document.getElementById('logotext').innerHTML = device
  socket.emit('askdata', device)
}

// $(document).ready(function () {
//   console.log('ready')

// })
