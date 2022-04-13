# <font color=#C71585>hadoop核心配置-tez</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## hadoop/etc/hadoop/tez-site.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>

<configuration>
  <!-- 这里指向hdfs上的tez.tar.gz包 -->  
  <property>  
    <name>tez.lib.uris</name>  
    <value>${fs.defaultFS}/tez/tez.tar.gz</value>
  </property>
</configuration>
```
