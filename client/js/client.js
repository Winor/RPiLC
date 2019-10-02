let val = document.getElementById('rgbValue');
let joe = colorjoe.rgb('rgbPicker', "black")
let socket = io.connect();


function swichserver(ip) {
socket = io.connect("http://"+ip, {"force new connection": true});
logic();
}

let clientdata = {
  Version: "1.4.0",
  type: 'Client',
}

let ServerData;

let logic = function  () {

  socket.on('data', function(data) {
    ServerData = data;
    document.getElementById('info').innerHTML = "RPiLC client v" + clientdata.Version + " connected to " + document.getElementById('servip').value + " running server v" + data.Version;
    document.getElementById('servip').value = socket.io.engine.hostname;
    UpdateColorValsInput(data.ColorVals);
   joe.setnu(data.ColorVals.CurrentHEX);
   upcolors(data.SavedColors)
   UpdateColorBar(data);
   UpdateCycleMode(data.CycleMode);

 });

 socket.on('config', function(config) {
UpdateConfigUI(config);
});

socket.on('clientevent', function(obj) {
  clientevents(obj);
  });

 socket.on('updatecolor', function(c) {
   ServerData.ColorVals = c;
   joe.setnu(c.CurrentHEX);
   UpdateColorBar(ServerData);
   UpdateColorValsInput(c);
 });

 socket.on('CycleSync', function(CycleMode) {
   UpdateCycleMode(CycleMode);
 });

 socket.on('SaveColor', function(SavedColors) {
   ServerData.SavedColors = SavedColors;
   upcolors(SavedColors)
 });

 socket.on('updates', function(updateinfo) {
  UpdateUpdatesUI(updateinfo)
 
});

}

