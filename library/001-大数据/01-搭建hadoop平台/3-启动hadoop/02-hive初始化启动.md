# <font color=#C71585>hive初始化启动</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## 在hdfs上创建好hive存储数据的目录
```
[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -mkdir /spark
[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -mkdir /spark/spark-jars
[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -mkdir /spark/spark-history
[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -mkdir /tmp
[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -mkdir -p /user/hive/warehouse
[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -mkdir -p /spark/spark-log
[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -mkdir -p /tez


[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -chmod g+w /spark
[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -chmod g+w /spark/spark-jars
[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -chmod g+w /spark/spark-history
[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -chmod g+w /tmp
[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -chmod g+w /user/hive/warehouse
[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -chmod g+w /spark/spark-log
[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -chmod g+w /tez

[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -put lib_all/spark-jars/* /spark/spark-jars/
[hadoop@hadoop001 module]$ hadoop/bin/hdfs dfs -put tez/tez.tar.gz /tez/
```
## 初始化hive元数据库
```
[hadoop@hadoop002 module]$ ./hive/bin/schematool -dbType mysql -initSchema
```
## hive 远程服务启动方式[metastore和hiveserver2在同一台上启动即可]，暂时设定第二台启动
```
[hadoop@hadoop002 module]$ cd hive/logs
[hadoop@hadoop002 logs]$ nohup hive --service metastore &> metastore.log &
[hadoop@hadoop002 logs]$ nohup hive --service hiveserver2 &> hiveserver2.log &
```
**查看hive启动日志**
```
	[hadoop@hadoop002 module]$ vim hive/logs/hive.log
```
