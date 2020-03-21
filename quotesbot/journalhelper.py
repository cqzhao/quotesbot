from selenium import webdriver
from scrapy import Selector
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re
import settings
import logging
import pymongo
import time

# 设置日志输出格式
logging.basicConfig(level=logging.DEBUG,
                    filename="journalhelper.log",
                    format='[%(asctime)-15s] [%(levelname)8s] [%(name)10s ] - %(message)s (%(filename)s:%(lineno)s)',
                    datefmt='%Y-%m-%d %T'
                    )
logger = logging.getLogger(__name__)

class JournalHelper():
    BASE_URL = "http://navi.cnki.net/KNavi/JournalDetail?pcode=CJFD&pykm="
    def __init__(self,journalname=None):
        if journalname in settings.JOURNALCODE.keys():
            self.journal_short_name = settings.JOURNALCODE[journalname]
        else:
            self.journal_short_name = "YZJS"
            logger.warning(f"{journalname} doesn't exist in JOURNALCODE. Default 原子能科学与技术 is used.")
        self.url = f"{self.BASE_URL}{self.journal_short_name}"
        self.allpapers = list()
        self.journalname = journalname
        self.pattern = re.compile("filename=YZJS(.*?)&tableName")
    
    def init_db(self):
        self.mongo_uri = settings.MONGO_URI 
        self.mongo_db = settings.MONGO_DATABASE
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]
        self.col = self.db['journals']
    
    def close_db(self):
        self.client.close()
    
    def getall(self):
        '''
        get all article filename, stored in self.allpapers
        '''
        driver = webdriver.Firefox()
        driver.get(self.url)
        WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,"//div[@class='page-list']")),"Can't load")
        firstpage = Selector(text=driver.page_source)
        page_num = len(firstpage.css("div.page-list").xpath(".//a[@href]").getall())
        cur_page = 1
        while(cur_page<=page_num):
            # for one page
            yearissuepage = driver.find_element_by_xpath("//div[@class='yearissuepage' and @style='']")
            for iyear in yearissuepage.find_elements_by_xpath("./dl"):
                iyear_name = iyear.get_property("id").split("_")[0]
                iyear.click()
                logger.debug(f"Click year {iyear_name}")
                time.sleep(9)
                WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,"//div[@class='yearissuepage' and @style='']//dd[@style='']")),"Can't load")
                for ivol in iyear.find_elements_by_xpath("./dd/a"):
                    ivol_name = ivol.get_property("id")
                    ivol.click()
                    logger.debug(f"Click year {iyear_name} vol {ivol_name}")
                    time.sleep(9)
                    WebDriverWait(driver,10).until(EC.presence_of_element_located((By.ID,"CataLogContent")),"Can't load")
                    page = Selector(text=driver.page_source)
                    hrefs = page.css("dd.clearfix").xpath("./span/a/@href").getall()
                    for ip in list(map(lambda x:self.pattern.search(x).group(1),hrefs)):
                        logger.debug(f"Saving file {ip} of year {iyear_name} vol {ivol_name}")
                        self.allpapers.append({
                            "year":iyear_name,
                            "vol":ivol_name,
                            "filename":ip,
                            "journalname":self.journal_short_name,
                        })
            # click for next page
            pagelist = driver.find_element_by_xpath("//div[@class='page-list']")
            nextpage = pagelist.find_element_by_class_name("next")
            nextpage.click()
            logger.debug("Click next page")
            time.sleep(9)
            WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,"//div[@class='yearissuepage' and @style='']")),"Can't load")
        driver.quit()
        self.save()
    
    def save(self):
        '''
        save self.allpapers into database
        '''
        self.init_db()
        # newpapers = []
        # for ipaper in self.allpapers:
        #     #check if this paper exists
        #     if self.col.find_one({"filename":ipaper['filename'],"journalname":ipaper['journalname']}):
        #         # this has been inserted
        #         pass
        #     else:
        #         ipaper["done"] = 0
        #         newpapers.append(ipaper)
        
        # insert new papers
        count = 0
        for ipaper in self.allpapers:
            # if doesn't exist, it will be inserted
            result = self.col.update_one({"filename":ipaper['filename'],"journalname":ipaper['journalname']},{'$set':ipaper},True)
            if result.upserted_id:
                count = count + 1
        logger.info(f"{count} papers are inserted into database")
        self.close_db()

if __name__ == "__main__":
    journal = JournalHelper("原子能科学与技术")
    journal.getall()