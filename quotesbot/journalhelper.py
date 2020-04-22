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
import json

# 设置日志输出格式
logger = logging.getLogger(__name__)
logger.setLevel(level = logging.DEBUG)
filehandler = logging.FileHandler("journalhelper.log")
filehandler.setLevel(logging.DEBUG)
formatter = logging.Formatter('[%(asctime)-15s] [%(levelname)8s] [%(name)10s ] - %(message)s (%(filename)s:%(lineno)s)', datefmt='%Y-%m-%d %T')
filehandler.setFormatter(formatter)

console = logging.StreamHandler()
console.setLevel(logging.DEBUG)
console.setFormatter(formatter)

logger.addHandler(filehandler)
logger.addHandler(console)

class JournalHelper():
    BASE_URL = "http://navi.cnki.net/KNavi/JournalDetail?pcode=CJFD&pykm="
    def __init__(self,journalname=None):
        if journalname in settings.JOURNALCODE.keys():
            self.journal_code = settings.JOURNALCODE[journalname]
        else:
            self.journal_code = "YZJS"
            logger.warning(f"{journalname} doesn't exist in JOURNALCODE. Default 原子能科学与技术 is used.")
        self.url = f"{self.BASE_URL}{self.journal_code}"
        self.allpapers = list()
        self.journalname = journalname
        self.pattern = re.compile("filename=(.*?)&tableName")
    
    def init_db(self):
        self.mongo_uri = settings.MONGO_URI 
        self.mongo_db = settings.MONGO_DATABASE
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]
        self.col = self.db['journals']
    
    def close_db(self):
        self.client.close()
    
    def get_year_volume(self,year="2020",volume=None):
        '''
        get filename of specific year and specific volume,default all volumes.
        '''
        driver = webdriver.Firefox()
        if isinstance(year,list):
            allyears = year
        else:
            allyears = [year]
        try:
            for iyear in allyears:
                articles = []
                driver.get(self.url)
                WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,"//div[@class='page-list']")),"Can't load page-list")
                time.sleep(5)
                firstpage = Selector(text=driver.page_source)
                divthisyear = firstpage.css("div.yearissuepage").xpath(f"./dl[@id='{iyear}_Year_Issue']/..")
                if divthisyear.xpath("@style").get() != "":
                    #this div is not displayed
                    pageindex = int(divthisyear.xpath("@pageindex").get())
                    # click the page
                    pagelist = driver.find_element_by_xpath("//div[@class='page-list']")
                    thepage = pagelist.find_element_by_link_text(f"{pageindex+1}")
                    thepage.click()
                    logger.debug(f"Click page {pageindex+1}")
                    time.sleep(9)
                    WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,"//div[@class='yearissuepage' and @style='']")),"Can't load")
                yearissuepage = driver.find_element_by_xpath("//div[@class='yearissuepage' and @style='']")
                WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,f"//dl[@id='{iyear}_Year_Issue']")),f"Can't load {iyear}_Year_Issue")
                theyear = yearissuepage.find_element_by_xpath(f"./dl[@id='{iyear}_Year_Issue']")
                theyear.click()
                logger.debug(f"Click year {iyear}")
                time.sleep(9)
                WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,"//div[@class='yearissuepage' and @style='']//dd[@style='display: block;' or @style='']")),"Can't load")
                # find the vol to click
                if volume is None:
                    for ivol in theyear.find_elements_by_xpath("./dd/a"):
                        ivol_name = ivol.get_property("id")
                        ivol.click()
                        logger.debug(f"Click year {iyear} vol {ivol_name}")
                        time.sleep(9)
                        WebDriverWait(driver,10).until(EC.presence_of_element_located((By.ID,"CataLogContent")),"Can't load")
                        page = Selector(text=driver.page_source)
                        hrefs = page.css("dd.clearfix").xpath("./span/a/@href").getall()
                        for ip in list(map(lambda x:self.pattern.search(x).group(1),hrefs)):
                            logger.debug(f"Saving file {ip} of year {iyear} vol {ivol_name}")
                            articles.append({
                                "year":year,
                                "vol":ivol_name,
                                "filename":ip,
                                "journalcode":self.journal_code,
                            })
                else:
                    thevol = theyear.find_element_by_xpath(f"./dd/a[text()='No.{volume}']")
                    thevol.click()
                    logger.debug(f"Click year {iyear} vol {volume}")
                    time.sleep(9)
                    WebDriverWait(driver,10).until(EC.presence_of_element_located((By.ID,"CataLogContent")),"Can't load")
                    page = Selector(text=driver.page_source)
                    hrefs = page.css("dd.clearfix").xpath("./span/a/@href").getall()
                    for ip in list(map(lambda x:self.pattern.search(x).group(1),hrefs)):
                        logger.debug(f"Saving file {ip} of year {iyear} vol {volume}")
                        articles.append({
                            "year":year,
                            "vol":f"No.{volume}",
                            "filename":ip,
                            "journalcode":self.journal_code,
                        })
                self.save(articles)
        finally:
            driver.quit()


    def getall(self):
        '''
        get all article filename, stored in self.allpapers
        '''
        driver = webdriver.Firefox()
        try:
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
                    WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,"//div[@class='yearissuepage' and @style='']//dd[@style='' or @style='display: block;']")),"Can't load")
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
                                "journalcode":self.journal_code,
                            })
                # save this page
                self.save()
                # click for next page
                pagelist = driver.find_element_by_xpath("//div[@class='page-list']")
                try:
                    nextpage = pagelist.find_element_by_class_name("next")
                    nextpage.click()
                    logger.debug("Click next page")
                    time.sleep(9)
                    WebDriverWait(driver,10).until(EC.presence_of_element_located((By.XPATH,"//div[@class='yearissuepage' and @style='']")),"Can't load")
                except:
                    print("No further pages")
                finally:
                    cur_page += 1
        finally:
            driver.quit()
            # save all
            self.save()
    
    def save(self,papers=None):
        '''
        save self.allpapers into database
        '''
        self.init_db()
        # newpapers = []
        # for ipaper in self.allpapers:
        #     #check if this paper exists
        #     if self.col.find_one({"filename":ipaper['filename'],"journalcode":ipaper['journalcode']}):
        #         # this has been inserted
        #         pass
        #     else:
        #         ipaper["done"] = 0
        #         newpapers.append(ipaper)
        
        # insert new papers
        count = 0
        if papers is None:
            papers = self.allpapers

        for ipaper in papers:
            # if doesn't exist, it will be inserted
            result = self.col.update_one({"filename":ipaper['filename'],"journalcode":ipaper['journalcode']},{'$set':ipaper},True)
            if result.upserted_id:
                count = count + 1
        logger.info(f"{self.journalname}: {count} papers are inserted into database")
        self.close_db()
    
    def file_to_scrapy(self,number=1000):
        '''
        get file which needs to be crawled. get new ones only by comparing database data.
        default: get 1000 files.
        '''
        self.init_db()
        self.col_compare = self.db[self.journal_code]
        donefiles = self.col_compare.find({"done":True},{"_id":0,"filename":1})
        donefiles = list(map(lambda x:x['filename'],donefiles))
        newfiles = list()
        count = 0
        for item in self.col.find({"journalcode":self.journal_code},{"_id":0,"filename":1},batch_size=number):
            if item['filename'] not in donefiles:
                count += 1
                newfiles.append(item['filename'])
            if count > number:
                break
        self.close_db()
        logger.info(f"For {self.journalname}, {count} new files will be crawled!")

        # allfiles = self.col.find({"journalcode":self.journal_code},{"_id":0,"filename":1})
        # newfiles = set(allfiles) - set(donefiles)
        with open(f"./jsons/{self.journal_code}.json",'w') as f:
            json.dump({"newfiles":list(newfiles)},f)

    def failed_file_to_scrapy(self,number=100):
        '''
        get file which had been crawled but failed.
        '''
        self.init_db()
        self.col_compare = self.db[self.journal_code]
        undone_files = list()
        count = 0
        done_num = self.col_compare.count_documents({"done":True})
        total_num = self.col_compare.count_documents({})
        logger.info(f"For {self.journalname}, {done_num}/{total_num} has finished!")
        for item in self.col_compare.find({"done":False},{"_id":0,"filename":1},batch_size=number):
            undone_files.append(item['filename'])
            count += 1
            if count > number:
                break
        self.close_db()

        with open(f"./jsons/{self.journal_code}.json",'w') as f:
            json.dump({"newfiles":undone_files},f)



if __name__ == "__main__":
    # journal = JournalHelper("原子能科学与技术")
    # journal.getall()
    # journal.get_year_volume("1992","01")
    # journal.file_to_scrapy(100000)
    # journal.failed_file_to_scrapy()
    journals = [
    "核动力工程", 
    "核技术",
    # "核安全",
    "辐射防护",
    # "核聚变与等离子体物理",
    "核科学与工程",
    # "辐射防护通讯",
    # "中国核电",
    "核电子学与探测技术",
    ]
    for ij in journals:
        journal = JournalHelper(ij)
        # journal.getall()
        journal.file_to_scrapy(100000)
    # journal = JournalHelper("核动力工程")
    # years =[f"{iyear}" for iyear in range(1983,1979,-1)]
    # journal.get_year_volume(years)

