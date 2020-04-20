package weaversj;

import java.util.List;
import java.util.Map;

import weaver.workflow.webservices.WorkflowBaseInfo;
import weaver.workflow.webservices.WorkflowDetailTableInfo;
import weaver.workflow.webservices.WorkflowMainTableInfo;
import weaver.workflow.webservices.WorkflowRequestInfo;
import weaver.workflow.webservices.WorkflowRequestTableField;
import weaver.workflow.webservices.WorkflowRequestTableRecord;
import weaver.workflow.webservices.WorkflowService;
import weaver.workflow.webservices.WorkflowServiceImpl;
import weaversj.csxutil.log.LogUtil;

/**
 * @Title      : CreateWorkflowUtil.java
 * @Package    : weaversj.util   
 * @version    : V1.0
 * @auther     : zyz
 * @date       : 2019年12月2日 下午10:52:31 
 * @Description: 创建流程接口复写
 */
public class CreateWorkflowUtil {
	public final String requestid;					//流程请求id
	public final String message;					//流程请求id
	public final boolean flag;						//是否成功

	//private static final LogUtil log = LogUtil.getLogger(CreateWorkflowUtil.class.getName());

	//内部工厂类
	public static class Builder {
		private final WorkflowService service;							//创建流程接口服务
		private final WorkflowRequestInfo workflowRequestInfo;			//流程请求信息
		private final WorkflowMainTableInfo workflowMainTableInfo;		//主表信息存储
		private final WorkflowBaseInfo workflowBaseInfo;				//流程基本信息
		private final String workflowid;								//工作流程id
		private final String requestName; 								//请求标题
		private WorkflowRequestTableField[] workflowTableField;			//创建表字段
		private WorkflowRequestTableRecord[] workflowRequestTableRecord;//主字段只有一行数据 明细表多行
		private WorkflowDetailTableInfo[] workflowDetailTableInfo;		//明细表信息存储
		private String creater = "1"; 									//创建者
		private String level = "0";										//紧急程度
		private String requestid = "";									//流程请求id
		private String message = "";									//信息
		private boolean flag = false;									//标识是否成功

		//构造方法
		public Builder(String workflowid,String requestName,Map<String,Object> mainMapData){
			service = new WorkflowServiceImpl();
			workflowBaseInfo = new WorkflowBaseInfo();
			workflowRequestInfo = new WorkflowRequestInfo();
			workflowMainTableInfo = new WorkflowMainTableInfo();
			this.workflowid = workflowid;
			this.requestName=requestName;
			//log.error("--------1");
			setMainTableData(mainMapData);//插入主表数据
			//log.error("--------end---1");
		}
		
		/**
		 * 主表数据
		 * @param mainList
		 * @return
		 */
		private void setMainTableData(Map<String,Object> mainMapData){
			//log.error("--------2mainMapData:" +mainMapData);
			int mainTableLength = mainMapData.size();
			if(mainTableLength==0 || mainMapData.isEmpty()){
				return;
			}
			int i = 0;
			workflowTableField = new WorkflowRequestTableField[mainTableLength]; 		// 创建字段信息
			for(String key:mainMapData.keySet()){										//keySet获取map集合key的集合  然后在遍历key即可
				workflowTableField[i] = new WorkflowRequestTableField();	// 将主表数据封装流程数组
				workflowTableField[i].setFieldName(key);					// 设置创建流程的 字段名
				workflowTableField[i].setFieldValue(mainMapData.get(key).toString());// 字段值
				workflowTableField[i].setView(true);						// 字段是否可见
				workflowTableField[i].setEdit(true);						// 字段是否可编辑
				i++;
			}
			
			workflowRequestTableRecord = new WorkflowRequestTableRecord[1];					//主表只有一行
			workflowRequestTableRecord[0] = new WorkflowRequestTableRecord();				//创建行
			workflowRequestTableRecord[0].setWorkflowRequestTableFields(workflowTableField);//将字段信息加入行数据
			workflowMainTableInfo.setRequestRecords(workflowRequestTableRecord);			//行数据加入到主表信息
			workflowRequestInfo.setWorkflowMainTableInfo(workflowMainTableInfo);			//流程请求信息加入 主表数据
			//log.error("--------2----end");
		}
		/**
		 * 明细表数据
		 * @param mainList
		 * @return
		 */
		public Builder setDetailTableData(List<List<Map<String,Object>>> DetailList){
			int detailTableLength = DetailList.size();
			if(detailTableLength == 0 || DetailList.isEmpty()){
				return this;
			}

			workflowDetailTableInfo = new WorkflowDetailTableInfo[detailTableLength];		//明细表信息存储
			
			for(int i=0;i<detailTableLength;i++){//表循环
				int rowLength = DetailList.get(i).size();
				List<Map<String,Object>> rowList = DetailList.get(i);
				if(rowLength == 0 || rowList.isEmpty()){
					break;
				}

				workflowRequestTableRecord = new WorkflowRequestTableRecord[rowLength];	//数据 行数，假设添加2行明细数据
				for(int k = 0;k<rowLength;k++){
					int fileLength = rowList.get(k).size();
					Map<String,Object> mapField = rowList.get(k);
					if(fileLength == 0 || mapField.isEmpty()){
						break;
					}
					workflowTableField = new WorkflowRequestTableField[fileLength]; //每行3个字段
					int j = 0;
					for(String key:mapField.keySet()){								//keySet获取map集合key的集合  然后在遍历key即可
						workflowTableField[j] = new WorkflowRequestTableField();	// 将主表数据封装流程数组
						workflowTableField[j].setFieldName(key);					// 设置创建流程的 字段名
						workflowTableField[j].setFieldValue(mapField.get(key).toString());// 字段值
						workflowTableField[j].setView(true);						// 字段是否可见
						workflowTableField[j].setEdit(true);						// 字段是否可编辑
						j++;
					}
					workflowRequestTableRecord[k] = new WorkflowRequestTableRecord();
					workflowRequestTableRecord[k].setWorkflowRequestTableFields(workflowTableField);
				}
				
				workflowDetailTableInfo[i] = new WorkflowDetailTableInfo();
				workflowDetailTableInfo[i].setWorkflowRequestTableRecords(workflowRequestTableRecord);	//加入明细表1的数据
			}

			workflowRequestInfo.setWorkflowDetailTableInfos(workflowDetailTableInfo);				//流程请求信息加入 明细表数据

			return this;
		}
		
		
		/**
		 * 创建人id
		 * @param createid
		 * @return
		 */
		public Builder setCreater(String creater){
			this.creater=creater;
			return this;
		}
		
