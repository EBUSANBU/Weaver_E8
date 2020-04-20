package weaversj.hpage.dbenum;

public enum DBTypeEnum {
	SQLSERVER,
	ORACLE,
	MYSQL,
	DB2,
	SYBASE,
	INFORMIX,
	HANA,
	LOCAL;
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
