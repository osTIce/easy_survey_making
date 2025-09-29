// --- DOM 요소 ---
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const formTitle = document.getElementById("form-title");
const toggleSignupLink = document.getElementById("toggle-signup");

const emailInput = document.getElementById("email");
const emailMessage = document.getElementById("email-message");
const nicknameInput = document.getElementById("nickname");
const nicknameMessage = document.getElementById("nickname-message");
const checkNicknameBtn = document.getElementById("check-nickname-btn");

const passwordInput = document.getElementById("signup-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const passwordMessage = document.getElementById("password-message");
const confirmPasswordMessage = document.getElementById("confirm-password-message");

let isNicknameAvailable = false;

// --- 정규식 ---
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const nicknameRegex = /^[a-zA-Z0-9가-힣_]{2,12}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-=/]).{8,20}$/;

// --- 폼 토글 ---
toggleSignupLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (loginForm.style.display === "none") showLoginForm();
    else showSignupForm();
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

// --- 유효성 검사 ---
function validateEmail() {
    const email = emailInput.value.trim();
    if (!email) return setMessage(emailMessage, "이메일을 입력해주세요.", "red");
    if (!emailRegex.test(email)) return setMessage(emailMessage, "올바른 이메일 형식이 아닙니다.", "red");
    return setMessage(emailMessage, "사용 가능한 이메일 형식입니다.", "green");
}

function validateNickname() {
    const nickname = nicknameInput.value.trim();
    if (!nickname) return setMessage(nicknameMessage, "닉네임을 입력해주세요.", "red");
    if (!nicknameRegex.test(nickname)) return setMessage(nicknameMessage, "닉네임은 2~12자의 한글, 영어, 숫자, _ 만 가능합니다.", "red");
    return true;
}

function validatePassword() {
    const pw = passwordInput.value;
    if (!passwordRegex.test(pw)) return setMessage(passwordMessage, "비밀번호는 8~20자, 대소문자, 숫자, 특수문자를 모두 포함해야 합니다.", "red");
    return setMessage(passwordMessage, "사용 가능한 비밀번호입니다.", "green");
}

function validateConfirmPassword() {
    const pw = passwordInput.value;
    const confirmPw = confirmPasswordInput.value;
    if (!confirmPw) return setMessage(confirmPasswordMessage, "", "");
    if (pw === confirmPw) return setMessage(confirmPasswordMessage, "비밀번호가 일치합니다.", "green");
    return setMessage(confirmPasswordMessage, "비밀번호가 일치하지 않습니다.", "red");
}

function setMessage(element, text, color) {
    element.textContent = text;
    element.style.color = color;
    return text === "" || color === "green";
}

// --- 이벤트 리스너 ---
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", validatePassword);
confirmPasswordInput.addEventListener("input", validateConfirmPassword);

nicknameInput.addEventListener("input", () => {
    isNicknameAvailable = false;
    setMessage(nicknameMessage, "닉네임 중복 확인을 해주세요.", "orange");
});

// 닉네임 중복 확인
checkNicknameBtn.addEventListener("click", async () => {
    if (!validateNickname()) return;

    const nickname = nicknameInput.value.trim();
    try {
        const response = await fetch(`/check-nickname?nickname=${encodeURIComponent(nickname)}`);
        const data = await response.json();

        if (!data.available) {
            setMessage(nicknameMessage, "사용 가능한 닉네임입니다.", "green");
            isNicknameAvailable = true;
        } else {
            setMessage(nicknameMessage, "이미 사용 중인 닉네임입니다.", "red");
            isNicknameAvailable = false;
        }
    } catch (err) {
        setMessage(nicknameMessage, "서버 오류가 발생했습니다.", "red");
        isNicknameAvailable = false;
        console.error(err);
    }
});

// --- 회원가입 제출 ---
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateEmail()) return;
    if (!validatePassword()) return;
    if (!validateConfirmPassword()) return;
    if (!validateNickname()) return;

    if (!isNicknameAvailable) {
        alert("닉네임 중복 확인을 해주세요.");
        return;
    }

    const email = emailInput.value.trim();
    const nickname = nicknameInput.value.trim();
    const password = passwordInput.value;

    // 이메일 중복 체크
    try {
        const res = await fetch(`/check-email?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.available) {
            alert("이미 사용 중인 이메일입니다.");
            return;
        }
    } catch (err) {
        alert("이메일 중복 확인 중 오류가 발생했습니다.");
        console.error(err);
        return;
    }

    // 회원가입 요청
    try {
        const signupRes = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, nickname })
        });
        const signupData = await signupRes.json();

        if (signupData.success) {
            alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
            window.location.href = "/login"; // 새로고침 후 로그인 페이지 이동
        } else {
            alert(signupData.message || "회원가입에 실패했습니다.");
        }
    } catch (err) {
        alert("회원가입 요청 중 오류가 발생했습니다.");
        console.error(err);
    }
});