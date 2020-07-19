package com.jyd.monitor.service;

import com.jyd.monitor.pojo.User;
import org.springframework.stereotype.Service;

@Service
public interface LoginService {

    User getUserByUserName(String username);
}
