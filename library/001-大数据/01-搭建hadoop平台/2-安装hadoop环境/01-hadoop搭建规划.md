# <font color=#C71585>hadoop搭建规划</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## 方案选型

| 应用名           | 版本             |
| :-------------:  | :-------------: |
| zookeeper        | 3.5.7           |
| hadoop           | 3.1.3           |
| tez              | 0.10.1          |
| hive             | 3.1.2           |
| spark            | 3.1.3           |
| sqoop            | 1.4.7           |
| dolphinscheduler | 1.3.8           |
| maven            | 3.8.3           |
| Python           | 3.7.0           |
| hue              | 4.10.0          |
| scala            | 2.12.15         |
| java             | 1.8.0_212       |
| kafka            | 2.12-3.0.0      |
| flink            | 1.13.5          |
| kafka-eagle      | 2.0.9           |
|flink-streaming-platform-web | new  |
| mysql            | 5.7以上         |

## 机器配置

| 机器名称         | 服务器名称     |CPU     |磁盘     |网络     |
| :-------------:  | :-------------:  | :-------------:  | :-------------:  | :-------------:  |
| hadoop001       | dell-1       | 20核 128G       | DDR4 固态(2T)       | 千兆网卡       |
| hadoop002       | dell-2       | 20核 128G       | DDR4 固态(2T)       | 千兆网卡       |
| hadoop003       | dell-3       | 32核 128G       | DDR3 固态(2T)       | 千兆网卡       |

## 服务器规划

| 组件名称 | 服务名称  | 进程名称 | 端口号 | 用途  | hadoop001 | hadoop002 | hadoop003 |
| :--: | :--: | :--: | :--: | :--: | :--: | :--: | :--: |
| zookeeper | QuorumPeerMain | QuorumPeerMain | 2181 | 对客户端提供服务的端口 | ✔ | ✔ | ✔ |
| hadoop | JournalNode-rpc | JournalNode | 8485 | RPC服务 | http://hadoop001:8485 | http://hadoop002:8485 | http://hadoop003:8485 |
| hadoop | JournalNode-http | JournalNode | 8480 | HTTP服务 | http://hadoop001:8480 | http://hadoop002:8480 | http://hadoop003:8480 |
| hadoop | NameNode-rpc | NameNode | 8020 | 接收Client连接的RPC端口，用于获取文件系统metadata信息 | http://hadoop001:8020 | http://hadoop002:8020 | ✖ |
| hadoop | NameNode-http | NameNode | 9870 | HTTP服务 | http://hadoop001:9870 | http://hadoop002:9870 | ✖ |
| hadoop | ZKFC| DFSZKFailoverController | 8019 | ZooKeeper FailoverController，用于NN HA | http://hadoop001:8019 | http://hadoop002:8019 | ✖ |
| hadoop | DataNode| DataNode | 9864 | http服务的端口 | http://hadoop001:9864 | http://hadoop002:9864 | http://hadoop003:9864 |
| hadoop | DataNode| DataNode | 9866 | datanode服务端口，用于数据传输 | http://hadoop001:9866 | http://hadoop002:9866 | http://hadoop003:9866 |
| hadoop | DataNode| DataNode | 9867 | ipc服务的端口 | http://hadoop001:9867 | http://hadoop002:9867 | http://hadoop003:9867 |
| hadoop | ResourceManager| ResourceManager | 8132 | RM的applications manager(ASM)端口 | http://hadoop001:8132 | http://hadoop002:8132 | ✖ |
| hadoop | ResourceManager-scheduler| ResourceManager | 8130 | scheduler组件的IPC端口| http://hadoop001:8130 | http://hadoop002:8130 | ✖ |
| hadoop | ResourceManager-web| ResourceManager | 8188 | http服务端口 | http://hadoop001:8188 | http://hadoop002:8188 |  |
| hadoop | NodeManager| NodeManager | 8040 | http服务端口 | http://hadoop001:8040 | http://hadoop002:8040 | http://hadoop003:8040 |
| hadoop | JobHistoryServer| JobHistoryServer | 10020 | IPC | ✖ | ✖ | http://hadoop003:10020 |
| hadoop | JobHistoryServer web | JobHistoryServer web | 19888 | http服务端口 | ✖ | ✖ | http://hadoop003:19888 |
| hive | HiveMetaStore | HiveMetaStore | 9083 | 元数据服务 | ✖ | ✖ | http://hadoop003:9083 |
| hive | HiveServer2 | HiveServer2 | 10000 | jdbc连接服务 | ✖ | ✖ | http://hadoop003:10000 |
| hive | HiveServer2-web | HiveServer2 | 10002 | http服务端口 | ✖ | ✖ | http://hadoop003:10002 |
| Hue | Hue | Hue | 8888 | http服务端口 | http://Hadoop001:8888/hue | ✖ | ✖ |
| dolphinscheduler | apiServerPort | apiServerPort | 12345 | http服务端口 | ✖ | http://hadoop002:12345/dolphinscheduler | ✖ |
