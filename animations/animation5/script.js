// Login UI Animation Script
// GSAPを使用したログイン画面UIアニメーション

class LoginUIAnimation {
    constructor() {
        // DOM要素
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.loginContainers = document.querySelectorAll('.login-container');
        this.playBtn = document.getElementById('playAnimation');
        this.resetBtn = document.getElementById('resetAnimation');
        this.speedSlider = document.getElementById('animationSpeed');
        this.speedDisplay = document.getElementById('speedDisplay');
        this.animationTypeSelect = document.getElementById('animationType');
        
        // アニメーション制御
        this.currentTheme = 'modern';
        this.animationSpeed = 1.0;
        this.animationType = 'fade';
        this.timeline = null;
        
        // フォーム要素
        this.forms = document.querySelectorAll('.login-form');
        
        this.init();
        this.setupEventListeners();
        
        // 初期アニメーション実行
        setTimeout(() => {
            this.playLoginAnimation();
        }, 1000);
    }
    
    init() {
        // GSAPのデフォルト設定
        gsap.defaults({
            duration: 0.6,
            ease: "power2.out"
        });
        
        // 初期状態を設定
        this.resetAllAnimations();
    }
    
    setupEventListeners() {
        // タブ切り替え
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.getAttribute('data-demo');
                this.switchTheme(theme);
            });
        });
        
        // アニメーション制御
        this.playBtn.addEventListener('click', () => {
            this.playLoginAnimation();
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.resetAllAnimations();
        });
        
        // 速度調整
        this.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
            this.speedDisplay.textContent = this.animationSpeed.toFixed(1) + 'x';
            
            // 現在のアニメーションの速度を更新
            if (this.timeline) {
                this.timeline.timeScale(this.animationSpeed);
            }
        });
        
        // アニメーションタイプ変更
        this.animationTypeSelect.addEventListener('change', (e) => {
            this.animationType = e.target.value;
        });
        
        // フォーム送信処理
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
        
        // 入力フィールドのインタラクション
        this.setupInputInteractions();
        
        // パスワード表示/非表示
        this.setupPasswordToggle();
        
        // ソーシャルログインボタン
        this.setupSocialButtons();
    }
    
    switchTheme(theme) {
        // アクティブタブの更新
        this.tabBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-demo="${theme}"]`).classList.add('active');
        
        // ログインコンテナの切り替え
        this.loginContainers.forEach(container => {
            container.classList.remove('active');
        });
        
        document.getElementById(`${theme}Demo`).classList.add('active');
        this.currentTheme = theme;
        
        // テーマ変更アニメーション
        this.animateThemeSwitch(theme);
    }
    
    animateThemeSwitch(theme) {
        const currentContainer = document.querySelector('.login-container.active');
        
        gsap.fromTo(currentContainer, {
            opacity: 0,
            scale: 0.9,
            y: 20
        }, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
    }
    
    playLoginAnimation() {
        const currentContainer = document.querySelector('.login-container.active');
        const card = currentContainer.querySelector('.login-card');
        
        // アニメーションタイムラインを作成
        this.timeline = gsap.timeline({
            defaults: {
                ease: "power2.out"
            }
        });
        
        // 速度を適用
        this.timeline.timeScale(this.animationSpeed);
        
        // アニメーションタイプに応じて実行
        switch (this.animationType) {
            case 'fade':
                this.playFadeAnimation(card);
                break;
            case 'slide':
                this.playSlideAnimation(card);
                break;
            case 'bounce':
                this.playBounceAnimation(card);
                break;
            case 'scale':
                this.playScaleAnimation(card);
                break;
            case 'rotate':
                this.playRotateAnimation(card);
                break;
        }
    }
    
    playFadeAnimation(card) {
        // 初期状態をリセット
        gsap.set(card.querySelectorAll('.login-header, .form-group, .form-options, .login-btn, .divider, .social-login, .signup-link'), {
            opacity: 0,
            y: 30
        });
        
        gsap.set(card, { opacity: 0, scale: 0.9 });
        
        this.timeline
            .to(card, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power2.out"
            })
            .to(card.querySelector('.login-header'), {
                opacity: 1,
                y: 0,
                duration: 0.6
            }, "-=0.4")
            .to(card.querySelectorAll('.form-group'), {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1
            }, "-=0.3")
            .to(card.querySelector('.form-options'), {
                opacity: 1,
                y: 0,
                duration: 0.4
            }, "-=0.2")
            .to(card.querySelector('.login-btn'), {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)"
            }, "-=0.1")
            .to([card.querySelector('.divider'), card.querySelector('.social-login'), card.querySelector('.signup-link')], {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.1
            }, "-=0.2");
    }
    
    playSlideAnimation(card) {
        gsap.set(card.querySelectorAll('.login-header, .form-group, .form-options, .login-btn, .divider, .social-login, .signup-link'), {
            opacity: 0,
            x: -50
        });
        
        gsap.set(card, { opacity: 0, x: -100 });
        
        this.timeline
            .to(card, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out"
            })
            .to(card.querySelectorAll('.login-header, .form-group, .form-options, .login-btn, .divider, .social-login, .signup-link'), {
                opacity: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.6");
    }
    
    playBounceAnimation(card) {
        gsap.set(card.querySelectorAll('.login-header, .form-group, .form-options, .login-btn, .divider, .social-login, .signup-link'), {
            opacity: 0,
            y: -50,
            scale: 0.5
        });
        
        gsap.set(card, { opacity: 0, scale: 0.3 });
        
        this.timeline
            .to(card, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "bounce.out"
            })
            .to(card.querySelectorAll('.login-header, .form-group, .form-options, .login-btn, .divider, .social-login, .signup-link'), {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "bounce.out"
            }, "-=0.6");
    }
    
    playScaleAnimation(card) {
        gsap.set(card.querySelectorAll('.login-header, .form-group, .form-options, .login-btn, .divider, .social-login, .signup-link'), {
            opacity: 0,
            scale: 0
        });
        
        gsap.set(card, { opacity: 0, scale: 0 });
        
        this.timeline
            .to(card, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "back.out(1.7)"
            })
            .to(card.querySelectorAll('.login-header, .form-group, .form-options, .login-btn, .divider, .social-login, .signup-link'), {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.out(1.7)"
            }, "-=0.6");
    }
    
    playRotateAnimation(card) {
        gsap.set(card.querySelectorAll('.login-header, .form-group, .form-options, .login-btn, .divider, .social-login, .signup-link'), {
            opacity: 0,
            rotation: 180,
            scale: 0.5
        });
        
        gsap.set(card, { opacity: 0, rotation: -180 });
        
        this.timeline
            .to(card, {
                opacity: 1,
                rotation: 0,
                duration: 1,
                ease: "power2.out"
            })
            .to(card.querySelectorAll('.login-header, .form-group, .form-options, .login-btn, .divider, .social-login, .signup-link'), {
                opacity: 1,
                rotation: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.8");
    }
    
    resetAllAnimations() {
        // 全てのアニメーションをリセット
        this.loginContainers.forEach(container => {
            const card = container.querySelector('.login-card');
            
            gsap.set(card, {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                rotation: 0
            });
            
            gsap.set(card.querySelectorAll('.login-header, .form-group, .form-options, .login-btn, .divider, .social-login, .signup-link'), {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0
            });
        });
        
        // タイムラインを停止
        if (this.timeline) {
            this.timeline.kill();
            this.timeline = null;
        }
    }
    
    setupInputInteractions() {
        const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
        
        inputs.forEach(input => {
            // フォーカス時のアニメーション
            input.addEventListener('focus', (e) => {
                const wrapper = e.target.closest('.input-wrapper');
                gsap.to(wrapper, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // ラベルアニメーション（存在する場合）
                const label = wrapper.parentElement.querySelector('label');
                if (label) {
                    gsap.to(label, {
                        color: '#4ecdc4',
                        scale: 0.9,
                        y: -5,
                        duration: 0.3
                    });
                }
            });
            
            input.addEventListener('blur', (e) => {
                const wrapper = e.target.closest('.input-wrapper');
                gsap.to(wrapper, {
                    scale: 1,
                    duration: 0.3
                });
                
                const label = wrapper.parentElement.querySelector('label');
                if (label) {
                    gsap.to(label, {
                        color: '#fff',
                        scale: 1,
                        y: 0,
                        duration: 0.3
                    });
                }
            });
            
            // 入力時のバリデーション
            input.addEventListener('input', (e) => {
                this.validateInput(e.target);
            });
        });
    }
    
    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        let isValid = true;
        let errorMessage = '';
        
        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value) || value === '';
            errorMessage = 'メールアドレスの形式が正しくありません';
        } else if (type === 'password') {
            isValid = value.length >= 6 || value === '';
            errorMessage = 'パスワードは6文字以上で入力してください';
        }
        
        const wrapper = input.closest('.input-wrapper');
        let errorEl = wrapper.parentElement.querySelector('.error-message');
        
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            wrapper.parentElement.appendChild(errorEl);
        }
        
        if (!isValid && value !== '') {
            input.classList.add('input-error');
            input.classList.remove('input-success');
            errorEl.textContent = errorMessage;
            errorEl.classList.add('show');
        } else if (value !== '') {
            input.classList.remove('input-error');
            input.classList.add('input-success');
            errorEl.classList.remove('show');
        } else {
            input.classList.remove('input-error', 'input-success');
            errorEl.classList.remove('show');
        }
    }
    
    setupPasswordToggle() {
        const toggleBtns = document.querySelectorAll('.toggle-password');
        
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = e.target.previousElementSibling;
                const isPassword = input.type === 'password';
                
                input.type = isPassword ? 'text' : 'password';
                e.target.textContent = isPassword ? '🙈' : '👁️';
                
                // ボタンアニメーション
                gsap.fromTo(e.target, {
                    scale: 1
                }, {
                    scale: 1.2,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
            });
        });
    }
    
    setupSocialButtons() {
        const socialBtns = document.querySelectorAll('.social-btn');
        
        socialBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // クリックアニメーション
                gsap.to(btn, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
                
                // 擬似的なログイン処理
                this.simulateSocialLogin(btn);
            });
        });
    }
    
    simulateSocialLogin(btn) {
        const originalText = btn.innerHTML;
        const service = btn.classList.contains('google') ? 'Google' : 'GitHub';
        
        // ローディング表示
        btn.innerHTML = `<div class="loading-spinner"></div> ${service}で認証中...`;
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = `✓ ${service}認証完了`;
            btn.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.background = '';
            }, 2000);
        }, 2000);
    }
    
    handleFormSubmit(form) {
        const submitBtn = form.querySelector('.login-btn');
        const emailInput = form.querySelector('input[type="email"]');
        const passwordInput = form.querySelector('input[type="password"]');
        
        // バリデーション
        this.validateInput(emailInput);
        this.validateInput(passwordInput);
        
        const hasErrors = form.querySelectorAll('.input-error').length > 0;
        const isEmpty = !emailInput.value.trim() || !passwordInput.value.trim();
        
        if (hasErrors || isEmpty) {
            // エラーアニメーション
            gsap.to(form, {
                x: -10,
                duration: 0.1,
                yoyo: true,
                repeat: 5,
                ease: "power2.inOut"
            });
            return;
        }
        
        // ローディングアニメーション
        this.animateFormSubmit(submitBtn);
    }
    
    animateFormSubmit(btn) {
        // ボタンをローディング状態に
        btn.classList.add('loading');
        btn.disabled = true;
        
        // 擬似的なAPI呼び出し
        setTimeout(() => {
            // 成功アニメーション
            btn.classList.remove('loading');
            btn.innerHTML = '✓ ログイン成功';
            btn.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
            
            // 成功エフェクト
            this.showSuccessEffect();
            
            // 元に戻す
            setTimeout(() => {
                btn.innerHTML = '<span class="btn-text">ログイン</span><span class="btn-loading"><div class="loading-spinner"></div></span>';
                btn.disabled = false;
                btn.style.background = '';
            }, 3000);
        }, 2500);
    }
    
    showSuccessEffect() {
        // 成功時のキラキラエフェクト
        const currentContainer = document.querySelector('.login-container.active');
        const card = currentContainer.querySelector('.login-card');
        
        for (let i = 0; i < 10; i++) {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                font-size: ${Math.random() * 20 + 10}px;
                pointer-events: none;
                z-index: 1000;
            `;
            
            card.appendChild(sparkle);
            
            gsap.fromTo(sparkle, {
                scale: 0,
                rotation: 0,
                opacity: 1
            }, {
                scale: 1.5,
                rotation: 360,
                opacity: 0,
                duration: 1.5,
                ease: "power2.out",
                onComplete: () => sparkle.remove()
            });
        }
        
        // カード全体の成功アニメーション
        gsap.to(card, {
            scale: 1.05,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    }
    
    // デモ用のランダムアニメーション
    playRandomAnimation() {
        const animations = ['fade', 'slide', 'bounce', 'scale', 'rotate'];
        const randomType = animations[Math.floor(Math.random() * animations.length)];
        
        this.animationType = randomType;
        this.animationTypeSelect.value = randomType;
        this.playLoginAnimation();
    }
}

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        const loginUI = new LoginUIAnimation();
        window.loginUI = loginUI; // デバッグ用
        
        // 定期的なデモアニメーション（オプション）
        if (window.location.search.includes('demo=auto')) {
            setInterval(() => {
                loginUI.playRandomAnimation();
            }, 10000);
        }
    } else {
        console.error('GSAP library not loaded');
        document.querySelector('.demo-container').innerHTML = 
            '<div style="text-align: center; color: #ff6b6b; padding: 3rem;"><h3>⚠️ GSAPライブラリが読み込まれていません</h3><p>アニメーションを表示するにはGSAPが必要です。</p></div>';
    }
});

