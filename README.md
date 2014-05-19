# Chrome Gesture Control

This is an experimental Chrome extension for scrolling web pages by gesturing in from of your webcam. It's based on
gesture.js, which tries to do a good job of gesture detection with the 2D camera built into most laptops these days.

![Chrome Gesture Control screenshot](https://raw.githubusercontent.com/daveross/chrome-gesture-control/master/screenshot-1.png)

## Installation

Download the extension or clone this repo somewhere on your computer. Open Chrome's
["extensions" screen](chrome://extensions) and check the box to enable "Developer Mode". Pick
"Load unpacked extension…", then select the directory with the chrome-gesture-control files.

## Usage

Chrome extensions aren't allowed to constantly access the webcam for privacy reasons, so you'll be prompted for
permission to use the webcam every time you load a page in the browser. A window in the top-right of the page will
show what your webcam sees. Gesture up, down, left, or right to scroll 600px in that direction.

Two hands can be used to scroll up or down by 1200px, but detection is kind of flaky.

## Author & Credits

This extension was written by Dave Ross ([dave@davidmichaelross.com](mailto:dave@davidmichaelross.com)), based on the
following open source contributions:

* [jQuery Easing](http://gsgd.co.uk/sandbox/jquery/easing/) by George McGinley Smith
* [gesture.js](https://github.com/willy-vvu/reveal.js/blob/master/js/gesture.js) from William Wu's [gesture-driven fork
of reveal.js](http://www.chromeexperiments.com/detail/gesture-based-revealjs/)

## License

* jQuery Easing was released under the BSD License.
* gesture.js is part of a reveal.js fork and inherits its MIT license.
* All original code is released under the [MIT license](http://daveross.mit-license.org/). Please use it to build cool
things. Pull requests are encouraged.
