# <font color=#C71585>hive核心配置-hive</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## /opt/module/hive/conf/hive-site.xml

```xml
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
<!-- jdbc 连接的 URL -->
   <property>
       <name>javax.jdo.option.ConnectionURL</name>
       <value>jdbc:mysql://192.168.1.77:3306/hive?useSSL=false&amp;createDatabaseIfNotExist=true&amp;useUnicode=true&amp;characterEncoding=UTF-8</value>
   </property>
<!-- jdbc 连接的 Driver-->
   <property>
       <name>javax.jdo.option.ConnectionDriverName</name>
       <value>com.mysql.jdbc.Driver</value>
   </property>
<!-- jdbc 连接的 username-->
   <property>
       <name>javax.jdo.option.ConnectionUserName</name>
       <value>root</value>
   </property>
<!-- jdbc 连接的 password -->
   <property>
       <name>javax.jdo.option.ConnectionPassword</name>
       <value>密码</value>
   </property>
<!-- Hive 元数据存储版本的验证 -->
   <property>
      <name>hive.metastore.schema.verification</name>
      <value>false</value>
    </property>
<!--元数据存储授权-->
  <property>
      <name>hive.metastore.event.db.notification.api.auth</name>
      <value>false</value>
  </property>
<!-- Hive 默认在 HDFS 的工作目录 -->
  <property>
      <name>hive.metastore.warehouse.dir</name>
      <value>/user/hive/warehouse</value>
  </property>
  <!-- 指定存储元数据要连接的地址 -->
  <property>
    <name>hive.metastore.uris</name>
    <value>thrift://hadoop001:9083,thrift://hadoop002:9083</value>
  </property>

  <!--hiveserver2的HA-->
  <property>
    <name>hive.zookeeper.quorum</name>
    <value>hadoop001,hadoop002,hadoop003</value>
  </property>

  <property>
    <name>hive.zookeeper.namespace</name>
    <value>hiveserver2</value>
    <description>The parent node under which all ZooKeeper nodes are created.</description>
  </property>

  <!--权限配置-->
<!--
  <property>
    <name>hive.semantic.analyzer.hook</name>
    <value>com.x6mc.HiveSuperAuthority.SuperAuthority</value>
    <description/>
  </property>

  <property>
    <name>hive.security.authorization.enabled</name>
    <value>true</value>
    <description>enable or disable the Hive client authorization</description>
  </property>

  <property>
    <name>hive.security.authorization.manager</name>
    <value>org.apache.hadoop.hive.ql.security.authorization.DefaultHiveAuthorizationProvider</value>
    <description>
      The Hive client authorization manager class name. The user defined authorization class should implement
      interface org.apache.hadoop.hive.ql.security.authorization.HiveAuthorizationProvider.
    </description>
  </property>

  <property>
    <name>hive.security.authorization.createtable.user.grants</name>
    <value>hadoop:ALL</value>
    <description>
      the privileges automatically granted to some users whenever a table gets created.
      An example like "userX,userY:select;userZ:create" will grant select privilege to userX and userY,
      and grant create privilege to userZ whenever a new table created.
    </description>
  </property>
-->
  <property>
    <name>hive.security.authorization.createtable.owner.grants</name>
    <value>ALL</value>
    <description>
      The privileges automatically granted to the owner whenever a table gets created.
      An example like "select,drop" will grant select and drop privilege to the owner
      of the table. Note that the default gives the creator of a table no access to the
      table (but see HIVE-8067).
    </description>
  </property>

  <!-- log 信息 -->
  <property>
    <name>hive.server2.logging.operation.log.location</name>
    <value>/tmp/hive/operation_logs</value>
    <description>Top level directory where operation logs are stored if logging functionality is enabled</description>
  </property>

  <property>
    <name>hive.downloaded.resources.dir</name>
    <value>/tmp/hive/resources</value>
    <description>Temporary local directory for added resources in the remote file system.</description>
  </property>

  <property>
    <name>hive.querylog.location</name>
    <value>/tmp/hive/querylog</value>
    <description>Location of Hive run time structured log file</description>
  </property>

  <!-- hiveserver2的高可用参数，开启此参数可以提高hiveserver2的启动速度 -->
  <property>
    <name>hive.server2.active.passive.ha.enable</name>
    <value>true</value>
  </property>

  <!--有多台hiveserver2时开启，否则开启会报错-->
  <property>
    <name>hive.server2.support.dynamic.service.discovery</name>
    <value>true</value>
    <description>Whether HiveServer2 supports dynamic service discovery for its clients. To support this, each instance of HiveServer2 currently uses ZooKeeper to register itself, when it is brought up. JDBC/ODBC clients should use the ZooKeeper ensemble: hive.zookeeper.quorum in their connection string.</description>
  </property>


  <!--身份验证模式，默认为NONE。可选项是NONE.NOSASL,KERBEROS,KERBEROS,PAM,CUSTOM
  <property>
    <name>hive.server2.authentication</name>
    <value>LDAP</value>
  </property>
  <property>
    <name>hive.server2.authentication.ldap.url</name>
    <value>ldap://hadoop002</value>
  </property>
  <property>
    <name>hive.server2.authentication.ldap.baseDN</name>
    <value>ou=hadoop,o=x6mc@hive</value>
  </property>
-->

  <!-- 指定 hiveserver2 连接的 host -->
  <property>
    <name>hive.server2.thrift.bind.host</name>
    <value>hadoop002</value>
  </property>
  <!-- 指定 hiveserver2 连接的端口号 -->
  <property>
   <name>hive.server2.thrift.port</name>
   <value>10000</value>
  </property>

  <!-- 指定 hiveserver2 连接的用户 -->
  <property>
    <name>hive.server2.thrift.client.user</name>
    <value>hadoop</value>
  </property>

  <!-- 指定 hiveserver2 连接的密码 -->
  <property>
    <name>hive.server2.thrift.client.password</name>
    <value>x6mc@hive</value>
  </property>

  <property>
   <name>hive.cli.print.header</name>
   <value>true</value>
  </property>
  <property>
     <name>hive.cli.print.current.db</name>
     <value>true</value>
  </property>
  <property>
     <name>hive.metastore.schema.verification</name>
     <value>false</value>
  </property>

  <!--Spark 依赖位置(注意:端口号 8020 必须和 namenode 的端口号一致)-->
  <property>
     <name>spark.yarn.jars</name>
     <value>hdfs://x6mccluster:8020/spark/spark-jars/*</value>
  </property>

  <!--Hive 执行引擎-->
  <property>
     <name>hive.execution.engine</name>
     <value>mr</value>
  </property>

  <property>
     <name>hive.server2.webui.host</name>
     <value>hadoop002</value>
  </property>
  <property>
     <name>hive.server2.webui.port</name>
     <value>10002</value>
  </property>

  <!-- hive on spark-->
  <property>
    <name>spark.home</name>
    <value>/share/opt/module/spark</value>
  </property>
  <property>
    <name>spark.master</name>
    <value>yarn</value>
  </property>
  <property>
    <name>spark.deploy.mode</name>
    <value>cluster</value>
  </property>
  <property>
    <name>hive.enable.spark.execution.engine</name>
    <value>true</value>
  </property>
  <property>
    <name>spark.enentLog.enabled</name>
    <value>true</value>
  </property>
  <property>
    <name>spark.enentLog.dir</name>
    <value>hdfs://x6mccluster:8020/spark/spark-log</value>
  </property>
  <property>
    <name>spark.serializer</name>
    <value>org.apache.spark.serializer.KryoSerializer</value>
  </property>
  <property>
    <name>spark.executor.memeory</name>
    <value>4g</value>
  </property>
  <property>
    <name>spark.driver.memeory</name>
    <value>1g</value>
  </property>
  <property>
    <name>spark.executor.extraJavaOptions</name>
    <value>-XX:+PrintGCDetails -Dkey=value -Dnumbers="one two three"</value>
  </property>

  <property>
    <name>hive.spark.client.rpc.threads</name>
    <value>60</value>
    <description>Maximum number of threads for remote Spark driver's RPC event loop.</description>
  </property>

  <property>
     <name>hive.spark.client.connect.timeout</name>
     <value>100000ms</value>
  </property>

  <!--hive引入包,此配置项对于hive server有效,不会作用到hive shell-->
  <property>
    <name>hive.aux.jars.path</name>
    <value>file:///share/opt/module/lib_all/es-lib/elasticsearch-hadoop-hive-7.6.1.jar,file:///share/opt/module/lib_all/es-lib/commons-httpclient-3.1.jar</value>
  </property>

  <!--hive参数调优-->
  <property>
    <name>hive.merge.mapredfiles</name>
    <value>true</value>
    <description>Merge small files at the end of a map-reduce job</description>
  </property>

  <property>
    <name>hive.merge.sparkfiles</name>
    <value>true</value>
    <description>Merge small files at the end of a Spark DAG Transformation</description>
  </property>

  <property>
    <name>hive.merge.size.per.task</name>
    <value>128000000</value>
    <description>Size of merged files at the end of the job</description>
  </property>

  <property>
    <name>hive.exec.dynamic.partition</name>
    <value>true</value>
    <description>Whether or not to allow dynamic partitions in DML/DDL.</description>
  </property>

  <property>
    <name>hive.exec.dynamic.partition.mode</name>
    <value>nostrict</value>
    <description>
      In strict mode, the user must specify at least one static partition
      in case the user accidentally overwrites all partitions.
      In nonstrict mode all partitions are allowed to be dynamic.
    </description>
  </property>

  <property>
    <name>hive.exec.max.dynamic.partitions</name>
    <value>100000</value>
    <description>Maximum number of dynamic partitions allowed to be created in total.</description>
  </property>

  <property>
    <name>hive.exec.max.dynamic.partitions.pernode</name>
    <value>10000</value>
    <description>Maximum number of dynamic partitions allowed to be created in each mapper/reducer node.</description>
  </property>

  <property>
    <name>hive.exec.max.created.files</name>
    <value>150000</value>
    <description>Maximum number of HDFS files created by all mappers/reducers in a MapReduce job.</description>
  </property>

</configuration>

```