// キーボードショートカット
document.addEventListener('keydown', (e) => {
    if (window.loginUI) {
        switch (e.key) {
            case ' ':
                if (e.ctrlKey) {
                    e.preventDefault();
                    window.loginUI.playLoginAnimation();
                }
                break;
            case 'r':
                if (e.ctrlKey) {
                    e.preventDefault();
                    window.loginUI.resetAllAnimations();
                }
                break;
            case '1':
            case '2':
            case '3':
            case '4':
                if (e.ctrlKey) {
                    e.preventDefault();
                    const themes = ['modern', 'glassmorphism', 'minimal', 'dark'];
                    const themeIndex = parseInt(e.key) - 1;
                    if (themes[themeIndex]) {
                        window.loginUI.switchTheme(themes[themeIndex]);
                    }
                }
                break;
        }
    }
});

// パフォーマンス監視
let animationCount = 0;
const originalTimeline = gsap.timeline;

gsap.timeline = function(...args) {
    animationCount++;
    if (animationCount % 10 === 0) {
        console.log(`Active animations: ${animationCount}`);
    }
    return originalTimeline.apply(this, args);
};

// リサイズ対応
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // リサイズ後のレスポンシブ調整
        const cards = document.querySelectorAll('.login-card');
        cards.forEach(card => {
            gsap.set(card, { clearProps: "all" });
        });
    }, 250);
});

// メモリリーク防止
window.addEventListener('beforeunload', () => {
    if (window.loginUI && window.loginUI.timeline) {
        window.loginUI.timeline.kill();
        gsap.killTweensOf("*");
    }
});

// エラーハンドリング
window.addEventListener('error', (e) => {
    if (e.error && e.error.message.includes('gsap')) {
        console.error('GSAP Animation Error:', e.error);
    }
});

// デバッグヘルパー（開発時のみ）
if (window.location.search.includes('debug=true')) {
    window.debugLogin = {
        playAnimation: (type) => {
            if (window.loginUI) {
                window.loginUI.animationType = type;
                window.loginUI.playLoginAnimation();
            }
        },
        switchTheme: (theme) => {
            if (window.loginUI) {
                window.loginUI.switchTheme(theme);
            }
        },
        triggerError: () => {
            const form = document.querySelector('.login-form');
            if (form) {
                const emailInput = form.querySelector('input[type="email"]');
                emailInput.value = 'invalid-email';
                window.loginUI.validateInput(emailInput);
            }
        }
    };
    
    console.log('Debug mode enabled. Use window.debugLogin for testing.');
}