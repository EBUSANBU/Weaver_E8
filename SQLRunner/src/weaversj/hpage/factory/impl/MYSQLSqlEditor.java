package weaversj.hpage.factory.impl;

import weaversj.hpage.bean.PageInfo;
import weaversj.hpage.factory.AbstractSqlEditor;

public class MYSQLSqlEditor extends AbstractSqlEditor {
	@Override
	public String createTable() {
		// TODO Auto-generated method stub
		return "CREATE TABLE `history_table_view`  (" +
				"  `sqltext` text NOT NULL," +
				"  `pointid` varchar(1024) NOT NULL," +
				"  `type` varchar(255) NOT NULL)";
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
		return "SELECT table_name  FROM information_schema.`TABLES` WHERE table_name = '"+table+"'";
	}

	@Override
	public String insertTable(String sql, String pointid, String type) {
		return "insert into history_table_view(sqltext,pointid,type) values('"+sql+ "','"+ pointid +"','"+ type +"')";
	}

	@Override
	public String selectTableList(int top) {
		// TODO Auto-generated method stub
		return "select sqltext,pointid,type from history_table_view limit 0,"+top;

	}


}
