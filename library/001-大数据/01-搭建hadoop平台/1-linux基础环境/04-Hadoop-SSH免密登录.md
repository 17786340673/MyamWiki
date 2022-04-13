# <font color=#C71585>Hadoop-SSH免密登录</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## 每台机器执行，生成公钥和私钥
```shell
[hadoop@test-hadoop001 ~]$ ssh-keygen -t rsa
[hadoop@test-hadoop001 ~]$ chmod 700 .ssh
[hadoop@test-hadoop001 ~]$ chmod 600 authorized_keys
```
## 在test-Hadoop001执行
```shell
[hadoop@test-hadoop001 .ssh]$ cat id_rsa.pub >> authorized_keys
[hadoop@test-hadoop001 .ssh]$ chmod 600 authorized_keys
```
## 将test-hadoop002、test-hadoop004的id_rsa.pub写入到hadoop001的authorized_keys文件中
```shell
[hadoop@test-hadoop001 .ssh]$ vim authorized_keys
```
## 密钥分发复制
```shell
[hadoop@test-hadoop002 .ssh]$ scp hadoop001:/home/hadoop/.ssh/authorized_keys /home/hadoop/.ssh/
```
