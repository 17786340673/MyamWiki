# <font color=#C71585>修改openfiles和max user processes</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

```shell
[hadoop@localhost ~]$ sudo vim  /etc/security/limits.d/20-nproc.conf
*          soft    nproc     65535
root       soft    nproc     unlimited
[hadoop@localhost ~]$ sudo vim /etc/security/limits.conf
root soft nofile 65535
root hard nofile 65535
* soft nofile 65535
* hard nofile 65535
* soft noproc 65535
* hard noproc 65535

```
*断开重连，ulimit -a验证是否修改成功*
