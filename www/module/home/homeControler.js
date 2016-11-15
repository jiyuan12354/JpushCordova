/**
 * Created by dengjian on 2016-10-17.
 */
angular.module('fsCordova', [])
    .service('CordovaService', ['$document', '$q',
            function ($document, $q) {
                    var d = $q.defer(),
                        resolved = false;
                    var self = this;
                    this.ready = d.promise;
                    document.addEventListener('deviceready', function () {
                            resolved = true;
                            d.resolve(window.cordova);
                    });
                    // 检查一下以确保没有漏掉这个事件（以防万一）
                    setTimeout(function () {
                            if (!resolved) {
                                    if (window.cordova) {
                                            d.resolve(window.cordova);
                                    }
                            }
                    }, 3000);
            }
    ]);

angular.module('home.controllers', ['fsCordova'])
    .directive("messageItem",['$state','$rootScope',function($state,$rootScope){
        return{
            restrict:"AE",
            scope:false,
            scope:{
                message:'=item',
            },
            templateUrl:'module/template/messageItem.html',
            replace:true,
            link:function(scope,element,attrs){
                /*element.on('dblclick',function(){
                 element.addClass('selected');
                 //element.addClass('selected').siblings().removeClass('selected');
                 });
                 element.on('click',function(){
                 element.stop().animate(
                 {},100,function(){
                 element.removeClass('selected');
                 }
                 )
                 });*/
                scope.checkFlag = false;
                scope.dateFilter = 'HH:mm';
                if((scope.$root.dateRefresh - scope.message.pushDate)>86400000)
                {
                    scope.dateFilter = "yyyy-MM-dd";
                }
                scope.showDeleteBtn = function(id)
                {
                    scope.$root.choosedId = id;
                    //element.addClass('selected');
                }
                scope.hideDeleteBtn = function()
                {
                    scope.$root.choosedId = -1;
                    //element.removeClass('selected');
                }
                scope.stategoDetail = function (message) {
                    $state.go('message-detail',{Content:message.messageContent,PushDate:message.pushDate});
                    var db = window.sqlitePlugin.openDatabase({name:"JpushMessageDB.db",location:1});
                    db.transaction(function(tx){
                        var sql = "update jpush_message set readflag = 1 where id="+message.id;
                        tx.executeSql(sql,[], function (tx, res) {
                        });
                    });
                };
                scope.delete = function(message)
                {
                    var db = window.sqlitePlugin.openDatabase({name:"JpushMessageDB.db",location:1});
                    db.transaction(function(tx){
                        var sql = "delete from jpush_message where id="+message.id;
                        tx.executeSql(sql,[], function (tx, res) {
                            scope.$parent.$parent.$apply(function()
                            {
                                var index = scope.$parent.$parent.messages.indexOf(message);
                                scope.$parent.$parent.messages.splice(index,1);
                            });

                        });
                    });
                }
                scope.checkItem = function(id)
                {
                    scope.checkFlag = !scope.checkFlag;
                    scope.$root.choosedEditIds.push(id);
                }
                scope.uncheckItem = function(id)
                {
                    if(scope.$root.selectAllFlag)//此段代码 只会在选择全选后，又取消选择某条消息时执行，保留selectAllFlag标志可以简化编辑全部消息的操作
                    {
                        scope.$root.selectAllFlag = false;//注意padding-right15样式由selectAllFlag控制切换，不用担心
                        scope.$parent.$parent.selectMessage = "全选";
                        scope.$parent.$parent.putAllFilteredMessageIds();
                    }
                    scope.checkFlag = !scope.checkFlag;
                    var index = scope.$root.choosedEditIds.indexOf(id);
                    scope.$root.choosedEditIds.splice(index,1);
                }
            }
        }
    }])
    .controller('homeController',
        ['$scope','$rootScope','$state','$q','$modal','$timeout','CordovaService',function($scope,$rootScope,$state,$q,$modal,$timeout,CordovaService) {
            $rootScope.dateRefresh = (new Date()).valueOf();//根据当前时间，刷新每条消息的日期过滤器，格式timestamp
            $rootScope.choosedId = -1; //用于记录当前侧滑事件发生在哪个消息上
            $rootScope.showEditFlag = false; //显示编辑图标
            $rootScope.selectAllFlag = false; //全选标志
            $rootScope.choosedEditIds = []; //当前已选择编辑的消息列表
            $scope.editOptionMessages = ['编辑','取消']; //用于点击编辑/取消编辑的切换显示
            $scope.editMessage = '编辑'; //默认显示编辑，点击编辑之后显示取消
            $scope.selectMessage = '全选'; //全选和取消全选切换，默认显示全选

            //切换编辑文字，并显示编辑图片
            $scope.showEdit = function () {
                if($scope.editMessage==$scope.editOptionMessages[0])//点击编辑
                {
                    $rootScope.showEditFlag = true;
                    $scope.editMessage = $scope.editOptionMessages[1];
                }
                else//点击取消
                {
                    $rootScope.choosedEditIds = [];
                    $scope.editMessage = $scope.editOptionMessages[0];
                    $rootScope.showEditFlag = false;
                }
            };

            //切换全选文字，并改变标志位
            $scope.selectAll = function () {
                $rootScope.selectAllFlag = !$rootScope.selectAllFlag;
                if(!$rootScope.selectAllFlag)
                {
                    $rootScope.choosedEditIds = [];
                }
                //切换全选，取消全选文字显示
                $scope.selectMessage = $rootScope.selectAllFlag?'取消全选':"全选";
            };



            CordovaService.ready.then(function () {
                /*cordova已经准备好了*/


                //从表jpush_message中遍历出过滤后的messages，返回到$scope.messages
                var searchMessage = function(searchValue){
                    var db = window.sqlitePlugin.openDatabase({name:"JpushMessageDB.db",location:1});
                        db.transaction(function(tx){
                            var sql1 = "select * from jpush_message where messageContent like '%"+searchValue+"%'";
                            tx.executeSql(sql1,[], function (tx, res) {
                                $scope.$apply(function()
                                {
                                    $scope.messages = [];
                                    for(var i= 0;i<res.rows.length;i++)
                                    {
                                        $scope.messages.push(res.rows.item(res.rows.length-i-1));
                                    }
                                });

                            });

                            var sql2 = "select count(*) as cnts from jpush_message where messageContent like '%"+searchValue+"%' and readflag=0";
                            tx.executeSql(sql2,[], function (tx, res) {
                                $scope.$apply(function()
                                {
                                    $rootScope.unReadedMsgCount = res.rows.item(0).cnts;
                                });
                            });
                        });
                    reset();
                };
                var reset = function()
                {
                    $rootScope.dateRefresh = (new Date()).valueOf();
                    $rootScope.choosedId = -1;
                    $rootScope.showEditFlag = false;
                    $rootScope.selectAllFlag = false;
                    $rootScope.choosedEditIds = [];
                    $scope.editMessage = '编辑';
                    $scope.selectMessage = '全选';
                }
//删除确认弹框
                $scope.doDelete = function()
                {
                    var db = window.sqlitePlugin.openDatabase({name:"JpushMessageDB.db",location:1});
                    db.transaction(function(tx){
                        var sql= '';
                        if($rootScope.selectAllFlag||($rootScope.choosedEditIds.length==$scope.messages.length))
                        {
                            sql = "delete from jpush_message";
                        }
                        else
                        {
                            var iDstr = '(';//组装数组数据传递给sqlite
                            angular.forEach($rootScope.choosedEditIds,function(data,index,array)
                            {
                                iDstr = iDstr+array[index]+',';
                            });
                            iDstr = iDstr+"-1)"//组装完毕
                            sql = "delete from jpush_message where id in"+iDstr;
                        }
                        tx.executeSql(sql,[], function (tx, res) {
                            $scope.$apply(function()
                            {
                                searchMessage($scope.searchValue);
                                //reset();
                                //$state.go('home',{});
                                //window.location.href = window.location.href;
                            });
                        });
                    });
                };
                /*$scope.ModalDeleteCtrl = function($scope, $modalInstance) {
                    $scope.ok = function() {
                        doDelete();
                        $modalInstance.close($scope.selected);
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.closeDialog = function(){
                        $modalInstance.dismiss('cancel');
                    }
                };

                $scope.doDeletePop = function()
                {
                    ModalUtil.createModal($modal,$scope,$scope.ModalDeleteCtrl,'module/template/confirmDialog.html');

                };*/

                //监控事件’deviceready‘ 程序主要入口
                var onDeviceReady = function() {
                    //初始化
                    initiateUI();

                    //搜索关键字
                    $scope.searchValue = '';

                    //未读消息数目
                    $rootScope.unReadedMsgCount = 0;

                    //消息列表
                    $scope.messages = [
                    ];

/*                    //重置搜索关键字
                    $scope.reset = function () {
                        $scope.searchValue = '';
                    };*/

                    //延迟搜索，监控searchValue输入变化
                    var timeout;
                    $scope.$watch('searchValue',function(newValue,oldValue,scope){
                        if(newValue){
                            if(newValue != oldValue){
                                if(timeout){
                                    $timeout.cancel(timeout);
                                }
                                timeout = $timeout(function(){
                                    //使用newValue过滤&刷新列表数据
                                    searchMessage(newValue);
                                },500)
                            }
                            //$scope.$apply();
                        }
                    });
                    $scope.putAllFilteredMessageIds = function()
                    {
                        $rootScope.choosedEditIds = [];
                        angular.forEach($scope.messages,function(data,index,array)
                        {
                            $rootScope.choosedEditIds.push(data.id);
                        });
                    };


                    $scope.setRead = function()
                    {
                        var db = window.sqlitePlugin.openDatabase({name:"JpushMessageDB.db",location:1});
                        db.transaction(function(tx){
                            var sql= '';
                            if($rootScope.selectAllFlag)
                            {
                                sql = "update jpush_message set readflag = 1";
                            }
                            else
                            {
                                var iDstr = '(';//组装数组数据传递给sqlite
                                angular.forEach($rootScope.choosedEditIds,function(data,index,array)
                                {
                                    iDstr = iDstr+array[index]+',';
                                });
                                iDstr = iDstr+"-1)"//组装完毕
                                sql = "update jpush_message set readflag = 1 where id in "+iDstr;
                            }
                            tx.executeSql(sql,[], function (tx, res) {
                                $scope.$apply(function()
                                {
                                    searchMessage($scope.searchValue);
                                    //reset();
                                    //$state.go('home',{});
                                    //window.location.reload();
                                });

                            });
                        });
                    };
                    searchMessage($scope.searchValue);
                };

                //监控事件"jpush.openNotification"
                var onOpenNotification = function(event) {
                    try {
                        //根据当前时间，刷新每个消息的日期过滤器，当天只显示HH:mm:ss，否则显示yyyy-MM-dd
                        $rootScope.dateRefresh = (new Date()).valueOf();

                        var iDkey = "cn.jpush.android.NOTIFICATION_ID";// NOTIFICATION_ID的键
                        var event_extras = event.extras; // 包含NOTIFICATION_ID数值

                        //数据库存储字段
                        var messageContent;
                        var notificationId;
                        var pushDate = (new Date()).valueOf();

                        //给存储字段进行赋值
                        if (device.platform == "Android") {
                            messageContent = event.alert;
                            //pushDate.setTime(date);
                        } else {
                            var event_extras = event.aps.extras;
                            messageContent = event.aps.alert;
                        }
                        for(var i in event_extras) {
                            if(i == iDkey)
                            {
                                notificationId = event_extras[i];
                            }
                        }
                        $state.go('message-detail',{Content:event.alert,PushDate:pushDate});

                        //下面代码是为了更新消息的已读状态
                        var db = window.sqlitePlugin.openDatabase({name:"JpushMessageDB.db",location:1});
                        db.transaction(function(tx){
                            var sql = "update jpush_message set readflag = 1 where notificationId="+notificationId;
                            tx.executeSql(sql,[], function (tx, res) {
                            });
                        });
                    } catch (exception) {
                        console.log("JPushPlugin:onOpenNotification" + exception);
                    }
                };

                var onReceiveNotification = function(event) {
                    try {
                        //根据当前时间，刷新每个消息的日期过滤器，当天只显示HH:mm:ss，否则显示yyyy-MM-dd
                        $rootScope.dateRefresh = (new Date()).valueOf();

                        var iDkey = "cn.jpush.android.NOTIFICATION_ID";// NOTIFICATION_ID的键
                        var event_extras = event.extras; // 包含NOTIFICATION_ID数值

                        //数据库存储字段
                        var messageContent;
                        var notificationId;
                        var pushDate = (new Date()).valueOf();

                        //给存储字段进行赋值
                        if (device.platform == "Android") {
                            messageContent = event.alert;
                            //pushDate.setTime(date);
                        } else {
                            event_extras = event.aps.extras;
                            messageContent = event.aps.alert;
                        }
                        for(var i in event_extras) {
                            if(i == iDkey)
                            {
                                notificationId = event_extras[i];
                            }
                        }

                        //存储数据
                        var db = window.sqlitePlugin.openDatabase({name:"JpushMessageDB.db",location:1});
                        db.transaction(function(tx) {
                            //tx.executeSql('DROP TABLE IF EXISTS jpush_message');
                            tx.executeSql('CREATE TABLE IF NOT EXISTS jpush_message (id integer primary key NOT NULL,notificationId integer NOT NULL, messageContent text NOT NULL, pushDate timestamp NOT NULL,readflag integer)');

                            tx.executeSql("INSERT INTO jpush_message (messageContent, pushDate,notificationId,readflag) VALUES (?,?,?,?)", [messageContent,pushDate,notificationId,0], function(tx, res) {
                                searchMessage($scope.searchValue);
                            }, function(e) {
                                alert("ERROR: " + e.message);
                            });
                        });

                    } catch (exception) {
                        console.log("JPushPlugin:onReceiveNotification" + exception);
                    }
                };

                //初始化Jpush插件
                var initiateUI = function() {
                    try {
                        window.plugins.jPushPlugin.init();
                        getRegistrationID();
                        if (device.platform != "Android") {
                            window.plugins.jPushPlugin.setDebugModeFromIos();
                            window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
                        } else {
                            window.plugins.jPushPlugin.setDebugMode(true);
                            window.plugins.jPushPlugin.setStatisticsOpen(true);
                        }
                    } catch (exception) {
                        console.log(exception);
                    }
                };

                // 获取RegistrationID
                var getRegistrationID = function () {
                    window.plugins.jPushPlugin.getRegistrationID(function (data) {
                        try {
                            console.log("JPushPlugin:registrationID is " + data);
                            if (data.length == 0) {
                                var t1 = window.setTimeout(getRegistrationID, 1000);
                            }
                            //$scope.message += "JPushPlugin:registrationID is " + data;
                            $scope.registrationID = data;
                        } catch (exception) {
                            console.log(exception);
                        }
                    });

                };


                document.addEventListener("deviceready", onDeviceReady, false);
                document.addEventListener("jpush.openNotification", onOpenNotification, false);
                document.addEventListener("jpush.receiveNotification", onReceiveNotification, false);
            });
        }]);

