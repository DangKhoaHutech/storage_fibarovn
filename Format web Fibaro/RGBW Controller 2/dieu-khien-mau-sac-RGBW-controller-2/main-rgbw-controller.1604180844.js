(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var M = {
    degToRad: Math.PI / 180,
    radToDeg: 180 / Math.PI,

    // Clamp
    clamp: function( val, min, max ) {
        return val < min ? min : val > max ? max : val;
    },

    // Linear interpolation
    lerp: function( norm, min, max ) {
        return ( max - min ) * norm + min;
    },

    // Normalize
    norm: function( value, min, max ) {
        return ( value - min ) / ( max - min );
    },

    // Map
    map: function( value, srcMin, srcMax, destMin, destMax ) {
        return M.lerp( M.norm( value, srcMin, srcMax ), destMin, destMax );
    }
};

module.exports = M;

},{}],2:[function(require,module,exports){
var $ = require('jquery'),
    M = require(1),
    ScrollMagic = require('scrollmagic'),
    Slider = require('bootstrap-slider'),
    TweenMax = require('gsap');

$(function () {
    var isRobot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
    var isPhone = fibScreenInfo.currentBreakpoint === 'PHONE_S' || fibScreenInfo.currentBreakpoint === 'PHONE_L';

    /**
     * Header
     */
    var hdSection = $('#header');

    if (hdSection.length > 0) {
        // Start it when sections scrolls into screen
        hdSection.addClass('active');
    }

    /**
     * Magic of colors
     */
    var magicSection = $('#magic-of-colors'),
        magicInput = magicSection.find('.magic-slider-wrapper input'),
        magicLayers = magicSection.find('.bg-second'),

        magicSlider = new Slider(magicInput[0], {
            id: 'magic-mobile-slider',
            min: 0,
            max: 140,
            step: 1,
            value: 70,
            tooltip: 'hide'
        });

    magicSlider.on('change', magicChangeSliderState);

    function magicChangeSliderState(sliderState) {
        var oldval = Math.floor(sliderState.oldValue / 10);
        var newval = Math.floor(sliderState.newValue / 10);

        if (newval !== oldval) {
            magicLayers.eq(newval).addClass("active");

            var st = setTimeout(function () {
                magicLayers.eq(oldval).removeClass("active");
                clearTimeout(st);
            }, 250);
        }
    }

    /**
     * Voice control
     */
    var vcSection = $('#voice-control');

    if (vcSection.length > 0) {
        // Start it when sections scrolls into screen
        new ScrollMagic.Scene({
            triggerHook: 'onCenter',
            triggerElement: '#voice-control .content',
            reverse: false,
            offset: 100
        })
            .on('start', function () {
                vcSection.find('.speech').addClass('active');
            })
            .addTo(new ScrollMagic.Controller());
    }

    /**
     * Child room
     */
    var crSection = $('#child-room');

    if (crSection.length > 0) {
        // Start it when sections scrolls into screen
        new ScrollMagic.Scene({
            triggerHook: 'onCenter',
            triggerElement: '#child-room .content',
            reverse: false,
            offset: 100
        })
            .on('start', function () {
                crSection.find('#info-box, #info-box-second').addClass('active');
            })
            .addTo(new ScrollMagic.Controller());
    }

    /**
     * Danger alarm
     */
    var daSection = $('#danger-alarm');

    if (daSection.length > 0) {
        // Start it when sections scrolls into screen
        new ScrollMagic.Scene({
            triggerHook: 'onCenter',
            triggerElement: '#danger-alarm .content',
            reverse: false,
            offset: 100
        })
            .on('start', function () {
                daSection.find('#info-box').addClass('active');
            })
            .addTo(new ScrollMagic.Controller());
    }

    /**
     * Light temperature
     */
    var alSection = $('#light-temperature'),
        alInput = alSection.find('.slider-wrapper input'),
        alLightLayer = alSection.find('.bg-second'),
        alTimeline = new TweenMax.TimelineMax(),

        alSlider = new Slider(alInput[0], {
            id: 'al-mobile-slider',
            min: 0,
            max: 100,
            step: 1,
            value: 0,
            tooltip: 'hide'
        });

    alSlider.on('change', alChangeSliderState);

    alTimeline.add(TweenMax.to([], 1, {
        delay: 1,
        onUpdate: function () {
            var val = M.clamp(Math.round(this.progress() * 100), 0, 50);

            alSlider.setValue(val);

            alLightLayer.css({opacity: val / 100});
        }
    }));

    new ScrollMagic.Scene({triggerElement: ".slider-wrapper", reverse: false})

        .setTween(alTimeline)
        .addTo(new ScrollMagic.Controller({globalSceneOptions: {triggerHook: "onEnter"}}));

    function alChangeSliderState(sliderState) {
        alLightLayer.css({opacity: sliderState.newValue / 100});
    }

    /**
     * 4 Light Sources
     */
    var mlSection = $('#light-sources'),
        mainInput = mlSection.find('#main-input'),
        mainLayer = mlSection.find('.bg.main'),
        recessInput = mlSection.find('#recess-input'),
        recessLayer = mlSection.find('.bg.recess'),
        cupboardInput = mlSection.find('#cupboard-input'),
        cupboardLayer = mlSection.find('.bg.cupboard'),
        tableInput = mlSection.find('#table-input'),
        tableLayer = mlSection.find('.bg.table'),
        mlTimeline = new TweenMax.TimelineMax(),

        mainSlider = new Slider(mainInput[0], {
            id: 'main-slider',
            min: 0,
            max: 100,
            step: 1,
            value: 0,
            tooltip: 'hide'
        }),

        recessSlider = new Slider(recessInput[0], {
            id: 'recess-slider',
            min: 0,
            max: 100,
            step: 1,
            value: 0,
            tooltip: 'hide'
        }),

        cupboardSlider = new Slider(cupboardInput[0], {
            id: 'cupboard-slider',
            min: 0,
            max: 100,
            step: 1,
            value: 0,
            tooltip: 'hide'
        }),

        tableSlider = new Slider(tableInput[0], {
            id: 'table-slider',
            min: 0,
            max: 100,
            step: 1,
            value: 0,
            tooltip: 'hide'
        });

    mainSlider.on('change', mlChangeSliderState);
    recessSlider.on('change', recessChangeSliderState);
    cupboardSlider.on('change', cupboardChangeSliderState);
    tableSlider.on('change', tableChangeSliderState);

    mlTimeline.add(TweenMax.to([], 1, {
        delay: 1,
        onUpdate: function () {
            var val = M.clamp(Math.round(this.progress() * 100), 0, 75);
            var valRecess = M.clamp(Math.round(this.progress() * 100), 0, 25);
            var valCupboard = M.clamp(Math.round(this.progress() * 100), 0, 100);
            var valTable = M.clamp(Math.round(this.progress() * 100), 0, 50);

            mainSlider.setValue(val);
            recessSlider.setValue(valRecess);
            cupboardSlider.setValue(valCupboard);
            tableSlider.setValue(valTable);

            mainLayer.css({opacity: val / 100});
            recessLayer.css({opacity: valRecess / 100});
            cupboardLayer.css({opacity: valCupboard / 100});
            tableLayer.css({opacity: valTable / 100});
        }
    }));

    new ScrollMagic.Scene({triggerElement: ".slider-wrapper-4-lights", reverse: false})

        .setTween(mlTimeline)
        .addTo(new ScrollMagic.Controller({globalSceneOptions: {triggerHook: "onEnter"}}));

    function mlChangeSliderState(sliderState) {
        mainLayer.css({opacity: sliderState.newValue / 100});
    }

    function recessChangeSliderState(sliderState) {
        recessLayer.css({opacity: sliderState.newValue / 100});
    }

    function cupboardChangeSliderState(sliderState) {
        cupboardLayer.css({opacity: sliderState.newValue / 100});
    }

    function tableChangeSliderState(sliderState) {
        tableLayer.css({opacity: sliderState.newValue / 100});
    }

    /**
     * Color World
     */
    var bhSection = $('#color-world');

    if (bhSection.length > 0) {
        // Start it when sections scrolls into screen
        new ScrollMagic.Scene({
            triggerHook: 'onCenter',
            triggerElement: '#color-world .content',
            reverse: false,
            offset: 100
        })
            .on('start', function () {
                bhSection.find('.program-items, .bg2').addClass('active');
            })
            .addTo(new ScrollMagic.Controller());
    }

    /** Slider **/

    new Swiper('#slider .rooms', {
        simulateTouch: false,
        loop: true,
        disableOnInteraction: true,
        pagination: '.rooms .swiper-pagination',
        nextButton: '.rooms .swiper-button-next',
        prevButton: '.rooms .swiper-button-prev',
        slidesPerView: 3,
        spaceBetween: 5,
        breakpoints: {
            767: {
                slidesPerView: 1,
                autoplay: 5000
            },
            991: {
                slidesPerView: 2,
                autoplay: 5000
            }
        }
    });

    /** Scenes **/

    function VideoGadget() {
        this._gadget = $('#video-gadget');
        this._miniatures = this._gadget.find("a");
        this._videos = this._gadget.find("video");
        this._playCount = 0;
        this._currentItem = 0;

        this._miniatures.on("click", this.changeActiveItem.bind(this));
        this._videos.on("playing", this.handlePlayback.bind(this));

        if (isPhone) {
            this._swiper = new Swiper('#scenes .scene-names', {
                simulateTouch: false,
                loop: true,
                disableOnInteraction: true,
                pagination: '.scene-names .swiper-pagination',
                nextButton: '.scene-names .swiper-button-next',
                prevButton: '.scene-names .swiper-button-prev',
                slidesPerView: 1,
                spaceBetween: 30,

                onSlideChangeStart: function (swiper) {
                    this.playNext(swiper.realIndex);
                }.bind(this)
            });
        }
    }

    VideoGadget.prototype = $.extend({}, {
        handlePlayback: function () {
            if (this._playCount === 5) {
                var next =
                    this._currentItem + 1 < this._videos.length
                        ? this._currentItem + 1
                        : 0;

                this._playCount = 0;
                this._currentItem = next;

                this.playItem(next);

                if (isPhone) {
                    this._swiper.slideNext();
                }
            }

            this._playCount++;
        },

        playNext: function (nextItem) {
            this._playCount = 0;
            this._currentItem = nextItem;

            this.playItem(nextItem);
        },

        playItem: function (index) {
            // zatrzymujemy bieżące video
            this._videos.filter(".active")[0].pause();
            this._videos.filter(".active")[0].currentTime = 0;

            // zmieniamy aktywne elementy
            this._miniatures.removeClass("active").eq(index).addClass("active");
            this._videos.removeClass("active").eq(index).addClass("active");

            // uruchamiamy nowe video
            this._videos.filter(".active")[0].play();
        },

        changeActiveItem: function (event) {
            var id = parseInt(event.currentTarget.dataset.id);

            if (id === this._currentItem) return;

            this._playCount = 0;
            this._currentItem = id;

            this.playItem(id);
        },

        start: function () {
            this._videos[0].play();
        }
    });

    var vgadget = new VideoGadget();

    if (vgadget) {
        // Start it when sections scrolls into screen
        new ScrollMagic.Scene({
            triggerHook: 'onEnter',
            triggerElement: '#scenes',
            reverse: false
        })
            .on('start', function () {
                vgadget.start();
            })
            .addTo(new ScrollMagic.Controller());
    }

});
},{"1":1,"undefined":undefined}]},{},[2])

//# sourceMappingURL=main-rgbw-controller.js.map
