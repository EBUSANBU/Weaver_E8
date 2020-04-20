<!-- westvalley dev start -->
function GlobalReger(f){
	var w = window;
	while (w != top) {
		f(w);
		w = w.parent;
	}
}
/**
Crivia Work Flow Java Script Function Group.
**/
top.CriviaWorkFlowJavaScriptFunctions = 
	undefined!=top.CriviaWorkFlowJavaScriptFunctions
	?top.CriviaWorkFlowJavaScriptFunctions:
//var _C =
{
		ev : '8'
		,UEF : '.c'/*UEF*/
		,ui : {
			_ : 'UserInterface'
			,isPC : function(){return '0' == this._;}
			,isMobile : function(){return '2' == this._;}
		}
		,rsImg : function(){
			return '8' == this.ev
				? '<img src="/images/BacoError_wev8.gif" align="absmiddle">'
				: '<img src="/images/BacoError.gif" align="absmiddle">';
		}
		,_rsSetting : []
/**
{
	Desc : 'Requird Switcher | 必填状态变更'
	,Params : {
		Field ID : String
		,Is Requird : Boolean
	} 
}
 */
		,rs : function (f,isRequird){
			var _c = this;
			if (! f){
				return;
			}
			_c._rsSetting[f] = {r:isRequird};
			var img = _c.rsImg();
			
			var coA = jQuery('input[name="inputcheck"]');
			var coB = jQuery('input[name="needcheck"]');
			if (coA.length&&coB.length){
				var v = _c.v(f);
				var checkerA = coA.val();
				var checkerB = coB.val();
				var oldChange = jQuery('#'+f).attr('onchange');
				if (isRequird) {
					checkerA=checkerA.replace(','+f,'');
					checkerB=checkerB.replace(','+f,'');
					checkerA +=','+f;
					checkerB +=','+f;
					if ('' == v){
						var jf = jQuery('#field_'+f.substring(5)+'span');
						if (jf.length){
							jf.html(img+'(必填)');
							jf.show();
						} else if ('8' == _c.ev
						&& jQuery('#'+f+'spanimg').length){
							_c.t(f+'spanimg',img,true);
						} else {
							_c.t(f,img);
						}
					}
					if ('8' == _c.ev) {
						jQuery('#'+f).attr('viewtype','1');
						if (jQuery('#'+f+'spanimg').length){
							jQuery('#'+f).attr('onchange',oldChange
								+';checkinput2('+'\''+f+'\' , \''+f+'spanimg\' '
								+', this.getAttribute(\'viewtype\'));');
						} else {
							jQuery('#'+f).attr('onchange',oldChange
								+';checkinput2('+'\''+f+'\' , \''+f+'span\' '
								+', this.getAttribute(\'viewtype\'));');
						}
					}
				}else{
					checkerA=checkerA.replace(','+f,'');
					checkerB=checkerB.replace(','+f,'');
					jQuery('#field_'+f.substring(5)+'span').hide();
					if ('8' == _c.ev){
						jQuery('#'+f).attr('viewtype','0');
						if (jQuery('#'+f+'spanimg').length){
							if (_c.t(f+'spanimg',undefined,true).indexOf('src="/images/BacoError_wev8.gif"') > -1){
								_c.t(f+'spanimg','',true);
							}
						} else if (jQuery('#'+f+'span').length) {
							if (_c.t(f).indexOf('src="/images/BacoError_wev8.gif"') > -1){
								_c.t(f,'');
							}
						}
					} else {
						if (_c.t(f).indexOf('src="/images/BacoError.gif"') > -1){
							_c.t(f,'');
						}
					}
				}
				
				coA.val(checkerA);
				coB.val(checkerB);
			}

			var  coC = jQuery('#'+f+'_ismandfield');
			var  coD = jQuery('#'+f+'_d_ismandfield');
			if (coC.length){
				if (isRequird){
					jQuery('#'+f+'_ismandfield').attr('name','mustInput');
					jQuery('#'+f+'_ismandspan').html(img);
					jQuery('#'+f+'_ismandspan').show();
				} else {
					jQuery('#'+f+'_ismandfield').attr('name','notmandfield');
					jQuery('#'+f+'_ismandspan').html('');
				}
			} else if (coD.length) {
				if (isRequird){
					jQuery('#'+f+'_d_ismandfield').attr('name','mustInput');
					jQuery('#'+f+'_d_ismandspan').html(img);
					jQuery('#'+f+'_ismandspan').show();
				} else {
					jQuery('#'+f+'_d_ismandfield').attr('name','notmandfield');
					jQuery('#'+f+'_d_ismandspan').html('');
				}
			}
		}
/**
{
	Desc : 'Sub Table Each | 子表遍历'
	,Params : {
		Each Field ID : String
		,Each Function : Function
	} 
	,Return : {
		Count : Sub Table Size (Int)
		,Sum : Sub Table Data Sum (Double)
		,Values : Sub Table Values Map
		,Concat : Values Concat (Function , Param : Concater Default ',')
	}
}
 */
		,stEach : function (id , f , mobileReadOnly){
			if ('string' != typeof id){
				return;
			}
			var _c = this;
			var count = 0;
			var sum = 0;
			var values = {};
			var each = function(fs){
				var x = false;
				if (!fs.length){
					return x;
				}
				for (var k = 0; k < fs.length; k++){
					var kr = jQuery(fs[k]).attr('id');
					if (false
					|| 'string' != typeof kr
					|| kr.match(/field\d+_?\d?__/)
					|| kr.match(/field\d+_?\d?_d/) 
					|| kr.match(/field\d+_\d+_ismandfield/)
					|| kr.indexOf('_ismandfield')==id.length){
						continue;
					}
					x = true;
					var rn = kr.indexOf('_d')==id.length
						? kr.substring(id.length,kr.length-2)
						: kr.substring(id.length);
					var v = _c.v(id + rn);
					count++;
					sum = sum + _c.n(v, 0);
					values[rn] = v;
					if (! f){
						continue;
					}
					if (mobileReadOnly){
						f(rn);
					} else {
						_c.emst(_c.f2stI(id+rn), rn, function(){
							f(rn);
						});
					}
				}
				return x;
			};
			if(each(jQuery('input[id^="' + id + '"]'))){
			} else if (each(jQuery('select[id^="' + id + '"]'))){
			} else if (each(jQuery('textarea[id^="' + id + '"]'))){
			}
			return {
				count : count
				,sum : sum
				,values : values
				,concat : function(concater){
					if (undefined == concater){
						concater = ',';
					}
					var m = this.values;
					var s = '';
					for (var k in m){
						if ('' != s){
							s = s + concater;
						}
						s = s + m[k];
					}
					return s;
				}
			};
		}
/**
{
	Desc : 'Value Keeper | 值变更储存'
	,Params : {
		Map Key : String
		,New Value : String
		,Map : Java Script Object
	} 
	,Return : {
		Type : Boolean
		,Desc : 'Old Value == New Value ? True : False'
	}
}
 */
		,vK : function (k , v , m){
			if (k in m){
				if (m[k] == v){
					return true;
				}
			}
			m[k] = v;
			return false;
		}
/**
{
	Desc : 'Value | 值操作'
	,Params : {
		Field ID : String
		,Input Value : String (M Get Or Set)
	} 
}
 */
		,_vom : {}
		,v : function(id , v){
			var o;
			if (id in this._vom){
				o = this._vom[id];
			} else {
				o = document.getElementById(id);
				if (! o){
					o = document.getElementById('dis'+id);
					if (! o){
						return;
					}
				}
				if ('string'==typeof o.tagName
				&& 'input'==o.tagName.toLowerCase()){
					this._vom[id] = o;
				}
			}
//			var o = document.getElementById(id);
//			if (! o){
//				o = document.getElementById('dis'+id);
//				if (! o){
//					return;
//				}
//			}
			if (undefined == v){
				return o.value;
			} else {
				o.value = v;
				if ('hidden' == o.getAttribute('type')){
					this.t(id, v);
				}
				jQuery(o).change();
				jQuery(o).blur();
				if ('8' == this.ev
				&& jQuery('#'+id+'spanimg').length){
					this.t(id+'spanimg',(!v?this.rsImg():''),true);
				}
				return o;
			}
		}
/**
{
	Desc : 'Text | 文本操作'
	,Params : {
		Field ID : String
		,Input Text : String (M Get Or Set)
		,Un Complete End : Boolean (M Default : False)
	} 
}
 */
		,t : function(id , t , uce){
			var end = 'span';
			if (uce){
				end = '';
			}
			var o = document.getElementById(id + end);
			if (! o){
				return;
			}
			if (undefined == t){
				return o.innerHTML;
			} else {
				o.innerHTML = t;
			}
		}
/**
{
	Desc : 'Value & Text | 值&文本赋予'
	,Params : {
		Field ID : String
		,Input Value : String
		,Input Text : String (M Default Value)
		,Text ID : String (M Default Field ID)
	} 
}
 */
		,vt : function(f , v , t , s){
			var _c = this;
			if (f == undefined || v == undefined){
				return;
			}
			if (t == undefined){
				t = v;
			}
			if (s == undefined){
				s = f;
			}
			_c.v(f, v);
			_c.t(s, t);
		}
/**
{
	Desc : 'Value & Show | 值&文本赋予'
	,Params : {
		Field ID : String
		,Input Value : String
		,Input Text : String (M Default Value)
	} 
}
 */
		,vs : function(f , v , t){
			var o = document.getElementById(f);
			if (! o){
				return;
			}
			this.v(f , v);
			if (false
			|| o.tagName == 'hidden' 
			|| (true
			&& o.tagName == 'input'
			&& o.getAttribute('type') == 'hidden')){
				if (! t){
					t = v;
				}
				this.t(f , t);
			}
		}
/**
{
	Desc : 'A Label Text | 各种链接中的文本'
	,Params : {
		Field ID : String
	} 
	,Return : Text
}
*/
		,at : function(f , ue){
			if (! f){
				return;
			}
			var e = 'span';
			if (ue){
				e = '';
			}
			return jQuery('#'+f+e).find('a').text();
		}
/**
{
	Desc : 'Add Function | 追加函数'
	,Params : {
		New Function : Function
		,Old Function Var : String (M Default : window.doSubmit)
	} 
}
 */
		,af : function(n , o){
			if (! n){
				return;
			}
			if (! o){
				o = window.doSubmit;
			}
			var f = o;
			o = function(p){
				n(f , p);
			};
		}
/**
{
	Desc : 'To Number | 数字转换'
	,Params : {
		String : String
		,Default Value : Target
		,Is Int : Boolean (M Default : False)
	} 
}
 */
		,n : function(s , dv , isInt){
			if ('number' == typeof s){
				return s;
			} else if ('string' != typeof s) {
				return dv;
			}
			var n;
			if (isInt){
				n = parseInt(s);
			} else {
				n = parseFloat(s.replace(/\,/g,''));
			}
			return isNaN(n) ? dv : n;
		}
/**
{
	Desc : 'Value To Number | 取值数字转换'
	,Params : {
		String : Field ID
		,Default Value : Target
		,Is Int : Boolean (M Default : False)
	} 
}
 */
		,vn : function(id , dv , isInt){
			return this.n(this.v(id), dv, isInt);
		}
/**
{
	Desc : 'Listener Runner | 启动监视器'
	,Params : {
		Option : Object
		,Example : {
			t : 'Time , Number , (M Default : 100)'
			,f : [
				{
					k : 'Example Main Table Field ID , String'
					,f : function(ov , nv){
						alert(
							'Old Value : ' + ov
							+ '\n' + 'New Value : ' + nv
						);
					}
					,f2 : function(nv , ov , k){
						alert(
							'New Value : ' + nv
							+ '\n' + 'Old Value : ' + ov
							+ '\n' + 'Field Key : ' + k
						);
					}
				},{
					k : 'Example Sub Table Field ID , String'
					,d : 'Sub Table Flag , Default : False'
					,f : function(ov , nv , r){
						alert(
							'Old Value : ' + ov
							+ '\n' + 'New Value : ' + nv
							+ '\n' + 'Row Index : ' + r
						);
					}
					,f2 : function(r , nv , ov , k){
						alert(
							'Row Index : ' + r
							+ '\n' + 'New Value : ' + nv
							+ '\n' + 'Old Value : ' + ov
							+ '\n' + 'Field Key : ' + k
						);
					}
					,f3 : function(p){
						alert(
							'Row Index : ' + p.r
							+ '\n' + 'New Value : ' + p.v.n
							+ '\n' + 'Old Value : ' + p.v.o
							+ '\n' + 'Field Key : ' + p.k
						);
					}
				}
			]
		}
	} 
}
 */
		,run : function(o){
			var _c = this;
			//Init Param.
			if (! o){
				o = {};
			}
			//Run Timer When Option Is Undefined.
			if (! _c._listenerOption){
				window.setInterval(
						'CriviaWorkFlowJavaScriptFunctions._cwjsListener()'
						, _c.n(o.t, 100, true));
			}
			//Old Param.
			if (! o.k){
				//Setting Options.
				_c._listenerOption = o;
			} 
			//New Param.
			else {
				//First Setting.
				if (! _c._listenerOption || ! _c._listenerOption.f){
					//Init Param.
					_c._listenerOption = { f : [] };
				}
				//Fields Size.
				var s = _c._listenerOption.f.length;
				//Each Check.
				for (var k = 0; k < s; k++){
					//Temp Field.
					var f = _c._listenerOption.f[k];
					//Repeat Key.
					if (f.k == o.k){
						//Replace Type.
						var t = _c.n(f.t, 0, true);
						//
						switch (t) {
						//Replace.
						case -1:
							f._fs = [o.f];
							f._f2s = [o.f2];
							f._f3s = [o.f3];
							return;
						//Add To Begin.
						case 1:
							f._fs.splice(0,0,o.f);
							f._f2s.splice(0,0,o.f2);
							f._f3s.splice(0,0,o.f3);
							return;
						//Add To End.
						default:
							f._fs[f._fs.length] = o.f;
							f._f2s[f._f2s.length] = o.f2;
							f._f3s[f._f3s.length] = o.f3;
							return;
						}
					}
				}//End Of Each.
				//Init Functions.
				o._fs = [o.f];
				o._f2s = [o.f2];
				o._f3s = [o.f3];
				//Regedit Field.
				_c._listenerOption.f[s] = o;
			}
		}
		,run2 : function(k,f){
			if (!k || !f){
				return;
			}
			var _c = this;
			jQuery(document).ready(function(){
				_c.run({k:k,f3:f});
			});
		}
		,_listenerOption : undefined
		,_cwjsListener : function(){
			var _c = this;
			//Requird Switch Setting.
			for (var rsf in _c._rsSetting){
				var o = _c._rsSetting[rsf];
				var v = _c.v(rsf);
				if (v == o.v) continue;
				o.v = v;
				if (!!o.r&&!v){
					var jf = jQuery('#field_'+rsf.substring(5)+'span');
					if (jf.length){
						jf.html(_c.rsImg()+'(必填)');
						jf.show();
					} else if ('8' == _c.ev
					&& jQuery('#'+rsf+'spanimg').length){
						_c.t(rsf+'spanimg',_c.rsImg(),true);
					} else {
						_c.t(rsf,_c.rsImg());
					}
				} else if (!o.r||!!v) {
					if ('8' == _c.ev){
						if (jQuery('#'+rsf+'spanimg').length){
							if (_c.t(rsf+'spanimg',undefined,true)
									.indexOf('src="/images/BacoError_wev8.gif"')
										> -1){
								_c.t(rsf+'spanimg','',true);
							}
						} else if (jQuery('#'+rsf+'span').length) {
							if (_c.t(rsf)
									.indexOf('src="/images/BacoError_wev8.gif"')
										> -1){
								_c.t(rsf,'');
							}
						}
					} else {
						if (_c.t(f).indexOf('src="/images/BacoError.gif"') > -1){
							_c.t(f,'');
						}
					}
				}
			}
			//Check Option.
			if (! _c._listenerOption){
				return;
			}
			//Fields.
			var fs = _c._listenerOption.f;
			//Fields Check.
			if (! fs){
				return;
			}
			//Check Value And Run Functions.
			for (var n = 0; n < fs.length; n++){
				//Value Map.
				var m = _c._cwjsListenerValueMap;
				//Field Option.
				var f = fs[n];
				//Check Key.
				if (! f.k){
					continue;
				}
				//Function : Check & Run.
				//Param : Temp Field , Field Key , Row Number.
				var cr = function(t , fk , r){
					//Old Value.
					var ov = m[fk];
					//New Value.
					var nv = _c.v(fk);
					//Check & Value Keep.
					if (_c.vK(fk, nv, m)){
						return;
					}
					//Function : Sequnce Runner.
					//Param : Sequnce , Runner , Bak Function.
					var sr = function(s , r , b){
						//Check Runner.
						if (! r){
							return;
						}
						//Check Sequnce.
						if (s){
							//Check Sequnce.
							for (var k = 0; k < s.length; k++){
								//Run.
								r(s[k]);
							}
						} else {
							//Run Bak Function.
							r(b);
						}
					};
					//Run Function Sequece.
					var rfs = function(){
						//F1.
						sr(t._fs, function(f){
							//Check Function.
							if (f){
								//Run.
								f(ov , nv , r);
							}
						}, t.f);
						//F2.
						sr(t._f2s, function(f){
							//Check Function.
							if (f){
								//Run.
								f(r , nv , ov , t.k);
							}
						}, t.f2);
						//F3.
						sr(t._f3s, function(f){
							//Check Function.
							if (! f){
								return;
							}
							//F3 Param.
							var p = {
								//Key.
								k : t.k
								//Detail.
								,d : t.d
								//Values.
								,v : {
									//Old.
									o : ov
									//New.
									,n : nv
								}
								//Row Num.
								,r : r
								//Sub Table Index.
								,stI : _c.f2stI(t.k)
							};
							//Run.
							f(p);
						}, t.f3);
					};
					//Check Row Number.
					if (r){
						//Edit Mobile Sub Table.
						_c.emst(_c.f2stI(t.k), r, rfs);
					} else {
						//Run Main Table.
						rfs();
					}
				};
				//All Each.
				_c.stEach(f.k, function(r){
					//Check & Run.
					cr(f , f.k + r , r);
				} , true);
			}
		}
		,_cwjsListenerValueMap : {}
/**
{
	Desc : 'Sub Table Button | 子表按钮附加'
	,Params : {
		Option : Object
		,Example : {
			stIndex : 'Sub Table Index , Int'
			,text : 'Button Text , String (M Default : 导入)' 
			,key : 'Button Key , String (M Default : T)'
			,name : 'Button Name , String (M Default : autoCreate)' 
			,onclick : 'On Click Act , String'
		}
	} 
}
 */
		,stButton : function(o){
			if (o.stIndex == undefined || ! o.onclick){
				return;
			}
			if ('string'==typeof o.stIndex){
				o.stIndex = this.f2stI(o.stIndex);
				if (o.stIndex < 0){
					return;
				}
			}
			if (! o.text){
				o.text = '导入';
			}
			if (! o.key){
				o.key = 'T';
			}
			if (! o.name){
				o.name = 'autoCreate';
			}
			if (! o.bg || ! o.img){
				o.img = 'copy';
			}
			var bn = o.name + o.stIndex;
			var buttonBox = jQuery('#div' + o.stIndex + 'button');
			var button = '8' == this.ev
			    ? ('<button class="addbtn_p" type="button"'
			    	+ ' style="background: url('+(o.bg ? o.bg
			    		: '/wui/theme/ecology8/jquery/js/button/'+o.img+'_wev8.png')+') no-repeat"'
				    + ' id="$'+bn+'$" name="'+bn+'" onclick="'
				    + o.onclick+'" title="'+o.text+'"></button>')
				: ('<button name="' + bn + '" class="BtnFlow"'
					+ ' id="$' + bn + '$" accessKey="' + o.key + '"'
					+ ' onclick="' + o.onclick + '" type="button">'
					+ '<u>' + o.key + '</u>'
					+ '-' + o.text
					+ '</button>')
				;
			buttonBox.html(button + buttonBox.html());
		}
/**
{
	Desc : 'Open Browser | 打开对话浏览框'
	,Params : {
		Option : Object
		,Example : {
			page : 'Browser Page URL , String'
			,height : 'Browser Height , String' (M Default : 550px)
			,width : 'Browser Width , String' (M Default : 550px)
			,f : 'Browser Field , String' (M)
		}
		,Value Operation : Function
	} 
	,Return : Page Return Value(Ecology 7 Only)
}
 */
		,ob : function(o , f){
			if (! o.page){
				return;
			}
			if (! o.height){
				o.height = '550px';
			}
			if (! o.width){
				o.width = '550px';
			}
			if (true
			&& '8' == this.ev 
			&& top.Dialog ){
				var d = new top.Dialog();
//				d.Title = '';
				d.Width = this.n(o.width, 550, true);
				d.Height = this.n(o.height, 550, true);
				d.Drag = true;
				d.maxiumnable = true;
				d.URL = o.page;
				d.callbackfun = function(p1,r,p3){
					if (o.f && r){
						var rv = function(k){
							if (! k in r){
								return;
							}
							var s = r[k];
							return s.indexOf(",") == 0 ? s.substring(1) : s;
						};
						_C.v(o.f , rv('id'));
						_C.t(o.f , rv('name'));
					}
					if (!!r 
					&& 'function' == typeof f){
						f(r);
					}
				};
				d.show();
			} else {
				var r = window.showModalDialog(o.page , undefined
					,'dialogHeight:' + o.height + ';'
					+ 'dialogWidth:' + o.width + ';'
					+ 'center:yes;menubar:no');
				if (o.f && r){
					var rv = function(k){
						if (! k in r){
							return;
						}
						var s = r[k];
						return s.indexOf(",") == 0 ? s.substring(1) : s;
					};
					_C.v(o.f , rv('id'));
					_C.t(o.f , rv('name'));
				}
				if (!!r 
				&& 'function' == typeof f){
					f(r);
				}
				return r;
			}
		}
/**
{
	Desc : 'Browser Button | 浏览按钮图标'
	,Params : {
		Field ID : String
		,Button Click Function : Function (M Override)
	} 
	,Return : Browser Button (JQuery Object)
}
 */
		,browserButton : function(id , f){
			var b = jQuery('#' + id).siblings('button:first');
			if ('function' == typeof f){
				for (var k = 0; k < b.length; k++){
					b[k].onclick = f;
				}
			}
			return b;
		}
/**
{
	Desc : 'Delete Row | 删除行'
	,Params : {
		Sub Table Index : Int
		,Row Index : Int Or String('_?') (M Delete All)
	} 
}
 */
		,deleteRow : function(stI , rI){
			if ('string'==typeof stI){
				stI = this.f2stI(stI);
				if (stI < 0){
					return;
				}
			}
			var _c = this;
			var cs = document.getElementsByName('check_node_' + stI);
			if (cs.length < 1){
				cs = document.getElementsByName('check_mode_' + stI);
				if (cs.length < 1){
					return;
				}
			}
			var n = -1;
			if (rI){
				n = 
					_c.n(rI
					, _c.n(rI.substring(1) 
						, -1
						, true), true);				
			}
			for (var k = 0; k < cs.length; k++){
				if (rI 
						&& n != _c.n(cs[k].value, -2, true)
						&& n != _c.n(jQuery(cs[k]).attr('_rowindex'), -2, true)){
					continue;
				}
				cs[k].checked = 'checked';
			}
			var oldDialog = window.isdel;
			window.isdel = function(){return true;};
			var oldConfirm = window.confirm;
			window.confirm = function(){return true;};
			eval('deleteRow' + stI + '(' + stI + ')');
			window.isdel = oldDialog;
			window.confirm = oldConfirm;
		}
/**
{
	Desc : 'Add Row | 增加行'
	,Params : {
		Sub Table Index : Int
		,Data Action : Function (Param : Row Number)
	} 
}
 */
		,addRow : function(stI , f){
			if (undefined == stI){
				return;
			}
			if ('string'==typeof stI){
				stI = this.f2stI(stI);
				if (stI < 0){
					return;
				}
			}
			var jo = jQuery('#indexnum'+stI);
			if (jo.length==0) jo = jQuery('#nodenum'+stI);
			var n = '_' + jo.val();
			try {
				eval('addRow' + stI + '(' + stI + ');');
			}catch(e){
				if(!!window.console&&'function'==typeof window.console.log)
					window.console.log('ADD ROW FAIL > '+e);
			}
			if (f){
				this.emst(stI, n, function(){
					f(n);
				});
			}
		}
/**
{
	Desc : 'Top Menu | 顶部菜单附加'
	,Params : {
		Menu Action : Function
		,Text : String (M Default '菜单X')
		,Img : String (M Default 'btn_list')
	} 
}
 */
		,topMenu : function(f , text , img){
			if(! window.parent.bar){
				return;
			}
			if (! f){
				return;
			}
			var mBox = jQuery('#toolbarmenu', window.parent.document);
			var id = mBox.children('td').length+1;
			if (! text){
				text = '菜单' + id;
			}
			if (! img){
				img = 'btn_list';
			}
			var key = 'menuItemDivId' + id;
			var bar_ = window.parent.bar;
			var m = {
				id: key
				, text: text
				, iconCls: img
				, handler: f
			};
			window.parent.bar = [m];
			window.parent.setToolBarMenu();
			bar_ = bar_.push(m);
			var t = jQuery('button:contains("'+text+'")'
					, mBox).parents('table:first').onclick = f;
		}
/**
{
	Desc : 'More Menu | 右键菜单附加'
	,Params : {
		Menu Action : Function
		,Text : String (M Default '菜单X')
	} 
}
 */
		,moreMenu : function(f , text){
			if (! f){
				return;
			}
			var mBox = jQuery('div[id="menuTable"]'
				, window.frames['rightMenuIframe'].document);
			var n = mBox.children('.b-m-item').length+1;
			if (! text){
				text = '菜单' + n;
			}
			var theme = window.parent.GLOBAL_CURRENT_THEME || 'ecology7';
			var folder = window.parent.GLOBAL_SKINS_FOLDER || 'default';
			var id = 'menuItemDivId' + n;
			var m = '<div id="' + id + '"'
				+ ' class="b-m-item"'
				+ ' onmouseover="this.className=\'b-m-ifocus\'"'
				+ ' onmouseout="this.className=\'b-m-item\'"'
				+ ' unselectable="on" >'
				+ '<div class="b-m-ibody" unselectable="on" >'
				+ '<nobr unselectable="on" >'
				+ '<img align="absMiddle"'
				+ ' src="/wui/theme/'
				+ theme
				+ '/skins/'
				+ folder
				+ '/contextmenu/default/11.png"'
				+ ' width="16" >'
				+ '<button id="'
				+ id
				+ '_btn" style="width: 120px" >'
				+ text
				+ '</button>'
				+ '</nobr></div></div>';

			mBox.append(jQuery(m));
			jQuery('#rightMenuIframe')
				.height(jQuery('#rightMenuIframe').height()+24);
			jQuery('#'+id+'_btn', mBox).bind('click', f);
		}
/**
{
	Desc : 'Post Ajax | Post Ajax'
	,Params : {
		URL : String
		,Function : Result Param
	} 
}
 */
		,post : function(url , f){
			jQuery.ajax({
				type : 'post'
				, url : url
				, success : f
			});
		}
/**
{
	Desc : 'To JSON | 字符串转JSON'
	,Params : {
		JSON String : String
		,Function : Error Function
	} 
}
 */
		,json : function(s , f){
			try {
				return eval('(' + s + ')');
			} catch (e) {
				if (f){
					f(e);
				}
			}
		}
/**
{
	Desc : 'URL Parameter | 获取地址栏参数'
	,Params : {
		Parameter Key : String (Return Parameter Of Key)
		,Default Value : String (M)
	} 
	,Return : Parameters
}
 */
		,uP : function(key , dv){
			var url = window.location.href;
			if (url.indexOf('?') < 0){
				return key ? dv : {};
			}
					
			var s = url.substring(url.indexOf('?') + 1).split('&');
			var p = {};
			for (var n = 0; n < s.length; n++){
				var t = s[n].split('=');
				var k = t[0];
				var v = t[1];
				if (k in p){
					if (p[k] instanceof String){
						var ks = p[k];
						var a = [];
						a[0] = ks;
						a[1] = v;
						p[k] = a;
					} else {
						var a = p[k];
						a[a.length] = v;
						p[k] = a;
					}
				} else {
					p[k] = v;
				}
			}
			if (key){
				return p[key];
			} else {
				return p;
			}
		}
/**
{
	Desc : 'Is Read Only | 流程是否只读'
	,Return : {
		True : Is Read Only
		,False : Editing
	}
}
 */
		,isRead : function(p){
			if (! p){
				p = this.uP();
			}
			if ('reEdit' in p){
				return false;
			}
			if ('message' in p){
				return false;
			}
			if ('requestid' in p){
				return true;
			}
			return false;
		}
/**
{
	Desc : 'Map Show | 遍历集合字符'
	,Params : {
		Map : Object
		,Title : String (M)
	} 
	,Return : Map Key And Values
}
 */
		,mapShow : function(o , t){
			if (! o){
				return;
			}
			if (! t){
				t = 'Map';
			}
			var s = t + ' : \n{';
			var f = true;
			for (var k in o){
				s = s + '\n   ' + (f ? ',' : ' ') + k + ' : ' + o[k];
				f = false;
			}
			s = s + '\n}';
			return s;
		}
/**
{
	Desc : 'Only One Check | 有且只有其一'
	,Params : {
		Target Field : String
		,All Field : String[]
		,Row Index : Int Or String('_?') (M Delete All)
	} 
}
 */
		,onlyOne : function(t , mf , r){
			var _c = this;
			if (_c._onlyOneRunning){
				return;
			}
			_c._onlyOneRunning = true;
			try {
				if (! t || ! mf){
					return;
				}
				if (! r){
					r = '';
				} else if (_c.n(r, -1, true) > -1){
					r = '_' + r;
				}
				if ('' == _c.v(t+r)){
					var nv = true;
					for (var k = 0; k < mf.length; k++){
						if (mf[k] == t){
							continue;
						}
						var fk = mf[k]+r;
						if ('' != _c.v(fk)){
							if (nv){
								nv = false;
							} else {
								_c.vt(fk, '');
							}
						}
					}
					if (nv){
						for (var k = 0; k < mf.length; k++){
							var fk = mf[k]+r;
							_c.rs(fk, true);
						}
					}
				} else {
					for (var k = 0; k < mf.length; k++){
						if (mf[k] == t){
							continue;
						}
						var fk = mf[k]+r;
						_c.rs(fk, false);
						_c.vt(fk, '');
					}
				}
			} catch (e) {}
			_c._onlyOneRunning = false;
		}
		,_onlyOneRunning : false
/**
{
	Desc : 'A Label For Hrm | 人力资源链接'
	,Params : {
		Hrm Resource ID Value : String
		,Hrm Resource Last Name Text : String
	} 
	,Return : A Label HTML
}
*/
		,aHrm : function(v , t){
			return '<a onclick="pointerXY(event);"'
				+ ' href="javascript:openhrm(' + v + ');">'
				+ t + '</a>';
		}
/**
{
	Desc : 'Editer Display | 编辑区显示切换(E8)'
	,Params : {
		Field ID : String
		,Is Display : Boolean
	}
}
*/
		,editerDisplay : function(id , isDisplay){
			var _c = this;
			if (jQuery('button#'+id+'browser').length){
				if (isDisplay){
					jQuery('button#'+id+'browser').show();
				} else {
					jQuery('button#'+id+'browser').hide();
				}
			} else if (jQuery('#'+ id + '_browserbtn').length){
				window.setTimeout(function(){
					var _jp = jQuery('#'+ id + 'span').parents('div.e8_os');
					if (isDisplay){
			            jQuery('#'+ id + 'span_crivia').hide();
			            _jp.show();
			            //jQuery('#'+ id + '_browserbtn').show();
			            //jQuery('#'+ id + 'span').parent().parent().show();
					} else {
			            if (! jQuery('#'+ id + 'span_crivia').length){
			                _jp.parent().append(
'<span id="'+id+'span_crivia" style="float: left;" ></span>');
			            }
			            //jQuery('#'+ id + '_browserbtn').hide();
			            //jQuery('#'+ id + 'span').parent().parent().hide();
			            _jp.hide();
			            jQuery('#'+ id + 'span_crivia').html(_c.t(id));
			            jQuery('#'+ id + 'span_crivia').show();
			            jQuery('#'+ id + 'span_crivia').find('span.e8_delClass').hide();
					}
				} , 370);
			} else {
				var o = jQuery('#'+ id);
				if (jQuery(o).attr('type') == 'hidden'){
					return;
				}
				var s = o.find('option:selected');
				if (isDisplay){
		            jQuery('#'+ id + 'span_crivia').hide();
					if (_c.ui.isMobile() && s.length){
						jQuery('input[id$="' + id +'"]').show();
					} else {
						o.show();
					}
					if (! s.length){
						if (_c.v(id)){
							_c.t(id , '');
						}
					}
				} else {
					if (_c.ui.isMobile() && s.length){
						jQuery('input[id$="' + id +'"]').hide();
					} else {
						o.hide();
					}
					if (s.length){
						var x = s.text();
						var t = jQuery('#'+ id + 'span_crivia');
			            if (! t.length){
			                var p = o.parent();
			                p.prepend( '<span id="'+id+'span_crivia" style="float: none;" ></span>');
			            }
						t = jQuery('#'+ id + 'span_crivia');
			            t.html(o.val()?x:'');
			            t.show();
					} else {
						if (_c.v(id)){
							var t = document.getElementById(id + 'span');
							if (!t){
				                var p = o.parent();
				                p.append('<span id="'+id+'span" style="float: none;" ></span>');
							}
							_c.t(id , _c.v(id));
						}
					}
				}
			}
		}
/**
{
	Desc : 'Edit Mobile Sub Table  | 编辑移动端子表'
	,Params : {
		Sub Table Index : Int Or String(Field)
		,Row Index : Int Or String('_?') 
		,Function : Edit Action
	}
}
*/
		,emst : function(stI , rI , f){
			if ('function'!=typeof f){
				return;
			}
			if (stI < 0){
				f();
				return;
			}
			if ('string'==typeof stI){
				this.emst(this.f2stI(stI), rI, f);
				return;
			}
			if ('function'!=typeof window.detailTrClick){
				f();
				return;
			}
			var _c = this;
			var n = -1;
			if (rI){
				n = 
					_c.n(rI
					, _c.n(rI.substring(1) 
						, -1
						, true), true);				
			}
			if (n < 0){
				return;
			}
			if ('function'!= typeof this._v){
				this._v = this.v;
				this.v = function(id , v){
					var o = this._v(id, v);
					if ('object'!=typeof o){
						return o;
					}
					var e = jQuery('#'+id+'_d');
					if (!e.length
					|| 'string'!= typeof e.attr('onchange')
					|| e.attr('onchange').indexOf('dynamicModify')<0){
						return;
					}
					e.val(v);
					e.change();
				};
			}
			var ea = jQuery('#trEdit_'+stI+'_'+n);
			if (ea.length > 0){
				f();
				var fo = document.activeElement;
				var tagName = fo.tagName;
				fo = jQuery(document.activeElement);
				var id = fo.attr('id');
				var name = fo.attr('name');
				var value = fo.val();
				try {
					window.detailTrClick(stI , n);
					window.detailTrClick(stI , n);
				} catch (e) {}
				var fo = id ? jQuery(tagName+'[id="'+id+'"]')
					: jQuery(tagName+'[name="'+id+'"]');
				fo.focus();
				fo.val(value);
				return;
			}
			try {
				window.detailTrClick(stI , n);
			} catch (e) {}
			f();
			try {
				window.detailTrClick(stI , n);
			} catch (e) {}
		}
/**
{
	Desc : 'Field To Sub Table Index  | 字段子表索引'
	,Params : Field(String)
	,Return : Sub Table Index(Int)
}
*/
		,f2stI : function(f){
			if (f in this._m4f2stI){
				return this._m4f2stI[f];
			}
			var o;
			var each = function(jo){
				if (jo.length < 1) return false;
				o = jQuery(jo[0]).parents('table[id^="oTable"]');
				return o.length > 0;
			};
			if(each(jQuery('input[id^="' + f + '"]'))){
			} else if (each(jQuery('select[id^="' + f + '"]'))){
			} else if (each(jQuery('textarea[id^="' + f + '"]'))){
			}
			if (!!o && o.length > 0){
				o = o.attr('id');
				if ('string'==typeof o){
					o = _C.n(o.substring(6),-1,true);
					this._m4f2stI[f] = o;
					if (o > -1){
						return;
					}
				}
			}
			this._m4f2stI[f] = -1;
			return this.f2stI(f);
		}
		,_m4f2stI : {}
/**
{
	Desc : 'Reset Browser Page | 重写浏览按钮打开页面(E8)'
	,Params : {
		Field ID : String
		,Page URL : String
		,Parameter Loader : Function
	}
}
*/
		,rbp : function(id , url , parameterLoader){
			var jo = jQuery('#'+id+'_browserbtn');
			if (! jo.length){
				return;
			}
			var btn = jo[0];
			var onclicks = btn.getAttribute('onclick').split(',');
			btn.onclick = function(){
				var s = '';
				for (var k = 0; k < onclicks.length; k++){
					if (0 < k){
						s += ',';
					}
					if (1 == k){
						var p = '';
						if ('function'==typeof parameterLoader){
							var o = parameterLoader();
							if ('string'==typeof o){
								p = o;
							}
						}
						s += '\''+url+p+'&__f=\'';
					} else if (4 == k) {
						var b = onclicks[k].substring(0,onclicks[k].indexOf('.'));
						var e = onclicks[k].substring(onclicks[k].indexOf('.'));
						if (b.match(/field\d+_?\d?/)){
							s += 'document.getElementById(\''
								+ b + '\')' + e;
						} else {
							s += onclicks[k];
						}
					} else {
						s += onclicks[k];
					}
				}
				eval(s);
			};
		}
/**
{
	Desc : 'Editer Status Switch | 控件状态切换'
	,Params : {
		Field ID : String
		,Editable & Requird : Boolean
	} 
}
*/
		,ess : function(f , ss){
			if (! ss){
				this.editerDisplay(f, true);
				this.v(f, '');
			}
			this.rs(f, !!ss);
			this.editerDisplay(f, !!ss);
		}
		,_fkReady : []
		,_fkReadyRun : function(){
			if (!!top._CriviaDymanicFields
			&& !!top._CriviaDymanicFields.length){
				for (var k = 0; k < this._fkReady.length; k++){
					this._fkReady[k]();
				}
				return;
			}
			window.setTimeout('_C._fkReadyRun()',100);
		}
/**
{
	Desc : 'Field Key Ready | 字段信息就绪'
	,Params : {
		Function : Do Something When Fields Ready
	} 
}
*/
		,fkReady : function(f){
			if ('function'!=typeof f) return;
			if (!!top._CriviaDymanicFields
			&& !!top._CriviaDymanicFields.length) {
				f(); return;
			}
			var n = this._fkReady.length;
			if (0 == n){
				this._fkReadyRun();
			}
			this._fkReady[n] = f;
		}
/**
{
	Desc : 'Detail Table Scroll Column | 设定锁列滚动表格'
	,Params : {
		Detail Table Index : Integer
		,All Width : Width Setting (like: 2000px)
		,Fix Column Count : Ingeter
	} 
}
*/
		, dtsc : function(dtI,aw,fcc){
			var jt = jQuery('table#oTable'+dtI);
			var jtBox = jt.parent('div#detailDiv_'+dtI);
			var w = _C.n(jtBox.css('width'),0,true);
			jtBox
				.css('width',w+'px')
				.css('overflow-x','scroll');
			jt.css('width',_C.n(''+aw,0,true)+'px');
			jtBox.scroll(function(){
				var x = jtBox.scrollLeft();
				jt.find('tr').each(function(){
					var jds = jQuery(this).find('td');
					for (var k = 0; k < jds.length; k++){
						if ('number'==typeof fcc && fcc>k)
							jQuery(jds[k])
								.css('position','relative')
								.css('top','0px')
								.css('left',x);
						else if ('function'==typeof fcc && fcc(jQuery(jds[k])))
							jQuery(jds[k])
								.css('position','relative')
								.css('top','0px')
								.css('left',x);
					}
				});
			});
		}
/**
{
	Desc : 'Value 4 Select | 根据文本设定下拉框的值'
	,Params : {
		Key : Select Key
		,Function : Is Select
	} 
}
*/		
		, v4select : function(k,f){
			if ('function'!=typeof f)return;
			var _c = this;
			jQuery('#'+k+' option').each(function(){
				var jo = jQuery(this);
				if(f(jo.text(),jo)) _c.v(k,jo.val());
			});
		}
};
GlobalReger(function(w){
	w.CriviaWorkFlowJavaScriptFunctions = top.CriviaWorkFlowJavaScriptFunctions;
});

