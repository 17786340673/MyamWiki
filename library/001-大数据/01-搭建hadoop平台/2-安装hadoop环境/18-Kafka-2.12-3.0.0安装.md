# <font color=#C71585>Kafka-2.12-3.0.0安装</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## 下载安装包

https://kafka.apache.org/downloads

| 主机名     | broker.id     | work |
| :-------------: | :-------------: | :-------------: |
| hadoop001      | 1      | ✔ |
| hadoop002      | 2      | ✔ |
| hadoop003      | 3      | ✔ |

## 解压安装包
```
[hadoop@hadoop001 software]$ tar -xvf /opt/software/kafka_2.12-3.0.0.tgz -C /opt/module/
```
## 修改配置文件-server.properties
```
broker.id=1
listeners=PLAINTEXT://hadoop001:9092
advertised.listeners=PLAINTEXT://hadoop001:9092
log.dirs=/opt/module/kafka_2.12-3.0.0/logs
num.partitions=2
zookeeper.connect=hadoop001:2181,hadoop002:2181,hadoop003:2181
```
1.	其中broker.id每个节点配置一个编号，保证唯一  
2.	listeners就是主要用来定义Kafka Broker的Listener的配置项  
3.	advertised.listeners参数的作用就是将Broker的Listener信息发布到Zookeeper  
4.	log.dirs为日志路径  
5.	zookeeper为zookeeper集群的地址
## 修改配置文件-consumer.properties
```
bootstrap.servers=hadoop001:9092,hadoop002:9092,hadoop003:9092
```
## 修改配置文件-producer.properties
```
bootstrap.servers=hadoop001:9092,hadoop002:9092,hadoop003:9092
```
## 增加启动端口监听
```
[hadoop@hadoop003 bin]$ vim kafka-server-start.sh
```
```js
if [ "x$KAFKA_HEAP_OPTS" = "x" ]; then
    export KAFKA_HEAP_OPTS="-Xmx1G -Xms1G"
    export JMX_PORT="9999"
fi
```
## 分发到各个节点并修改broker.id、listeners、advertised.listeners为对应值
```
[hadoop@hadoop001 module]$ xsync kafka_2.12-3.0.0
```
## 启动kafka服务
```
[hadoop@hadoop001 bin]$ ./kafka-server-start.sh -daemon ../config/server.properties
```
## 测试
```
-- 创建topic
./kafka-topics.sh --create --partitions 2 --replication-factor 1 --topic quickstart-events --bootstrap-server hadoop001:9092
-- 查看topic信息
./kafka-topics.sh --describe --topic quickstart-events --bootstrap-server hadoop001:9092
-- 生产者
./kafka-console-producer.sh --topic quickstart-events --bootstrap-server hadoop001:9092
-- 消费者
./kafka-console-consumer.sh --topic quickstart-events --from-beginning --bootstrap-server hadoop001:9092
```
