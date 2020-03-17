import scrapy
from items import QuotesbotItem
from scrapy.loader import ItemLoader
from scrapy.loader.processors import TakeFirst, MapCompose, Join, Compose

class QuotesLoader(ItemLoader):
    default_output_processor = TakeFirst()

    text_in = MapCompose()
    author_in = MapCompose()
    tags_in = MapCompose()