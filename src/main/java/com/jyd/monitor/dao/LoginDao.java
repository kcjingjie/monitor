package com.jyd.monitor.dao;

import com.jyd.monitor.pojo.User;
import org.apache.ibatis.annotations.Param;

public interface LoginDao {
    int deleteByPrimaryKey(Integer id);

    int insert(User record);

    int insertSelective(User record);

    User getUser(@Param("username") String username);

    User selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(User record);

    int updateByPrimaryKey(User record);
}