/*!
 * jQuery ClassyBox
 * http://www.class.pm/projects/jquery/classybox
 *
 * Copyright 2012 - 2013, Class.PM www.class.pm
 * Written by Marius Stanciu - Sergiu <marius@picozu.net>
 * Licensed under the GPL Version 3 license.
 * Version 1.1.0
 *
 */

(function($) {
    $.fn.ClassyBox = function(a) {
        a = $.extend({
            speed: 400,
            height: 450,
            width: 650,
            arrayEl: [],
            arrayActEl: 0,
            autoDetect: true,
            ads: "",
            img: 1,
            iframe: false,
            inline: false,
            ajax: false,
            ajaxType: 0,
            ajaxData: 0,
            ajaxSuccess: 0,
            title: true,
            navigation: true,
            keyboard: true,
            keyClose: "c",
            keyPrev: "p",
            keyNext: "n",
            numberEl: 1,
            resize: true,
            social: true,
            closeAnywhere: true
        }, a);
        var b = $(this);
        if (a.autoDetect && parse_url("cbox")) {
            var c = parse_url("cbox"), elDetect = $('a[href*="' + unescape(c) + '"]');
            a.arrayEl.push(new Array(elDetect.attr("href"), elDetect.attr("title"), elDetect.children("img").attr("alt")));
            template(a);
        }
        return this.unbind("click").click(function() {
            if ($(this).is("a")) {
                a.arrayEl.length = 0;
                a.arrayActEl = 0;
                if (b.length == 1 && !a.autoDetect) {
                    a.arrayEl.push(new Array(this.getAttribute("href"), this.getAttribute("title"), $(this).children("img").attr("alt")));
                }
                else {
                    for (var i = 0; i < b.length; i++) {
                        a.arrayEl.push(new Array(b[i].getAttribute("href"), b[i].getAttribute("title"), $(b[i]).children("img").attr("alt")));
                    }
                }
                while (a.arrayEl[a.arrayActEl][0] != this.getAttribute("href")) {
                    a.arrayActEl++;
                }
                template(a);
                return false;
            }
        });
    };
    var o, _w, _c, _o, _n, _p, _l, _r, Advert, currentHeight, currentWidth, p = resizeBrowser(), scroll;
    function template(a) {
        $("body").append('<div id="classybox"></div>' +
                '<div class="classybox-loader"></div>' +
                '<section class="classybox-wrap">' +
                '<h2 class="hide">ClassyBox Media Browser</h2>' +
                '<div class="content">' +
                '<div class="close">' +
                '<a href="#">close</a>' +
                '</div>' +
                '<div class="panel"></div>' +
                '<div class="next">' +
                '<a href="#"> Next</a>' +
                '</div>' +
                '<div class="prev">' +
                '<a href="#">Previous</a>' +
                '</div>' +
                '</div>' +
                '</section>');
        o = $("#classybox"), _l = $(".classybox-loader"), _w = $(".classybox-wrap"), _c = $(".classybox-wrap").find(".content"), _o = $(".classybox-wrap").find(".close"), Panel = $(".classybox-wrap").find(".panel"), _n = $(".classybox-wrap").find(".next"), _p = $(".classybox-wrap").find(".prev");
        _w.contents().hide();
        _w.hide();
        if (a.navigation) {
            NextAndPrev(a);
            _p.unbind().bind("click", function() {
                Prevs(a);
                return false;
            });
            _n.unbind().bind("click", function() {
                Nexts(a);
                return false;
            });
            keyboardNav(a);
        }
        o.fadeIn(a.speed / 1.5);
        if ($(document).scrollTop() == 0) {
            scroll = p[0] - a.height / 2;
        }
        else {
            scroll = $(document).scrollTop() + p[0] - a.height / 2;
        }
        _w.css({
            top: scroll + p[0] / 1.6,
            left: p[1]
        });
        _l.css({
            top: scroll + p[0] / 2 + _l.height() / 1.5,
            left: p[1]
        }).hide();
        _w.fadeIn(500, function() {
            resizeWindow(a, a.height, a.width, 0);
            setup(a);
        });
        $(window).resize(function() {
            resizeWindow(a, currentHeight, currentWidth, 0, 1);
        });
        _o.click(function() {
            hide(a);
            return false;
        });
        if (a.closeAnywhere) {
            o.click(function() {
                hide(a);
            })
        }
    }
    function setup(b) {
        var c = b.arrayEl[b.arrayActEl][0];
        if (c.indexOf("jpg", ".") > 0 || c.indexOf("png", ".") > 0 || c.indexOf("gif", ".") > 0) {
            _c.append("<div class='image'><img /></div>");
            _l.fadeIn(200);
            _w.find(".image img").hide();
            var d = new Image();
            d.onload = function() {
                _w.find(".image img").attr("src", d.src);
                currentHeight = d.height, currentWidth = d.width;
                resizeWindow(b, d.height, d.width);
                d.onload = function() {
                };
                _l.fadeOut(400);
            };
            d.src = c;
            var e = b.arrayEl[b.arrayActEl][2];
            var f = b.arrayEl[b.arrayActEl][1];
            if (f) {
                _w.find(".image").append("<div class='text'><h1>" + f + "</h1></div>");
                _w.hover(function() {
                    $(this).find(".text").stop(true, true).delay(200).slideDown(200);
                }, function() {
                    $(this).find(".text").stop(true, true).delay(200).slideUp(180);
                })
            }
            if (e) {
                _w.find(".text").append("<div class='description'>" + e + "</div>");
            }
        }
        else {
            _c.fadeIn(b.speed / 1.5);
            currentHeight = b.height, currentWidth = b.width;
        }
        if (c.indexOf("mp3", ".") > 0 || c.indexOf("vmw", ".") > 0 || c.indexOf("avi", ".") > 0 || c.indexOf("mp4", ".") > 0) {
            _c.append("<div class='object'><div id='classybox-player'></div></div>");
            jwplayer("classybox-player").setup({
                file: c,
                width: b.width,
                height: b.height
            });
        }
        if (c.indexOf("youtube", ".") > 0) {
            _c.append("<div class='object'></div>");
            hrefY = "http://www.youtube.com/embed/" + c.substring(31, 42);
            _w.find(".object").append("<iframe class='' type='text/html' width='" + b.width + "' height='" + b.height + "' src='" + hrefY + "' frameborder='0'></iframe>");
        }
        if (c.indexOf("vimeo", ".") > 0) {
            _c.append("<div class='object'></div>");
            hrefV = c.substr(-8);
            _w.find(".object").append("<iframe src='http://player.vimeo.com/video/" + hrefV + "?title=0&amp;byline=0&amp;portrait=0' width='" + b.width + "' height='" + b.height + "' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
        }
        if (b.iframe) {
            _c.append("<iframe src='" + c + "' scrolling='auto' height='" + b.height + "' width='" + b.width + "' frameborder='0'></iframe>");
        }
        if (b.inline) {
            _c.append($(c).html());
        }
        if (b.ajax != 0 || c.indexOf("txt", ".") > 0 || c.indexOf("js", ".") > 0) {
            $.ajax({
                type: (!b.ajaxType) ? "GET" : b.ajaxType,
                url: c,
                data: b.ajaxData,
                success: (!b.ajaxSuccess) ? (function(a) {
                    _c.append(a);
                }) : b.ajaxSuccess
            });
        }
        if (c.indexOf("dailymotion", ".") > 0) {
            var g = c.substring(33, 39);
            _c.append("<iframe frameborder='0' width='" + b.width + "' height='" + b.height + "' src='http://www.dailymotion.com/embed/video/" + g + "'></iframe>")
        }
        if (c.indexOf("5min", ".") > 0) {
            var h = c.substr(-9);
            _c.append("<object width='" + b.width + "' height='" + b.height + "' id='FiveminPlayer' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000'><param name='allowfullscreen' value='true'/><param name='allowScriptAccess' value='always'/><param name='movie' value='http://embed.5min.com/" + h + "/'/><param name='wmode' value='opaque' /><embed name='FiveminPlayer' src='http://embed.5min.com/" + h + "/' type='application/x-shockwave-flash' width='" + b.width + "' height='" + b.height + "' allowfullscreen='true' allowScriptAccess='always' wmode='opaque'></embed></object>")
        }
        if (c.indexOf("metacafe", ".") > 0) {
            var i = c.substr(30).slice(0, -1);
            _c.append("<embed flashVars='playerVars=autoPlay=no' src='http://www.metacafe.com/fplayer/" + i + ".swf' width='" + b.width + "' height='" + b.height + "' wmode='transparent' allowFullScreen='true' allowScriptAccess='always' name='Metacafe_" + i.substring(0, 7) + "' pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash'></embed>")
        }
        if (c.indexOf("ustream", ".") > 0) {
            var j = c.substring(31, 39);
            _c.append("<iframe frameborder='0' width='" + b.width + "' height='" + b.height + "' src='http://www.ustream.tv/embed/recorded/" + j + "' style='border: 0px none transparent;'></iframe>")
        }
        if (c.indexOf("hell", ".") > 0) {
            var k = c.substring(28, 33);
            _c.append("<iframe width='" + b.width + "' height='" + b.height + "' src='http://www.hell.tv/embed/video/" + k + "' frameborder='0' scrolling='no' allowfullscreen></iframe>")
        }
        if (c.indexOf("vevo", ".") > 0) {
            var l = c.substr(-12);
            _c.append("<object width='" + b.width + "' height='" + b.height + "'><param name='movie' value='http://videoplayer.vevo.com/embed/Embedded?videoId=" + l + "&playlist=false&autoplay=0&playerId=62FF0A5C-0D9E-4AC1-AF04-1D9E97EE3961&playerType=embedded&env=0&cultureName=en-US&cultureIsRTL=False'></param><param name='wmode' value='transparent'></param><param name='bgcolor' value='#000000'></param><param name='allowFullScreen' value='true'></param><param name='allowScriptAccess' value='always'></param><embed src='http://videoplayer.vevo.com/embed/Embedded?videoId=" + l + "&playlist=false&autoplay=0&playerId=62FF0A5C-0D9E-4AC1-AF04-1D9E97EE3961 &playerType=embedded&env=0&cultureName=en-US&cultureIsRTL=False' type='application/x-shockwave-flash' allowfullscreen='true' allowscriptaccess='always' width='" + b.width + "' height='" + b.height + "' bgcolor='#000000' wmode='transparent'></embed></object>")
        }
        if (c.indexOf("myspace", ".") > 0) {
            var m = c.substr(-9);
            _c.append("<object width='" + b.width + "' height='" + b.height + "'><param name='allowFullScreen' value='true'/><param name='wmode' value='transparent'/><param name='movie' value='http://mediaservices.myspace.com/services/media/embed.aspx/m=" + m + ",t=1,mt=video'/><embed src='http://mediaservices.myspace.com/services/media/embed.aspx/m=" + m + ",t=1,mt=video' width='" + b.width + "' height='" + b.height + " allowFullScreen='true' type='application/x-shockwave-flash' wmode='transparent'></embed></object>")
        }
        if (b.social) {
            var n = "http://www.facebook.com/share.php?u=" + window.location + "?cbox=" + c,
                    twl = "https://twitter.com/share?url=" + window.location + "?cbox=" + c,
                    gpl = "https://plus.google.com/share?url=" + window.location + "?cbox=" + c;
            Panel.append("<div class='fb'><a href='" + n + "' target='_blank'>Facebook</a></div><div class='tw'><a href='" + twl + "' target='_blank'>Twitter</a></div><div class='gp'><a href='" + gpl + "' target='_blank'>Google plus</a></div>");
        }
        if (b.ads) {
            _c.append("<div class='adss'><div class='qa'><div class='closeads'><a href='#'></a></div></div></div>");
            Advert = _c.find(".adss");
            $.ajax({
                type: "GET",
                url: b.ads,
                data: '',
                success: function(a) {
                    Advert.find(".qa").append(a);
                    Advert.find(".qa").css({
                        height: Advert.find(".contentadv").height(),
                        width: Advert.find(".contentadv").width(),
                    });
                }
            });
            $(".adss .closeads a").click(function() {
                $(this).parents(".adss").remove();
                return false
            });
            Advert.delay(800).fadeIn(210);
        }
    }
    function NextAndPrev(a) {
        if (a.arrayActEl != 0) {
            _p.css("top", a.height / 2).show();
        }
        else {
            _p.hide();
        }
        if (a.arrayActEl != a.arrayEl.length - 1) {
            _n.css("top", a.height / 2).show();
        }
        else {
            _n.hide();
        }
        countEl(a);
    }
    function keyboardNav(b) {
        if (b.keyboard) {
            $(document.documentElement).unbind().bind("keyup", function(a) {
                if ($.browser.msie) {
                    codeAscii = a.keyCode;
                }
                else {
                    codeAscii = a.keyCode;
                }
                KeyCode = String.fromCharCode(codeAscii).toLowerCase();
                if (a.keyCode == 37 || KeyCode == b.keyPrev) {
                    Prevs(b);
                }
                if (a.keyCode == 39 || KeyCode == b.keyNext) {
                    Nexts(b);
                }
                if (a.keyCode == 27 || KeyCode == b.keyClose) {
                    hide(b);
                }
            });
        }
    }
    function Prevs(a) {
        if (a.arrayActEl != 0) {
            a.arrayActEl = a.arrayActEl - 1;
            _w.animate({
                left: "+=" + a.width / 1.5,
                opacity: 0
            }, a.speed / 1.4, function() {
                _c.contents().not(".next, .prev, .close, .panel").remove();
                Panel.contents().remove();
                _w.animate({
                    left: "-=" + a.width * 2.5,
                    opacity: 0
                }, 1).animate({
                    opacity: 1
                }, a.speed / 1.5);
                if (!_c.find(".image").length) {
                    _w.animate({
                        left: p[1] - a.width / 2
                    }, a.speed / 1.5);
                }
                countEl(a);
                setup(a);
                NextAndPrev(a);
            });
        }
    }
    function Nexts(a) {
        if (a.arrayActEl != a.arrayEl.length - 1) {
            a.arrayActEl = a.arrayActEl + 1;
            _w.animate({
                left: "-=" + a.width / 1.5,
                opacity: 0
            }, a.speed / 1.4, function() {
                _c.contents().not(".next, .prev, .close, .panel").remove();
                Panel.contents().remove();
                _w.animate({
                    left: "+=" + a.width * 2.5,
                    opacity: 0
                }, 1).animate({
                    opacity: 1
                }, a.speed / 1.5);
                if (!_c.find(".image").length) {
                    _w.animate({
                        left: p[1] - a.width / 2
                    }, a.speed / 1.5);
                }
                countEl(a);
                setup(a);
                NextAndPrev(a);
            })
        }
    }
    function countEl(a) {
        if (a.numberEl) {
            $(".classybox-wrap .content .number").remove();
            if (a.arrayEl.length != 0) {
                _c.append("<div class='number'>" + (a.arrayActEl + 1) + " / " + a.arrayEl.length + "</div>");
            }
        }
    }
    function resizeWindow(a, b, c, d, e) {
        p = resizeBrowser(a);
        var f = p[0] * 1.6, maxW = p[1] * 1.6, ratio = 0;
        if (f > b || maxW > c) {
            a.height = b;
            a.width = c;
        }
        else {
            if (a.resize) {
                _c.find(".resize").remove();
                Panel.prepend("<div class='resize'><a href='#'>Resize</a></div>");
                _r = _c.find(".resize");
                _r.find("a").click(function() {
                    resizeWindow(a, currentHeight, currentWidth, 1);
                    return false;
                });
            }
            if (a.img && !d || !d) {
                if (b > f) {
                    ratio = f / b;
                    a.height = b = f;
                    a.width = c = c * ratio;
                }
                if (c > maxW) {
                    ratio = maxW / c;
                    a.height = b = b * ratio;
                    a.width = c = maxW;
                }
            }
        }
        _w.animate({
            top: $(document).scrollTop() + p[0] - b / 2,
            left: p[1] - c / 2,
            width: c,
            height: b
        }, (!e) ? a.speed / 1.5 : 0, function() {
            _c.find(".image img, iframe, object").not(".adss iframe, .adss object").height(b).width(c);
            $(this).find(".image").contents().fadeIn(a.speed, function() {
                _c.fadeIn(a.speed / 1.7);
            });
        });
        _n.animate({
            "top": b / 2
        }, (!e) ? 50 : 0);
        _p.animate({
            "top": b / 2
        }, (!e) ? 50 : 0);
    }
    function hide(a) {
        arrPageSize = resizeBrowser();
        a.arrayEl.length = 0;
        a.arrayActEl = 0;
        _c.fadeOut(a.speed / 1.6, function() {
            _w.animate({
                left: arrPageSize[1],
                top: arrPageSize[0],
                height: 20,
                width: 20
            }, a.speed / 1.3, function() {
                _w.fadeOut(a.speed / 1.2, function() {
                    _w.contents().remove();
                    _w.remove();
                    o.fadeOut(a.speed / 1.5, function() {
                        o.remove();
                    });
                });
            });
        });
    }
    function resizeBrowser() {
        var a = new Array;
        a[0] = document.documentElement.clientHeight / 2;
        a[1] = document.documentElement.clientWidth / 2;
        return a;
    }
    function parse_url(a) {
        var b = window.document.URL.toString();
        if (b.indexOf("?") > 0) {
            var c = b.split("?"), d = c[1].split("&"), e = new Array(d.length), f = new Array(d.length), i = 0;
            for (i = 0; i < d.length; i++) {
                var g = d[i].split("=");
                e[i] = g[0];
                if (g[1] != "") {
                    f[i] = unescape(g[1]);
                }
                else {
                    f[i] = "No Value";
                }
            }
            for (i = 0; i < d.length; i++) {
                if (e[i] == a) {
                    return f[i];
                }
            }
            return false;
        }
    }
})(jQuery);