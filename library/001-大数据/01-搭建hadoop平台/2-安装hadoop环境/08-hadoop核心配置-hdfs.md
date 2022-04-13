# <font color=#C71585>hadoop核心配置-hdfs</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## hadoop/etc/hadoop/hdfs-site.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<!--
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License. See accompanying LICENSE file.
-->

<!-- Put site-specific property overrides in this file. -->

<configuration>
  <!--指定hdfs的block大小64M -->
  <property>
    <name>dfs.blocksize</name>
    <value>134217728</value>
  </property>

  <!--指定hdfs的nameservice为ns1，需要和core-site.xml中的保持一致 -->
  <property>
    <name>dfs.nameservices</name>
    <value>x6mccluster</value>
  </property>

  <!-- ns1下面有两个NameNode，分别是nn1，nn2 -->
  <property>
    <name>dfs.ha.namenodes.x6mccluster</name>
    <value>nn1,nn2</value>
  </property>

  <!-- nn1的RPC通信地址 -->
  <property>
    <name>dfs.namenode.rpc-address.x6mccluster.nn1</name>
    <value>hadoop001:8020</value>
  </property>

  <!-- nn1的http通信地址 -->
  <property>
    <name>dfs.namenode.http-address.x6mccluster.nn1</name>
    <value>hadoop001:9870</value>
  </property>

  <!-- nn2的RPC通信地址 -->
  <property>
    <name>dfs.namenode.rpc-address.x6mccluster.nn2</name>
    <value>hadoop002:8020</value>
  </property>

  <!-- nn2的http通信地址 -->
  <property>
    <name>dfs.namenode.http-address.x6mccluster.nn2</name>
    <value>hadoop002:9870</value>
  </property>

  <!-- 指定NameNode的元数据在JournalNode上的存放位置 -->
  <property>
    <name>dfs.namenode.shared.edits.dir</name>
    <value>qjournal://hadoop001:8485;hadoop002:8485;hadoop003:8485/x6mccluster</value>
  </property>

  <!-- 配置失败自动切换实现方式 -->
  <property>
    <name>dfs.client.failover.proxy.provider.x6mccluster</name>
    <value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
  </property>

  <!-- 配置隔离机制 -->
  <property>
    <name>dfs.ha.fencing.methods</name>
    <value>sshfence</value>
  </property>

  <!-- 使用隔离机制时需要ssh免密码登陆 -->
  <property>
    <name>dfs.ha.fencing.ssh.private-key-files</name>
    <value>/home/hadoop/.ssh/id_rsa</value>
  </property>

  <!-- 指定NameNode的元数据在JournalNode上的存放位置 -->
  <property>
    <name>dfs.journalnode.edits.dir</name>
    <value>/mnt/hadoop/journal</value>
  </property>

  <!--指定支持高可用自动切换机制-->
  <property>
    <name>dfs.ha.automatic-failover.enabled</name>
    <value>true</value>
  </property>

  <!--指定namenode名称空间的存储地址-->
  <property>
    <name>dfs.namenode.name.dir</name>
    <value>/mnt/hadoop/dfs/nn</value>
  </property>

  <!--指定datanode数据存储地址-->
  <property>
    <name>dfs.datanode.data.dir</name>
    <value>/mnt/hadoop/dfs/dn</value>
  </property>

  <!--指定数据冗余份数，设置数据块应该被复制的份数-->
  <property>
    <name>dfs.replication</name>
    <value>2</value>
  </property>

  <!--设定数据块副本的最小份数-->
  <property>
    <name>dfs.namenode.replication.min</name>
    <value>1</value>
  </property>

  <!--指定可以通过web访问hdfs目录-->
  <property>
    <name>dfs.webhdfs.enabled</name>
    <value>true</value>
  </property>

  <!--工作线程池用来处理客户端的远程过程调用及集群守护进程的调用-->
  <property>
    <name>dfs.namenode.handler.count</name>
    <value>30</value>
  </property>

  <property>
    <name>dfs.datanode.handler.count</name>
    <value>50</value>
  </property>

  <!--保证数据恢复 -->
  <property>
    <name>dfs.journalnode.http-address</name>
    <value>0.0.0.0:8480</value>
  </property>

  <property>
    <name>dfs.journalnode.rpc-address</name>
    <value>0.0.0.0:8485</value>
  </property>

  <!--zookeeper HA-->
  <property>
    <name>ha.zookeeper.quorum</name>
    <value>hadoop001:2181,hadoop002:2181,hadoop003:2181</value>
  </property>

  <!--权限检查 -->
  <property>
    <name>dfs.permissions.enabled</name>
    <value>true</value>
  </property>

  <!--超级用户组名 -->
  <property>
    <name>dfs.permissions.supergroup</name>
    <value>hadoop</value>
  </property>

</configuration>

```