top._C = CriviaWorkFlowJavaScriptFunctions==top._C
	?top._C:CriviaWorkFlowJavaScriptFunctions;
GlobalReger(function(w){
	w._C = top._C;
});
top._CRM = undefined!=top._CRM?top._CRM:_C._cwjsListenerValueMap;
GlobalReger(function(w){
	w._CRM = top._CRM;
});
<!-- westvalley Function dev end -->
//Money Format Show-千分位金额字段赋值
function mfs(k,n){
	var v = "number"==typeof n?""+n
		: _C.n(""+n,0)+"";
	_C.editerDisplay(k,true);
	if ("string" == typeof jQuery("#"+k)
		.attr("onblur")
		&&jQuery("#"+k)
		.attr("onblur")
		.indexOf("changeToThousands2")>-1){
		jQuery("#"+k).val(commafy(_C.n(v,0).toFixed(2)));
		return;
	}
	_C.v(k,_C.n(v,0));
	var nv = _C.v(k);
	if (!nv || nv.indexOf(",")>-1){
		return;
	}
	if ("function"== typeof window.changeToThousands2){
		changeToThousands2(k,2);
		var nv = _C.v(k);
		if (!nv || nv.indexOf(",")>-1){
			return;
		}
	}
	if ("function"== typeof window.commafy){
		_C.v(k,commafy(_C.n(v,0)));
	}
};
// Money Format Show (Read Only).千分位金额字段赋值(只读)
function mfsro(k,v){
	mfs(k,v);
	_C.editerDisplay(k,false);
	window.setTimeout(function(){
		if ("none"==jQuery("#"+k).css("display")){
			_C.t(k,_C.v(k));
		}
	} , 370);
}
/**
 * 文本字段只读
 * @param field
 * @returns
 */
