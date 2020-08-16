!(function n(t, e, i) {
    function r(f, a) {
        if (!e[f]) {
            if (!t[f]) {
                var u = "function" == typeof require && require;
                if (!a && u) return u(f, !0);
                if (o) return o(f, !0);
                var c = new Error("Cannot find module '" + f + "'");
                throw ((c.code = "MODULE_NOT_FOUND"), c);
            }
            var d = (e[f] = { exports: {} });
            t[f][0].call(
                d.exports,
                function(n) {
                    var e = t[f][1][n];
                    return r(e ? e : n);
                },
                d,
                d.exports,
                n,
                t,
                e,
                i
            );
        }
        return e[f].exports;
    }
    for (var o = "function" == typeof require && require, f = 0; f < i.length; f++) r(i[f]);
    return r;
})({
    1: [
        function(n, t, e) {
            t.exports = {
                init: function(n) {
                    if (!n.data("lights")) {
                        var t,
                            e,
                            i = 0,
                            r = 1,
                            o = 2,
                            f = [".none", ".left", ".right", ".both"],
                            a = function(r) {
                                if (t) return void(e = r);
                                i ^= r;
                                var o = f[i],
                                    u = n.find(".lamp:not(" + o + ")").css("zIndex", 0);
                                n
                                    .find(o)
                                    .css("zIndex", 1)
                                    .fadeIn(200, function() {
                                        u.fadeOut(0), (t = !1), e && (a(e), (e = void 0));
                                    }),
                                    (t = !0);
                            };
                        n.find("a.x").click(function(n) {
                                n.preventDefault(), a(r);
                            }),
                            n.find("a.triangle").click(function(n) {
                                n.preventDefault(), a(o);
                            }),
                            n.data("lights", !0),
                            a(0);
                    }
                },
                destroy: function(n) {
                    n.find("a.x, a.triangle").off("click"), n.find(".lamp").hide().find(".none").show(), n.data("lights", !1);
                },
            };
        },
        {},
    ],
    2: [
        function(n, t, e) {
            var i = n("jquery"),
                r = n(1),
                o = n("gsap");
            i(function() {
                var n = i(".lights");
                n.length > 0 && r.init(n),
                    i(".keyfob #section1 a").on("click", function(n) {
                        n.preventDefault(), o.to(window, 0.75, { scrollTo: { y: "#section2", offsetY: 80 }, ease: Power2.easeOut });
                    });
            });
        },
        { 1: 1, undefined: void 0 },
    ],
}, {}, [2]);