function modifyOrDe(f) {
    var fieldIdOfSelect = f["htcj"];         //������fieldid������ͬ����fieldid
    var selectValue = 2;                     // ����ֵ����������ѡ��Ϊ��ͬ������Ϊ��ֹ��ѡ��ֵ
    var fieldIdOfWJKX = f["sfywjkx"];                  //δ������ֶ�fieldid
    var fieldIdOfZZYYSM = f["zzyysm"];              //��ֹԭ��˵���ֶ�fieldid
    var fieldIdOfCDHX = f["sfycdhed"];              ///���\���������ֶ�fieldid
    var fieldIdOfCDSYSM = f["cdsxsm"];              //�������˵���ֶ�fieldid
    var fieldName = 'isShow';             //��name

    //console.log("��ͬ����:" + jQuery('#' + fieldIdOfSelect).val());
    //console.log("δ������ֶ�fieldid:" + fieldIdOfWJKX);
    //console.log("��ֹԭ��˵���ֶ�fieldid:" + fieldIdOfZZYYSM);
    //console.log("��ֺ��������ֶ�fieldid:" + fieldIdOfCDHX);
    //console.log("�������˵���ֶ�fieldid:" + fieldIdOfCDSYSM);

    if (jQuery('#' + fieldIdOfSelect).val() == selectValue) {
        //�����֤ ����
        addInputCheckField(fieldIdOfZZYYSM, fieldIdOfZZYYSM + 'span');
        showTRByField(fieldIdOfZZYYSM);
        addInputCheckField(fieldIdOfWJKX, fieldIdOfWJKX + 'span');
        showTRByField(fieldIdOfWJKX);
        addInputCheckField(fieldIdOfCDHX, fieldIdOfCDHX + 'span');
        showTRByField(fieldIdOfCDHX);
        addInputCheckField(fieldIdOfCDSYSM, fieldIdOfCDSYSM + 'span');
        showTRByField(fieldIdOfCDSYSM);

    } else {
        //�Ƴ���֤  �༭
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
 * ���ֶ���ӱ�����֤��
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
 * �Ƴ��ֶα�����֤��
 */
var removeInputCheckField = function (fieldId, spanImgId) {
    jQuery('#' + fieldId).attr('viewtype', '0');
    var fieldStr = jQuery('input[name=needcheck]').val();
    jQuery('input[name=needcheck]').val(fieldStr.replace(fieldId + ',', ''));
    jQuery('#' + spanImgId).html('');
};

/**
 * ����id����tr
 */
var hideTRByField = function (fieldId) {
    $('#' + fieldId + '_tdwrap').parent().hide();
};
/**
 * ����id����tr
 */
var showTRByField = function (fieldId) {
    $('#' + fieldId + '_tdwrap').parent().show();
};