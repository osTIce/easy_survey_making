package com.yscode.easysurveymaking.easysurveymaking.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    // 홈 화면으로 이동
    @GetMapping("/")
    public String home(){
        return "home";
    }

}