		/**
		 * 低版本不支持
		 * 是否提交下一节点
		 * @param createid 0 不需要 1 需要
		 * @return
		 */
/*		public Builder setIsSubmitNext(int isSubmit){
			log.error("----isSubmit----3begin:"+isSubmit);
			workflowRequestInfo.setIsnextflow(isSubmit+"");
			log.error("----isSubmit----3end:"+isSubmit);
			return this;
		}*/

		/**
		 * 紧急程度
		 * @param level
		 * @return
		 */
		
		public Builder setRequestLevel(String level){
			this.level=level;
			return this;
		}
		/**
		 * 构建器
		 * @return
		 */
		public CreateWorkflowUtil build() throws Exception{
			//log.error("------4build");
			workflowBaseInfo.setWorkflowId(workflowid);										//流程基础信息加入流程id
			workflowRequestInfo.setCreatorId(creater);										//流程请求信息加入创建人id
			workflowRequestInfo.setRequestLevel(level);										//流程请求信息 加入紧急程度 0 正常，1重要，2紧急
			workflowRequestInfo.setRequestName(requestName);								//流程请求信息加入 流程标题
			workflowRequestInfo.setWorkflowBaseInfo(workflowBaseInfo);						//流程请求信息加入流程基本信息
			//log.error("CreateWorkflowUtil--workflowBaseInfo---------:"+ workflowRequestInfo +"--creater:"+Integer.parseInt(creater));
			this.requestid = service.doCreateWorkflowRequest(workflowRequestInfo, Integer.parseInt(creater));//获取requestid
			getMessage(Integer.parseInt(this.requestid));
			//log.error("CreateWorkflowUtil--requestid---------:"+this.requestid);
			//log.error("------4build--end-");
			return new CreateWorkflowUtil(this);
		}
		/**
		 * 流程是否创建成功
		 * @param requestid
		 */
		private void getMessage(int requestid){
			switch (requestid) {
			case 0:
				this.message = "流程创建失败";
				break;
			case -1:
				this.message = "创建流程失败";
				break;
			case -2:
				this.message = "用户没有流程创建权限";
				break;
			case -3:
				this.message = "创建流程基本信息失败";
				break;
			case -4:
				this.message = "保存表单主表信息失败";
				break;
			case -5:
				this.message = "更新紧急程度失败";
				break;
			case -6:
				this.message = "流程操作者失败";
				break;
			case -7:
				this.message = "流转至下一节点失败";
				break;
			case -8:
				this.message = "节点附加操作失败";
				break;
			default:
				if(requestid>0){
					this.flag = true;
					this.message = "流程创建成功";
				}else{
					this.message = "流程创建失败";
				}
				break;
			}
		}
	}
	/**
	 * 构造函数
	 * @param builder
	 */
	
	private CreateWorkflowUtil(Builder builder){
		requestid =	builder.requestid;
		message =	builder.message;
		flag =	builder.flag;

	}

}
