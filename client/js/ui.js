fixScale(document)

CycleState.onclick = function () {
  event.stopPropagation()
  fade()
}

theme.onchange = function () {
  const th = document.getElementById('theme').value
  localStorage.setItem('theme', th)
  ui.settheme.apply(null, themes[th])
}

filter.onchange = function () {
  console.log('lolo')
  const th = document.getElementById('filter').value
  localStorage.setItem('filter', th)
}

const ui = {
  updatedevicelist: function (list) {
    document.getElementById('devicelist').innerHTML = ''
    let i = 0
    let name = ''
    list.forEach(device => {
      if (clientdata.devnames[i] !== null) {
        name = clientdata.devnames[i]
      } else {
        name = device
      }
      const htmz = `<li><div class="uk-grid-small uk-child-width-auto uk-grid"><div><input  onclick = "askdata()" class="uk-radio logotext" id="${device}" type="radio" name="devices" ${(i === 0) ? 'checked' : ''}/> <label for="${device}">${name}</label></div></div></li>`
      devicelist.insertAdjacentHTML('beforeend', htmz)
      i++
    })
  },
  updatecolortext: function (c) {
    document.getElementById('r').value = c.rgb.r
    document.getElementById('g').value = c.rgb.g
    document.getElementById('b').value = c.rgb.b
    document.getElementById('hex').value = c.hex
  },
  updatedevicetext: function (data) {
    document.getElementById('oncolor').value = data.oncolor
    if (data.name === undefined) {
      document.getElementById('name').value = data.id
    } else {
      document.getElementById('name').value = data.name
    }
    document.getElementById('group').value = data.group
    document.getElementById('dinfo').innerHTML = `<table class="uk-table uk-table-small">
  <tbody>
  <tr>
  <td class="uk-width-small"><label class="uk-margin-small-right">Device Name:</label></td>
  <td><h5>${data.name} </h3></td>
  </tr>
  <tr>
  <td class="uk-width-small"><label class="uk-margin-small-right">ID:</label></td>
  <td><h5>${data.id} </h3></td>
  </tr>
  <tr>
  <td class="uk-width-small"><label class="uk-margin-small-right">Running on:</label></td>
  <td><h5>${data.hardware} </h3></td>
  </tr>
  </tbody>
  </table>`
  },
  updatesavedcolors: function (list) {
    document.getElementById('resentcolorui').innerHTML = ''
    let y = -1
    const cylclrx = {}
    for (let i = 0; i < list.length; i++) {
      y++
      cylclrx[i] = list[i]
      this.addupcolors(y)
      document.getElementById('cs' + i).style.background = list[i]
    }
  },
  addupcolors: function (y) {
    const htmz = '<div class="uk-animation-fade" onclick = "setarecentcolor()" id="color' + y + 'dv"> <input type="radio" id="color' + y + '" name="cselectui"/> <label onclick = "event.stopPropagation()" id="cs' + y + '" for="color' + y + '"></label></div>'
    resentcolorui.insertAdjacentHTML('beforeend', htmz)
  },
  updatecolorbar: function (data) {
    document.getElementById('colorbar').style.background = '#' + data.color.hex
    // document.getElementById('logo').style.stroke = "#"+data.ColorVals.CurrentHEX;
    document.getElementById('R').style.fill = 'rgb(' + data.color.rgb.r + ', 0, 0)'
    document.getElementById('R').style.stroke = 'rgb(' + data.color.rgb.r + ', 0, 0)'
    document.getElementById('G').style.fill = 'rgb(0,' + data.color.rgb.g + ',0)'
    document.getElementById('G').style.stroke = 'rgb(0,' + data.color.rgb.g + ',0)'
    document.getElementById('B').style.fill = 'rgb(0,0,' + data.color.rgb.b + ')'
    document.getElementById('B').style.stroke = 'rgb(0,0,' + data.color.rgb.b + ')'
  },
  updatecyclemode: function (cycle) {
    this.updatecyclecolors(cycle.colors)
    // $('#CycleState').prop('checked', cycle.ison)
    CycleState.checked = cycle.ison
    document.getElementById('cyclespeed').value = cycle.speed
    document.getElementById('cycleeffect').value = cycle.effect
  },
  updatecyclecolors: function (list) {
    let x = -1
    document.getElementById('CycleStatecui').innerHTML = ''
    window.cylclr = {}
    for (let i = 0; i < list.length; i++) {
      x++
      cylclr[i] = list[i]
      this.addcolor(x)
      document.getElementById('c' + i).style.background = list[i]
    }
  },
  removerow: function (el) {
    event.stopPropagation()
    el.closest('#row').remove()
  },
  addrow: function (r = 0, g = 0, b = 0) {
    const html = `<div id="row" class="uk-grid-small uk-margin uk-card uk-card-secondary" uk-grid>
    <div class="uk-width-1-4@s">
    <label class="uk-form-label" for="rp">Red pin:</label>
    <input name="red" class="uk-input uk-form-width-xsmall uk-form-small" type="text" value="${r}" placeholder="17">
     </div>

     <div class="uk-width-1-4@s">
    <label class="uk-form-label" for="gp">Green pin:</label>
    <input name="green" class="uk-input uk-form-width-xsmall uk-form-small" type="text" value="${g}" placeholder="24">
  </div>

     <div class="uk-width-1-4@s">
    <label class="uk-form-label" for="bp">Blue pin:</label>
    <input name="blue" class="uk-input uk-form-width-xsmall uk-form-small" type="text" value="${b}" placeholder="22">
  </div>

  <button onclick="ui.removerow(this)" class="uk-button uk-light uk-button-default uk-button-small">remove</button>
  
</div>`
    iopins.insertAdjacentHTML('beforeend', html)
  },
  getpindata: function () {
    const inputs = iopins.getElementsByTagName('input')
    let i = 0
    const whole = []
    let part = { RGB: {} }
    for (const value of Object.values(inputs)) {
      i++
      part.RGB[value.name] = value.value
      if (Number.isInteger(i / 3)) {
        whole.push(part)
        part = { RGB: {} }
      }
    }
    return whole
  },
  updateconfig: function (config) {
    if (config.AutoGen) {
      UIkit.modal('#config').show()
      document.getElementById('welcome').innerHTML = 'Welcome to RPiLC - Setup'
      document.getElementById('close0').style.visibility = 'hidden'
      document.getElementById('close1').style.visibility = 'hidden'
    }
    document.getElementById('serverport').value = config.server_settings.webserverport
    debug.checked = config.server_settings.debug
    gpio.checked = config.server_settings.gpio
    thinsiodevices.checked = config.server_settings.thinsiodevices
    mqtt.checked = config.server_settings.mqtt
    document.getElementById('rserverurl').value = config.remote_settings.serverurl
    document.getElementById('smode').value = config.server_settings.mode
    document.getElementById('info').innerHTML = 'RPiLC Version 2.1.4'
  },
  addcolor: function (x) {
    if (x === undefined) {
      x = serverdata[selectedevice()].savedcolors.length + 2
    }
    const htmz = '<div id="radio' + x + 'dv"> <input type="radio" id="radio' + x + '" name="selectui"/> <label id="c' + x + '" for="radio' + x + '"></label></div>'
    CycleStatecui.insertAdjacentHTML('beforeend', htmz)
  },
  removecolor: function () {
    const thebtn = document.querySelector('input[name=selectui]:checked')
    const thebtnnum = thebtn.id.replace(/\D/g, '')
    console.log(thebtnnum)
    delete cylclr[thebtnnum]
    thebtn.remove()
  },
  setcolor: function () {
    const thebtn = document.querySelector('input[name=selectui]:checked')
    const thebtnnum = thebtn.id.replace(/\D/g, '')
    const device = selectedevice()
    cylclr[thebtnnum] = '#' + serverdata[device].color.hex
    document.getElementById('c' + thebtnnum).style.background = '#' + serverdata[device].color.hex
  },
  settheme: function (bg, sec, btn, hover, checked) {
    document.documentElement.style.setProperty('--bg-color', '#' + bg)
    document.documentElement.style.setProperty('--sec-bg-color', '#' + sec)
    document.documentElement.style.setProperty('--btn-color', '#' + btn)
    document.documentElement.style.setProperty('--btn-hover-color', '#' + hover)
    document.documentElement.style.setProperty('--btn-checked-color', '#' + checked)
  },
  clientnotification: function ({ type = 'notification', msg, status = 'danger', pos = 'top-center', time = 6000 }) {
    switch (type) {
      case 'notification':
        notification(msg, status, pos, time)
        break

      case 'restart':
        notification('Restarting Server...', status, pos, time)
        setTimeout(() => location.reload(), 6000)
        break

      default:
        break
    }
  },
  updates: function (updateinfo) {
    switch (updateinfo.update) {
      case 'checking':
        document.getElementById('updates').innerHTML = '<article class="uk-article uk-text-center">\r\n<h1 class="uk-article-title"><a class="uk-link-reset" href="">Cheaking for updates...<\/a><\/h1>\r\n<div class="uk-margin" uk-spinner="ratio: 5"><\/div>\r\n<\/article>'
        break
      case false:
        document.getElementById('updates').innerHTML = "<article class=\"uk-article uk-text-center\">\r\n<h1 class=\"uk-article-title\"><a class=\"uk-link-reset\" href=\"\">You are on the latest version<\/a><\/h1>\r\n<span class=\"uk-margin\" uk-icon=\"icon: check; ratio: 10\"><\/span>\r\n<button onclick=\"socket.emit(\'checkforupdates\')\" class=\"uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom\">Cheak for updates<\/button>\r\n<\/article>"
        break

      case true:
        document.getElementById('updates').innerHTML = '<article class="uk-article uk-text-center">\r\n<h1 class="uk-article-title"><a class="uk-link-reset" href="">new update available<\/a><\/h1>\r\n<span class="uk-label">' + updateinfo.version + '<\/span>\r\n<p style="white-space: pre-line">' + updateinfo.updateinfo + "<\/p>\r\n<button onclick=\"socket.emit(\'update\')\" class=\"uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom\">Install<\/button>\r\n<\/article>"

        break

      case 'installing':
        document.getElementById('updates').innerHTML = '<article class="uk-article uk-text-center">\r\n<h1 class="uk-article-title"><a class="uk-link-reset" href="">Installing updates...<\/a><\/h1>\r\n<div class="uk-margin" uk-spinner="ratio: 5"><\/div>\r\n<\/article>'
        break

      default:
        break
    }
  }
}

