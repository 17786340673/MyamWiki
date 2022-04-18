# <font color=#C71585>kafka操作命令</font>
>维护人员：**高俊**  
>创建时间：2022-04-18

<font color=#C71585>【目录结构】</font>   

>1. [Kafka启动服务](#Kafka启动服务 "Kafka启动服务")
1. [Kafka后台启动](#Kafka后台启动 "Kafka后台启动")
1. [查看有哪些主题](#查看有哪些主题 "查看有哪些主题")
1. [创建topic](#创建topic "创建topic")
1. [查看topic的详细信息](#查看topic的详细信息 "查看topic的详细信息")
1. [kafka生产者客户端命令](#kafka生产者客户端命令 "kafka生产者客户端命令")
1. [kafka消费者客户端命令](#kafka消费者客户端命令 "kafka消费者客户端命令")
1. [删除topic](#删除topic "删除topic")
1. [更改分区数](#更改分区数 "更改分区数")

## Kafka启动服务
``` sh
./kafka-server-start.sh ../config/server.properties
```
## Kafka后台启动
``` sh
./kafka-server-start.sh -daemon ../config/server.properties
nohup ./kafka-server-start.sh ../config/server.properties 1>/dev/null 2>&1 &
```
## 查看有哪些主题
``` sh
 ./kafka-topics.sh --list --zookeeper 192.168.91.201:2181
 ```
## 创建topic
``` sh
./kafka-topics.sh --create --zookeeper 192.168.91.201:2181 --replication-factor 1 --partitions 1 --topic example
```
## 查看topic的详细信息
``` sh
	./kafka-topics.sh -zookeeper 192.168.91.201:2181 -describe -topic example
```
## kafka生产者客户端命令
``` sh
	./kafka-console-producer.sh --broker-list 192.168.91.203:9092 --topic example
```
## kafka消费者客户端命令
``` sh
	./kafka-console-consumer.sh --bootstrap-server 192.168.91.203:9092 --from-beginning --topic example
```
## 删除topic
``` sh
	./kafka-topics.sh --zookeeper 192.168.91.201:2181 --delete --topic example
  #（注：不能真正删除topic只是把这个topic标记为删除（marked for deletion），要彻底把topic删除必须把kafka中与当前topic相关的数据目录和zookeeper中与当前topic相关的路径一并删除。）
```
## 更改分区数
``` sh
	./kafka-topics.sh --alter --zookeeper 192.168.91.203:2181 --partitions 10 --topic example
```
