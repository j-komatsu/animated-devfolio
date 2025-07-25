// Sales Chart Growth Animation Script
// Chart.jsとGSAPを使用した売上データアニメーション

class SalesChartAnimation {
    constructor() {
        // チャートインスタンス
        this.charts = {};
        
        // アニメーション制御
        this.isPlaying = false;
        this.isPaused = false;
        this.animationSpeed = 1.0;
        this.currentDataset = 'tech-company';
        this.currentTheme = 'default';
        
        // DOM要素
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        this.datasetSelect = document.getElementById('datasetSelect');
        this.themeSelect = document.getElementById('themeSelect');
        
        // 統計要素
        this.totalSalesEl = document.getElementById('totalSales');
        this.growthEl = document.getElementById('growth');
        this.customersEl = document.getElementById('customers');
        
        // KPI要素
        this.revenueGrowthEl = document.getElementById('revenueGrowth');
        this.customerAcquisitionEl = document.getElementById('customerAcquisition');
        this.arpuEl = document.getElementById('arpu');
        this.satisfactionEl = document.getElementById('satisfaction');
        
        // データセット
        this.datasets = {
            'tech-company': {
                name: 'IT企業',
                salesData: [120, 190, 300, 500, 720, 980, 1200, 1450, 1680, 1920, 2200, 2500],
                categoryData: [35, 25, 20, 15, 5],
                regionData: [450, 380, 320, 280, 150],
                trendData: [100, 125, 145, 180, 220, 270, 320, 380, 450, 520, 600, 700],
                kpis: {
                    revenueGrowth: 145,
                    customerAcquisition: 1250,
                    arpu: 12500,
                    satisfaction: 92
                }
            },
            'retail': {
                name: '小売業',
                salesData: [800, 920, 1100, 1350, 1200, 1450, 1680, 1520, 1750, 1890, 2100, 2300],
                categoryData: [40, 30, 15, 10, 5],
                regionData: [520, 480, 380, 320, 200],
                trendData: [600, 650, 720, 800, 750, 850, 920, 880, 950, 1020, 1100, 1180],
                kpis: {
                    revenueGrowth: 125,
                    customerAcquisition: 2800,
                    arpu: 8500,
                    satisfaction: 87
                }
            },
            'startup': {
                name: 'スタートアップ',
                salesData: [5, 12, 28, 45, 80, 120, 180, 280, 420, 650, 950, 1400],
                categoryData: [50, 30, 15, 3, 2],
                regionData: [280, 250, 180, 120, 80],
                trendData: [5, 15, 35, 60, 100, 150, 220, 320, 450, 620, 830, 1100],
                kpis: {
                    revenueGrowth: 280,
                    customerAcquisition: 850,
                    arpu: 15000,
                    satisfaction: 95
                }
            },
            'enterprise': {
                name: '大企業',
                salesData: [2000, 2100, 2200, 2350, 2300, 2450, 2600, 2720, 2850, 2950, 3100, 3200],
                categoryData: [30, 25, 20, 15, 10],
                regionData: [800, 650, 520, 450, 380],
                trendData: [1800, 1850, 1920, 2000, 1980, 2050, 2150, 2200, 2280, 2350, 2450, 2500],
                kpis: {
                    revenueGrowth: 115,
                    customerAcquisition: 5200,
                    arpu: 25000,
                    satisfaction: 89
                }
            }
        };
        
        this.init();
        this.setupEventListeners();
    }
    
    init() {
        // Chart.jsのデフォルト設定
        Chart.defaults.font.family = "'Arial', sans-serif";
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = false;
        
        this.createCharts();
        this.resetAnimation();
    }
    
