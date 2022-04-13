# <font color=#C71585>释放buff/cache内存占用</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

<div align=center>![alt文本](amWiki/images/Hadoop/buff.png "buff/cache")  
buff/cache</div>

## hadoop用户编辑cache文件，并给可执行权限
```
[hadoop@hadoop001 logs]$ cd /opt/module/bin
[hadoop@hadoop001 logs]$ vim  cache
[hadoop@hadoop001 logs]$ 00 17 * * * echo 3 > /proc/sys/vm/drop_caches
[root@hadoop001 bin]# chmod  777 cache
```
## 切换root用户
```
[hadoop@hadoop001 logs]$ sudo su – root
[sudo] password for hadoop:
```
## 配置linux定时调度
```
[root@hadoop001 ~]# cd /opt/module/bin/
[root@hadoop001 bin]# crontab   cache
```
## 查看调度信息
```
[root@hadoop001 bin]# crontab  -l
```
## 验证释放情况
```
[root@hadoop001 bin]# free -h
```
