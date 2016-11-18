package com.jpushServer.plugin;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.widget.Toast;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cn.jpush.api.JPushClient;
import cn.jpush.api.common.resp.APIConnectionException;
import cn.jpush.api.common.resp.APIRequestException;
import cn.jpush.api.push.PushResult;
import cn.jpush.api.push.model.PushPayload;
/*import cn.jpush.api.push.model.Message;
import cn.jpush.api.push.model.Options;
import cn.jpush.api.push.model.Platform;
import cn.jpush.api.push.model.audience.Audience;
import cn.jpush.api.push.model.audience.AudienceTarget;
import cn.jpush.api.push.model.notification.AndroidNotification;
import cn.jpush.api.push.model.notification.IosNotification;
import cn.jpush.api.push.model.notification.Notification;*/

/**
 * This class echoes a string called from JavaScript.
 */
public class JpushServerPlugin extends CordovaPlugin {
    protected final Logger LOG = LoggerFactory.getLogger(JpushServerPlugin.class);
    private final String appKey ="8d22215b59f5d825779baaa8";
    private final String masterSecret = "823a530730f4a44d71bdf435";
    public JPushClient jpushClient = null;
    public void sendPush(String alert) {
        Toast.makeText(cordova.getActivity(), "正在推送1...", Toast.LENGTH_SHORT).show();

        jpushClient = new JPushClient(masterSecret, appKey, 3);
        Toast.makeText(cordova.getActivity(), "正在推送2...", Toast.LENGTH_SHORT).show();

        // HttpProxy proxy = new HttpProxy("localhost", 3128);
        // Can use this https proxy: https://github.com/Exa-Networks/exaproxy

        // For push, all you need do is to build PushPayload object.
         PushPayload payload = buildPushObject_all_all_alert(alert);
        // 生成推送的内容，这里我们先测试全部推送
        //PushPayload payload = buildPushObject_audienceOne(title,content,registerId);

        try {
            PushResult result = jpushClient.sendPush(payload);
            LOG.info("Got result - " + result);
        } catch (APIConnectionException e) {
            LOG.error("Connection error. Should retry later. ", e);
        } catch (APIRequestException e) {
            LOG.error(
                    "Error response from JPush server. Should review and fix it. ",
                    e);
            LOG.info("HTTP Status: " + e.getStatus());
            LOG.info("Error Code: " + e.getErrorCode());
            LOG.info("Error Message: " + e.getErrorMessage());
            LOG.info("Msg ID: " + e.getMsgId());
        }
    }

    public PushPayload buildPushObject_all_all_alert(String alert) {
        return PushPayload.alertAll(alert);
    }
/*
    public PushPayload buildPushObject_all_alias_alert(String title) {
        return PushPayload.newBuilder().setPlatform(Platform.all())// 设置接受的平台
                .setAudience(Audience.all())// Audience设置为all，说明采用广播方式推送，所有用户都可以接收到
                .setNotification(Notification.alert(title)).build();
    }

    public PushPayload buildPushObject_audienceOne(String title,
            String content, String registerId) {
        return PushPayload
                .newBuilder()
                .setPlatform(Platform.all())
                .setAudience(Audience.registrationId(registerId))
                .setMessage(
                        Message.newBuilder().setMsgContent(content)
                                .setTitle(title).build())
                .setNotification(Notification.alert(content)).build();
    }

    public PushPayload buildPushObject_android_tag_alertWithTitle(
            String alert, String title) {
        return PushPayload.newBuilder().setPlatform(Platform.android())
                .setAudience(Audience.all())
                .setNotification(Notification.android(alert, title, null))
                .build();
    }

    public PushPayload buildPushObject_android_and_ios() {
        return PushPayload
                .newBuilder()
                .setPlatform(Platform.android_ios())
                .setAudience(Audience.tag("tag1"))
                .setNotification(
                        Notification
                                .newBuilder()
                                .setAlert("alert content")
                                .addPlatformNotification(
                                        AndroidNotification.newBuilder()
                                                .setTitle("Android Title")
                                                .build())
                                .addPlatformNotification(
                                        IosNotification
                                                .newBuilder()
                                                .incrBadge(1)
                                                .addExtra("extra_key",
                                                        "extra_value").build())
                                .build()).build();
    }

    public PushPayload buildPushObject_ios_tagAnd_alertWithExtrasAndMessage(
            String alert, String content) {
        return PushPayload
                .newBuilder()
                .setPlatform(Platform.ios())
                .setAudience(Audience.tag_and("tag1", "tag_all"))
                .setNotification(
                        Notification
                                .newBuilder()
                                .addPlatformNotification(
                                        IosNotification.newBuilder()
                                                .setAlert(alert).setBadge(5)
                                                .setSound("happy")
                                                .addExtra("from", "JPush")
                                                .build()).build())
                .setMessage(Message.content(content))
                .setOptions(
                        Options.newBuilder().setApnsProduction(true).build())
                .build();
    }

    public PushPayload buildPushObject_ios_audienceMore_messageWithExtras(
            String content) {
        return PushPayload
                .newBuilder()
                .setPlatform(Platform.android_ios())
                .setAudience(
                        Audience.newBuilder()
                                .addAudienceTarget(
                                        AudienceTarget.tag("tag1", "tag2"))
                                .addAudienceTarget(
                                        AudienceTarget
                                                .alias("alias1", "alias2"))
                                .build())
                .setMessage(
                        Message.newBuilder().setMsgContent(content)
                                .addExtra("from", "JPush").build()).build();
    }*/
    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException { 
        if(action.equals("sendJpushMsg")){
            String alert = args.getString(0);
                    //Toast.makeText(cordova.getActivity(), "show..."+alert, Toast.LENGTH_SHORT).show();
                    try
                    {
                        sendPush(alert); 
                        Toast.makeText(cordova.getActivity(), "正在推送...", Toast.LENGTH_SHORT).show();
                    }
                    catch(Exception e)
                    {
                        Toast.makeText(cordova.getActivity(), "error..."+appKey, Toast.LENGTH_SHORT).show();
                    }
                    callbackContext.success("推送成功");
                    return true;
        }
        callbackContext.error("推送失败");
        return false;
    }
}