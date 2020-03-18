function addCurClass(c, d, e) {
    var b;
    if (e && typeof e === "string") {
        b = e
    } else {
        b = "cur"
    }
    $(c).each(function(g, f) {
        $(f).removeClass(b)
    });
    $(d).addClass(b)
}
String.prototype.trim = function() {
    return this.replace(/^\s\s*/, "").replace(/\s\s*$/, "")
}
;
function getQueryStringArgs() {
    var c = (location.search.length > 0 ? location.search.substring(1) : "")
      , h = {}
      , d = c.length ? c.split("&") : []
      , e = null
      , g = null
      , f = null
      , b = 0
      , j = d.length;
    for (b = 0; b < j; b++) {
        e = d[b].split("=");
        g = decodeURIComponent(e[0]).toLowerCase();
        f = decodeURIComponent(e[1]);
        if (g.length) {
            h[g] = f
        }
    }
    return h
}
function bindMoreClickHandler() {
    $("#J_sumBtn-stretch").on("click.stretch", function() {
        var e = $(this);
        var c = e.parent(".btnbox");
        var d = c.siblings(".listbox").find(".more");
        var b = c.siblings(".listbox").find(".moreAll");
        if (e.text() == Msg.MoreJieShao) {
            c.addClass(" btnOpen ");
            d.removeClass("hide");
            e.text(Msg.ShouQi);
            $("#morehideshow").css("white-space", "normal")
        } else {
            c.removeClass(" btnOpen ");
            e.text(Msg.MoreJieShao);
            d.addClass(" hide ");
            $("#morehideshow").css("white-space", "nowrap")
        }
    })
}
function bindImageClickHandler() {
    var b = $("#J_journalPic").find("img.pic-book");
    if (b && b.size() > 0) {
        var e = b.innerWidth()
          , d = b.innerHeight()
          , h = b.position().top
          , f = b.position().left
          , g = parseInt(b.css("zIndex"))
          , c = 2;
        b.hover(function() {
            if ($(this).data("flag") == undefined) {
                var i = $(this);
                i.data("flag", "moveIn");
                i.stop().animate({
                    left: parseFloat((f - (c - 1) * e / 2)) + "px",
                    top: parseFloat((h - (c - 1) * d / 2)) + "px",
                    zIndex: g + 2,
                    width: e * c,
                    height: d * c
                }, 300)
            } else {
                return false
            }
        }, function() {
            if ($(this).data("flag") == "moveIn") {
                var i = $(this);
                i.stop().animate({
                    left: f + "px",
                    top: h + "px",
                    zIndex: g,
                    width: e,
                    height: d
                }, 200, function() {
                    i.removeData("flag")
                })
            } else {
                return false
            }
        })
    } else {
        return false
    }
}
function bindShareHover() {
    $(".J_btnShare").hover(function() {
        $(this).addClass(" hover ")
    }, function() {
        $(this).removeClass("hover")
    })
}
function bindSeeMoreClickHandler() {
    var b = $("#viewDetials");
    b.click(function() {
        $(".detialnr").fadeIn();
        viewH = $("#viewDetials").height();
        viewW = $("#viewDetials").width();
        divInfoH = $(".divInfo").outerHeight(true);
        divInfoW = $(".divInfo").outerWidth();
        jBoxH = $(".jBox-pointer").height();
        layerposT = parseInt(viewH + divInfoH + jBoxH + 2);
        layerposL = parseInt(divInfoW + jBoxH);
        viewT = $("#viewDetials").offset().top - $(".headbox").outerHeight() - $(".location").outerHeight();
        viewL = $("#viewDetials").offset().left - ($(document.body).width() - $(".bodymain").width()) / 2;
        if (viewT >= layerposT - viewH) {
            $(".divInfo").css({
                top: "-" + layerposT + "px",
                left: "-" + (viewL - 240) + "px"
            });
            $(".detialnr #close").css({
                left: 900 - (viewL - 240) - 10 + "px",
                bottom: divInfoH + $(this).height() + "px"
            });
            $(".jBox-pointer").addClass("jBox-pointer-bottom")
        } else {
            $(".divInfo").css({
                width: viewL - 240 + "px",
                left: "-" + (viewL - 240 + 47) + "px",
                top: "-" + parseInt(divInfoH / 2) + "px"
            });
            $(".detialnr #close").css({
                left: -60 + "px",
                bottom: parseInt(divInfoH / 2) - $(this).height() - viewH + "px"
            });
            $(".jBox-pointer").addClass("jBox-pointer-right")
        }
        $("#close").click(function() {
            $(".detialnr").fadeOut()
        })
    })
}
var VAR = {
    repeatTemp: []
};
var COM = {
    repeat: function(b, c) {
        c = c ? c * 1000 : 2000;
        var e = microtime();
        if (!VAR.repeatTemp[b]) {
            VAR.repeatTemp[b] = e;
            return false
        } else {
            var d = c - (e - VAR.repeatTemp[b]);
            if (d > 0) {
                alert(Msg.TooOften);
                return true
            } else {
                VAR.repeatTemp[b] = e;
                return false
            }
        }
    }
};
function microtime() {
    return new Date().getTime()
}
var bindTabClickHandler = function(b) {
    $(".journalTabbox .lArea li").each(function(d, c) {
        $(c).click(function() {
            if (COM.repeat(this)) {
                return
            }
            addCurClass($(c).parent().children(), c);
            if (b && typeof b == "function") {
                b.call(this, $(c).attr("id"), c)
            }
        })
    })
};
function textPager(e, b, d) {
    var c = {
        items_per_page: 20,
        num_display_entries: 10,
        num_edge_entries: 0,
        link_to: "javascript:void(0);",
        prev_text: Msg.PrePage,
        next_text: Msg.NextPage,
        ellipse_text: "...",
        prev_show_always: false,
        next_show_always: false,
        total_show: d,
        first_show: true
    };
    c.initial_load = false;
    c.callback = function(f) {
        if (b && typeof b == "function") {
            b.call(this, f)
        }
    }
    ;
    return $(".pagebox").pagination(e, c)[0]
}
function J_btnShareOver(b) {
    $(b).addClass(" hover ");
    if (typeof ($(b).find("img").attr("src")) == "undefined") {
        $(b).find("img").attr("src", $(b).find("img").attr("src1"))
    }
}
function J_btnShareOut(b) {
    $(b).removeClass("hover")
}
/*
 * 排序的点击事件
 *@callback 排序后重新检索的方法
 */
