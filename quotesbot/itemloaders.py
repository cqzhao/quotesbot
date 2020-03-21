import scrapy
from items import QuotesbotItem,ArticleItem
from scrapy.loader import ItemLoader
from scrapy.loader.processors import TakeFirst, MapCompose, Join, Compose

def clearnstrip(value:str):
    ref = value.strip().replace("&nbsp","").replace("\r\n","")
    return ref

class QuotesLoader(ItemLoader):
    default_output_processor = TakeFirst()

    text_in = MapCompose()
    author_in = MapCompose()
    tags_in = MapCompose()

class ArticleLoader(ItemLoader):
    default_output_processor = TakeFirst()
    authors_out = MapCompose()
    download_num_in = MapCompose(int)
    keywords_out = MapCompose(clearnstrip)
    references_out = MapCompose()
    pages_in = MapCompose(int)

