$(function() {
    // 点击去注册账号的链节
    $('#link_reg').on('click', function() {
        $('.reg-box').show()
        $('.login-box').hide();
    });
    // 点击去登陆的链节
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    });
    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做pwd的校验规则
        // pwd:function(){

        // }
        pwd: [/^[\S]{6,12}$/, '密码不能出现空格，且必须6-12位'],
        // 校验两次输入的密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提是消息即可
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });
    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
            e.preventDefault();
            $.ajax({
                type: 'POST',
                url: '/api/reguser',
                data: {
                    username: $('#form_reg [name=username]').val(),
                    password: $('#form_reg [name=password]').val()
                },
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg("注册成功");
                    $('#link_login').click();
                }
            });
        })
        // 监听登陆表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "POST",
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败！');
                }
                layer.msg('登陆成功！');
                //将登陆成功得到的token字符串保存到localstorage中
                localStorage.setItem('token', res.token);
                // 跳转倒后台主页
                location.href = '/index.html';
            }
        })

    })
})