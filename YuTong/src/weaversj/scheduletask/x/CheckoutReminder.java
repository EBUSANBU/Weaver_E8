package weaversj.scheduletask.x;

import weaver.conn.RecordSet;
import weaver.general.BaseBean;
import weaver.interfaces.schedule.BaseCronJob;
import weaversj.CreateWorkflowUtil;
import weaversj.csxutil.log.LogUtil;

import java.util.*;

/**
 * 裕同退房提醒流程定时任务类
 */
public class CheckoutReminder extends BaseCronJob {
    private static final LogUtil log = LogUtil.getLogger(CheckoutReminder.class.getName());

    private static String workFlowId;//写到配置里
    private static Boolean OPEN = true;  //推送是否开启
    private final static String path = "weaversj.scheduletask.x.properties.checkout_reminder_workflow";
    static {
        try {
            ResourceBundle bundle = ResourceBundle.getBundle(path, new Locale("zh", "CN"));
            workFlowId = bundle.getString("CheckoutReminderWorkFlowId");
        } catch (Exception ex) {
            log.error("[Property]:Can't Load weaversj.scheduletask.x.properties.checkout_reminder_workflow.properties");
            OPEN = false;
        }
    }

    public void execute() {
        if (!OPEN){
            log.error("退房提醒流程推送计划任务开始未正常开启");
            return;
        }
        log.info("退房提醒流程推送计划任务开始");
        if (pushing())
            log.info("退房提醒流程推送结束");
    }



    /**
     * 获取需推送人员
     * @return
     */
    private ArrayList<HashMap<String, Object>> getPushedPeople(){
        RecordSet rs = new RecordSet();
        String sql ="select  workcode, name, sugy, sqrgh,sqrxm,dbrxm,dbrgh,roomnum from uf_fjsq ";
        if (rs.getDBType().equals("oracle")) {
            sql += " where  to_date(enddate,'yyyy-mm-dd') =  trunc(sysdate+1,'day') ";
        } else{
            sql += " where  convert(varchar(7),enddate,23) = CONVERT(varchar(100),getdate()+1,23) ";
        }
        rs.execute(sql);
        /**
         * hashMapArrayList一条记录为一条流程,多人力分别对应 住宿人员(外部人员忽略)，申请人，宿管员
         */
        ArrayList<HashMap<String,Object>> hashMapArrayList = new ArrayList<HashMap<String,Object>>();
        while (rs.next()){
            HashMap<String,Object> people = new HashMap<>();
            String name = rs.getString("name");
            String drl; //多人力
            if (!"".equals(name)){
                drl=rs.getString("name")+","+rs.getString("sqrxm")+","+rs.getString("sugy");
            } else {
                drl=rs.getString("sqrxm")+","+rs.getString("sugy");
            }
            people.put("xm",drl);
            people.put("nr","请第二天12点前办理退宿，归还钥匙");
            people.put("fjh",rs.getString("roomnum"));
            hashMapArrayList.add(people);
        }
        return hashMapArrayList;
    }

    /**
     * 推送
     * @return  成功返回 true
     */
    private boolean pushing() {
        ArrayList<HashMap<String ,Object>> hashMapArrayList = getPushedPeople();
        log.info(hashMapArrayList.toString());
        try {
            for (HashMap<String,Object> mainTableMap :
                    hashMapArrayList) {
                CreateWorkflowUtil result =  new CreateWorkflowUtil.Builder(workFlowId,
                        "退房提醒流程" ,
                        mainTableMap).build();
                // Logs.logWrites(Pages.fileLocator_url,"员工转正申请流程：requestId：" + result.requestid + " message: " + result.message);
                if (!result.flag) {
                    log.error("用户["+mainTableMap.get("xm")+"]-退房提醒流程推送失败：requestId：" + result.requestid + " message: " + result.message);
                }else {
                    log.error("用户["+mainTableMap.get("xm")+"]-退房提醒流程推送成功：requestId：" + result.requestid + " message: " + result.message);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            new BaseBean().writeLog(e);
            log.error(e.getMessage());
            return false;
        }
        return true;
    }
    public static void main(String[] args) {
        // TODO Auto-generated method stub
    }

}
