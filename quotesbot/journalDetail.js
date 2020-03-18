(function(y) {
    var v = {};
    var l = true;
    var i = getQueryStringArgs();
    var q = i.year;
    var k = i.issue;
    var s = i.entry;
    v.load = function() {
        h();
        bindShareHover();
        bindTabClickHandler(j);
        bindMoreClickHandler();
        bindImageClickHandler();
        if (s) {
            y(".journalTabbox .lArea li").eq(1).click()
        } else {
            y(".journalTabbox .lArea li").eq(0).click()
        }
    }
    ;
    v.getJournalYearList = function(B) {
        if (!B) {
            B = 0
        }
        var A = AppPath + "/JournalDetail/GetJournalYearList?pcode=" + i.pcode + "&pykm=" + i.pykm + "&pIdx=" + B;
        y.get(A, function(C) {
            y("#rightCatalog").html("");
            y("#leftYearTree").html(C);
            var D = y("#leftYearTree .lArea #YearIssueTree #" + q + "_Year_Issue");
            if (q && D.length > 0) {
                B = D.parents("div .yearissuepage").attr("pageindex")
            }
            u(B);
            a(".lArea", y("#totalCnt").val(), u, B);
            if (q && D.length > 0) {
                D.children("dt").click()
            } else {
                if (y("#NetFirstYear dt em:eq(0)").length > 0) {
                    y("#NetFirstYear dt em:eq(0)").trigger("click")
                } else {
                    y(".s-dataList dt:eq(0)").trigger("click")
                }
            }
        })
    }
    ;
    v.displayPanel = function(A) {
        A = y(A);
        A.next().show()
    }
    ;
    v.hiddenPanel = function(A) {
        A = y(A);
        A.parent().hide()
    }
    ;
    var h = function() {
        var A = "";
        y("#JournalBaseInfo li").each(function(D, C) {
            if (D == 1) {
                var B = y(C).children().length;
                if (B > 3) {
                    y(C).children().each(function(E, F) {
                        if (E > 2) {
                            A += F.outerHTML;
                            y(F).remove()
                        }
                    })
                }
            }
            if (D == 2 && A != "") {
                y(C).html(A)
            }
        });
        A = "";
        y("#publishInfo li").each(function(D, C) {
            if (D == 1) {
                var B = y(C).children().length;
                if (B > 3) {
                    y(C).children().each(function(E, F) {
                        if (E > 2) {
                            A += F.outerHTML;
                            y(F).remove()
                        }
                    })
                }
            }
            if (D == 2 && A != "") {
                y(C).html(A)
            }
        });
        A = "";
        y("#evaluateInfo li").each(function(D, C) {
            if (D == 1) {
                var B = y(C).children().length;
                if (B > 3) {
                    y(C).children().each(function(E, F) {
                        if (E > 2) {
                            A += F.outerHTML;
                            y(F).remove()
                        }
                    })
                }
            }
            if (D == 2 && A != "") {
                y(C).html(A)
            }
        })
    };
    var j = function(A, B) {
        y("#rightCatalog").html("");
        y("#leftYearTree").html(Msg.Loading);
        if (A == "selectjournal") {
            JournalDetail.getJournalYearList(0)
        } else {
            if (A == "selectprograma") {
                JournalDetail.getColLayerList(0)
            } else {
                if (A == "selectstatistics") {
                    JournalDetail.getStatLayerList()
                } else {
                    if (A == "searchResult") {
                        var C = (typeof (i.scode) != "undefined") ? i.scode : i.pcode;
                        C = (C == "undefined") ? "" : C;
                        InternalSearch.pCode = C;
                        InternalSearch.baseId = i.pykm;
                        InternalSearch.getGoupUrl = AppPath + "/JournalDetail/GetInternalSearchGroupInfo";
                        InternalSearch.getSerachConUrl = AppPath + "/JournalDetail/GetInternalSearchHolder";
                        InternalSearch.getResultListUrl = AppPath + "/JournalDetail/GetArticleDataXsltByInternalSearch";
                        InternalSearch.getSearchResultLayerList()
                    }
                }
            }
        }
    };
    v.getColLayerList = function(F) {
        y("#rightCatalog").html("");
        y("#leftYearTree").html(Msg.Loading);
        var E = AppPath + "/JournalDetail/GetColLayerListHolder";
        y.get(E, function(G) {
            y("#leftYearTree").html(G);
            B();
            A();
            C();
            D();
            r();
            y(".filterbox .cur").click()
        });
        var B = function() {
            y("#layerAll").click(function() {
                d(this, 10)
            })
        };
        var A = function() {
            y("#recentOne").click(function() {
                d(this, 1)
            })
        };
        var C = function() {
            y("#recentThree").click(function() {
                d(this, 3)
            })
        };
        var D = function() {
            y("#recentFive").click(function() {
                d(this, 5)
            })
        }
    }
    ;
    var a = function(B, A, E, D) {
        var C = {
            items_per_page: 20,
            num_display_entries: 5,
            num_edge_entries: 0,
            current_page: D,
            link_to: "javascript:void(0);",
            prev_text: "<",
            next_text: ">",
            ellipse_text: "...",
            prev_show_always: false,
            next_show_always: false,
            total_show: false
        };
        C.initial_load = false;
        C.callback = function(F) {
            E.call(this, F)
        }
        ;
        if (B == undefined) {
            y(".page-list").pagination(A, C)
        } else {
            y(B).children(".page-list").pagination(A, C)
        }
    };
    var u = function(A) {
        y("#leftYearTree .lArea #YearIssueTree .yearissuepage").eq(A).show().siblings().hide();
        if (A == 0) {
            y("#leftYearTree .lArea #YearIssueTree #NetFirstYear").show()
        }
        if (!l) {
            y("html, body").animate({
                scrollTop: y(".journalTabbox").offset().top
            }, 10)
        }
    };
    v.BindYearClick = function(B) {
        addCurClass(y("#YearIssueTree dl"), y(B).parents("dl"));
        y("#YearIssueTree dd").hide();
        y(B).parents("dl").find("dd").show();
        if (y(B).parents("#NetFirstYear").length > 0) {
            y(B).addClass("on").siblings("em").removeClass("on");
            var A = y(B).attr("type");
            v.loadpublishtypecontent(A);
            if (y("#yxsfsj span:eq(0)").length > 0) {
                y("#yxsfsj span:eq(0)").trigger("click")
            }
        } else {
            f(B)
        }
    }
    ;
    v.loadpublishtypecontent = function(B, D) {
        var A = AppPath + "/JournalDetail/GetTPublishTypeContent";
        var C = {
            pcode: i.pcode,
            pykm: i.pykm,
            type: B
        };
        y.ajax({
            url: A,
            data: C,
            dataType: "html",
            async: false,
            beforeSend: function() {
                y("#pub_type_content").html("正在加载...")
            },
            success: function(E) {
                y("#pub_type_content").html(E);
                if (D) {
                    D()
                }
            }
        })
    }
    ;
    v.ZQ_YearClick = function(B) {
        addCurClass(y("#pub_type_content span"), B, "current");
        if (y(this).text() != "全部") {
            var A = function(E) {
                var D = y("#yxsfsj").attr("type");
                var C = AppPath + "/JournalDetail/GetYxSfSjYearOutline";
                var F = {
                    pcode: i.pcode,
                    pykm: i.pykm,
                    year: y(B).text(),
                    pIdx: E,
                    type: D
                };
                n(F.year, F.issue);
                y("#CataLogContent").html(Msg.Loading);
                if (!l) {
                    y("html, body").animate({
                        scrollTop: y(".journalTabbox").offset().top
                    }, 10)
                }
                y.post(C, F, function(G) {
                    y("#CataLogContent").html(G);
                    if (y("#articleCount").val() != "0" && y(".pagebox a").length == 0) {
                        textPager(y("#articleCount").val(), A, true)
                    }
                })
            };
            t(A, y(B).text().trim())
        }
    }
    ;
    v.nfAllClick = function() {
        addCurClass(y("#pub_type_content span"), y("#nfAll"), "current");
        var A = y("#NetFirstYear dt em.on").text() + "(" + Msg.All + ")";
        t(w, A)
    }
    ;
    var w = function(C) {
        var B = AppPath + "/JournalDetail/GetnfAllOutline";
        var A = y("#yxsfsj").attr("type");
        var D = {
            pykm: i.pykm,
            pcode: i.pcode,
            pageIdx: C,
            type: A
        };
        y("#CataLogContent").html(Msg.Loading);
        if (!l) {
            y("html, body").animate({
                scrollTop: y(".journalTabbox").offset().top
            }, 10)
        }
        y.post(B, D, function(E) {
            y("#CataLogContent").html(E);
            if (y("#articleCount").val() != "0" && y(".pagebox a").length == 0) {
                textPager(y("#articleCount").val(), w, true)
            }
            l = false
        })
    };
    var t = function(B, C) {
        var A = AppPath + "/JournalDetail/GetArticleListHolder";
        y("#rightCatalog").load(A, function() {
            p(C, ".s-datalistbox .cur .current");
            y("#larrow").hide();
            y("#rarrow").hide();
            B(0)
        })
    };
    v.BindIssueClick = function(D) {
        var C = y(D).attr("id");
        if (C == undefined || C.length == 0) {
            return
        }
        var B = C.substr(2, 4);
        var A = C.substr(6, 2);
        b(B, A);
        addCurClass(y(D).parent().children(), D, "current")
    }
    ;
    var f = function(D) {
        if (y(D).parent().children().length > 1) {
            addCurClass(y(D).siblings().children(), y(D).siblings().children().first(), "current");
            var C = y("#leftYearTree .lArea #YearIssueTree #" + q + "_Year_Issue");
            var E = y("#leftYearTree .lArea #YearIssueTree #" + q + "_Year_Issue #yq" + q + k);
            if (y(D).parent("dl").attr("id") == C.attr("id") && E && E.length > 0) {
                E.click()
            } else {
                y(D).siblings().children().first().click()
            }
            return
        }
        var B = y.trim(y(D).children().first().text());
        var A = AppPath + "/JournalDetail/GetJournalIssues?pcode=" + i.pcode + "&pykm=" + i.pykm + "&year=" + B;
        y.get(A, function(G) {
            var F = G.length;
            if (F == 0) {
                return
            }
            var I = "<dd>", H;
            for (H = 0; H < F; H++) {
                I += "<a id='yq" + B + G[H] + "' onclick='JournalDetail.BindIssueClick(this)'>No." + G[H] + "</a>"
            }
            I += "</dd>";
            y(D).parent().append(I);
            y("#yq" + B + G[0]).click()
        });
        y("#yq" + B + jData[0]).click()
    };
    var n = function(C, B) {
        if (typeof (C) != "undefined" && C.length > 0 && C != "single" && typeof (B) != "undefined" && B.length > 0 && B != "le") {
            var A = y("#J_journalPicpic-book").val();
            A = A + C + B + ".jpg";
            y("#J_journalPicpic-book").next("img").attr("src", A);
            if (C < 2008 && y("#J_journalPic .icon-issue").length > 0) {
                y("#J_journalPic .icon-issue").hide()
            } else {
                if (C >= 2008 && y("#J_journalPic .icon-issue").length > 0) {
                    y("#J_journalPic .icon-issue").show()
                }
            }
        }
    };
    var b = function(D, C, E) {
        if (E == undefined) {
            E = 0
        }
        n(D, C);
        var A = AppPath + "/JournalDetail/GetArticleListHolder";
        y("#rightCatalog").load(A, function() {
            p(D + Msg.Year + C + Msg.Qi, ".s-datalistbox .cur .current");
            var F = AppPath + "/JournalDetail/GetIfFileExist?year=" + D + "&issue=" + C + "&pykm=" + i.pykm;
            y.get(F, function(H) {
                if (H.toLowerCase() == "true") {
                    if (e().indexOf("IE") > -1) {
                        y("#originalCatalog").attr("style", "");
                        m();
                        l = false
                    } else {
                        var G = "<div class='title1' style='font-weight: bold; padding-top: 5px;'><span style='color: #53a2e3; padding-left:20px;'>" + Msg.Notes + "</span><span style='color: #53a2e3'>" + Msg.YuanBanCatalogTips + "</span></div>";
                        y("#rightCatalog .optsbox ").append(G)
                    }
                }
            });
            B(D, C, E)
        });
        var B = function(H, G, J) {
            var I = (typeof (i.scode) != "undefined") ? i.scode : i.pcode;
            I = (I == "undefined") ? "" : I;
            var F = AppPath + "/JournalDetail/GetArticleList?year=" + H + "&issue=" + G + "&pykm=" + i.pykm + "&pageIdx=" + J + "&pcode=" + I;
            y("#CataLogContent").html(Msg.Loading);
            y.post(F, function(L) {
                y("#CataLogContent").html(L)
            });
            var K = function(L) {
                return B(H, G, L)
            }
        }
    };
    var z = function() {
        var B = y(".s-datalistbox .cur").prop("outerHTML");
        var A = y("#leftYearTree .page-list .cur").html();
        y("#yearPagerDom").text("");
        y("#yearPagerDom").attr("value", y(".s-datalistbox .cur").attr("id"));
        y("#yearPagerDom").attr("page", A);
        y("#yearPagerDom").append(B)
    };
    var c = function() {
        var B = y("#yearPagerDom").attr("value");
        var A = y("#yearPagerDom").html();
        y("#YearIssueTree #NetFirstYear").removeClass("cur");
        if (y("#YearIssueTree #" + B).length > 0) {
            y("#YearIssueTree #" + B).replaceWith(A)
        }
    };
    var p = function(F, B) {
        y(".date-list").text(F);
        y(".date-list").attr("value", y(B).attr("id"));
        if (y(B).parents(".sl-tab-list").attr("id") == "NFSingle") {
            if (F.length > 2) {
                y(".date-list").attr("value", "NFSingle-" + y(B).eq(1).attr("id"))
            } else {
                y(".date-list").attr("value", "NFSingle-nfAll")
            }
        } else {
            if (y(B).parents(".sl-tab-list").attr("id") == "NFWhole") {
                y(".date-list").attr("value", "NFWhole-" + y(B).eq(1).attr("id"))
            }
        }
        var A = y(B).prev();
        if (A.length == 0) {
            y("#rarrow").addClass("btn-rarrow disable")
        }
        var C = y(B).next();
        if (C.length == 0) {
            y("#larrow").addClass("btn-larrow disable")
        }
        var D = function() {
            y("#rarrow").click(function() {
                g(B);
                var G = y(B).prev();
                if (G.length != 0) {
                    if (y.nodeName(G[0], "a")) {
                        G.click()
                    } else {
                        G.find("a").click()
                    }
                }
            })
        };
        var E = function() {
            y("#larrow").click(function() {
                g(B);
                var G = y(B).next();
                if (G.length != 0) {
                    if (y.nodeName(G[0], "a")) {
                        G.click()
                    } else {
                        G.find("a").click()
                    }
                }
            })
        };
        D();
        E()
    };
    var g = function(A) {
        var B = y(A).parents("div .yearissuepage").attr("pageindex");
        u(B);
        a(".lArea", y("#totalCnt").val(), u, B)
    };
    var m = function() {
        y("#originalCatalog").click(function() {
            y("#originalCatalogview").html(Msg.Loading);
            var B = y(".s-datalistbox .cur .current").attr("id").substr(2, 4);
            var A = y(".s-datalistbox .cur .current").attr("id").substr(6, 2);
            var C = i.pykm + B + A;
            var D = Math.random();
            y.get(AppPath + "/JournalDetail/GetOrgCtgImageUrl", {
                filename: C,
                number: D
            }, function(E) {
                y("#originalCatalogview").html(E);
                if (e() == "FF" || e() == "SF") {
                    y("#originalCatalogview .content").find("div").eq(0).html("<span style='color: #53a2e3;padding-left:20px;'>" + Msg.Notes + "</span><span style='color: #53a2e3'>" + Msg.PrintTips + "</span>")
                }
                y("#originalCatalog1").show();
                y("#originalCatalog").hide()
            })
        });
        y("#originalCatalog1").click(function() {
            y("#originalCatalogview").html("");
            y("#originalCatalog1").hide();
            y("#originalCatalog").show();
            y(".s-datalistbox .cur .current").click()
        })
    };
    var d = function(B, C, E) {
        if (!E) {
            E = 0
        }
        if (C == undefined) {
            C = ""
        }
        window.scrollTo(0, 400);
        addCurClass(y(B).parent().children(), B);
        var D = (typeof (i.scode) != "undefined") ? i.scode : i.pcode;
        D = (D == "undefined") ? "" : D;
        var A = AppPath + "/JournalDetail/GetColLayerList?pcode=" + D + "&pykm=" + i.pykm + "&year=" + C + "&pIdx=" + E;
        y("#programaLevelallpage").html(Msg.Loading);
        y.get(A, function(K) {
            var J = K.length;
            if (y.trim(K) == "<p>" + Msg.NoData + "</p>") {
                y("#programaLevelallpage").html(K);
                y(".page-list").html("");
                y("#rightCatalog").html("");
                return
            }
            y("#programaLevelallpage").html(K);
            var G = y("#layerPageAllCnt").val();
            var H = y(".date-list").attr("value") && y(".date-list").attr("value").length > 0 ? false : true;
            var I = y("#leftYearTree .lArea #programaLevelallpage a[title='" + s + "']");
            if (C == 10 && s && I.length > 0 && H) {
                E = I.parents("ul").attr("pageindex")
            }
            F(E);
            a("#programaLevelall", G, F, E);
            r();
            if (C == 10 && s && I.length > 0 && H) {
                I.click()
            } else {
                y(".lArea div[id^='programaLevel'] ul li a").first().click()
            }
        });
        var F = function(G) {
            y(".lArea div[id='programaLevelallpage'] ul").eq(G).show().siblings().hide();
            if (!l) {
                y("html, body").animate({
                    scrollTop: y(".journalTabbox").offset().top
                }, 10)
            }
        }
    };
    var r = function() {
        y(".lArea div[id^='programaLevel'] ul li a").click(function() {
            addCurClass(y(".filterResult.clearfix").children(), y(this).parent(), "select");
            A()
        });
        var A = function() {
            y("#rightCatalog").html(Msg.Loading);
            var D = AppPath + "/JournalDetail/GetColLayerArticlesHolder";
            var E = (typeof (i.scode) != "undefined") ? i.scode : i.pcode;
            E = (E == "undefined") ? "" : E;
            var C = {
                pykm: i.pykm,
                pcode: E,
                year: y(".filterbox .cur a").attr("id"),
                colLayer: y(".filterResult li.select a").text(),
                orderBy: "RT|DESC",
                pidx: 0
            };
            y.post(D, C, function(F) {
                y("#rightCatalog").html(F);
                var H = y(".filterResult li.select a").text();
                y(".date-list").attr("value", H);
                y(".date-list").text(y(".programaNearYear").children(".cur").children("a").text() + " > " + H);
                var G = textPager(parseInt(y("#partiallistcount").text()), B, true);
                bindSortBY(".sortwr", ".sort_select_default", "select", B);
                y(".page-pre").click(function() {
                    if (y(".pagebox a.prev")) {
                        y(".pagebox a.prev").click()
                    }
                });
                y(".page-next").click(function() {
                    if (y(".pagebox a.next")) {
                        y(".pagebox a.next").click()
                    }
                });
                setPageInfo(y("#partiallistcurrent").text(), y("#partiallistcount2").text());
                l = false
            })
        };
        var B = function(E) {
            if (E == undefined) {
                E = 0
            }
            if (!l) {
                y("html, body").animate({
                    scrollTop: y(".journalTabbox").offset().top
                }, 10)
            }
            y(".searchresult-list").html(Msg.Loading);
            var D = AppPath + "/JournalDetail/GetArticleListByCollayer";
            var C = {
                pykm: i.pykm,
                pcode: "CJFD",
                year: y(".filterbox .cur a").attr("id"),
                colLayer: y(".filterResult li.select a").text(),
                orderBy: y(".sort_list li.select a").attr("data-map").concat(y(".sort_list li.select a i").hasClass("descend") ? "|DESC" : "|ASC"),
                pidx: typeof (E) == "undefined" ? 0 : E
            };
            y.post(D, C, function(F) {
                y(".searchresult-list").html(F);
                if (F != null) {
                    y("#partiallistcurrent").text(E + 1);
                    setPageInfo(y("#partiallistcurrent").text(), y("#partiallistcount2").text())
                }
                if (y(".pagebox").html().length == 0) {
                    textPager(parseInt(y("#partiallistcount").text()), B, true);
                    setPageInfo(y("#partiallistcurrent").text(), y("#partiallistcount2").text())
                }
            })
        }
    };
    var o = function() {
        y(".journalTabbox .rArea .btn-search").click(function() {
            x()
        })
    };
    var x = function() {
        alert("NoResult")
    };
    v.getStatLayerList = function() {
        var A = AppPath + "/JournalDetail/GetJournalStatRight?pcode=" + i.pcode + "&pykm=" + i.pykm + "&year=10";
        y.get(A, function(I) {
            y("#rightCatalog").html("");
            y("#rightCatalog").html(I);
            if (navigator.userAgent.indexOf("MSIE") > 0) {
                var F = navigator.appName;
                var B = navigator.appVersion;
                var H = B.split(";");
                var G = H[1].replace(/[ ]/g, "");
                if (F == "Microsoft Internet Explorer" && G == "MSIE7.0" || F == "Microsoft Internet Explorer" && G == "MSIE8.0") {
                    D("#yearcontainer", "10", "11");
                    D("#Foundationcontainer", "10", "11");
                    function D(L, K, J) {
                        xLabels = y(L).find(".highcharts-axis-labels");
                        xLabels.find("span").css({
                            "font-size": K + "px",
                            "margin-left": J + "px"
                        });
                        y(L).find(".highcharts-axis span").css("white-space", "normal")
                    }
                    y(".yearcontainer .sel_cnt").find("a").click(function() {
                        text = parseInt(y(this).html());
                        if (text == 30) {
                            D("#yearcontainer", "9", "18")
                        } else {
                            D("#yearcontainer", "10", "11")
                        }
                    });
                    y(".Foundationcontainer .sel_cnt").find("a").click(function() {
                        text = parseInt(y(this).html());
                        if (text == 30) {
                            D("#Foundationcontainer", "9", "18")
                        } else {
                            D("#Foundationcontainer", "10", "11")
                        }
                    });
                    E("#Keycontainer");
                    E("#Entrycontainer");
                    function E(J) {
                        xLabels = y(J).find(".highcharts-axis-labels");
                        xLabels.find("span").each(function() {
                            defaultW = y(this).width();
                            defaultLeft = parseInt(y(this).css("left"));
                            y(this).css({
                                left: defaultLeft + (defaultW - 22) + "px",
                                width: "38px",
                                "text-align": "center"
                            })
                        });
                        y(J).find(".highcharts-axis span").css("white-space", "normal")
                    }
                }
            }
            var C = AppPath + "/JournalDetail/GetJournalStatLeft";
            y.get(C, function(J) {
                y("#leftYearTree").html("");
                y("#leftYearTree").html(J)
            })
        })
    }
    ;
    v.KeycontainerClick = function(E) {
        var F = y("#keyBrokenSelect").val();
        var A = "";
        if (F != "" && F.indexOf("," + E.point.category + ",") >= 0) {
            if (F.split(",")[F.split(",").length - 2] == E.point.category) {
                return
            } else {
                A = F.replace("," + E.point.category + ",", ",") + "," + E.point.category + ",";
                y("#keyBrokenSelect").val(A)
            }
        } else {
            if (F == "") {
                A = "," + E.point.category + ","
            } else {
                A = F + E.point.category + ","
            }
            y("#keyBrokenSelect").val(A)
        }
        var B = i.pykm;
        var D = i.pcode;
        var C = "10";
        y.ajax({
            url: AppPath + "/JournalDetail/KeycontainerClick",
            type: "Post",
            data: {
                keynames: A,
                pykm: B,
                pcode: D,
                year: C
            },
            success: function(L) {
                y("#keyBroken").html(L);
                if (navigator.userAgent.indexOf("MSIE") > 0) {
                    var G = navigator.appName;
                    var H = navigator.appVersion;
                    var I = H.split(";");
                    var K = I[1].replace(/[ ]/g, "");
                    if (G == "Microsoft Internet Explorer" && K == "MSIE7.0" || G == "Microsoft Internet Explorer" && K == "MSIE8.0") {
                        J("#BrokenKeycontainer", "9", "18");
                        J("#BrokenKey2container", "9", "18");
                        function J(O, N, M) {
                            xLabels = y(O).find(".highcharts-axis-labels");
                            xLabels.find("span").css({
                                "font-size": N + "px",
                                "margin-left": M + "px"
                            });
                            y(O).find(".highcharts-axis span").css("white-space", "normal")
                        }
                    }
                }
            },
            error: function(I, G, H) {}
        })
    }
    ;
    var e = function() {
        var D = navigator.userAgent;
        var F = D.indexOf("Opera") > -1;
        var I = D.indexOf("compatible") > -1 && D.indexOf("MSIE") > -1 && !F;
        var G = D.indexOf("Edge") > -1 && !I;
        var E = D.indexOf("Firefox") > -1;
        var A = D.indexOf("Safari") > -1 && D.indexOf("Chrome") == -1;
        var H = D.indexOf("Chrome") > -1 && D.indexOf("Safari") > -1;
        if (I) {
            var B = new RegExp("MSIE (\\d+\\.\\d+);");
            B.test(D);
            var C = parseFloat(RegExp["$1"]);
            if (C == 7) {
                return "IE7"
            } else {
                if (C == 8) {
                    return "IE8"
                } else {
                    if (C == 9) {
                        return "IE9"
                    } else {
                        if (C == 10) {
                            return "IE10"
                        } else {
                            if (C == 11) {
                                return "IE11"
                            } else {
                                return "0"
                            }
                        }
                    }
                }
            }
        }
        if (!!window.ActiveXObject || "ActiveXObject"in window) {
            return "IE"
        }
        if (G) {
            return "Edge"
        }
        if (E) {
            return "FF"
        }
        if (F) {
            return "OP"
        }
        if (A) {
            return "SF"
        }
        if (H) {
            return "CR"
        }
    };
    window.JournalDetail = v
}
)(jQuery);
$(document).ready(function() {
    JournalDetail.load()
});