    createCharts() {
        // メイン売上チャート
        this.charts.sales = new Chart(document.getElementById('salesChart'), {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [{
                    label: '売上 (万円)',
                    data: new Array(12).fill(0),
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4ecdc4',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '¥' + value + '万';
                            }
                        }
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });
        
        // カテゴリ別円グラフ
        this.charts.category = new Chart(document.getElementById('categoryChart'), {
            type: 'doughnut',
            data: {
                labels: ['Web開発', 'モバイル', 'AI/ML', 'クラウド', 'その他'],
                datasets: [{
                    data: new Array(5).fill(0),
                    backgroundColor: [
                        '#ff6b6b',
                        '#4ecdc4', 
                        '#45b7d1',
                        '#f093fb',
                        '#feca57'
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });
        
        // 地域別棒グラフ
        this.charts.region = new Chart(document.getElementById('regionChart'), {
            type: 'bar',
            data: {
                labels: ['東京', '大阪', '名古屋', '福岡', 'その他'],
                datasets: [{
                    label: '売上 (万円)',
                    data: new Array(5).fill(0),
                    backgroundColor: [
                        'rgba(255, 107, 107, 0.8)',
                        'rgba(78, 205, 196, 0.8)',
                        'rgba(69, 183, 209, 0.8)',
                        'rgba(240, 147, 251, 0.8)',
                        'rgba(254, 202, 87, 0.8)'
                    ],
                    borderColor: [
                        '#ff6b6b',
                        '#4ecdc4',
                        '#45b7d1', 
                        '#f093fb',
                        '#feca57'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '¥' + value + '万';
                            }
                        }
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });
        
        // トレンド分析チャート
        this.charts.trend = new Chart(document.getElementById('trendChart'), {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                datasets: [{
                    label: '実績',
                    data: new Array(12).fill(0),
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }, {
                    label: '予測',
                    data: new Array(12).fill(0),
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '¥' + value + '万';
                            }
                        }
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startAnimation());
        this.pauseBtn.addEventListener('click', () => this.pauseAnimation());
        this.resetBtn.addEventListener('click', () => this.resetAnimation());
        
        this.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
            this.speedValue.textContent = this.animationSpeed.toFixed(1) + 'x';
        });
        
        this.datasetSelect.addEventListener('change', (e) => {
            this.currentDataset = e.target.value;
            this.resetAnimation();
        });
        
        this.themeSelect.addEventListener('change', (e) => {
            this.currentTheme = e.target.value;
            this.applyTheme(e.target.value);
        });
    }
    
    async startAnimation() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.isPaused = false;
        this.startBtn.textContent = 'アニメーション中...';
        this.startBtn.disabled = true;
        
        try {
            await this.animateCharts();
        } catch (error) {
            console.error('Animation error:', error);
        } finally {
            this.isPlaying = false;
            this.startBtn.textContent = '開始';
            this.startBtn.disabled = false;
        }
    }
    
    pauseAnimation() {
        if (!this.isPlaying) return;
        
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? '再開' : '一時停止';
    }
    
    resetAnimation() {
        this.isPlaying = false;
        this.isPaused = false;
        
        // チャートデータをリセット
        Object.values(this.charts).forEach(chart => {
            chart.data.datasets.forEach(dataset => {
                dataset.data = dataset.data.map(() => 0);
            });
            chart.update('none');
        });
        
        // 統計値をリセット
        this.totalSalesEl.textContent = '¥0';
        this.growthEl.textContent = '+0%';
        this.customersEl.textContent = '0';
        
        // KPI値をリセット
        this.revenueGrowthEl.textContent = '0%';
        this.customerAcquisitionEl.textContent = '0';
        this.arpuEl.textContent = '¥0';
        this.satisfactionEl.textContent = '0%';
        
        this.startBtn.textContent = '開始';
        this.startBtn.disabled = false;
        this.pauseBtn.textContent = '一時停止';
    }
    
    async animateCharts() {
        const dataset = this.datasets[this.currentDataset];
        const duration = 3000 / this.animationSpeed;
        
        // 複数のアニメーションを並行実行
        const animations = [
            this.animateLineChart(this.charts.sales, dataset.salesData, duration),
            this.animateDoughnutChart(this.charts.category, dataset.categoryData, duration + 500),
            this.animateBarChart(this.charts.region, dataset.regionData, duration + 1000),
            this.animateTrendChart(this.charts.trend, dataset.trendData, duration + 1500),
            this.animateStats(dataset, duration),
            this.animateKPIs(dataset.kpis, duration + 2000)
        ];
        
        await Promise.all(animations);
        
        // 完了効果
        this.showCompletionEffect();
    }
    
    async animateLineChart(chart, targetData, duration) {
        return new Promise((resolve) => {
            const originalData = [...chart.data.datasets[0].data];
            
            gsap.to({}, {
                duration: duration / 1000,
                ease: "power2.out",
                onUpdate: function() {
                    const progress = this.progress();
                    
                    chart.data.datasets[0].data = originalData.map((original, index) => {
                        const target = targetData[index];
                        return original + (target - original) * progress;
                    });
                    
                    chart.update('none');
                },
                onComplete: () => {
                    chart.data.datasets[0].data = targetData;
                    chart.update();
                    resolve();
                }
            });
        });
    }
    
    async animateDoughnutChart(chart, targetData, duration) {
        return new Promise((resolve) => {
            const originalData = [...chart.data.datasets[0].data];
            
            gsap.to({}, {
                duration: duration / 1000,
                ease: "back.out(1.7)",
                onUpdate: function() {
                    const progress = this.progress();
                    
                    chart.data.datasets[0].data = originalData.map((original, index) => {
                        const target = targetData[index];
                        return original + (target - original) * progress;
                    });
                    
                    chart.update('none');
                },
                onComplete: () => {
                    chart.data.datasets[0].data = targetData;
                    chart.update();
                    resolve();
                }
            });
        });
    }
    
    async animateBarChart(chart, targetData, duration) {
        return new Promise((resolve) => {
            const originalData = [...chart.data.datasets[0].data];
            
            gsap.to({}, {
                duration: duration / 1000,
                ease: "bounce.out",
                onUpdate: function() {
                    const progress = this.progress();
                    
                    chart.data.datasets[0].data = originalData.map((original, index) => {
                        const target = targetData[index];
                        return original + (target - original) * progress;
                    });
                    
                    chart.update('none');
                },
                onComplete: () => {
                    chart.data.datasets[0].data = targetData;
                    chart.update();
                    resolve();
                }
            });
        });
    }
    
    async animateTrendChart(chart, targetData, duration) {
        return new Promise((resolve) => {
            const originalData = [...chart.data.datasets[0].data];
            const forecastData = targetData.map(val => val * 1.15); // 予測値は15%増し
            
            gsap.to({}, {
                duration: duration / 1000,
                ease: "power2.inOut",
                onUpdate: function() {
                    const progress = this.progress();
                    
                    chart.data.datasets[0].data = originalData.map((original, index) => {
                        const target = targetData[index];
                        return original + (target - original) * progress;
                    });
                    
                    chart.data.datasets[1].data = originalData.map((original, index) => {
                        const target = forecastData[index];
                        return original + (target - original) * progress;
                    });
                    
                    chart.update('none');
                },
                onComplete: () => {
                    chart.data.datasets[0].data = targetData;
                    chart.data.datasets[1].data = forecastData;
                    chart.update();
                    resolve();
                }
            });
        });
    }
    
    async animateStats(dataset, duration) {
        const totalSales = dataset.salesData.reduce((sum, val) => sum + val, 0);
        const growth = dataset.kpis.revenueGrowth - 100;
        const customers = dataset.kpis.customerAcquisition;
        
        // 総売上のカウントアップ
        gsap.to({ value: 0 }, {
            value: totalSales,
            duration: duration / 1000,
            ease: "power2.out",
            onUpdate: function() {
                this.targets()[0].value = Math.floor(this.targets()[0].value);
                document.getElementById('totalSales').textContent = 
                    '¥' + this.targets()[0].value.toLocaleString() + '万';
            }
        });
        
        // 成長率のカウントアップ
        gsap.to({ value: 0 }, {
            value: growth,
            duration: duration / 1000,
            ease: "power2.out",
            onUpdate: function() {
                this.targets()[0].value = Math.floor(this.targets()[0].value);
                document.getElementById('growth').textContent = 
                    '+' + this.targets()[0].value + '%';
            }
        });
        
        // 顧客数のカウントアップ
        gsap.to({ value: 0 }, {
            value: customers,
            duration: duration / 1000,
            ease: "power2.out",
            onUpdate: function() {
                this.targets()[0].value = Math.floor(this.targets()[0].value);
                document.getElementById('customers').textContent = 
                    this.targets()[0].value.toLocaleString();
            }
        });
    }
    
    async animateKPIs(kpis, duration) {
        const animations = [
            // 売上成長率
            gsap.to({ value: 0 }, {
                value: kpis.revenueGrowth,
                duration: duration / 1000,
                ease: "power2.out",
                onUpdate: function() {
                    document.getElementById('revenueGrowth').textContent = 
                        Math.floor(this.targets()[0].value) + '%';
                }
            }),
            
            // 新規顧客獲得
            gsap.to({ value: 0 }, {
                value: kpis.customerAcquisition,
                duration: duration / 1000,
                ease: "power2.out",
                onUpdate: function() {
                    document.getElementById('customerAcquisition').textContent = 
                        Math.floor(this.targets()[0].value).toLocaleString();
                }
            }),
            
            // ARPU
            gsap.to({ value: 0 }, {
                value: kpis.arpu,
                duration: duration / 1000,
                ease: "power2.out",
                onUpdate: function() {
                    document.getElementById('arpu').textContent = 
                        '¥' + Math.floor(this.targets()[0].value).toLocaleString();
                }
            }),
            
            // 顧客満足度
            gsap.to({ value: 0 }, {
                value: kpis.satisfaction,
                duration: duration / 1000,
                ease: "power2.out",
                onUpdate: function() {
                    document.getElementById('satisfaction').textContent = 
                        Math.floor(this.targets()[0].value) + '%';
                }
            })
        ];
        
        return Promise.all(animations);
    }
    
    showCompletionEffect() {
        // チャートコンテナにパルス効果を追加
        const containers = document.querySelectorAll('.chart-container');
        containers.forEach((container, index) => {
            setTimeout(() => {
                container.classList.add('data-pulse');
                setTimeout(() => {
                    container.classList.remove('data-pulse');
                }, 2000);
            }, index * 200);
        });
        
        // 完了メッセージ
        this.showNotification('📊 データ分析完了！', 'success');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4ecdc4' : '#ff6b6b'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: bold;
            z-index: 10000;
            animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 3000);
    }
    
    applyTheme(theme) {
        const body = document.body;
        body.setAttribute('data-theme', theme);
        
        // チャートの色を更新
        switch (theme) {
            case 'dark':
                this.updateChartColors('dark');
                break;
            case 'colorful':
                this.updateChartColors('colorful');
                break;
            case 'minimal':
                this.updateChartColors('minimal');
                break;
            default:
                this.updateChartColors('default');
        }
    }
    
    updateChartColors(theme) {
        // テーマに応じてチャートの色を更新
        const colorSchemes = {
            dark: {
                primary: '#4ecdc4',
                secondary: '#ff6b6b',
                background: 'rgba(78, 205, 196, 0.1)'
            },
            colorful: {
                primary: '#ff6b6b',
                secondary: '#4ecdc4',
                background: 'rgba(255, 107, 107, 0.1)'
            },
            minimal: {
                primary: '#333333',
                secondary: '#666666',
                background: 'rgba(51, 51, 51, 0.1)'
            },
            default: {
                primary: '#4ecdc4',
                secondary: '#ff6b6b',
                background: 'rgba(78, 205, 196, 0.1)'
            }
        };
        
        const colors = colorSchemes[theme];
        
        // チャートの色を更新
        Object.values(this.charts).forEach(chart => {
            chart.update();
        });
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
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ライブラリ読み込み確認とフォールバック
function checkLibraries() {
    return new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 10;
        
        function check() {
            attempts++;
            
            if (typeof Chart !== 'undefined' && typeof gsap !== 'undefined') {
                resolve(true);
            } else if (attempts < maxAttempts) {
                setTimeout(check, 200);
            } else {
                resolve(false);
            }
        }
        
        check();
    });
}

// 代替チャート表示（ライブラリなしでの表示）
function createFallbackCharts() {
    const containers = document.querySelectorAll('.chart-container');
    
    containers.forEach((container, index) => {
        const canvas = container.querySelector('canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width = 800;
        const height = canvas.height = 400;
        
        // 背景
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        // 簡単なチャート描画
        switch (index) {
            case 0: // 売上チャート
                drawLineChart(ctx, width, height);
                break;
            case 1: // 円グラフ
                drawPieChart(ctx, width, height);
                break;
            case 2: // 棒グラフ
                drawBarChart(ctx, width, height);
                break;
            case 3: // トレンドチャート
                drawTrendChart(ctx, width, height);
                break;
        }
    });
}

function drawLineChart(ctx, width, height) {
    const data = [120, 190, 300, 500, 720, 980, 1200, 1450, 1680, 1920, 2200, 2500];
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // 軸
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // データライン
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = height - padding - (value / 2500) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // データポイント
    ctx.fillStyle = '#4ecdc4';
    data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = height - padding - (value / 2500) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // タイトル
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('売上推移 (簡易表示)', width / 2, 30);
}

function drawPieChart(ctx, width, height) {
    const data = [35, 25, 20, 15, 5];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f093fb', '#feca57'];
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;
    
    let currentAngle = 0;
    
    data.forEach((value, index) => {
        const sliceAngle = (value / 100) * 2 * Math.PI;
        
        ctx.fillStyle = colors[index];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        currentAngle += sliceAngle;
    });
    
    // タイトル
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('カテゴリ別売上 (簡易表示)', width / 2, 30);
}

function drawBarChart(ctx, width, height) {
    const data = [450, 380, 320, 280, 150];
    const labels = ['東京', '大阪', '名古屋', '福岡', 'その他'];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f093fb', '#feca57'];
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length * 0.8;
    
    data.forEach((value, index) => {
        const x = padding + (index + 0.1) * (chartWidth / data.length);
        const barHeight = (value / 500) * chartHeight;
        const y = height - padding - barHeight;
        
        ctx.fillStyle = colors[index];
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // ラベル
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x + barWidth / 2, height - padding + 20);
    });
    
    // タイトル
    ctx.font = '16px Arial';
    ctx.fillText('地域別売上 (簡易表示)', width / 2, 30);
}

function drawTrendChart(ctx, width, height) {
    drawLineChart(ctx, width, height); // 同様のライン表示
    
    // タイトルを変更
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('売上トレンド (簡易表示)', width / 2, 30);
}

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', async () => {
    // ライブラリの読み込みを確認
    const librariesLoaded = await checkLibraries();
    
    if (librariesLoaded) {
        try {
            new SalesChartAnimation();
        } catch (error) {
            console.error('Animation initialization failed:', error);
            showLibraryError();
        }
    } else {
        console.warn('Libraries not loaded, showing fallback charts');
        showLibraryError();
        
        // 代替チャート表示
        setTimeout(() => {
            createFallbackCharts();
        }, 500);
    }
});

function showLibraryError() {
    const containers = document.querySelectorAll('.chart-container');
    containers.forEach(container => {
        const canvas = container.querySelector('canvas');
        if (canvas) {
            canvas.style.display = 'block';
        }
    });
    
    // 通知表示
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 107, 107, 0.9);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.innerHTML = `
        <strong>⚠️ ライブラリ読み込みエラー</strong><br>
        Chart.js または GSAP の読み込みに失敗しました。<br>
        簡易版チャートを表示しています。
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    }, 5000);
}

// パフォーマンス監視（Chart.jsが読み込まれている場合のみ）
let chartUpdateCount = 0;

function setupChartMonitoring() {
    if (typeof Chart !== 'undefined' && Chart.prototype.update) {
        const originalUpdate = Chart.prototype.update;
        
        Chart.prototype.update = function(mode) {
            chartUpdateCount++;
            if (chartUpdateCount % 100 === 0) {
                console.log(`Chart updates: ${chartUpdateCount}`);
            }
            return originalUpdate.call(this, mode);
        };
    }
}

// ライブラリが利用可能になったらモニタリングを設定
setTimeout(setupChartMonitoring, 1000);

// メモリリーク防止
window.addEventListener('beforeunload', () => {
    // チャートインスタンスのクリーンアップ
    if (window.salesChartAnimation && window.salesChartAnimation.charts) {
        Object.values(window.salesChartAnimation.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
});