function setReadIT(field){
	jQuery("#"+field).attr({readonly:'true'});
}

function setReadIF(field){
	//jQuery("#"+field).attr({readonly:'false'});
	jQuery("#"+field).removeAttr("readonly");
}
/**
 * 选择框只读
 * @param field
 * @returns
 */
function setReadST(field){
	jQuery("#"+field).attr("disabled",true);
}
function setReadSF(field){
	jQuery("#"+field).attr("disabled",false);
}

/**
 * 返回获取指定元素
 * v id或者name
 */
function getID(v){
	var rtnEle = null;
	rtnEle = jQuery("*[id='" + v + "']");
	if (rtnEle == undefined || rtnEle == null||rtnEle.length==0) {
		rtnEle = jQuery("*[name='" + v + "']");
	}
	return rtnEle;
}

/**
 * 浏览按钮赋值
 */
function setButton(id,v,span){
	var sHtml = "";
	jQuery("#"+id).val(v);
	if (!isNull(v)) {
		sHtml = wrapshowhtml0(jQuery("#" + id).attr("viewtype"), "<a title='" + v + "'>" + span + "</a>&nbsp", v);
	}
	jQuery("#"+id+"span").html(sHtml);
}

/**
 *设置对象隐藏
 */
function setHide(v){
	if (isNull(v)) {
		return false;
	}
	getID(v).hide();
};

