
//根据销售合同台账的明细表8带出财务信息。
function autoval(field, mainId, detail) {
    jQuery.ajax({
        url: "/weaversj/x/tencent/jsp/GetUf_HTTZB_dt8Val.jsp?mainId=" + mainId,
        type: "get",
        // async: "false",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            relodDetail(data, field, detail)
        }
    })
}

//更新财务信息明细表 dataToMode 建模数据 field id数组，detail 明细表下表
function relodDetail(dataToMode, field, detail) {
    var dtFieldID = field["did" + detail];
    var htjeCNY = jQuery("#"+field['mid']['htjeCNY']).val();

    var detailIndex = detail - 1;
    _C.deleteRow(detailIndex);
    var dateLength = dataToMode.length;
    if (dateLength !== 0){
        //console.log("dateLength::::"+dateLength);
        for (var i = 0; i <= dateLength; i++) {
            jQuery("button[name='addbutton" + detailIndex + "']").click();
        }
        //填充行信息
        setTimeout(function () {
            var index = 0;
            var deleteIndex = 0;
            jQuery("select[id^='" + dtFieldID['jt_kxxz'] + "_']").each(function (key, value) {

                var dt_index = jQuery(this).attr("id").split("_")[1];//截取明细下标

                deleteIndex = dt_index;

                if (index > (dateLength - 1)) {
                    return;
                }

                var jt_kxxz = dataToMode[index]['jt_kxxz'];
                jQuery("#" + dtFieldID['jt_kxxz'] + "_" + dt_index).val(jt_kxxz);//款项性质 下拉选择框
                //jQuery("#"+dtFieldID['jt_kxxz']+"_"+dt_index).change();
                jQuery("#" + dtFieldID['jt_kxxz'] + "_" + dt_index + "span").html("");//款项性质 下拉选择框

                setFieldValue_browser(dtFieldID['jt_wfztmc'] + "_" + dt_index, dataToMode[index]['jt_wfztmcs'], dataToMode[index]['wofzt']);//我方主体名称 浏览按钮
                jQuery("#" + dtFieldID['jt_wfskxw'] + "_" + dt_index).val(dataToMode[index]['jt_wfskxw']); //我方收付款行为 下拉选择框
                _C.vt(dtFieldID['jt_tfztmc'] + "_" + dt_index, dataToMode[index]['jt_tfztmc'], dataToMode[index]['jt_tfztmc']);//他方主体名称  文本框
                _C.vt(dtFieldID['jt_tfztbm'] + "_" + dt_index, dataToMode[index]['jt_tfztbm'], dataToMode[index]['jt_tfztbm']);//他方主体编码  文本框
                _C.vt(dtFieldID['jt_tfztyhzhbm'] + "_" + dt_index, dataToMode[index]['jt_tfztyhzhbm'], dataToMode[index]['jt_tfztyhzhbm']);//他方主体银行账号编码  文本框

                _C.vt(dtFieldID['jt_wfztbm'] + "_" + dt_index, dataToMode[index]['jt_wfztbm'], dataToMode[index]['jt_wfztbm']);//我方主体编码 文本框


                jQuery("#" + dtFieldID['jt_kxjsfs'] + "_" + dt_index).val(dataToMode[index]['jt_kxjsfs']);//款项结算方式 下拉选择框
                jQuery("#" + dtFieldID['jt_kxjehllx'] + "_" + dt_index).val(dataToMode[index]['jt_kxjehllx']);//款项金额汇率类型 下拉选择框
                _C.vt(dtFieldID['jt_kxjebzmc'] + "_" + dt_index, dataToMode[index]['jt_kxjebzmc'], dataToMode[index]['biz']);//款项金额币种名称 浏览按钮
                //_C.vs(dtFieldID['jt_kxjebzbm']+"_"+dt_index,dataToMode[index]['jt_kxjebzbm'],dataToMode[index]['jt_kxjebzbm']);//款项金额币种编码 文本框
                //_C.vs(dtFieldID['jt_kxjehl']+"_"+dt_index,dataToMode[index]['jt_kxjehl'],dataToMode[index]['jt_kxjehl']);//款项金额汇率 文本框
                _C.vt(dtFieldID['jt_kxje'] + "_" + dt_index, dataToMode[index]['jt_kxje'], '');//款项金额 文本框

                jQuery("#" + dtFieldID['jt_kxfplx'] + "_" + dt_index).val(dataToMode[index]['jt_kxfplx']);//款项发票类型 选择框


                jQuery("#" + dtFieldID['jt_kxxyqqskj'] + "_" + dt_index).html("<option></option><option value='5'>验收完成且收到发票后</option><option value='8'>合同签订后</option><option value='9'>指定最晚付款日</option>");
                jQuery("#" + dtFieldID['jt_kxxyqqskj'] + "_" + dt_index).val(dataToMode[index]['jt_kxxyqqskj']);//款项信用期起算口径 选择框 被联动
                jQuery("#" + dtFieldID['jt_kxxyqqskj'] + "_" + dt_index).change();
                jQuery("#" + dtFieldID['jt_kxxyqqskj'] + "_" + dt_index + "span").html("");//款项信用期起算口径 选择框

                jQuery("#" + dtFieldID['jt_kpyd'] + "_" + dt_index).html("<option></option><option value='4'>先付款后开票</option><option value='5'>先开票后付款</option><option value='6'>无发票(付款)</option>");
                jQuery("#" + dtFieldID['jt_kpyd'] + "_" + dt_index).val(dataToMode[index]['jt_kpyd']);//开票约定  选择框 被联动
                jQuery("#" + dtFieldID['jt_kpyd'] + "_" + dt_index + "span").html("");//开票约定  选择框

                index++;

            });

            setTimeout(function () {
                _C.deleteRow(detailIndex, "_" + parseInt(deleteIndex));

            }, 1000);

        }, 1000);
    }
}

