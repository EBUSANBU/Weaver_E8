package weaversj.filter;

import org.apache.commons.lang.StringUtils;
import weaver.conn.RecordSet;
import weaver.formmode.setup.ModeRightInfo;
import weaver.general.BaseBean;
import weaver.general.Util;
import weaver.hrm.HrmUserVarify;
import weaver.hrm.User;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.ResourceBundle;
//如果重定向过多，可能是urlRegex少了url
//如果字段显示名乱码，则可能此过滤器在web.xml注册时没有放在字符处理过滤器后边。
public class ClickCountFilter implements Filter {

    private static final List<String> urlRegex = new ArrayList<>();

    private static  String dbTable;
    private static  String dbTableIgnore;

    private static  String fieldPath;
    private static  String fieldWFPath;
    private static  String fieldUid;
    private static  String fieldIP;
    private static  String fieldTime;
    private static  String path;
    private static String creater;
    private static String modeId;
    private static boolean virtual;

    private static final String SQL_FM = "insert into %s(%s) values %s";

    private static final String STRING_VALUE_FM = "'%s'";

    private static final String REGEX = "^%s.*";

    private static final SimpleDateFormat SDF =
            new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    private static boolean needFilter;


    static {
        urlRegex.add("^/login/Login.jsp.*");
        urlRegex.add("^/Refresh.jsp.*");
        urlRegex.add("^/login/OALogin.jsp.*");
        urlRegex.add("^/mobile.*");
        urlRegex.add("^/system/LicenseOperation.jsp.*");
        urlRegex.add("^/social/im.*");
        urlRegex.add("^/messager/eim.jsp.*");
        urlRegex.add("^/services.*");
        urlRegex.add("^/login/VerifyRtxLogin.jsp.*");
        urlRegex.add("^/login/VerifyLogin.jsp.*");
        urlRegex.add("^/js/hrm/getdate.jsp.*");
        urlRegex.add("^/join/monitorXOperation.jsp.*");
        urlRegex.add("^/homepage/yzm/login.jsp.*");
        urlRegex.add("^/wui/theme/ecology7/page/login.jsp.*");
        urlRegex.add("^/wui/theme/ecology8/page/login.jsp.*");
        try {
            ResourceBundle bundle = ResourceBundle.getBundle("weaversj.filter.properties.ClickCountFilter");
            fieldPath = bundle.getString("fieldPath");
            fieldIP = bundle.getString("fieldIP");
            fieldTime = bundle.getString("fieldTime");
            fieldUid = bundle.getString("fieldUid");
            fieldWFPath = bundle.getString("fieldWFPath");
            dbTable = bundle.getString("table");
            dbTableIgnore = bundle.getString("pathtable");
            path = bundle.getString("path");
            creater = bundle.getString("creater");
            modeId = bundle.getString("modeId");
            virtual = "true".equals(bundle.getString("virtual"));
            needFilter = "true".equals(bundle.getString("needFilter"));
            if ("".equals(fieldTime)
                    || "".equals(fieldIP)
                    || "".equals(fieldUid)
                    || "".equals(fieldWFPath)
                    || "".equals(fieldPath)
                    || "".equals(path)
                    || "".equals(dbTableIgnore)
                    || "".equals(dbTable)){
                needFilter = false;
                throw new RuntimeException("[weaversj.filter.properties.ClickCountFilter]下的配置不能有空值，必须全部配置");
            }
        } catch (Exception ex) {
            needFilter = false;
            new BaseBean().writeLog(ex);
        }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws ServletException, IOException {
       // Date date = new Date();
        //String durl = Util.null2String(((HttpServletRequest) servletRequest).getRequestURI());

        try {
            if (needFilter){
                HttpServletRequest request = (HttpServletRequest) servletRequest;
                HttpServletResponse response =(HttpServletResponse) servletResponse;
                String url = Util.null2String(request.getRequestURI());
                if (!"".equals(url)){
                    //判读此url是否需记录，true 为需要记录
                    boolean needRecord = false;
                    /*for (String regex : urlRegex) {
                        if (url.matches(regex)) {
                            needRecord = false;
                            //new BaseBean().writeLog(url);
                            //LogUtil.getLogger(ClickCountFilter.class.getName()).info(url);
                        }
                    }*/
                    //判断此url是否是期望记录的url, true 为需要记录
                    if(!needRecord){
                        RecordSet recordSet = new RecordSet();

                        recordSet.execute("select path from "+ dbTableIgnore+" where path ='"+url+"'");
                        if(recordSet.next()){
                            needRecord = true;
                        }
                    }

                    if (needRecord) {
//                        new BaseBean().writeLog("need----------"+url);
                        //  LogUtil.getLogger(ClickCountFilter.class.getName()).info(url);
                        insert2table(response, request, url);
                        //如果不是使用虚拟表单，需要重构
                        if (!virtual)
                            Refactor();
                    }
                }
            }
        } catch (Exception e) {
            new BaseBean().writeLog(e);
        } finally {
            //Date date1 = new Date();

            //LogUtil.getLogger(ClickCountFilter.class.getName()).info(durl+":"+String.valueOf(date1.getTime()-date.getTime()));
            filterChain.doFilter(servletRequest,servletResponse);
        }
    }

    //权限重构
    private void Refactor() {
        ModeRightInfo ModeRightInfo = new ModeRightInfo();
        ModeRightInfo.setNewRight(true);
        RecordSet rs = new RecordSet();
        if ("oracle".equals(rs.getDBType())){
            rs.execute("select id from (select id from "+dbTable+" order by id desc) where rownum=1");
        } else
            rs.execute("select top 1 id from "+ dbTable + " order by id desc");
        while (rs.next()){
            ModeRightInfo.editModeDataShare(Integer.parseInt(creater),Integer.parseInt(modeId),rs.getInt("id"));
        }
    }

    private void insert2table(HttpServletResponse servletResponse, HttpServletRequest request, String url) throws Exception {
        String path = Util.null2String(StringUtils.substringBefore(url,"?"));
        String wfpath = Util.null2String(request.getParameter("workflowid"));
        User localUser = (User)request.getSession(true).getAttribute("weaver_user@bean");
        String ip = getIpAddr(request);
        String time = SDF.format(new Date());
        if (localUser==null)
            throw new Exception("weaversj.filter中的user为空");
        RecordSet rs = new RecordSet();
        String sql;
        if (!"".equals(wfpath)){
            sql = "insert into "+dbTable+"("+fieldPath+","+fieldWFPath+","+fieldUid+","+fieldIP+","+fieldTime
                    +",formmodeid,modedatacreatertype,modedatacreatedate,modedatacreatetime,modedatacreater"+") values " +
                    "('"+path +"',"+ wfpath+ ","+localUser.getUID()+",'"+ip+ "','"+time
                    +"',"+modeId+",'0','"+time.split(" ")[0]+"','"+time.split(" ")[1]+"','"+creater+"')";
            /*sql = String.format(SQL_FM,dbTable,
                    fieldPath+","+fieldWFPath+","+fieldUid+","+fieldIP+","+fieldTime
                    +",formmodeid,modedatacreatertype,modedatacreatedate,modedatacreatetime,modedatacreater"
                    ,"('"+path +"',"+ wfpath+ ","+localUser.getUID()+",'"+ip+ "','"+time
                            +"',"+modeId+",'0','"+time.split(" ")[0]+"','"+time.split(" ")[1]+"','"+creater+"')");*/
        } else {
            sql = "insert into "+dbTable+"("+fieldPath+","+fieldUid+","+fieldIP+","+fieldTime
                    +",formmodeid,modedatacreatertype,modedatacreatedate,modedatacreatetime,modedatacreater"+") values " +
                    "('"+path +"',"+localUser.getUID()+",'"+ip+ "','"+time
                    +"',"+modeId+",'0','"+time.split(" ")[0]+"','"+time.split(" ")[1]+"','"+creater+"')";
            /*sql = String.format(SQL_FM,dbTable,
                    fieldPath+","+fieldUid+","+fieldIP+","+fieldTime
                            +",formmodeid,modedatacreatertype,modedatacreatedate,modedatacreatetime,modedatacreater"
                    ,"('"+path +"',"+localUser.getUID()+",'"+ip+ "','"+time
                            +"',"+modeId+",'0','"+time.split(" ")[0]+"','"+time.split(" ")[1]+"','"+creater+"')");*/
        }
       // new BaseBean().writeLog(sql);
        //LogUtil.getLogger(ClickCountFilter.class.getName()).info(sql);
        rs.execute(sql);
    }

    private String getUserid(HttpServletRequest request, HttpServletResponse response) {

            User user = HrmUserVarify.getUser(request,response);
            if (user == null)
                return "";
            else return String.valueOf(user.getUID());
    }

    @Override
    public void destroy() {

    }

    private String getIpAddr(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

}
