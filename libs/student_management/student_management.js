//定义模型类
var student = Backbone.Model.extend({
    defaults: {
        stu_id: '',
        name: '',
        sex: '',
        intended_time: '',
        score: ''
    },
    urlRoot: '../stu_management/api/index.php',

});
//定义模型集合类
var studentList = Backbone.Collection.extend({
    model: student,
    url: '../stu_management/api/index.php'
});

//定义学生视图
var studentView = Backbone.View.extend({
    el: '#body_container',
    events: {
        "click .add": "add",
        'click tbody': 'update_delete',
    },
    render: function() {

        //初始化模型和集合数据
        var student_data = new student();
        var student_list = new studentList(student_data);
        student_list.fetch({
            success: function(model, response) {
                console.log(student_list);
                var stu_tpl = _.template($('#stu_tpl').html(), {
                    student_list: student_list
                })
                $('#stu_table').append(stu_tpl);
                $('table').filterTable({ // apply filterTable to all tables on this page
                    filterSelector: '#input-filter', // use the existing input instead of creating a new one
                    minRows: 1
                });
                $("table").stupidtable();
            },
            error: function(err) {
                console.log(err);
            }
        })

        //初始化下拉菜单
        $('.ui.dropdown').dropdown();
        //初始化评分模块
        $('.ui.rating').rating();
        $('.ui.rating.inactive').rating('disable');

        //初始化日历模块
        $('.datetimepicker').datetimepicker({
            yearOffset: 0,
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
        });

    },
    add: function() {
        var form = $("#addForm")[0];
        form.name.value = '';
        form.stu_id.value = '';
        form.sex.value = '男';
        form.intended_time.value = '';
        $('.ui.rating.add').rating('set rating', 0);
        $('.ui.modal.add').modal('setting', {
            onShow: function() {
                $("#addForm").validationEngine();
                $('#addForm').submit(function(e) {
                    var is_valid = $("#addForm").validationEngine('validate');
                    console.log(is_valid);
                    if (is_valid) {
                        //界面上添加student记录
                        var new_stu = new student({
                            name: form.name.value,
                            stu_id: form.stu_id.value,
                            sex: form.sex.value,
                            intended_time: form.intended_time.value,
                            score: $('.ui.rating.add').rating('get rating')
                        });
                        var tpl = _.template('<tr><td><%= stu.stu_id %></td><td><%= stu.name %></td><td><%= stu.sex %></td><td><%= stu.intended_time %></td><td><div class="ui star rating inactive"><% for(var i=0,len=stu.score;i<len;i++){%><i class="icon active"></i><%}%><% for(var j=stu.score;j<5;j++){ %><i class="icon"></i><% } %></div></td><td><div class="tiny ui buttons"><div class="ui blue button update"><i class="edit icon"></i>更新</div><div class="or"></div><div class="ui red button delete"><i class="trash icon"></i>删除</div></div></td></tr>');

                        $('tbody').append(tpl({
                            stu: new_stu.toJSON()
                        }));
                        //存储与数据库中
                        new_stu.save();

                    }
                    // $('.ui.modal.add').modal('hide');
                    e.preventDefault();
                })
            }
        }).modal('show');
    },
    update_delete: function(e) {
        var target = e.target;
        if ($(target).hasClass('delete') || $(target).parent().hasClass('delete')) {
            //界面删除
            $(target).parents('tr').fadeOut(400, function() {
                $(this).remove();
            });
            //从数据库删除
            var new_stu = new student();
            new_stu.set({
                stu_id: $($(target).parents('tr').children('td')[0]).html(),
                id: $($(target).parents('tr').children('td')[0]).html()
            });
            new_stu.destroy();
        } else if ($(target).hasClass('update') || $(target).parent().hasClass('update')) {
            var form = $("#updateForm")[0];
            var tds = $(target).parents('tr').children('td');
            form.stu_id.value = $(tds[0]).html()
            form.name.value = $(tds[1]).html();
            form.sex.value = $(tds[2]).html();
            form.intended_time.value = $(tds[3]).html();
            $('.ui.rating.update').rating('set rating', $(tds[4]).find('.active').length);
            $('.ui.modal.update').modal('setting', {
                onDeny: function() {},
                onShow: function() {
                    $("#updateForm").validationEngine();
                    $('#updateForm').submit(function(e) {
                        var is_valid = $("#addForm").validationEngine('validate');
                        console.log(is_valid);
                        if (is_valid) {
                            var new_stu = new student({
                                name: form.name.value,
                                id: form.stu_id.value,
                                stu_id: form.stu_id.value,
                                sex: form.sex.value,
                                intended_time: form.intended_time.value,
                                score: $('.ui.rating.update').rating('get rating')
                            });
                            //界面上更换student记录
                            $(tds[0]).html(form.stu_id.value);
                            $(tds[1]).html(form.name.value);
                            $(tds[2]).html(form.sex.value);
                            $(tds[3]).html(form.intended_time.value);
                            $(tds[4]).rating('set rating', $('.ui.rating.update').rating('get rating'));
                            //存储与数据库中
                            new_stu.save();

                        }
                        e.preventDefault();
                    })
                }
            }).modal('show');

        }
    },

});
//初始化学生视图
var stu_view = new studentView();
stu_view.render();