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
    .controller('homeController',
        ['$scope', '$state','$timeout','CordovaService',function($scope, $state,$timeout,CordovaService) {
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


                }

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

                    //重置搜索关键字
                    $scope.reset = function () {
                        $scope.searchValue = '';
                    };

                    $scope.stategoDetail = function (item) {
                        $state.go('message-detail',{PushDate:item.pushDate,Content:item.messageContent});
                    };

                    $scope.stategoDetail0 = function () {
                        $state.go('message-detail',{});
                    };

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
                            $scope.$apply();
                        }
                    });

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

                //var startX ,startY;
                //document.addEventListener("touchstart", function(e) {
                //    e.preventDefault();
                //    startX = e.originalEvent.changedTouches[0].pageX;
                //    startY = e.originalEvent.changedTouches[0].pageY;
                //});
                //
                //document.addEventListener("touchmove", function(e) {
                //    e.preventDefault();
                //    var moveEndX = e.originalEvent.changedTouches[0].pageX,
                //        moveEndY = e.originalEvent.changedTouches[0].pageY,
                //        X = moveEndX - startX,
                //        Y = moveEndY - startY;
                //
                //    if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {
                //        alert("left 2 right");
                //    }
                //    else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {
                //        alert("right 2 left");
                //    }
                //    else if ( Math.abs(Y) > Math.abs(X) && Y > 0) {
                //        alert("top 2 bottom");
                //    }
                //    else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
                //        alert("bottom 2 top");
                //    }
                //    else{
                //        alert("just touch");
                //    }
                //
                //});

                document.addEventListener("deviceready", onDeviceReady, false);
                document.addEventListener("jpush.openNotification", onOpenNotification, false);
            });
        }]);