/**
 * Created by dengjian on 2016-10-17.
 */
'use strict';

    var app = angular.module('myApp',['ui.router','home.controllers','detail.controller','ui.bootstrap','ngTouch']);

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
