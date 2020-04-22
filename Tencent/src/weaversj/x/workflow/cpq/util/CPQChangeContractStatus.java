package weaversj.x.workflow.cpq.util;


import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import weaversj.csxutil.log.LogUtil;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

/**
* @author 陈少鑫
* @description  bcp更新中台合同状态接口的二次封装
* @date 11:28 2020/4/17
* @modified 11:28 2020/4/17
*/
public class CPQChangeContractStatus {
    final static String PATH = "/ltc/contract/status";
    private final static LogUtil log = LogUtil.getLogger(CPQChangeContractStatus.class.getName());
    public static Map<String, Object> doPost(String domain, Map<String,String> params, Map<String,String> headers) {
        BufferedReader in = null;
        try {
            // 定义HttpClient
            CloseableHttpClient httpClient = HttpClients.createDefault();
            // 实例化HTTP方法
            HttpPost request = new HttpPost();
            request.setURI(new URI(domain+PATH));

            //设置参数
            if (null != params){
                List<NameValuePair> nvps = new ArrayList<NameValuePair>();
                for (Iterator iter = params.keySet().iterator(); iter.hasNext(); ) {
                    String name = (String) iter.next();
                    String value = String.valueOf(params.get(name));
                    nvps.add(new BasicNameValuePair(name, value));

                    // System.out.println(name +"-"+value);
                }
                request.setEntity(new UrlEncodedFormEntity(nvps, "utf-8"));//HTTP.UTF_8过时
            }

            //设置请求头
            setHeaders(headers, request);

            HttpResponse response = httpClient.execute(request);
            return getRS(response);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    public static Map<String, Object> doPost(String domain , String json, Map<String,String> headers) {
        log.info("----domain："+ domain + "<br/>----json:"+json+"<br/>----headers"+headers);
        BufferedReader in = null;
        try {
            // 定义HttpClient
            CloseableHttpClient httpClient = HttpClients.createDefault();
            // 实例化HTTP方法
            HttpPost request = new HttpPost();
            request.setURI(new URI(domain+PATH));
            //设置参数
            if (null != json){
                StringEntity s = new StringEntity(json);
                s.setContentEncoding("UTF-8");
                s.setContentType("application/json");//发送json数据需要设置contentType
                request.setEntity(s);//HTTP.UTF_8过时
            }

            //设置请求头
            setHeaders(headers, request);

            HttpResponse response = httpClient.execute(request);
            Map<String,Object> rs = getRS(response);
            log.info("result=====:"+rs);
            return rs;
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e);
            return null;
        }
    }

    private static Map<String, Object> getRS(HttpResponse response) throws IOException {
        BufferedReader in;
        int code = response.getStatusLine().getStatusCode();

        Map<String, Object> r = new HashMap<>();
        r.put("code",code);
        in = new BufferedReader(new InputStreamReader(response.getEntity()
                .getContent(), "utf-8"));
        StringBuilder sb = new StringBuilder();
        String line;
        String NL = System.getProperty("line.separator"); //换行符，屏蔽了windows与linux的差异
        while ((line = in.readLine()) != null) {
            sb.append(line).append(NL);
        }
        in.close();
        boolean isJson = true;
        if (code == HttpStatus.SC_OK && isJson)
            r.put("content",json2Map(sb.toString()));
        else r.put("concent", sb.toString());
        return r;
    }

    private static void setHeaders(Map<String, String> headers, HttpPost request) {
        if (null != headers) {
            for (Iterator iterator = headers.keySet().iterator(); iterator.hasNext(); ) {
                String name = (String) iterator.next();
                String value = String.valueOf(headers.get(name));
                request.setHeader(name, value);
            }
        }
    }

    /**
     * 将json字符串转为Map结构
     * 如果json复杂，结果可能是map嵌套map
     * @param jsonStr 入参，json格式字符串
     * @return 返回一个map
     */
    public static Map<String, Object> json2Map(String jsonStr) {
        Map<String, Object> map = new HashMap<>();
        if(jsonStr != null && !"".equals(jsonStr)){
            //最外层解析
            JSONObject json = JSONObject.fromObject(jsonStr);
            for (Object k : json.keySet()) {
                Object v = json.get(k);
                //如果内层还是数组的话，继续解析
                if (v instanceof JSONArray) {
                    List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
                    Iterator it = ((JSONArray) v).iterator();
                    while (it.hasNext()) {
                        JSONObject json2 = (JSONObject) it.next();
                        list.add(json2Map(json2.toString()));
                    }
                    map.put(k.toString(), list);
                } else {
                    map.put(k.toString(), v);
                }
            }
            return map;
        }else{
            return null;
        }
    }

    private Map<String, String> h() {
        Map<String, String> h = new HashMap();
        String servername = "_contract_";
        h.put("SERVERNAME", servername);
        String t = "" + System.currentTimeMillis() / 1000L;
        h.put("TIMESTAMP", t);
        String key = "_contract_!@#";
        h.put("SIGNATURE", this.getMD5Str(servername + key + t));
        return h;
    }

    private String getMD5Str(String str) {
        String src = str;
        StringBuffer sb = new StringBuffer();

        try {
            MessageDigest md5 = MessageDigest.getInstance("md5");
            byte[] b = src.getBytes();
            byte[] digest = md5.digest(b);
            char[] chars = new char[]{'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};
            byte[] var11 = digest;
            int var10 = digest.length;

            for(int var9 = 0; var9 < var10; ++var9) {
                byte bb = var11[var9];
                sb.append(chars[bb >> 4 & 15]);
                sb.append(chars[bb & 15]);
            }
        } catch (NoSuchAlgorithmException var12) {
            var12.printStackTrace();
        }

        return sb.toString();
    }

    public String doTest(){
        Map<String, String> h = this.h();
        JSONObject jo1 = new JSONObject();
        JSONObject jo2 = new JSONObject();
        jo1.put("caller", "BCP");
        jo1.put("seqId", h.get("SIGNATURE"));
        jo2.put("quotation_code", "Q20190530000O0");
        jo2.put("contract_code", "contracttest");
        jo2.put("contract_status", "10");
        jo2.put("remark", "");
        jo2.put("contract_start_time", "2019/5/29");
        jo2.put("contract_end_time", "2019/10/29");
        /*if ("1".equals(tt)) {
            jo2.put("project_code", AM2.v(this, (DataSet)null, com.westvalley.tc.workflow.action.eca.CPQContractStatusClocker.Keys.itemnumber));
        }*/

        jo1.put("param", jo2);
        Map<String,Object> dd = CPQChangeContractStatus.doPost("http://dev3.quotation.billing.tencentyun.com",jo1.toString(),h);
        String ss = dd==null?"" :dd.toString();
        return ss;
    }
}