/**
 *设置对象显示
 */
function setShow(v){
	if (isNull(v)) {
		return false;
	}
	getID(v).show();
};

/**
 *设置按钮对象隐藏 -fieldid_browserbtn
 */
function setHideButton(v){
	if (isNull(v)) {
		return false;
	}
	jQuery("#" + v+"wrapspan").hide();
	//jQuery("#" + v+"span").hide();
	//jQuery("#" + v+"_browserbtn").hide();
};

/**
 * 判断是否为空
 */
function isNull(v){
	if (typeof(v) == "undefined" || v == "" || v == null) {
		return true;
	}
	return false;
};


/** 
 * 检查两个字符串是否相等
 */
function isEque(v1, v2){
	if (v1 == v2) {
		return true;
	}
	else {
		return false;
	}
}


/**
 * 转为正常的数字
 */
function toNum(v){
	if (isNull(v)) {
		return 0;
	}
	return parseFloat(String(v).replace(/,/g, ""));
};

/**
 * 保留2位小数
 */
function toFloat(v){
	if (isNull(v)) {
		return "0.00";
	}
	return Math.round(v * Math.pow(10, 2)) / Math.pow(10, 2);
}
/***
 * 获取下拉框选中的文本值
 * @param selectid
 * @returns
 */
function getSelectText(selectid,isread,val){
	var resu = "";
	if(val){
		selectid = isread ? "dis"+selectid : selectid; //只读下拉框id带dis
		resu = jQuery("#"+selectid).find("option[value="+val+"]").text();
	}else{
		//var selval = jQuery("#"+selectid).val();
		var selval = _C.v(selectid);
		if(selval){
			selectid = isread ? "dis"+selectid : selectid; //只读下拉框id带dis
			resu = jQuery("#"+selectid).find("option[value="+selval+"]").text();
		}
	}
	return resu;
}
/**
 * 日期加减天数操作-返回yyyy-mm-dd格式字符串
 * @param dd
 * @param dadd
 */
