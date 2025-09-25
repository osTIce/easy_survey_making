const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const formTitle = document.getElementById("form-title");
const toggleSignupLink = document.getElementById("toggle-signup");

const checkNicknameBtn = document.getElementById("check-nickname-btn");
const emailInput = document.getElementById("email");
const nicknameInput = document.getElementById("nickname");
const nicknameMessage = document.getElementById("nickname-message");
let isNicknameAvailable = false; // 닉네임 중복 확인 상태 저장

// 로그인 <-> 회원가입 토글
toggleSignupLink.addEventListener("click", (e) => {
    e.preventDefault();

    if (loginForm.style.display === "none") {
        // 회원가입 → 로그인으로 전환
        showLoginForm();
    } else {
        // 로그인 → 회원가입으로 전환
        showSignupForm();
    }
});

function showLoginForm() {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    formTitle.textContent = "로그인";
    toggleSignupLink.textContent = "회원가입";
}

function showSignupForm() {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    formTitle.textContent = "회원가입";
    toggleSignupLink.textContent = "로그인";
}

checkNicknameBtn.addEventListener("click", async () => {

    const nickname = nicknameInput.value.trim();
    if (!nickname) {
        nicknameMessage.textContent = "닉네임을 입력해주세요.";
        nicknameMessage.style.color = "red";
        return;
    }

    try {
        // 서버에 중복 확인 요청 (GET 방식 예시)
        const response = await fetch(`/check-nickname?nickname=${encodeURIComponent(nickname)}`);
        const data = await response.json();

        if (data.available == false) {
            nicknameMessage.textContent = "사용 가능한 닉네임입니다.";
            nicknameMessage.style.color = "green";
            isNicknameAvailable = true;
        } else {
            nicknameMessage.textContent = "이미 사용 중인 닉네임입니다.";
            nicknameMessage.style.color = "red";
            isNicknameAvailable = false;
        }
    } catch (error) {
        nicknameMessage.textContent = "서버 오류가 발생했습니다.";
        nicknameMessage.style.color = "red";
        isNicknameAvailable = false;
        console.error(error);
    }
});


// 회원가입 제출 시 닉네임 중복 여부 체크
signupForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const pw = document.getElementById("signup-password").value;
    const confirmPw = document.getElementById("confirm-password").value;
    const email = emailInput.value.trim();
    const nickname = nicknameInput.value.trim();

    if (pw !== confirmPw) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    if (!isNicknameAvailable) {
        alert("닉네임 중복 확인을 해주세요.");
        return;
    }

    try {
        // 이메일 중복 체크 요청
        const response = await fetch(`/check-email?email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (data.available) {
            alert("이미 사용 중인 이메일입니다.");
            return;
        }
    } catch (error) {
        alert("이메일 중복 확인 중 오류가 발생했습니다.");
        return;
    }

    try {
        const signupResponse = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: pw,
                nickname: nickname
            })
        });

        const signupData = await signupResponse.json();

        if (signupData.success) {
            alert("회원가입이 완료되었습니다! 로그인 해주세요.");
            window.location.href = "/login";
        } else {
            alert("회원가입에 실패했습니다.");
        }
    } catch (error) {
        alert("회원가입 요청 중 오류가 발생했습니다.");
        console.error(error);
    }
});