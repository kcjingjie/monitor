package com.jyd.monitor.pojo;

/**
 * 枚举类 定义异常返回的数据
 */
public enum CommonEnum {
    //数据操作定义
    SUCCESS("200","成功");

    private String resultCode;

    private String resultMsg;

    CommonEnum(String resultCode,String resultMsg){
        this.resultCode = resultCode;
        this.resultMsg = resultMsg;
    }

    public String getResultCode() {
        return resultCode;
    }

    public String getResultMsg() {
        return resultMsg;
    }

}
