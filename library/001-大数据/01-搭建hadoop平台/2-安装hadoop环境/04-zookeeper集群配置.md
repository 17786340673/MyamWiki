# <font color=#C71585>配置hadoop环境变量</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## 配置环境变量

```
sudo vim /etc/profile.d/my_env.sh
```

```
#zookeeper
export ZK_HOME=/opt/module/zookeeper
export PATH=$PATH:$ZK_HOME/bin
```

## 文件分发
```
[hadoop@hadoop001 module]$ sudo /opt/module/bin/xsync /etc/profile.d/my_env.sh
```
## 让环境变量生效
```
[hadoop@hadoop002 bin]$ source /etc/profile
[hadoop@hadoop003 bin]$ source /etc/profile
```
## 解压安装包并重命名
```
[hadoop@hadoop001 software]$ tar -zxvf apache-zookeeper-3.5.7-bin.tar.gz -C ../module/
[hadoop@hadoop001 module]$ mv zookeeper-3.5.7/ zookeeper
```

## 在zookeeper下新建文件夹logs和data
```
[hadoop@hadoop001 zookeeper]$ mkdir -p data logs
```
## 修改配置文件zoo.cfg
```
[hadoop@hadoop001 conf]$ cp zoo_sample.cfg zoo.cfg
[hadoop@hadoop001 conf]$ vim zoo.cfg
```
``` js
# The number of milliseconds of each tick
tickTime=2000
# The number of ticks that the initial
# synchronization phase can take
initLimit=5
# The number of ticks that can pass between
# sending a request and getting an acknowledgement
syncLimit=6
# the directory where the snapshot is stored.
# do not use /tmp for storage, /tmp here is just
# example sakes.
dataDir=/opt/module/zookeeper/data
dataLogDir=/opt/module/zookeeper/logs
# the port at which the clients will connect
clientPort=2181
# the maximum number of client connections.
# increase this if you need to handle more clients
maxClientCnxns=300
#
# Be sure to read the maintenance section of the
# administrator guide before turning on autopurge.
#
# http://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_maintenance
#
# The number of snapshots to retain in dataDir
#autopurge.snapRetainCount=3
# Purge task interval in hours
# Set to "0" to disable auto purge feature
#autopurge.purgeInterval=1
server.1=192.168.20.201:2888:3888
server.2=192.168.20.202:2888:3888
server.3=192.168.20.203:2888:3888
```

##	在data目录下新建myid，与配置一致即可
```
[hadoop@hadoop001 data]$ echo "1" > myid
```
## 分发到各个节点并修改myid文件为对应的编号
```
[hadoop@hadoop001 module]$ xsync zookeeper/
```
## 启动zookeeper服务
```
1.查看各个服务状态：./zkServer.sh status  
2.重启zookeeper服务：./zkServer.sh restart  
3.关闭zookeeper服务：./zkServer.sh stop  
4.启动zookeeper服务：./zkServer.sh start(三台均需要执行)
```
