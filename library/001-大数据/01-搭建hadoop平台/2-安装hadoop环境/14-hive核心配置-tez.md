# <font color=#C71585>hive核心配置-tez</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## /opt/module/hive/conf/tez-site.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
  <property>
    <name>tez.lib.uris</name>
    <value>${fs.defaultFS}/tez/tez.tar.gz</value>
  </property>
  <property>
     <name>tez.use.cluster.hadoop-libs</name>
     <value>true</value>
  </property>
  <property>
     <name>tez.history.logging.service.class</name>
     <value>org.apache.tez.dag.history.logging.ats.ATSHistoryLoggingService</value>
  </property>
</configuration>

```
