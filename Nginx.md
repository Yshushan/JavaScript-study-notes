# CentOS 环境安装 nginx

> 新机器推荐按[官网文档](http://nginx.org/en/docs/install.html)的教程进行安装

## 安装依赖包

安装 `gcc` (一般服务器镜像都已安装)

```
yum -y install gcc
```

安装 `pcre, zlib, openssl`

```
yum install -y pcre pcre-devel
yum install -y zlib zlib-devel
yum install -y openssl openssl-devel
```

## 安装 nginx

下载 nginx [安装包](http://nginx.org/en/download.html)

```
wget http://nginx.org/download/nginx-1.17.8.tar.gz
```

解压到 `/usr/local` 目录下

```
tar -zxv -f nginx-1.17.8.tar.gz -C /usr/local
```

进入解压后的目录

```
cd /usr/local/nginx-1.17.8

# 执行下面三个命令
./configure
make
make install
```

切换到 `/usr/local/nginx/sbin` 目录

```
cd /usr/local/nginx/sbin

# 启动
./nginx

# 或者配置软连接
ln -s /usr/local/nginx/sbin/nginx /usr/local/sbin
```

访问服务器 ip，查看是否启动成功
