# <font color=#C71585>安装JAVA环境</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## 从其他机器上复制java安装包
```shell
[hadoop@test-hadoop001 module]$ scp 192.168.20.206:/opt/software/jdk-8u212-linux-x64.tar.gz /opt/software/
[hadoop@test-hadoop002 module]$ scp 192.168.20.181:/opt/software/jdk-8u212-linux-x64.tar.gz /opt/software/
[hadoop@test-hadoop004 module]$ scp 192.168.20.181:/opt/software/jdk-8u212-linux-x64.tar.gz /opt/software/
```
## 解压安装包
```shell
[hadoop@test-hadoop001 module]$ tar -zxvf /opt/software/jdk-8u212-linux-x64.tar.gz -C /opt/module/
```
## 新建java配置文件
```shell
sudo vim /etc/profile.d/my_env.sh
## JAVA_HOME
export JAVA_HOME=/opt/module/jdk1.8.0_212
export PATH=$PATH:$JAVA_HOME/bin
[hadoop@test-hadoop001 module]$ source /etc/profile
```
## 验证java环境
```shell
[hadoop@test-hadoop001 module]$ java -version
```
