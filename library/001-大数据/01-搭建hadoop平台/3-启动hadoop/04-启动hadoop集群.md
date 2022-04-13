# <font color=#C71585>启动hadoop集群</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## 启动日志程序
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/hadoop-daemon.sh start journalnode
[hadoop@hadoop002 module]$ ./hadoop/sbin/hadoop-daemon.sh start journalnode
[hadoop@hadoop004 module]$ ./hadoop/sbin/hadoop-daemon.sh start journalnode
```
**在三台机器上jps可以看到JournalNode服务进程**

*并查看日志:*
```
	[hadoop@hadoop001 module]$ /opt/module/hadoop/logs/hadoop-hadoop-journalnode-hadoop001.log
	[hadoop@hadoop002 module]$ /opt/module/hadoop/logs/hadoop-hadoop-journalnode-hadoop002.log
	[hadoop@hadoop004 module]$ /opt/module/hadoop/logs/hadoop-hadoop-journalnode-hadoop004.log
```
## 启动namenode节点
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/hadoop-daemon.sh start namenode
[hadoop@hadoop002 module]$ ./hadoop/sbin/hadoop-daemon.sh start namenode
```
**在hadoop001上jps可以看到NameNode服务进程**

**在hadoop002上jps可以看到NameNode服务进程**

*并查看日志:*
```
	[hadoop@hadoop001 module]$ /opt/module/hadoop/logs/hadoop-hadoop-namenode-hadoop001.log
	[hadoop@hadoop002 module]$ /opt/module/hadoop/logs/hadoop-hadoop-namenode-hadoop002.log
```
## 启动两个namenode节点的zkfc
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/hadoop-daemon.sh start zkfc
[hadoop@hadoop002 module]$ ./hadoop/sbin/hadoop-daemon.sh start zkfc
```
## 启动datanode,在所有DataNode节点单独启动
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/hadoop-daemon.sh start datanode
[hadoop@hadoop002 module]$ ./hadoop/sbin/hadoop-daemon.sh start datanode
[hadoop@hadoop004 module]$ ./hadoop/sbin/hadoop-daemon.sh start datanode
```
## 启动Yarn和备ResourceManager，主NameNode节点
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/start-yarn.sh
```
## 在hadoop001启动历史服务器
```
[hadoop@hadoop001 module]$ cd hadoop/sbin/
[hadoop@hadoop001 sbin]$ mapred --daemon start historyserver
[hadoop@hadoop001 sbin]$ cd /opt/module/
```
## 启动hadoop002的HiveMetaStore和HiveServer2，hadoop001的HiveMetaStore
```
[hadoop@hadoop002 module]$ cd hive/logs
[hadoop@hadoop002 logs]$ nohup hive --service metastore &> metastore.log &
[hadoop@hadoop002 logs]$ nohup hive --service hiveserver2 &> hiveserver2.log &
```
*查看hive启动日志*
```
	[hadoop@hadoop002 module]$ vim hive/logs/hive.log
  [hadoop@hadoop001 module]$ cd hive/logs
  [hadoop@hadoop001 logs]$ nohup hive --service metastore &> metastore.log &
```
*查看hive启动日志*
```
	[hadoop@hadoop001 module]$ vim hive/logs/hive.log
```
## 启动hadoop001的hue服务
```
  [hadoop@hadoop001 logs]$ nohup /opt/module/hue/build/env/bin/supervisor &> hue.log &
```
