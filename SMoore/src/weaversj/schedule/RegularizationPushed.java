package weaversj.schedule;

import com.weaver.general.Util;
import weaver.conn.RecordSet;
import weaver.interfaces.schedule.BaseCronJob;
import weaversj.CreateWorkflowUtil;
import weaversj.csxutil.log.LogUtil;

import java.util.*;

/**
 * 转正推送计划任务实现类
 * 继承自AbstractRegularizationPushed
 */
public class RegularizationPushed extends BaseCronJob {


    private static final LogUtil log = LogUtil.getLogger(RegularizationPushed.class.getName());

    private static String workFlowId;//写到配置里
    private final static String path = "weaversj.properties.workflow";
    static {
        try {
            ResourceBundle bundle = ResourceBundle.getBundle(path, new Locale("zh", "CN"));
            workFlowId = bundle.getString("RegularizationPushedWorkFlowId");
        } catch (Exception ex) {
            log.error("[Property]:Can't Load workflow_zh_CN.properties");
        }
    }

    /**
     * 条件
     * 部门不为空
     * 推送次数为零（即未推送）
     * 有账号（hrmresource 的外键工号：判断条件: loginid不为空）
     * 转正时间在当前时间往后一个月内
     * 转正状态 为 未转正（0）
     */
    private final static String sqlString =
            "SELECT departmentid,subcompanyid1,syqx,syqdqr,zt,ycys,ychdqr,bz,uf_hrmsyq.id,pushed,gh,xm,rzrq,hrmresource.[type_desc],hrmresource.off_probation_date,hrmresource.off_probation_month,hrmresource.jobtitle FROM uf_hrmsyq, hrmresource WHERE uf_hrmsyq.gh = hrmresource.workcode "+
    " AND hrmresource.loginid IS NOT NULL AND uf_hrmsyq.bm  IS NOT NULL " +
    " AND CONVERT(DATE,hrmresource.off_probation_date, 20)<=CONVERT(DATE,DATEADD(MONTH,1,GETDATE()), 20) AND (pushed IS NULL OR pushed = 0) and uf_hrmsyq.zt = 0 and hrmresource.[status] <> 5 " +
    " and hrmresource.[type_desc] is not null  and CONVERT(DATE,hrmresource.off_probation_date, 20) >= CONVERT(DATE,GETDATE(), 20) order by uf_hrmsyq.syqdqr  desc ";


    private final static String updatePushedSqlString = "update uf_hrmsyq set pushed = ? where id = ?";

    @Override
    public void execute() {
        log.info("转正推送计划任务开始");
        if (regularizationPushed())
            log.info("转正推送结束");
    }

    /**
     * 获取需推送人员
     * @return
     */
    private ArrayList<HashMap<String, Object>> getPushedPeople(){
        RecordSet rs = new RecordSet();
        rs.execute(sqlString);
        ArrayList<HashMap<String,Object>> hashMapArrayList = new ArrayList<HashMap<String,Object>>();

        /*Calendar c = getInstance();
        c.add(MONTH, 1);
        //当前时间往后一个月
        Date currentDate = c.getTime();
        */
        while (rs.next()) {
            /*// 推送人员时间范围：转正时间在当前时间往后一个月内
            if (currentDate.compareTo(rs.getDate("syqdqr")) >= 0){
                HashMap people = new HashMap();

                hashMapArrayList.add(people);
            }*/
            //这里是建模的表，要与流程的表一一对应（如果对应的上），如果类型不对还有进行转换
            HashMap people = new HashMap();
            people.put("id", Util.null2String(rs.getString("id")));
            //people.put("pushed", Util.null2String(rs.getString("pushed")));
            people.put("workcode", Util.null2String(rs.getString("gh")));
            people.put("employee", Util.null2String(rs.getString("xm")));
            people.put("startdate", Util.null2String(rs.getString("rzrq")));
            people.put("off_probation_date", Util.null2String(rs.getString("off_probation_date")));
            people.put("emp_pos_level", Util.null2String(rs.getString("type_desc")));
            people.put("position", Util.null2String(rs.getString("jobtitle")));
            people.put("off_probation_month", Util.null2String(rs.getString("off_probation_month")));
            people.put("subcompany", Util.null2String(rs.getString("departmentid")));
            people.put("department", Util.null2String(rs.getString("subcompanyid1")));
            //people.put("syqx", Util.null2String(rs.getString("syqx")));
            //people.put("zt", Util.null2String(rs.getString("zt")));
            //people.put("ycys", Util.null2String(rs.getString("ycys")));
            //people.put("ychdqr", Util.null2String(rs.getString("ychdqr")));
            //people.put("bz", Util.null2String(rs.getString("bz")));
            //Logs.logWrites(Pages.fileLocator_url,people.toString());
            hashMapArrayList.add(people);
        }
        return hashMapArrayList;
    }

    /**
     * 推送待办
     * @return  成功返回 true
     */
    private boolean regularizationPushed() {
        RecordSet rs = new RecordSet();
        ArrayList<HashMap<String,Object>> hashMapArrayList = getPushedPeople();
        try {
            for (HashMap<String,Object> mainTableMap :
                    hashMapArrayList) {
                log.info(mainTableMap.toString());
                CreateWorkflowUtil result =  new CreateWorkflowUtil.Builder(workFlowId,
                         "员工转正申请流程" ,
                         mainTableMap).setIsSubmitNext(1).build();
               // Logs.logWrites(Pages.fileLocator_url,"员工转正申请流程：requestId：" + result.requestid + " message: " + result.message);
                if (result.flag) {
                    if (!rs.executeUpdate(updatePushedSqlString,1, Integer.valueOf((String) mainTableMap.get("id")))) {
                        log.error("员工转正申请表uf_hrmsyq的 pushed状态更改失败");
                    }
                }  else {
                    log.error("员工[工号："+ mainTableMap.get("workcode") +"]转正申请流程推送失败：requestId：" + result.requestid + " message: " + result.message);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error(Arrays.toString(e.getStackTrace()));
            return false;
        }
        return true;
    }
}
