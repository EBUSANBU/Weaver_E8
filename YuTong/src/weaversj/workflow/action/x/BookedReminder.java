package weaversj.workflow.action.x;

import weaver.general.BaseBean;
import weaver.interfaces.workflow.action.Action;
import weaver.soa.workflow.request.Cell;
import weaver.soa.workflow.request.DetailTable;
import weaver.soa.workflow.request.Property;
import weaver.soa.workflow.request.RequestInfo;
import weaver.soa.workflow.request.Row;

import weaver.general.Util;
import weaversj.CreateWorkflowUtil;
import weaversj.csxutil.log.LogUtil;
import weaversj.scheduletask.x.CheckoutReminder;

import java.util.*;

/**
 * 审批节点后操纵：订房成功推送流程
 */
public class BookedReminder implements Action {

    private static final LogUtil log = LogUtil.getLogger(CheckoutReminder.class.getName());

    private static String workFlowId;//写到配置里
    private static Boolean OPEN = true;  //推送是否开启
    private final static String path = "weaversj.workflow.action.x.properties.booked_reminder_workflow";
    static {
        try {
            ResourceBundle bundle = ResourceBundle.getBundle(path, new Locale("zh", "CN"));
            workFlowId = bundle.getString("BookedReminderWorkFlowId");
        } catch (Exception ex) {
            log.error("[Property]:Can't Load weaversj.workflow.action.x.properties.booked_reminder_workflow.properties");
            OPEN = false;
        }
    }

    @Override
    public String execute(RequestInfo requestInfo) {
        if (!OPEN){
            log.error("订房成功提醒流程推送未正常开启");
            return Action.SUCCESS;
        }
        log.info("订房成功提醒流程推送开始");
        try{
            if (pushing(requestInfo))
                log.info("订房成功提醒流程推送结束");
        }catch (Exception e){
            e.printStackTrace();
            new BaseBean().writeLog(e);
            log.error(e.getMessage());
        }
        //log.error("---------Action---"+Action.SUCCESS);
        return Action.SUCCESS;
    }

    private ArrayList<HashMap<String, Object>> getPushedPeople(RequestInfo requestInfo){
        ArrayList<HashMap<String,Object>> hashMapArrayList = new ArrayList<HashMap<String,Object>>();
        String rzsj="";
        String tssj="";
        /**
         * 一行明细对应一条流程，多人力对应代办人，申请人，住宿人(若为外部人员，忽略)
         */
        //取主表数据
        Property[] properties = requestInfo.getMainTableInfo().getProperty();// 获取表单主字段信息
        String dbrxm="",sqrxm="";
        for (int i = 0; i < properties.length; i++) {
            String name = properties[i].getName();// 主字段名称
            if (name.equals("dbr")){
                dbrxm = Util.null2String(properties[i].getValue());// 主字段对应的值
            } else if (name.equals("sqrxm")){
                sqrxm = Util.null2String(properties[i].getValue());// 主字段对应的值
            }
        }
        // 取明细数据
        DetailTable[] detailtable = requestInfo.getDetailTableInfo()
                .getDetailTable();// 获取所有明细表
        if (detailtable.length > 0) {
            for (int i = 0; i < detailtable.length; i++) {
                DetailTable dt = detailtable[i];// 指定明细表
                Row[] s = dt.getRow();// 当前明细表的所有数据,按行存储
                for (int j = 0; j < s.length; j++) {
                    HashMap<String, Object> zsr = new HashMap<>(); //住宿人
                    String xm="";
                    boolean needPush = true;
                    Row r = s[j];// 指定行
                    Cell c[] = r.getCell();// 每行数据再按列存储
                    for (int k = 0; k < c.length; k++) {
                        Cell c1 = c[k];// 指定列
                        String name = c1.getName();// 明细字段名称
                        if ("gh".equals(name)) {  //住宿人工号
                            String value = c1.getValue();// 明细字段的值
                            if ("".equals(value))   //如果工号不存在，说明为外部人员
                                needPush = false;
                        } else if ("zsrxm".equals(name)){  //住宿人姓名
                            xm = null2String(c1.getValue());
                        } else if ("rzsj".equals(name)){  //入住时间
                            rzsj = null2String(c1.getValue());
                        } else if ("tssj".equals(name)){   //退宿时间
                            tssj = null2String(c1.getValue());
                        } else if ("fjh".equals(name)){  //房间号
                            zsr.put("fjh",null2String(c1.getValue()));
                        }
                    }
                    zsr.put("nr","您已经成功预订了["+rzsj+"]到["+tssj+"]的房间");
                    if (needPush){
                        zsr.put("xm",sqrxm+","+dbrxm+","+xm);
                    } else {
                        zsr.put("xm",sqrxm+","+dbrxm);
                    }
                    hashMapArrayList.add(zsr);
                }
            }
        }

        return hashMapArrayList;
    }

    private String null2String(String o){
        if (o != null)
            return o;
        else return "";
    }

    private boolean pushing(RequestInfo requestInfo) throws Exception {
        List<HashMap<String, Object>> men = getPushedPeople(requestInfo);
        //log.info(men.toString());
        for (HashMap<String,Object> man:
                men) {
            //log.error("workflowid:"+workFlowId+"man:"+man);
            CreateWorkflowUtil result =  new CreateWorkflowUtil.Builder(workFlowId,
                    "订房成功提醒流程" ,
                    man).build();
            //log.error("用户["+man.get("xm")+"]-订房成功提醒流程推送失败：requestId：" + result.requestid + " message: " + result.message);
            if (!result.flag) {
                log.error("用户["+man.get("xm")+"]-订房成功提醒流程推送失败：requestId：" + result.requestid + " message: " + result.message);
            } else {
                log.info("用户["+man.get("xm")+"]-订房成功提醒流程推送成功：requestId：" + result.requestid + " message: " + result.message);
            }
        }

        return true;
    }
}
