package com.jyd.monitor.controller;

import com.jyd.monitor.pojo.User;
import com.jyd.monitor.service.LoginService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
@RestController
public class LoginController {

    @Resource
    private LoginService loginService;

    @RequestMapping("/login")
    @ResponseBody
    public Object login(String username,String password){
        User user = loginService.getUserByUserName(username);
        return user;
    }

}
