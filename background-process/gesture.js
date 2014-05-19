(function ( window, undefined ) {

    window.gestureControl = window.gestureControl || function() {};
    window.gestureControl.callbacks = window.gestureControl.callbacks || {
        up: function() {},
        down: function() {},
        left: function() {},
        right: function() {},
        over_up: function() {},
        over_down: function() {}
    };

    var video = document.createElement('video');
    video.setAttribute('id', 'video');
    video.setAttribute('autoplay', '');
    video.setAttribute('width', '300');
    video.style.display = 'none';
    document.body.appendChild(video);

    var canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'canvas');
    canvas.setAttribute('width', '300');
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.right = 0;
//    canvas.style.display = 'none';
    document.body.appendChild(canvas);

    var _ = canvas.getContext('2d')
    var ccanvas = document.createElement('canvas');
    ccanvas.setAttribute('id', 'comp');
    var c_ = ccanvas.getContext('2d')
    navigator.webkitGetUserMedia({audio: true, video: true}, function (stream) {
        var s = stream
        video.src = window.webkitURL.createObjectURL(stream)
        video.addEventListener('play',
            function () {
                setInterval(dump, 1000 / 25)
            }
        )
    }, function () {
        console.log('OOOOOOOH! DEEEEENIED!')
    })
    var compression = 5;
    var width = 0, height = 0;
    var draw;

    function dump() {
        if (canvas.width != video.videoWidth) {
            width = Math.floor(video.videoWidth / compression)
            height = Math.floor(video.videoHeight / compression)
            canvas.width = ccanvas.width = width
            canvas.height = ccanvas.height = height
        }
        _.drawImage(video, width, 0, -width, height)
        draw = _.getImageData(0, 0, width, height)
        //c_.putImageData(draw,0,0)
        skinfilter();
        test();
    }

    var huemin = 0.0
    var huemax = 0.10
    var satmin = 0.0
    var satmax = 1.0
    var valmin = 0.4
    var valmax = 1.0

    function skinfilter() {

        var skin_filter = _.getImageData(0, 0, width, height)
        var total_pixels = skin_filter.width * skin_filter.height
        var index_value = total_pixels * 4

        var count_data_big_array = 0;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                index_value = x + y * width
                var r = draw.data[count_data_big_array]
                var g = draw.data[count_data_big_array + 1]
                var b = draw.data[count_data_big_array + 2]
                var a = draw.data[count_data_big_array + 3]

                var hsv = rgb2Hsv(r, g, b);
                //When the hand is too lose (hsv[0] > 0.59 && hsv[0] < 1.0)
                //Skin Range on HSV values
                if (((hsv[0] > huemin && hsv[0] < huemax) || (hsv[0] > 0.59 && hsv[0] < 1.0)) && (hsv[1] > satmin && hsv[1] < satmax) && (hsv[2] > valmin && hsv[2] < valmax)) {

                    skin_filter[count_data_big_array] = r
                    skin_filter[count_data_big_array + 1] = g
                    skin_filter[count_data_big_array + 2] = b
                    skin_filter[count_data_big_array + 3] = a
                } else {

                    skin_filter.data[count_data_big_array] =
                        skin_filter.data[count_data_big_array + 1] =
                            skin_filter.data[count_data_big_array + 2] = 0
                    skin_filter.data[count_data_big_array + 3] = 0
                }

                count_data_big_array = index_value * 4;
            }
        }
        draw = skin_filter
    }

    function rgb2Hsv(r, g, b) {

        r = r / 255
        g = g / 255
        b = b / 255;

        var max = Math.max(r, g, b)
        var min = Math.min(r, g, b);

        var h, s, v = max;

        var d = max - min;

        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return [h, s, v];
    }

    var last = false
    var thresh = 150
    var down = false
    var wasdown = false

    function test() {
        var delt = _.createImageData(width, height)
        if (last !== false) {
            var totalx = 0, totaly = 0, totald = 0, totaln = delt.width * delt.height
                , dscl = 0
                , pix = totaln * 4;
            while (pix -= 4) {
                var d = Math.abs(
                    draw.data[pix] - last.data[pix]
                ) + Math.abs(
                    draw.data[pix + 1] - last.data[pix + 1]
                ) + Math.abs(
                    draw.data[pix + 2] - last.data[pix + 2]
                )
                if (d > thresh) {
                    delt.data[pix] = 160
                    delt.data[pix + 1] = 255
                    delt.data[pix + 2] =
                        delt.data[pix + 3] = 255
                    totald += 1
                    totalx += ((pix / 4) % width)
                    totaly += (Math.floor((pix / 4) / delt.height))
                }
                else {
                    delt.data[pix] =
                        delt.data[pix + 1] =
                            delt.data[pix + 2] = 0
                    delt.data[pix + 3] = 0
                }
            }
        }
        //slide.setAttribute('style','display:initial')
        //slide.value=(totalx/totald)/width
        if (totald) {
            down = {
                x: totalx / totald,
                y: totaly / totald,
                d: totald
            }
            handleGesture();
        }
        //console.log(totald)
        last = draw
        c_.putImageData(delt, 0, 0)
    }

    var movethresh = 2
    var brightthresh = 300
    var overthresh = 1000
    function calibrate() {
        wasdown = {
            x: down.x,
            y: down.y,
            d: down.d
        }
    }

    var avg = 0
    var state = 0//States: 0 waiting for gesture, 1 waiting for next move after gesture, 2 waiting for gesture to end
    function handleGesture() {
        avg = 0.9 * avg + 0.1 * down.d
        var davg = down.d - avg, good = davg > brightthresh
        //console.log(davg)
        switch (state) {
            case 0:
                if (good) {//Found a gesture, waiting for next move
                    state = 1
                    calibrate()
                }
                break
            case 2://Wait for gesture to end
                if (!good) {//Gesture ended
                    state = 0
                }
                break;
            case 1://Got next move, do something based on direction
                var dx = down.x - wasdown.x, dy = down.y - wasdown.y;
                console.log(dx, dy);
                var dirx = Math.abs(dy) < Math.abs(dx)//(dx,dy) is on a bowtie
//                console.log(good,davg)
                if (dx < -movethresh && dirx) {
                    console.log('right');
                    window.gestureControl.callbacks.right.call();
                }
                else if (dx > movethresh && dirx) {
                    console.log('left')
                    window.gestureControl.callbacks.left.call();
                }
                if (dy > movethresh && !dirx) {
                    if (davg > overthresh) {
                        console.log('over up')
                        window.gestureControl.callbacks.toggleOverview.call();
                    }
                    else {
                        console.log('up')
                        window.gestureControl.callbacks.up.call();
                    }
                }
                else if (dy < -movethresh && !dirx) {
                    if (davg > overthresh) {
                        console.log('over down')
                        window.gestureControl.callbacks.toggleOverview.call();
                    }
                    else {
                        console.log('down');
                        window.gestureControl.callbacks.down.call();
                    }
                }
                state = 2
                break
        }
    }

    console.log('gesture.js initialized');
    return window.gestureControl;

})( window );