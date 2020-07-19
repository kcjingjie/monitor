package com.jyd.monitor.service.impl;

import com.jyd.monitor.dao.LoginDao;
import com.jyd.monitor.pojo.User;
import com.jyd.monitor.service.LoginService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class LoginServiceImpl implements LoginService {

    @Resource
    private LoginDao loginDao;

    @Override
    public User getUserByUserName(String username) {
        User user = loginDao.getUser(username);
        return user;
    }
}
