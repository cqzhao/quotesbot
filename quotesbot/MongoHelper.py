import pymongo
from settings import MONGO_DATABASE,MONGO_URI
from items import ArticleItem
from typing import Union


class MongoHelper():
    def __init__(self,collection_name):
        self.client = pymongo.MongoClient(MONGO_URI, connect=False)
        self.db = self.client[MONGO_DATABASE]
        self.col = self.db[collection_name]

    def drop_db(self):
        self.client.drop_database(self.db)

    def insert(self, article:Union[dict,ArticleItem]):
        if article:
            self.col.insert_one(dict(article))

    def delete(self, conditions=None):
        if conditions:
            self.col.remove(conditions)
            return ('deleteNum', 'ok')
        else:
            return ('deleteNum', 'None')

    def update(self, conditions: dict=None, value: Union[dict,ArticleItem]=None):
        # update({"UserName":"libing"},{"$set":{"Email":"libing@126.com","Password":"123"}})
        if conditions and value:
            result = self.col.update_many(conditions, {"$set": value})
            return {
                'updateStatus': 'ok',
                'matchedCount':result.matched_count,
                'modifiedCount':result.modified_count}
        else:
            return {'updateStatus': 'fail'}
    

    def url_in_database(self,url: str) -> bool:
        urls = self.col.find({},{'url':1, '_id':0})
        urls = set(map(lambda x:x['url'], urls))
        if url in urls:
            return True
        else:
            return False

# to-do: should be rewriten for article
    def select(self, count: int=None, conditions: dict=None):
        if count:
            count = int(count)
        else:
            count = 0
        if conditions:
            conditions = dict(conditions)
            if 'count' in conditions:
                del conditions['count']
            conditions_name = ['types', 'protocol']
            for condition_name in conditions_name:
                value = conditions.get(condition_name, None)
                if value:
                    conditions[condition_name] = int(value)
        else:
            conditions = {}
        items = self.col.find(conditions, limit=count).sort(
            [("speed", pymongo.ASCENDING), ("score", pymongo.DESCENDING)])
        results = []
        for item in items:
            result = (item['ip'], item['port'], item['score'])
            results.append(result)
        return results


if __name__ == '__main__':
    # import MongoHelper as SqlHelper
    sqlhelper = MongoHelper("YZJS")
    condition = {"ref_num":0,"done":False}
    value = {"done":True}
    status = sqlhelper.update(condition,value)
    print(status)
    # sqlhelper.init_db()
    # # print  sqlhelper.select(None,{'types':u'1'})
    # items= sqlhelper.proxys.find({'types':0})
    # for item in items:
    # print item
    # # # print sqlhelper.select(None,{'types':u'0'})
    pass