joe.on('change', function(c) {
  let data ={
  ColorVals: {
  CurrentRGB: {
    r:Math.round(255 * c.red()),
    g: Math.round(255 * c.green()),
    b: Math.round(255 * c.blue())
  },
  CurrentHEX: c.hex().replace(/#/g, '')
}
}

  UpdateColorBar(data);
  socket.emit('change', data.ColorVals.CurrentRGB);
})

joe.on('done', function(c) {
  emitcolor(c.hex());
});

function emitcolor(color) {
  socket.emit('done', color);
}



function setrgbval() {
  emitcolor({
    r: document.getElementById('r').value,
    g: document.getElementById('g').value,
    b: document.getElementById('b').value
  });
}

function sethexval() {
  emitcolor(document.getElementById('hex').value);
}

function togglestate() {
  socket.emit('togglestate');
};

function fade() {
  let CycleMode = {
    state: document.getElementById("CycleState").checked, // true / false
    colors: Object.values(cylclr),
    speed: document.getElementById("cyclespeed").value,
    effect: document.getElementById("cycleeffect").value
  }
  socket.emit('cycle', CycleMode);
};

function UpdateConfigUI(config) {
  if (config.AutoGen) {
    UIkit.modal("#config").show();
    document.getElementById('welcome').innerHTML= "Welcome to RPiLC - Install";
    document.getElementById('close0').style.visibility = "hidden";
    document.getElementById('close1').style.visibility = "hidden"; 
  }
  document.getElementById('rp').value = config.gpio_pin.red;
  document.getElementById('gp').value = config.gpio_pin.green;
  document.getElementById('bp').value = config.gpio_pin.blue;
  document.getElementById('serverport').value = config.server_settings.webserverport;
  $('#debug').prop('checked', config.server_settings.debug);
  document.getElementById('startupcolor').value = config.RPiLC_settings.startupcolor;
  document.getElementById('oncolor').value = config.RPiLC_settings.on_color;
}

function config() {
  let config = {}
  config.red = document.getElementById('rp').value
  config.green = document.getElementById('gp').value
  config.blue = document.getElementById('bp').value
  config.port = document.getElementById('serverport').value
  config.debug = document.getElementById("debug").checked;
  config.startcolor = document.getElementById('startupcolor').value
  config.oncolor = document.getElementById('oncolor').value
  socket.emit('config', config);
}

function UpdateCycleMode(CycleMode) {
  UpdateColorCycleListUI(CycleMode.colors);
  $('#CycleState').prop('checked', CycleMode.state);
  document.getElementById("cyclespeed").value = CycleMode.speed;
  document.getElementById("cycleeffect").value = CycleMode.effect;

}

function UpdateColorBar(data){
 document.getElementById('colorbar').style.background = "#"+data.ColorVals.CurrentHEX;
  // document.getElementById('logo').style.stroke = "#"+data.ColorVals.CurrentHEX;
  document.getElementById('R').style.fill = "rgb(" + data.ColorVals.CurrentRGB.r+", 0, 0)";
  document.getElementById('R').style.stroke = "rgb(" + data.ColorVals.CurrentRGB.r+", 0, 0)";
  document.getElementById('G').style.fill = "rgb(0,"+ data.ColorVals.CurrentRGB.g+ ",0)";
  document.getElementById('G').style.stroke = "rgb(0,"+ data.ColorVals.CurrentRGB.g+ ",0)";
  document.getElementById('B').style.fill = "rgb(0,0," + data.ColorVals.CurrentRGB.b+ ")";
  document.getElementById('B').style.stroke = "rgb(0,0," + data.ColorVals.CurrentRGB.b+ ")";
}

function UpdateColorValsInput(c) {
  document.getElementById('r').value = c.CurrentRGB.r;
  document.getElementById('g').value = c.CurrentRGB.g;
  document.getElementById('b').value = c.CurrentRGB.b;
  document.getElementById('hex').value = c.CurrentHEX;
}

function notification(message,status,pos,time) {
  UIkit.notification({
    message: message,
    status: status,
    pos: pos,
    timeout: time
});
}

function clientevents(obj) {
  switch (obj.type) {
    case 'notification':
      notification(obj.message, obj.status, obj.pos, obj.time)
      break;

      case 'restart':
        notification(obj.message, obj.status, obj.pos, obj.time)
        setTimeout(() => location.reload(), obj.time);
        break;
  
    default:
      break;
  }
}

function UpdateUpdatesUI(updateinfo) {
  switch (updateinfo.update) {
    case 'checking':
      document.getElementById('updates').innerHTML = "<article class=\"uk-article uk-text-center\">\r\n<h1 class=\"uk-article-title\"><a class=\"uk-link-reset\" href=\"\">Cheaking for updates...<\/a><\/h1>\r\n<div class=\"uk-margin\" uk-spinner=\"ratio: 5\"><\/div>\r\n<\/article>"
      break;
    case false:
      document.getElementById('updates').innerHTML = "<article class=\"uk-article uk-text-center\">\r\n<h1 class=\"uk-article-title\"><a class=\"uk-link-reset\" href=\"\">You are on the latest version<\/a><\/h1>\r\n<span class=\"uk-margin\" uk-icon=\"icon: check; ratio: 10\"><\/span>\r\n<button onclick=\"socket.emit(\'checkforupdates\')\" class=\"uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom\">Cheak for updates<\/button>\r\n<\/article>"
      break;

      case true:
          document.getElementById('updates').innerHTML = "<article class=\"uk-article uk-text-center\">\r\n<h1 class=\"uk-article-title\"><a class=\"uk-link-reset\" href=\"\">new update available<\/a><\/h1>\r\n<span class=\"uk-label\">"+ updateinfo.version + "<\/span>\r\n<p style=\"white-space: pre-line\">" + updateinfo.updateinfo +"<\/p>\r\n<button onclick=\"socket.emit(\'update\')\" class=\"uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom\">Install<\/button>\r\n<\/article>"

        break;

        case 'installing':
           document.getElementById('updates').innerHTML = "<article class=\"uk-article uk-text-center\">\r\n<h1 class=\"uk-article-title\"><a class=\"uk-link-reset\" href=\"\">Installing updates...<\/a><\/h1>\r\n<div class=\"uk-margin\" uk-spinner=\"ratio: 5\"><\/div>\r\n<\/article>"
            break;
  
    default:
      break;
  }
}



console.log('ready');
logic();
