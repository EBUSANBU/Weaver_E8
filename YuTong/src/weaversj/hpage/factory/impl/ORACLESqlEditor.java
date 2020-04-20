package weaversj.hpage.factory.impl;

import weaversj.hpage.bean.PageInfo;
import weaversj.hpage.factory.AbstractSqlEditor;

public class ORACLESqlEditor extends AbstractSqlEditor {
	@Override
	public String createTable() {
		// TODO Auto-generated method stub
		return "CREATE TABLE history_table_view(sqltext varchar2(4000), pointid varchar2(1024), type varchar2(100))";
	}
	@Override
	public String countSql(String sql) {
		// TODO Auto-generated method stub
		return sql;
	}
	@Override
	public String addPagination(String sql, PageInfo pageInfo) {
		// TODO Auto-generated method stub
		return sql;
	}

	@Override
	public String ifTable(String table) {
		// TODO Auto-generated method stub
		return "select * from user_tables where table_name ='"+table.toUpperCase()+"'";
	}

	@Override
	public String insertTable(String sql, String pointid, String type) {
		// TODO Auto-generated method stub
		return "insert into history_table_view(sqltext,pointid,type) values('"+sql+ "','"+ pointid +"','"+ type +"')";
	}

	@Override
	public String selectTableList(int top) {
		// TODO Auto-generated method stub
		return "select sqltext,pointid,type from history_table_view  where  rownum <= "+top+" order by id desc";
	}


}
