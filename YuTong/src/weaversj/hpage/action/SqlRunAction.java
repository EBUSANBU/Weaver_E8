package weaversj.hpage.action;

import com.alibaba.fastjson.JSON;
import weaver.general.BaseBean;
import weaversj.hpage.bean.PageInfo;
import weaversj.hpage.dbenum.DBTypeEnum;
import weaversj.hpage.dbenum.SqlTypeEnum;
import weaversj.hpage.service.ISqlRunService;
import weaversj.hpage.service.impl.SqlRunServiceImpl;

public class SqlRunAction {
	private ISqlRunService service = new SqlRunServiceImpl();
	
	public String getHistorySql(int top) {
		return JSON.toJSONString(service.getHistorySql(top));
	}
	
	public String getDataSourceInfo() {
		return JSON.toJSONString(service.getDataSourceInfo());
	}
	
	public String executeSql(String sql, int pageNum, int pageSize, String pointId, String dbs, Boolean isCols) {
		
		PageInfo pageInfo = new PageInfo(pageNum, pageSize);
		SqlTypeEnum sqlTypeEnum = getSqlType(sql.trim().substring(0,6));
		
		DBTypeEnum dbType = getDBType(dbs);

		return JSON.toJSONString(service.executeSqlAndReturnResult(sql, pageInfo, pointId, sqlTypeEnum, dbType, isCols));
	}
	
	private DBTypeEnum getDBType(String dbs) {
		dbs = dbs.toUpperCase();
		DBTypeEnum dbType;
		if (dbs.matches("^SQLSERVER[\\s\\S]*")) {
			dbType = DBTypeEnum.SQLSERVER;
		} else if(dbs.matches("^ORACLE[\\s\\S]*")) {
			dbType = DBTypeEnum.ORACLE;
		} else if(dbs.matches("^MYSQL[\\s\\S]*")) {
			dbType = DBTypeEnum.MYSQL;
		} else if(dbs.matches("^DB2[\\s\\S]*")) {
			dbType = DBTypeEnum.DB2;
		} else if(dbs.matches("^SYBASE[\\s\\S]*")) {
			dbType = DBTypeEnum.SYBASE;
		} else if(dbs.matches("^INFORMIX[\\s\\S]*")) {
			dbType = DBTypeEnum.INFORMIX;
		} else if(dbs.matches("^HANA[\\s\\S]*")) {
			dbType = DBTypeEnum.HANA;
		} else {
			dbType = DBTypeEnum.LOCAL;
		}
		return dbType;
	}
	
	private SqlTypeEnum getSqlType(String sql) {
		SqlTypeEnum sqlTypeEnum;
		if ("select".equalsIgnoreCase(sql)) {
			sqlTypeEnum = SqlTypeEnum.SELECT;
		} else if("delete".equalsIgnoreCase(sql)) {
			sqlTypeEnum = SqlTypeEnum.DELETE;
		} else if("insert".equalsIgnoreCase(sql)) {
			sqlTypeEnum = SqlTypeEnum.INSERT;
		} else if("update".equalsIgnoreCase(sql)) {
			sqlTypeEnum = SqlTypeEnum.UPDATE;
		} else 
			sqlTypeEnum = SqlTypeEnum.CREATE;
		new BaseBean().writeLog(sqlTypeEnum);
		return sqlTypeEnum;
	}
}
