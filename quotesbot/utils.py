import logging
import random
import requests
import json

# 设置日志输出格式
logging.basicConfig(level=logging.INFO,
                    format='[%(asctime)-15s] [%(levelname)8s] [%(name)10s ] - %(message)s (%(filename)s:%(lineno)s)',
                    datefmt='%Y-%m-%d %T'
                    )
logger = logging.getLogger(__name__)
 
# Truncate header and tailer blanks
def strip(data):
    if data is not None:
        return data.strip()
    return data

# def getip_from_gen(type=2,count=20,protocol=0,country="国内",area=None):
def getip_from_gen(**kargs):
    '''
    get ip from gen10 server.
    type: 0 - 高匿名 1- 匿名 2-透明
    count: ip数目
    protocol: 0-http, 1-https, 2-http/https
    country: “国内”， "国外"
    area： 地区名称（省份）
    '''
    protype = ['http','https']
    if kargs:
        parameters = "&".join(list(map(lambda x:f"{x[0]}={x[1]}" , zip(kargs.keys(),kargs.values()))))
        r = requests.get(f"http://gen10.fun:8113/?{parameters}")
    else:
        r = requests.get('http://gen10.fun:8113/')
    ip_ports = json.loads(r.text)
    ips = []
    protocol = kargs.get("protocol",2)
    for i in ip_ports:
        if protocol == 2:
            ips.append([{'http':"%s://%s:%s"%('http',i[0],i[1])},i[2]])
            ips.append([{'https':"%s://%s:%s"%('https',i[0],i[1])},i[2]])
        else:
            ips.append([{protype[protocol]:"%s://%s:%s"%(protype[protocol],i[0],i[1])},i[2]])
    return ips 

def genip():
    ips = getip_from_gen()
    total = len(ips)
    i = 0
    while True:
        if i < total:
            yield ips[i]
            i = i + 1
        else:
            ips = getip_from_gen()
            total = len(ips)
            i = 0

def pickip(ips):
# pick a proxy from getip() function , under the condition provided by func.
# one func is provieded. time  
# lambda x: float(x)<5.0 # for time less than 5.0 seconds.
    if ips==None:
        return None
    func=lambda x: float(x[1])>3
    newip = list(filter(func,ips))
    num = len(newip)
    if num > 0:
        return newip[random.randint(0,num-1)][0]
    else:
        return None

if __name__ == "__main__":
    print(pickip(getip_from_gen()))