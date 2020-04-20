package weaversj.hpage.service.impl;

import weaver.conn.RecordSet;
import weaversj.csxutil.log.LogUtil;
import weaversj.hpage.bean.PageInfo;
import weaversj.hpage.bean.RetrunMessBean;
import weaversj.hpage.dbenum.DBTypeEnum;
import weaversj.hpage.dbenum.SqlTypeEnum;
import weaversj.hpage.factory.AbstractSqlEditor;
import weaversj.hpage.factory.SQLEditorFactory;
import weaversj.hpage.service.ISqlRunService;
import weaversj.hpage.util.Base64Util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 这个实现只适用于裕同
 */
public class SqlRunServiceImpl implements ISqlRunService {
	private static final LogUtil log = LogUtil.getLogger(SqlRunServiceImpl.class.getName());
	static {
		/**
		 * 在数据源为oracle下执行语句失败
		RecordSet_zyz rs = new RecordSet_zyz();*/

		RecordSet rs = new RecordSet();
		AbstractSqlEditor editor = SQLEditorFactory.getSqlEditor(getDBType(rs.getDBType().toUpperCase()));

		log.info("数据源："+rs.getDBType());
		boolean flag = false;
		//获取本地化查询表是否存在语句
		String ifTableSql = editor.ifTable("history_table_view");
		log.info("本地化查询表是否存在语句："+ifTableSql);
		log.info("执行是否成功："+rs.execute(ifTableSql));
		log.info("是否存在表history_table_view："+flag);
		if(rs.next()){
			flag = true;
		}
		log.info("是否存在表history_table_view："+flag);
		if(!flag) {
			//获取本地化生成表语句
			String createTableSql = editor.createTable();
			log.info("本地化生成表语句："+createTableSql);
			rs.execute(createTableSql);
		}
	}
	
	@Override
	public RetrunMessBean getDataSourceInfo() {
		// TODO Auto-generated method stub
		
		RecordSet rs = new RecordSet();
		
		String sql = "select pointid, type from datasourcesetting";
			
		boolean flag = rs.execute(sql);

		RetrunMessBean messBean = RecordSet2ReturnMessBean(rs, flag, SqlTypeEnum.SELECT);
		return messBean;
	}

	@Override
	public RetrunMessBean getHistorySql(int top) {
		// TODO Auto-generated method stub
		RecordSet rs = new RecordSet();
		AbstractSqlEditor editor = SQLEditorFactory.getSqlEditor(getDBType(rs.getDBType().toUpperCase()));

		String historySql = editor.selectTableList(top);
		boolean flag = rs.execute(historySql);
		RetrunMessBean messBean = RecordSet2ReturnMessBean(rs, flag, SqlTypeEnum.SELECT);
		for(Map<String,Object> map : messBean.getData()) {
			for(Map.Entry<String, Object> entry : map.entrySet()) {
				map.put(entry.getKey(), Base64Util.decode((String)entry.getValue()));
			}
		}
		return messBean;
	}
	

	@Override
	public RetrunMessBean executeSqlAndReturnResult(String sql, PageInfo pageInfo, String pointId, SqlTypeEnum sqlTypeEnum, DBTypeEnum dbType, Boolean isCols ) {
		// TODO Auto-generated method stub
		AbstractSqlEditor editor;
		RetrunMessBean messBean;
		RecordSet rs = new RecordSet();
		if (dbType == DBTypeEnum.LOCAL) {   //如果是本地数据源
			editor = SQLEditorFactory.getSqlEditor(getDBType(rs.getDBType().toUpperCase()));


			if(sqlTypeEnum == SqlTypeEnum.SELECT) {  
				
				String lsql = editor.addPagination(sql, pageInfo); //这句话其实没有用处，以后再补充完整，在数据库分页，而不是在代码层面分页
				//new BaseBean().writeLog(lsql);
				boolean flag = rs.execute(lsql);
				messBean = RecordSet2ReturnMessBean(rs, flag, sqlTypeEnum);
				
				//在代码层面分页
				messBean.setData(pagination(pageInfo, messBean));

				if(!isCols && pageInfo.getPageNum() == 1)  //如果不是查询表头且查询第一页，则插入历史sql语句表里
					insertIntoHistory(sql, pointId, dbType.toString());
			} else {
				boolean flag = rs.execute(sql);
				messBean = RecordSet2ReturnMessBean(rs, flag, sqlTypeEnum);
				insertIntoHistory(sql, pointId, dbType.toString());
			}
			
			return messBean;
		}
		//System.out.println(pointId);
		//非本地数据源
		editor = SQLEditorFactory.getSqlEditor(dbType);
		
		if(sqlTypeEnum == SqlTypeEnum.SELECT) {  
			
			String lsql = editor.addPagination(sql, pageInfo); //这句话其实没有用处，以后再补充完整，在数据库分页，而不是在代码层面分页
			//new BaseBean().writeLog(lsql);
			boolean flag = rs.executeSqlWithDataSource(lsql, pointId);
			messBean = RecordSet2ReturnMessBean(rs, flag, sqlTypeEnum);
			
			//在代码层面分页，若使用代码层面分页，可以添加cache来优化查询
			messBean.setData(pagination(pageInfo, messBean));

			if(!isCols && pageInfo.getPageNum() == 1)  //如果不是查询表头且查询第一页，则插入历史sql语句表里
				insertIntoHistory(sql, pointId, dbType.toString());
		} else {
			boolean flag = rs.executeSqlWithDataSource(sql, pointId);
			messBean = RecordSet2ReturnMessBean(rs, flag, sqlTypeEnum);
			insertIntoHistory(sql, pointId, dbType.toString());
		}
		
		return messBean;
	}

