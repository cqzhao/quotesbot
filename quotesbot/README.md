文章地址：
http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CJFD&filename=YZJS

参考文献是单独请求的
路径为：

http://kns.cnki.net/kcms/detail/frame/list.aspx?dbcode=CJFD&filename=yzjs201901002&dbname=CJFDTOTAL&RefType=1&vl=

可能需要在header中增加参数Referer：
Referer: http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CJFD&filename=YZJS201901002

从内部页面可以看到链接如下
内部多余10条的会显示下一页
https://kns.cnki.net/kcms/detail/frame/list.aspx?dbcode=CJFQ&filename=hebg201904003&dbname=CJFDLAST2019&RefType=1&vl=&CurDBCode=CJFQ&page=2
http://kns.cnki.net/kcms/detail/frame/list.aspx?dbcode=CJFD&filename=yzjs201901002&dbname=CJFDTOTAL&RefType=1&vl=&CurDBCode=CRLDENG&page=2
其中：
dbname=CJFDTOTAL 即可
请求多页时，根据文献的不同种类而不同：(不同期刊的不同)
中国学术期刊网络出版总库: CurDBCode=CJFQ
中国优秀硕士学位论文全文数据库 : CurDBCode=CMFD
国际期刊数据库：CurDBCode=SSJD
外文题录数据库：CurDBCode=CRLDENG


<a href="https://kns.cnki.net/kcms/detail/frame/list.aspx?dbcode=CDFD&amp;filename=1019640569.nh&amp;dbname=CDFDLAST2020&amp;RefType=1&amp;vl=&amp;CurDBCode=CJFQ&amp;page=2" class="">2</a>

<a href="https://kns.cnki.net/kcms/detail/frame/list.aspx?dbcode=CDFD&amp;filename=1019640569.nh&amp;dbname=CDFDLAST2020&amp;RefType=1&amp;vl=&amp;CurDBCode=CMFD&amp;page=2" class="">2</a>

<a href="https://kns.cnki.net/kcms/detail/frame/list.aspx?dbcode=CDFD&amp;filename=1019640569.nh&amp;dbname=CDFDLAST2020&amp;RefType=1&amp;vl=&amp;CurDBCode=SSJD&amp;page=2" class="">2</a>