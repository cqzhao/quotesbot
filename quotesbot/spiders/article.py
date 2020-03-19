# -*- coding: utf-8 -*-
import scrapy
from quotesbot.items import ArticleItem
from quotesbot.itemloaders import ArticleLoader
from quotesbot.utils import logger
from MongoHelper import MongoHelper 


class ArticleSpider(scrapy.Spider):
    name = 'AEST'
    def __init__(self):
        super.__init__()
        self.sql = MongoHelper(self.name)

    def start_requests(self):
        # base url for Atomic Energy Science and Technology
        URL_AEST = "http://kns.cnki.net/kcms/detail/detail.aspx?dbcode=CJFD&filename=YZJS"
        volume = ["01","02","03","04","05","06","07","08","09","10","11","12","S1","Z1","S2","Z2"]
        
        urls = [
            'http://quotes.toscrape.com/page/1/',
            'http://quotes.toscrape.com/page/2/',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        '''
        url = scrapy.Field()
        title = xpath(//h2[@class='title']/text()).get()
        authors = xpath(//div[@class='author']//a/text())
        abstract = xpath(//div[@class='wxBaseinfo']//span[@id='ChDivSummary']/text())
        journal_name_ch = scrapy.Field()
        journal_name_en = scrapy.Field()
        volume = scrapy.Field()
        keywords = //div[@class='wxBaseinfo']//p[2]/a/text()
        fenleihao = //div[@class='wxBaseinfo']//p[3]/text()
        found = scrapy.Field()
        download_num = //div[@class='info']/div[@class='total']/span[1]/b/text()
        pages =  //div[@class='info']/div[@class='total']/span[3]/b/text()
        references = //div[@class='essayBox']//li//a/text()
        next_link 
        '''
        for quote in response.css("div.quote"):
            q = QuotesLoader(item=QuotesbotItem(),selector=quote)
            q.add_xpath('text','./span[@class="text"]/text()')
            q.add_xpath('author','.//small[@class="author"]/text()')
            q.add_xpath('tags','.//div[@class="tags"]/a[@class="tag"]/text()')
            yield  q.load_item()

        next_page_url = response.xpath('//li[@class="next"]/a/@href').extract_first()
        if next_page_url is not None:
            pagenum = int(next_page_url.split("/")[2])
            logger.info(f"Next Request is page {pagenum}!")
            if pagenum < 5:
                yield scrapy.Request(response.urljoin(next_page_url))

