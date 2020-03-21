# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class QuotesbotItem(scrapy.Item):
    # define the fields for your item here like:
    text = scrapy.Field()
    author = scrapy.Field()
    tags = scrapy.Field()

class ArticleItem(scrapy.Item):
    url = scrapy.Field()
    title = scrapy.Field()
    authors = scrapy.Field()
    abstract = scrapy.Field()
    journal_name_ch = scrapy.Field()
    journal_name_en = scrapy.Field()
    short_journal_name_en = scrapy.Field()
    filename = scrapy.Field()
    keywords = scrapy.Field()
    fenleihao = scrapy.Field()
    found = scrapy.Field()
    download_num = scrapy.Field()
    pages = scrapy.Field()
    references = scrapy.Field()
    ref_num = scrapy.Field()
    done = scrapy.Field()