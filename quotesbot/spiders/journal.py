# -*- coding: utf-8 -*-
import scrapy
from quotesbot.items import ArticleItem
from quotesbot.itemloaders import ArticleLoader
from quotesbot.utils import logger
from MongoHelper import MongoHelper 
from scrapy_selenium import SeleniumRequest
import re


class JournalSpider(scrapy.Spider):
    name = 'Journal'
    BASE_URL = "http://navi.cnki.net/KNavi/JournalDetail?pcode=CJFD&pykm="
    JOURNALCODE = {
       "原子能科学与技术" : "YZJS",
       "核动力工程" : "HDLG",
       "核技术": "HJSU",
       "核安全": "HAQY",
       "辐射防护":"FSFH",
       "核聚变与等离子体物理":"HJBY",
       "核科学与工程":"HKXY",
       "辐射防护通讯":"DEFE",
       "中国核电":"ZGHD",
       "核电子学与探测技术":"HERE",
    }
    # def __init__(self):
    #     super.__init__()
    #     self.sql = MongoHelper(self.name)

    def start_requests(self):
        # base url for Atomic Energy Science and Technology
        ref_url = f"{self.BASE_URL}{self.JOURNALCODE['原子能科学与技术']}"
        urls = [
            ref_url
        ]
        for url in urls:
            yield SeleniumRequest(url=url,callback=self.parse,wait_time=3)

    def parse(self, response):
        '''
        parse article
        url = scrapy.Field()
        title = xpath(//h2[@class='title']/text()).get()
        authors = xpath(//div[@class='author']//a/text())
        abstract = xpath(//div[@class='wxBaseinfo']//span[@id='ChDivSummary']/text())
        journal_name_ch = scrapy.Field()
        journal_name_en = scrapy.Field()
        filename = scrapy.Field()
        keywords = //div[@class='wxBaseinfo']//label[@id='catalog_KEYWORD']/../a/text()
        fenleihao = //div[@class='wxBaseinfo']//label[@id='catalog_ZTCLS']/../text()
        found = //div[@class='wxBaseinfo']//label[@id='catalog_FUND']/../a/text()
        download_num = //div[@class='info']/div[@class='total']/span[1]/b/text()
        pages =  //div[@class='info']/div[@class='total']/span[3]/b/text()
        references = //div[@class='essayBox']//li//a/text()
        next_link 
        '''
        from scrapy.shell import inspect_response
        inspect_response(response,self)
        # aloader = ArticleLoader(item=ArticleItem(),response=response)
        # aloader.add_value("filename",filename)
        # aloader.add_value("url",response.url)
        # aloader.add_value("journal_name_ch","原子能科学技术")
        # aloader.add_value("journal_name_en","Atomic Energy Science and Technology")
        # aloader.add_xpath("title","//h2[@class='title']/text()")
        # aloader.add_xpath("authors","//div[@class='author']//a/text()")
        # aloader.add_xpath("abstract","//div[@class='wxBaseinfo']//span[@id='ChDivSummary']/text()")
        # aloader.add_xpath("keywords","//div[@class='wxBaseinfo']//label[@id='catalog_KEYWORD']/../a/text()")
        # aloader.add_xpath("fenleihao","//div[@class='wxBaseinfo']//label[@id='catalog_ZTCLS']/../text()")
        # aloader.add_xpath("found","//div[@class='wxBaseinfo']//label[@id='catalog_FUND']/../a/text()")
        # aloader.add_xpath("download_num","//div[@class='info']/div[@class='total']/span[1]/b/text()")
        # aloader.add_xpath("pages","//div[@class='info']/div[@class='total']/span[3]/b/text()")
        # logger.info(f"Scraping base info. of {filename} of 原子能科学技术")

        # yield a new request for the references of this article
        ref_url = self.REF_BASE_URL_AEST.replace("fxxxx",filename)
        logger.info(f"Scraping ref from {ref_url}")
        yield None
        # yield scrapy.Request(ref_url,callback=self.parseRef,headers=dict(Referer=response.url),
        #             cb_kwargs=dict(loader=aloader,filename=filename))

    def parseRef(self,response,filename,references=None):
        """
        get info about references
        """
        if references is None:
            references = []
            logger.info(f"===Start Scraping references of {filename}")
        else:
            pagenumb = int(response.url[response.url.find("page")+5:])
            logger.info(f"======== Scraping references of {filename} at page {pagenumb}")
        from scrapy.shell import inspect_response
        inspect_response(response,self)
        for iessay in response.css("div.essayBox"):
            # number of essay of this type
            logger.info(f"======== Scraping essaybox")
            num = int(iessay.xpath(".//span[@name='pcount']/text()").get())
            ref = iessay.xpath(".//li//text()").getall()
            references.extend(self.cleanref(ref))
            reftype = iessay.xpath('./div[@class="dbTitle"]/text()').get()
            if num > 10:
                # if exist page page + 1
                if response.url.find("page") >0:
                    pagenumb = int(response.url[response.url.find("page")+5:])
                    if num > pagenumb*10:
                        newurl = response.url.replace(f"page={pagenumb}",f"page={pagenumb+1}")
                        yield scrapy.Request(newurl,callback=self.parseRef,cb_kwargs=dict(filename=filename,references=references))
                else:
                    newurl=f"{response.url}&CurDBCode={self.DBCODE[reftype]}&page=2"
                    yield scrapy.Request(newurl,callback=self.parseRef,cb_kwargs=dict(filename=filename,references=references))
        
        logger.info(f"{references}")
        logger.info(f"===End Scraping references of {filename}")
        yield None

    def cleanref(self,ref):
        '''
        clearn the references
        return list of references in type of:
        [('[1]','content of reference')]
        '''
        ref = list(map(lambda x:x.strip(),ref))
        ref = list(map(lambda x:x.replace("&nbsp","").replace("\r\n",""),ref))
        pattern = re.compile("(\[\d\])")
        m = pattern.split(" ".join(ref))
        return list(zip(m[1::2],m[2::2]))
