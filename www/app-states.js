/**
 * Created by dengjian on 2016-10-17.
 */
'use strict';

    var app = angular.module('myApp',['ui.router','home.controllers','detail.controller','ngTouch']);

    app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'module/home/home.html'
        });
        $stateProvider.state('message-detail', {
            url: '/messageDetail/:PushDate&:Content',
            templateUrl: 'module/messageDetail/detail.html'
        });
        $urlRouterProvider.otherwise('/home');
    });
/*
var IonicModule = angular.module('ionic', ['ngAnimate', 'ngSanitize', 'ui.router']),
    extend = angular.extend,
    forEach = angular.forEach,
    isDefined = angular.isDefined,
    isNumber = angular.isNumber,
    isString = angular.isString,
    jqLite = angular.element,
    noop = angular.noop;
    IonicModule.directive('ionList', ['$timeout', function($timeout){
        return {
            restrict: 'E',
            require: ['ionList', '^?$ionicScroll'],
            controller: '$ionicList',
            compile: function($element, $attr) {
                var listEl = jqLite('<div class="list">')
                    .append($element.contents())
                    .addClass($attr.type);

                $element.append(listEl);

                return function($scope, $element, $attrs, ctrls) {
                    var listCtrl = ctrls[0];
                    var scrollCtrl = ctrls[1];

                    // Wait for child elements to render...
                    $timeout(init);

                    function init() {
                        var listView = listCtrl.listView = new ionic.views.ListView({
                            el: $element[0],
                            listEl: $element.children()[0],
                            scrollEl: scrollCtrl && scrollCtrl.element,
                            scrollView: scrollCtrl && scrollCtrl.scrollView,
                            onReorder: function(el, oldIndex, newIndex) {
                                var itemScope = jqLite(el).scope();
                                if (itemScope && itemScope.$onReorder) {
                                    // Make sure onReorder is called in apply cycle,
                                    // but also make sure it has no conflicts by doing
                                    // $evalAsync
                                    $timeout(function() {
                                        itemScope.$onReorder(oldIndex, newIndex);
                                    });
                                }
                            },
                            canSwipe: function() {
                                return listCtrl.canSwipeItems();
                            }
                        });

                        $scope.$on('$destroy', function() {
                            if (listView) {
                                listView.deregister && listView.deregister();
                                listView = null;
                            }
                        });

                        if (isDefined($attr.canSwipe)) {
                            $scope.$watch('!!(' + $attr.canSwipe + ')', function(value) {
                                listCtrl.canSwipeItems(value);
                            });
                        }
                        if (isDefined($attr.showDelete)) {
                            $scope.$watch('!!(' + $attr.showDelete + ')', function(value) {
                                listCtrl.showDelete(value);
                            });
                        }
                        if (isDefined($attr.showReorder)) {
                            $scope.$watch('!!(' + $attr.showReorder + ')', function(value) {
                                listCtrl.showReorder(value);
                            });
                        }

                        $scope.$watch(function() {
                            return listCtrl.showDelete();
                        }, function(isShown, wasShown) {
                            //Only use isShown=false if it was already shown
                            if (!isShown && !wasShown) { return; }

                            if (isShown) listCtrl.closeOptionButtons();
                            listCtrl.canSwipeItems(!isShown);

                            $element.children().toggleClass('list-left-editing', isShown);
                            $element.toggleClass('disable-pointer-events', isShown);

                            var deleteButton = jqLite($element[0].getElementsByClassName('item-delete'));
                            setButtonShown(deleteButton, listCtrl.showDelete);
                        });

                        $scope.$watch(function() {
                            return listCtrl.showReorder();
                        }, function(isShown, wasShown) {
                            //Only use isShown=false if it was already shown
                            if (!isShown && !wasShown) { return; }

                            if (isShown) listCtrl.closeOptionButtons();
                            listCtrl.canSwipeItems(!isShown);

                            $element.children().toggleClass('list-right-editing', isShown);
                            $element.toggleClass('disable-pointer-events', isShown);

                            var reorderButton = jqLite($element[0].getElementsByClassName('item-reorder'));
                            setButtonShown(reorderButton, listCtrl.showReorder);
                        });

                        function setButtonShown(el, shown) {
                            shown() && el.addClass('visible') || el.removeClass('active');
                            ionic.requestAnimationFrame(function() {
                                shown() && el.addClass('active') || el.removeClass('visible');
                            });
                        }
                    }

                };
            }
        };
    }]);

    IonicModule.directive('ionItem', [function() {
    return {
        restrict: 'E',
        controller: ['$scope', '$element', function($scope, $element) {
            this.$scope = $scope;
            this.$element = $element;
        }],
        scope: true,
        compile: function($element, $attrs) {
            var isAnchor = isDefined($attrs.href) ||
                isDefined($attrs.ngHref) ||
                isDefined($attrs.uiSref);
            var isComplexItem = isAnchor ||
                    //Lame way of testing, but we have to know at compile what to do with the element
                /ion-(delete|option|reorder)-button/i.test($element.html());

            if (isComplexItem) {
                var innerElement = jqLite(isAnchor ? '<a></a>' : '<div></div>');
                innerElement.addClass('item-content');

                if (isDefined($attrs.href) || isDefined($attrs.ngHref)) {
                    innerElement.attr('ng-href', '{{$href()}}');
                    if (isDefined($attrs.target)) {
                        innerElement.attr('target', '{{$target()}}');
                    }
                }

                innerElement.append($element.contents());

                $element.addClass('item item-complex')
                    .append(innerElement);
            } else {
                $element.addClass('item');
            }

            return function link($scope, $element, $attrs) {
                $scope.$href = function() {
                    return $attrs.href || $attrs.ngHref;
                };
                $scope.$target = function() {
                    return $attrs.target;
                };

                var content = $element[0].querySelector('.item-content');
                if (content) {
                    $scope.$on('$collectionRepeatLeave', function() {
                        if (content && content.$$ionicOptionsOpen) {
                            content.style[ionic.CSS.TRANSFORM] = '';
                            content.style[ionic.CSS.TRANSITION] = 'none';
                            $$rAF(function() {
                                content.style[ionic.CSS.TRANSITION] = '';
                            });
                            content.$$ionicOptionsOpen = false;
                        }
                    });
                }
            };

        }
    };
}]);*/
