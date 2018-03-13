fixScale(document);

let val = document.getElementById('rgbValue');
let socket = io.connect();
let joe = colorjoe.rgb('rgbPicker', nowcolor)

socket.on('data', function(data) {
  joe.setnu(data.ColorVals.CurrentHEX);
  $('#colorsetseti').prop('checked', data.CycleMode.state);
  for (i = 0; i < data.CycleMode.colors.length; i++) {
    document.getElementById("c" + [i + 1]).value = data.CycleMode.colors[i];
  }
});

socket.on('updatecolor', function(c) {
  joe.setnu(c.CurrentHEX);
});

function colorselect(mana) {
  console.log(mana);
  document.getElementById(mana).value = hexi;
};

socket.on('CycleSync', function(CycleMode) {
  let cmode = CycleMode.state;
  let cctf = CycleMode.colors;
  console.log(cmode);
  $('#colorsetseti').prop('checked', cmode);
  document.getElementById("c1").value = cctf[0];
  document.getElementById("c2").value = cctf[1];
  document.getElementById("c3").value = cctf[2];
  document.getElementById("c4").value = cctf[3];
});

joe.on('change', function(c) {
  console.log("cng");
  hexi = c.hex();
  val.innerHTML = c.css();
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
  console.log("done");
  socket.emit('done', c.hex());
});

function turnoff() {
  $('#colorsetseti').prop('checked', false).change();
  socket.emit('done', "black");
};

function fade() {
  let CycleMode = {
    state: document.getElementById("colorsetseti").checked, // true / false
    colors: [],
    speed: 8000
  }
  CycleMode.colors.push(document.getElementById("c1").value);
  CycleMode.colors.push(document.getElementById("c2").value);
  CycleMode.colors.push(document.getElementById("c3").value);
  CycleMode.colors.push(document.getElementById("c4").value);
  console.log(CycleMode);
  socket.emit('cycle', CycleMode);
};

console.log('ready');
