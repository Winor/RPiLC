let val = document.getElementById('rgbValue');
let joe = colorjoe.rgb('rgbPicker', "black")
let socket = io.connect();
logic();

function swichserver(ip) {
socket = io.connect("http://"+ip, {"force new connection": true});
logic();
}

let clientdata = {
  Version: "0.1.5",
  type: 'Client',
  ColorVals: {
    CurrentHEX: '000000',
    CurrentRGB: {
      r: 0,
      g: 0,
      b: 0
    },
    CurrentCName: 'black'
  }
}

function logic () {
  document.getElementById('servip').value = socket.io.engine.hostname;
  socket.on('data', function(data) {
    clientdata.ColorVals = data.ColorVals;
    updatevalsinput(data.ColorVals);
   joe.setnu(data.ColorVals.CurrentHEX);
   document.getElementById('colorbar').style.background = "#"+data.ColorVals.CurrentHEX;
   $('#CycleState').prop('checked', data.CycleMode.state);
   upcolorslist(data.CycleMode.colors);
 });

 socket.on('updatecolor', function(c) {
   clientdata.ColorVals = c;
   updatevalsinput(c);
   document.getElementById('colorbar').style.background = "#"+c.CurrentHEX;
   joe.setnu(c.CurrentHEX);
 });

 socket.on('CycleSync', function(CycleMode) {
   $('#CycleState').prop('checked', CycleMode.state);
   upcolorslist(CycleMode.colors);
 });
}

joe.on('change', function(c) {
  document.getElementById('colorbar').style.background = c.hex();
  let cred = Math.round(255 * c.red());
  let cgreen = Math.round(255 * c.green());
  let cblue = Math.round(255 * c.blue());
  socket.emit('change', {
    r: cred,
    g: cgreen,
    b: cblue
  });
})

joe.on('done', function(c) {
  emitcolor(c.hex());
});

function emitcolor(color) {
  socket.emit('done', color);
}

function updatevalsinput(c) {
  document.getElementById('r').value = c.CurrentRGB.r;
  document.getElementById('g').value = c.CurrentRGB.g;
  document.getElementById('b').value = c.CurrentRGB.b;
  document.getElementById('hex').value = c.CurrentHEX;
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

function turnoff() {
  $('#CycleState').prop('checked', false).change();
  fade();
  socket.emit('done', "black");
};

function fade() {
  let CycleMode = {
    state: document.getElementById("CycleState").checked, // true / false
    colors: Object.values(cylclr),
    speed: 8000
  }
  socket.emit('cycle', CycleMode);
};

console.log('ready');
