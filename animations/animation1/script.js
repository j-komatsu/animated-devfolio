// 3D Logo Rotation Animation Script
// Three.js を使用した3Dロゴアニメーション

class Logo3DAnimation {
    constructor() {
        // シーン、カメラ、レンダラーの初期化
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.logo = null;
        this.lights = [];
        
        // アニメーション制御
        this.isPlaying = true;
        this.animationSpeed = 1.0;
        this.currentColor = 'blue';
        
        // マウスインタラクション
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        // キャンバス要素を取得
        const canvas = document.getElementById('three-canvas');
        const container = canvas.parentElement;
        
        // シーンの作成
        this.scene = new THREE.Scene();
        
        // カメラの設定
        this.camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // レンダラーの設定
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // ロゴの作成
        this.createLogo();
        
        // ライティングの設定
        this.setupLighting();
        
        // パーティクル効果の追加
        this.createParticles();
        
        // リサイズ対応
        this.setupResize();
    }
    
    createLogo() {
        // ロゴのジオメトリを作成（複数の図形を組み合わせ）
        const group = new THREE.Group();
        
        // メインキューブ
        const mainGeometry = new THREE.BoxGeometry(2, 2, 2);
        const mainMaterial = new THREE.MeshPhongMaterial({
            color: this.getColorValue(this.currentColor),
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        const mainCube = new THREE.Mesh(mainGeometry, mainMaterial);
        mainCube.castShadow = true;
        mainCube.receiveShadow = true;
        group.add(mainCube);
        
        // 装飾的な小さなキューブ
        for (let i = 0; i < 8; i++) {
            const smallGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const smallMaterial = new THREE.MeshPhongMaterial({
                color: this.getColorValue(this.currentColor),
                shininess: 150
            });
            const smallCube = new THREE.Mesh(smallGeometry, smallMaterial);
            
            // 円形に配置
            const angle = (i / 8) * Math.PI * 2;
            smallCube.position.x = Math.cos(angle) * 3;
            smallCube.position.y = Math.sin(angle) * 3;
            smallCube.position.z = Math.sin(angle * 2) * 0.5;
            
            smallCube.castShadow = true;
            group.add(smallCube);
        }
        
        // ワイヤーフレームリング
        const ringGeometry = new THREE.TorusGeometry(2.5, 0.1, 8, 50);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        group.add(ring);
        
        this.logo = group;
        this.scene.add(this.logo);
    }
    
    setupLighting() {
        // 環境光
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        this.lights.push(ambientLight);
        
        // ディレクショナルライト
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        this.lights.push(directionalLight);
        
        // ポイントライト（カラフル）
        const colors = [0xff0040, 0x0040ff, 0x40ff00];
        colors.forEach((color, index) => {
            const pointLight = new THREE.PointLight(color, 0.5, 10);
            const angle = (index / colors.length) * Math.PI * 2;
            pointLight.position.x = Math.cos(angle) * 4;
            pointLight.position.y = Math.sin(angle) * 4;
            pointLight.position.z = 2;
            this.scene.add(pointLight);
            this.lights.push(pointLight);
        });
    }
    
    createParticles() {
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 20;     // x
            positions[i + 1] = (Math.random() - 0.5) * 20; // y
            positions[i + 2] = (Math.random() - 0.5) * 20; // z
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.6
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(particleSystem);
        this.particles = particleSystem;
    }
    
    setupEventListeners() {
        // コントロールボタン
        const playBtn = document.getElementById('playBtn');
        const resetBtn = document.getElementById('resetBtn');
        const speedSlider = document.getElementById('speedSlider');
        const speedValue = document.getElementById('speedValue');
        const colorSelect = document.getElementById('colorSelect');
        
        playBtn.addEventListener('click', () => {
            this.isPlaying = !this.isPlaying;
            playBtn.textContent = this.isPlaying ? '停止' : '再生';
        });
        
        resetBtn.addEventListener('click', () => {
            this.resetAnimation();
        });
        
        speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
            speedValue.textContent = this.animationSpeed.toFixed(1) + 'x';
        });
        
        colorSelect.addEventListener('change', (e) => {
            this.currentColor = e.target.value;
            this.updateColors();
        });
        
        // マウスインタラクション
        const canvas = document.getElementById('three-canvas');
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        });
        
        canvas.addEventListener('mouseleave', () => {
            this.mouse.x = 0;
            this.mouse.y = 0;
        });
    }
    
    setupResize() {
        window.addEventListener('resize', () => {
            const canvas = document.getElementById('three-canvas');
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }
    
    getColorValue(colorName) {
        const colors = {
            blue: 0x4a90e2,
            red: 0xe74c3c,
            green: 0x2ecc71,
            purple: 0x9b59b6,
            rainbow: 0xffffff // レインボーは特別処理
        };
        return colors[colorName] || colors.blue;
    }
    
    updateColors() {
        if (!this.logo) return;
        
        const newColor = this.getColorValue(this.currentColor);
        
        this.logo.children.forEach((child) => {
            if (child.material && child.material.color) {
                if (this.currentColor === 'rainbow') {
                    // レインボー効果の実装
                    const hue = (Date.now() * 0.001) % 1;
                    child.material.color.setHSL(hue, 1, 0.5);
                } else {
                    child.material.color.setHex(newColor);
                }
            }
        });
    }
    
    resetAnimation() {
        if (this.logo) {
            // ロゴの回転をリセット
            this.logo.rotation.set(0, 0, 0);
            this.targetRotation = { x: 0, y: 0 };
            
            // 位置をリセット
            this.logo.position.set(0, 0, 0);
            
            // カメラ位置をリセット
            this.camera.position.set(0, 0, 5);
            this.camera.lookAt(0, 0, 0);
        }
        
        // アニメーションを再開
        this.isPlaying = true;
        document.getElementById('playBtn').textContent = '停止';
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.isPlaying && this.logo) {
            // 基本回転アニメーション
            this.logo.rotation.x += 0.005 * this.animationSpeed;
            this.logo.rotation.y += 0.01 * this.animationSpeed;
            
            // マウスインタラクション
            this.targetRotation.x = this.mouse.y * 0.5;
            this.targetRotation.y = this.mouse.x * 0.5;
            
            // スムーズな回転補間
            this.logo.rotation.x += (this.targetRotation.x - this.logo.rotation.x) * 0.05;
            this.logo.rotation.y += (this.targetRotation.y - this.logo.rotation.y) * 0.05;
            
            // 浮遊効果
            this.logo.position.y = Math.sin(Date.now() * 0.001) * 0.5;
            
            // 小さなキューブの個別回転
            this.logo.children.forEach((child, index) => {
                if (index > 0 && index <= 8) { // 小さなキューブのみ
                    child.rotation.x += 0.02 * this.animationSpeed;
                    child.rotation.z += 0.015 * this.animationSpeed;
                }
            });
            
            // パーティクルアニメーション
            if (this.particles) {
                this.particles.rotation.y += 0.001 * this.animationSpeed;
            }
            
            // レインボーカラーの更新
            if (this.currentColor === 'rainbow') {
                this.updateColors();
            }
            
            // ライトの動き
            this.lights.forEach((light, index) => {
                if (light.type === 'PointLight') {
                    const time = Date.now() * 0.001;
                    const angle = (index / 3) * Math.PI * 2 + time;
                    light.position.x = Math.cos(angle) * 4;
                    light.position.y = Math.sin(angle) * 4;
                }
            });
        }
        
        // レンダリング
        this.renderer.render(this.scene, this.camera);
    }
}

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    // Three.jsがロードされているかチェック
    if (typeof THREE !== 'undefined') {
        new Logo3DAnimation();
    } else {
        console.error('Three.js library not loaded');
        // フォールバック: エラーメッセージを表示
        const canvas = document.getElementById('three-canvas');
        canvas.style.display = 'flex';
        canvas.style.alignItems = 'center';
        canvas.style.justifyContent = 'center';
        canvas.style.fontSize = '1.2rem';
        canvas.style.color = '#ff6b6b';
        canvas.innerHTML = '⚠️ Three.js ライブラリの読み込みに失敗しました';
    }
});

// パフォーマンス監視
let fps = 0;
let lastTime = performance.now();

function updateFPS() {
    const currentTime = performance.now();
    fps = Math.round(1000 / (currentTime - lastTime));
    lastTime = currentTime;
    
    // コンソールに FPS を出力（開発用）
    if (fps < 30) {
        console.warn(`Low FPS detected: ${fps}`);
    }
}

// フレームレート監視（デバッグ用）
setInterval(updateFPS, 1000);

// エラーハンドリング
window.addEventListener('error', (e) => {
    console.error('Animation error:', e.error);
});

// メモリリーク防止
window.addEventListener('beforeunload', () => {
    // Three.jsリソースのクリーンアップ
    const canvas = document.getElementById('three-canvas');
    if (canvas && canvas.getContext) {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            gl.getExtension('WEBGL_lose_context').loseContext();
        }
    }
});