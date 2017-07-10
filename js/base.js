;(function () {
    'use strict';
    
    var $form_add_task = $('.add-task')
        , $delete_task
        , task_list = []
        ;

    init();

    $form_add_task.on('submit', function (e) {
        var new_task = {}, $input;
        // 禁用默认行为
        e.preventDefault();
        $input = $(this).find('input[name=content]');
        new_task.content = $input.val();
        if (!new_task.content) return;
        if (add_task(new_task)) {
            $input.val(null);
        }
    });

    $delete_task.on('click', function () {
        var $this = $(this);
        var $item = $this.parent().parent();
        var index = $item.data('index');
        var tmp = confirm('确定删除？')
        tmp
        ? delete_task(index)
        : null;
        
    })

    function add_task(new_task) {
        task_list.push(new_task);
        refresh_task_list();
        return true;
    }

    //刷新localstorage并渲染模板 
    function refresh_task_list() {
        store.set('task_list', task_list);
        render_task_list();
    }

    function delete_task(index) {
        if (!index || !task_list[index]) return;

        delete task_list[idex];
        refresh_task_list();
    }

    function init() {
        task_list = store.get('task_list') || [];
        if (task_list.length) {
            render_task_list();
        }
    }

    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');
        for(var i = 0; i < task_list.length; i++) {
            var $task = render_task_item(task_list[i], i);
            $task_list.append($task);
        }

        $delete_task = $('.action.delete');
    }

    function render_task_item(data, index) {
        var list_item_tpl = 
            '<div class="task-item" data-index="' + index + '">' +
                '<span><input type="checkbox"></span>' +
                '<span class="task-content">' + data.content + '</span>' +
                '<span class="fr">' +
                '<span class="action delete"> 删除</span>' +
                '<span class="action"> 详细</span>' +
                '</span>' +
            '</div>';
        return $(list_item_tpl);
    }
})();