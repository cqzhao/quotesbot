# -*- coding: utf-8 -*-
import scrapy
from quotesbot.items import QuotesbotItem
from quotesbot.itemloaders import QuotesLoader
from quotesbot.utils import logger


class ToScrapeSpiderXPath(scrapy.Spider):
    name = 'toscrape-xpath'
    start_urls = [
        'http://quotes.toscrape.com/',
    ]

    def parse(self, response):
        q = QuotesLoader(item=QuotesbotItem(),response=response)
        quote = q.nested_xpath('//div[@class="quote"]')
        quote.add_xpath('text','./span[@class="text"]/text()')
        quote.add_xpath('author','.//small[@class="author"]/text()')
        quote.add_xpath('tags','.//div[@class="tags"]/a[@class="tag"]/text()')
        yield  q.load_item()

        next_page_url = response.xpath('//li[@class="next"]/a/@href').extract_first()
        if next_page_url is not None:
            pagenum = int(next_page_url.split("/")[2])
            logger.info(f"Next Request is page {pagenum}!")
            if pagenum < 5:
                yield scrapy.Request(response.urljoin(next_page_url))

