package weaversj.x.tencent.bcp.util;


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

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.*;

/**
* @author 陈少鑫
* @description  bcp更新中台合同状态接口的二次封装
* @date 11:28 2020/4/17
* @modified 11:28 2020/4/17
*/
public class BCPChangeContractStatus {
    final static String PATH = "/ltc/contract/status";

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
            return getMap(response);

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    public static Map<String, Object> doPost(String domain , String json, Map<String,String> headers) {

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
            return getMap(response);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private static Map<String, Object> getMap(HttpResponse response) throws IOException {
        BufferedReader in;
        int code = response.getStatusLine().getStatusCode();
        if (code == HttpStatus.SC_OK) {    //请求成功
            in = new BufferedReader(new InputStreamReader(response.getEntity()
                    .getContent(), "utf-8"));
            StringBuilder sb = new StringBuilder();
            String line;
            String NL = System.getProperty("line.separator"); //换行符，屏蔽了windows与linux的差异
            while ((line = in.readLine()) != null) {
                sb.append(line).append(NL);
            }
            in.close();
            return json2Map(sb.toString());
        } else {
            System.out.println("状态码：" + code);
            return null;
        }
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

    public static void main(String[] args) {
        // TODO Auto-generated method stub
        JSONObject prame = new JSONObject();
        prame.put("ReqestId","test");
        prame.put("Action","Action");
        prame.put("ClientIP","127.0.0.1");
        prame.put("quotation_code","Q20190529000NJ");
        prame.put("AccessToken","");
        prame.put("contract_code","testtesttest");
        prame.put("contract_status","10");
        prame.put("remark","test");
        prame.put("contract_start_time","2019/5/29");
        prame.put("contract_end_time","2019/10/29");
        HashMap<String,String> headers = new HashMap<>();
        headers.put("STAFFNAME","v_tzixtang");
        System.out.println(BCPChangeContractStatus.doPost("http://dev3.quotation.billing.tencentyun.com:50501",prame.toString(),headers));

    }

}
