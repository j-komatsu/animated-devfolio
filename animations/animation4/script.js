// Interactive Globe Animation - Canvas 2D Implementation
// シンプルで確実に動作する地球儀アニメーション

class InteractiveGlobe2D {
    constructor() {
        // Canvas要素の取得
        this.canvas = document.getElementById('globe-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 基本設定
        this.setupCanvas();
        
        // アニメーション制御
        this.isAutoRotating = true;
        this.rotationSpeed = 1.0;
        this.rotation = 0;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.targetRotation = 0;
        
        // DOM要素
        this.autoRotateBtn = document.getElementById('autoRotateBtn');
        this.resetViewBtn = document.getElementById('resetViewBtn');
        this.speedSlider = document.getElementById('rotationSpeed');
        this.speedDisplay = document.getElementById('speedDisplay');
        
        // 都市データ
        this.cities = {
            tokyo: { lat: 35.6762, lon: 139.6503, name: '東京', country: '日本', population: '1400万人', timezone: 'JST (UTC+9)' },
            newyork: { lat: 40.7128, lon: -74.0060, name: 'ニューヨーク', country: 'アメリカ', population: '850万人', timezone: 'EST (UTC-5)' },
            london: { lat: 51.5074, lon: -0.1278, name: 'ロンドン', country: 'イギリス', population: '900万人', timezone: 'GMT (UTC+0)' },
            singapore: { lat: 1.3521, lon: 103.8198, name: 'シンガポール', country: 'シンガポール', population: '580万人', timezone: 'SGT (UTC+8)' }
        };
        
        // 星の位置（固定）
        this.stars = this.generateStars();
        
        this.init();
    }
    
    setupCanvas() {
        // キャンバスサイズの調整
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        // 描画設定
        this.centerX = rect.width / 2;
        this.centerY = rect.height / 2;
        this.radius = Math.min(rect.width, rect.height) / 4;
        
        // Canvas スタイル
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    generateStars() {
        const stars = [];
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * this.canvas.width / window.devicePixelRatio,
                y: Math.random() * this.canvas.height / window.devicePixelRatio,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2
            });
        }
        return stars;
    }
    
    init() {
        console.log('Globe2D initialization starting...');
        
        this.setupEventListeners();
        this.animate();
        this.updateStats();
        
        // 成功通知
        this.showNotification('🌍 地球儀が読み込まれました！', 'success');
        
        console.log('Globe2D initialization completed');
    }
    
    setupEventListeners() {
        // コントロールボタン
        this.autoRotateBtn.addEventListener('click', () => {
            this.isAutoRotating = !this.isAutoRotating;
            this.autoRotateBtn.textContent = this.isAutoRotating ? '自動回転 OFF' : '自動回転 ON';
            this.autoRotateBtn.classList.toggle('btn-primary');
            this.autoRotateBtn.classList.toggle('btn-secondary');
        });
        
        this.resetViewBtn.addEventListener('click', () => {
            this.resetView();
        });
        
        // 速度調整
        this.speedSlider.addEventListener('input', (e) => {
            this.rotationSpeed = parseFloat(e.target.value);
            this.speedDisplay.textContent = this.rotationSpeed.toFixed(1);
        });
        
        // マウス操作
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.onMouseUp());
        this.canvas.addEventListener('click', (e) => this.onCanvasClick(e));
        
        // タッチ操作
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.canvas.addEventListener('touchend', () => this.onTouchEnd());
        
        // 都市カード
        document.querySelectorAll('.city-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const cityKey = e.currentTarget.getAttribute('data-city');
                this.focusOnCity(cityKey);
            });
        });
        
        // リサイズ対応
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.stars = this.generateStars();
        });
    }
    
    onMouseDown(e) {
        this.isDragging = true;
        this.lastMouseX = e.clientX;
        this.isAutoRotating = false;
        this.autoRotateBtn.textContent = '自動回転 ON';
        this.autoRotateBtn.classList.remove('btn-primary');
        this.autoRotateBtn.classList.add('btn-secondary');
    }
    
    onMouseMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.lastMouseX;
        this.targetRotation += deltaX * 0.01;
        this.lastMouseX = e.clientX;
    }
    
    onMouseUp() {
        this.isDragging = false;
    }
    
    onTouchStart(e) {
        if (e.touches.length === 1) {
            this.isDragging = true;
            this.lastMouseX = e.touches[0].clientX;
            this.isAutoRotating = false;
        }
    }
    
    onTouchMove(e) {
        e.preventDefault();
        if (e.touches.length === 1 && this.isDragging) {
            const deltaX = e.touches[0].clientX - this.lastMouseX;
            this.targetRotation += deltaX * 0.01;
            this.lastMouseX = e.touches[0].clientX;
        }
    }
    
    onTouchEnd() {
        this.isDragging = false;
    }
    
    onCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 地球の範囲内かチェック
        const distance = Math.sqrt((x - this.centerX) ** 2 + (y - this.centerY) ** 2);
        
        if (distance <= this.radius) {
            // 地球をクリックした場合
            this.showNotification('🌍 地球をクリックしました！', 'info');
        }
    }
    
    focusOnCity(cityKey) {
        const city = this.cities[cityKey];
        if (!city) return;
        
        // 都市に回転をフォーカス
        const targetRotation = -city.lon * (Math.PI / 180);
        
        // スムーズに回転
        const startRotation = this.rotation;
        const rotationDiff = targetRotation - startRotation;
        const duration = 2000; // 2秒
        const startTime = Date.now();
        
        const animateToCity = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOut
            
            this.rotation = startRotation + rotationDiff * easeProgress;
            
            if (progress < 1) {
                requestAnimationFrame(animateToCity);
            } else {
                this.showCityInfo(city);
            }
        };
        
        animateToCity();
    }
    
    showCityInfo(city) {
        const locationName = document.getElementById('locationName');
        const population = document.getElementById('population');
        const area = document.getElementById('area');
        const timezone = document.getElementById('timezone');
        
        locationName.textContent = city.name;
        population.textContent = city.population;
        area.textContent = city.country;
        timezone.textContent = city.timezone;
        
        this.showNotification(`📍 ${city.name} に移動しました`, 'success');
    }
    
    resetView() {
        this.rotation = 0;
        this.targetRotation = 0;
        this.isAutoRotating = true;
        this.rotationSpeed = 1.0;
        
        this.autoRotateBtn.textContent = '自動回転 OFF';
        this.autoRotateBtn.classList.add('btn-primary');
        this.autoRotateBtn.classList.remove('btn-secondary');
        
        this.speedSlider.value = 1.0;
        this.speedDisplay.textContent = '1.0';
        
        this.showNotification('🔄 視点をリセットしました', 'info');
    }
    
    animate() {
        // 背景をクリア
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvas.width / window.devicePixelRatio, this.canvas.height / window.devicePixelRatio);
        
        // 星空を描画
        this.drawStars();
        
        // 地球を描画
        this.drawEarth();
        
        // 都市マーカーを描画
        this.drawCityMarkers();
        
        // 大気圏を描画
        this.drawAtmosphere();
        
        // 回転更新
        if (this.isAutoRotating) {
            this.rotation += 0.005 * this.rotationSpeed;
        } else {
            // マウス操作時のスムーズな回転
            this.rotation += (this.targetRotation - this.rotation) * 0.05;
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawStars() {
        this.stars.forEach(star => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawEarth() {
        // 地球のシャドウ
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(this.centerX + 5, this.centerY + 5, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 地球本体のグラデーション
        const gradient = this.ctx.createRadialGradient(
            this.centerX - this.radius * 0.3, this.centerY - this.radius * 0.3, 0,
            this.centerX, this.centerY, this.radius
        );
        gradient.addColorStop(0, '#4a90e2');
        gradient.addColorStop(0.7, '#2171b5');
        gradient.addColorStop(1, '#08306b');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 陸地を描画
        this.drawContinents();
    }
    
    drawContinents() {
        const continents = [
            // アフリカ
            { x: 0.1, y: 0.1, w: 0.3, h: 0.6 },
            // ユーラシア
            { x: 0.2, y: -0.3, w: 0.6, h: 0.4 },
            // 南北アメリカ
            { x: -0.6, y: 0, w: 0.3, h: 0.8 },
            // オーストラリア
            { x: 0.6, y: 0.4, w: 0.2, h: 0.15 }
        ];
        
        this.ctx.fillStyle = '#2ecc71';
        
        continents.forEach(continent => {
            const x = this.centerX + (continent.x * this.radius * Math.cos(this.rotation + continent.x));
            const y = this.centerY + (continent.y * this.radius);
            const w = continent.w * this.radius;
            const h = continent.h * this.radius;
            
            // 前面にある場合のみ描画
            if (Math.cos(this.rotation + continent.x) > 0) {
                this.ctx.save();
                this.ctx.globalAlpha = Math.cos(this.rotation + continent.x);
                this.ctx.fillRect(x - w/2, y - h/2, w, h);
                this.ctx.restore();
            }
        });
    }
    
    drawCityMarkers() {
        Object.values(this.cities).forEach(city => {
            const phi = (90 - city.lat) * (Math.PI / 180);
            const theta = (city.lon + 180) * (Math.PI / 180) + this.rotation;
            
            const x = this.centerX + this.radius * Math.sin(phi) * Math.cos(theta);
            const y = this.centerY - this.radius * Math.cos(phi);
            const z = this.radius * Math.sin(phi) * Math.sin(theta);
            
            // 前面に表示される場合のみ
            if (z > 0) {
                // マーカーのパルス効果
                const pulseScale = 1 + Math.sin(Date.now() * 0.005) * 0.3;
                
                // マーカー本体
                this.ctx.fillStyle = '#00d4ff';
                this.ctx.beginPath();
                this.ctx.arc(x, y, 6 * pulseScale, 0, Math.PI * 2);
                this.ctx.fill();
                
                // マーカーの外周
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 6 * pulseScale, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // 都市名
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(city.name, x, y - 15);
            }
        });
    }
    
    drawAtmosphere() {
        const atmosphereGradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY, this.radius,
            this.centerX, this.centerY, this.radius + 30
        );
        atmosphereGradient.addColorStop(0, 'rgba(135, 206, 250, 0.4)');
        atmosphereGradient.addColorStop(1, 'rgba(135, 206, 250, 0)');
        
        this.ctx.fillStyle = atmosphereGradient;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius + 30, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    updateStats() {
        // 統計をアニメーション付きで更新
        this.animateCounter('countriesCount', 195, 2000);
        this.animateCounter('citiesCount', 4416, 2500);
        this.animateCounter('timezonesCount', 24, 1500);
        this.animateCounter('languagesCount', 7139, 3000);
    }
    
    animateCounter(elementId, targetValue, duration) {
        const element = document.getElementById(elementId);
        const startValue = 0;
        const startTime = Date.now();
        
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        updateCounter();
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const bgColor = type === 'success' ? 'rgba(46, 204, 113, 0.9)' : 
                       type === 'error' ? 'rgba(231, 76, 60, 0.9)' : 
                       'rgba(0, 212, 255, 0.9)';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: bold;
            z-index: 10000;
            animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 3000);
    }
}

// 追加のCSSアニメーション
const additionalStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    #globe-canvas {
        cursor: grab;
    }
    
    #globe-canvas:active {
        cursor: grabbing;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Starting Globe2D initialization...');
        const globe = new InteractiveGlobe2D();
        window.globe2D = globe; // デバッグ用
        console.log('Globe2D successfully initialized');
    } catch (error) {
        console.error('Globe2D initialization failed:', error);
        
        // エラー時の代替表示
        const canvas = document.getElementById('globe-canvas');
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#ff6b6b';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ 地球儀の初期化に失敗しました', canvas.width / 2, canvas.height / 2);
    }
});

// エラーハンドリング
window.addEventListener('error', (e) => {
    console.error('Globe animation error:', e.error);
});

// パフォーマンス監視
let frameCount = 0;
let lastTime = performance.now();

function updateFPS() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        if (fps < 30) {
            console.warn(`Low FPS detected: ${fps}`);
        }
        
        frameCount = 0;
        lastTime = currentTime;
    }
}

// FPS監視（デバッグ用）
if (window.location.search.includes('debug=true')) {
    setInterval(updateFPS, 1000);
    console.log('Debug mode enabled. FPS monitoring active.');
}