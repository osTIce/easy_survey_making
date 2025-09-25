package com.yscode.easysurveymaking.easysurveymaking.controller;

import com.yscode.easysurveymaking.easysurveymaking.entity.User;
import com.yscode.easysurveymaking.easysurveymaking.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 로그인 페이지로 이동
    @GetMapping("/login")
    public String login(){
        return "user/login";
    }

    // 회원가입 시 중복확인 버튼 닉네임 중복 체크
    @GetMapping("/check-nickname")
    @ResponseBody
    public Map<String, Object> checkNickname(@RequestParam("nickname") String nickname) {

        boolean exists = userService.existsByNickname(nickname);

        Map<String, Object> response = new HashMap<>();
        response.put("nickname", nickname);
        response.put("available", exists); // true = 중복, false = 사용 가능
        return response;
    }

    // 회원가입 시 이메일 중복 체크
    @GetMapping("/check-email")
    @ResponseBody
    public Map<String, Object> checkEmail(@RequestParam("email") String email) {
        System.out.println(email);
        boolean exists = userService.existsByEmail(email);

        Map<String, Object> response = new HashMap<>();
        response.put("email", email);
        response.put("available", exists);
        return response;
    }

    // 회원가입
    @PostMapping("/register")
    @ResponseBody
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        try {
            userService.registerUser(user);
            result.put("success", true);
        } catch (Exception e) {
            result.put("success", false);
        }
        return result;
    }

    // 로그인

    
}
