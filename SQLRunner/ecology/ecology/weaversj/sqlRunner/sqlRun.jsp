<%@ page language="java" contentType="text/html; charset=UTF-8" %>

<%@ include file="/systeminfo/init_wev8.jsp" %>

<html>

<head>
    <title></title>
    <link href="/weaversj/sqlRunner/css/sqlRun.css" rel="stylesheet" type="text/css"/>
    <link rel="stylesheet" href="/weaversj/public_ui/layui/css/layui.css" media="all">
    <script src="/weaversj/public_ui/layui/layui.js" charset="utf-8"></script>
    <script src="/weaversj/sqlRunner/js/sqlRunjs.js"></script>
    <style>
    </style>
</head>

<body style="font-size: 18px;">

<div class="layui-collapse" lay-filter="test">
    <div class="layui-colla-item">
        <h2 class="layui-colla-title">数据库工具</h2>
        <div class="layui-colla-content layui-show">
            <form class="layui-form layui-form-pane" action="">
                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label">执行类型</label>
                        <div class="layui-input-block">
                            <select id="sqltype" lay-verify="" lay-filter="sqltypeFilter">
                                <option value=""></option>
                                <option value=0 selected>根据前六位自动判断</option>
                            </select>
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">数据源</label>
                        <div class="layui-input-inline" lay-filter="pointIdFilterFather">
                            <select lay-verify="" id="pointId" lay-filter="pointIdFilter">
                            </select>
                        </div>

                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">源类型</label>
                        <div class="layui-input-inline">
                            <input type="text" class="layui-input" readonly="readonly" id="dbtype">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" onclick="loadDBS()">
                            刷新数据源
                        </button>
                    </div>
					<div class="layui-inline" style="width: 40%";>
                        <button type="button" class="layui-btn layui-btn-primary layui-btn-sm" style="width: 100%;"	 onclick="executeSQLjs()">
                            执行sql
                        </button>
                    </div>
                </div>


                <div class="layui-inline" style="width:80%;">
                    <div class="layui-form-item layui-form-text">
                        <label class="layui-form-label" style="">sql输入框 <span style="color:red;">请根据数据源类型编写合适的sql语句，已自动分页</span></label><!---->
                        <div class="layui-input-block">
                            <textarea placeholder="请输入sql语句" class="layui-textarea" rows="8" id="sqls"
                                      name="sqls"></textarea>
                        </div>
                    </div>
                </div>

                <div class="layui-inline" style="width:18%;">
					<fieldset class="layui-elem-field layui-field-title" style="margin-top: -20px;margin-bottom: 0px;">
						<legend>历史sql</legend>
					</fieldset>
                    <div id="nesstips">
                        <table class="layui-hide" id="hsql" lay-filter="table"></table>
                    </div>
                </div>
            </form>


        </div>
        <div class="layui-colla-item">
            <h2 class="layui-colla-title">执行结果</h2>
            <div class="layui-colla-content layui-show">
				<label id = "msg"> </label>
				<div id="executeSQLjsdiv"><table class="layui-hide" id="executeSQLjs" lay-filter="executeSQLjs"></table></div>
            </div>
        </div>
    </div>


</body>
<!--
<script>
	jQuery(function(){
		jQuery("#table2 td").mouseover(function(){
			overShow("列:"+jQuery(this).attr("colnum"));
		});
		jQuery("#table2 td").mouseout(function(){
			outHide();
		});
		jQuery("#table1 td").click(function(){
			jQuery("#sqls").val(jQuery(this).text());
		});
	});
</script>
 -->
