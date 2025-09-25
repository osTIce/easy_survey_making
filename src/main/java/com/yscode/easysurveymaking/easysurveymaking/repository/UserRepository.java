package com.yscode.easysurveymaking.easysurveymaking.repository;

import com.yscode.easysurveymaking.easysurveymaking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 닉네임 존재 여부 확인
    boolean existsByNickname(String nickname);

    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);
}
