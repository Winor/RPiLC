fixScale(document)
$('input:checkbox').on('click', function () {
  const $box = $(this)
  if ($box.is(':checked')) {
    const group = "input:checkbox[name='" + $box.attr('name') + "']"
    $(group).prop('checked', false)
    $box.prop('checked', true)
    fade()
  } else {
    $box.prop('checked', false)
    fade()
  }
})

// color cycle select  UI
let x = 4
let y = 4
let cylclr = {}
let cylclrx = {}

function addcolor () {
  x++
  const htmz = '<div id="radio' + x + 'dv"> <input type="radio" id="radio' + x + '" name="selectui"/> <label id="c' + x + '" for="radio' + x + '"></label></div>'
  $('#CycleStatecui').append(htmz)
}

function removecolor () {
  const thebtn = $('input[name=selectui]:checked').attr('id')
  const thebtnnum = thebtn.replace(/\D/g, '')
  delete cylclr[thebtnnum]
  $('#radio' + thebtnnum + 'dv').remove()
}

function setcolor () {
  const thebtn = $('input[name=selectui]:checked').attr('id')
  const thebtnnum = thebtn.replace(/\D/g, '')
  cylclr[thebtnnum] = '#' + ServerData.color.hex
  document.getElementById('c' + thebtnnum).style.background = '#' + ServerData.color.hex
}

function UpdateColorCycleListUI (list) {
  $('#CycleStatecui').html(' ')
  x = -1
  cylclr = {}
  for (i = 0; i < list.length; i++) {
    cylclr[i] = list[i]
    addcolor()
    document.getElementById('c' + i).style.background = list[i]
  }
}

function addupcolors () {
  y++
  const htmz = '<div onclick = "SetcolorFromList()" id="color' + y + 'dv"> <input type="radio" id="color' + y + '" name="cselectui"/> <label id="cs' + y + '" for="color' + y + '"></label></div>'
  $('#resentcolorui').append(htmz)
}

function UpdateUpdatesUI (updateinfo) {
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

function upcolors (list) {
  $('#resentcolorui').html(' ')
  y = -1
  cylclrx = {}
  for (i = 0; i < list.length; i++) {
    cylclrx[i] = list[i]
    addupcolors()
    document.getElementById('cs' + i).style.background = list[i]
  }
}

function SetcolorFromList () {
  const thebtn = $('input[name=cselectui]:checked').attr('id')
  const thebtnnum = thebtn.replace(/\D/g, '')
  emitcolor(ServerData.savedcolors[thebtnnum])
}

function updatedevicelist (list) {
  $('#devicelist').html(' ')
  let i = 1
  list.forEach(device => {
    let htmz = `<li><div class="uk-grid-small uk-child-width-auto uk-grid"><div><input  onclick = "askdata()" class="uk-radio logotext" id="${device}" type="radio" name="devices" ${(i === 1) ? 'checked' : ''}/> <label for="${device}">${device}</label></div></div></li>`
    $('#devicelist').append(htmz)
    i++
  });

}