<script>

    /*
    $.ajax({          
                url:"发送请求（提交或读取数据）的地址", 
             dataType:"预期服务器返回数据的类型",  
             type:"请求方式", 
             async:"true/false",
             data:{发送到/读取后台（服务器）的数据},
             success:function(data){请求成功时执行},      
             error:function(){请求失败时执行}
    });
    */

    //加载历史sql
    function loadHsql() {
        layui.use('table', function () {
            var table = layui.table;
            table.render({
                elem: '#hsql'
                , url: '/weaversj/sqlRunner/SqlRunController.jsp?action=HistorySql&top=10'
                , cellMinWidth: 100 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
                , cols: [[
                    {field: 'sqltext', title: 'sql'}
                    , {field: 'pointid', title: '数据源'}
                    , {field: 'type', title: '类型'}
                ]]
                , height: 175
                , size: 'sm'
                , id: 'idTest'
                , name: 'nameTest'
                , parseData: function (res) { //res 即为原始返回的数据
                    //console.log(res);
                }
                , done: function (res) {
                    tdTitle();
                }
            });
            //绑定事件
            table.on('row(table)', function (obj) {   //table是lay-filter的值
                var data = obj.data;
                $("#pointId").val(data.pointid);
                $("#sqls").val(data.sqltext);
                $("#dbtype").val(data.type);
                //console.log(obj.data) //得到当前行数据
                //console.log(obj.tr) //得到当前行元素对象
                //obj.del(); //删除当前行
                //obj.update(fields) //修改当前行数据
				layui.use('form', function(){
					//重新渲染select
					layui.form.render('select');//select是固定写法 不是选择器
				})
            });
        });
    }

    //加载数据源
    var dbsType = []; //存储数据源类型
    function loadDBS() {
        jQuery.ajax({
            url: "/weaversj/sqlRunner/SqlRunController.jsp",
            dataType: "text",  //为什么不是json         
            type: "get",
			async:"false",
            data: {
                action: 'DataSourceInfo'
            },
            success: function (data) {
                var dataJson = JSON.parse(data);
                //console.log(dataJson);
                for (let key in dbsType) {
                    delete dbsType[key];
                }
				$("#pointId").find("option").remove();
                $("#pointId").append("<option value='LOCAL' selected=''>本地</option>");
                $("#dbtype").val("LOCAL");
				dbsType["LOCAL"] = "LOCAL";
                $("#sqls").val("");

                var dataList = dataJson.data;
                for (var i = 0; i < dataList.length; i++) {
                    $("#pointId").append("<option value='" + dataList[i].pointid + "'>" + dataList[i].pointid + "</option>");  //为Select追加一个Option(下拉项)
                    dbsType[dataList[i].pointid] = dataList[i].type;
                }
				layui.use('form', function(){
					//重新渲染select
					layui.form.render('select');//select是固定写法 不是选择器
					layui.form.on('select(pointIdFilter)', function(data){
						//console.log(data.elem); //得到select原始DOM对象
						//console.log(data.othis); //得到美化后的DOM对象
						//console.log(data.value); //得到被选中的值
						//加载数据源类型
						$("#dbtype").val(dbsType[data.value]);
					});
				})
                //console.log(dbsType);
				
            },
            error: function (data) {
                console.log("失败:" + data);
            }
        })
    }

    //sql查询
    function executeSQLjs() {
        var sqlstr = jQuery("#sqls").val().trim();
		if(typeof(sqlstr)=="undefined" || sqlstr==0 || sqlstr==""){
			$('#msg').text("sql不能为空");
			$('#executeSQLjsdiv').html("<table class='layui-hide' id='executeSQLjs' lay-filter='executeSQLjs'></table>");
			return;
		}
		//console.log(sqlstr);
		//sqlstr = encodeURIComponent(sqlstr);  //url特殊字符转码
		//console.log(sqlstr);
		var base = new Base64();
		sqlstr = base.encode(sqlstr);    //base64加密
		//console.log(sqlstr);
        var pointid = jQuery("#pointId").val();
        var dbtype = jQuery("#dbtype").val().trim();
        var my_cols;
		var my_data = {
                    sql: sqlstr,
                    pointid: pointid,
                    dbtype: dbtype,
                    action: 'executeSql',
					page: 1,
					limit: 1,
					isCols: 'true'
                };
        console.log("my_data---"+my_data);
		
		$.ajax({          
            url:"/weaversj/sqlRunner/SqlRunController.jsp",
            dataType:"text",  
			type:"post", 
			data:my_data,
			success:function(res){
				var data = JSON.parse(res);
				var exp = data.data;
				//console.log("exp---"+exp);
				if((!exp || typeof(exp)=="undefined") && exp!=0){  //当json的date为null或不存在时，可表明此语句为非Select
					//console.log("msg:"+data.msg);	
					$('#msg').text(data.msg);
					$('#executeSQLjsdiv').html("<table class='layui-hide' id='executeSQLjs' lay-filter='executeSQLjs'></table>");
				} else {
					var colstr = new Array();
                    for (const key in exp[0]) {
                        if (key !== "LAY_TABLE_INDEX")
                            colstr.push({field: key, title: key});
                    }
                    my_cols = [colstr];
					//console.log("my_cols---"+my_cols);
					layui.use('table', function () {             //无法实现layui动态表头，只能查表获取表头，然后再查表获取数据
						var table = layui.table;
						table.render({
							elem: '#executeSQLjs'
							, url: '/weaversj/sqlRunner/SqlRunController.jsp'
							//,cellMinWidth: 100 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
							, cols: my_cols
							, page: true //开启分页
							, method: 'post'
							, where: {
								sql: sqlstr,
								pointid: pointid,
								dbtype: dbtype,
								action: 'executeSql',
								isCols: 'false'
							}
							, id: 'testReload'
							, parseData: function (res) { //res 即为原始返回的数据
								//console.log(res);
							}
							, done: function (res) {  //回调
								tdTitle();
								$('#msg').text("");
							}
						});
					});
				}
				//刷新历史sql
				loadHsql();
			},			
			error:function(data){
				alert("error: "+data);
			}
        });
    };
	

    //初始化
    $(function () {
        loadHsql();
        loadDBS();
    });


    //tips,有问题
    function tdTitle() {
        $('th').each(function (index, element) {
            $(element).attr('title', $(element).text());
        });
        $('td').each(function (index, element) {
            $(element).attr('title', $(element).text());
        });
    };

</script>

<script>
    //layui折叠面板
    layui.use(['element', 'layer'], function () {
        var element = layui.element;
        var layer = layui.layer;

        /* //监听折叠
          element.on('collapse(test)', function(data){
            layer.msg('展开状态：'+ data.show);
          });*/
    });
	
</script>
</html>