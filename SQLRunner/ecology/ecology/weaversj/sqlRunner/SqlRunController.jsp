<%@ page language="java" contentType="text/html; charset=UTF-8" %> 
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="weaver.conn.RecordSet" %>
<%@ page import="weaversj.hpage.action.SqlRunAction" %>
<%@ page import="weaver.general.Util" %>
<%@ page import="weaver.general.BaseBean" %>
<%@ page import="weaversj.hpage.util.EncodingUtil" %>
<%@ page import="weaversj.hpage.util.Base64Util" %>
<%
	
	String action = Util.null2String(request.getParameter("action"));
	SqlRunAction sqlRunAction = new SqlRunAction();
	String result;
	
	if("HistorySql".equals(action)){ //获取历史sql
		String top = Util.null2String(request.getParameter("top"));
		result = sqlRunAction.getHistorySql(Integer.valueOf(top));
	//	new BaseBean().writeLog("HistorySql-----------"+result);
		out.print(result.trim());
	} else if("DataSourceInfo".equals(action)){
		result = sqlRunAction.getDataSourceInfo();
		//new BaseBean().writeLog("DataSourceInfo-----------"+result);
		out.print(result.trim());
		
	} else if("executeSql".equals(action)){
		//String sql = EncodingUtil.decodeURIComponent(Util.null2String(request.getParameter("sql"))); //url特殊字符解码
		String sql = Base64Util.decode(Util.null2String(request.getParameter("sql")));   //base64解码
		String pointid = Util.null2String(request.getParameter("pointid"));
		String dbtype = Util.null2String(request.getParameter("dbtype"));
		String pageNum = Util.null2String(request.getParameter("page"));
		String pageSize = Util.null2String(request.getParameter("limit"));
		String isCols = Util.null2String(request.getParameter("isCols"));  //是否是获取表头
		//new BaseBean().writeLog("executeSql-----before------"+sql+":"+pointid+":"+dbtype+":"+pageNum+":"+pageSize+":"+Boolean.valueOf(isCols));
		result = sqlRunAction.executeSql(sql,Integer.valueOf(pageNum.trim()),Integer.valueOf(pageSize.trim()),pointid,dbtype,Boolean.valueOf(isCols));
		//new BaseBean().writeLog("executeSql---after--------"+result);
		out.print(result.trim());
	} else{
		out.print("<script> alert('请求错误，请联系管理员')</script>");
	}
%>