const themes = {
  default: ['1d1d1d', '282828', '272727', '353535', '424242'],
  purple: ['14161e', '232531', '373b4f', '353535', '424242'],
  blue: ['121124', '16304d', '104077', '102135', '0e1c2d'],
  kermit: ['062209', '1d4f0f', '407b04', '353535', '424242'],
  green: ['09150d', '183e25', '1a512d', '153520', '13331e'],
  red: ['1a0606', '4d1616', '792020', '400', '790909']
}

if (localStorage.getItem('theme') !== null) {
  const theme = localStorage.getItem('theme')
  ui.settheme.apply(null, themes[theme])
  document.getElementById('theme').value = theme
}

function notification (message, status, pos, time) {
  UIkit.notification({
    message: message,
    status: status,
    pos: pos,
    timeout: time
  })
}

function hasTouch () {
  return 'ontouchstart' in document.documentElement ||
         navigator.maxTouchPoints > 0 ||
         navigator.msMaxTouchPoints > 0
}

if (hasTouch()) {
  try {
    for (var si in document.styleSheets) {
      var styleSheet = document.styleSheets[si]
      if (!styleSheet.rules) continue

      for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
        if (!styleSheet.rules[ri].selectorText) continue

        if (styleSheet.rules[ri].selectorText.match(':hover')) {
          styleSheet.deleteRule(ri)
        }
      }
    }
  } catch (ex) {}
}
