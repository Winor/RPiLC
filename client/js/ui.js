fixScale(document)
// $('input:checkbox').on('click', function () {
//   const $box = $(this)
//   if ($box.is(':checked')) {
//     const group = "input:checkbox[name='" + $box.attr('name') + "']"
//     $(group).prop('checked', false)
//     $box.prop('checked', true)
//     fade()
//   } else {
//     $box.prop('checked', false)
//     fade()
//   }
// })

CycleState.onclick = function () {
  event.stopPropagation()
  fade()
}

theme.onchange = function () {
  const th = document.getElementById('theme').value
  localStorage.setItem('theme', th)
  ui.settheme.apply(null, themes[th])
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
      console.log(name)
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
    document.getElementById('name').value = data.name
    document.getElementById('group').value = data.group
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
  }

}

const themes = {
  default: ['1d1d1d', '282828', '272727', '353535', '424242'],
  purple: ['14161e', '232531', '2c2179', '353535', '424242'],
  blue: ['121124', '16304d', '222079', '353535', '424242']
}

if (localStorage.getItem('theme') !== null) {
  let theme = localStorage.getItem('theme')
  ui.settheme.apply(null, themes[theme])
  document.getElementById('theme').value = theme
}
