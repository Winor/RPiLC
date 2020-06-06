window.serverdata = {}
window.clientdata = {}

function docReady (fn) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(fn, 1)
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

docReady(function () {
  const joe = colorjoe.rgb('rgbPicker', 'black')
  const socket = io.connect()

  window.emit = function (action, data) {
    socket.emit(action, selectedevice(), data)
  }

  window.nemit = function (action, data) {
    socket.emit(action, data)
  }

  socket.on('connect', function () {
    if (localStorage.getItem('filter') === null) {
      localStorage.setItem('filter', 'ALL')
      socket.emit('askdevs', 'ALL')
      return
    }
    const group = localStorage.getItem('filter')
    socket.emit('askdevs', group)
    document.getElementById('filter').value = group
  })

  socket.on('devicelist', function (list) {
    clientdata.devnames = list[1]
    ui.updatedevicelist(list[0])
    askdata()
  })

  socket.on('data', function (data) {
    const device = selectedevice()
    if (data.id === device) {
      window.serverdata[device] = data
      devicename(data)
      ui.updatecolortext(data.color)
      ui.updatedevicetext(data)
      joe.setnu(data.color.hex)
      ui.updatesavedcolors(data.savedcolors)
      ui.updatecolorbar(data)
      ui.updatecyclemode(data.cycle)
    }
  })

  socket.on('updatecolor', function (c) {
    try {
      const device = selectedevice()
      serverdata[device].color = c.color
      if (c.id === device) {
        joe.setnu(c.color.hex)
        ui.updatecolorbar(c)
        ui.updatecolortext(c.color)
      }
    } catch (e) {

    }
  })

  socket.on('updatesaved', function (data) {
    const device = selectedevice()
    serverdata[device].savedcolors = data.savedcolors
    if (data.id === device) {
      ui.updatesavedcolors(data.savedcolors)
    }
  })

  socket.on('cycle', function (data) {
    if (data.id === selectedevice()) {
      ui.updatecyclemode(data.cycle)
    }
  })

  socket.on('config', function (data) {
    try {
      ui.updateconfig(data)
      document.getElementById('iopins').innerHTML = ''
      data.gpio.forEach(int => {
        ui.addrow.apply(null, Object.values(int.RGB))
      })
    } catch (e) {

    }
  })

  socket.on('updates', function (updateinfo) {
    ui.updates(updateinfo)
  })

  joe.on('change', function (c) {
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
    ui.updatecolorbar(data)
    emit('previewcolor', data.color.rgb)
  })

  joe.on('done', function (c) {
    emitcolor(c.hex())
  })
})

function emitcolor (color) {
  emit('setcolor', color)
}

function fadeone (color) {
  emit('fadeone', color)
}

function setoldcolor () {
  emit('setoldcolor')
}

function setoncolor () {
  emit('setoncolor')
}

function togglestate () {
  emit('togglestate')
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

function devicesetings () {
  emit('devicesetings', {
    name: document.getElementById('name').value,
    oncolor: document.getElementById('oncolor').value,
    group: document.getElementById('group').value
  })
}

function serversetings () {
  nemit('setconfig', {
    gpiopins: ui.getpindata(),
    mode: document.getElementById('smode').value,
    webserverport: document.getElementById('serverport').value,
    debug: debug.checked,
    gpio: gpio.checked,
    thinsiodevices: thinsiodevices.checked,
    mqtt: mqtt.checked,
    serverurl: document.getElementById('rserverurl').value,
    autogen: false
  })
  ui.clientnotification({ type: 'restart' })
}

function fade () {
  const cycle = {
    ison: document.getElementById('CycleState').checked, // true / false
    colors: Object.values(cylclr),
    speed: document.getElementById('cyclespeed').value,
    effect: document.getElementById('cycleeffect').value
  }
  emit('cycle', { ison: cycle.ison, colors: cycle.colors, effect: cycle.effect, speed: cycle.speed })
}

function setarecentcolor () {
  const thebtn = document.querySelector('input[name=cselectui]:checked')
  const thebtnnum = thebtn.id.replace(/\D/g, '')
  fadeone(serverdata[selectedevice()].savedcolors[thebtnnum])
}

function selectedevice () {
  try {
    const device = document.querySelector('input[name="devices"]:checked').id
    return device
  } catch (err) {
    return null
  }
}

function askdata () {
  emit('askdata')
}

function devicename (data) {
  if (data.name === undefined) {
    document.getElementById('logotext').innerHTML = data.id
    return
  }
  document.getElementById('logotext').innerHTML = data.name
}
