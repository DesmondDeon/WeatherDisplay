const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];const preferredOrder=['meta','ctrl','alt','shift','cmd'];const preferredOrderReversed=['cmd','shift','alt','ctrl','meta'];const validSpecialKeys="fn|or|plus\
|backspace|tab|enter|shift|ctrl|cmd|alt|esc|capslock|space|pageup|pagedown|end|home|left|up|right|down\
|ins|del|option|meta|f1|f2|f3|f4|f5|f6|f7|f8|f9|f10|f11|f12|numpad\\d|numlock"
const otherKeys="a-z0-9\\.\\^\\-,;=`\\]\\[\\\\/\\*";const validKeysAndSyntaxPattern=new RegExp("^(["+otherKeys+"]|"+validSpecialKeys+"){1}([ +](["+otherKeys+"]|"+validSpecialKeys+"){1})*$");const browserPresetPattern=new RegExp("(ctrl|cmd)\\+(shift\\+)?(t$|n$|w$)|ctrl\\+f4");const systemReservedPattern=new RegExp("alt\\+(f4|tab)|cmd\\+q")
function keyIsModifier(key){key=key.toLowerCase()
return key==='shift'||key==='ctrl'||key==='control'||key==='alt'||key==='meta';}
function sortKeys(value){if(value.startsWith("\"")&&value.endsWith("\"")){return value;}
let splits=value.toLowerCase().replace(/\s*\+\s*/g,"+").replace(/\s+/g," ").trim().split(" ");for(i=0;i<splits.length;i++){let combination=splits[i];let keys=combination.split("+");keys.sort(function(a,b){return preferredOrderReversed.indexOf(b)-preferredOrderReversed.indexOf(a);});splits[i]=keys.join('+');}
let retval=splits.join(' ');return retval;}
function setUpCsrf(){var csrftoken=jQuery("[name=csrfmiddlewaretoken]").val();$.ajaxSetup({beforeSend:function(xhr,settings){if(!csrfSafeMethod(settings.type)&&!this.crossDomain){xhr.setRequestHeader("X-CSRFToken",csrftoken);}}});}
function splitKeys(input){let split=input.split(' or ');return split;}
function getSuperKeyLabel(){if(isMacOS()){return "Cmd";}else{return "Meta";}}
function extractModifiersAndKey(value){let modifiersString=""
let modifiersArray=[false,false,false,false]
let keys=value.split("+");if(keys.length===1){return[keys[0],modifiersArray,"nomod"]}
if(value.includes("ctrl")){modifiersString+="ctrl";modifiersArray[0]=true;}
if(value.includes("alt")){modifiersString+="alt";modifiersArray[1]=true;}
if(value.includes("shift")){modifiersString+="shift";modifiersArray[2]=true;}
if(value.includes("command")||value.includes("cmd")||value.includes("super")||value.includes("meta")){modifiersString+="cmd";modifiersArray[3]=true;}
return[keys[keys.length-1],modifiersArray,modifiersString];}
function extractModifiers(value){if(typeof value==='undefined'){return "";}
let retval=""
if(value.startsWith("\"")&&value.endsWith("\"")){return "Text Snippet"}else{if(value.includes("meta")){retval+="<kbd>meta</kbd> ";}
if(value.includes("ctrl")){retval+="<kbd>ctrl</kbd> ";}
if(value.includes("alt")){retval+="<kbd>alt</kbd> ";}
if(value.includes("shift")){retval+="<kbd>shift</kbd> ";}
if(value.includes("command")||value.includes("cmd")){retval+="<kbd>cmd</kbd> ";}}
if(retval===""){retval="None"}
return retval}
function escapeHtml(unsafe){return unsafe.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#039;");}
function addKbdTags(input){if(typeof input==='undefined'){return "";}
let replaced;if(input.startsWith("\"")&&input.endsWith("\"")){replaced=input.slice(1,-1);replaced=replaced.replaceAll('" or "',"</textsnippet>&nbsp;or<br><textsnippet>");replaced="<textsnippet>"+replaced+"</textsnippet>"}else{replaced=input.replace(/\+/g,"</kbd>&nbsp;+&nbsp;<kbd>");replaced=replaced.replace(/\s+or\s+/g,"</kbd>&nbsp;or<br><kbd>");replaced=replaced.replace(/[\s]+/g,"</kbd>&nbsp;<i class=\"mdi mdi-chevron-right inline-icon\" aria-hidden=\"true\"></i>&nbsp;<kbd>");replaced="<kbd>"+replaced+"</kbd>"}
return replaced;}
function isPrefixOfSnippet(combinationString,query){let splits=combinationString.split('" or "')
let retVal=false;for(const split of splits){if(split.startsWith(query)){retVal=true;break;}}
return retVal;}
function isEqualTextSnippet(combinationString,query){let splits=combinationString.split('" or "')
let retVal=false;for(const split of splits){if(split===query){retVal=true;break;}}
return retVal;}
function csrfSafeMethod(method){return(/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));}
function getCol(matrix,col){var column=[];for(var i=0;i<matrix.length;i++){column.push(matrix[i][col]);}
return column;}
function isElectron(){if(navigator.userAgent.indexOf("Electron")!=-1){return true;}
return false;}
function isMacOS(){if(navigator.appVersion.indexOf("Mac")!=-1){return true;}
return false;}
function truncateString(str,length){return str.length>length?str.substring(0,length-3)+'...':str}
function addToCopyDropdown(json){$("#addToCollectionDropdown").append(`
    <div class="dropdown-divider"></div>
    <a class="dropdown-item  copybutton" id="copyCombinationsBtn-`+json.id+`">`+
json.name+
`</a>`);}
function addToSideBar(json){$("#sideNavCollections").append(`
    <a href="`+"/collecting/collections/personal/"+json.id+`"/ data-toggle="tooltip"
           title="Go to personal collection"
           class="list-group-item list-group-item-action bg-light pl-4 pt-2 pb-2 border-0">`+
json.name+
`</a>`)}
function addToMoveDropdown(json){$("#moveToCollectionDropdown").append(`
    <div class="dropdown-divider"></div>
    <a class="dropdown-item  movebutton" id="moveCombinationsBtn-`+json.id+`">`+
json.name+
`</a>`);}
function addCollectedIcon(table,ids,collectionName){for(i=0;i<ids.length;i++){let row=table.row('#row'+ids[i]);let data=row.data();if(row.data()[0]===""||row.data()[0]==="None"){data[0]=collectionName.trim()}else{data[0]=row.data()[0]+", "+collectionName.trim()}
row.invalidate('data');}}
function isValidCombination(combination){if(combination.startsWith("\"")&&combination.endsWith("\"")){return true;}
if(systemReservedPattern.test(combination)){return false;}
if(!isElectron()&&browserPresetPattern.test(combination))
return false;return validKeysAndSyntaxPattern.test(combination);}
function addWarnIfInvalid(keyString){if(isValidCombination(keyString)){return "";}else{return ' <i title="This combination will not occur in practice, because it contains invalid keys or is reserved by your web browser." class="mdi mdi-alert-outline text-danger mdi-18px"></i>';}}
function collectingOperation(table,collectionBtn,newName,{hasMove=false,isMove=false,hasCollectedColumn=false}={}){if(!table.rows('.selected').any()){notification_app.makeToast(false,'warning','Warning','None selected');return;}
let idColumn=hasCollectedColumn?1:0;let idString=collectionBtn.id;let selectedCombinations=getCol(table.rows({selected:true}).data(),idColumn);let verb="Copied ";if(isMove){verb="Moved ";}
if(idString=="newCollectionBtn"){const errorCallBack=function(xhr,errmsg,err){notification_app.makeToast(false,'danger','Error',JSON.parse(xhr.responseText));};const successCallback=function(json){addToCopyDropdown(json);addToSideBar(json);if(hasMove){addToMoveDropdown(json);}
notification_app.makeToast(false,'success','Success','Created new collection ('+json.name+') with '+json['ids'].length+' selected combinations.');if(isMove){for(i=0;i<json['ids'].length;i++){table.row('#row'+json['ids'][i]).remove();}}
if(hasCollectedColumn){addCollectedIcon(table,json['ids'],newName)}
let pageNumber=table.page()
table.searchPanes.rebuildPane(undefined,true);table.page(pageNumber)
table.draw(false)
if(isMove){updatedMasteredCount(table);if(mapperApp){mapperApp.rebuild()}}};if(isMove){moveCombinationsToNewPersonal(newName,selectedCombinations,successCallback,errorCallBack);}else{addcombinationsToNewPersonal(newName,selectedCombinations,successCallback,errorCallBack);}}else{let collectionId=collectionBtn.id.split("-")[1]
var successCallback=function(json){notification_app.makeToast(false,'success','Success',verb+json['ids'].length+' key combination(s) to collection '+json.name+'.');if(isMove){for(i=0;i<json['ids'].length;i++){table.row('#row'+json['ids'][i]).remove();}}
if(hasCollectedColumn){addCollectedIcon(table,json['ids'],collectionBtn.innerText)}
let pageNumber=table.page()
table.searchPanes.rebuildPane(undefined,true);table.page(pageNumber)
table.draw(false)
if(isMove){updatedMasteredCount(table);if(mapperApp){mapperApp.rebuild()}}};var errorCallBack=function(xhr,errmsg,err){notification_app.makeToast(false,'danger','Error',JSON.parse(xhr.responseText));};if(isMove){moveCombinationsFromToPersonal(collectionId,selectedCombinations,successCallback,errorCallBack);}else{addcombinationsToPersonal(collectionId,selectedCombinations,successCallback,errorCallBack);}}}
function goToUrlWithConfirmation(url,message){const confirmed=confirm(message);if(!confirmed){return;}
window.location.href=url;};function removeCombinations(combinations,successCallback,errorCallback){setUpCsrf();$.ajax({url:"/collecting/combinations/remove_from_personal/",type:"POST",data:JSON.stringify({ids:combinations}),contentType:"application/json; charset=utf-8",dataType:"json",success:successCallback,error:errorCallback});}
async function hasCollected(combinations,successCallback,errorCallback){setUpCsrf();$.ajax({url:"/collecting/api/combinations/collected/",type:"POST",data:JSON.stringify({ids:combinations}),contentType:"application/json; charset=utf-8",dataType:"json",success:successCallback,error:errorCallback});}
function deleteTestRuns(testRunIds,successCallback,errorCallback){axios.defaults.xsrfCookieName='csrftoken';axios.defaults.xsrfHeaderName="X-CSRFTOKEN";axios.delete('/training/test-run/delete/',{data:testRunIds}).then(successCallback).catch(errorCallback);}
function addcombinationsToPersonal(collectionId,combinations,successCallback,errorCallback){setUpCsrf();$.ajax({url:"/collecting/combinations/"+collectionId+"/add-to-personal/",type:"POST",data:JSON.stringify({ids:combinations}),contentType:"application/json; charset=utf-8",dataType:"json",success:successCallback,error:errorCallback});};function addcombinationsToNewPersonal(name,combinations,successCallback,errorCallback){setUpCsrf();$.ajax({url:"/collecting/collections/new/"+name+"/",type:"POST",data:JSON.stringify({ids:combinations}),contentType:"application/json; charset=utf-8",dataType:"json",success:successCallback,error:errorCallback});};function moveCombinationsToNewPersonal(name,combinations,successCallback,errorCallback){setUpCsrf();$.ajax({url:"/collecting/collections/move/new/"+name+"/",type:"POST",data:JSON.stringify({ids:combinations}),contentType:"application/json; charset=utf-8",dataType:"json",success:successCallback,error:errorCallback});};function moveCombinationsFromToPersonal(collectionId,combinations,successCallback,errorCallback){setUpCsrf();$.ajax({url:"/collecting/combinations/"+collectionId+"/move_from_to_personal/",type:"POST",data:JSON.stringify({ids:combinations}),contentType:"application/json; charset=utf-8",dataType:"json",success:successCallback,error:errorCallback});};function createPracticeRunChart(plotData,ctx,useDescriptionTooltips,timeline=false){let learningResultsChart=new Chart(ctx,{type:'bar',data:{labels:plotData.labels,datasets:[{label:"Correct",backgroundColor:"#75c588",yAxisID:'A',data:plotData.num_correct,categoryPercentage:0.8,barPercentage:1,stack:0},{label:"With Hint",backgroundColor:"#c8ed8d",yAxisID:'A',categoryPercentage:0.8,barPercentage:1,data:plotData.num_correct_with_keys,stack:0},{label:"Skipped",backgroundColor:'#9a9a9a',yAxisID:'A',categoryPercentage:0.8,barPercentage:1,data:plotData.num_skipped,stack:1},{label:"Error",backgroundColor:"#ca7a7a",yAxisID:'A',categoryPercentage:0.8,barPercentage:1,data:plotData.num_error,stack:1},{label:"Average Time",backgroundColor:"#579cc7",yAxisID:'B',categoryPercentage:0.8,barPercentage:1,data:plotData.average_time,type:timeline?'line':'bar',borderColor:"#579cc7",fill:false,spanGaps:true,stack:2}]},options:{scales:{yAxes:[{id:'A',type:'linear',position:'left',stacked:'true',},{id:'B',type:'linear',position:'right',stacked:'true',}],xAxes:[{stacked:true,ticks:{callback:function(value){return truncateString(value,40)},}}],},tooltips:{callbacks:{...useDescriptionTooltips?{title:function(tooltipItem,data){return truncateString(plotData.description[tooltipItem[0].index],30)},}:{}}},onClick:function(e,data){let base=learningResultsChart.chartArea.bottom;let height=learningResultsChart.chart.height;let width=learningResultsChart.chart.scales['x-axis-0'].width;let offset=$(ctx).offset().top-$(window).scrollTop();if(e.pageY>base+offset){let count=learningResultsChart.scales['x-axis-0'].ticks.length;let padding_left=learningResultsChart.scales['x-axis-0'].paddingLeft;let padding_right=learningResultsChart.scales['x-axis-0'].paddingRight;let xwidth=(width-padding_left-padding_right)/count;let bar_index=(e.offsetX-padding_left-learningResultsChart.scales['A'].width)/xwidth;if(bar_index>0&bar_index<count){bar_index=Math.floor(bar_index);if(plotData.xAxisHref[bar_index]){window.location.href=plotData.xAxisHref[bar_index];}else{notification_app.makeToast(false,'danger','Error',"This combination is no longer in your collections, hence no further statistics are available for it.");}}}},onHover:function(e){let base=learningResultsChart.chartArea.bottom;let height=learningResultsChart.chart.height;let width=learningResultsChart.chart.scales['x-axis-0'].width;let yOffset=$(ctx).offset().top-$(window).scrollTop();let xOffset=$(ctx).offset().left-$(window).scrollLeft();let left=xOffset+learningResultsChart.scales['x-axis-0'].paddingLeft+learningResultsChart.scales['x-axis-0'].left;let right=xOffset+learningResultsChart.scales['x-axis-0'].paddingRight+learningResultsChart.scales['x-axis-0'].left+width;if(e.pageY>base+yOffset&&e.pageX>left&&e.pageX<right){e.target.style.cursor='pointer';}else{e.target.style.cursor='default';}},}});return learningResultsChart;}
(function($){var submitForm=function(modalForm){$(modalForm).submit();};var newForm=function(modalID,modalContent,modalForm,formURL,errorClass,submitBtn,callback=null){$(modalID).find(modalContent).load(formURL,function(){$(modalID).modal("show");$(modalForm).attr("action",formURL);addListeners(modalID,modalContent,modalForm,formURL,errorClass,$(".submit-btn"),callback);if($(".create-next-btn").length){addListeners(modalID,modalContent,modalForm,formURL,errorClass,$(".create-next-btn"),callback,true);}
if($(".create-as-new").length){formURL=$(".create-as-new").data("action");addListeners(modalID,modalContent,modalForm,$(".create-as-new").data("action"),errorClass,$(".create-as-new"),callback);}});};var addListeners=function(modalID,modalContent,modalForm,formURL,errorClass,submitBtn,callback,addNext=false){$(submitBtn).on("click",function(event){event.preventDefault();isFormValid(modalID,modalContent,modalForm,formURL,errorClass,submitBtn,submitForm,callback,addNext);});$(modalID).on('hidden.bs.modal',function(event){$(modalForm).remove();});};var isFormValid=function(modalID,modalContent,modalForm,formURL,errorClass,submitBtn,submitCallback,asyncCallback,addNext=false){$.ajax({type:'POST',url:formURL,data:$(modalForm).serialize(),beforeSend:function(){if(asyncCallback===null){$(submitBtn).prop("disabled",true);}},success:function(response){if($(response).find(errorClass).length>0){$(modalID).find(modalContent).html(response);$(modalForm).attr("action",formURL);addListeners(modalID,modalContent,modalForm,formURL,errorClass,submitBtn);}else{if(asyncCallback!==null){if(addNext){newForm(modalID,modalContent,modalForm,formURL,errorClass,submitBtn,asyncCallback);}else{$(modalID).modal("toggle");}
asyncCallback(response);}else{submitCallback(modalForm);}}},error:function(xhr,errmsg,err){notification_app.makeToast(false,'danger','Error',xhr.responseText);}});};$.fn.modalForm=function(options){var defaults={modalID:"#modal",modalContent:".modal-content",modalForm:".modal-content form",formURL:null,errorClass:".invalid",submitBtn:".submit-btn"};var settings=$.extend(defaults,options);return this.each(function(){$(this).click(function(event){newForm(settings.modalID,settings.modalContent,settings.modalForm,settings.formURL,settings.errorClass,settings.submitBtn);});});};$.fn.modalFormAsync=function(options){var defaults={modalID:"#modal",modalContent:".modal-content",modalForm:".modal-content form",formURL:null,errorClass:".invalid",submitBtn:".submit-btn"};var settings=$.extend(defaults,options);newForm(settings.modalID,settings.modalContent,settings.modalForm,settings.formURL,settings.errorClass,settings.submitBtn,options.callback);};}(jQuery));function getDefaultKeyMap(){return{'Backquote':'`','Digit1':'1','Digit2':'2','Digit3':'3','Digit4':'4','Digit5':'5','Digit6':'6','Digit7':'7','Digit8':'8','Digit9':'9','Digit0':'0','Minus':'-','Equal':'=','IntlYen':'\\','KeyQ':'q','KeyW':'w','KeyE':'e','KeyR':'r','KeyT':'t','KeyY':'y','KeyU':'u','KeyI':'i','KeyO':'o','KeyP':'p','BracketLeft':'[','BracketRight':']','Backslash':'\\','KeyA':'a','KeyS':'s','KeyD':'d','KeyF':'f','KeyG':'g','KeyH':'h','KeyJ':'j','KeyK':'k','KeyL':'l','Semicolon':':','Quote':"'",'IntlBackslash':'\\','KeyZ':'z','KeyX':'x','KeyC':'c','KeyV':'v','KeyB':'b','KeyN':'n','KeyM':'m','Comma':',','Period':'.','Slash':'/',}}
if(typeof navigator.keyboard=='undefined')(function(){var Keyboard=function(){return{getLayoutMap:function(){return new Promise((resolve,reject)=>{resolve(new Map(Object.entries(getDefaultKeyMap())))})},"layoutsNotSupported":true};};navigator.keyboard=new Keyboard();})();var table=undefined
jQuery.extend({highlight:function(node,re,nodeName,className){if(node.nodeType===3){var match=node.data.match(re);if(match){var highlight=document.createElement(nodeName||'span');highlight.className=className||'highlight';var wordNode=node.splitText(match.index);wordNode.splitText(match[0].length);var wordClone=wordNode.cloneNode(true);highlight.appendChild(wordClone);wordNode.parentNode.replaceChild(highlight,wordNode);return 1;}}else if((node.nodeType===1&&node.childNodes)&&!/(script|style)/i.test(node.tagName)&&!(node.tagName===nodeName.toUpperCase()&&node.className===className)){for(var i=0;i<node.childNodes.length;i++){i+=jQuery.highlight(node.childNodes[i],re,nodeName,className);}}
return 0;}});jQuery.fn.unhighlight=function(options){var settings={className:'highlight',element:'span'};jQuery.extend(settings,options);return this.find(settings.element+"."+settings.className).each(function(){var parent=this.parentNode;parent.replaceChild(this.firstChild,this);parent.normalize();}).end();};jQuery.fn.highlight=function(words,options){var settings={className:'highlight',element:'span',caseSensitive:false,wordsOnly:false};jQuery.extend(settings,options);if(words.constructor===String){words=[words];}
words=jQuery.grep(words,function(word,i){return word!='';});words=jQuery.map(words,function(word,i){return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");});if(words.length==0){return this;}
var flag=settings.caseSensitive?"":"i";var pattern="("+words.join("|")+")";if(settings.wordsOnly){pattern="\\b"+pattern+"\\b";}
var re=new RegExp(pattern,flag);return this.each(function(){jQuery.highlight(this,re,settings.element,settings.className);});};(function(window,document,$){function highlight(body,table){body.unhighlight();if(table.rows({filter:'applied'}).data().length){table.columns().every(function(){var column=this;column.nodes().flatten().to$().unhighlight({className:'column_highlight'});column.nodes().flatten().to$().highlight($.trim(column.search()).split(/\s+/),{className:'column_highlight'});});body.highlight($.trim(table.search()).split(/\s+/));}}
$(document).on('init.dt.dth',function(e,settings,json){if(e.namespace!=='dt'){return;}
var table=new $.fn.dataTable.Api(settings);var body=$(table.table().body());if($(table.table().node()).hasClass('searchHighlight')||settings.oInit.searchHighlight||$.fn.dataTable.defaults.searchHighlight){table.on('draw.dt.dth column-visibility.dt.dth column-reorder.dt.dth',function(){highlight(body,table);}).on('destroy',function(){table.off('draw.dt.dth column-visibility.dt.dth column-reorder.dt.dth');});if(table.search()){highlight(body,table);}}});})(window,document,jQuery);const collectionTableDom=`<'row d-flex' <'col flex-grow-1' <'row'<'col-auto'l><'col-auto ml-auto'f>>
                            <'row'<'col-sm-6'B> <'col-sm-6 text-right' <\"toolbar\">>  >
                            <'row'<'col-md-12' tr>>
                            <'row '<'col-sm-5'i><'col-sm-7'p>>>  <'col flex-grow-0' P> >`
const languageSettings={searchPanes:{emptyPanes:"Not enough data for filtering panes"}}
const exportbuttons={extend:'collection',text:'Export',buttons:[{exportOptions:{columns:':visible',orthogonal:'filter',}},{extend:'excel',exportOptions:{columns:':visible',orthogonal:'filter',}},{extend:'csv',exportOptions:{columns:':visible',orthogonal:'filter',}},{extend:'pdf',exportOptions:{columns:':visible',orthogonal:'filter',}},{extend:'print',exportOptions:{columns:':visible',orthogonal:'filter',}},]}
const noSubscriptionExportButton={extend:'collection',enabled:false,text:'Export',attr:{title:'Export of collections is only possible with a Pro subscription. Please check the features page for more information.',}};function postInitCombinationDataTable(table,tableNode,personal=false){tableNode.selectable({distance:10,filter:"tr",selected:function(e,ui){if(!e.ctrlKey){table.rows({selected:true}).deselect()}
table.rows('.ui-selected').select();},stop:function(e){$(this).find(".ui-selected").removeClass("ui-selected");}});table.on('deselect',function(e,dt,type,indexes){if(!table.rows('.selected').any()){$(".selectionActionButton").prop('disabled',true);}else{$(".selectionActionButton").prop('disabled',false);}
$("#selectedcount").html(table.rows({selected:true}).count());});table.on('select',function(e,dt,type,indexes){if(!table.rows('.selected').any()){$(".selectionActionButton").prop('disabled',true);}else{$(".selectionActionButton").prop('disabled',false);}
$("#selectedcount").html(table.rows({selected:true}).count());});Mousetrap.bind('mod+a',function(e){table.rows().select();e.preventDefault();});Mousetrap.bind('mod+shift+a',function(e){table.rows().deselect();e.preventDefault();});Mousetrap.bind('shift+c',function(e){e.preventDefault();e.stopPropagation();$("#copybtn").click();});if(personal){Mousetrap.bind('shift+del',function(e){e.preventDefault();e.stopPropagation();$("#removeset").click();});Mousetrap.bind('shift+n',function(e){e.preventDefault();e.stopPropagation();$(".create-keycombination").click();});Mousetrap.bind('shift+m',function(e){$("#movebtn").click();});}
$('.table-responsive').on('show.bs.dropdown',function(){$('.table-responsive').css("overflow","inherit");});$('.table-responsive').on('hide.bs.dropdown',function(){$('.table-responsive').css("overflow","auto");})}
function prepareDataTable(){$.fn.dataTable.ext.type.order['key-combination-pre']=function(data){if(data==="Text Snippet"){return 0;}else if(data==="None"){return 1;}
let strippedString=data.replace(/(<([^>]+)>)/gi,"");let splits=strippedString.split(" ");let modifierPosition=0;for(i=0;i<splits.length;i++){modifierPosition+=preferredOrder.indexOf(splits[i])}
return 10*splits.length+modifierPosition;};}
function initTableColumnSearch(table){$('#table tfoot th').each(function(){let title=$(this).text();if(title){$(this).html('<input type="text" class="form-control" placeholder="Search '+title+'" />');}});table.columns().every(function(){let that=this;$('input',this.footer()).on('keyup change clear',function(){if(that.search()!==this.value){that.search(this.value).draw();}});});}
const selectMode={style:window.matchMedia("(pointer: coarse)").matches?'multi+shift':'os'}
const basicTableButtons=[{extend:'colvis',text:'<i class="mdi mdi-eye-outline" aria-hidden="true"></i>',attr:{title:'Column Visibility',}},{extend:'selectAll',text:'<i class="mdi mdi-select-all" aria-hidden="true"></i>',attr:{title:'Select All | Ctrl/Cmd + A',}},{extend:'selectNone',text:'<i class="mdi mdi-select-off" aria-hidden="true"></i>',attr:{title:'Clear Selection | Ctrl/Cmd + Shift + A',}}];function initCollectionTable(has_subscription,isAuthenticated,mac,winlinux){let primaryKeyColumn=mac?4:3;let modifierColumn=7;let contextColumn=5;let categoryColumn=6;let searchPaneColumns=[0,6,7];let buttonsArray=[visualizerButton,basicTableButtons,has_subscription?exportbuttons:noSubscriptionExportButton]
let tableConfig={searchHighlight:true,language:languageSettings,iDisplayLength:25,dom:collectionTableDom,select:selectMode,searchPanes:createSearchPaneSettings(searchPaneColumns),buttons:{dom:{button:{tag:'button',className:'btn btn-outline-primary'}},buttons:buttonsArray},"order":[[1,"asc"]],"columnDefs":[{"targets":0,"searchable":isAuthenticated,visible:isAuthenticated,"type":"html","width":"20px","render":{"display":function(data,type,row,meta){let retVal="";if(data===""||data==="None"){retVal="";}else if(data.startsWith("<i")){return data;}else{retVal='<i title="'+data+'" class="mdi mdi-playlist-check collected-icon"></i>'}
return retVal;},"sort":function(data,type,row,meta){let retVal="";if(data===""||data==="None"){retVal="Not Collected";}else if(data.startsWith("<i")){return "<i  class='mdi mdi-playlist-check collected-icon'></i> Collected";}else{retVal="<i  class='mdi mdi-playlist-check collected-icon'></i> Collected"}
return retVal;},},searchPanes:{header:'Collected',orthogonal:'sort',type:'html',dtOpts:{searching:false,order:[[0,'asc']]},},},{"targets":[1,contextColumn],"visible":false,"searchable":false},{"targets":3,"type":"html",className:"keysColumn","visible":winlinux,"searchable":winlinux,"render":{"display":function(data,type,row,meta){return addKbdTags(data);},"filter":function(data,type,row,meta){return data;}}},{"targets":4,"type":"html","visible":mac,"searchable":mac,className:"keysColumn","render":{"display":function(data,type,row,meta){return addKbdTags(data);},"filter":function(data,type,row,meta){return data;}}},{"targets":categoryColumn,"visible":false,},{"targets":modifierColumn,"visible":false,"searchable":false,"data":function(data,type,row,meta){return extractModifiers(data[primaryKeyColumn]);},"type":"key-combination",searchPanes:{header:'Modifiers',dtOpts:{searching:false,order:[[0,'asc']]},},},],"initComplete":function(settings,json){$("#table_length > label").append(' | <span id="selectedcount">0</span> selected');document.getElementById("tablerow").style.visibility='visible';$("#table").data("keyRetrieval",primaryKeyColumn)
initVisualKeyboard();let table=settings.oInstance.api();$(".system-switcher").removeClass("active")
if(table.column(4).visible()&&!table.column(3).visible()){$("#chooseMac").addClass("active")
primaryKeyColumn=4;}else if(table.column(3).visible()&&!table.column(4).visible()){$("#chooseWindows").addClass("active")
primaryKeyColumn=3;}else if(table.column(3).visible()&&table.column(4).visible()){$("#chooseAll").addClass("active")}},};if(typeof tableConfigMods!=="undefined"){Object.assign(tableConfig,tableConfigMods)}
return $('#table').DataTable(tableConfig);}
function updatedMasteredCount(table){let masteredCount=table.column("confidence:name").data().filter(function(value,index){return value>2;}).length;$("#masterednumber").html(masteredCount);$("#totalnumber").html(table.rows().count());}
function createGroupByButton(columnIndex,columnName,rowGroupColumns){return{text:columnName,attr:{id:columnName+'groupByBtn'},action:function(e,dt,node,config){$(node).toggleClass('active');if($(node).hasClass("active")){rowGroupColumns.push(columnIndex)}else{const index=rowGroupColumns.indexOf(columnIndex);if(index>-1){rowGroupColumns.splice(index,1);}}
if(rowGroupColumns.length>0){dt.rowGroup().dataSrc(rowGroupColumns);dt.rowGroup().enable().draw(false);}else{dt.rowGroup().dataSrc(rowGroupColumns);dt.rowGroup().enable(false).draw(false);}}}}
function createSearchPaneSettings(searchPaneColumns){return{layout:'columns-1',columns:searchPaneColumns,dataLength:80,cascadePanes:true,threshold:10,dtOpts:{searching:false,},}}
const combinationDataIndices={Context:4,Category:5,Collection:8,Module:8,Lesson:9,}
function initAjaxSourcedCollectionTable(tableConfigMods,combinationTableConfig){let primaryKeyColumn=combinationTableConfig.showMac?3:2;let rowGroupColumns=[];let enableVisualizer=combinationTableConfig.hasSubscription||combinationTableConfig.enableVisualizer;let buttonsArray=[visualizerButton,basicTableButtons,{extend:'collection',text:'Group by',attr:{title:'Visually group rows by context and/or category',},buttons:combinationTableConfig.rowGroupColumnNames.map(columnName=>{return createGroupByButton(combinationDataIndices[columnName],columnName,rowGroupColumns)})},]
if(combinationTableConfig.hasSubscription){buttonsArray.push(exportbuttons);}else{buttonsArray.push(noSubscriptionExportButton);}
let tableConfig={searchHighlight:true,language:languageSettings,iDisplayLength:25,dom:collectionTableDom,select:selectMode,"ajax":{"url":combinationTableConfig.ajaxUrl,"dataSrc":""},searchPanes:createSearchPaneSettings(combinationTableConfig.searchPaneColumns),buttons:{dom:{button:{tag:'button',className:'btn btn-outline-primary'}},buttons:buttonsArray},rowGroup:{enable:false},stateSave:true,stateDuration:0,stateSaveParams:function(settings,data){data["group"]=rowGroupColumns;data.search.search="";data.searchPanes=[];for(i=0;i<data.columns.length;i++){data.columns[i].search.search="";}},"stateLoaded":function(settings,data){rowGroupColumns=data["group"];},"initComplete":function(settings,json){$("#table_length > label").append(' | <span id="selectedcount">0</span> selected');document.getElementById("tablerow").style.visibility='visible';if(rowGroupColumns.length>0){settings.oInstance.api().rowGroup().dataSrc(rowGroupColumns);settings.oInstance.api().rowGroup().enable().draw(false);}
let table=settings.oInstance.api()
if(combinationTableConfig.updateMasteredCount){updatedMasteredCount(table);}
if(enableVisualizer){$("#table").data("keyRetrieval",primaryKeyColumn)
initVisualKeyboard();}},rowId:function(data){return 'row'+data[0];},}
if(typeof tableConfigMods!=="undefined"){Object.assign(tableConfig,tableConfigMods)}
return $('#table').DataTable(tableConfig);}
function removeSelectedCombinations(table){let selectedCombinations=getCol(table.rows({selected:true}).data(),0);if(selectedCombinations.length===0){notification_app.makeToast(false,'warning','Warning','None selected');return;}else{let confirmed=confirm("Do you really want to delete "+selectedCombinations.length+" selected combinations? This cannot be undone.")
if(!confirmed){return;}}
let successCallback=function(json){let numRemoved=json['num_processed'];notification_app.makeToast(false,'success','Success','Removed '+numRemoved+' combination(s) from personal collection.');for(i=0;i<json['ids'].length;i++){table.row('#row'+json['ids'][i]).remove();}
rebuildSearchpanes(table)
updatedMasteredCount(table);$(".selectionActionButton").prop('disabled',true);if(mapperApp){mapperApp.rebuild();}};let errorCallBack=function(xhr,errmsg,err){notification_app.makeToast(false,'error','Error','Failed to delete combination(s).');};removeCombinations(selectedCombinations,successCallback,errorCallBack);}
function removeSelectedTestRuns(table){let selectedPracticeRuns=getCol(table.rows({selected:true}).data(),0);if(selectedPracticeRuns.length===0){notification_app.makeToast(false,'warning','Warning','None selected');return;}else{const confirmed=confirm(`Do you really want to delete ${selectedPracticeRuns.length} selected practice runs? This cannot be undone. Deleted practice runs are gone forever and will no longer be considered for confidence values.`);if(!confirmed){return;}}
var successCallback=function(response){for(i=0;i<response.data.deleted_ids.length;i++){table.row('#row'+response.data.deleted_ids[i]).remove();}
table.draw();$(".selectionActionButton").prop('disabled',true);notification_app.makeToast(false,'success','Success',response.data.message);};var errorCallBack=function(error){alert(error);};deleteTestRuns(selectedPracticeRuns,successCallback,errorCallBack);}
function rebuildSearchpanes(table){let page=table.page();table.searchPanes.rebuildPane(undefined,true);table.page(page).draw('page');}
function collectionOperationCallback(responseData){let data;let row;if(responseData.created){data=new Array(8)
data[0]=responseData.id;}else{row=table.row('#row'+responseData.id);data=row.data();}
data[1]=responseData.description;data[2]=responseData.keys;data[3]=responseData.mac_keys
data[4]=responseData.context;data[5]=responseData.category;if(responseData.created){data[6]=0}
if(responseData.created){table.row.add(data).node().id='row'+responseData.id;rebuildSearchpanes(table);notification_app.makeToast(false,'success','Success','Added key combination! ('+responseData.description+')');}else{row.data(data);rebuildSearchpanes(table);notification_app.makeToast(false,'success','Success','Updated key combination! ('+responseData.description+')');}
if(mapperApp){mapperApp.rebuild()}}
function addBulkEditButtonHandlers(){$(document).on('click','#bulkEditSelectedButton',function(){if(!table.rows('.selected').any()){notification_app.makeToast(false,'warning','Warning','None selected');return;}
let selectedCombinations=getCol(table.rows({selected:true}).data(),0);$(this).modalFormAsync({formURL:"/collecting/combinations/"+selectedCombinations.join('-')+"/bulk/edit/",callback:(responseData)=>{for(i=0;i<responseData['ids'].length;i++){let row=table.row('#row'+responseData['ids'][i]);let data=row.data();if(responseData['updatedContext']){data[4]=responseData.context;}
if(responseData['updatedCategory']){data[5]=responseData.category;}
row.data(data);}
table.draw(false).searchPanes.rebuildPane(undefined,true);notification_app.makeToast(false,'success','Success',`Updated ${responseData['num_processed']} combinations.`);},});});}
function addPracticeSelectedButtonHandlers(){$(document).on("click","#practiceSelectedButton",function(){if(!table.rows('.selected').any()){notification_app.makeToast(false,'warning','Warning','None selected');return;}
let selectedCombinations=getCol(table.rows({selected:true}).data(),0);window.location.href='/training/practice/selection/'+selectedCombinations.join('-')+"/";});Mousetrap.bind('shift+alt+p',function(e){e.preventDefault();e.stopPropagation();$("#practiceSelectedButton").click();});}
function addRemoveSetButtonHandlers(){$(document).on("click","#removeset",function(){removeSelectedCombinations(table)});}
function addEditCombinationHandlers(){$('#table').on('click','.edit-combination',function(){$(this).modalFormAsync({formURL:"/collecting/combinations/"+$(this).data('id')+"/edit/",callback:collectionOperationCallback,});});}
function createColumns(columnCreationConfig){let primaryKeyColumn=columnCreationConfig.showMacColumn?3:2;let columns=[{"data":0,"title":"ID","visible":false},{"data":1,"title":"Description",},{"data":2,"title":"Keys","type":"html","className":"keysColumn","visible":columnCreationConfig.showWinLinuxColumn,"searchable":columnCreationConfig.showWinLinuxColumn,"render":{"display":function(data,type,row,meta){return addKbdTags(data)+addWarnIfInvalid(data);}},},{"data":3,"type":"html","title":"Keys (macOS)","visible":columnCreationConfig.showMacColumn,"searchable":columnCreationConfig.showMacColumn,"className":"keysColumn","render":{"display":function(data,type,row,meta){return addKbdTags(data)+addWarnIfInvalid(data);},}}]
if(columnCreationConfig.includeContext){columns.push({"title":"Context","data":4,});}
if(columnCreationConfig.includeCategory){columns.push({"title":"Category","data":5,});}
if(columnCreationConfig.includeLesson){columns.push({"data":9,"title":"Lesson"});}
if(columnCreationConfig.includeCollection){columns.push({"data":8,"title":"Collection"});}else if(columnCreationConfig.includeModule){columns.push({"data":8,"title":"Module","className":"text-right",});}
columns.push({"title":"Modifiers","targets":4,"visible":false,"searchable":false,"data":function(data,type,row,meta){return extractModifiers(data[primaryKeyColumn]);},"type":"key-combination",searchPanes:{header:'Modifiers',dtOpts:{searching:false,order:[[0,'asc']]},},})
if(columnCreationConfig.includeConfidence){columns.push({"data":6,"type":"num","name":"confidence","title":"Conf.","width":"40px",className:"text-right","createdCell":function(td,cellData,rowData,row,col){if(cellData>2){$(td).addClass("table-success")}else if(cellData<0){$(td).addClass("table-danger")}},});}
if(columnCreationConfig.includeActions){columns.push({"data":function(data,type,row,meta){let retVal="";if(!columnCreationConfig.hasPersonalFlagPerCombination||data[10]){retVal+=`<button type="button" class="edit-combination icon-button btn-xs" data-toggle="tooltip"
                        title="Edit Key Combination"
                        data-id="${data[0]}">
                  <i class="mdi mdi-square-edit-outline" aria-hidden="true"></i>
                </button>`;}
if(data[7]>0){retVal+=`<a type="button"
                     href='/collecting/combination-statistics/${data[0]}/'
                     class="icon-button btn-xs" style="color: inherit" data-toggle="tooltip"
                     title="Statistics (${data[7]} stats)">
                    <i class="mdi mdi-chart-bar"></i>
                  </a>`}
return retVal;},"targets":columns.length,"width":"60px","title":"Actions","type":"html",},);}
return columns;}
function initAjaxSourcedCollectionPage(addToolbar,tableConfigMods,combinationTableConfig){$(document).ready(function(){function initTable(table,toolbar=null){addToolbar(toolbar);postInitCombinationDataTable(table,$("#table"),combinationTableConfig.isPersonal);}
prepareDataTable();table=initAjaxSourcedCollectionTable(tableConfigMods,combinationTableConfig);initTable(table);});}
var notification_app=new Vue({el:'#notifications',data:{dismissSecs:1000,dismissCountDown:0,showDismissibleAlert:false,toastCount:0,},methods:{makeToast(append=false,variant=null,title,text){this.toastCount++
this.$bvToast.toast(text,{title:title,autoHideDelay:10000,variant:variant,appendToast:append,})}}})
var mapperApp=undefined
var keyboardMap;function escapeRegExp(string){return string.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function getLabelForKeyBoard(char){let upperChar=char.toUpperCase();return upperChar.length===1?upperChar:char;}
function getKeyFromMap(code){if(keyboardMap){let retVal=keyboardMap.get(code);if(retVal){return retVal}else{return code;}}else{return code;}}
const visualizerButton={text:' <i class="mdi mdi-keyboard-variant"></i>',attr:{title:'Show/Hide Collection Visualizer (Virtual Keyboard)',id:'toggleKeyboardButton'},action:function(e,dt,node,config){if(mapperApp){mapperApp.toggleVisibility();}else{notification_app.makeToast(false,'warning','Pro required','Upgrade to a Pro subscription to visualize personal collections and lessons via a virtual keyboard. '+
'For shared collections, only the owner needs a subscription.');}}}
function initVisualKeyboard(){if(mapperApp){return;}
mapperApp=new Vue({delimiters:['[[',']]'],el:'#keyboardVisualizer',data:{showMapper:!sessionStorage.getItem('personalKeyboardHidden')&&window.innerWidth>1200,forceDisplay:false},methods:{rebuild:function(){let child=this.$refs.keyboard;if(this.showMapper){if(child){child.refreshTableData();}}},silentHide:function(){this.showMapper=false;},toggleVisibility:function(){this.forceDisplay=true;this.showMapper=!this.showMapper;if(this.showMapper){sessionStorage.removeItem('personalKeyboardHidden');}else{sessionStorage.setItem('personalKeyboardHidden',true);}}},watch:{showMapper(value){if(!value){this.$refs.keyboard.clearTableFilter();}}}})}
Vue.component('kbdBtn',{delimiters:['[[',']]'],props:['item','itemKey'],template:`
        <button v-bind:class="[$parent.computeClass(item), {'hascombos': item.combinations.length > 0 }, {'filterbutton': itemKey === $parent.tableFilterKey}]"
                v-on:click="$parent.filter(itemKey);">
            <span class="label" v-html="item.label"></span><span
                v-bind:class="['conflict-label', {'text-danger': $parent.hasConflict(item)}]">[[item.combinations.length]]</span>
            <div class="keyitems" style="display: block;">
                <div v-for="combination in item.combinations" class="shortcut"
                     v-show="$parent.showCombination(combination)">
                    [[combination.description]]
                </div>
                <div class="conflict-shortcut align-middle">
                    Conflict
                </div>
            </div>
        </button>
    `})
Vue.component('kbdBtn2',{delimiters:['[[',']]'],props:['keyCode'],computed:{item(){return this.$parent.items[getKeyFromMap(this.keyCode)];}},template:`
        <button v-bind:class="[$parent.computeClass(item), {'hascombos': item.combinations.length > 0 }, {'filterbutton': item.label === $parent.tableFilterKey}]"
                v-on:click="$parent.filter(item.label);">
            <span class="label" v-html="item.label"></span><span
                v-bind:class="['conflict-label', {'text-danger': $parent.hasConflict(item)}]">[[item.combinations.length]]</span>
            <div class="keyitems" style="display: block;">
                <div v-for="combination in item.combinations" class="shortcut"
                     v-show="$parent.showCombination(combination)">
                    [[combination.description]]
                </div>
                <div class="conflict-shortcut align-middle">
                    Conflict
                </div>
            </div>
        </button>
    `})
Vue.component('modifierBtn',{delimiters:['[[',']]'],props:['item','itemKey'],template:`
        <button v-bind:class="[{'mod-active': $parent.$data[itemKey]}, 'mod-' + itemKey, $parent.computeClassMod(item)]"
                v-on:click="$parent.$data[itemKey]= !$parent.$data[itemKey]">
            <span class="label" v-html="item.label"></span><span
                v-bind:class="['conflict-label', {'text-danger': $parent.hasConflict(item)}]">[[item.combinations.length]]</span>
            <div class="keyitems" style="display: block;">
                <div v-for="combination in item.combinations" class="shortcut"
                     v-show="$parent.showCombination(combination)">
                    [[combination.description]]
                </div>
                <div class="conflict-shortcut text-danger align-middle">
                    Conflict
                </div>
            </div>
        </button>
    `})
function initialItemsState(){let items={"esc":{label:"Esc",modCombos:new Map(),combinations:[]},"f1":{label:"F1",modCombos:new Map(),combinations:[]},"f2":{label:"F2",modCombos:new Map(),combinations:[]},"f3":{label:"F3",modCombos:new Map(),combinations:[]},"f4":{label:"F4",modCombos:new Map(),combinations:[]},"f5":{label:"F5",modCombos:new Map(),combinations:[]},"f6":{label:"F6",modCombos:new Map(),combinations:[]},"f7":{label:"F7",modCombos:new Map(),combinations:[]},"f8":{label:"F8",modCombos:new Map(),combinations:[]},"f9":{label:"F9",modCombos:new Map(),combinations:[]},"f10":{label:"F10",modCombos:new Map(),combinations:[]},"f11":{label:"F11",modCombos:new Map(),combinations:[]},"f12":{label:"F12",modCombos:new Map(),combinations:[]},"tab":{label:"&#8677;",modCombos:new Map(),combinations:[]},"capslock":{label:"&#8682;",modCombos:new Map(),combinations:[]},"enter":{label:"&crarr;",modCombos:new Map(),combinations:[]},"ctrl":{label:"Ctrl",modCombos:new Map(),combinations:[]},"cmd":{label:getSuperKeyLabel(),modCombos:new Map(),combinations:[]},"alt":{label:"Alt",modCombos:new Map(),combinations:[]},"shift":{label:"&#8679;",modCombos:new Map(),combinations:[]},"space":{label:"Space",modCombos:new Map(),combinations:[]},"up":{label:"&uarr;",modCombos:new Map(),combinations:[]},"right":{label:"&rarr;",modCombos:new Map(),combinations:[]},"down":{label:"&darr;",modCombos:new Map(),combinations:[]},"left":{label:"&larr;",modCombos:new Map(),combinations:[]},"home":{label:"Home",modCombos:new Map(),combinations:[]},"end":{label:"End",modCombos:new Map(),combinations:[]},"pageup":{label:"Page &uarr;",modCombos:new Map(),combinations:[]},"pagedown":{label:"Page &darr;",modCombos:new Map(),combinations:[]},"del":{label:"Del",modCombos:new Map(),combinations:[]},"ins":{label:"Ins",modCombos:new Map(),combinations:[]},"backspace":{label:"&larr;",modCombos:new Map(),combinations:[]},}
keyboardMap.forEach((value,key,map)=>{items[value]={label:getLabelForKeyBoard(value),modCombos:new Map(),combinations:[]}});return items;}
Vue.component('keyboard',{delimiters:['[[',']]'],props:['descriptionColumn','forceDisplay'],data:function(){return{controlsActive:false,tableFilterKey:null,considerFilter:false,ctrl:false,alt:false,shift:false,cmd:false,numSequences:0,keyColumn:3,numTextSnippets:0,numCombinations:0,numInvalidKeys:0,useDefaultLayout:false,keyMap:undefined,customLayout:undefined,items:undefined}},created(){document.addEventListener('focusin',this.focusIn)
document.addEventListener('focusout',this.focusOut)},beforeDestroy(){document.removeEventListener('focusin',this.focusIn)
document.removeEventListener('focusout',this.focusOut)},computed:{modifierString:function(){let retval="";if(this.ctrl){retval+="ctrl";}
if(this.alt){retval+="alt";}
if(this.shift){retval+="shift";}
if(this.cmd){retval+="cmd";}
if(retval===""){retval="nomod";}
return retval;}},mounted:function(){navigator.keyboard.getLayoutMap().then(keyboardLayoutMap=>{if(keyboardLayoutMap.size>0){keyboardMap=keyboardLayoutMap;}else{keyboardMap=new Map(Object.entries(getDefaultKeyMap()));}
this.useDefaultLayout=navigator.keyboard.layoutsNotSupported;this.items=initialItemsState();this.processTableData();})},methods:{refreshTableData:function(){this.items=initialItemsState();this.numCombinations=0;this.numSequences=0;this.numInvalidKeys=0;this.numTextSnippets=0;this.processTableData();},processTableData:function(){this.keyColumn=$("#table").data("keyRetrieval")
let modifierCounts=new Map()
let vueInstance=this;let searchQuery={}
if(this.considerFilter){searchQuery.search='applied';}
table.rows(searchQuery).every(function(rowIdx,tableLoop,rowLoop){let data=this.data();let description=data[vueInstance.descriptionColumn];let keys=data[vueInstance.keyColumn]
if(keys.startsWith("\"")&&keys.endsWith("\"")){vueInstance.numTextSnippets+=1;return;}
let splits=splitKeys(keys)
for(let combinationSplitIndex=0;combinationSplitIndex<splits.length;combinationSplitIndex++){if(splits[combinationSplitIndex].includes(" ")){vueInstance.numSequences+=1;continue;}
let modifiersAndKey=extractModifiersAndKey(splits[combinationSplitIndex]);let itemsKey=modifiersAndKey[0].replace("plus","+");if(vueInstance.items.hasOwnProperty(itemsKey)){vueInstance.items[itemsKey].combinations.push({description:description,modifiers:modifiersAndKey[1]})
let entry=modifierCounts.get(modifiersAndKey[2])
if(typeof entry==='undefined'){modifierCounts.set(modifiersAndKey[2],1)}else{modifierCounts.set(modifiersAndKey[2],entry+1)}
vueInstance.numCombinations+=1;vueInstance.items[itemsKey].modCombos.set(modifiersAndKey[2],vueInstance.items[itemsKey].modCombos.has(modifiersAndKey[2]))}else{vueInstance.numInvalidKeys+=1;}}})
if(modifierCounts.size>0){let mostFrequentEntry=[...modifierCounts.entries()].reduce((a,e)=>e[1]>a[1]?e:a)[0]
this.ctrl=false;this.alt=false;this.shift=false
this.cmd=false
if(mostFrequentEntry.includes("ctrl")){this.ctrl=true;}
if(mostFrequentEntry.includes("alt")){this.alt=true}
if(mostFrequentEntry.includes("shift")){this.shift=true}
if(mostFrequentEntry.includes("cmd")){this.cmd=true}}
if(!this.forceDisplay&&this.numCombinations<1){this.$emit('hide');}},showCombination:function(combination){if(typeof combination.modifiers==='undefined'){return false;}
return combination.modifiers[0]===this.ctrl&&combination.modifiers[1]===this.alt&&combination.modifiers[2]===this.shift&&combination.modifiers[3]===this.cmd;},hasConflict:function(item){for(let value of item.modCombos.values()){if(value){return true;}}},clearTableFilter:function(){$('#table').DataTable().column(this.keyColumn).search('').draw()
this.tableFilterKey=null;},visualizeCurrentRows:function(){this.considerFilter=true;this.refreshTableData();},visualizeAllRows:function(){this.considerFilter=false;this.refreshTableData();},toggleLayoutDetection:function(){if(navigator.keyboard.layoutsNotSupported){notification_app.makeToast(false,'warning','Not supported','System keyboard layout detection is only supported with KeyCombiner Desktop and Chromium-based Browsers (Chrome, Edge, Vivaldi). Unfortunately, your browser does not provide the required API.');return;}
this.useDefaultLayout=!this.useDefaultLayout
if(this.useDefaultLayout){this.customLayout=keyboardMap;keyboardMap=new Map(Object.entries(getDefaultKeyMap()));}else{keyboardMap=this.customLayout;}
this.refreshTableData();},focusIn(event){this.controlsActive=true;},gainFocus(event){document.getElementById("ShiftLeft").focus();},focusOut(event){this.controlsActive=false;},userKeyDown:function(event){button=document.getElementById(event.code);if(button!=null){event.preventDefault();button.click();}},computeClassMod:function(item){if(this.ctrl||this.alt||this.shift||this.cmd){return "";}
let mapVal=item.modCombos.get("nomod");if(mapVal===undefined){return "none";}else{if(mapVal){return "nomod activebtn conflict"}else{return "nomod activebtn";}}},computeClass:function(item){let modifiersString=this.modifierString;let mapVal=item.modCombos.get(modifiersString);if(mapVal===undefined){return "none";}else{if(mapVal){return modifiersString+" conflict activebtn"}else{return modifiersString+" activebtn";}}},filter:function(itemKey){if(this.tableFilterKey===itemKey){this.clearTableFilter();return;}
this.tableFilterKey=itemKey;$('#table').DataTable().column(this.keyColumn).search('(^|[+ ])'+escapeRegExp(itemKey.toLowerCase().replace('+','plus'))+'( or|$)',true,false,false).draw();},},template:`
            <div class="row mb-3">
                <div class="col-lg-auto col-md-12 order-lg-2 m-lg-auto">
                    <div class="row">
                        <div id="keyboard" v-if="items" class="mapper" v-on:keydown="userKeyDown">
                            <div class="kbdrow">
                                <kbdBtn itemKey="esc" v-bind:item="items['esc']"></kbdBtn>
                                <div style="width: 40px" class="spacer-key"></div>
                                <kbdBtn itemKey="f1" v-bind:item="items['f1']"></kbdBtn>
                                <kbdBtn itemKey="f2" v-bind:item="items['f2']"></kbdBtn>
                                <kbdBtn itemKey="f3" v-bind:item="items['f3']"></kbdBtn>
                                <kbdBtn itemKey="f4" v-bind:item="items['f4']"></kbdBtn>
                                <div class="spacer-small"></div>
                                <kbdBtn itemKey="f5" v-bind:item="items['f5']"></kbdBtn>
                                <kbdBtn itemKey="f6" v-bind:item="items['f6']"></kbdBtn>
                                <kbdBtn itemKey="f7" v-bind:item="items['f7']"></kbdBtn>
                                <kbdBtn itemKey="f8" v-bind:item="items['f8']"></kbdBtn>
                                <div class="spacer-small"></div>
                                <kbdBtn itemKey="f9" v-bind:item="items['f9']"></kbdBtn>
                                <kbdBtn itemKey="f10" v-bind:item="items['f10']"></kbdBtn>
                                <kbdBtn itemKey="f11" v-bind:item="items['f11']"></kbdBtn>
                                <kbdBtn itemKey="f12" v-bind:item="items['f12']"></kbdBtn>
                            </div>
                            <div class="kbdrow">
                                <div class="spacer-small"></div>
                            </div>
                            <div class="kbdrow">
                                <kbdBtn2 v-bind:keyCode="'Backquote'">\`</kbdBtn2>
                                <kbdBtn2 v-bind:keyCode="'Digit1'">1</kbdBtn2>
                                <kbdBtn2 v-bind:keyCode="'Digit2'">2</kbdBtn2>
                                <kbdBtn2 v-bind:keyCode="'Digit3'">3</kbdBtn2>
                                <kbdBtn2 v-bind:keyCode="'Digit4'">4</kbdBtn2>
                                <kbdBtn2 v-bind:keyCode="'Digit5'">5</kbdBtn2>
                                <kbdBtn2 v-bind:keyCode="'Digit6'">6</kbdBtn2>
                                <kbdBtn2 v-bind:keyCode="'Digit7'">7</kbdBtn2>
                                <kbdBtn2 v-bind:keyCode="'Digit8'">8</kbdBtn2>
                                <kbdBtn2 v-bind:keyCode="'Digit9'">9</kbdBtn2>
                                <kbdBtn2 v-bind:keyCode="'Digit0'">0</kbdBtn2>
                                <kbdBtn2 v-bind:keyCode="'Minus'">-</kbdBtn2>
                                <kbdBtn2 v-bind:keyCode="'Equal'">=</kbdBtn2>
                                <kbdBtn style="width: 90px" itemKey="backspace"
                                        v-bind:item="items['backspace']"></kbdBtn>
                                <div class="spacer-small"></div>
                                <kbdBtn v-bind:itemKey="'ins'" v-bind:item="items['ins']"></kbdBtn>
                                <kbdBtn v-bind:itemKey="'home'" v-bind:item="items['home']"></kbdBtn>
                                <kbdBtn v-bind:itemKey="'pageup'" v-bind:item="items['pageup']"></kbdBtn>

                            </div>
                            <div class="kbdrow">
                                <div class="kbdcol">
                                    <div class="kbdrow">
                                        <kbdBtn v-bind:itemKey="'tab'" style="width: 72px"
                                                v-bind:item="items['tab']"></kbdBtn>
                                        <kbdBtn2 v-bind:keyCode="'KeyQ'">Q</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyW'">W</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyE'">E</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyR'">R</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyT'">T</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyY'">Y</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyU'">U</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyI'">I</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyO'">O</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyP'"></kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'BracketLeft'"></kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'BracketRight'"></kbdBtn2>
                                        <kbdBtn2 style="width: 70px" v-bind:keyCode="'Backslash'"></kbdBtn2>
                                        <div class="spacer-small"></div>
                                        <kbdBtn v-bind:itemKey="'del'" v-bind:item="items['del']"></kbdBtn>
                                        <kbdBtn v-bind:itemKey="'end'" v-bind:item="items['end']"></kbdBtn>
                                        <kbdBtn v-bind:itemKey="'pagedown'" v-bind:item="items['pagedown']"></kbdBtn>
                                    </div>
                                    <div class="kbdrow">
                                        <kbdBtn style="width: 88px" itemKey="capslock"
                                                v-bind:item="items['capslock']"></kbdBtn>
                                        <kbdBtn2 v-bind:keyCode="'KeyA'">A</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyS'">S</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyD'">D</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyF'">F</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyG'">G</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyH'">H</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyJ'">J</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyK'">K</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyL'">L</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'Semicolon'">;</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'Quote'">'</kbdBtn2>
                                        <kbdBtn itemKey="enter" v-bind:item="items['enter']"
                                                style="width: 109px"></kbdBtn>
                                        <div class="spacer-small"></div>
                                        <div class="spacer-key"></div>
                                        <div class="spacer-key"></div>
                                        <div class="spacer-key"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="kbdrow">
                                <div class="kbdcol">
                                    <div class="kbdrow">
                                        <modifierBtn id="ShiftLeft" style="width: 71px" itemKey="shift"
                                                     v-bind:item="items['shift']"></modifierBtn>
                                        <kbdBtn2 v-bind:keyCode="'IntlBackslash'">|</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyZ'">Z</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyX'">X</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyC'">C</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyV'">V</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyB'">B</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyN'">N</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'KeyM'">M</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'Comma'">,</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'Period'">.</kbdBtn2>
                                        <kbdBtn2 v-bind:keyCode="'Slash'">/</kbdBtn2>
                                        <modifierBtn id="ShiftRight" style="width: 126px" itemKey="shift"
                                                     v-bind:item="items['shift']"></modifierBtn>

                                        <div class="spacer-small"></div>
                                        <div class="spacer-key"></div>
                                        <kbdBtn itemKey="up" v-bind:item="items['up']"></kbdBtn>
                                        <div class="spacer-key"></div>
                                    </div>

                                    <div class="kbdrow">
                                        <modifierBtn id="ControlLeft" style="width: 82px" itemKey="ctrl"
                                                     v-bind:item="items['ctrl']"></modifierBtn>
                                        <template v-if="isMacOS()">
                                            <modifierBtn id="AltLeft" style="width: 68px" itemKey="alt"
                                                         v-bind:item="items['alt']"></modifierBtn>
                                            <modifierBtn id="MetaLeft" style="width: 68px" itemKey="cmd"
                                                         v-bind:item="items['cmd']"></modifierBtn>
                                        </template>
                                        <template v-else>
                                            <modifierBtn id="MetaLeft" style="width: 68px" itemKey="cmd"
                                                         v-bind:item="items['cmd']"></modifierBtn>
                                            <modifierBtn id="AltLeft" style="width: 68px" itemKey="alt"
                                                         v-bind:item="items['alt']"></modifierBtn>
                                        </template>
                                        <kbdBtn itemKey="space" style="width: 306px"
                                                v-bind:item="items['space']"></kbdBtn>


                                        <template v-if="isMacOS()">
                                            <modifierBtn id="MetaRight" style="width: 68px" itemKey="cmd"
                                                         v-bind:item="items['cmd']"></modifierBtn>
                                            <modifierBtn id="AltRight" style="width: 68px" itemKey="alt"
                                                         v-bind:item="items['alt']"></modifierBtn>
                                        </template>
                                        <template v-else>
                                            <modifierBtn id="AltRight" style="width: 68px" itemKey="alt"
                                                         v-bind:item="items['alt']"></modifierBtn>
                                            <modifierBtn id="MetaRight" style="width: 68px" itemKey="cmd"
                                                         v-bind:item="items['cmd']"></modifierBtn>
                                        </template>


                                        <button id="ContextMenu"></button>
                                        <modifierBtn id="ControlRight" style="width: 72px" itemKey="ctrl"
                                                     v-bind:item="items['ctrl']"></modifierBtn>
                                        <div class="spacer-small"></div>
                                        <kbdBtn v-bind:itemKey="'left'" v-bind:item="items['left']"></kbdBtn>
                                        <kbdBtn v-bind:itemKey="'down'" v-bind:item="items['down']"></kbdBtn>
                                        <kbdBtn v-bind:itemKey="'right'" v-bind:item="items['right']"></kbdBtn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2 mb-3">
                        <button v-show="controlsActive" class="btn btn-outline-primary btn-sm mr-2"
                                style="width: 120px"
                                title="While the keyboard is in focus, you can press modifier keys to active them."
                                v-on:click="document.activeElement.blur()">Lose Focus
                        </button>
                        <button v-show="!controlsActive" v-on:click="gainFocus()"
                                class="btn btn-outline-primary btn-sm mr-2"
                                style="width: 120px"
                                title="While the keyboard is in focus, you can press modifier keys to active them.">
                            Gain Focus
                        </button>
                        <button style="width: 120px"
                                class="btn btn-outline-primary btn-sm mr-2"
                                v-bind:title="useDefaultLayout ? 'Detect and use system layout' : 'Use default layout instead of detected system layout'"
                                v-on:click="toggleLayoutDetection()">
                            [[ useDefaultLayout ? 'System Layout' : 'Default Layout' ]]
                        </button>
                        <button class="btn btn-outline-primary btn-sm mr-2" style="width: 40px"
                                v-on:click="visualizeCurrentRows()"
                                title="Visualize the rows that are currently visible in the collection table.">
                            <i class="mdi mdi-filter" aria-hidden="true"></i>
                        </button>
                        <button class="btn btn-outline-primary btn-sm mr-4" style="width: 40px"
                                v-on:click="visualizeAllRows()" title="Visualize entire collection.">
                            <i class="mdi mdi-filter-remove" aria-hidden="true"></i>
                        </button>
                        <span class="small align-middle">Mapped [[numCombinations]] combinations. Skipped [[numSequences]] sequences, [[numTextSnippets]] text snippets, and [[numInvalidKeys]] invalid keys.</span>
                    </div>
                </div>
            </div>
        `})
Vue.component('publicbrowser',{delimiters:['[[',']]'],props:['categoryData'],data:function(){return{search:''}},computed:{filteredList(){let retVal=[]
for(const[categoryName,collections]of Object.entries(this.categoryData)){for(let j=0;j<collections.length;j++){if(collections[j].title.toLowerCase().includes(this.search.toLowerCase())){retVal.push(collections[j])}}}
return retVal;}},template:`
            <div class="mt-4">
                <div class="mt-4">
                    <div class="input-group">
                        <input type="text" class="form-control" v-model="search"
                               placeholder="Search for a collection...">
                        <div class="input-group-append">
                            <button v-on:click="search = ''" class="btn btn-outline-primary" type="button">X</button>
                        </div>
                    </div>
                </div>
                <div v-if="search === ''" class="category">
                    <div v-for="(collections, key) in categoryData">
                        <div class="row mt-5">
                            <h2>[[ key ]]</h2>
                        </div>
                        <div class="row mt-3 justify-content-center justify-content-md-start">
                            <div class="col-auto mb-3" v-for="collection in collections">
                                <div class="card" style="width: 11rem; height: 10rem;">
                                    <div class="text-center">
                                        <img class="card-img-top"
                                             style="padding: 10%; height: 100px; width: auto;"
                                             v-bind:src="collection.img"
                                             v-bind:alt="collection.title + ' logo'">
                                    </div>
                                    <div class="card-body px-1 align-items-center d-flex justify-content-center">
                                        <a v-bind:href="collection.link" class="stretched-link"><h5
                                                class="card-title text-center">[[collection.title]]</h5></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="row mt-5 justify-content-center justify-content-md-start">
                    <div class="col-auto mb-3" v-for="collection in filteredList">
                        <div class="card" style="width: 11rem; height: 10rem;">
                            <div class="text-center">
                                <img class="card-img-top" style="padding: 10%; height: 100px; width: auto;"
                                     v-bind:src="collection.img"
                                     v-bind:alt="collection.title + ' logo'">
                            </div>
                            <div class="card-body px-1 align-items-center d-flex justify-content-center">
                                <a v-bind:href="collection.link" class="stretched-link"><h5
                                        class="card-title text-center">[[collection.title]]</h5></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-auto" v-if="filteredList.length ===0">
                        <h2>No Results</h2>
                        <p class="lead">If you feel like we should add a collection for <i>[[search]]</i>, please <a
                                href="mailto:support@keycombiner.com">drop us a line</a> and we will add your vote.</p>
                    </div>
                </div>
            </div>
        `})
Vue.component('trainingKbdBtn',{delimiters:['[[',']]'],props:['itemKey'],template:`
        <button v-bind:id="itemKey">[[keyboardMap.get(itemKey)]]</button>
    `})
const keyDisplayMode={show:1,showWithDelay:2,hide:4,};const errorHandlingMode={ignore:1,goToNext:2,stayAndCountError:4,};const combinationResult={correct:1,skipped:2,error:4,};function randomInteger(arrayToPick,softExclude=-1){let retVal=0;for(let i=0;i<3;i++){let index=Math.floor(Math.random()*arrayToPick.length);retVal=arrayToPick[index];if(retVal!==softExclude){return retVal;}}
return retVal;}
Vue.component('trainer',{delimiters:['[[',']]'],data:function(){return{currentlyDisplayed:[{absoluteIndexDisplayed:0,cssClass:"active-combination-card",keysVisible:false,innerborderclass:'inner-active-combination-card'},{absoluteIndexDisplayed:1,cssClass:"inactive-combination-card",keysVisible:false,innerborderclass:'inner-inactive-combination-card'},{absoluteIndexDisplayed:2,cssClass:"inactive-combination-card",keysVisible:false,innerborderclass:'inner-inactive-combination-card'},{absoluteIndexDisplayed:3,cssClass:"inactive-combination-card",keysVisible:false,innerborderclass:'inner-inactive-combination-card'},],keyMap:false,config:training_config,origTime:training_config.time,absoluteIndex:0,key_string:"",input_text:"",mousetrap_training_instance:null,mousetrap_preventer_instance:null,default_key_handle_preventer:null,default_key_handle_trainer:null,hasCurrentError:false,training_combinations:key_combinations,combosTypedWithError:[],combosConfidenceChanged:[],total_score:0,updatedMasteredCount:"n/A",total_with_hints:0,total_skipped:0,averageOfAverages:0,total_error:0,current_start_time:null,timeInterval:null,previousLastkeyErrorAllowed:true,previousLastKey:"",keysVisible:false,currentIsTextSnippet:false,finished:false,savedStatistics:false,testRunUrl:"",orderedIndices:[],selected:'',previousSequenceLevel:0,arrayToPick:[],}},watch:{finished:{handler:function(val,oldVal){this.completed();this.buildPlot();setTimeout(()=>{this.$refs.restartButton.focus();},500);},},'config.keyDetectionMode'(newVal){this.mousetrap_preventer_instance.setKeyDetectionMode(newVal);this.mousetrap_training_instance.setKeyDetectionMode(newVal);}},methods:{buildPlot:function(){let plotData={labels:[],num_correct:[],num_error:[],num_skipped:[],num_correct_with_keys:[],average_time:[],description:[],xAxisHref:[]}
let comboLength=this.training_combinations.length;for(i=0;i<comboLength;i++){if(this.training_combinations[i]['num_correct']+this.training_combinations[i]['num_correct_with_keys']+this.training_combinations[i]['num_error']+this.training_combinations[i]['num_skipped']<1){continue;}
plotData.labels.push(this.training_combinations[i]['description']);plotData.num_correct.push(this.training_combinations[i]['num_correct']);plotData.num_error.push(this.training_combinations[i]['num_error']);if(this.training_combinations[i]['num_error']>0){this.combosTypedWithError.push({description:this.training_combinations[i]['description'],keys:this.training_combinations[i]['keys'],id:this.training_combinations[i]['id']})}
plotData.num_skipped.push(this.training_combinations[i]['num_skipped']);plotData.num_correct_with_keys.push(this.training_combinations[i]['num_correct_with_keys']);plotData.average_time.push(this.training_combinations[i]['elapsed_time'].reduce((a,b)=>a+b,0)/this.training_combinations[i]['elapsed_time'].length);plotData.description.push(this.training_combinations[i]['keys']);plotData.xAxisHref.push("/collecting/combination-statistics/"+this.training_combinations[i]['id']+"/");createPracticeRunChart(plotData,document.getElementById('learningResultsChart'),true);}},computeAverageOfAverages:function(){let averages=[]
for(i=0;i<this.training_combinations.length;i++){if(this.training_combinations[i]['elapsed_time']&&this.training_combinations[i]['elapsed_time'].length>0){averages.push(this.training_combinations[i]['elapsed_time'].reduce((a,b)=>a+b,0)/this.training_combinations[i]['elapsed_time'].length);}}
if(averages.length>0){this.averageOfAverages=Math.round((averages.reduce((a,b)=>a+b,0)/averages.length)/100)/10}else{this.averageOfAverages=0;}},addElapsedTime:function(){if((this.total_score+this.total_with_hints)<=1){return;}
var endTime=new Date();var timeDiff=endTime-this.current_start_time;this.training_combinations[this.orderedIndices[this.absoluteIndex]]['elapsed_time'].push(timeDiff);this.computeAverageOfAverages();},updateComboArrayById:function(id,data,array,removeIfInvalid=false){const arrayIndex=array.findIndex(x=>x.id===id);let arrayElement=array[arrayIndex];if(isMacOS()){arrayElement.keys=data.mac_keys;}else{arrayElement.keys=data.keys;}
if(removeIfInvalid&&!isValidCombination(arrayElement.keys)){array.splice(arrayIndex,1)}else{arrayElement.description=data.description;}},editCombination:function(combination){$(document).modalFormAsync({formURL:`/collecting/combinations/${combination.id}/edit/limited/`,callback:(data)=>{this.updateComboArrayById(combination.id,data,key_combinations,true);this.updateComboArrayById(combination.id,data,this.combosTypedWithError);this.updateComboArrayById(combination.id,data,this.combosConfidenceChanged);},});},gameOver:function(){this.finished=true;this.mousetrap_preventer_instance.handleKey=this.default_key_handle_preventer;this.mousetrap_training_instance.reset();let buttons=document.querySelectorAll("#keyboard button");for(let i=0;i<buttons.length;i++){buttons[i].className='';}
Mousetrap.bind(splitKeys(this.training_combinations[this.orderedIndices[this.absoluteIndex]].keys),function(e,combo){e.preventDefault();e.stopPropagation();});if(!this.config.autosave){return;}
axios.defaults.xsrfCookieName='csrftoken';axios.defaults.xsrfHeaderName="X-CSRFTOKEN";let dataToSend=[]
for(i=0;i<this.training_combinations.length;i++){if(this.training_combinations[i]["num_correct"]>0||this.training_combinations[i]["num_correct_with_keys"]>0||this.training_combinations[i]["num_error"]>0||this.training_combinations[i]["num_skipped"]>0){dataToSend.push(this.training_combinations[i])}}
axios.post('/training/test-run/new/',{data:dataToSend}).then((response)=>{let tempArray=response["data"]["confidence_change_combinations"];tempArray.sort(function(a,b){return Math.abs(b["old_confidence"]-b["new_confidence"])-Math.abs(a["old_confidence"]-a["new_confidence"]);});let netDiff=response["data"]["net_diff"];window.masteredCount=window.masteredCount+netDiff;this.updatedMasteredCount=window.masteredCount+" / "+this.training_combinations.length;if(netDiff>0){this.updatedMasteredCount+=" (+"+netDiff+")"}else if(netDiff<0){this.updatedMasteredCount+=" ("+netDiff+")"}
this.combosConfidenceChanged=tempArray.slice(0,8)
this.savedStatistics=true;this.testRunUrl="/training/test-run/"+response['data']['test_run_id']+"/";notification_app.makeToast(false,'success','Success',response['data']['message']);if(training_config.lesson){axios.get(`/training/api/lesson/update/${training_config.lesson}/`).then(response=>{if(response['data']['status']==='newly_mastered'){notification_app.makeToast(false,'success','Lesson Mastered',response['data']['message']);}else{notification_app.makeToast(false,'secondary','Info',response['data']['message']);}});}}).catch(function(error){notification_app.makeToast(false,'danger','Error',error.response['data']);});},updateTime:function(){this.config.time--;if(this.config.time===0){clearInterval(this.timeInterval);this.gameOver();}},combinationClass:function(combination){if(combination.new_confidence>combination.old_confidence){return "successbackground"}else{return "errorbackground"}},goToNextCombination:function(unbind=true,previousResult=combinationResult.correct){if(this.timeInterval==null&&this.config.time>0){this.timeInterval=setInterval(this.updateTime,1000);}
if(unbind){this.mousetrap_training_instance.reset();this.mousetrap_training_instance.handleKey=this.default_key_handle_trainer;}
this.previousSequenceLevel=0;this.previousLastkeyErrorAllowed=true;this.previousLastKey=this.training_combinations[this.orderedIndices[this.absoluteIndex]].keys;this.input_text='';if(this.absoluteIndex===this.currentlyDisplayed[3].absoluteIndexDisplayed){this.currentlyDisplayed[3].keysVisible=true;this.currentlyDisplayed[0].absoluteIndexDisplayed=this.absoluteIndex+1;this.currentlyDisplayed[1].absoluteIndexDisplayed=this.absoluteIndex+2;this.currentlyDisplayed[2].absoluteIndexDisplayed=this.absoluteIndex+3;this.currentlyDisplayed[0].cssClass="active-combination-card";this.currentlyDisplayed[1].cssClass="inactive-combination-card";this.currentlyDisplayed[2].cssClass="inactive-combination-card";this.currentlyDisplayed[0].innerborderclass="inner-active-combination-card";this.currentlyDisplayed[1].innerborderclass="inner-inactive-combination-card";this.currentlyDisplayed[2].innerborderclass="inner-inactive-combination-card";this.currentlyDisplayed[0].wrongkeys="";this.currentlyDisplayed[1].wrongkeys="";this.currentlyDisplayed[2].wrongkeys="";let currentLast=this.currentlyDisplayed[3];if(previousResult===combinationResult.error){currentLast.cssClass="error-combination-card"
currentLast.innerborderclass="inner-error-combination-card"}else if(previousResult===combinationResult.skipped){currentLast.cssClass="skipped-combination-card"
currentLast.innerborderclass="inner-skipped-combination-card"}else{currentLast.cssClass="correct-combination-card"
currentLast.innerborderclass="inner-correct-combination-card"}
if(this.config.keyDisplayMode==keyDisplayMode.show){this.currentlyDisplayed[0].keysVisible=true;this.currentlyDisplayed[1].keysVisible=true;this.currentlyDisplayed[2].keysVisible=true;}else if(this.config.keyDisplayMode==keyDisplayMode.showWithDelay){this.currentlyDisplayed[0].keysVisible=false;this.currentlyDisplayed[1].keysVisible=false;this.currentlyDisplayed[2].keysVisible=false;const currentAbsolut=this.currentlyDisplayed[0].absoluteIndexDisplayed;setTimeout(()=>{this.currentlyDisplayed[0].keysVisible=this.currentlyDisplayed[0].keysVisible||this.currentlyDisplayed[0].absoluteIndexDisplayed===currentAbsolut;},this.config.keyDisplaydelay)}else{this.currentlyDisplayed[0].keysVisible=false;this.currentlyDisplayed[1].keysVisible=false;this.currentlyDisplayed[2].keysVisible=false;}}else{if(this.absoluteIndex==this.currentlyDisplayed[0].absoluteIndexDisplayed){this.currentlyDisplayed[3].absoluteIndexDisplayed=this.absoluteIndex+3;this.currentlyDisplayed[3].cssClass="inactive-combination-card";this.currentlyDisplayed[3].wrongkeys="";this.currentlyDisplayed[3].innerborderclass="inner-inactive-combination-card";this.currentlyDisplayed[3].keysVisible=this.config.keyDisplayMode==keyDisplayMode.show;}
for(var i=0;i<3;i++){if(this.absoluteIndex==this.currentlyDisplayed[i].absoluteIndexDisplayed){this.currentlyDisplayed[i+1].cssClass="active-combination-card"
this.currentlyDisplayed[i+1].innerborderclass="inner-active-combination-card"
if(this.config.keyDisplayMode==keyDisplayMode.showWithDelay){this.currentlyDisplayed[i+1].keysVisible=false;let nextIndex=i+1;let currentAbsolut=this.currentlyDisplayed[nextIndex].absoluteIndexDisplayed;setTimeout(()=>{this.currentlyDisplayed[nextIndex].keysVisible=this.currentlyDisplayed[nextIndex].keysVisible||this.currentlyDisplayed[nextIndex].absoluteIndexDisplayed===currentAbsolut;},this.config.keyDisplaydelay)}else{this.currentlyDisplayed[i+1].keysVisible=false;}
this.currentlyDisplayed[i].keysVisible=true;if(previousResult==combinationResult.error){this.currentlyDisplayed[i].cssClass="error-combination-card"
this.currentlyDisplayed[i].innerborderclass="inner-error-combination-card"}else if(previousResult==combinationResult.skipped){this.currentlyDisplayed[i].cssClass="skipped-combination-card"
this.currentlyDisplayed[i].innerborderclass="inner-skipped-combination-card"}else{this.currentlyDisplayed[i].cssClass="correct-combination-card"
this.currentlyDisplayed[i].innerborderclass="inner-correct-combination-card"}}}}
this.orderedIndices.push(randomInteger(this.arrayToPick,this.orderedIndices[this.orderedIndices.length-1]));++this.absoluteIndex;this.key_string=addKbdTags(this.training_combinations[this.orderedIndices[this.absoluteIndex]].keys)
this.bindNextCombination();},handleSuccessFulCombination:function(){if(this.currentlyDisplayed[this.getCurrentDisplayIndex()].keysVisible||this.config.keyDisplayMode==1){this.training_combinations[this.orderedIndices[this.absoluteIndex]]['num_correct_with_keys']++;this.total_with_hints++;}else{this.training_combinations[this.orderedIndices[this.absoluteIndex]]['num_correct']++;this.total_score++;this.addElapsedTime();}},addError:function(){this.training_combinations[this.orderedIndices[this.absoluteIndex]]['num_error']++;this.total_error++;},getCombinationByAbsolute:function(absoluteIndex){if(this.orderedIndices.length==0){return "";}
let n=this.training_combinations.length;let retVal=this.training_combinations[this.orderedIndices[absoluteIndex]]
return retVal;},getKeysByAbsolute:function(absoluteIndex){if(this.orderedIndices.length==0){return "";}
let n=this.training_combinations.length;let retVal=addKbdTags(this.training_combinations[this.orderedIndices[absoluteIndex]].keys)
return retVal;},prettifyKeys:function(keys){if(typeof keys=='undefined'){return '';}
if(keys==""){return keys;}
let retVal=addKbdTags(keys)
return retVal;},prettifyKeysErr:function(keys){if(typeof keys=='undefined'){return '';}
if(keys==""){return keys;}
let retVal=addKbdTags(keys)
return retVal;},getCurrentDisplayIndex:function(){for(var i=0;i<4;i++){if(this.absoluteIndex==this.currentlyDisplayed[i].absoluteIndexDisplayed){return i;}}
return 0;},isSequence:function(combinationString){if(combinationString.replace(/\s+or\s+/g,"+").includes(" ")){return true;}else{return false;}},outOfOrder:function(combinationString,character){let retVal=false;if(this.isSequence(combinationString)){let currentLevel=Object.values(this.mousetrap_training_instance.getSequenceLevels())[0];if(currentLevel<=0&&(this.previousSequenceLevel>0)){retVal=true;}
this.previousSequenceLevel=currentLevel;}
return retVal;},prevent:function(doPrevent){this.input_text='';var preventfor=this.training_combinations[this.orderedIndices[this.absoluteIndex]].keys;if(doPrevent){this.mousetrap_preventer_instance.handleKey=(character,modifiers,e)=>{if(e.defaultPrevented){return;}
let button=null;if(!e.repeat){if(e['type']=='keydown'){button=document.getElementById(e.code)
if(button!=null){button.classList.add("activebutton");}}}
if(e['type']==='keydown'){if(!e.repeat){let currentChars=preventfor.split(/[ +]+/);let characterToWorkWith=character
let currentPressedKeys=modifiers.filter(item=>item!==characterToWorkWith)
currentPressedKeys.push(characterToWorkWith)
if(isMacOS()){let currentCharIndex=currentChars.indexOf("meta");while(currentCharIndex>-1){currentChars[currentCharIndex]="cmd";currentCharIndex=currentChars.indexOf("meta");}
let currentPressedIndex=currentPressedKeys.indexOf("meta");while(currentPressedIndex>-1){currentPressedKeys[currentPressedIndex]="cmd";currentPressedIndex=currentPressedKeys.indexOf("meta");}
characterToWorkWith=character.replace(/meta/g,"cmd");}
this.input_text=currentPressedKeys.join('+').trim();if(this.config.keyDetectionMode=='CH'&&(characterToWorkWith=="shift"||characterToWorkWith=="altgraph")){}else if(!currentChars.includes(characterToWorkWith)||this.outOfOrder(preventfor,characterToWorkWith)){if(button!=null){button.classList.add("wrongbutton");}
if(this.config.errorHandlingMode===errorHandlingMode.stayAndCountError){if(this.currentlyDisplayed[this.getCurrentDisplayIndex()].cssClass!=="active-combination-card-error"){this.addError();}
this.currentlyDisplayed[this.getCurrentDisplayIndex()].cssClass="active-combination-card-error";this.currentlyDisplayed[this.getCurrentDisplayIndex()].keysVisible=true;this.currentlyDisplayed[this.getCurrentDisplayIndex()].wrongkeys=this.input_text;}else if(this.config.errorHandlingMode===errorHandlingMode.goToNext){this.currentlyDisplayed[this.getCurrentDisplayIndex()].wrongkeys=this.input_text;this.addError();this.goToNextCombination(true,combinationResult.error);}}else{if(button!=null){button.classList.add("correctbutton");}}}
e.preventDefault();e.stopPropagation();}
if(e['type']==='keyup'){this.input_text="";}};}else{this.mousetrap_preventer_instance.handleKey=this.default_key_handle_preventer;}},bindNextCombination:function(setFocus=true){this.current_start_time=new Date();let combinationString=this.training_combinations[this.orderedIndices[this.absoluteIndex]].keys;if(combinationString.startsWith("\"")&&combinationString.endsWith("\"")){this.prevent(false);this.currentIsTextSnippet=true;if(setFocus&&typeof this.$refs.input!=="undefined"){this.$nextTick(()=>this.$refs.input.focus());}
combinationString=combinationString.substring(1,combinationString.length-1);this.mousetrap_training_instance.handleKey=(character,modifiers,e)=>{let button=null;if(!e.repeat){if(e['type']==='keydown'&&character!=="esc"){button=document.getElementById(e.code)
if(button!=null){button.classList.add("activebutton");}
if(!keyIsModifier(e.key)&&e.key!=="AltGraph"){if(isPrefixOfSnippet(combinationString,this.input_text+e.key)){button.classList.add("correctbutton");}else{button.classList.add("wrongbutton");}}}}
if(e['type']==='keyup'){if(isPrefixOfSnippet(combinationString,this.input_text)){if(isEqualTextSnippet(combinationString,this.input_text)){this.hasCurrentError=false;this.mousetrap_training_instance.handleKey=this.default_key_handle_trainer;this.handleSuccessFulCombination();this.goToNextCombination(false,combinationResult.correct);}}else{if(!this.hasCurrentError){this.addError();}
this.hasCurrentError=true;this.currentlyDisplayed[this.getCurrentDisplayIndex()].cssClass="active-combination-card-error";this.currentlyDisplayed[this.getCurrentDisplayIndex()].keysVisible=true;}}};}else{this.currentIsTextSnippet=false;if(setFocus&&typeof this.$refs.input!=="undefined"){this.$nextTick(()=>this.$refs.input.focus());}
this.mousetrap_training_instance.bind(splitKeys(this.training_combinations[this.orderedIndices[this.absoluteIndex]].keys),(e,combo)=>{button=document.getElementById(e.code)
if(button!=null){button.classList.add("activebutton");button.classList.add("correctbutton");}
e.preventDefault();e.stopPropagation();this.handleSuccessFulCombination();this.goToNextCombination(true,combinationResult.correct);this.input_text="";},'keydown');this.prevent(true)}
this.input_text='';},keyupButton:function(event){if(isMacOS()&&(event.code==="MetaRight"||event.code==="MetaLeft")){setTimeout(()=>{let buttons=document.querySelectorAll("#keyboard button:not([id^=Meta])");for(let i=0;i<buttons.length;i++){buttons[i].className='';}},100)}
button=document.getElementById(event.code)
if(button!=null){button.classList.remove("activebutton");button.classList.remove("correctbutton");button.classList.remove("wrongbutton");}},skip:function(){this.training_combinations[this.orderedIndices[this.absoluteIndex]]['num_skipped']++;this.total_skipped++;this.goToNextCombination(true,combinationResult.skipped);},refresh:function(){clearInterval(this.timeInterval);this.timeInterval=null;this.config.time=this.origTime;this.$emit('refresh',true);},completed:function(){this.$emit('completed',true);},},mounted:function(){if(this.training_combinations.length===0){location.reload();}
navigator.keyboard.getLayoutMap().then(keyboardLayoutMap=>{keyboardMap=keyboardLayoutMap;this.keyMap=true;})
let numberUnlearned=0;let total_mastered=0
for(i=0;i<this.training_combinations.length;i++){this.training_combinations[i]['elapsed_time']=[];this.training_combinations[i]['num_correct']=0;this.training_combinations[i]['num_correct_with_keys']=0;this.training_combinations[i]['num_error']=0;this.training_combinations[i]['num_skipped']=0;let confidence=this.training_combinations[i]['confidence_value'];if(confidence>2){total_mastered=total_mastered+1;}
if(!this.config.isTest){if(confidence==null||confidence<1){if(numberUnlearned++<16){for(let j=0;j<6;j++)this.arrayToPick.push(i);}}else if(confidence<2){for(let j=0;j<3;j++)this.arrayToPick.push(i);}else if(confidence<4){for(let j=0;j<2;j++)this.arrayToPick.push(i);}else{this.arrayToPick.push(i);}}else{this.arrayToPick.push(i);}}
if(typeof window.masteredCount==='undefined'){window.masteredCount=total_mastered;}
this.orderedIndices.push(randomInteger(this.arrayToPick));this.orderedIndices.push(randomInteger(this.arrayToPick,this.orderedIndices[this.orderedIndices.length-1]));this.orderedIndices.push(randomInteger(this.arrayToPick,this.orderedIndices[this.orderedIndices.length-1]));this.orderedIndices.push(randomInteger(this.arrayToPick,this.orderedIndices[this.orderedIndices.length-1]));this.orderedIndices.push(randomInteger(this.arrayToPick,this.orderedIndices[this.orderedIndices.length-1]));Mousetrap(this.$refs.outer).bind('esc',(e)=>{if(this.training_combinations[this.orderedIndices[this.absoluteIndex]].keys.includes("esc")){return true;}
e.preventDefault();e.stopPropagation();this.skip();},'keydown');Mousetrap(this.$refs.outer).bind('mod+shift+r',(e)=>{let currentKeys=this.training_combinations[this.orderedIndices[this.absoluteIndex]].keys;if(currentKeys.includes("ctrl+shift+r")||currentKeys.includes("cmd+shift+r")||currentKeys.includes("mod+shift+r")){return true;}
e.preventDefault();e.stopPropagation();this.refresh();},'keydown');this.mousetrap_preventer_instance=new Mousetrap(this.$refs.outer);this.default_key_handle_preventer=this.mousetrap_preventer_instance.handleKey;this.key_string=addKbdTags(this.training_combinations[this.orderedIndices[this.absoluteIndex]].keys);this.mousetrap_training_instance=new Mousetrap(this.$refs.inputrow);this.default_key_handle_trainer=this.mousetrap_training_instance.handleKey;this.mousetrap_preventer_instance.setKeyDetectionMode(this.config.keyDetectionMode);this.mousetrap_training_instance.setKeyDetectionMode(this.config.keyDetectionMode);this.bindNextCombination(false);if(this.config.keyDisplayMode===keyDisplayMode.show){this.currentlyDisplayed[0].keysVisible=true;}else if(this.config.keyDisplayMode===keyDisplayMode.showWithDelay){this.currentlyDisplayed[0].keysVisible=false;const currentAbsolut=this.currentlyDisplayed[0].absoluteIndexDisplayed;setTimeout(()=>this.currentlyDisplayed[0].keysVisible=this.currentlyDisplayed[0].keysVisible||this.currentlyDisplayed[0].absoluteIndexDisplayed===currentAbsolut,this.config.keyDisplaydelay)}else{this.currentlyDisplayed[0].keysVisible=false;}
this.currentlyDisplayed[1].keysVisible=false;this.currentlyDisplayed[2].keysVisible=false;this.currentlyDisplayed[3].keysVisible=false;},template:`
        <div ref="outer" class="">
            <div class="d-md-none">Please switch to a device with a larger screen and a keyboard to use KeyCombiner's
                interactive trainer.
            </div>
            <div class="d-none d-md-block">
                <div id="trainer" style="min-width: 760px" class="text-center">
                    <div v-if="finished" class="row mt-3" id="summary">
                        <div class="col-12 text-left">
                            <h2 class="card-title">Practice Run Completed!</h2>
                        </div>

                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    Summary
                                </div>
                                <div class="card-body py-0 pl-2">
                                    <table class="table m-0">
                                        <tbody>
                                        <tr>
                                            <td>Collection Size</td>
                                            <td>Correct</td>
                                            <td>With Hints</td>
                                            <td>Errors</td>
                                            <td>Skipped</td>
                                            <td>Ø Time (s):</td>
                                        </tr>
                                        <tr>
                                            <td>[[training_combinations.length]]</td>
                                            <td><span class="rounded p-2" style="background-color: #d6ecdb;">[[total_score]]</span>
                                            </td>
                                            <td><span class="rounded p-2" style="background-color: #e3f6c5;">[[total_with_hints]]</span>
                                            </td>
                                            <td><span class="rounded p-2" style="background-color: #f1dede;">[[total_error]]</span>
                                            </td>
                                            <td><span class="rounded p-2" style="background-color: #dddddd;">[[total_skipped]]</span>
                                            </td>
                                            <td><span class="rounded p-2" style="background-color: #abcde3;">[[averageOfAverages]]</span>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="card-deck my-3">
                                <div class="card mb-2">
                                    <div class="card-body">
                                        <h5 class="card-title">Combinations per Minute</h5>
                                        <h2 class="card-text">[[total_score]]</h2>
                                        <p class="card-text   text-left"><small class="text-muted">How many
                                            combinations you typed correct and without hints.</small></p>
                                    </div>
                                </div>
                                <div class="card mb-2 ">
                                    <div class="card-body">
                                        <h5 class="card-title">Correct Percentage</h5>
                                        <h2 class="card-text">[[ Math.round((total_score / absoluteIndex * 100))
                                            ]] %</h2>
                                        <p class="card-text  text-left"><small class="text-muted">The percentage
                                            of combination occurences you
                                            typed correct and without hints.</small></p>
                                    </div>
                                </div>
                                <div class="card mb-2 " v-if="savedStatistics">
                                    <div class="card-body">
                                        <h5 class="card-title">Mastered</h5>
                                        <h2 class="card-text">[[updatedMasteredCount]]</h2>
                                        <p class="card-text  text-left"><small class="text-muted">Combinations in the
                                            practiced set with confidence value > 2.</small></p>
                                    </div>
                                </div>
                            </div>

                            <div class="row justify-content-md-center">
                                <div class="col-md-4">
                                    <button type="button" class="btn btn-block btn-outline-primary"
                                            ref="restartButton"
                                            data-toggle="tooltip"
                                            title="Restart | Ctrl/Cmd+Shift+R"
                                            v-on:click="refresh">
                                        <i class="mdi mdi-refresh" aria-hidden="true"></i> Restart
                                    </button>
                                </div>
                                <div v-show="savedStatistics" class="col-md-4">
                                    <a v-bind:href="testRunUrl" class="btn btn-block
                                        btn-outline-primary"><i class="mdi mdi-chart-bar"></i> Saved Statistics</a>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div id="inputcards" v-if="!finished">
                        <div v-for="item in currentlyDisplayed.slice().reverse()">
                            <div class="row mt-2 d-flex justify-content-center">
                                <div style="min-height: 70px;" class="card align-items-center"
                                     v-bind:class="item.cssClass">
                                    <div class="row align-items-center h-100" v-bind:class="item.innerborderclass">
                                        <div class="col-2 mx-auto">
                                            [[getCombinationByAbsolute(item.absoluteIndexDisplayed).context]]
                                        </div>
                                        <div class="col-5 mx-auto">
                                            <h6 class="card-title mb-0">
                                                [[getCombinationByAbsolute(item.absoluteIndexDisplayed).description]]</h6>
                                        </div>
                                        <div class="col-3 mx-auto">
                                            <div class="smallkbd"
                                                 v-show="item.keysVisible || config.keyDisplayMode==1"
                                                 v-html="getKeysByAbsolute(item.absoluteIndexDisplayed)"></div>
                                        </div>
                                        <div class="col-2 mx-auto smallkbd kbderr align-middle">
                                            <div class="" v-if="item.wrongkeys"
                                                 v-html="prettifyKeysErr(item.wrongkeys)"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-4" ref="inputrow">
                            <div class="col-12" v-on:keyup="keyupButton">
                                <div class="input-group input-group-lg" ref="inputgroup">
                                    <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-lg">Key Combination Input&nbsp;<i
                        class="mdi mdi-keyboard-variant ml-2"></i></span>
                                    </div>
                                    <div id="training-input" v-if="!currentIsTextSnippet" ref="input"
                                         v-html="prettifyKeys(input_text)"
                                         class="form-control" contenteditable="true"></div>
                                    <input v-else type="text" class="form-control" ref="input" id="training-input"
                                           v-model="input_text">
                                    <div class="input-group-append">
                                        <span id="time" v-if="config.time > 0"
                                              class="input-group-text">[[config.time]]</span>
                                        <span id="time" v-else="config.time > 0" class="input-group-text">∞</span>
                                    </div>
                                    <div class="input-group-append">
                                        <button type="button" class="btn btn-outline-primary btn-lg"
                                                data-toggle="tooltip"
                                                title="Skip this combination | Esc" v-on:click="skip">
                                            <i class="mdi mdi-debug-step-over"></i>
                                        </button>
                                    </div>
                                    <div class="input-group-append">
                                        <button type="button" class="btn btn-outline-primary" data-toggle="tooltip"
                                                title="Restart | Ctrl/Cmd+Shift+R"
                                                v-on:click="refresh">
                                            <i class="mdi mdi-refresh" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="combosTypedWithError.length" class="card my-2 border-0">
                    <div class="card-body">
                        <h5 class="card-title text-center">Mistyped</h5>
                        <div class="card-deck my-2 justify-content-center">
                            <div v-for="combination in combosTypedWithError" class="card mb-2"
                                 style="background-color: #f1dede; max-width: 16rem;">
                                <div class="card-body">
                                    <button type="button" class="edit-combination icon-button btn-xs"
                                            v-if="combination.id"
                                            style="position: absolute; right: 5px; bottom: 5px"
                                            data-toggle="tooltip"
                                            title="Edit Key Combination"
                                            v-on:click="editCombination(combination)"><i
                                            class="mdi mdi-square-edit-outline"
                                            aria-hidden="true"></i></button>

                                    <p v-if="combination.id" class="card-text"><a
                                            :href="'/collecting/combination-statistics/' + combination.id + '/'">[[combination.description]]</a>
                                    </p>
                                    <p v-else>[[combination.description]]</p>
                                    <p class="card-text" v-html=prettifyKeys(combination.keys)></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if=" combosConfidenceChanged.length" class="card my-2 border-0">
                    <div class="card-body">
                        <h5 class="card-title text-center">Most Significant Confidence Changes</h5>
                        <p class="text-center"><small class="text-muted">See how the saved results of this practice run
                            contributed to the combinations' confidence values. Combinations with confidence greater
                            than 2 are mastered.</small></p>
                        <div class="card-deck my-2 justify-content-center">
                            <div v-for="combination in  combosConfidenceChanged" class="card mb-2"
                                 v-bind:class="combinationClass(combination)"
                                 style="max-width: 16rem;">
                                <div class="card-body">
                                    <button type="button" class="edit-combination icon-button btn-xs"
                                            v-if="combination.id"
                                            style="position: absolute; right: 5px; bottom: 5px"
                                            data-toggle="tooltip"
                                            title="Edit Key Combination"
                                            v-on:click="editCombination(combination)"><i
                                            class="mdi mdi-square-edit-outline"
                                            aria-hidden="true"></i></button>

                                    <p v-if="combination.id" class="card-text"><a
                                            :href="'/collecting/combination-statistics/' + combination.id + '/'">[[combination.description]]</a>
                                    </p>
                                    <p v-else>[[combination.description]]</p>
                                    <p class="card-text" v-html=prettifyKeys(combination.keys)></p>
                                    <p class="card-text">Change: [[combination.old_confidence]] to
                                        [[combination.new_confidence]] <i class="mdi mdi-party-popper"
                                                                          v-show="combination.old_confidence <= 2 && combination.new_confidence > 2"
                                                                          title="Congratulations, you have mastered this combination!"
                                                                          aria-hidden="true"></i></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div v-show="finished" id="chart-container">
                    <canvas height="100" id="learningResultsChart"></canvas>
                </div>

                <div class="row mt-3" v-if="keyMap" style="min-width: 1020px">
                    <div class="col-lg-auto col-md-12 order-lg-2 m-lg-auto">
                        <div id="keyboard" class="trainer" style="min-width: 708px">
                            <div class="kbdrow">
                                <button id="esc">Esc</button>
                                <div class="spacer-key"></div>
                                <button id="F1">F1</button>
                                <button id="F2">F2</button>
                                <button id="F3">F3</button>
                                <button id="F4">F4</button>
                                <div class="spacer-small"></div>
                                <button id="F5">F5</button>
                                <button id="F6">F6</button>
                                <button id="F7">F7</button>
                                <button id="F8">F8</button>
                                <div class="spacer-small"></div>
                                <button id="F9">F9</button>
                                <button id="F10">F10</button>
                                <button id="F11">F11</button>
                                <button id="F12">F12</button>
                            </div>
                            <div class="kbdrow">
                                <div class="spacer-small"></div>
                            </div>
                            <div class="kbdrow">
                                <trainingKbdBtn itemKey="Backquote">\`</trainingKbdBtn>
                                <trainingKbdBtn itemKey="Digit1">1</trainingKbdBtn>
                                <trainingKbdBtn itemKey="Digit2">2</trainingKbdBtn>
                                <trainingKbdBtn itemKey="Digit3">3</trainingKbdBtn>
                                <trainingKbdBtn itemKey="Digit4">4</trainingKbdBtn>
                                <trainingKbdBtn itemKey="Digit5">5</trainingKbdBtn>
                                <trainingKbdBtn itemKey="Digit6">6</trainingKbdBtn>
                                <trainingKbdBtn itemKey="Digit7">7</trainingKbdBtn>
                                <trainingKbdBtn itemKey="Digit8">8</trainingKbdBtn>
                                <trainingKbdBtn itemKey="Digit9">9</trainingKbdBtn>
                                <trainingKbdBtn itemKey="Digit0">0</trainingKbdBtn>
                                <trainingKbdBtn itemKey="Minus">-</trainingKbdBtn>
                                <trainingKbdBtn itemKey="Equal">=</trainingKbdBtn>
                                <button id="Backspace" style="width: 71.4px">&larr;</button>
                                <div class="spacer-small"></div>
                                <button id="Insert">Ins</button>
                                <button style="font-size: 9px" id="Home">Home</button>
                                <button style="font-size: 9px" id="PageUp">Pageup</button>
                            </div>
                            <div class="kbdrow">
                                <div class="kbdcol">
                                    <div class="kbdrow">
                                        <button id="Tab" style="width: 50.4px">&#8677;</button>
                                        <trainingKbdBtn itemKey="KeyQ">Q</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyW">W</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyE">E</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyR">R</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyT">T</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyY">Y</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyU">U</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyI">I</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyO">O</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyP"></trainingKbdBtn>
                                        <trainingKbdBtn itemKey="BracketLeft"></trainingKbdBtn>
                                        <trainingKbdBtn itemKey="BracketRight"></trainingKbdBtn>
                                        <trainingKbdBtn style="width: 57.4px" itemKey="Backslash"></trainingKbdBtn>
                                        <div class="spacer-small"></div>
                                        <button id="Delete">Del</button>
                                        <button id="End">End</button>
                                        <button style="font-size: 9px" id="PageDown">Page down</button>
                                    </div>
                                    <div class="kbdrow">
                                        <button id="CapsLock" style="width: 61.6px">&#8682;</button>
                                        <trainingKbdBtn itemKey="KeyA">A</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyS">S</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyD">D</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyF">F</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyG">G</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyH">H</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyJ">J</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyK">K</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyL">L</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="Semicolon">;</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="Quote">'</trainingKbdBtn>
                                        <button id="Enter" style="width: 84.7px">&crarr;</button>
                                        <div class="spacer-small"></div>
                                        <div class="spacer-key"></div>
                                        <div class="spacer-key"></div>
                                        <div class="spacer-key"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="kbdrow">
                                <div class="kbdcol">
                                    <div class="kbdrow">
                                        <button id="ShiftLeft" style="width: 51.7px">&#8679;</button>
                                        <trainingKbdBtn itemKey="IntlBackslash">|</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyZ">Z</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyX">X</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyC">C</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyV">V</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyB">B</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyN">N</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="KeyM">M</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="Comma">,</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="Period">.</trainingKbdBtn>
                                        <trainingKbdBtn itemKey="Slash">/</trainingKbdBtn>
                                        <button id="ShiftRight" style="width: 94.6px">&#8679;</button>
                                        <div class="spacer-small"></div>
                                        <div class="spacer-key"></div>
                                        <button id="ArrowUp">&uarr;</button>
                                        <div class="spacer-key"></div>
                                    </div>
                                    <div class="kbdrow">
                                        <button id="ControlLeft" style="width: 57.4px">Ctrl</button>

                                        <template v-if="isMacOS()">
                                            <button id="AltLeft" style="width: 47.6px">Alt</button>
                                            <button v-once id="MetaLeft" style="width: 47.6px">Cmd
                                        </template>
                                        <template v-else>
                                            <button v-once id="MetaLeft" style="width: 47.6px">Meta</button>
                                            <button id="AltLeft" style="width: 47.6px">Alt</button>
                                        </template>

                                        <button id="Space" style="width: 214.2px">Space</button>

                                        <template v-if="isMacOS()">
                                            <button v-once id="MetaRight" style="width: 47.6px">[[getSuperKeyLabel()]]
                                            </button>
                                            <button id="AltRight" style="width: 47.6px">Alt</button>
                                        </template>
                                        <template v-else>
                                            <button id="AltRight" style="width: 47.6px">AltGr</button>
                                            <button v-once id="MetaRight" style="width: 47.6px">[[getSuperKeyLabel()]]
                                            </button>
                                        </template>
                                        <button id="ContextMenu"></button>
                                        <button id="ControlRight" style="width: 58.8px">Ctrl</button>
                                        <div class="spacer-small"></div>
                                        <button id="ArrowLeft">&larr;</button>
                                        <button id="ArrowDown">&darr;</button>
                                        <button id="ArrowRight">&rarr;</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-2 order-lg-1 mt-lg-0 mt-3">
                        <div class="card" v-if="!finished">
                            <div class="card-header">
                                Statistics
                            </div>
                            <div class="card-body py-0 px-0">
                                <table class="table m-0">
                                    <tbody>
                                    <tr>
                                        <td style="border-top: none" class="pr-0">Correct:</td>
                                        <td class="text-center" style="border-top: none;"><span
                                                class="rounded "
                                                style="background-color: #d6ecdb; float: right; min-width: 40px;">[[total_score]]</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="border-top: none;" class="pr-0">With Hints:</td>
                                        <td class="text-center" style="border-top: none"> <span
                                                class="rounded"
                                                style="background-color: #e3f6c5; float: right; min-width: 40px;">[[total_with_hints]]</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="border-top: none;" class="pr-0">Errors:</td>
                                        <td class="text-center" style="border-top: none"><span
                                                class="rounded"
                                                style="background-color: #f1dede; float: right; min-width: 40px;">[[total_error]]</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="border-top: none;" class="pr-0">Skipped:</td>
                                        <td class="text-center" style="border-top: none"><span
                                                class="rounded"
                                                style="background-color: #dddddd; float: right; min-width: 40px;">[[total_skipped]]</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="border-top: none;" class="pr-0">Ø Time (s):</td>
                                        <td class="text-center" style="border-top: none"><span
                                                class="rounded"
                                                style="background-color: #abcde3; float: right; min-width: 40px;">[[averageOfAverages]]</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="col-3 col-lg-2 order-lg-3 mt-lg-0 mt-3" v-show="!config.isTest">
                        <div class="card">
                            <div class="card-header">
                                Key Hints
                            </div>
                            <div class="card-body text-left">
                                <b-form-group>
                                    <b-form-radio v-model="config.keyDisplayMode" value="1">Show
                                    </b-form-radio>
                                    <b-form-radio v-model="config.keyDisplayMode" value="2">After
                                        Delay
                                    </b-form-radio>
                                    <b-form-radio v-model="config.keyDisplayMode" value="4">Hide
                                    </b-form-radio>
                                </b-form-group>
                                <label for="delay-range-input">Delay ([[config.keyDisplaydelay]] ms)</label>
                                <b-form-input id="delay-range-input" v-model="config.keyDisplaydelay" type="range"
                                              min="0" max="10000"
                                              step="250"></b-form-input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `})