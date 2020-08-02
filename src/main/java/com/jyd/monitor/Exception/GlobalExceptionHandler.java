package com.jyd.monitor.Exception;

import com.jyd.monitor.pojo.ResultBody;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 全局异常
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = Logger.getLogger(GlobalExceptionHandler.class);

    /**
     * 处理自定义的业务异常
     */
    @ExceptionHandler(value = NullPointerException.class)
    @ResponseBody
    public ResultBody nullExceptionHandler(NullPointerException e){

        logger.error("发生空指针异常!原因是:",e);
        return  null;
    }

}
