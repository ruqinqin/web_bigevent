$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var art_state = '已发布';
    initCate();
    initEditor();
    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁剪区域
    $image.cropper(options);
    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    });
    // 监听coverfile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') //销毁旧的裁剪区域
            .attr('src', newImgURL) //重新设置图片路径
            .cropper(options) //重新初始化裁剪区域

    });

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    });
    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0]);

        // 将文章的发布状态，存到fd中
        fd.append(art_state, 'state');

        // 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存到fd中
                fd.append(blob, 'cover_img');
                fd.forEach(function(k, v) {
                        console.log(k, v)
                    })
                    // 发起ajax请求
                publishArticle(fd);
            });

    });
    // 定义一个发布文章的说法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是FormData格式的数据
            // 必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布失败')
                }
                layer.msg('发布成功');
                // 跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化分类失败');
                }
                // 调用模板引擎，渲染分类下拉菜单
                var htmlStr = template('tpl-cate', res); //定义
                $('[name=cate-id]').html(htmlStr); //渲染
                form.render()
            }
        })

    }
})