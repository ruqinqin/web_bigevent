$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 新旧密码不能重复
        samePwd: function(value) {
            // 这里边的value意思：所使用的文本框中的内容
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一致';
            }
        },
        // 制定两个文本框输入密码相同的校验规则
        rePwd: function(value) {
            // 这里边的value意思：所使用的文本框中的内容
            if (value !== $('[name=newPwd]').val()) {
                return '请输入相同的密码';
            }
            return '修改密码成功';
        }
    });
    // 提交修改密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改密码失败');
                }
                return layer.msg('修改密码成功');
                // 重置表单
                // 先拿到jquery元素$('.layui-form')
                // 在拿到dom元素$('.layui-form')[0]
                // 调用重置.reset();
                $('.layui-form')[0].reset();
            }
        })

    })


})