function dateAddDay(dd,day){
	var a = new Date(dd);
	return formateDate(new Date(a.valueOf()+day * 24 * 60 * 60 * 1000));
};
/**
 * 格式化日期为yyyy-mm-dd
 * @param dd
 * @param dadd
 */
function formateDate(dd){
	var seperator1 = '-';
	var seperator2 = ':';
	var date = new Date();
	if(typeof dd=="date"){
		date = dd;
	}else if(dd){
		date = new Date(dd);
	}
	var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            //+ " " + date.getHours() + seperator2 + date.getMinutes()
            //+ seperator2 + date.getSeconds()
            ;
    return currentdate;
};
/**
 * 日期比较
 * @param dbegin date开始日期
 * @param dend date结束日期
 * return 0:相等,1:dend>dbegin,-1:dend<dbegin
 */
function dateCompare(dbegin,dend){
	var begin = new Date(dbegin).valueOf();
	var end = new Date(dend).valueOf();
	var a = 0 ;
	if(begin < end){
		a = 1;
	}else if(begin > end){
		a = -1;
	}
	return a;
};

/**
 * 解决IE7、8下日期NAN问题
 * @param dateStringInRange(yyyy-mm-dd格式日期)
 * @returns
 */
function parseISO8601(dateStringInRange) {  
	var isoExp = /^\s*(\d{4})-(\d\d)-(\d\d)\s*$/,  
	    date = new Date(NaN), month,  
	    parts = isoExp.exec(dateStringInRange);  
	if(parts) {  
	   month = +parts[2];  
	   date.setFullYear(parts[1], month - 1, parts[3]);  
	   if(month != date.getMonth() + 1) {  
	      date.setTime(NaN);  
	   }  
	}  
	return date;  
};
/**
 * 计算日期相差天数/Math.abs绝对值
 * @param strDateStart
 * @param strDateEnd
 * @returns
 */
