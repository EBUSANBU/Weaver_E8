function modifyOrDe(f) {
    var fieldIdOfSelect = f["htcj"];         //下拉框fieldid，即合同场景fieldid
    var selectValue = 2;                     // 条件值，即下拉框选项为合同场景的为终止的选项值
    var fieldIdOfWJKX = f["sfywjkx"];                  //未结款项字段fieldid
    var fieldIdOfZZYYSM = f["zzyysm"];              //终止原因说明字段fieldid
    var fieldIdOfCDHX = f["sfycdhed"];              ///冲抵\核销事项字段fieldid
    var fieldIdOfCDSYSM = f["cdsxsm"];              //冲抵事项说明字段fieldid
    var fieldName = 'isShow';             //行name

    //console.log("合同场景:" + jQuery('#' + fieldIdOfSelect).val());
    //console.log("未结款项字段fieldid:" + fieldIdOfWJKX);
    //console.log("终止原因说明字段fieldid:" + fieldIdOfZZYYSM);
    //console.log("冲抵核销事项字段fieldid:" + fieldIdOfCDHX);
    //console.log("冲抵事项说明字段fieldid:" + fieldIdOfCDSYSM);

    if (jQuery('#' + fieldIdOfSelect).val() == selectValue) {
        //添加验证 必填
        addInputCheckField(fieldIdOfZZYYSM, fieldIdOfZZYYSM + 'span');
        showTRByField(fieldIdOfZZYYSM);
        addInputCheckField(fieldIdOfWJKX, fieldIdOfWJKX + 'span');
        showTRByField(fieldIdOfWJKX);
        addInputCheckField(fieldIdOfCDHX, fieldIdOfCDHX + 'span');
        showTRByField(fieldIdOfCDHX);
        addInputCheckField(fieldIdOfCDSYSM, fieldIdOfCDSYSM + 'span');
        showTRByField(fieldIdOfCDSYSM);

    } else {
        //移除验证  编辑
        removeInputCheckField(fieldIdOfZZYYSM, fieldIdOfZZYYSM + 'span');
        hideTRByField(fieldIdOfZZYYSM);
        removeInputCheckField(fieldIdOfWJKX, fieldIdOfWJKX + 'span');
        hideTRByField(fieldIdOfWJKX);
        removeInputCheckField(fieldIdOfCDHX, fieldIdOfCDHX + 'span');
        hideTRByField(fieldIdOfCDHX);
        removeInputCheckField(fieldIdOfCDSYSM, fieldIdOfCDSYSM + 'span');
        hideTRByField(fieldIdOfCDSYSM);
    }
}

/**
 * 给字段添加必填验证。
 */
var addInputCheckField = function (fieldId, spanImgId) {
    jQuery('#' + fieldId).attr('viewtype', '1');
    var fieldStr = jQuery('input[name=needcheck]').val();
    if (fieldStr.charAt(fieldStr.length - 1) != ',') {
        fieldStr += ',';
    }
    jQuery('input[name=needcheck]').val(fieldStr + fieldId + ',');
    if (jQuery('#' + fieldId).val().replace(/(^s*)|(s*$)/g, "").length === 0)
        jQuery('#' + spanImgId).html('<img src="/images/BacoError_wev8.gif" align="absMiddle">');
};

/**
 * 移除字段必填验证。
 */
var removeInputCheckField = function (fieldId, spanImgId) {
    jQuery('#' + fieldId).attr('viewtype', '0');
    var fieldStr = jQuery('input[name=needcheck]').val();
    jQuery('input[name=needcheck]').val(fieldStr.replace(fieldId + ',', ''));
    jQuery('#' + spanImgId).html('');
};

/**
 * 根据id隐藏tr
 */
var hideTRByField = function (fieldId) {
    $('#' + fieldId + '_tdwrap').parent().hide();
};
/**
 * 根据id隐藏tr
 */
var showTRByField = function (fieldId) {
    $('#' + fieldId + '_tdwrap').parent().show();
};