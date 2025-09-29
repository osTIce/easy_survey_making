package com.yscode.easysurveymaking.easysurveymaking.serviceImpl;

import com.yscode.easysurveymaking.easysurveymaking.entity.User;
import com.yscode.easysurveymaking.easysurveymaking.repository.UserRepository;
import com.yscode.easysurveymaking.easysurveymaking.service.UserService;
import com.yscode.easysurveymaking.easysurveymaking.util.ValidationUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public boolean existsByNickname(String nickname) {
        if (!ValidationUtils.isValidNickname(nickname)) {
            throw new IllegalArgumentException("닉네임은 2~12자의 한글, 영어, 숫자, _ 만 가능합니다.");
        }
        return userRepository.existsByNickname(nickname);
    }

    @Override
    public boolean existsByEmail(String email) {
        if (!ValidationUtils.isValidEmail(email)) {
            throw new IllegalArgumentException("유효하지 않은 이메일 형식입니다.");
        }
        return userRepository.existsByEmail(email);
    }

    @Override
    public User registerUser(User user) {
        if (!ValidationUtils.isValidEmail(user.getEmail())) {
            throw new IllegalArgumentException("유효하지 않은 이메일 형식입니다.");
        }
        if (!ValidationUtils.isValidNickname(user.getNickname())) {
            throw new IllegalArgumentException("닉네임은 2~12자의 한글, 영어, 숫자, _ 만 가능합니다.");
        }
        if (!ValidationUtils.isValidPassword(user.getPassword())) {
            throw new IllegalArgumentException("유효하지 않은 비밀번호 형식입니다.");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        if (userRepository.existsByNickname(user.getNickname())) {
            throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword())); // 비밀번호 암호화
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }
}