function getBEDays(strDateStart,strDateEnd){ 
	var strSeparator = "-"; //日期分隔符 
	var oDate1; 
	var oDate2; 
	var iDays; 
	oDate1= strDateStart.split(strSeparator); 
	oDate2= strDateEnd.split(strSeparator); 
	var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]); 
	var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]); 
	iDays = parseInt((strDateE - strDateS ) / 1000 / 60 / 60 /24)//把相差的毫秒数转换为天数 
	return iDays ; 
};
/**
 * input框隐藏显示
 * @param inKey  : fieldid
 * @param isShow  显示：true 隐藏：false 
 */
function inputHAS(inKey,isShow){
	if(isShow){
		jQuery("#"+inKey).show();
	}else{
		jQuery("#"+inKey).hide();
	}
}
/**
 * 遍历明细赋值字段
 * @param o={field_from,field_to}
 * @returns
 */
function setDtValue(o){
	_C.stEach(o.field_from,function(r){
		_C.v(o.field_to+r,_C.v(o.field_from+r));
	});
};
/****费用类型浏览按钮-不同流程展现对应的费用类型数据*****/
function resetBrowserUnit(fieldid,wfid){
	var url = "/CostTypeBrowser.c?isSubOnly=1&wfid="+wfid;
	_C.rbp(fieldid,url);
};
/**刷新后绑定费用类型**/
function flashdtUnit(fdtid,wfid){
	_C.stEach(fdtid,function(r){
		resetBrowserUnit(fdtid+r,wfid);
	});
};
/***
 * 设置日期为当前日期-是否需要判断空值
 * @param field
 * @returns
 */
function setNowDate(field1,field2){
	var seperator1 = '-';
	var date = new Date();
	var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            ;
    if(field1 && (_C.v(field1) == "" || _C.v(field1) == undefined)){
    	_C.v(field1,currentdate);
    }
    if(field2 && (_C.v(field2) == "" || _C.v(field2) == undefined)){
    	_C.v(field2,currentdate);
    }
};

/**
 * 日期转为年月
 * @param datestr
 * .substr(start,length)
 * @returns
 */
function date2YearMonth(datestr){
	var result = "";
	if(datestr){
		result = datestr.substring(0,4)+"年"+datestr.substring(5,7)+"月";
	}
	return result;
}
/**
 * 赋值明细字段到主表字段
 * @param dtField-明细字段
 * @param mField-主表字段
 * @param dpField-去重字段
 * @returns
 */
