; (function () {
    'use strict';

    var $form_add_task = $('.add-task')
        , $task_delete_trigger
        , $task_detail_trigger
        , $task_detail = $('.task-detail')
        , $task_detail_mask = $('.task-detail-mask')
        , task_list = []
        , current_index
        , $update_form
        , $task_detail_content
        , $task_detail_content_input
        ;

    init();

    $form_add_task.on('submit', on_add_task_form_submit);
    $task_detail_mask.on('click', hide_task_detail)

    function on_add_task_form_submit(e) {
        var new_task = {}, $input;
        // 禁用默认行为
        e.preventDefault();
        $input = $(this).find('input[name=content]');
        new_task.content = $input.val();
        if (!new_task.content) return;
        if (add_task(new_task)) {
            $input.val(null);
        }
    }

    function listen_task_detail() {
        var index;
        $('.task-item').on('dblclick', function() {
            index = $(this).data('index')
            show_task_detail(index);
        })

        $task_detail_trigger.on('click', function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            index = $item.data('index');
            show_task_detail(index);
        })
    };

    // 查看task详情
    function show_task_detail(index) {
        // 生成详情模板
        render_task_detail(index);
        current_index = index;
        // 显示详情模板
        $task_detail_mask.show();
        // 显示详情模板mask
        $task_detail.show();
    };

    // 更新task
    function update_task(index, data) {
        if (index === undefined || !task_list[index])
            return;
        task_list[index] = data;
        refresh_task_list();
    }
    // 隐藏task详情
    function hide_task_detail() {
        $task_detail_mask.hide();
        $task_detail.hide();
    }

    // 渲染指定task详细信息
    function render_task_detail(index) {
        if (index === undefined || !task_list[index])
            return;
        var item = task_list[index];
        var tpl = '<form>' +
            '<div class="content">' +
            item.content +
            '</div>' +
            '<div class="input-item">' +
            '<input type="text" name="content" value="' + (item.content || '') + '" style="display:none">' +
            '</div>' +
            '<div>' +
            '<div class="desc input-item">' +
            '<textarea name="desc">' + (item.desc || '') + '</textarea>' +
            '</div>' +
            '</div>' +
            '<div class="remind input-item">' +
            '<input name="remind_date" type="date" value="' + item.remind_date + '">' +
            '</div>' +
            '<div class="input-item"><button type="submit">更新</button></div>' +
            '</form>';
        $task_detail.html(tpl);
        $update_form = $task_detail.find('form');
        $task_detail_content = $update_form.find('.content');
        $task_detail_content_input = $update_form.find('[name=content]');
        $task_detail_content.on('dblclick', function() {
            $task_detail_content.hide();
            $task_detail_content_input.show();
        })
        $update_form.on('submit', function(e) {
            e.preventDefault();
            var data = {};
            data.content = $(this).find('[name=content]').val();
            data.desc = $(this).find('[name=desc]').val();
            data.remind_date = $(this).find('[name=remind_date]').val();
            update_task(index, data);
            hide_task_detail();
        })
    }

    function listen_task_delete() {
        $task_delete_trigger.on('click', function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');
            var tmp = confirm('确定删除？')
            tmp
                ? delete_task(index)
                : null;

        })
    };

    function add_task(new_task) {
        task_list.push(new_task);
        refresh_task_list();
        return true;
    };

    //刷新localstorage并渲染模板 
    function refresh_task_list() {
        store.set('task_list', task_list);
        render_task_list();
    }

    function delete_task(index) {
        if (index == undefined || !task_list[index]) return;

        delete task_list[index];
        refresh_task_list();
    }

    function init() {
        task_list = store.get('task_list') || [];
        if (task_list.length) {
            render_task_list();
        }
    }

    // 渲染全部模板
    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        for (var i = 0; i < task_list.length; i++) {
            var $task = render_task_item(task_list[i], i);
            $task_list.prepend($task);
        }

        $task_delete_trigger = $('.action.delete');
        $task_detail_trigger = $('.action.detail');
        listen_task_delete();
        listen_task_detail();
    }

    // 渲染单个模板
    function render_task_item(data, index) {
        if (!data || !index) return;
        var list_item_tpl =
            '<div class="task-item" data-index="' + index + '">' +
            '<span><input type="checkbox"></span>' +
            '<span class="task-content">' + data.content + '</span>' +
            '<span class="fr">' +
            '<span class="action delete"> 删除</span>' +
            '<span class="action detail"> 详细</span>' +
            '</span>' +
            '</div>';
        return $(list_item_tpl);
    }
})();