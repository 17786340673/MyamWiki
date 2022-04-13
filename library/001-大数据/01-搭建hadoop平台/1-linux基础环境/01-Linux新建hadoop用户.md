# <font color=#C71585>Linux新建hadoop用户</font>
>维护人员：**高俊**  
>创建时间：2022-04-12


## 建立用户组
```shell
  [root@localhost ~]$ groupadd hadoop
```
## 新建hadoop用户并添加到用户组
```shell
 [root@localhost ~]$ useradd -g hadoop hadoop
 [root@localhost ~]$ useradd -g hadoop hue
```
## 设置用户密码
```shell
[root@localhost ~]$ passwd hadoop   然后输入密码（密码）
[root@localhost ~]$ passwd hue  然后输入密码（密码）
```
## 配置hadoop用户具有sudo权限
```shell
[root@localhost ~]$ usermod -G wheel hadoop
[root@localhost ~]$ usermod -G wheel hue
```
## 配置hadoop用户sudo不需要密码
```shell
[hadoop@hadoop001 ~]$ sudo vim /etc/sudoers
##添加
##	hadoop  ALL=(ALL) NOPASSWD: ALL
##放开限制
##  ## Same thing without a password
##	%wheel  ALL=(ALL)       NOPASSWD: ALL
##测试
[hadoop@hadoop001 ~]$ sudo su - root
##Last login: Wed Jan  5 16:51:55 CST 2022 on pts/1
[root@hadoop001 ~]$ exit
```
## 在/opt目录下创建文件夹，并修改所属主和所属组
```shell
## 在/opt目录下创建module、software文件夹
[root@test-hadoop001 ~]# mkdir /opt/module
[root@test-hadoop001 ~]# mkdir /opt/software
[root@test-hadoop001 ~]# mkdir /mnt/hadoop
[root@test-hadoop001 ~]# mkdir /tmp/hive
## 修改module、software文件夹的所有者和所属组均为hadoop用户
[root@test-hadoop001 ~]# chown hadoop:hadoop /opt/module
[root@test-hadoop001 ~]# chown hadoop:hadoop /opt/software
[root@test-hadoop004 ~]# chown hadoop:hadoop /mnt/hadoop
[root@test-hadoop004 ~]# chown hadoop:hadoop /tmp/hive
```
## 关闭防火墙，关闭防火墙开机自启
```shell
[root@localhost opt]$ systemctl stop firewalld
[root@localhost opt]$ systemctl disable firewalld.service
```
## 查看防火墙状态
```shell
[hadoop@hadoop001 logs]$ firewall-cmd --state
```
## 重启机器
```shell
[root@localhost opt]$ reboot
```
## 安装telnet/vim
```shell
[hadoop@test-hadoop001 logs]$ sudo yum install telnet
[hadoop@test-hadoop001 logs]$ sudo yum install vim*
```
