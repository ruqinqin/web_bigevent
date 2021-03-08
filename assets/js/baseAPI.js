// 注意：每次调用$.get()或$.post()或$.ajax()的时候
// 会先调用ajaxPrefilter这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // console.log(options.url);//这里打印的是ajax原始的地址
    // 在发起真正的Ajax请求之前，统一拼接请求的根路径
    options.url = "http://ajax.frontend.itheima.net" + options.url;
    // 为有权限的接口统一设置headers请求头
    if (options.url.indexOf('/my/') != -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 统一挂载complete回调函数
    options.complete = function(res) {
        // 在该回调函数中，可以使用res.responseJson来
        // 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 &&
            res.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token');
            // 强制跳转到登陆页面
            location.href = '/login.html'
        }
    }

})