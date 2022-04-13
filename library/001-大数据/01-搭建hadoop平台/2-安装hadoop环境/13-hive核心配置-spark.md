# <font color=#C71585>hive核心配置-spark</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## /opt/module/hive/conf/spark-defaults.conf

```xml
spark.master yarn
spark.eventLog.enabled true
spark.eventLog.dir hdfs://test-x6mccluster:8020/spark/spark-log
spark.executor.memory 4g
spark.driver.memory 1g

```
