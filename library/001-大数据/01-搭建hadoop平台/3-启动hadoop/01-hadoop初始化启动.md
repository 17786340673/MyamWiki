# <font color=#C71585>hadoop初始化启动</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## 启动三个节点的zookeeper服务
```
[hadoop@hadoop001 module]$ ./zookeeper/bin/zkServer.sh start
[hadoop@hadoop002 module]$ ./zookeeper/bin/zkServer.sh start
[hadoop@hadoop003 module]$ ./zookeeper/bin/zkServer.sh start
```
**在三台机器上jps可以看到QuorumPeerMain服务进程**

*并查看日志:*
```
	[hadoop@hadoop001 module]$ /opt/module/zookeeper/logs/zookeeper-hadoop-server-hadoop001.out
	[hadoop@hadoop002 module]$ /opt/module/zookeeper/logs/zookeeper-hadoop-server-hadoop002.out
	[hadoop@hadoop003 module]$ /opt/module/zookeeper/logs/zookeeper-hadoop-server-hadoop003.out
```
## 创建命名空间，主namenode节点执行
```
[hadoop@hadoop001 module]$ ./hadoop/bin/hdfs zkfc -formatZK
```
## 三个节点用如下命令启动日志程序
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/hadoop-daemon.sh start journalnode
[hadoop@hadoop002 module]$ ./hadoop/sbin/hadoop-daemon.sh start journalnode
[hadoop@hadoop003 module]$ ./hadoop/sbin/hadoop-daemon.sh start journalnode
```
**在三台机器上jps可以看到JournalNode服务进程**

*并查看日志:*
```
	[hadoop@hadoop001 module]$ /opt/module/hadoop/logs/hadoop-hadoop-journalnode-hadoop001.log
	[hadoop@hadoop002 module]$ /opt/module/hadoop/logs/hadoop-hadoop-journalnode-hadoop002.log
	[hadoop@hadoop003 module]$ /opt/module/hadoop/logs/hadoop-hadoop-journalnode-hadoop003.log
```
## 主namenode节点格式化namenode和journalnode目录
```
[hadoop@hadoop001 module]$ ./hadoop/bin/hdfs namenode -format
```
## 主namenode节点启动namenode进程
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/hadoop-daemon.sh start namenode
```
**在hadoop001上jps可以看到NameNode服务进程**

*并查看日志:*
```
	[hadoop@hadoop001 module]$ /opt/module/hadoop/logs/hadoop-hadoop-namenode-hadoop001.log
```
## 在备namenode节点执行第一行命令，把备namenode节点的目录格式化并把元数据从主namenode节点copy过来，并且这个命令不会把journalnode目录再格式化了！然后用第二个命令启动备namenode进程！
```
[hadoop@hadoop002 module]$ ./hadoop/bin/hdfs namenode -bootstrapStandby
[hadoop@hadoop002 module]$ ./hadoop/sbin/hadoop-daemon.sh start namenode
```
**在hadoop002上jps可以看到NameNode服务进程**

*并查看日志:*
```
	[hadoop@hadoop002 module]$ /opt/module/hadoop/logs/hadoop-hadoop-namenode-hadoop002.log
```
## 两个namenode节点都执行以下命令
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/hadoop-daemon.sh start zkfc
[hadoop@hadoop002 module]$ ./hadoop/sbin/hadoop-daemon.sh start zkfc
```
**在hadoop001/hadoop002上jps可以看到DFSZKFailoverController服务进程**

*并查看日志:*
```
	[hadoop@hadoop001 module]$ /opt/module/hadoop/logs/hadoop-hadoop-zkfc-hadoop001.log
	[hadoop@hadoop002 module]$ /opt/module/hadoop/logs/hadoop-hadoop-zkfc-hadoop002.log
```
## 启动datanode,在所有DataNode节点单独启动
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/hadoop-daemon.sh start datanode
[hadoop@hadoop002 module]$ ./hadoop/sbin/hadoop-daemon.sh start datanode
[hadoop@hadoop003 module]$ ./hadoop/sbin/hadoop-daemon.sh start datanode
```
**在hadoop001/hadoop002/hadoop003上jps可以看到DataNode服务进程**

*并查看日志:*
```
	[hadoop@hadoop001 module]$ /opt/module/hadoop/logs/hadoop-hadoop-datanode-hadoop001.log
	[hadoop@hadoop002 module]$ /opt/module/hadoop/logs/hadoop-hadoop-datanode-hadoop002.log
	[hadoop@hadoop003 module]$ /opt/module/hadoop/logs/hadoop-hadoop-datanode-hadoop003.log
```
## 启动Yarn和备ResourceManager，主NameNode节点
```
[hadoop@hadoop001 module]$ ./hadoop/sbin/start-yarn.sh
```

**会启动hadoop001、hadoop002的ResourceManager，以及hadoop001/hadoop002/hadoop003的NodeManager**

**若启动失败，则单独启动备节点ResourceManager**
```
	./hadoop/sbin/yarn-daemon.sh start resourcemanager
```
**启动所有节点的nodemanager**
```
	./hadoop/sbin/yarn-daemon.sh start nodemanager
```

*并查看日志:*
```
	[hadoop@hadoop001 module]$ /opt/module/hadoop/logs/hadoop-hadoop-resourcemanager-hadoop001.log
	[hadoop@hadoop001 module]$ /opt/module/hadoop/logs/hadoop-hadoop-nodemanager-hadoop001.log
	[hadoop@hadoop002 module]$ /opt/module/hadoop/logs/hadoop-hadoop-resourcemanager-hadoop002.log
	[hadoop@hadoop002 module]$ /opt/module/hadoop/logs/hadoop-hadoop-nodemanager-hadoop002.log
	[hadoop@hadoop003 module]$ /opt/module/hadoop/logs/hadoop-hadoop-nodemanager-hadoop003.log
```
## 在hadoop003启动历史服务器
```
[hadoop@hadoop003 module]$ hadoop/bin/mapred --daemon start historyserver
```
**会启动hadoop003的JobHistoryServer**

*并查看日志:*
```
	[hadoop@hadoop003 module]$ /opt/module/hadoop/logs/hadoop-hadoop-historyserver-hadoop003.log
```
## 查看namenode和resourcemanager主从状态
```
[hadoop@hadoop001 module]$ hdfs haadmin -getServiceState nn1
[hadoop@hadoop001 module]$ hdfs haadmin -getServiceState nn2
[hadoop@hadoop001 module]$ yarn rmadmin -getServiceState rm1
[hadoop@hadoop001 module]$ yarn rmadmin -getServiceState rm2
```
**Yarn任务管理webUI界面：** http://hadoop001:8188/ 或者 http://hadoop002:8188/

**Namenode管理webUI界面：** http://hadoop001:9870/  和  http://hadoop002:9870/

**historyserver管理webUI界面：** http://hadoop003:19888/jobhistory
