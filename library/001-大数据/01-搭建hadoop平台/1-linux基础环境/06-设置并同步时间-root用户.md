# <font color=#C71585>设置并同步时间-root用户</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## 安装ntp
```shell
yum install -y ntp
```
## 与一个已知的时间服务器同步
```shell
# time.nist.gov 是一个时间服务器
# time.nist.gov
# time.nuri.net
# 0.asia.pool.ntp.org
# 1.asia.pool.ntp.org
# 2.asia.pool.ntp.org
# 3.asia.pool.ntp.org
ntpdate time.nist.gov
```
## 删除本地时间并设置时区为上海
```shell
rm -rf /etc/localtime
ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```
