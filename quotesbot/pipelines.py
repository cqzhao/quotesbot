# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
import pymongo
from quotesbot.utils import logger

class ArticlesPipeline(object):

    def __init__(self,mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls,crawler):
        return cls(
            mongo_uri=crawler.settings.get('MONGO_URI'),
            mongo_db=crawler.settings.get('MONGO_DATABASE', 'items') 
        )
    
    def open_spider(self,spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close_spider(self,spider):
        self.client.close()

    def process_item(self, item, spider):
        logger.info(f"Inserting file {item['filename']} into database")
        collection_name = item['journal_code']
        # check if the scrapy is correctly done
        if "references" in item:
            if len(item["references"]) == item["ref_num"]:
                logger.info(f"{item['filename']} has {len(item['references'])} references in total")
                item['done'] = True
            else:
                logger.info(f"We got {len(item['references'])}/{item['ref_num']} references of {item['filename']}")
                item['done'] = False
        else:
            logger.info(f"No references of {item['filename']} is scrapied.")
            item['done'] = False
        # insert new ones
        # self.db[collection_name].insert_one(dict(item))
        self.db[collection_name].update_one({"url":item['url'],"done":False},{"$set":dict(item)},True)
        return item
