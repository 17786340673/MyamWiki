# Hadoop运行原理总结

>维护人员：**高俊**  
>创建时间：2020-10-17

<font color=#C71585>【目录结构】</font>   

>1. [HDFS的介绍](#HDFS的介绍 "HDFS的介绍")
2. [HDFS的架构与设计](#HDFS的架构与设计 "HDFS的架构与设计")
  2. [HDFS的设计](#HDFS的设计 "HDFS的设计")
  2. [HDFS核心组件](#HDFS核心组件 "HDFS核心组件")
3. [HDFS概念](#HDFS概念 "HDFS概念")
  3. [数据块](#数据块 "数据块")
  3. [NameNode（管理节点）](#NameNode（管理节点） "NameNode（管理节点）")
  3. [SecondaryNameNode（辅助NameNode）](#SecondaryNameNode（辅助NameNode） "SecondaryNameNode（辅助NameNode）")
  3. [DateNode（工作节点）](#DateNode（工作节点） "DateNode（工作节点）")
  3. [块缓存](#块缓存 "块缓存")
  3. [联邦HDFS](#联邦HDFS "联邦HDFS")
  3. [HDFS的高可用（High Availability）](#HDFS的高可用（High Availability） "HDFS的高可用（High Availability）")
4. [HDFS的读写原理](#HDFS的读写原理 "HDFS的读写原理")
  4. [HDFS读数据](#HDFS读数据 "HDFS读数据")
  4. [HDFS写数据](#HDFS写数据 "HDFS写数据")

## HDFS的介绍
　　Hadoop分布式文件系统(HDFS)被设计成适合运行在通用硬件(commodity hardware)上的分布式文件系统。它和现有的分布式文件系统有很多共同点。同时，它和其它的分布式文件系统的区别也是很明显的。HDFS是一个高度容错性的系统，适合部署在廉价的机器上。HDFS能提供高吞吐量的数据访问，非常适合大规模数据集上的应用。HDFS放宽了一部分POSIX的约束，来实现流式读取文件系统数据的目的。HDFS在最开始是作为Apache Nutch搜索引擎项目的基础框架而开发的。HDFS是Apache Hadoop Core项目的一部分。  

　　Hadoop 是Apache基金会下一个开源的分布式计算平台，它以分布式文件系统HDFS和MapReduce算法为核心，为用户提供了系统底层细节透明的分布式基础架构。用户可以在不了解分布式底层细节的情况下，充分利用分布式集群进行高速运算和存储。  

　　Hadoop是一个能够让用户轻松架构和使用的分布式计算平台。它主要有以下几个**优点**：  
1. **高可靠性：**Hadoop按位存储和处理数据的能力值得人们信赖。　　
2. **高扩展性：**Hadoop是在可用的计算机集簇间分配数据并完成计算任务的，这些集簇可以方便地扩展到数以千计的节点中。　　
3. **高效性：**Hadoop能够在节点之间动态地移动数据，并保证各个节点的动态平衡，因此处理速度非常快。　　
4. **高容错性：**Hadoop能够自动保存数据的多个副本，并且能够自动将失败的任务重新分配。　　
5. **低成本：**与一体机、商用数据仓库以及QlikView、Yonghong Z-Suite等数据集市相比，Hadoop是开源的，项目的软件成本因此会大大降低。  

**缺点：**
1. 不适合低延迟数据访问。
2. 无法高效存储大量小文件，会占用大量的namenode内存。
3. 不支持多用户写入以及任意修改文件。

## HDFS的架构与设计
### HDFS的设计
　　HDFS以流式数据访问模式来存储超大文件，运行于商用硬件集群上。

以下是对HDFS的设计简单描述（详细可以参阅该[文章](http://www.aosabook.org/en/hdfs.html "HDFS官网详细描述")）：    

- **超大文件：**“超大文件”在这里指具有几百MB、几百GB甚至几百TB大小的文件。目前已经有存储PB级数据的Hadoop集群了。
- **流式数据访问：**HDFS的构建思路是这样的：一次写入、多次读取是最高效的访问模式。数据集通常由数据源生成或从数据源复制而来，接着长时间 在此数据集上进行各种分析。每次分析都将涉及该数据集的大部分数据甚至全部，因此读取整个数据集的时间延迟比读取第一条记录的时间延迟更重要。
- **商用硬件：**Hadoop并不需要运行在昂贵且高可靠的硬件上。
- **低时间延迟的数据访问：**要求低时间延迟数据访问的应用，例如几十毫秒范围，不适合在HDFS上运行。HDFS是为高数据吞吐量应用优化的，这可能会以提高时间延迟为代价。对于低延迟的访问需求，HBase是更好的选择。
- **大量的小文件：**由于namenode将文件系统的元数据存储在内存中，因此该文件系统所能存储的文件总数受限于NameNode的内存容量。
- **多用户写入，任意修改文件：**HDFS中的文件写入只支持单个写入者，而且写操作总是以“只添加”方式在文件末尾写数据。它不支持多个写入者的操作，也不支持在文件的任意位置进行修改。但可能以后会支持，不过这种相对比较低效。  

### HDFS核心组件
　　HDFS采用master/slave架构。一个HDFS集群是有一个Namenode和一定数目的Datanode组成。Namenode是一个中心服务器，负责管理文件系统的namespace和客户端对文件的访问。Datanode在集群中一般是一个节点一个，负责管理节点上它们附带的存储。在内部，一个文件其实分成一个或多个block，这些block存储在Datanode集合里。Namenode执行文件系统的namespace操作，例如打开、关闭、重命名文件和目录，同时决定block到具体Datanode节点的映射。Datanode在Namenode的指挥下进行block的创建、删除和复制。Namenode和Datanode都是设计成可以跑在普通的廉价的运行Linux的机器上。HDFS采用java语言开发，因此可以部署在很大范围的机器上。一个典型的部署场景是一台机器跑一个单独的Namenode节点，集群中的其他机器各跑一个Datanode实例。这个架构并不排除一台机器上跑多个Datanode，不过这比较少见。集群中单一Namenode的结构大大简化了系统的架构。Namenode是所有HDFS元数据的仲裁者和管理者，这样，用户数据永远不会流过Namenode。  

  <div align=center>![alt文本](amWiki/images/Hadoop/Hadoop的架构设计图.png "Hadoop的架构设计图")  
  Hadoop的架构设计图</div>

## HDFS概念
### 数据块
　　每个磁盘都有默认的数据块大小，这是磁盘进行数据读/写的最小单位。构建于单个磁盘之上的文件系统通过磁盘块来管理该文件系统中的块，该文件系统块的大小可以是磁盘块的整数倍。文件系统块一般为几千字节，而磁盘块一般为512字节。但这些对于需要读/写文件的文件系统用户来说是透明的。

　　HDFS同样也有块(block)的概念，但是大得多，默认为128MB。与单一磁盘上的文件系统相似，HDFS上的文件也被划分为块大小的多个分块，作为独立的存储单元。但与面向单一磁盘的文件系统不同的是，HDFS中小于一个块大小的文件不会占据整个块的空间，例如当一个1MB的文件存储在一个128MB的块中时，文件只使用1MB的磁盘空间，而不是128MB。

　　**HDFS中的块为什么这么大？** HDFS的块比磁盘的块大，其目的是为了 **最小化寻址开销** 。如果块足够大，从磁盘传输数据的时间会明显大于定位这个块开始位置所需的时间。因为，传输一个由多个块组成的大文件的时间取决于磁盘传输速率。但是块大小这个参数也不会设置得过大，MapReduce中map任务通常一次只处理一个块中的数据，因此如果任务数太少（少于集群中的节点数量），作业的运行速度就会比较慢。

　　对分布式文件系统中的块进行抽象会带来很多好处。
    第一好处是一个文件的大小可以大于网络中任意一个磁盘的容量。
    第二个好处是使用抽象块而非整个文件作为存储单元，大大简化了存储子系统的设计。
    第三个好处是块还非常适合用于数据备份进而提供数据容错能力和提高可用性。

　　HDFS将每个块复制到少数几个物理上相互独立的机器上（默认为3个），可以确保在块、磁盘或机器发生故障后数据不会丢失。如果发现一个块不可用，系统会从其他地方读取另一个复本，而这个过程对用户是透明的。一个因损坏或机器故障而丢失的块可以从其他候选地点复制到另一台可以正常运行的机器上，以保证复本的数量回到正常水平。同样，有些应用程序可能选择为一些常用的文件块设置更高的复本数量进而分散集群中的读取负载。

　　在HDFS中显示块信息：

```shell
 # hdfs fsck / -files -blocks
```
 　　可以执行命令修改HDFS的数据块大小以及复本数量：
```shell
 # vim $HADOOP_HOME/etc/hadoop/hdfs-site.xml
```
![alt文本](amWiki/images/Hadoop/HDFS数据块设置.png "HDFS数据块设置")  

### NameNode（管理节点）

#### NameNode目录结构

运行中的NameNode有如下所示的目录结构：  
   ![alt文本](amWiki/images/Hadoop/HDFS数据块设置.png  "管理节点目录结构")
   - VERSION文件 ：是一个Java属性文件，其中包含正在运行的HDFS的版本信息。该文件一般包含以下内容：
```shell
#Mon Sep 29 09:54:36 BST 2020
namespaceID=1342387246
clusterID=CID-01b5c398-959c-4ea8-aae6-1e0d9bd8b142
cTime=0
storageType=NAME_NODE
blockpoolID=BP-526805057-127.0.0.1-1411980876842
layoutVersion=-57
```
- **layoutVersion：**这是一个负整数，描述HDFS持久性数据结构（也称布局）的版本，但是该版本号与Hadoop发布包的版本号无关。只要布局变更，版本号将会递减，此时HDFS也要升级。否则，新版本的NameNode（或DataNode）就无法正常工作。
- **namespaceID：**文件系统命名空间的唯一标识符，是在NameNode首次格式化时创建的。
- **clusterID：**在HDFS集群上作为一个整体赋予的唯一标识符，这对于联邦HDFS非常重要。
- **blockpoolID：**数据块池的唯一标识符，数据块池中包含了由一个NameNode管理的命名空间中的所有文件。
- **cTime：**标记了NameNode存储系统的创建时间。刚格式化的存储系统，值为0，但升级后，该值会更新到新的时间戳。
- **storageType：**该存储目录包含的时NameNode的数据结构。

- **编辑日志（edits log）与命名空间镜像文件（fsimage）：**
　　**编辑日志(edits log)：** 文件系统客户端执行写操作时，这些事务首先被记录到edits中。NameNode在内存中维护文件系统的元数据；当被修改时，相关元数据信息也同步更新。内存中的元数据可支持客户端的读请求。**我们可以使用OEV查看edits文件：**

选项解析：
```shell
-i，--inputFile <arg>：要处理的编辑文件
-o，--outputFile <arg>：输出文件的名称；如果指定的文件存在，它将被覆盖
-p，--processor <arg>：选择要应用于编辑文件的处理器类型 (XML|FileDistribution|Web|Delimited)

oev中的e指定了镜像文件
```
　　　　命令如下：
```XML
<?xml version="1.0" encoding="UTF-8"?>
<EDITS>
    <EDITS_VERSION>-63</EDITS_VERSION>
    <RECORD>
        <!-- 开始日志段-->
        <OPCODE>OP_START_LOG_SEGMENT</OPCODE>
        <DATA>
            <!-- 事务id-->
            <TXID>1</TXID>
        </DATA>
    </RECORD>
    <RECORD>
        <!-- 结束日志段-->
        <OPCODE>OP_END_LOG_SEGMENT</OPCODE>
        <DATA>
            <TXID>2</TXID>
        </DATA>
    </RECORD>
</EDITS>
```
　　- **命名空间镜像文件（fsimage）：** 文件系统元数据的持久检查点，每个fsimage文件包含文件系统中的所有目录和文件inode的序列化信息（从Hadoop-2.4.0起，FSImage开始采用Google Protobuf编码格式），每个inodes表征一个文件或目录的元数据信息以及文件的副本数、修改和访问时间等信息。数据块存储在DataNode中，但fsimage文件并不描述DataNode。**我们可以使用OIV查看fsimage文件 ：**

选项解析：
```shell
-i，--inputFile <arg>：要处理的镜像文件
-o，--outputFile <arg>：输出文件的名称；如果指定的文件存在，它将被覆盖
-p，--processor <arg>：选择要应用于镜像文件的处理器类型 (XML|FileDistribution|Web|Delimited)

oiv中的i指定了image文件
```
命令如下：
```shell
# hdfs oiv -p XML -i fsimage_0000000000000014026 -o fsimage.xml
```
- **seen_txid文件：**该文件对于NameNode非常重要，它是存放transactionId的文件，format之后是0，它代表的是NameNode里面的edits_\*文件的尾数，NameNode重启的时候，会按照seen_txid的数字，循序从头跑edits_000\*01~到seen_txid的数字。当hdfs发生异常重启的时候，一定要比对seen_txid内的数字是不是你edits最后的尾数，不然会发生建置NameNode时元数据信息缺失，导致误删DataNode上多余block。   

- **in_use.lock文件：**是一个锁文件，NameNode使用该文件为存储目录加锁。可以避免其他NameNode实例同时使用（可能会破坏）同一个存储目录的情况。   
#### NameNode的工作原理
　　NameNode管理文件系统的命名空间。它维护着文件系统树及整棵树内所有的文件和目录。这些信息以两个文件形式永久保存在本地磁盘上：命名空间镜像文件（fsimage）和编辑日志文件（edits log）。它也记录着每个文件中各个块所在的数据节点信息，但它并不永久保存块的位置信息，因为这些信息会在系统启动时根据DataNode节点信息重建，块信息存储在内存中。

　　可以看得出来NameNode的正常运行是非常重要的，如果运行的NameNode服务的机器毁坏，文件系统上所有的文件将会丢失，因为我们不知道如何根据DataNode的块重建文件。因此，Hadoop为此提供两种实现NameNode容错机制：

备份组成文件系统元数据持久状态的文件。一般是将持久状态写入本地磁盘的同时，写入一个远程挂载的网络文件系统（NFS），HDFS与NFS安装配置可以参考该文章（小编目前还没实现，但未来会实现）。
运行一个辅助NameNode。但它不能作为主NameNode，这个辅助NameNode的重要作用是定期合并编辑日志（edits）与命名空间镜像文件（fsimage），以防止编辑日志过大。一般来说辅助NameNode在一个单独的机器上运行，因为它需要占用大量CPU时间并且一样多的内存来执行合并操作。设计成这样的好处在于，一旦主NameNode发生故障，辅助NameNode立刻就可以接替它的工作，但是由于保存数据是定时进行的，所以难免会有损失的数据，此时就可以把保存在其他地方(NFS)的数据复制到辅助NameNode，然后辅助NameNode作为新的主NameNode运行（注意，也可以运行热备份NameNode代替运行辅助NameNode）。

### SecondaryNameNode（辅助NameNode）

　　Hadoop SecondaryNameNode并不是Hadoop的第二个namanode，它不提供NameNode服务，而仅仅是NameNode的一个工具，这个工具帮助NameNode管理元数据信息。可能是由于SecondaryNameNode这个名字给人带来的混淆，Hadoop后面的版本(1.0.4)建议不要使用，而使用CheckPoint Node。但在这小节中，小编还是使用SecondaryNamenode。

　　运行中的SecondaryNamenode（辅助NameNode）的目录结构与主NameNode的目录结构几乎一样，但有部分时间不相同，它为主NameNode内存中的文件系统元数据创建检查点（后面解释）尚未成功时两者不相同。运行中的SecondaryNamenode有如下所示的目录结构：

　　当NameNode 启动时，需要合并fsimage和edits文件，按照edits文件内容将fsimage进行事务处理，从而得到HDFS的最新状态。实际应用中，NameNode很少重新启动。假如存在一个庞大的集群，且关于HDFS的操作相当频繁与复杂，那么就会产生一个非常大的edits文件用于记录操作，这就带来了以下问题：

  + edits文件过大会带来管理问题；

  + 一旦需要重启HDFS时，就需要花费很长一段时间对edits和fsimage进行合并，这就导致HDFS长时间内无法启动；

  + 如果NameNode挂掉了，会丢失部分操作记录（这部分记录存储在内存中，还未写入edits）；

　　此时，Secondary NameNode就要发挥它的作用了：合并edits文件，防止edits文件持续增长。该辅助NameNode会为主NameNode内存中的文件系统元数据创建检查点（fsimage文件），创建检查点前HDFS会自动进入安全模式（safe mode），当NameNode处在安全模式，管理员也可手动调用hdfs dfsadmin -saveNameSpace命令来创建检查点。创建检查点的步骤如下所示（如图中也简单地描述）：

   1. 辅助NameNode请求主NameNode停止使用正在进行中的edits文件，这样新的编辑操作记录到一个新文件中。主NameNode还会更新所有存储目录中的seen_txid文件。

   2. 辅助NameNode从主NameNode获取最近的fsimage和edits文件（采用HTTP GET）。

   3. 辅助NameNode将fsimage文件载入内存，逐一执行edits文件中的事务，创建新的合并后的fsimage文件。

   4. 辅助NameNode将新的fsimage文件发送回主NameNode（使用HTTP PUT），主NameNode将其保存为临时的.ckpt文件。

   5. 主NameNode重新命名临时的fsimage文件，便于日后使用。

　　最终，主NameNode拥有最新的fsimage文件和一个更小的正在进行中的edits文件（edits文件可能非空，因为在创建检查点过程中主NameNode还可能收到一些编辑请求）。这个过程清晰解释了辅助NameNode和主NameNode拥有相近内存需求的原因（因为辅助NameNode也把fsimage文件载入内存）。因此，在大型集群中，辅助NameNode需要运行在一台专用机器上。



```xml
    <property>
      <name>dfs.namenode.checkpoint.period</name>
      <value>3600</value>
      <description>两个定期检查点之间的秒数
      </description>
    </property>

    <property>
      <name>dfs.namenode.checkpoint.txns</name>
      <value>1000000</value>
      <description>secondarynamenode或检查点节点将创建检查点
            每个“dfs.namenode.checkpoint.txns”事务的名称空间
            判断“dfs.namenode.checkpoint.period”是否已过期
      </description>
    </property>

    <property>
      <name>dfs.namenode.checkpoint.check.period</name>
      <value>60</value>
      <description>SecondaryNameNode和CheckpointNode将轮询NameNode    
            每隔'dfs.namenode.checkpoint.check.period'秒查询一次
            未存入检查点事务
      </description>
    </property>
```

### DateNode（工作节点）
### 块缓存
### 联邦HDFS
### HDFS的高可用（High Availability）

## HDFS的读写原理
### HDFS读数据
### HDFS写数据
