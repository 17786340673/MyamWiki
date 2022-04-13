# <font color=#C71585>hadoop核心配置-core</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## hadoop/etc/hadoop/core-site.xml

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

  <!-- 开启垃圾箱功能,4320分钟-3天 -->
  <property>
    <name>fs.trash.interval</name>
    <value>4320</value>
  </property>
  <property>
    <name>fs.trash.checkpoint.interval</name>
    <value>4320</value>
  </property>

  <!-- 指定 NameNode 的地址，指定hdfs的nameservice为ns1,是NameNode的URI。hdfs://主机名:端口/ -->
  <property>
    <name>fs.defaultFS</name>
    <value>hdfs://x6mccluster:8020</value>
  </property>

  <!-- 读写缓冲大小，默认4096-4K，调到131072-128K -->
  <property>
    <name>io.file.buffer.size</name>
    <value>131072</value>
  </property>

  <!-- 指定 hadoop 数据的临时目录 -->
  <property>
    <name>hadoop.tmp.dir</name>
    <value>/mnt/hadoop/tmp</value>
  </property>

  <!-- seqfile io -->
  <property>
    <name>io.seqfile.local.dir</name>
    <value>/mnt/hadoop/io/local</value>
  </property>

  <!-- 配置 HDFS 网页登录使用的静态用户为 hadoop -->
  <property>
    <name>hadoop.http.staticuser.user</name>
    <value>hadoop</value>
  </property>

  <!--指定可以在任何IP访问-->
  <!-- 允许通过 httpfs 方式访问 hdfs 的主机名 -->
  <property>
    <name>hadoop.proxyuser.hadoop.hosts</name>
    <value>*</value>
  </property>

  <!--指定所有用户可以访问-->
  <!--允许通过 httpfs 方式访问 hdfs 的用户组-->
  <property>
    <name>hadoop.proxyuser.hadoop.groups</name>
    <value>*</value>
  </property>

  <!--MR文件压缩与解压缩lzo 配合hive表使用-->
  <property>
      <name>io.compression.codecs</name>
      <value>
      org.apache.hadoop.io.compress.GzipCodec,
      org.apache.hadoop.io.compress.DefaultCodec,
      org.apache.hadoop.io.compress.BZip2Codec,
      org.apache.hadoop.io.compress.SnappyCodec,
      com.hadoop.compression.lzo.LzoCodec,
      com.hadoop.compression.lzo.LzopCodec
      </value>
  </property>

  <property>
      <name>io.compression.codec.lzo.class</name>
      <value>com.hadoop.compression.lzo.LzoCodec</value>
  </property>

  <!-- 指定zookeeper地址 -->
  <property>
    <name>ha.zookeeper.quorum</name>
    <value>hadoop001:2181,hadoop002:2181,hadoop003:2181</value>
  </property>

</configuration>

```
