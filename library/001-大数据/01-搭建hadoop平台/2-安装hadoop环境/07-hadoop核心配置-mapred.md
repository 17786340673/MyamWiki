# <font color=#C71585>hadoop核心配置-mapred</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## hadoop/etc/hadoop/mapred-site.xml

```xml
<?xml version="1.0"?>
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

  <!-- 配置MapReduce运行于yarn中 -->
  <property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value>
  </property>

  <!-- 配置 MapReduce JobHistory Server 地址 ，默认端口10020 -->
  <property>
    <name>mapreduce.jobhistory.address</name>
    <value>hadoop001:10020</value>
  </property>

  <!-- 配置 MapReduce JobHistory Server web ui 地址， 默认端口19888 -->
  <property>
    <name>mapreduce.jobhistory.webapp.address</name>
    <value>hadoop001:19888</value>
  </property>

  <property>
    <name>yarn.app.mapreduce.am.env</name>
    <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
  </property>

  <property>
    <name>mapreduce.map.env</name>
    <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
  </property>

  <property>
    <name>mapreduce.reduce.env</name>
    <value>HADOOP_MAPRED_HOME=${HADOOP_HOME}</value>
  </property>

  <!-- 同时整理文件,这就决定了打开的文件句柄数 -->
  <property>
    <name>mapreduce.task.io.sort.factor</name>
    <value>30</value>
  </property>

  <!-- 缓冲存储器的总量，同时整理文件所用内存 -->
  <property>
    <name>mapreduce.task.io.sort.mb</name>
    <value>384</value>
  </property>

  <!-- reduce端并行获取线程数 -->
  <property>
    <name>mapreduce.reduce.shuffle.parallelcopies</name>
    <value>10</value>
  </property>

  <!-- 内存量从调度器为每个Map申请的要求 -->
  <property>
    <name>mapreduce.map.memory.mb</name>
    <value>1024</value>
  </property>

  <!-- 内存量从调度器为每个Reduce申请的要求 -->
  <property>
    <name>mapreduce.reduce.memory.mb</name>
    <value>2048</value>
  </property>

  <!-- map内存大小 -->
  <property>
    <name>mapreduce.map.java.opts</name>
    <value>-Xmx1536m</value>
  </property>

  <!-- reduce内存大小 -->
  <property>
    <name>mapreduce.reduce.java.opts</name>
    <value>-Xmx2048m</value>
  </property>

  <!-- 每服务器允许启动的最大map槽位数 -->
  <property>
    <name>mapreduce.tasktracker.map.tasks.maximum</name>
    <value>10</value>
  </property>

  <!-- 每服务器允许启动的最大reduce槽位数 -->
  <property>
    <name>mapreduce.tasktracker.reduce.tasks.maximum</name>
    <value>10</value>
  </property>

  <!-- reduce使用CPU个数 -->
  <property>
    <name>mapreduce.reduce.cpu.vcores</name>
    <value>1</value>
  </property>

  <!-- 本地运算文件夹剩余空间低于1G值则不在本地做计算 -->
  <property>
    <name>mapreduce.tasktracker.local.dir.minspacestart</name>
    <value>1073741824</value>
  </property>

  <!-- 本地计算文件夹剩余空间低于1G值则不再申请新的任务,并清理已完成任务 -->
  <property>
    <name>mapreduce.tasktracker.local.dir.minspacekill</name>
    <value>1073741824</value>
  </property>

  <property>
    <name>mapreduce.shuffle.port</name>
    <value>23080</value>
  </property>

  <!-- MapReduce做本地计算所使用的文件夹,为了分散磁盘I / O用逗号分隔在不同设备上的目录列表 -->
  <property>
    <name>mapreduce.cluster.local.dir</name>
    <value>/mnt/hadoop/mapred/local</value>
  </property>

</configuration>

```
