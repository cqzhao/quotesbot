# -*- coding: utf-8 -*-
import scrapy
from quotesbot.items import ArticleItem
from quotesbot.itemloaders import ArticleLoader
from quotesbot.utils import logger
from MongoHelper import MongoHelper 
from settings import JOURNALCODE,JOURNAL_EN_NAME
import re
import json


class ArticleSpider(scrapy.Spider):
    '''
    用法：python -m scrapy crawl ARTICLE -a journal=原子能科学技术
    journal简称从setting中读取
    start_url从相应的json文件中读取，json文件由journalhelper文件生成
    保存的文件存放在MONGO_DATABASE/journal简称
    json保存着filename
    '''
    name = 'ARTICLE'
    URL_AEST = "http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CJFD&filename="
    REF_BASE_URL_AEST = "http://kns.cnki.net/kcms/detail/frame/list.aspx?dbcode=CJFD&filename=fxxxx&dbname=CJFDTOTAL&RefType=1&vl="
    DBCODE = {
       "中国学术期刊网络出版总库" : "CJFQ",
       "中国优秀硕士学位论文全文数据库" : "CMFD",
       "国际期刊数据库": "SSJD",
       "外文题录数据库": "CRLDENG"
    }
    # def __init__(self):
    #     super.__init__()
    #     self.sql = MongoHelper(self.name)

    def start_requests(self):
        try:
            if self.journal in JOURNALCODE.keys():
                self.journal_code = JOURNALCODE[self.journal]
                self.journal_en = JOURNAL_EN_NAME[self.journal]
            else:
                self.journal_code = "YZJS"
                logger.warning(f"{self.journal} is not found in JOURNALCODE. Using 原子能科学技术 instead.")
        except AttributeError:
            logger.error("No journal is set. \n Usage: python -m scrapy crawl ARTICLE -a journal=原子能科学技术 ")
            exit
        # base url for Atomic Energy Science and Technology
        try:
            with open(f"./jsons/{self.journal_code}.json",'r') as f:
                load_data =  json.load(f)
            newfiles = load_data['newfiles']
        except FileNotFoundError:
            logger.error(f"Can't find json file for {self.journal}. Run journalhelper first.")
            exit

        for ifile in newfiles:
            url = f"{self.URL_AEST}{ifile}"
            yield scrapy.Request(url=url, callback=self.parse,cb_kwargs=dict(filename=ifile))

    def parse(self, response,filename):
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
        aloader = ArticleLoader(item=ArticleItem(),response=response)
        aloader.add_value("filename",filename)
        aloader.add_value("url",response.url)
        aloader.add_value("journal_name_ch",self.journal)
        aloader.add_value("journal_name_en",self.journal_en)
        aloader.add_value("journal_code",self.journal_code)
        aloader.add_xpath("title","//h2[@class='title']/text()")
        aloader.add_xpath("authors","//div[@class='author']//a/text()")
        aloader.add_xpath("abstract","//div[@class='wxBaseinfo']//span[@id='ChDivSummary']/text()")
        aloader.add_xpath("keywords","//div[@class='wxBaseinfo']//label[@id='catalog_KEYWORD']/../a/text()")
        aloader.add_xpath("fenleihao","//div[@class='wxBaseinfo']//label[@id='catalog_ZTCLS']/../text()")
        aloader.add_xpath("found","//div[@class='wxBaseinfo']//label[@id='catalog_FUND']/../a/text()")
        aloader.add_xpath("download_num","//div[@class='info']/div[@class='total']/span[1]/b/text()")
        aloader.add_xpath("pages","//div[@class='info']/div[@class='total']/span[3]/b/text()")
        logger.info(f"Scraping base info. of {filename} of 原子能科学技术")

        # yield a new request for the references of this article
        ref_url = self.REF_BASE_URL_AEST.replace("fxxxx",filename)
        logger.info(f"Scraping ref from {ref_url}")
        yield scrapy.Request(ref_url,callback=self.parseRef,headers=dict(Referer=response.url),
                    cb_kwargs=dict(loader=aloader,filename=filename))

#To-do: 有的没有参考文献例如hdlg201901005 
    def parseRef(self,response,loader,filename,references=None,total_ref_num=0):
        """
        get info about references
        """
        if references is None:
            references = []
            logger.info(f"===Start Scraping references of {filename}")
            total_ref_num = sum(map(int,response.xpath(".//span[@name='pcount']/text()").getall()))
            loader.add_value("ref_num",total_ref_num)
        else:
            pagenumb = int(response.url[response.url.find("page")+5:])
            logger.info(f"======== Scraping references of {filename} at page {pagenumb}")
            # from scrapy.shell import inspect_response
            # inspect_response(response,self)
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
                        yield scrapy.Request(newurl,callback=self.parseRef,cb_kwargs=
                        dict(loader=loader,filename=filename,references=references,total_ref_num=total_ref_num))
                else:
                    newurl=f"{response.url}&CurDBCode={self.DBCODE[reftype]}&page=2"
                    yield scrapy.Request(newurl,callback=self.parseRef,
                    cb_kwargs=dict(loader=loader,filename=filename,references=references,total_ref_num=total_ref_num))
        
        if len(references) >= total_ref_num:
            references = list(set(references))
            logger.info(f"{filename}: Total number of reference is {total_ref_num}, Now We got {len(references)}")
            loader.add_value("references",references)
            logger.info(f"===End Scraping references of {filename}")
            yield loader.load_item()
        else:
            logger.info(f"{filename}: Total number of reference is {total_ref_num}, Now We got {len(references)}")


    def cleanref(self,ref):
        '''
        clearn the references
        return list of references in type of:
        [('[1]','content of reference')]
        '''
        ref = list(map(lambda x:x.strip(),ref))
        ref = list(map(lambda x:x.replace("&nbsp","").replace("\r\n",""),ref))
        pattern = re.compile("(\[\d*?\])")
        m = pattern.split(" ".join(ref))
        return list(zip(m[1::2],m[2::2]))
