(function (window, undefined) {

    window.gestureControlInteractions = window.gestureControlInteractions || function () {
    };

    window.gestureControlInteractions.easing = window.gestureControlInteractions.easing || {};

    window.gestureControl = window.gestureControl || function () {
    };
    window.gestureControl.callbacks = window.gestureControl.callbacks || {};

    window.gestureControl.callbacks['up'] = function () {
        scrollWindow(0, -600);
    };

    window.gestureControl.callbacks['down'] = function () {
        scrollWindow(0, 600);
    };

    window.gestureControl.callbacks['over_up'] = function () {
        scrollWindow(0, -1200);
    };

    window.gestureControl.callbacks['over_down'] = function () {
        scrollWindow(0, 1200);
    };

    window.gestureControl.callbacks['left'] = function () {
        scrollWindow(-600, 0);
    };

    window.gestureControl.callbacks['right'] = function () {
        scrollWindow(600, 0);
    };

    console.log('defined handlers');
    console.log(window.gestureControl);

    /**
     * @see http://stackoverflow.com/a/11215056
     * @param x
     * @param y
     * @param step
     * @param interval
     */
    function scrollWindow(targetX, targetY) {

        var scrolledSoFar = { x: 0, y: 0 };
        var target = { x: targetX, y: targetY };

        var animationStartTime = Date.now();
        var scrollStart = { x: document.documentElement.scrollLeft, y: document.documentElement.scrollTop };

        (function animloop(){
            if (/*scrolledSoFar.x >= target.x &&*/ scrolledSoFar.y >= Math.abs(target.y)) {
                return;
            }

            requestAnimationFrame(animloop);
            render();
        })();

        function render() {
            var scrollAmount;

            if (scrolledSoFar.y < Math.abs(target.y)) {

                // t: current time, b: begInnIng value, c: change In value, d: duration
                scrollAmount = window.gestureControlInteractions.easing.easeInQuad(
                    null,
                    Date.now() - animationStartTime,
                    scrollStart.y,
                    target.y,
                    1.5 * 1000
                );

                window.scrollBy(0, Math.ceil(scrollAmount));
                scrolledSoFar.y += Math.abs(Math.ceil(scrollAmount));

            }

        }

    }

    console.log('interact.js initialized');

})(window);