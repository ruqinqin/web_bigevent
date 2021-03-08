$(function() {
    getUserInfo();
    // 登陆退出功能
    var layer = layui.layer;
    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登陆？', { icon: 3, title: '提示' },
            function(index) {
                // 清楚本地存储的token
                localStorage.removeItem('token');
                // 重新跳转到登陆页面
                location.href = '/login.html';

                // 关闭confirm询问框
                layer.close(index);
            });

    });


});
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }
            // 调用renderAvatar渲染用户的头像
            renderAvatar(res.data);
        },
        error: function(params) {
            // 失败了可以调用
        }
    })
}
// 调用该函数，渲染用户信息
function renderAvatar(user) {
    // 1、获取用户的名称
    var name = user.nickname || user.username;
    // 2、设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3、按需渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
}