function writeDt2Main(dtField,mField,dpField){
	var dval = "";
	var dtext = "";
	var dpval = dpField ? _C.v(dpField) : "" ;
	var dptext = dpField ? _C.at(dpField) : "" ;
	var objval = [];
	_C.stEach(dtField,function(r){
		var val = _C.v(dtField+r);
		var text = _C.at(dtField+r);
		if(!(val in objval) && val != dpval){
			objval[val] = text;
		}
	});
	for(var key in objval){
		if(toNum(key) > 0){
			if(dval == ""){
				dval = key;
				dtext = objval[key];
			}else{
				dval += "," + key;
				dtext += " " + objval[key];
			}
		}
	}
	if(""!= dpval && dval == ""){
		dval = ("" == dval) ? dpval 
				: dpval;  // + "," + dval  //2018-01-29 - 去掉申请人
	}
	if(""!= dptext && dtext == ""){
		dtext = ("" == dtext) ? dptext 
				: dptext ;  //+ " " + dtext   //2018-01-29 - 去掉申请人
	}
	_C.vt(mField,dval,dtext);
};
/**
 * 税额计算 不含税金额=金额/(1+税率)
 * @returns
 */
function runShuil(mtslid,dtje1,dtbhs1,dtse1,mwsje,mse){
	//绑定税率字段
	_C.run2(mtslid,function(p){
		if(p.v.o == undefined){ //初次加载(保存表单)
    		return ;
		}
		var shuil = getSelectText(mtslid,false,p.v.n);
		var shuilNum = toNum(shuil);
		var money = 0;
		var bhsje = 0;
		_C.stEach(dtje1,function(rt){ 
			money = toNum(_C.v(dtje1+rt));
			bhsje = toFloat(money/(1+shuilNum));
			jQuery('#'+dtbhs1+rt).val(bhsje);
			jQuery('#'+dtbhs1+rt+"span").html(bhsje);
			//mfsro(dtbhs1+rt,bhsje);  //不含税金额
			//mfsro(dtse1+rt,toFloat(money-bhsje));  //税额
			jQuery('#'+dtse1+rt).val(toFloat(money-bhsje));
			jQuery('#'+dtse1+rt+"span").html(toFloat(money-bhsje));
			sumDtNum(mwsje,dtbhs1);
			sumDtNum(mse,dtse1);
		});
	});
	//绑定金额字段
	_C.run2(dtje1,function(p){
		if(p.v.o == undefined){ //初次加载(保存表单)
    		return ;
		}
		var shuil = getSelectText(mtslid,false);
		var shuilNum = toNum(shuil);
		var money = toNum(_C.v(dtje1+p.r));
		var bhsje = toFloat(money/(1+shuilNum));
		jQuery('#'+dtbhs1+p.r).val(bhsje);
		jQuery('#'+dtbhs1+p.r+"span").html(bhsje);
		//mfsro(dtbhs1+p.r,bhsje);  //不含税金额
		//mfsro(dtse1+p.r,toFloat(money-bhsje));  //税额
		jQuery('#'+dtse1+p.r).val(toFloat(money-bhsje));
		jQuery('#'+dtse1+p.r+"span").html(toFloat(money-bhsje));
		sumDtNum(mwsje,dtbhs1);
		sumDtNum(mse,dtse1);
	});
};
/**
 * 合计明细金额字段并赋值到主表
 * @param mid
 * @param dtid
 * @returns
 */
function sumDtNum(mid,dtid){
	var num = 0;
	_C.stEach(dtid,function(rt){ 
		num += toNum(_C.v(dtid+rt));
	});
	jQuery("#"+mid).val(toFloat(num));
	jQuery("#"+mid+"span").html(toFloat(num));
	//mfsro(mid,toFloat(num));
}
/**
 * 发票类型选择0-“无发票”和2-“增值税普通发票”主表单不显示税率
 * 清空税率字段
 * **/
function shuilShow(faplx,shuilid){
	if("1" == faplx){
		jQuery(".shuilDIV").show();
	}else{
		jQuery("#"+shuilid).val("");
		jQuery(".shuilDIV").hide();
	}
}
/**
 * 历史付款明细显示隐藏
 * 
function lisfkShow(shifgl,dtnum){
	if("0" == shifgl){
		_C.addRow(dtnum);
		jQuery(".lisfkDIV").show();
	}else{
		_C.deleteRow(dtnum);
		jQuery(".lisfkDIV").hide();
	}
}**/
/**
 * 借贷明细生成
 * @param ff - 字段信息
 * @param type - 类型 flash = 刷新借贷明细
 * @param dtcount - 明细行数(涉及刷新时删除原有明细)
 * @returns
 */
