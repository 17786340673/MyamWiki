# <font color=#C71585>hadoop核心配置-yarn</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## hadoop/etc/hadoop/yarn-site.xml

```xml
<?xml version="1.0"?>
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
<configuration>
  <!--日志聚合功能-->
  <property>
     <name>yarn.log-aggregation-enable</name>
     <value>true</value>
  </property>

<!-- 设置日志聚集服务器地址 -->
<property>
    <name>yarn.log.server.url</name>
    <value>http://hadoop001:19888/jobhistory/logs</value>
</property>

  <!--在HDFS上聚合的日志最长保留多少秒。3天-->
  <property>
     <name>yarn.log-aggregation.retain-seconds</name>
     <value>259200</value>
  </property>

  <!--rm失联后重新链接的时间-->
  <property>
     <name>yarn.resourcemanager.connect.retry-interval.ms</name>
     <value>2000</value>
  </property>

  <!--开启resource manager HA,默认为false-->
  <property>
     <name>yarn.resourcemanager.ha.enabled</name>
     <value>true</value>
  </property>

  <!--配置resource manager -->
  <property>
    <name>yarn.resourcemanager.ha.rm-ids</name>
    <value>rm1,rm2</value>
  </property>

  <!--zookeeper HA-->
  <property>
    <name>ha.zookeeper.quorum</name>
    <value>hadoop001:2181,hadoop002:2181,hadoop003:2181</value>
  </property>

  <!--开启故障自动切换-->
  <property>
     <name>yarn.resourcemanager.ha.automatic-failover.enabled</name>
     <value>true</value>
  </property>

  <property>
    <name>yarn.resourcemanager.hostname.rm1</name>
    <value>hadoop001</value>
  </property>

  <property>
     <name>yarn.resourcemanager.hostname.rm2</name>
     <value>hadoop002</value>
  </property>

  <!--在namenode1上配置rm1,在namenode2上配置rm2,注意：一般都喜欢把配置好的文件远程复制到其它机器上，但这个在YARN的另一个机器上一定要修改-->
  <property>
    <name>yarn.resourcemanager.ha.id</name>
    <value>rm1</value>
  </property>

  <!--开启自动恢复功能-->
  <property>
    <name>yarn.resourcemanager.recovery.enabled</name>
    <value>true</value>
  </property>

  <!--配置与zookeeper的连接地址-->
  <property>
    <name>yarn.resourcemanager.zk-state-store.address</name>
    <value>hadoop001:2181,hadoop002:2181,hadoop003:2181</value>
  </property>

  <property>
    <name>yarn.resourcemanager.store.class</name>
    <value>org.apache.hadoop.yarn.server.resourcemanager.recovery.ZKRMStateStore</value>
  </property>

  <property>
    <name>yarn.resourcemanager.zk-address</name>
    <value>hadoop001:2181,hadoop002:2181,hadoop003:2181</value>
  </property>

  <property>
    <name>yarn.resourcemanager.cluster-id</name>
    <value>x6mccluster-yarn</value>
  </property>

  <!-- Container申请资源最低要求内存-->
  <property>
    <name>yarn.scheduler.minimum-allocation-mb</name>
    <value>1024</value>
  </property>

  <!-- Container申请资源最大要求内存-->
  <property>
    <name>yarn.scheduler.maximum-allocation-mb</name>
    <value>4096</value>
  </property>

  <!--schelduler失联等待连接时间-->
  <property>
    <name>yarn.app.mapreduce.am.scheduler.connection.wait.interval-ms</name>
    <value>5000</value>
  </property>

  <!--每个NodeManager CPU个数-->
  <property>
    <name>yarn.nodemanager.resource.cpu-vcores</name>
    <value>12</value>
  </property>

  <!--每个NodeManager 总内存-->
  <property>
    <name>yarn.nodemanager.resource.memory-mb</name>
    <value>12288</value>
   </property>

   <!--单任务最少vcore-->
  <property>
    <name>yarn.scheduler.minimum-allocation-vcores</name>
    <value>1</value>
   </property>

   <!--单任务最多vcore-->
  <property>
    <name>yarn.scheduler.maximum-allocation-vcores</name>
    <value>4</value>
   </property>

  <!--配置rm1-->
  <property>
    <name>yarn.resourcemanager.address.rm1</name>
    <value>hadoop001:8132</value>
  </property>

  <property>
    <name>yarn.resourcemanager.scheduler.address.rm1</name>
    <value>hadoop001:8130</value>
  </property>

  <property>
    <name>yarn.resourcemanager.webapp.address.rm1</name>
    <value>hadoop001:8188</value>
  </property>

  <property>
    <name>yarn.resourcemanager.resource-tracker.address.rm1</name>
    <value>hadoop001:8131</value>
  </property>

  <property>
    <name>yarn.resourcemanager.admin.address.rm1</name>
    <value>hadoop001:8033</value>
  </property>

  <property>
    <name>yarn.resourcemanager.ha.admin.address.rm1</name>
    <value>hadoop001:23142</value>
  </property>

  <!--配置rm2-->
  <property>
    <name>yarn.resourcemanager.address.rm2</name>
    <value>hadoop002:8132</value>
  </property>

  <property>
    <name>yarn.resourcemanager.scheduler.address.rm2</name>
    <value>hadoop002:8130</value>
  </property>

  <property>
    <name>yarn.resourcemanager.webapp.address.rm2</name>
    <value>hadoop002:8188</value>
  </property>

  <property>
    <name>yarn.resourcemanager.resource-tracker.address.rm2</name>
    <value>hadoop002:8131</value>
  </property>

  <property>
    <name>yarn.resourcemanager.admin.address.rm2</name>
    <value>hadoop002:8033</value>
  </property>

  <property>
    <name>yarn.resourcemanager.ha.admin.address.rm2</name>
    <value>hadoop002:23142</value>
  </property>


  <!-- spark 动态资源分配 -->
  <property>
    <name>yarn.nodemanager.aux-services</name>
    <value>mapreduce_shuffle,spark_shuffle</value>
  </property>

  <property>
    <name>yarn.nodemanager.aux-services.spark_shuffle.class</name>
    <value>org.apache.spark.network.yarn.YarnShuffleService</value>
  </property>

  <property>
    <name>spark.shuffle.service.port</name>
    <value>7337</value>
  </property>

  <!-- spark 部署到 yarn 上需要这两个配置 -->
  <!-- 是否启动一个线程检查每个任务正在使用的物理内存，如果超出分配值，则直接杀掉该任务，默认为 true -->
  <property>
    <name>yarn.nodemanager.pmem-check-enabled</name>
    <value>false</value>
  </property>

  <!-- 是否启动一个线程检查每个任务正在试用的虚拟内存，如果超出分配值，则直接杀掉该任务，默认为 true -->
  <property>
    <name>yarn.nodemanager.vmem-check-enabled</name>
    <value>false</value>
  </property>

  <property>
    <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
    <value>org.apache.hadoop.mapred.ShuffleHandler</value>
  </property>

  <property>
    <name>yarn.nodemanager.local-dirs</name>
    <value>/mnt/hadoop/yarn/local</value>
  </property>

  <property>
    <name>yarn.nodemanager.log-dirs</name>
    <value>/share/opt/module/hadoop/logs/yarn</value>
  </property>

  <property>
    <name>mapreduce.shuffle.port</name>
    <value>23080</value>
  </property>

  <!--故障处理类-->
  <property>
    <name>yarn.client.failover-proxy-provider</name>
    <value>org.apache.hadoop.yarn.client.ConfiguredRMFailoverProxyProvider</value>
  </property>

  <property>
      <name>yarn.resourcemanager.ha.automatic-failover.zk-base-path</name>
      <value>/yarn-leader-election</value>
  </property>

  <property>
    <name>yarn.resourcemanager.scheduler.class</name>
    <value>org.apache.hadoop.yarn.server.resourcemanager.scheduler.capacity.CapacityScheduler</value>
  </property>

  <!-- Yarn环境加载 -->
  <property>
        <name>yarn.application.classpath</name>
        <value>
            /share/opt/module/hadoop/etc/hadoop,
            /share/opt/module/hadoop/share/hadoop/common/*,
            /share/opt/module/hadoop/share/hadoop/common/lib/*,
            /share/opt/module/hadoop/share/hadoop/hdfs/*,
            /share/opt/module/hadoop/share/hadoop/hdfs/lib/*,
            /share/opt/module/hadoop/share/hadoop/yarn/*,
            /share/opt/module/hadoop/share/hadoop/yarn/lib/*,
            /share/opt/module/hadoop/share/hadoop/mapreduce/*,
            /share/opt/module/hadoop/share/hadoop/mapreduce/lib/*,
            /share/opt/module/hadoop/contrib/capacity-scheduler/*.jar
        </value>
  </property>

</configuration>
```
