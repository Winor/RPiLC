fixScale(document);

var val = document.getElementById('rgbValue');
var socket = io.connect();

var joe = colorjoe.rgb('rgbPicker', nowcolor)
socket.on('hex', function(hexs) {
    var newhex = hexs.hex;
    console.log('connact! ' + newhex)
    joe.set(newhex);
});

joe.on('change', function(c) {
    val.innerHTML = c.css();
    var cred = Math.round(255 * c.red());
    var cgreen = Math.round(255 * c.green());
    var cblue = Math.round(255 * c.blue());

    console.log('R:' + cred + ' G:' + cgreen + ' B:' + cblue);



    //socket io
    socket.emit('color', {
        red: cred,
        green: cgreen,
        blue: cblue
    });



}).update();

joe.on('done', function(c) {
    console.log('I am Done.');
    var chex = c.hex();
    socket.emit('hex', {
        hex: chex
    });

    socket.on('hex', function(hexs) {
        var newhex = hexs.hex;
        console.log('new! ' + newhex)
        joe.set(newhex);
    });




})