	//在代码层面分页
	private List<Map<String, Object>> pagination(PageInfo pageInfo, RetrunMessBean messBean) {
		int fromIndex,toIndex;
		fromIndex = (pageInfo.getPageNum()-1)*pageInfo.getPageSize();
		toIndex = pageInfo.getPageNum()*pageInfo.getPageSize();
		toIndex = toIndex > messBean.getCount()?messBean.getCount():toIndex;
		return messBean.getData().subList(fromIndex, toIndex);
	}
	
	//使用本地的数据源
	private void insertIntoHistory(String sql, String pointId,String dbType) {

		AbstractSqlEditor editor;
		RecordSet rs = new RecordSet();
		editor = SQLEditorFactory.getSqlEditor(getDBType(rs.getDBType().toUpperCase()));


		//获取本地化插入表语句
		String insertTableSql = editor.insertTable(Base64Util.encode(sql), Base64Util.encode(pointId), Base64Util.encode(dbType));
		rs.execute(insertTableSql);
	}
	
	/*
	 * //这两个可以重构为类
	 * 
	 * 
	 * private RetrunMessBean RecordSet2ReturnMessBean(RecordSetDataSource rsds,
	 * boolean flag, SqlTypeEnum sqlTypeEnum) { RetrunMessBean messBean = new
	 * RetrunMessBean(); List<Map<String,Object>> datasources = new
	 * ArrayList<Map<String,Object>>();
	 * 
	 * if(!flag) { messBean.setMsg(rsds.getExceptionMessage()); messBean.setCode(1);
	 * } else { if (sqlTypeEnum == SqlTypeEnum.SELECT) { String[] fieldName =
	 * rsds.getColumnName(); while(rsds.next()) { Map<String, Object> datasource =
	 * new HashMap<String,Object>(); for(int i = 0; i < fieldName.length; i++)
	 * datasource.put(fieldName[i], rsds.getString(fieldName[i]));
	 * datasources.add(datasource); } messBean.setCode(0);
	 * messBean.setData(datasources); // messBean.setPageInfo(new PageInfo(0,
	 * rsds.getCounts())); messBean.setCount(rsds.getCounts()); } else {
	 * messBean.setMsg(rsds.getMsg()); messBean.setCode(0); } } return messBean; }
	 */
	
	private RetrunMessBean RecordSet2ReturnMessBean(RecordSet rs, boolean flag,SqlTypeEnum sqlTypeEnum) {
		RetrunMessBean messBean = new RetrunMessBean();
		List<Map<String,Object>> data = new ArrayList<Map<String,Object>>();
		if(!flag) {
			messBean.setMsg(rs.getMsg());
			messBean.setCode(1);
		} else {
			if (sqlTypeEnum == SqlTypeEnum.SELECT) {
				String[] fieldName = rs.getColumnName();

				while(rs.next()) {
					Map<String, Object> datasource = new HashMap<String,Object>(); 
					for(int i = 0; i < fieldName.length; i++) 
						datasource.put(fieldName[i], rs.getString(fieldName[i]));
					data.add(datasource);
				}
				messBean.setCode(0);
				messBean.setData(data);
			//	messBean.setPageInfo(new PageInfo(0, rs.getCounts()));
				messBean.setCount(rs.getCounts());
			} else {
				messBean.setMsg("success");
				messBean.setCode(0);
			}
		}
		return messBean;
	}
	private static DBTypeEnum getDBType(String dbs) {
		dbs = dbs.toUpperCase();
		DBTypeEnum dbType;
		if (dbs.matches("^SQLSERVER[\\s\\S]*")) {
			dbType = DBTypeEnum.SQLSERVER;
		} else if (dbs.matches("^ORACLE[\\s\\S]*")) {
			dbType = DBTypeEnum.ORACLE;
		} else if (dbs.matches("^MYSQL[\\s\\S]*")) {
			dbType = DBTypeEnum.MYSQL;
		} else if (dbs.matches("^DB2[\\s\\S]*")) {
			dbType = DBTypeEnum.DB2;
		} else if (dbs.matches("^SYBASE[\\s\\S]*")) {
			dbType = DBTypeEnum.SYBASE;
		} else if (dbs.matches("^INFORMIX[\\s\\S]*")) {
			dbType = DBTypeEnum.INFORMIX;
		} else if (dbs.matches("^HANA[\\s\\S]*")) {
			dbType = DBTypeEnum.HANA;
		} else {
			dbType = DBTypeEnum.LOCAL;
		}

		return dbType;
	}

}
