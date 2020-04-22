<%@ page import="weaversj.x.workflow.cpq.util.CPQChangeContractStatus" %>
<%@ page import="net.sf.json.JSONObject" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Map" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
    out.print(new CPQChangeContractStatus().doTest());
%>
