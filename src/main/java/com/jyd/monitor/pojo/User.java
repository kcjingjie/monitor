package com.jyd.monitor.pojo;

import java.io.Serializable;

/**
 * usr
 * @author 
 */
public class User implements Serializable {
    private Integer id;

    private String name;

    private String password;

    private String dept;

    private String authority;

    private String createTime;

    private static final long serialVersionUID = 1L;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDept() {
        return dept;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getAuthority() {
        return authority;
    }

    public void setAuthority(String authority) {
        this.authority = authority;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String create_time) {
        this.createTime = create_time;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }
}