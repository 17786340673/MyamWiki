# <font color=#C71585>配置hadoop环境变量</font>
>维护人员：**高俊**  
>创建时间：2022-04-12



# 新建xsync文件

```
[hadoop@hadoop001 ~]$ vim /opt/module/bin/xsync
```
``` java
#!/bin/bash

#1. 判断参数个数
if [ $# -lt 1 ]
then
   echo Not Enough Arguement!
   exit;
fi


# 2遍历集群所有机器
for host in hadoop001 hadoop002 hadoop003
do
   echo ==================== $host ====================
   #3. 遍历所有目录，挨个发送
   for file in $@
   do
     #4. 判断文件是否存在
     if [ -e $file ]
        then
          #5. 获取父目录
          pdir=$(cd -P $(dirname $file); pwd)
          #6. 获取当前文件的名称
          fname=$(basename $file)
          ssh $host "mkdir -p $pdir"
          rsync -av $pdir/$fname $host:$pdir
        else
          echo $file does not exists!
    fi
  done
done
```

# 修改脚本 xsync 具有执行权限

```
chmod +x xsync
```

# 同步环境变量配置（root所有者）

```
[hadoop@hadoop001 ~]$ sudo ./bin/xsync /etc/profile.d/my_env.sh
```
*注意：如果用了sudo，那么xsync一定要给它的路径补全。*

# 让环境变量生效

```
[hadoop@hadoop002 bin]$ source /etc/profile
[hadoop@hadoop003 bin]$ source /etc/profile
```