function bindSortBY(d, f, b, c) {
    $(d).mouseenter(function() {
        $(this).find("ul").show()
    }).mouseleave(function() {
        $(this).find("ul").hide()
    });
    var e = 0;
    $(d).find("a").click(function() {
        $(this).parent().addClass(b).siblings().removeClass(b);
        $sortDefault = $(d).find(f);
        $sortList = $(d).find("ul");
        _index = $(d).find("a").index($(this));
        if (e == _index) {
            if ($(this).attr("data-map") != "RT" && $(this).attr("data-map") != "FFD" && $(this).attr("name") != "RT" && $(this).attr("name") != "FFD") {
                $(this).find("i").toggleClass("ascend descend")
            }
        }
        e = _index;
        $sortDefault.find("span").html($(this).html());
        $sortList.hide();
        $(".pagebox").html("");
        c()
    })
}
var setPageInfo = function(b, c) {
    if (typeof (b) == "undefined" || typeof (c) == "undefined") {
        $(".resultInfo .page-pre").attr("class", "page-pre disable");
        $(".resultInfo .page-next").attr("class", "page-next disable");
        return
    }
    if (b == "1" || b == "0") {
        $(".resultInfo .page-pre").attr("class", "page-pre disable")
    } else {
        $(".resultInfo .page-pre").attr("class", "page-pre")
    }
    if (b == c || c == "0") {
        $(".resultInfo .page-next").attr("class", "page-next disable")
    } else {
        $(".resultInfo .page-next").attr("class", "page-next")
    }
};
function ShareActionUrl(g) {
    var e = $("#shareChName").val();
    if (!e) {
        return
    }
    var h = $("#sharehost").val();
    var f = h + "?urlInfo=" + encodeURIComponent(document.URL) + "&content=" + encodeURIComponent(e) + "&type=" + g + "&target=custom&cnkiUserKey=" + getRSSCookie("cnkiUserKey");
    if (g == "wy") {
        window.open(f, "_blank", "width=800,height=600, menubar=no, scrollbars=no,resizable=yes,location=no, status=no")
    } else {
        window.open(f, "_blank", "width=480,height=430, menubar=no, scrollbars=no,resizable=yes,location=no, status=no")
    }
}
function getRSSCookie(d, f) {
    if (window.localStorage || window.sessionStorage) {
        if (f == "2") {
            return window.sessionStorage.getItem(d)
        }
        return window.localStorage.getItem(d)
    }
    var e = d + "=";
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(e);
        if (offset != -1) {
            offset += e.length;
            end = document.cookie.indexOf(";", offset);
            if (end == -1) {
                end = document.cookie.length
            }
            return unescape(document.cookie.substring(offset, end))
        }
    }
}
function Subscribe(b) {
    var c = document.getElementsByName("aRss" + b)[0].href;
    copyToClipboard(c);
    alert(message.rssMessage1);
    return true
}
function tougao_click(b) {
    if (document.getElementById("hidUID").value == "") {
        window.open("http://www." + b + ".cbpt.cnki.net/default.aspx")
    } else {
        window.open("http://www." + b + ".cbpt.cnki.net/default.aspx?UID=" + document.getElementById("hidUID").value)
    }
    return false
}
function CopyToClipboard(i) {
    var f = i ? i : location.href;
    var d = f;
    var b = true;
    if (window.clipboardData) {
        window.clipboardData.setData("Text", d)
    } else {
        var c = CreateElementForExecCommand(d);
        SelectContent(c);
        var h = true;
        try {
            if (window.netscape && netscape.security) {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
            }
            b = document.execCommand("copy", false, null)
        } catch (g) {
            b = false
        }
        document.body.removeChild(c)
    }
    if (b) {
        alert("已成功复制本文链接。")
    } else {
        alert("您的浏览器不支持，请手动复制本文链接。")
    }
}
function CreateElementForExecCommand(c) {
    var b = document.createElement("div");
    b.style.position = "absolute";
    b.style.left = "-10000px";
    b.style.top = "-10000px";
    b.textContent = c;
    document.body.appendChild(b);
    b.contentEditable = true;
    return b
}
function SelectContent(d) {
    var b = document.createRange();
    b.selectNodeContents(d);
    var c = window.getSelection();
    c.removeAllRanges();
    c.addRange(b)
}
(function(b) {
    b.extend({
        switches: function(e, c, d) {
            b(e).find(c).click(function() {
                b(this).addClass(d).siblings().removeClass(d)
            })
        },
        SortBY: function(d, f, c) {
            b(d).mouseenter(function() {
                b(this).find("ul").show()
            }).mouseleave(function() {
                b(this).find("ul").hide()
            });
            var e = 0;
            b(d).find("a").click(function() {
                b(this).parent().addClass(c).siblings().removeClass(c)
            })
        }
    })
}
)(jQuery);
var SetHiddenValue = function(c, b) {
    $("#searchtypeVal").val(c);
    $("#searchTxtVal").val(b)
};
var SetSearchTextValue = function(c, b) {
    $("#searchtype").get(0).selectedIndex = c;
    $("#J_searchTxt").val(b)
};
var InternalSearch = {
    pCode: "",
    baseId: "",
    getGoupUrl: "",
    getSerachConUrl: "",
    getResultListUrl: "",
    scope: "",
    getSearchResultLayerList: function() {
        var d = encodeURIComponent($.trim($("#J_searchTxt").val()));
        if (($.trim($("#J_searchTxt").val()) == $("#J_searchTxt").attr("placeholder")) || $.trim(d) == "") {
            SetSearchTextValue($("#searchtypeVal").val(), $("#searchTxtVal").val());
            d = encodeURIComponent($.trim($("#J_searchTxt").val()))
        }
        if (InternalSearch.validate($.trim($("#J_searchTxt").val()))) {
            $("#leftYearTree").html("");
            $("#rightCatalog").html("");
            alert(Msg.DangerTips);
            return
        }
        var c = escape($("#searchtype").val());
        SetHiddenValue($("#searchtype").get(0).selectedIndex, $("#J_searchTxt").val());
        var b = {
            pcode: InternalSearch.pCode,
            baseId: InternalSearch.baseId,
            where: c,
            searchText: d,
            scope: InternalSearch.scope
        };
        $.post(InternalSearch.getGoupUrl, b, function(e) {
            $("#leftYearTree").html(e);
            InternalSearch.groupclickresult()
        });
        InternalSearch.getInternalSearchHolder();
        InternalSearch.loadSearchResult()
    },
    groupclickresult: function() {
        $(".ql-list").find("a").click(function() {
            $(this).parents(".lArea").find(".querylist .ql-list li a").removeClass("on");
            $(this).addClass("on");
            InternalSearch.getInternalSearchHolder();
            var b = $(this).attr("title");
            var d = $(this).attr("groupname");
            var c = $(this).attr("condition");
            $(".contentbox .rArea .date-list-Box .date-list ").html(d + " > " + b);
            $(".contentbox .rArea .date-list-Box .date-list ").attr("condition", c);
            $(".opt-close").parent().show();
            InternalSearch.loadSearchResult()
        })
    },
    getInternalSearchHolder: function() {
        $.ajax({
            url: InternalSearch.getSerachConUrl,
            dataType: "html",
            async: false,
            success: function(b) {
                $("#rightCatalog").html(b);
                bindSortBY(".sortwr", ".sort_select_default", "select", InternalSearch.loadSearchResult);
                InternalSearch.closeclick()
            }
        })
    },
    closeclick: function() {
        $(".opt-close").click(function() {
            $(this).parent().hide();
            $(".lArea .querylist .ql-list li a").removeClass("on");
            InternalSearch.getInternalSearchHolder();
            InternalSearch.loadSearchResult()
        })
    },
    loadSearchResult: function(f) {
        $("html, body").animate({
            scrollTop: $(".journalTabbox").offset().top
        }, 10);
        if (!f) {
            f = 0
        }
        SetSearchTextValue($("#searchtypeVal").val(), $("#searchTxtVal").val());
        $a = $(".sortwr .sort_list li.select a");
        var h = typeof ($a.attr("name")) == "undefined" ? $a.attr("data-map") : $a.attr("name");
        var g = $a.find("i").attr("class").toLowerCase() == "descend" ? "DESC" : "ASC";
        var d = $(".contentbox .rArea .date-list-Box .date-list ").attr("condition");
        var b = encodeURIComponent($.trim($("#J_searchTxt").val()));
        var e = escape($("#searchtype").val());
        var c = {
            pcode: InternalSearch.pCode,
            baseId: InternalSearch.baseId,
            where: e,
            searchText: b,
            condition: d,
            orderby: h,
            ordertype: g,
            scope: InternalSearch.scope,
            pageIndex: f,
            pageSize: 20
        };
        $.post(InternalSearch.getResultListUrl, c, function(i) {
            a = i.length + "";
            if (a == "undefined" || a == "0") {
                var k = "<div style='font-size:20px; text-align:center;line-height: 100px;min-height: 100px;'><font color='red'>!</font>" + Msg.NoResultReSearch + "</div>";
                $(".contentbox .listbox").html(k)
            } else {
                $(".contentbox .listbox .searchresult-list").html(i)
            }
            if ($("#rightCatalog").find(".pagebox").children().length == 0) {
                var j = textPager($("#maxCount").val(), InternalSearch.loadSearchResult, true);
                $(".page-pre").unbind();
                $(".page-next").unbind();
                if ($(".pagebox a").length != 0) {
                    $(".page-pre").click(j.prevPage);
                    $(".page-next").click(j.nextPage)
                }
            }
            $("#partiallistcurrent").html($("#pageIndex").val());
            $("#partiallistcount2").html($("#pageCount").val());
            $("#partiallistcount").html($("#maxCount").val());
            setPageInfo($("#pageIndex").val(), $("#pageCount").val())
        })
    },
    search: function() {
        var b = $.trim($("#J_searchTxt").val());
        var c = $("#J_searchTxt").attr("placeholder");
        if ($.trim(b) == "" || b == c) {
            alert(Msg.NoSearchKeyWord);
            return
        }
        if (InternalSearch.validate(b)) {
            alert(Msg.DangerTips);
            return
        }
        $("#searchResult").show();
        $("#searchResult").click()
    },
    validate: function(d) {
        var b = false;
        var c = /select|update|delete|truncate|join|union|exec|insert|drop|count|’|:|&|"|;|>|<|%/i;
        if (c.test(d)) {
            b = true
        }
        return b
    },
    keyup: function(b) {
        if (b.keyCode == "13") {
            $(".btn-search").click()
        }
    },
    resultHide: function(c, b) {
        var d = $(b).parent().width();
        if ((d + 1) < c) {
            $(b).parent().width(c);
            $(b).html("«")
        } else {
            $(b).parent().css("width", 180);
            $(b).html("»")
        }
    },
    mouseout: function(c) {
        var d = document.getElementById(c);
        var b = this;
        this.in_dom = function(e, f) {
            if (e == f) {
                return true
            } else {
                if (!e.parentNode) {
                    return false
                } else {
                    if (e.parentNode == f) {
                        return true
                    } else {
                        return b.in_dom(e.parentNode, f)
                    }
                }
            }
        }
        ;
        d.onmouseout = function(h) {
            var i = arguments[0] || window.event;
            var f = i.relatedTarget || i.toElement;
            if (!b.in_dom(f, d)) {
                $("#" + c).width(180);
                var g = $("#" + c).find("a.btn-on");
                $(g).html("»")
            }
        }
    }
};
function ShareUrl(h, g, f) {
    if (!f) {
        return
    } else {
        f = RemoveRedMark(f.replace("journalname", $("#shareChName").val())) + "--文献出自中国知网";
        f = RemoveHtmlMark(f)
    }
    var i = $("#sharehost").val();
    var e = i + "?urlInfo=" + encodeURIComponent(g) + "&content=" + encodeURIComponent(f) + "&type=" + h + "&target=custom&cnkiUserKey=" + getRSSCookie("cnkiUserKey");
    if (h == "wy") {
        window.open(e, "_blank", "width=800,height=600, menubar=no, scrollbars=no,resizable=yes,location=no, status=no")
    } else {
        window.open(e, "_blank", "width=480,height=430, menubar=no, scrollbars=no,resizable=yes,location=no, status=no")
    }
}
function getRSSCookie(d, f) {
    if (window.localStorage || window.sessionStorage) {
        if (f == "2") {
            return window.sessionStorage.getItem(d)
        }
        return window.localStorage.getItem(d)
    }
    var e = d + "=";
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(e);
        if (offset != -1) {
            offset += e.length;
            end = document.cookie.indexOf(";", offset);
            if (end == -1) {
                end = document.cookie.length
            }
            return unescape(document.cookie.substring(offset, end))
        }
    }
}
function dingzhi_click() {
    var e = "";
    var b = [];
    $("input[name='chkItem']:checked").each(function() {
        b.push($(this).val())
    });
    if (b.length == 0) {
        alert(Msg.NoDingZhiJournal);
        return
    }
    var d = $("#productID").val().replace("CJFQ", "CJFD");
    var c = $("#naviID").val();
    window.open(app + "/Customize/Customize?ProductID=" + d + "&Param=" + escape(b.join(",")) + "&NaviID=" + c + "&controller=" + $("#controller").val());
    return false
}
function RemoveRedMark(b) {
    while (b.indexOf("</font>") > 0) {
        b = b.replace('<font color="red">', "").replace("</font>", "")
    }
    return b
}
function RemoveHtmlMark(b) {
    while (b.indexOf("</sub>") > 0) {
        b = b.replace("<sub>", "").replace("</sub>", "")
    }
    while (b.indexOf("</sup>") > 0) {
        b = b.replace("<sup>", "").replace("</sup>", "")
    }
    return b
}
$(function() {});
function favbusiness() {
    var d = $("#cllecturl").val();
    e();
    $("body").on("click", ".cllect", function() {
        if ($(this).attr("title") == "已收藏" || $(this).attr("title") == "已收藏在回收站") {
            openKpc("fav_publish");
            return
        }
        if ($(this).attr("title") == Msg.pleaseLogin) {
            OpenLoginPage();
            return
        }
        if (!f()) {
            OpenLoginPage();
            return
        }
        if (c() != "jf") {
            OpenLoginPage();
            return
        }
        var g = b("cllect");
        $.ajax({
            type: "get",
            url: d + "/FavApi/AddFav",
            dataType: "jsonp",
            jsonpCallback: "callback",
            data: g,
            success: function(h) {
                if (h.Code == 1) {
                    $(".cllect").addClass("collected").attr("title", "已收藏");
                    $(".cllect em").text("已收藏")
                } else {
                    alert((typeof (h.Msg) != "undefined" && h.Msg != "") ? h.Msg : "收藏失败,请稍后重试")
                }
            }
        })
    });
    function b(j) {
        var g = getQueryStringArgs();
        var l = g.pcode;
        var h = g.pcode;
        var i = 1;
        var m = "";
        switch (l.toUpperCase()) {
        case "CJFD":
            m = g.pykm;
            break;
        case "CDMD":
            m = g.logo;
            break;
        case "CIPD":
        case "CPFD":
        case "IPFD":
            l = "CIPD";
            h = "CIPD";
            m = $("#lwjcode").val() + ((typeof (g.hycode) == "undefined" || $.trim(g.hycode) == "") ? "" : ("," + g.hycode));
            break;
        case "CPVD":
            m = g.spjcode + ((typeof (g.hycode) == "undefined" || $.trim(g.hycode) == "") ? "" : ("," + g.hycode));
            break;
        case "CCND":
            m = g.bzpym;
            break;
        case "CYFD":
            m = g.pykm;
            break;
        default:
            m = "";
            break
        }
        var k = {};
        if (j == "cllect") {
            k = $.extend(k, {
                filenameOrBaseid: m,
                dbcode: l,
                dbName: h,
                articleType: i
            })
        } else {
            if (j == "ishavecllected") {
                k = $.extend(k, {
                    fnsStr: m,
                    paperType: i
                })
            }
        }
        return k
    }
    function f() {
        var g = false;
        if (GetCookie("LID") != "" && GetCookie("Ecp_LoginStuts") != "") {
            g = true
        }
        return g
    }
    function c() {
        var g = GetCookie("Ecp_LoginStuts");
        if (g == "") {
            return ""
        }
        return JSON.parse(g).UserType
    }
    function e() {
        if ($(".cllect").length == 0) {
            return
        }
        if (!f()) {
            $(".cllect").attr("title", Msg.pleaseLogin);
            return
        }
        if (c() != "jf") {
            $(".cllect").attr("title", "此功能仅对个人用户开放");
            return
        }
        var g = b("ishavecllected");
        $.ajax({
            async: false,
            type: "get",
            url: d + "/FavApi/ExistFav",
            dataType: "jsonp",
            jsonpCallback: "callback",
            data: g,
            success: function(h) {
                if (h.Code == 1) {
                    if (h.Data && h.Data.length == 1 && h.Data[0].fn == g.fnsStr) {
                        var i = h.Data[0].status;
                        if (i == 0) {
                            $(".cllect").addClass("collected").attr("title", "已收藏");
                            $(".cllect em").text("已收藏")
                        }
                    }
                }
            },
            error: function() {}
        })
    }
}
function setViewHisToLocal(k, l, h, j, c) {
    favbusiness();
    if (!window.localStorage) {
        return
    }
    k = k.toUpperCase();
    var g = new Date().Format("MM/dd/yyyy HH:mm:ss");
    var b = {
        code: k,
        text: l,
        url: encodeURI(h),
        baseId: j,
        id: c,
        dt: g
    };
    var d = window.localStorage.getItem("knavi_view_his");
    if (d != "" && d != null) {
        var m = JSON.parse(d);
        if (typeof (m[k]) != "undefined") {
            for (var n = 0; n < m[k].length; n++) {
                if (m[k][n].code == k && m[k][n].text == l && m[k][n].baseId == j && m[k][n].id == c) {
                    m[k].splice(n, 1)
                }
            }
            var f = false;
            for (var n = 0; n < m[k].length; n++) {
                if (m[k][n].url == b.url) {
                    f = true
                }
            }
            if (!f) {
                m[k].unshift(b);
                if (m[k].length > 8) {
                    m[k].splice(8, 1)
                }
            }
        } else {
            m[k] = new Array(b)
        }
        window.localStorage.setItem("knavi_view_his", JSON.stringify(m))
    } else {
        var e = {};
        e[k] = new Array(b);
        window.localStorage.setItem("knavi_view_his", JSON.stringify(e))
    }
}
;