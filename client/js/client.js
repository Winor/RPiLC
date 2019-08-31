let val = document.getElementById('rgbValue');
let joe = colorjoe.rgb('rgbPicker', "black")
let socket = io.connect();


function swichserver(ip) {
socket = io.connect("http://"+ip, {"force new connection": true});
logic();
}

let clientdata = {
  Version: "1.0.0",
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

function UpdateUIelements() {



}

function UpdateCycleMode(CycleMode) {
  UpdateColorCycleListUI(CycleMode.colors);
  $('#CycleState').prop('checked', CycleMode.state);
  console.log(CycleMode.speed);
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


console.log('ready');
logic();
