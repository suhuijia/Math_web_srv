/*!
 * jQuery sketchable | v1.6 | Luis A. Leiva | MIT license
 * This is a jQuery plugin for the jSketch drawing class.
 */
(function (g) {
    var j, e = "sketchable";
    var b = {
        init: function (k) {
            j = g.extend({}, g.fn.sketchable.defaults, k || {});
            return this.each(function () {
                var l = g(this), m = l.data(e);
                if (!m) {
                    var n = new jSketch(this, {
                        fillStyle: j.graphics.fillStyle,
                        strokeStyle: j.graphics.strokeStyle,
                        lineWidth: j.graphics.lineWidth,
                    });
                    n.isDrawing = false;
                    l.data(e, {strokes: [], coords: [], timestamp: new Date().getTime(), sketch: n});
                    if (j.interactive) {
                        l.bind("mousedown", h);
                        l.bind("mouseup", i);
                        l.bind("mousemove", f);
                        l.bind("touchstart", d);
                        l.bind("touchend", d);
                        l.bind("touchmove", d);
                        this.onselectstart = function () {
                            return false
                        }
                    }
                }
                if (typeof j.events.init === "function") {
                    j.events.init(l, l.data(e))
                }
            })
        }, strokes: function (k) {
            if (k) {
                return this.each(function () {
                    var m = g(this), n = m.data(e);
                    n.strokes = k
                })
            } else {
                var l = g(this).data(e);
                return l.strokes
            }
        }, handler: function (k) {
            return this.each(function () {
                var l = g(this), m = l.data(e);
                k(l, m)
            })
        }, clear: function () {
            return this.each(function () {
                var k = g(this), l = k.data(e);
                l.sketch.clear();
                l.strokes = [];
                if (typeof j.events.clear === "function") {
                    j.events.clear(k, l)
                }
            })
        }, reset: function (k) {
            return this.each(function () {
                var l = g(this), m = l.data(e);
                l.sketchable("destroy").sketchable(k);
                if (typeof j.events.reset === "function") {
                    j.events.reset(l, m)
                }
            })
        }, destroy: function () {
            return this.each(function () {
                var k = g(this), l = k.data(e);
                if (j.interactive) {
                    k.unbind("mousedown", h);
                    k.unbind("mouseup", i);
                    k.unbind("mousemove", f);
                    k.unbind("touchstart", d);
                    k.unbind("touchend", d);
                    k.unbind("touchmove", d)
                }
                k.removeData(e);
                if (typeof j.events.destroy === "function") {
                    j.events.destroy(k, l)
                }
            })
        }
    };
    g.fn.sketchable = function (k) {
        if ("methods functions hooks".split(" ").indexOf(k) > -1) {
            return b
        } else {
            if (b[k]) {
                return b[k].apply(this, Array.prototype.slice.call(arguments, 1))
            } else {
                if (typeof k === "object" || !k) {
                    return b.init.apply(this, arguments)
                } else {
                    g.error("Method " + k + ' does not exist. See jQuery.sketchable("methods").')
                }
            }
        }
        return this
    };
    g.fn.sketchable.defaults = {
        interactive: true,
        mouseupMovements: false,
        events: {},
        graphics: {firstPointSize: 0, lineWidth: 3, strokeStyle: "#F0F", fillStyle: "#F0F"}
    };
    function c(l) {
        var k = g(l.target), m = k.offset();
        return {x: Math.round(l.pageX - m.left), y: Math.round(l.pageY - m.top)}
    }

    function a(k, m) {
        var l = (new Date).getTime();
        k.coords.push([m.x, m.y, l, +k.sketch.isDrawing])
    }

    function f(n) {
        var k = g(n.target), l = k.data(e);
        if (!j.mouseupMovements && !l.sketch.isDrawing) {
            return
        }
        var m = c(n);
        if (l.sketch.isDrawing) {
            var canvas_w = $("#drawing-canvas")[0].width;
            var canvas_h = $("#drawing-canvas")[0].height;
            // console.log(m.x);
            if ((m.x < 5) || (m.y < 5) || (m.x > canvas_w-5) || (m.y > canvas_h-5)) {
                console.log("exit canvas.");
                l.sketch.isDrawing = false;
                l.sketch.closePath();
                l.strokes.push(l.coords);
                l.coords = [];
                // if (typeof j.events.mouseup === "function") {
                //     j.events.mouseup(k, l, m)
                // }
                return
            }
            l.sketch.lineTo(m.x, m.y);
        }
        a(l, m);
        if (typeof j.events.mousemove === "function") {
            j.events.mousemove(k, l, n)
        }
    }

    function h(n) {
        var k = g(n.target), l = k.data(e);
        l.sketch.isDrawing = true;
        var m = c(n);
        l.sketch.beginPath();
        if (j.graphics.firstPointSize > 0) {
            l.sketch.fillCircle(m.x, m.y, j.graphics.firstPointSize)
        }
        a(l, m);
        if (typeof j.events.mousedown === "function") {
            j.events.mousedown(k, l, n)
        }
    }

    function i(m) {
        var k = g(m.target), l = k.data(e);
        l.sketch.isDrawing = false;
        l.sketch.closePath();
        if (l.coords.length > 0){
            l.strokes.push(l.coords);
        }

        l.coords = [];
        if (typeof j.events.mouseup === "function") {
            j.events.mouseup(k, l, m)
        }
    }

    function d(l) {
        l.preventDefault();
        var k = g(l.target);
        var n = l.originalEvent.changedTouches[0];
        for (var m in l) {
            n[m] = l[m]
        }
        switch (l.type) {
            case"touchstart":
                k.unbind(l.type, h);
                h(n);
                break;
            case"touchmove":
                k.unbind(l.type, f);
                f(n);
                break;
            case"touchend":
                k.unbind(l.type, i);
                i(n);
                break;
            default:
                return
        }
    }
})(jQuery);