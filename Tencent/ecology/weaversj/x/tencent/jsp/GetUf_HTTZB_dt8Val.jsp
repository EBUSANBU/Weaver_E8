<%@ page import="weaver.general.Util" %>
<%@ page import="weaver.conn.RecordSet" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="weaver.integration.util.JSONUtil" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
    String mainId = Util.null2String(request.getParameter("mainId"));
    String sql = "select  jt_wfztmcs,jt_wfztbm,jt_wfskxw,jt_tfztmc,jt_tfztbm,jt_kxjebzbm,jt_tfztyhzhbm,jt_kxjebzmc ,jt_kxxz,jt_kxjsfs,jt_kxjehllx,jt_kxjehl,jt_kxje,jt_kxxyqqskj,jt_kxxyq,jt_kxfplx,jt_kpyd, WOFZT,BIZ from uf_WFZTB,uf_HTTZB_dt8,uf_BZB where uf_WFZTB.id=jt_wfztmcs and uf_BZB.id=uf_HTTZB_dt8.jt_kxjebzmc and uf_HTTZB_dt8.mainid ="+mainId;

    RecordSet rs = new RecordSet();
    rs.execute(sql);
    List<Map<String,Object>> mapList = new ArrayList<>();

    while (rs.next()){
        Map<String,Object> map = new HashMap<>();
        map.put("jt_wfztmcs",rs.getInt("jt_wfztmcs"));
        map.put("jt_wfztbm",rs.getString("jt_wfztbm"));
        map.put("jt_wfskxw",rs.getInt("jt_wfskxw"));
        map.put("jt_tfztmc",rs.getString("jt_tfztmc"));
        map.put("jt_tfztbm",rs.getString("jt_tfztbm"));
        map.put("jt_tfztyhzhbm",rs.getString("jt_tfztyhzhbm"));
        map.put("jt_kxxz",rs.getInt("jt_kxxz"));
        map.put("jt_kxjsfs",rs.getInt("jt_kxjsfs"));
        map.put("jt_kxjehllx",rs.getInt("jt_kxjehllx"));
        map.put("jt_kxjebzmc",rs.getInt("jt_kxjebzmc"));
        map.put("jt_kxjebzbm",rs.getString("jt_kxjebzbm"));
        map.put("jt_kxjehl",rs.getString("jt_kxjehl"));
        map.put("jt_kxje",rs.getString("jt_kxje"));
        map.put("jt_kxxyqqskj",rs.getInt("jt_kxxyqqskj"));
        map.put("jt_kxxyq",rs.getInt("jt_kxxyq"));
        map.put("jt_kxfplx",rs.getInt("jt_kxfplx"));
        map.put("jt_kpyd",rs.getInt("jt_kpyd"));
        map.put("biz",rs.getString("BIZ"));
        map.put("wofzt",rs.getString("WOFZT"));
        mapList.add(map);
    }
    out.print(JSONUtil.toJSONString(mapList));
    //out.flush();
%>