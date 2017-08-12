fixScale(document);

var val = document.getElementById('rgbValue');
var socket = io.connect();
var hexi;
var hardset;
var fadeoff;
var joe = colorjoe.rgb('rgbPicker', nowcolor)
socket.on('hex', function(hexs) {
  var newhex = hexs.hex;
//  console.log('connact! ' + newhex)
  joe.set(newhex);
});

joe.on('change', function(c) {
  hexi = c.hex();
  val.innerHTML = c.css();
  var cred = Math.round(255 * c.red());
  var cgreen = Math.round(255 * c.green());
  var cblue = Math.round(255 * c.blue());

//  console.log('R:' + cred + ' G:' + cgreen + ' B:' + cblue);



  //socket io
  socket.emit('color', {
    red: cred,
    green: cgreen,
    blue: cblue
  });



}).update();

joe.on('done', function(c) {
//  console.log('I am Done.');
  var chex = c.hex();
  socket.emit('hex', {
    hex: chex
  });

  socket.on('hex', function(hexs) {
    var newhex = hexs.hex;
//    console.log('new! ' + newhex)
    joe.set(newhex);
  });




});

hardset = function(r, g, b) {
    console.log('rgb(' + r + ',' + g + ',' + b + ')');
    joe.set('rgb(' + r + ',' + g + ',' + b + ')');
    socket.emit('hex', {
      hex: hexi
    });
  };

fadeoff = function (r, g, b){
  do {
  rz =  Math.max(0, r--);
  gz =  Math.max(0, g--);
  bz =  Math.max(0, b--);
  retur('rgb(' + rz + ',' + gz + ',' + bz + ')');
  console.log(rz +' '+ gz +' ' + bz);
} while (rz,gz,bz > 0);

};

console.log('hi');
