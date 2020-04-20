function clickAndSend(formid) {
    console.log("formid: "+formid);
    //**********汇总金额访问jsp通过formid获取数据并汇总金额返回
    jQuery.ajax({
        type: "post",
        url: "/weaversj/x/yt/jsp/GetMoney.jsp",
        data:{formid: formid},
        dataType: "json",
        async: false,
        success: function (data) {
            console.log(data);
            if (data.code == '-1')
                alert("上月金额汇总已发起！");
            else {
                window.open('/workflow/request/AddRequest.jsp?workflowid=16041&isagent=0&beagenter=0&f_weaver_belongto_userid=&need=1', '', 'height='+windowHeight()+', width='+windowWidth()+', top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
            }
        }
    });
}
//按房间申请按部门获取金额汇总列表并填入
function setDtList(f) {
    jQuery.ajax({
        type: "post",
        url: "/weaversj/x/yt/jsp/GetMoney.jsp",
        dataType: "json",
        //async: false,
        success: function (data) {
            console.log(data);
            console.log(f);
            data = data.dtList;
            data.forEach(function () {
                jQuery("button[name='addbutton0']").click();
            });
            setTimeout(function () {
                var index = 0;
                jQuery("input[id^='" + f['did1']['feiy'] + "_']").each(function () {
                    var dt_index = jQuery(this).attr("id").split("_")[1];//截取明细下标
                    _C.v(f['did1']['feiy'] + "_" + dt_index,data[index].money);
                    console.log(f['did1']['feiy'] + "_" + dt_index+"_"+data[index].money);
                    _C.vt(f['did1']['feiycdbm'] + "_" + dt_index,data[index].depart,data[index].departmentname);
                    console.log(f['did1']['feiycdbm'] + "_" + dt_index+"_"+data[index].depart+"_"+data[index].departmentname);
                    _C.vt(f['did1']['sugy'] + "_" + dt_index,data[index].sugy,data[index].lastname);
                    console.log(f['did1']['sugy'] + "_" + dt_index+"_"+data[index].sugy+"_"+data[index].lastname);
                    index++;
                });
            },1500);

        }
    });
}

function windowHeight() {
    return window.screen.height;
}

function windowWidth() {
    return window.screen.width;
}