function getVoucherDtData(ff,isFlash,dtcount){
	if(isFlash && dtcount > 0){ //刷新明细(非初始化)
		_C.deleteRow(ff.jiefNum);
		_C.deleteRow(ff.daifNum);
	}
	var sqzje = (ff.sqzje ? toNum(_C.v(ff.sqzje)) : 0);  //申请总金额
	var chongjk = (ff.chongjk ? toNum(_C.v(ff.chongjk)) : 0);  //冲借款
	var yingfgrje = (ff.yingfgrje ? toNum(_C.v(ff.yingfgrje)) : 0);  //应付个人金额
	var shuiehj = (ff.shuiehj ? toNum(_C.v(ff.shuiehj)) : 0);  //税额合计
	var fapsecyje = (ff.fapsecyje ? toNum(_C.v(ff.fapsecyje)) : 0);  //发票税额差异金额
	var renyxm = ff.shenqr ? _C.at(ff.shenqr) : ""; //人员姓名
	var shoukr = ff.shoukrwb ? _C.v(ff.shoukrwb) : ""; //收款人是否文本
	shoukr = shoukr ? shoukr : (ff.shoukr ? _C.at(ff.shoukr) : "");
	var huilv = ff.huilv ? toNum(_C.v(ff.huilv)) : 1;
	var zhaiyxx = renyxm+ff.zhaiywb+shoukr;  //摘要信息
	var zhaiyjw = "";
	var feiylbstr = "";   //费用类别

	
	//借方明细生成
	_C.stEach(ff.sqkmmc,function(rf){ //遍历报销明细
		var sqje = toNum(_C.v(ff.sqjine+rf)); //申请金额
		var feiylb = ff.sqfylb ? _C.at(ff.sqfylb+rf) : "";
		feiylbstr = feiylb; // += "、"+feiylb //汇总费用类别
		_C.addRow(ff.jiefNum,function(rt){
			_C.vt(ff.jiefkmmc+rt,_C.v(ff.sqkmmc+rf),_C.t(ff.sqkmmc+rf)); //科目名称
			//_C.v(ff.jiefkmdm+rt,_C.v(ff.sqkmdm+rf));  //科目代码-联动
			if(ff.jiefsyb){
				_C.vt(ff.jiefsyb+rt,_C.v(ff.sqsyb+rf),_C.t(ff.sqsyb+rf)); //事业部
			}
			if(ff.jiefftbm){
				_C.vt(ff.jiefftbm+rt,_C.v(ff.sqftbm+rf),_C.t(ff.sqftbm+rf)); //分摊部门
			}
			if(ff.jieffylb && _C.v(ff.sqfylb+rf)){
				_C.vt(ff.jieffylb+rt,_C.v(ff.sqfylb+rf),_C.t(ff.sqfylb+rf)); //费用类别
			}
			if(ff.jiefxmmc && _C.v(ff.sqxmmc+rf)){
				_C.vt(ff.jiefxmmc+rt,_C.v(ff.sqxmmc+rf),_C.t(ff.sqxmmc+rf)); //项目名称
				_C.v(ff.jiefxmdm+rt,_C.v(ff.sqxmmc+rf)); //项目代码
			}
			if(ff.jiefzjgc && _C.v(ff.sqzjgc+rf)){
				_C.vt(ff.jiefzjgc+rt,_C.v(ff.sqzjgc+rf),_C.t(ff.sqzjgc+rf)); //在建工程
			}
			if(ff.jfjjgc && _C.v(ff.jjgc+rf)){
				_C.vt(ff.jfjjgc+rt,_C.v(ff.jjgc+rf),_C.t(ff.jjgc+rf)); //在建工程_基建付款
			}
			if(ff.jiefwldw && _C.v(ff.sqwldw+rf)){
				_C.vt(ff.jiefwldw+rt,_C.v(ff.sqwldw+rf),_C.t(ff.sqwldw+rf)); //往来单位
			}
			//mfs(ff.jiefje+rt,sqje);  //金额
			jQuery('#'+ff.jiefje+rt).val(sqje);
			getFous(ff.jiefje+rt);//金额获得焦点 触发列规则
			if(ff.jiefyjsf){
				jQuery('#'+ff.jiefyjsf+rt).val(_C.v(ff.sqshuie+rf));
			}
			if(ff.jiefbiz){ //币种+汇率+本位币
				_C.vt(ff.jiefbiz+rt,_C.v(ff.bizhong),_C.t(ff.bizhong));  //币种
				//_C.v(ff.jiefhl+rt,huilv);  //汇率-联动带出
				jQuery('#'+ff.jiefbwb+rt).val(toFloat(sqje*huilv));
			}
			if('lb' == ff.zhaiyjw){
				zhaiyjw = feiylb;
			}else if('je' == ff.zhaiyjw){
				zhaiyjw = sqje;
			}
			_C.v(ff.jiefzy+rt,zhaiyxx+zhaiyjw); //摘要 -
		});
	});
	if(shuiehj > 0){ 
		//当税额不为0，添加固定科目：借方科目=应交税费（2221.01.01.01）取数=税额+发票税额差异金额；
		var shuiekmdm = "215";
		var shuiekmmc = "应交税费_应交增值税_进项税额_已抵扣进项";
		var shuiedf = toFloat(shuiehj+fapsecyje);
		if('lb' == ff.zhaiyjw){
			zhaiyjw = feiylbstr;
		}else if('je' == ff.zhaiyjw){
			zhaiyjw = shuiedf;
		}
		_C.addRow(ff.jiefNum,function(rt){
			_C.vt(ff.jiefkmmc+rt,shuiekmdm,shuiekmmc);  //银行科目
			_C.v(ff.jiefkmdm+rt,shuiekmdm); //科目代码
			//mfs(ff.jiefje+rt,shuiedf); //金额
			jQuery('#'+ff.jiefje+rt).val(shuiedf); //金额
			getFous(ff.jiefje+rt);//金额获得焦点 触发列规则

			_C.v(ff.jiefzy+rt,zhaiyxx+zhaiyjw); //摘要
			if(ff.jiefbiz){ //币种+汇率+本位币
				_C.vt(ff.jiefbiz+rt,_C.v(ff.bizhong),_C.t(ff.bizhong));  //币种
				//_C.v(ff.jiefhl+rt,huilv);  //汇率-联动带出
				jQuery('#'+ff.jiefbwb+rt).val(toFloat(shuiedf*huilv));
			}
		});
	}
	//贷方明细生成
	var chongjkmdm = "96";
	var chongjkmmc = "其他应收款_个人借款";
	var yinhkmdm = _C.v(ff.yinhkmdm);
	//var yinhkmmc = _C.v(ff.yinhkmmc);
	if(chongjk > 0){ //有借款金额
		if(yingfgrje > 0){ //借款小于本次报销金额  
			//冲借款
			_C.addRow(ff.daifNum,function(rt){
				_C.vt(ff.daifkmmc+rt,chongjkmdm,chongjkmmc);  //
				_C.v(ff.daifkmdm+rt,chongjkmdm); //科目代码
				//mfs(ff.daifje+rt,chongjk); //金额
				jQuery('#'+ff.daifje+rt).val(chongjk);
				getFous(ff.daifje+rt);//金额获得焦点 触发列规则

				_C.v(ff.daifzy+rt,zhaiyxx+feiylbstr); //摘要 
				//员工核算项
				//_C.vt(ff.daifyg+rt,_C.v(ff.shoukr),_C.t(ff.shoukr));  //张艳昭add
				if(ff.daifyhzh){ //隐藏银行选项
					setHideButton(ff.daifyhzh+rt);
				}
				if(ff.daifbiz){ //币种+汇率+本位币
					_C.vt(ff.daifbiz+rt,_C.v(ff.bizhong),_C.t(ff.bizhong));  //币种
					//_C.v(ff.daifhl+rt,huilv);  //汇率-联动带出
					jQuery('#'+ff.daifbwb+rt).val(toFloat(chongjk*huilv));
				}
			});
			//应付款
			_C.addRow(ff.daifNum,function(rt){
				//_C.vt(ff.daifkmmc+rt,yinhkmdm,yinhkmmc);  //科目名称
				_C.v(ff.daifkmdm+rt,yinhkmdm); //科目代码
				//mfs(ff.daifje+rt,yingfgrje); //金额
				jQuery('#'+ff.daifje+rt).val(yingfgrje);
				getFous(ff.daifje+rt);//金额获得焦点 触发列规则

				_C.v(ff.daifzy+rt,zhaiyxx+feiylbstr); //摘要 - 
				if(ff.daifyg){ //隐藏员工选项
					setHideButton(ff.daifyg+rt);
				}
				//银行账户
				if(ff.daifyhzh){
					_C.vt(ff.daifyhzh+rt,_C.v(ff.moryhzh),_C.t(ff.moryhzh));
				}
				if(ff.daifbiz){ //币种+汇率+本位币
					_C.vt(ff.daifbiz+rt,_C.v(ff.bizhong),_C.t(ff.bizhong));  //币种
					//_C.v(ff.daifhl+rt,huilv);  //汇率-联动带出
					jQuery('#'+ff.daifbwb+rt).val(toFloat(yingfgrje*huilv));
				}
			});
		}else if(yingfgrje == 0){ //借款等于本次报销
			//冲借款
			_C.addRow(ff.daifNum,function(rt){
				_C.vt(ff.daifkmmc+rt,chongjkmdm,chongjkmmc);  //科目名称
				_C.v(ff.daifkmdm+rt,chongjkmdm); //科目代码
				//mfs(ff.daifje+rt,chongjk); //金额
				jQuery('#'+ff.daifje+rt).val(chongjk);
				getFous(ff.daifje+rt);//金额获得焦点 触发列规则

				_C.v(ff.daifzy+rt,zhaiyxx+feiylbstr); //摘要 
				if(ff.daifyhzh){ //隐藏银行选项
					setHideButton(ff.daifyhzh+rt);
				}
				if(ff.daifbiz){ //币种+汇率+本位币
					_C.vt(ff.daifbiz+rt,_C.v(ff.bizhong),_C.t(ff.bizhong));  //币种
					//_C.v(ff.daifhl+rt,huilv);  //汇率-联动带出
					jQuery('#'+ff.daifbwb+rt).val(toFloat(chongjk*huilv));
				}
			});
		}
	}else{  //没有冲借金额
		if('lb' == ff.zhaiyjw){
			zhaiyjw = feiylbstr;
		}else if('je' == ff.zhaiyjw){
			zhaiyjw = sqzje;
		}
		_C.addRow(ff.daifNum,function(rt){
			//_C.vt(ff.daifkmmc+rt,yinhkmdm,yinhkmmc);  //银行科目
			_C.v(ff.daifkmdm+rt,yinhkmdm); //科目代码
			//mfs(ff.daifje+rt,sqzje); //金额
			jQuery('#'+ff.daifje+rt).val(sqzje); //金额
			getFous(ff.daifje+rt);//金额获得焦点 触发列规则

			_C.v(ff.daifzy+rt,zhaiyxx+zhaiyjw); //摘要
			if(ff.daifyg){ //隐藏员工选项
				setHideButton(ff.daifyg+rt);
			}
			//银行账户
			if(ff.daifyhzh){
				_C.vt(ff.daifyhzh+rt,_C.v(ff.moryhzh),_C.t(ff.moryhzh));
			}
			if(ff.daifbiz){ //币种+汇率+本位币
				_C.vt(ff.daifbiz+rt,_C.v(ff.bizhong),_C.t(ff.bizhong));  //币种
				//_C.v(ff.daifhl+rt,huilv);  //汇率-联动带出
				jQuery('#'+ff.daifbwb+rt).val(toFloat(sqzje*huilv));
			}
		});
	}
};

function changeVal(ff){
	jQuery("#"+ff.yuanjk).change(function(){
		var yjk = (ff.yuanjk ? toNum(_C.v(ff.yuanjk)) : 0);
		var cj = (ff.chongjk ? toNum(_C.v(ff.chongjk)) : 0);
		if(yjk<cj){
			alert("冲借款大于借款，请重新填写！");
			jQuery("#"+ff.chongjk).val("");
		}
	});
	jQuery("#"+ff.chongjk).change(function(){
		var yjk = (ff.yuanjk ? toNum(_C.v(ff.yuanjk)) : 0);
		var cj = (ff.chongjk ? toNum(_C.v(ff.chongjk)) : 0);
		if(yjk<cj){
			alert("冲借款大于借款，请重新填写！");
			jQuery("#"+ff.chongjk).val("");
		}
	});
}
function submitCheck(ff){
	checkCustomize = function (){
		var jje = (ff.jfhj ? toNum(_C.v(ff.jfhj)) : 0);  //借方总金额
		var dje = (ff.dfhj ? toNum(_C.v(ff.dfhj)) : 0);  //贷方总金额
		if(jje != dje){
			alert("借、贷明细总金额不相等，请确认！");
			return false;
		}
		return true;
	 }
}
function getFous(fieldid){
	jQuery('#'+fieldid).focus();
}