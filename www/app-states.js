/**
 * Created by dengjian on 2016-10-17.
 */
'use strict';

    var app = angular.module('myApp',['ui.router','home.controllers']);

    app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'module/homeView/home.html'
        });
        $urlRouterProvider.otherwise('/home');
    });