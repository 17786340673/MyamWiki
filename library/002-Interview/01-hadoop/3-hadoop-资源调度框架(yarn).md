# <font color=#C71585>hadoop-资源调度框架(yarn)</font>
>维护人员：**高俊**  
>创建时间：2022-04-18

<font color=#C71585>【目录结构】</font>   

>1. [yarn 集群的架构和工作原理知道多少？](#yarn 集群的架构和工作原理知道多少？ "yarn 集群的架构和工作原理知道多少？")
  1. [ResourceManager](#ResourceManager "ResourceManager")
  1. [ApplicationMaster](#ApplicationMaster "ApplicationMaster")
  1. [nodeManager](#nodeManager "nodeManager")
  1. [container](#container "container")
1. [yarn 集群的架构和工作原理知道多少？](#yarn 集群的架构和工作原理知道多少？ "yarn 集群的架构和工作原理知道多少？")
1. [yarn 的资源调度三种模型了解吗？](#yarn 的资源调度三种模型了解吗？ "yarn 的资源调度三种模型了解吗？")
  1. [FIFO Scheduler（先来先服务）](#FIFO Scheduler（先来先服务） "FIFO Scheduler（先来先服务）")
  1. [Capacity Scheduler（能力调度器）](#Capacity Scheduler（能力调度器） "Capacity Scheduler（能力调度器）")
  1. [Fair Scheduler（公平调度器）](#Fair Scheduler（公平调度器） "Fair Scheduler（公平调度器）")

## yarn 集群的架构和工作原理知道多少？
YARN的基本设计思想是将MapReduce V1中的JobTracker拆分为两个独立的服务：ResourceManager和ApplicationMaster。ResourceManager负责整个系统的资源管理和分配，ApplicationMaster负责单个应用程序的的管理。
### ResourceManager
RM是一个全局的资源管理器，负责整个系统的资源管理和分配，它主要由两个部分组成：调度器（Scheduler）和应用程序管理器（Application Manager）。
调度器根据容量、队列等限制条件，将系统中的资源分配给正在运行的应用程序，在保证容量、公平性和服务等级的前提下，优化集群资源利用率，让所有的资源都被充分利用应用程序管理器负责管理整个系统中的所有的应用程序，包括应用程序的提交、与调度器协商资源以启动ApplicationMaster、监控ApplicationMaster运行状态并在失败时重启它。

### ApplicationMaster
用户提交的一个应用程序会对应于一个ApplicationMaster，它的主要功能有：
1. 与RM调度器协商以获得资源，资源以Container表示。
1. 将得到的任务进一步分配给内部的任务。
1. 与NM通信以启动/停止任务。
1. 监控所有的内部任务状态，并在任务运行失败的时候重新为任务申请资源以重启任务。

### nodeManager
NodeManager是每个节点上的资源和任务管理器，一方面，它会定期地向RM汇报本节点上的资源使用情况和各个Container的运行状态；另一方面，他接收并处理来自AM的Container启动和停止请求。

### container
  Container是YARN中的资源抽象，封装了各种资源。一个应用程序会分配一个Container，这个应用程序只能使用这个Container中描述的资源。

  不同于MapReduceV1中槽位slot的资源封装，Container是一个动态资源的划分单位，更能充分利用资源。

## yarn 集群的架构和工作原理知道多少？
  当jobclient向YARN提交一个应用程序后，YARN将分两个阶段运行这个应用程序：一是启动ApplicationMaster;第二个阶段是由ApplicationMaster创建应用程序，为它申请资源，监控运行直到结束。

  具体步骤如下:
1. 用户向YARN提交一个应用程序，并指定ApplicationMaster程序、启动ApplicationMaster的命令、用户程序。
1. RM为这个应用程序分配第一个Container，并与之对应的NM通讯，要求它在这个Container中启动应用程序ApplicationMaster。
1. ApplicationMaster向RM注册，然后拆分为内部各个子任务，为各个内部任务申请资源，并监控这些任务的运行，直到结束。
1. AM采用轮询的方式向RM申请和领取资源。
1. RM为AM分配资源，以Container形式返回
1. AM申请到资源后，便与之对应的NM通讯，要求NM启动任务。
1. NodeManager为任务设置好运行环境，将任务启动命令写到一个脚本中，并通过运行这个脚本启动任务
1. 各个任务向AM汇报自己的状态和进度，以便当任务失败时可以重启任务。
1. 应用程序完成后，ApplicationMaster向ResourceManager注销并关闭自己

## yarn 的资源调度三种模型了解吗？
  在Yarn中有三种调度器可以选择：FIFO Scheduler ，Capacity Scheduler，Fair Scheduler

  apache版本的hadoop默认使用的是capacity scheduler调度方式。CDH版本的默认使用的是fair scheduler调度方式
### FIFO Scheduler（先来先服务）
  FIFO Scheduler把应用按提交的顺序排成一个队列，这是一个先进先出队列，在进行资源分配的时候，先给队列中最头上的应用进行分配资源，待最头上的应用需求满足后再给下一个分配，以此类推。

  FIFO Scheduler是最简单也是最容易理解的调度器，也不需要任何配置，但它并不适用于共享集群。大的应用可能会占用所有集群资源，这就导致其它应用被阻塞，比如有个大任务在执行，占用了全部的资源，再提交一个小任务，则此小任务会一直被阻塞。

### Capacity Scheduler（能力调度器）
对于Capacity调度器，有一个专门的队列用来运行小任务，但是为小任务专门设置一个队列会预先占用一定的集群资源，这就导致大任务的执行时间会落后于使用FIFO调度器时的时间。

### Fair Scheduler（公平调度器）
  在Fair调度器中，我们不需要预先占用一定的系统资源，Fair调度器会为所有运行的job动态的调整系统资源。

  比如：当第一个大job提交时，只有这一个job在运行，此时它获得了所有集群资源；当第二个小任务提交后，Fair调度器会分配一半资源给这个小任务，让这两个任务公平的共享集群资源。

  需要注意的是，在Fair调度器中，从第二个任务提交到获得资源会有一定的延迟，因为它需要等待第一个任务释放占用的Container。小任务执行完成之后也会释放自己占用的资源，大任务又获得了全部的系统资源。最终的效果就是Fair调度器即得到了高的资源利用率又能保证小任务及时完成。
