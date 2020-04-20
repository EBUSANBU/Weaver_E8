package weaversj.hpage.service;

import weaversj.hpage.bean.PageInfo;
import weaversj.hpage.bean.RetrunMessBean;
import weaversj.hpage.dbenum.DBTypeEnum;
import weaversj.hpage.dbenum.SqlTypeEnum;

public interface ISqlRunService {
	/**
	 * 获取数据源信息
	 * @return
	 */
	RetrunMessBean getDataSourceInfo();
	

	/**
	 * 获取历史sql语句 ,只支持获取前top条，不支持分页
	 * @param top  条数
	 * @return
	 */
	RetrunMessBean getHistorySql(int top);
	

	/**
	 * 执行sql并返回信息
	 * @param sql  传入的sql语句
	 * @param pageInfo  分页信息
	 * @param pointId   数据源标识
	 * @param sqlTypeEnum  语句执行类型
	 * @param dbType   数据源类型
	 * @param isCols 是否查询表头
	 * @return
	 */
	RetrunMessBean executeSqlAndReturnResult(String sql, PageInfo pageInfo, String pointId, SqlTypeEnum sqlTypeEnum, DBTypeEnum dbType, Boolean isCols);
	
}
