$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间！';
            }
        }
    });
    initUserInfo();
    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // 调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }
    // 重置表单数据
    $('#btnReset').on('click', function(e) {
        // 阻止表单的默认行为
        e.preventDefault();
        initUserInfo();
    });
    // 表单提交
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起ajax数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败');
                }
                layer.msg('更新用户信息成功');
                // 要实现父页面中标题随之变化
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                // window指的是iframe这个页面。parent就是主页面。
                // 调用主页面函数方法
                window.parent.getUserInfo();
            }
        })
    })

})