$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    var indexAdd = null;
    var indexEdit = null;
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    });
    // 因为form是后来拼接的内容，所以，所以不能直接添加submit事件
    // 通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("添加类别失败");
                }
                initArtCateList();
                layer.msg("添加类别成功");
                layer.close(indexAdd)
            }
        })
    });
    // 通过代理的方式为编辑按钮添加点击事件
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    });
    // 通过代理的方式为编辑按钮添加submit事件
    $('tbody').on('submit', '#form-edit', function() {
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('修改类别失败');
                }
                layer.msg('修改类别成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    });
    // 通过代理为删除按钮添加click事件
    $('tbody').on('click', '.btn-del', function() {
        // 弹出删除是否删除的询问框
        layer.confirm('您确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            // 确认删除以后执行的命令
            var id = $(this).attr('data-id');
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg("删除失败");
                    }
                    layer.msg('删除成功');
                    layer.close(index);
                    initArtCateList();
                }
            });

        });
    });
    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
})