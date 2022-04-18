# <font color=#C71585>hadoop-存储类HDFS</font>
>维护人员：**高俊**  
>创建时间：2022-04-18

<font color=#C71585>【目录结构】</font>   

>1. [请说下HDFS读写流程](#请说下HDFS读写流程 "请说下HDFS读写流程")
  1. [HDFS写流程](#HDFS写流程 "HDFS写流程")
  1. [HDFS读流程](#HDFS读流程 "HDFS读流程")
1. [HDFS在读取文件的时候,如果其中一个块突然损坏了怎么办？](#HDFS在读取文件的时候,如果其中一个块突然损坏了怎么办？ "HDFS在读取文件的时候,如果其中一个块突然损坏了怎么办？")
1. [HDFS在上传文件的时候,如果其中一个DataNode突然挂掉了怎么办？](#HDFS在上传文件的时候,如果其中一个DataNode突然挂掉了怎么办？ "HDFS在上传文件的时候,如果其中一个DataNode突然挂掉了怎么办？")

## 请说下HDFS读写流程
  这个问题虽然见过无数次，面试官问过无数次，但是就是有人不能完整的说下来，所以请务必记住。并且很多问题都是从HDFS读写流程中引申出来的

### HDFS写流程
1. client客户端发送上传请求，通过RPC与namenode建立通信，namenode检查该用户是否有上传权限，以及上传的文件是否在hdfs对应的目录下重名，如果这两者有任意一个不满足，则直接报错，如果两者都满足，则返回给客户端一个可以上传的信息
1. client根据文件的大小进行切分，默认128M一块，切分完成之后给namenode发送请求第一个block块上传到哪些服务器上
1. namenode收到请求之后，根据网络拓扑和机架感知以及副本机制进行文件分配，返回可用的DataNode的地址
1. 客户端收到地址之后与服务器地址列表中的一个节点如A进行通信，本质上就是RPC调用，建立pipeline，A收到请求后会继续调用B，B在调用C，将整个pipeline建立完成，逐级返回client
1. client开始向A上发送第一个block（先从磁盘读取数据然后放到本地内存缓存），以packet（数据包，64kb）为单位，A收到一个packet就会发送给B，然后B发送给C，A每传完一个packet就会放入一个应答队列等待应答
1. 数据被分割成一个个的packet数据包在pipeline上依次传输，在pipeline反向传输中，逐个发送ack（命令正确应答），最终由pipeline 中第一个 DataNode 节点 A 将 pipelineack 发送给 Client
1. 当一个 block 传输完成之后, Client 再次请求 NameNode 上传第二个 block ，namenode重新选择三台DataNode给client
```
注：Hadoop 在设计时考虑到数据的安全与高效, 数据文件默认在 HDFS 上存放三份, 存储策略为本地一份，同机架内其它某一节点上一份, 不同机架的某一节点上一份
```

### HDFS读流程
1. client向namenode发送RPC请求。请求文件block的位置
1. namenode收到请求之后会检查用户权限以及是否有这个文件，如果都符合，则会视情况返回部分或全部的block列表，对于每个block，NameNode 都会返回含有该 block 副本的 DataNode 地址； 这些返回的 DN 地址，会按照集群拓扑结构得出 DataNode 与客户端的距离，然后进行排序，排序两个规则：网络拓扑结构中距离 Client 近的排靠前；心跳机制中超时汇报的 DN 状态为 STALE，这样的排靠后
1. Client 选取排序靠前的 DataNode 来读取 block，如果客户端本身就是DataNode,那么将从本地直接获取数据(短路读取特性)
1. 底层上本质是建立 Socket Stream（FSDataInputStream），重复的调用父类 DataInputStream 的 read 方法，直到这个块上的数据读取完毕
1. 当读完列表的 block 后，若文件读取还没有结束，客户端会继续向NameNode 获取下一批的 block 列表
1. 读取完一个 block 都会进行 checksum 验证，如果读取 DataNode 时出现错误，客户端会通知 NameNode，然后再从下一个拥有该 block 副本的DataNode 继续读
1. read 方法是并行的读取 block 信息，不是一块一块的读取；NameNode 只是返回Client请求包含块的DataNode地址，并不是返回请求块的数据
1.  最终读取来所有的 block 会合并成一个完整的最终文件

## HDFS在读取文件的时候,如果其中一个块突然损坏了怎么办？
客户端读取完DataNode上的块之后会进行checksum 验证，也就是把客户端读取到本地的块与HDFS上的原始块进行校验，如果发现校验结果不一致，客户端会通知 NameNode，然后再从下一个拥有该 block 副本的DataNode 继续读。
## HDFS在上传文件的时候,如果其中一个DataNode突然挂掉了怎么办？
客户端上传文件时与DataNode建立pipeline管道，管道正向是客户端向DataNode发送的数据包，管道反向是DataNode向客户端发送ack确认，也就是正确接收到数据包之后发送一个已确认接收到的应答，当DataNode突然挂掉了，客户端接收不到这个DataNode发送的ack确认，客户端会通知 NameNode，NameNode检查该块的副本与规定的不符，NameNode会通知DataNode去复制副本，并将挂掉的DataNode作下线处理，不再让它参与文件上传与下载。
