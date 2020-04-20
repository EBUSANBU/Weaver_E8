<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%@ page import="weaver.general.Util" %>
<%@ page import="weaver.conn.RecordSet" %>
<%@ page import="weaver.general.BaseBean" %>
<%@ page import="com.alibaba.fastjson.JSONObject" %>
<%@ page import="com.alibaba.fastjson.JSONArray" %>
<%
    RecordSet rs = new RecordSet();
    String formid = Util.null2String(request.getParameter("formid"));
    String sql;

    // sql = "select tablename from workflow_bill where id="+formid;
    //rs.execute(sql);
    //String tablename = rs.getString("tablename"); //用不上
    //当前月的上一月
    sql = "select sum(to_number(uf_fjsq.jine)) money ,uf_fjsq.sugy,uf_fjsq.depart from uf_fjsq where to_date(uf_fjsq.enddate,'yyyy-mm-dd') >= add_months(trunc(sysdate,'month'),0) and to_date(uf_fjsq.enddate,'yyyy-mm-dd') < add_months(trunc(sysdate,'month'),1) and uf_fjsq.flag is null group by uf_fjsq.depart,uf_fjsq.sugy  ";
    rs.execute(sql);

    JSONObject jsonObject = new JSONObject();
    RecordSet recordSet = new RecordSet();
    if (!rs.next()){
        jsonObject.put("code", "-1");
    } else {
        if ("".equalsIgnoreCase(formid)){
            //返回数据
            JSONArray dtList = new JSONArray();
            JSONObject dt1 = new JSONObject();
            dt1.put("money",rs.getString("money"));
            dt1.put("sugy",rs.getString("sugy"));
            dt1.put("depart",rs.getString("depart"));
            if (!"".equals(rs.getString("sugy"))){
                recordSet.execute("select lastname from HrmResource where id = "+rs.getString("sugy"));
                if(recordSet.next()){
                    dt1.put("lastname",recordSet.getString("lastname"));
                }
            }
            if (!"".equals(rs.getString("depart"))){
                recordSet.execute("select departmentname from HrmDepartment where id = "+rs.getString("depart"));
                if(recordSet.next()){
                    dt1.put("departmentname",recordSet.getString("departmentname"));
                }
            }
            dtList.add(dt1);
            while (rs.next()){
                JSONObject dt = new JSONObject();
                dt.put("money",rs.getString("money"));
                dt.put("sugy",rs.getString("sugy"));
                dt.put("depart",rs.getString("depart"));
                if (!"".equals(rs.getString("sugy"))){
                    recordSet.execute("select lastname from HrmResource where id = "+rs.getString("sugy"));
                    if(recordSet.next()){
                        dt.put("lastname",recordSet.getString("lastname"));
                    }
                }
                if (!"".equals(rs.getString("depart"))){
                    recordSet.execute("select departmentname from HrmDepartment where id = "+rs.getString("depart"));
                    if(recordSet.next()){
                        dt.put("departmentname",recordSet.getString("departmentname"));
                    }
                }
                dtList.add(dt);
            }
            jsonObject.put("dtList",dtList);
           /* sql = "update uf_fjsq set flag = '1' where  to_date(enddate,'yyyy-mm-dd') >= add_months(trunc(sysdate,'month'),0) and to_date(enddate,'yyyy-mm-dd') <add_months(trunc(sysdate,'month'),1) ";

            rs.execute(sql);*/
        } else {
            jsonObject.put("code", "0");
        }
    }
    //new BaseBean().writeLog("----------jsonObject---------"+jsonObject.toJSONString());

    out.write(jsonObject.toJSONString());
    out.flush();

%>