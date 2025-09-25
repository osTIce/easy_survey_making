package com.yscode.easysurveymaking.easysurveymaking.service;

import com.yscode.easysurveymaking.easysurveymaking.entity.User;

public interface UserService {

    // 닉네임 존재 여부 확인
    boolean existsByNickname(String nickname);

    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);

    // 회원가입
    User registerUser(User user);
}