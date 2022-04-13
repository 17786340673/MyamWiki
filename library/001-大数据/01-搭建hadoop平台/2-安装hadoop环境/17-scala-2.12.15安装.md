# <font color=#C71585>scala-2.12.15安装</font>
>维护人员：**高俊**  
>创建时间：2022-04-12

## 下载安装包

https://www.scala-lang.org/download/2.12.15.html

## 解压安装包
```
[hadoop@hadoop001 software]$ tar -xvf /opt/software/scala-2.12.15.tgz -C /opt/module/
```
## 配置环境变量
```
[hadoop@hadoop001 module]$ sudo vim /etc/profile.d/my_env.sh

#scala
export SCALA_HOME=/opt/module/scala-2.12.15
export PATH=$PATH:$SCALA_HOME/bin
```
```
[hadoop@hadoop001 module]$ source /etc/profile
```
##	验证scala版本<更改需断开客户端重连>
```
[hadoop@hadoop001 scala-2.12.15]$ scala -version
```
