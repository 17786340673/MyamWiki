# <font color=#C71585>停止hadoop集群</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## 停止hadoop001的hue服务
```
[hadoop@hadoop001 bin]$ pwd
/opt/module/hue/bin
[hadoop@hadoop001 bin]$ ps -ef | grep hue
[hadoop@hadoop001 bin]$ kill -9 32000 32001
```
## 停止hadoop001的HiveMetaStore、hadoop002的HiveMetaStore和HiveServer2
```
[hadoop@hadoop001 bin]$ pwd
/opt/module/hive/bin
[hadoop@hadoop001 bin]$ ps -ef | grep hive
[hadoop@hadoop001 bin]$ kill -9 32000
[hadoop@hadoop002 bin]$ pwd
/opt/module/hive/bin
[hadoop@hadoop002 bin]$ ps -ef | grep hive
[hadoop@hadoop002 bin]$ kill -9 14433 14623
```
## 在hadoop001停止历史服务器
```
[hadoop@hadoop001 module]$ cd hadoop/sbin/
[hadoop@hadoop001 sbin]$ mapred --daemon stop historyserver
```
## 停止Yarn和备ResourceManager，主NameNode节点
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/stop-yarn.sh
```
## 关闭datanode,在所有DataNode节点单独关闭
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/hadoop-daemon.sh stop datanode
[hadoop@hadoop002 module]$ ./hadoop/sbin/hadoop-daemon.sh stop datanode
[hadoop@hadoop004 module]$ ./hadoop/sbin/hadoop-daemon.sh stop datanode
```
## 两个namenode节点都执行以下命令
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/hadoop-daemon.sh stop zkfc
[hadoop@hadoop002 module]$ ./hadoop/sbin/hadoop-daemon.sh stop zkfc
```
## 停止namenode节点
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/hadoop-daemon.sh stop namenode
[hadoop@hadoop002 module]$ ./hadoop/sbin/hadoop-daemon.sh stop namenode
```
## 停止日志程序
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/hadoop-daemon.sh stop journalnode
[hadoop@hadoop002 module]$ ./hadoop/sbin/hadoop-daemon.sh stop journalnode
[hadoop@hadoop004 module]$ ./hadoop/sbin/hadoop-daemon.sh stop journalnode
```
