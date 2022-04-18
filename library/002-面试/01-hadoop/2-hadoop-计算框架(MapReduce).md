# <font color=#C71585>hadoop-计算框架(MapReduce)</font>
>维护人员：**高俊**  
>创建时间：2022-04-18

<font color=#C71585>【目录结构】</font>   

>1. [NameNode在启动的时候会做哪些操作](#NameNode在启动的时候会做哪些操作 "NameNode在启动的时候会做哪些操作")
  1. [首次启动NameNode](#首次启动NameNode "首次启动NameNode")
  1. [第二次启动NameNode](#第二次启动NameNode "第二次启动NameNode")
1. [Secondary NameNode了解吗，它的工作机制是怎样的？](#Secondary NameNode了解吗，它的工作机制是怎样的？ "Secondary NameNode了解吗，它的工作机制是怎样的？")
1. [Secondary NameNode不能恢复NameNode的全部数据，那如何保证NameNode数据存储安全？](#Secondary NameNode不能恢复NameNode的全部数据，那如何保证NameNode数据存储安全？ "Secondary NameNode不能恢复NameNode的全部数据，那如何保证NameNode数据存储安全？")
1. [在NameNode HA中，会出现脑裂问题吗？怎么解决脑裂?](#在NameNode HA中，会出现脑裂问题吗？怎么解决脑裂? "在NameNode HA中，会出现脑裂问题吗？怎么解决脑裂?")
1. [小文件过多会有什么危害,如何避免？](#小文件过多会有什么危害,如何避免？ "小文件过多会有什么危害,如何避免？")
1. [请说下HDFS的组织架构](#请说下HDFS的组织架构 "请说下HDFS的组织架构")
1. [请说下MR中Map Task的工作机制](#请说下MR中Map Task的工作机制 "请说下MR中Map Task的工作机制")
1. [请说下MR中Reduce Task的工作机制](#请说下MR中Reduce Task的工作机制 "请说下MR中Reduce Task的工作机制")
1. [请说下MR中shuffle阶段](#请说下MR中shuffle阶段 "请说下MR中shuffle阶段")
1. [shuffle阶段的数据压缩机制了解吗？](#shuffle阶段的数据压缩机制了解吗？ "shuffle阶段的数据压缩机制了解吗？")
1. [在写MR时，什么情况下可以使用规约？](#在写MR时，什么情况下可以使用规约？ "在写MR时，什么情况下可以使用规约？")

## NameNode在启动的时候会做哪些操作
NameNode数据存储在内存和本地磁盘，本地磁盘数据存储在fsimage镜像文件和edits编辑日志文件

### 首次启动NameNode
1. 格式化文件系统，为了生成fsimage镜像文件
1. 启动NameNode
  1. 读取fsimage文件，将文件内容加载进内存
  1. 等待DataNade注册与发送block report
1. 启动DataNode
  1. 向NameNode注册
  1. 发送block report
  1. 检查fsimage中记录的块的数量和block report中的块的总数是否相同
1. 对文件系统进行操作（创建目录，上传文件，删除文件等）
  1. 此时内存中已经有文件系统改变的信息，但是磁盘中没有文件系统改变的信息，此时会将这些改变信息写入edits文件中，edits文件中存储的是文件系统元数据改变的信息。

### 第二次启动NameNode
1. 读取fsimage和edits文件
1. 将fsimage和edits文件合并成新的fsimage文件
1. 创建新的edits文件，内容为空
1. 启动DataNode

## Secondary NameNode了解吗，它的工作机制是怎样的？
Secondary NameNode 是合并NameNode的edit logs到fsimage文件中；
它的具体工作机制：
1. Secondary NameNode询问NameNode是否需要checkpoint。直接带回NameNode是否检查结果
1. Secondary NameNode请求执行checkpoint
1. NameNode滚动正在写的edits日志
1. 将滚动前的编辑日志和镜像文件拷贝到Secondary NameNode
1. Secondary NameNode加载编辑日志和镜像文件到内存，并合并
1. 生成新的镜像文件fsimage.chkpoint
1. 拷贝fsimage.chkpoint到NameNode
1. NameNode将fsimage.chkpoint重新命名成fsimage

所以如果NameNode中的元数据丢失，是可以从Secondary NameNode恢复一部分元数据信息的，但不是全部，因为NameNode正在写的edits日志还没有拷贝到Secondary NameNode，这部分恢复不了

## Secondary NameNode不能恢复NameNode的全部数据，那如何保证NameNode数据存储安全？
这个问题就要说NameNode的高可用了，即 NameNode HA

  一个NameNode有单点故障的问题，那就配置双NameNode，配置有两个关键点，一是必须要保证这两个NN的元数据信息必须要同步的，二是一个NN挂掉之后另一个要立马补上。
  1. 元数据信息同步在 HA 方案中采用的是“共享存储”。每次写文件时，需要将日志同步写入共享存储，这个步骤成功才能认定写文件成功。然后备份节点定期从共享存储同步日志，以便进行主备切换。
  1. 监控NN状态采用 zookeeper，两个NN节点的状态存放在ZK中，另外两个NN节点分别有一个进程监控程序，实施读取ZK中有NN的状态，来判断当前的NN是不是已经down机。如果standby的NN节点的ZKFC发现主节点已经挂掉，那么就会强制给原本的active NN节点发送强制关闭请求，之后将备用的NN设置为active。

**如果面试官再问HA中的 共享存储 是怎么实现的知道吗？**

  *可以进行解释下：NameNode 共享存储方案有很多，比如 Linux HA, VMware FT, QJM等，目前社区已经把由 Clouderea 公司实现的基于 QJM（Quorum Journal Manager）的方案合并到 HDFS 的 trunk 之中并且作为默认的共享存储实现*

  *基于 QJM 的共享存储系统主要用于保存 EditLog，并不保存 FSImage 文件。FSImage 文件还是在 NameNode 的本地磁盘上。QJM 共享存储的基本思想来自于 Paxos 算法，采用多个称为 JournalNode 的节点组成的 JournalNode 集群来存储 EditLog。每个 JournalNode 保存同样的 EditLog 副本。每次 NameNode 写 EditLog 的时候，除了向本地磁盘写入 EditLog 之外，也会并行地向 JournalNode 集群之中的每一个 JournalNode 发送写请求，只要大多数 (majority) 的 JournalNode 节点返回成功就认为向 JournalNode 集群写入 EditLog 成功。如果有 2N+1 台 JournalNode，那么根据大多数的原则，最多可以容忍有 N 台 JournalNode 节点挂掉*

## 在NameNode HA中，会出现脑裂问题吗？怎么解决脑裂?
  假设 NameNode1 当前为 Active 状态，NameNode2 当前为 Standby 状态。如果某一时刻 NameNode1 对应的 ZKFailoverController 进程发生了“假死”现象，那么 Zookeeper 服务端会认为 NameNode1 挂掉了，根据前面的主备切换逻辑，NameNode2 会替代 NameNode1 进入 Active 状态。但是此时 NameNode1 可能仍然处于 Active 状态正常运行，这样 NameNode1 和 NameNode2 都处于 Active 状态，都可以对外提供服务。这种情况称为脑裂

  脑裂对于NameNode 这类对数据一致性要求非常高的系统来说是灾难性的，数据会发生错乱且无法恢复。Zookeeper 社区对这种问题的解决方法叫做 fencing，中文翻译为隔离，也就是想办法把旧的 Active NameNode 隔离起来，使它不能正常对外提供服务。

  在进行 fencing 的时候，会执行以下的操作：
  1. 首先尝试调用这个旧 Active NameNode 的 HAServiceProtocol RPC 接口的 transitionToStandby 方法，看能不能把它转换为 Standby 状态。
  1. 如果 transitionToStandby 方法调用失败，那么就执行 Hadoop 配置文件之中预定义的隔离措施，Hadoop 目前主要提供两种隔离措施，通常会选择 sshfence：
   1. sshfence：通过 SSH 登录到目标机器上，执行命令 fuser 将对应的进程杀死
   1. shellfence：执行一个用户自定义的 shell 脚本来将对应的进程隔离

## 小文件过多会有什么危害,如何避免？
  Hadoop上大量HDFS元数据信息存储在NameNode内存中,因此过多的小文件必定会压垮NameNode的内存

  每个元数据对象约占150byte，所以如果有1千万个小文件，每个文件占用一个block，则NameNode大约需要2G空间。如果存储1亿个文件，则NameNode需要20G空间

  显而易见的解决这个问题的方法就是合并小文件,可以选择在客户端上传时执行一定的策略先合并,或者是使用Hadoop的CombineFileInputFormat<K,V>实现小文件的合并

## 请说下HDFS的组织架构

1. Client：客户端
  1. 切分文件。文件上传HDFS的时候，Client将文件切分成一个一个的Block，然后进行存储
  1. 与NameNode交互，获取文件的位置信息
  1. 与DataNode交互，读取或者写入数据
  1. Client提供一些命令来管理HDFS，比如启动关闭HDFS、访问HDFS目录及内容等

1. NameNode：名称节点，也称主节点，存储数据的元数据信息，不存储具体的数据
  1. 管理HDFS的名称空间
  1. 管理数据块（Block）映射信息
  1. 配置副本策略
  1. 处理客户端读写请求

1. DataNode：数据节点，也称从节点。NameNode下达命令，DataNode执行实际的操作
  1. 存储实际的数据块
  1. 执行数据块的读/写操作

1. Secondary NameNode：并非NameNode的热备。当NameNode挂掉的时候，它并不能马上替换NameNode并提供服务
  1. 辅助NameNode，分担其工作量
  1. 定期合并Fsimage和Edits，并推送给NameNode
  1. 在紧急情况下，可辅助恢复NameNode

## 请说下MR中Map Task的工作机制
**简单概述：**
inputFile通过split被切割为多个split文件，通过Record按行读取内容给map（自己写的处理逻辑的方法），数据被map处理完之后交给OutputCollect收集器，对其结果key进行分区（默认使用的hashPartitioner），然后写入buffer，每个map task 都有一个内存缓冲区（环形缓冲区），存放着map的输出结果，当缓冲区快满的时候需要将缓冲区的数据以一个临时文件的方式溢写到磁盘，当整个map task 结束后再对磁盘中这个maptask产生的所有临时文件做合并，生成最终的正式输出文件，然后等待reduce task的拉取
**详细步骤：**
1. 读取数据组件 InputFormat (默认 TextInputFormat) 会通过 getSplits 方法对输入目录中的文件进行逻辑切片规划得到 block, 有多少个 block就对应启动多少个 MapTask.
1. 将输入文件切分为 block 之后, 由 RecordReader 对象 (默认是LineRecordReader) 进行读取, 以 \n 作为分隔符, 读取一行数据, 返回 <key，value\>. Key 表示每行首字符偏移值, Value 表示这一行文本内容
1. 读取 block 返回 <key,value\>, 进入用户自己继承的 Mapper 类中，执行用户重写的 map 函数, RecordReader 读取一行这里调用一次
1. Mapper 逻辑结束之后, 将 Mapper 的每条结果通过 context.write 进行collect数据收集. 在 collect 中, 会先对其进行分区处理，默认使用 HashPartitioner
1. 接下来, 会将数据写入内存, 内存中这片区域叫做环形缓冲区(默认100M), 缓冲区的作用是 批量收集 Mapper 结果, 减少磁盘 IO 的影响. 我们的 Key/Value 对以及 Partition 的结果都会被写入缓冲区. 当然, 写入之前，Key 与 Value 值都会被序列化成字节数组
1. 当环形缓冲区的数据达到溢写比列(默认0.8)，也就是80M时，溢写线程启动, 需要对这 80MB 空间内的 Key 做排序 (Sort). 排序是 MapReduce 模型默认的行为, 这里的排序也是对序列化的字节做的排序
1. 合并溢写文件, 每次溢写会在磁盘上生成一个临时文件 (写之前判断是否有 Combiner), 如果 Mapper 的输出结果真的很大, 有多次这样的溢写发生, 磁盘上相应的就会有多个临时文件存在. 当整个数据处理结束之后开始对磁盘中的临时文件进行 Merge 合并, 因为最终的文件只有一个, 写入磁盘, 并且为这个文件提供了一个索引文件, 以记录每个reduce对应数据的偏移量

## 请说下MR中Reduce Task的工作机制
**简单描述：**
Reduce 大致分为 copy、sort、reduce 三个阶段，重点在前两个阶段。copy 阶段包含一个 eventFetcher 来获取已完成的 map 列表，由 Fetcher 线程去 copy 数据，在此过程中会启动两个 merge 线程，分别为 inMemoryMerger 和 onDiskMerger，分别将内存中的数据 merge 到磁盘和将磁盘中的数据进行 merge。待数据 copy 完成之后，copy 阶段就完成了，开始进行 sort 阶段，sort 阶段主要是执行 finalMerge 操作，纯粹的 sort 阶段，完成之后就是 reduce 阶段，调用用户定义的 reduce 函数进行处理
**详细步骤：**
1. Copy阶段：简单地拉取数据。Reduce进程启动一些数据copy线程(Fetcher)，通过HTTP方式请求maptask获取属于自己的文件（map task 的分区会标识每个map task属于哪个reduce task ，默认reduce task的标识从0开始）。
1. Merge阶段：这里的merge如map端的merge动作，只是数组中存放的是不同map端copy来的数值。Copy过来的数据会先放入内存缓冲区中，这里的缓冲区大小要比map端的更为灵活。merge有三种形式：内存到内存；内存到磁盘；磁盘到磁盘。默认情况下第一种形式不启用。当内存中的数据量到达一定阈值，就启动内存到磁盘的merge。与map 端类似，这也是溢写的过程，这个过程中如果你设置有Combiner，也是会启用的，然后在磁盘中生成了众多的溢写文件。第二种merge方式一直在运行，直到没有map端的数据时才结束，然后启动第三种磁盘到磁盘的merge方式生成最终的文件。
1. 合并排序：把分散的数据合并成一个大的数据后，还会再对合并后的数据排序。
1. 对排序后的键值对调用reduce方法，键相等的键值对调用一次reduce方法，每次调用会产生零个或者多个键值对，最后把这些输出的键值对写入到HDFS文件中。

## 请说下MR中shuffle阶段
shuffle阶段分为四个步骤：依次为：分区，排序，规约，分组，其中前三个步骤在map阶段完成，最后一个步骤在reduce阶段完成

shuffle 是 Mapreduce 的核心，它分布在 Mapreduce 的 map 阶段和 reduce 阶段。一般把从 Map 产生输出开始到 Reduce 取得数据作为输入之前的过程称作 shuffle。

1. **Collect阶段：**将 MapTask 的结果输出到默认大小为 100M 的环形缓冲区，保存的是 key/value，Partition 分区信息等。
1. **Spill阶段：**当内存中的数据量达到一定的阀值的时候，就会将数据写入本地磁盘，在将数据写入磁盘之前需要对数据进行一次排序的操作，如果配置了 combiner，还会将有相同分区号和 key 的数据进行排序。
1. **Merge阶段：**把所有溢出的临时文件进行一次合并操作，以确保一个 MapTask 最终只产生一个中间数据文件
1. **Copy阶段：**ReduceTask 启动 Fetcher 线程到已经完成 MapTask 的节点上复制一份属于自己的数据，这些数据默认会保存在内存的缓冲区中，当内存的缓冲区达到一定的阀值的时候，就会将数据写到磁盘之上
1. **Merge阶段：**在 ReduceTask 远程复制数据的同时，会在后台开启两个线程对内存到本地的数据文件进行合并操作
1. **Sort阶段：**在对数据进行合并的同时，会进行排序操作，由于 MapTask 阶段已经对数据进行了局部的排序，ReduceTask 只需保证 Copy 的数据的最终整体有效性即可。

*Shuffle 中的缓冲区大小会影响到 mapreduce 程序的执行效率，原则上说，缓冲区越大，磁盘io的次数越少，执行速度就越快*
*缓冲区的大小可以通过参数调整, 参数：mapreduce.task.io.sort.mb 默认100M*

## shuffle阶段的数据压缩机制了解吗？
  在shuffle阶段，可以看到数据通过大量的拷贝，从map阶段输出的数据，都要通过网络拷贝，发送到reduce阶段，这一过程中，涉及到大量的网络IO，如果数据能够进行压缩，那么数据的发送量就会少得多。

  hadoop当中支持的压缩算法：
  gzip、bzip2、LZO、LZ4、Snappy，这几种压缩算法综合压缩和解压缩的速率，谷歌的Snappy是最优的，一般都选择Snappy压缩

## 在写MR时，什么情况下可以使用规约？
规约（combiner）是不能够影响任务的运行结果的，局部汇总，适用于求和类，不适用于求平均值，如果reduce的输入参数类型和输出参数的类型是一样的，则规约的类可以使用reduce类，只需要在驱动类中指明规约的类即可
