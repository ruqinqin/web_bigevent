$(function() {
    var layer = layui.layer;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器(这里与模板配合着用)
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };
    // 定义补零函数
    function padZero(n) {
        return n > 0 ? n : '0' + n;
    }
    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    };
    initTable();
    initCate();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                // 使用模板引擎渲染列表数据
                var htmlStr = template('tpl-table', res); //定义
                $('tbody').html(htmlStr); //渲染
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        });
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                // 调用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate', res); //定义
                $('[name=cate-id]').html(htmlStr); //渲染

            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate-id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件重新渲染表格数据
        initTable();
    });
    // 定义渲染分页的方法
    function renderPage(total) {
        layui.use('laypage', function() {
            //执行一个laypage实例
            laypage.render({
                elem: 'pageBox', //分页容器的ID
                count: total, //总数居条数
                limit: q.pagesize, //每页显示几条数据
                curr: q.pagenum, //设置默认被选中的分页
                layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
                limits: [2, 3, 5, 10],
                // 分页发生切换的时候，触发jump回调
                jump: function(obj, first) {
                    // 把新的页码，赋值到q查询对象中
                    q.pagenum = obj.curr;
                    q.pagesize = obj.limit;
                    if (!first) {
                        initTable()
                    }
                }
            });
        });
    }
    // 通过代理为删除按钮添加删除事件
    $('tbody').on('click', '.btn-del', function() {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        // 弹出删除是否删除的询问框
        layer.confirm('您确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            // 确认删除以后执行的命令
            var id = $(this).attr('data-id');
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg("删除失败");
                    }
                    layer.msg('删除成功');
                    layer.close(index);
                    if (len === 1) {
                        // 证明删除完毕之后，页面上就没有数据了
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            });

        });
    })
})