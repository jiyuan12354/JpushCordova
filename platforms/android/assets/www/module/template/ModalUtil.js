'use strict';
/***********************************************************************

 * -----------------------------------------------------------------<br>
 * 变更序号：<br>
 * 修改日期：<br>
 * 修改人员：<br>
 * 修改原因：<br>
 * **********************************************************************
 */

function ModalUtil() {}

ModalUtil.createModal = function($modal,$scope,ctr,viewUrl) {

	var modalInstance = $modal.open({  
		templateUrl : viewUrl,  
		controller : ctr,  
		backdrop: 'static',
		keyboard: false
	});  
	modalInstance.opened.then(function() {// 模态窗口打开之后执行的函数  
		// console.log('modal is opened');  
	});  
	modalInstance.result.then(function(result) {  
		console.log(result);  
	}, function(reason) {  
		// console.log(reason);// 点击空白区域，总会输出backdrop  
		// click，点击取消，则会暑促cancel  
		// $log.info('Modal dismissed at: ' + new Date());  
	});  
      
};