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
                    $state.go('message-detail',{Content:message.messageContent,PushDate:message.pushDate})
                    var db = window.sqlitePlugin.openDatabase({name:"JpushMessageDB.db",location:1});
                    db.transaction(function(tx){
                        var sql1 = "update jpush_message set readflag = 1 where id="+message.id;
                        tx.executeSql(sql1,[], function (tx, res) {
                            scope.$parent.$parent.$apply(function()
                            {
                                var index = scope.$parent.$parent.messages.indexOf(message);
                                scope.$parent.$parent.messages.splice(index,1);
                            });

                        });
                    });
                }
                scope.delete = function(message)
                {
                    var db = window.sqlitePlugin.openDatabase({name:"JpushMessageDB.db",location:1});
                    db.transaction(function(tx){
                        var sql1 = "delete from jpush_message where id="+message.id;
                        tx.executeSql(sql1,[], function (tx, res) {
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
                    scope.checkFlag = !scope.checkFlag;
                    var index = scope.$root.choosedEditIds.indexOf(id);
                    scope.$root.choosedEditIds.splice(index,1);
                }
            }
        }
    }])
    .controller('homeController',
        ['$scope','$rootScope','$state','$timeout','CordovaService',function($scope,$rootScope,$state,$timeout,CordovaService) {
            $rootScope.choosedId = -1; //用于记录当前侧滑事件发生在哪个消息上
            $rootScope.showEditFlag = false; //显示编辑图标
            $rootScope.selectAllFlag = false; //全选标志
            $rootScope.choosedEditIds = []; //当前已选择编辑的消息列表
            $scope.editOptionMessages = ['编辑','取消']; //用于点击编辑/取消编辑的切换显示
            $scope.editMessage = '编辑'; //默认显示编辑，点击编辑之后显示取消
            $scope.selectMessage = '全选'; //全选和取消全选切换，默认显示全选
/*            $scope.messages = [
                {
                    id:1,
                    readflag:1,
                    messageContent:'good morning',
                    pushDate:'2016.11.01'
                },
                {
                    id:2,
                    readflag:0,
                    messageContent:'good afternoon',
                    pushDate:'2016.11.01'
                }
            ];*/

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

                            var sql2 = "select count(*) as cnts from jpush_message where messageContent like '%"+searchValue+"%'";
                            tx.executeSql(sql2,[], function (tx, res) {
                                $scope.$apply(function()
                                {
                                    $scope.unReadedMsgCount = res.rows.item(0).cnts;
                                });

                            });
                        });
                };
                var reset = function() //用于重置scope的属性 刷新到最初状态
                {
                    $rootScope.choosedId = -1; //用于记录当前侧滑事件发生在哪个消息上
                    $rootScope.showEditFlag = false; //显示编辑图标
                    $rootScope.selectAllFlag = false; //全选标志
                    $rootScope.choosedEditIds = []; //当前已选择编辑的消息列表
                    $scope.editOptionMessages = ['编辑','取消']; //用于点击编辑/取消编辑的切换显示
                    $scope.editMessage = '编辑'; //默认显示编辑，点击编辑之后显示取消
                    $scope.selectMessage = '全选'; //全选和取消全选切换，默认显示全选
                };

                //监控事件’deviceready‘ 程序主要入口
                var onDeviceReady = function() {
                    //初始化
                    initiateUI();

                    //搜索关键字
                    $scope.searchValue = '';

                    //未读消息数目
                    $scope.unReadedMsgCount = 0;

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

                    $scope.doDelete = function()
                    {
                        var db = window.sqlitePlugin.openDatabase({name:"JpushMessageDB.db",location:1});
                        db.transaction(function(tx){
                            var sql= '';
                            if($rootScope.selectAllFlag||$rootScope.choosedEditIds.length==messages.length)
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
                                iDstr = iDstr+"-1）"//组装完毕
                                sql = "delete from jpush_message where id in"+iDstr;
                            }
                            tx.executeSql(sql,[], function (tx, res) {
                                $scope.$apply(function()
                                {
                                    searchMessage(searchValue);
                                });

                            });
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
                                    searchMessage(searchValue);
                                });

                            });
                        });
                    };
                    searchMessage($scope.searchValue);
                };

                //监控事件"jpush.openNotification"
                var onOpenNotification = function(event) {
                    try {
                        var messageContent;
                        var pushDate = new Date();
                        var date;
                        if (device.platform == "Android") {
                            messageContent = event.alert;
                            date = event.timeStamp;
                            //pushDate.setTime(date);
                            pushDate.setTime(date);
                        } else {
                            messageContent = event.aps.alert;
                            pushDate.setTime(event.aps.timeStamp);
                        }
                        //存储数据
                        var db = window.sqlitePlugin.openDatabase({name:"JpushMessageDB.db",location:1});
                        db.transaction(function(tx) {
                            //tx.executeSql('DROP TABLE IF EXISTS jpush_message');
                            tx.executeSql('CREATE TABLE IF NOT EXISTS jpush_message (id integer primary key NOT NULL, messageContent text NOT NULL, pushDate timestamp NOT NULL,readflag integer)');

                            tx.executeSql("INSERT INTO jpush_message (messageContent, pushDate) VALUES (?,?)", [messageContent,date], function(tx, res) {
                                searchMessage($scope.searchValue);
                            }, function(e) {
                                alert("ERROR: " + e.message);
                            });
                        });

                    } catch (exception) {
                        console.log("JPushPlugin:onOpenNotification" + exception);
                    }
                };
                var timeStamp2String = function(time){
                        var datetime = new Date();
                        datetime.setTime(time);
                        var year = datetime.getFullYear();
                        var month = datetime.getMonth() + 1;
                        var date = datetime.getDate();
                        var hour = datetime.getHours();
                        var minute = datetime.getMinutes();
                        var second = datetime.getSeconds();
                        var mseconds = datetime.getMilliseconds();
                        return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second+"."+mseconds;
                    };

                //初始化Jpush插件
                var initiateUI = function() {
                    try {
                        window.plugins.jPushPlugin.init();
                        //getRegistrationID();
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

                document.addEventListener("deviceready", onDeviceReady, false);
                document.addEventListener("jpush.openNotification", onOpenNotification, false);
            });
        }]);

