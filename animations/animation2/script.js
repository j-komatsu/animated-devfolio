// Code Typing Animation Script
// リアルタイムコードタイピングアニメーション

class CodeTypingAnimation {
    constructor() {
        // DOM要素
        this.codeDisplay = document.getElementById('codeDisplay');
        this.cursor = document.getElementById('cursor');
        this.lineNumbers = document.getElementById('lineNumbers');
        
        // コントロール要素
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedValue = document.getElementById('speedValue');
        this.codeSelect = document.getElementById('codeSelect');
        this.soundToggle = document.getElementById('soundToggle');
        
        // アニメーション状態
        this.isTyping = false;
        this.isPaused = false;
        this.currentIndex = 0;
        this.typingSpeed = 80;
        this.currentCode = '';
        this.currentCodeType = 'react-component';
        
        // タイピング音の設定
        this.audioContext = null;
        this.setupAudio();
        
        // コードサンプル
        this.codeSamples = {
            'react-component': `// React Functional Component with Hooks
import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await fetch(\`/api/users/\${userId}\`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                
                const userData = await response.json();
                setUser(userData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUser();
        }
    }, [userId]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!user) return <div className="no-user">User not found</div>;

    return (
        <div className="user-profile">
            <div className="profile-header">
                <img 
                    src={user.avatar || '/default-avatar.png'} 
                    alt={user.name}
                    className="avatar"
                />
                <h2>{user.name}</h2>
                <p className="email">{user.email}</p>
            </div>
            
            <div className="profile-details">
                <div className="detail-item">
                    <label>Department:</label>
                    <span>{user.department}</span>
                </div>
                <div className="detail-item">
                    <label>Join Date:</label>
                    <span>{new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                    <label>Status:</label>
                    <span className={\`status \${user.status.toLowerCase()}\`}>
                        {user.status}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;`,

            'async-function': `// Advanced Async/Await Pattern with Error Handling
class DataService {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.cache = new Map();
        this.requestQueue = [];
        this.isProcessing = false;
    }

    async fetchWithRetry(url, options = {}, retries = 3) {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(\`\${this.baseURL}\${url}\`, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
                        ...options.headers
                    }
                });

                if (!response.ok) {
                    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
                }

                return await response.json();
            } catch (error) {
                console.warn(\`Attempt \${attempt} failed:\`, error.message);
                
                if (attempt === retries) {
                    throw new Error(\`Failed after \${retries} attempts: \${error.message}\`);
                }
                
                await delay(Math.pow(2, attempt) * 1000); // Exponential backoff
            }
        }
    }

    async batchRequest(requests) {
        const results = await Promise.allSettled(
            requests.map(async (request) => {
                const cacheKey = \`\${request.method}:\${request.url}\`;
                
                if (this.cache.has(cacheKey)) {
                    return this.cache.get(cacheKey);
                }
                
                const result = await this.fetchWithRetry(
                    request.url, 
                    { method: request.method, body: request.body }
                );
                
                this.cache.set(cacheKey, result);
                return result;
            })
        );

        return results.map((result, index) => ({
            success: result.status === 'fulfilled',
            data: result.status === 'fulfilled' ? result.value : null,
            error: result.status === 'rejected' ? result.reason : null,
            originalRequest: requests[index]
        }));
    }

    async processQueue() {
        if (this.isProcessing || this.requestQueue.length === 0) return;
        
        this.isProcessing = true;
        
        try {
            const batch = this.requestQueue.splice(0, 5); // Process 5 at a time
            const results = await this.batchRequest(batch);
            
            results.forEach((result, index) => {
                const callback = batch[index].callback;
                if (callback) {
                    callback(result.success ? null : result.error, result.data);
                }
            });
        } finally {
            this.isProcessing = false;
            
            if (this.requestQueue.length > 0) {
                setTimeout(() => this.processQueue(), 100);
            }
        }
    }
}

// Usage Example
const dataService = new DataService('https://api.example.com');

async function loadUserDashboard(userId) {
    try {
        const [user, posts, analytics] = await Promise.all([
            dataService.fetchWithRetry(\`/users/\${userId}\`),
            dataService.fetchWithRetry(\`/users/\${userId}/posts\`),
            dataService.fetchWithRetry(\`/users/\${userId}/analytics\`)
        ]);

        return { user, posts, analytics };
    } catch (error) {
        console.error('Dashboard load failed:', error);
        throw error;
    }
}`,

            'class-definition': `// Advanced ES6 Class with Private Fields and Methods
class SmartCache {
    // Private fields
    #cache = new Map();
    #maxSize;
    #ttl;
    #cleanupInterval;
    #stats = {
        hits: 0,
        misses: 0,
        evictions: 0
    };

    constructor(options = {}) {
        this.#maxSize = options.maxSize || 100;
        this.#ttl = options.ttl || 300000; // 5 minutes default
        
        // Start cleanup interval
        this.#cleanupInterval = setInterval(() => {
            this.#cleanup();
        }, this.#ttl / 4);
    }

    // Public methods
    set(key, value, customTTL = null) {
        const ttl = customTTL || this.#ttl;
        const expiresAt = Date.now() + ttl;
        
        // Remove oldest item if cache is full
        if (this.#cache.size >= this.#maxSize && !this.#cache.has(key)) {
            this.#evictOldest();
        }
        
        this.#cache.set(key, {
            value,
            expiresAt,
            accessCount: 0,
            createdAt: Date.now()
        });
        
        return this;
    }

    get(key) {
        const item = this.#cache.get(key);
        
        if (!item) {
            this.#stats.misses++;
            return null;
        }
        
        if (this.#isExpired(item)) {
            this.#cache.delete(key);
            this.#stats.misses++;
            return null;
        }
        
        item.accessCount++;
        item.lastAccessed = Date.now();
        this.#stats.hits++;
        
        return item.value;
    }

    has(key) {
        const item = this.#cache.get(key);
        
        if (!item || this.#isExpired(item)) {
            return false;
        }
        
        return true;
    }

    delete(key) {
        return this.#cache.delete(key);
    }

    clear() {
        this.#cache.clear();
        this.#resetStats();
    }

    getStats() {
        return {
            ...this.#stats,
            size: this.#cache.size,
            hitRate: this.#stats.hits / (this.#stats.hits + this.#stats.misses) || 0
        };
    }

    // Private methods
    #isExpired(item) {
        return Date.now() > item.expiresAt;
    }

    #cleanup() {
        const now = Date.now();
        const keysToDelete = [];
        
        for (const [key, item] of this.#cache) {
            if (now > item.expiresAt) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => {
            this.#cache.delete(key);
            this.#stats.evictions++;
        });
    }

    #evictOldest() {
        let oldestKey = null;
        let oldestTime = Infinity;
        
        for (const [key, item] of this.#cache) {
            const priority = item.lastAccessed || item.createdAt;
            if (priority < oldestTime) {
                oldestTime = priority;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.#cache.delete(oldestKey);
            this.#stats.evictions++;
        }
    }

    #resetStats() {
        this.#stats = { hits: 0, misses: 0, evictions: 0 };
    }

    // Cleanup on destruction
    destroy() {
        clearInterval(this.#cleanupInterval);
        this.clear();
    }
}

// Example usage
const cache = new SmartCache({ 
    maxSize: 50, 
    ttl: 60000 // 1 minute
});

cache.set('user:123', { name: 'John', email: 'john@example.com' });
cache.set('session:abc', { token: 'xyz', expires: Date.now() + 3600000 });

console.log(cache.get('user:123')); // { name: 'John', email: 'john@example.com' }
console.log(cache.getStats()); // { hits: 1, misses: 0, evictions: 0, size: 2, hitRate: 1 }`,

            'algorithm': `// Quick Sort Algorithm with Performance Optimization
class SortingAlgorithms {
    static quickSort(arr, compareFn = null) {
        if (!Array.isArray(arr)) {
            throw new TypeError('Expected an array');
        }
        
        if (arr.length <= 1) return [...arr];
        
        const compare = compareFn || ((a, b) => a - b);
        
        // Use iterative approach for better performance on large arrays
        return this.#quickSortIterative([...arr], compare);
    }

    static #quickSortIterative(arr, compare) {
        const stack = [{ low: 0, high: arr.length - 1 }];
        
        while (stack.length > 0) {
            const { low, high } = stack.pop();
            
            if (low < high) {
                const pivotIndex = this.#partition(arr, low, high, compare);
                
                // Push larger partition first for better space complexity
                if (pivotIndex - low > high - pivotIndex) {
                    stack.push({ low, high: pivotIndex - 1 });
                    stack.push({ low: pivotIndex + 1, high });
                } else {
                    stack.push({ low: pivotIndex + 1, high });
                    stack.push({ low, high: pivotIndex - 1 });
                }
            }
        }
        
        return arr;
    }

    static #partition(arr, low, high, compare) {
        // Use median-of-three for better pivot selection
        const mid = Math.floor((low + high) / 2);
        
        if (compare(arr[mid], arr[low]) < 0) {
            [arr[low], arr[mid]] = [arr[mid], arr[low]];
        }
        if (compare(arr[high], arr[low]) < 0) {
            [arr[low], arr[high]] = [arr[high], arr[low]];
        }
        if (compare(arr[high], arr[mid]) < 0) {
            [arr[mid], arr[high]] = [arr[high], arr[mid]];
        }
        
        const pivot = arr[mid];
        [arr[mid], arr[high]] = [arr[high], arr[mid]];
        
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            if (compare(arr[j], pivot) <= 0) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    }

    static mergeSort(arr, compareFn = null) {
        if (!Array.isArray(arr)) {
            throw new TypeError('Expected an array');
        }
        
        if (arr.length <= 1) return [...arr];
        
        const compare = compareFn || ((a, b) => a - b);
        const result = [...arr];
        const temp = new Array(arr.length);
        
        this.#mergeSortHelper(result, temp, 0, arr.length - 1, compare);
        return result;
    }

    static #mergeSortHelper(arr, temp, left, right, compare) {
        if (left >= right) return;
        
        const mid = Math.floor((left + right) / 2);
        
        this.#mergeSortHelper(arr, temp, left, mid, compare);
        this.#mergeSortHelper(arr, temp, mid + 1, right, compare);
        this.#merge(arr, temp, left, mid, right, compare);
    }

    static #merge(arr, temp, left, mid, right, compare) {
        let i = left, j = mid + 1, k = left;
        
        while (i <= mid && j <= right) {
            if (compare(arr[i], arr[j]) <= 0) {
                temp[k++] = arr[i++];
            } else {
                temp[k++] = arr[j++];
            }
        }
        
        while (i <= mid) temp[k++] = arr[i++];
        while (j <= right) temp[k++] = arr[j++];
        
        for (i = left; i <= right; i++) {
            arr[i] = temp[i];
        }
    }

    // Performance benchmark utility
    static benchmark(algorithm, data, iterations = 10) {
        const results = [];
        
        for (let i = 0; i < iterations; i++) {
            const testData = [...data];
            const start = performance.now();
            
            algorithm(testData);
            
            const end = performance.now();
            results.push(end - start);
        }
        
        return {
            average: results.reduce((a, b) => a + b) / results.length,
            min: Math.min(...results),
            max: Math.max(...results),
            results
        };
    }
}

// Example usage and performance comparison
const testData = Array.from({ length: 10000 }, () => Math.random() * 1000);

console.log('Quick Sort:', 
    SortingAlgorithms.benchmark(SortingAlgorithms.quickSort, testData)
);

console.log('Merge Sort:', 
    SortingAlgorithms.benchmark(SortingAlgorithms.mergeSort, testData)
);`,

            'api-call': `// Modern API Integration with TypeScript-style JSDoc
/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {any} data
 * @property {string} [error]
 * @property {Object} [metadata]
 */

/**
 * @typedef {Object} RequestConfig
 * @property {string} method
 * @property {Object} [headers]
 * @property {any} [body]
 * @property {number} [timeout]
 * @property {boolean} [cache]
 */

class ApiClient {
    constructor(baseURL, defaultConfig = {}) {
        this.baseURL = baseURL.replace(/\\/$/, '');
        this.defaultConfig = {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            },
            ...defaultConfig
        };
        
        this.interceptors = {
            request: [],
            response: []
        };
        
        this.cache = new Map();
    }

    /**
     * Add request interceptor
     * @param {Function} interceptor - Function to modify request config
     */
    addRequestInterceptor(interceptor) {
        this.interceptors.request.push(interceptor);
    }

    /**
     * Add response interceptor
     * @param {Function} interceptor - Function to modify response
     */
    addResponseInterceptor(interceptor) {
        this.interceptors.response.push(interceptor);
    }

    /**
     * Make HTTP request
     * @param {string} endpoint 
     * @param {RequestConfig} config 
     * @returns {Promise<ApiResponse>}
     */
    async request(endpoint, config = {}) {
        const url = \`\${this.baseURL}\${endpoint}\`;
        const requestConfig = this.#mergeConfig(config);
        
        // Apply request interceptors
        let finalConfig = requestConfig;
        for (const interceptor of this.interceptors.request) {
            finalConfig = await interceptor(finalConfig);
        }

        try {
            // Check cache first
            if (finalConfig.cache && finalConfig.method === 'GET') {
                const cached = this.cache.get(url);
                if (cached && Date.now() - cached.timestamp < 300000) { // 5 min cache
                    return cached.data;
                }
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout);

            const response = await fetch(url, {
                ...finalConfig,
                signal: controller.signal,
                body: finalConfig.body ? JSON.stringify(finalConfig.body) : undefined
            });

            clearTimeout(timeoutId);

            let responseData;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }

            const result = {
                success: response.ok,
                data: responseData,
                status: response.status,
                headers: Object.fromEntries(response.headers.entries()),
                metadata: {
                    url,
                    method: finalConfig.method,
                    timestamp: Date.now()
                }
            };

            if (!response.ok) {
                result.error = \`HTTP \${response.status}: \${response.statusText}\`;
            }

            // Apply response interceptors
            let finalResult = result;
            for (const interceptor of this.interceptors.response) {
                finalResult = await interceptor(finalResult);
            }

            // Cache successful GET requests
            if (finalConfig.cache && finalConfig.method === 'GET' && result.success) {
                this.cache.set(url, {
                    data: finalResult,
                    timestamp: Date.now()
                });
            }

            return finalResult;

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            throw error;
        }
    }

    /**
     * GET request
     * @param {string} endpoint 
     * @param {Object} config 
     * @returns {Promise<ApiResponse>}
     */
    async get(endpoint, config = {}) {
        return this.request(endpoint, { ...config, method: 'GET' });
    }

    /**
     * POST request
     * @param {string} endpoint 
     * @param {any} data 
     * @param {Object} config 
     * @returns {Promise<ApiResponse>}
     */
    async post(endpoint, data, config = {}) {
        return this.request(endpoint, { 
            ...config, 
            method: 'POST', 
            body: data 
        });
    }

    /**
     * PUT request
     * @param {string} endpoint 
     * @param {any} data 
     * @param {Object} config 
     * @returns {Promise<ApiResponse>}
     */
    async put(endpoint, data, config = {}) {
        return this.request(endpoint, { 
            ...config, 
            method: 'PUT', 
            body: data 
        });
    }

    /**
     * DELETE request
     * @param {string} endpoint 
     * @param {Object} config 
     * @returns {Promise<ApiResponse>}
     */
    async delete(endpoint, config = {}) {
        return this.request(endpoint, { ...config, method: 'DELETE' });
    }

    #mergeConfig(config) {
        return {
            ...this.defaultConfig,
            ...config,
            headers: {
                ...this.defaultConfig.headers,
                ...config.headers
            }
        };
    }
}

// Usage example with authentication
const api = new ApiClient('https://api.example.com');

// Add authentication interceptor
api.addRequestInterceptor(async (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
});

// Add error handling interceptor
api.addResponseInterceptor(async (response) => {
    if (!response.success && response.status === 401) {
        // Handle unauthorized - redirect to login
        window.location.href = '/login';
    }
    return response;
});

// API calls
async function fetchUserProfile(userId) {
    try {
        const response = await api.get(\`/users/\${userId}\`, { cache: true });
        
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.error);
        }
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        throw error;
    }
}

async function updateUserProfile(userId, profileData) {
    const response = await api.put(\`/users/\${userId}\`, profileData);
    return response;
}`
        };
        
        this.init();
        this.setupEventListeners();
    }
    
    setupAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported');
        }
    }
    
    playTypingSound() {
        if (!this.soundToggle.checked || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // ランダムな周波数でタイピング音を作成
            oscillator.frequency.setValueAtTime(
                800 + Math.random() * 400, 
                this.audioContext.currentTime
            );
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.001, 
                this.audioContext.currentTime + 0.1
            );
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (error) {
            console.warn('Audio playback failed:', error);
        }
    }
    
    init() {
        this.currentCode = this.codeSamples[this.currentCodeType];
        this.updateLineNumbers();
        this.resetAnimation();
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startTyping());
        this.pauseBtn.addEventListener('click', () => this.pauseTyping());
        this.resetBtn.addEventListener('click', () => this.resetAnimation());
        
        this.speedSlider.addEventListener('input', (e) => {
            this.typingSpeed = parseInt(e.target.value);
            this.speedValue.textContent = `${this.typingSpeed}ms`;
        });
        
        this.codeSelect.addEventListener('change', (e) => {
            this.currentCodeType = e.target.value;
            this.currentCode = this.codeSamples[this.currentCodeType];
            this.resetAnimation();
        });
        
        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.startTyping();
                        break;
                    case ' ':
                        e.preventDefault();
                        this.pauseTyping();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.resetAnimation();
                        break;
                }
            }
        });
    }
    
    updateLineNumbers() {
        const lines = this.currentCode.split('\n');
        this.lineNumbers.innerHTML = '';
        
        for (let i = 1; i <= lines.length; i++) {
            const lineNumber = document.createElement('div');
            lineNumber.textContent = i;
            lineNumber.className = 'line-number';
            this.lineNumbers.appendChild(lineNumber);
        }
    }
    
    async startTyping() {
        if (this.isTyping) return;
        
        this.isTyping = true;
        this.isPaused = false;
        this.startBtn.textContent = 'タイピング中...';
        this.startBtn.disabled = true;
        
        // カーソルを表示
        this.cursor.style.display = 'inline-block';
        
        try {
            await this.typeCode();
        } catch (error) {
            console.error('Typing animation error:', error);
        } finally {
            this.isTyping = false;
            this.startBtn.textContent = '開始';
            this.startBtn.disabled = false;
            
            if (this.currentIndex >= this.currentCode.length) {
                // アニメーション完了時の効果
                this.addCompletionEffect();
            }
        }
    }
    
    pauseTyping() {
        if (!this.isTyping) return;
        
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? '再開' : '一時停止';
    }
    
    resetAnimation() {
        this.isTyping = false;
        this.isPaused = false;
        this.currentIndex = 0;
        
        this.codeDisplay.textContent = '';
        this.cursor.style.display = 'inline-block';
        
        this.startBtn.textContent = '開始';
        this.startBtn.disabled = false;
        this.pauseBtn.textContent = '一時停止';
        
        this.updateLineNumbers();
        
        // シンタックスハイライトをリセット
        if (window.Prism) {
            Prism.highlightElement(this.codeDisplay);
        }
    }
    
    async typeCode() {
        while (this.currentIndex < this.currentCode.length && this.isTyping) {
            // 一時停止中は待機
            while (this.isPaused && this.isTyping) {
                await this.delay(100);
            }
            
            if (!this.isTyping) break;
            
            const char = this.currentCode[this.currentIndex];
            const currentText = this.codeDisplay.textContent;
            
            // 文字を追加
            this.codeDisplay.textContent = currentText + char;
            
            // カーソル位置を更新
            this.updateCursorPosition();
            
            // シンタックスハイライトを適用
            if (window.Prism) {
                Prism.highlightElement(this.codeDisplay);
            }
            
            // タイピング音を再生
            this.playTypingSound();
            
            // 改行時の特別処理
            if (char === '\n') {
                this.highlightCurrentLine();
                await this.delay(this.typingSpeed * 2); // 改行時は少し長めの間隔
            } else {
                // 動的な速度調整（句読点で少し遅く）
                const speed = this.getTypingSpeed(char);
                await this.delay(speed);
            }
            
            this.currentIndex++;
        }
    }
    
    getTypingSpeed(char) {
        // 文字によって速度を調整
        const baseSpeed = this.typingSpeed;
        
        if (char === ' ') return baseSpeed * 0.5; // スペースは速く
        if (char === '\n') return baseSpeed * 2; // 改行は遅く
        if (/[.;,]/.test(char)) return baseSpeed * 1.5; // 句読点は少し遅く
        if (/[(){}[\]]/.test(char)) return baseSpeed * 1.2; // 括弧は少し遅く
        
        return baseSpeed;
    }
    
    updateCursorPosition() {
        // カーソルの位置を現在のテキストの末尾に調整
        const rect = this.codeDisplay.getBoundingClientRect();
        const range = document.createRange();
        const selection = window.getSelection();
        
        if (this.codeDisplay.lastChild) {
            range.setStartAfter(this.codeDisplay.lastChild);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    
    highlightCurrentLine() {
        // 現在の行をハイライト（視覚的フィードバック）
        const lines = this.codeDisplay.textContent.split('\n');
        const currentLineNumber = lines.length;
        
        // 行番号のハイライト
        const lineNumberElements = this.lineNumbers.children;
        
        // 全ての行番号のハイライトを削除
        Array.from(lineNumberElements).forEach(el => {
            el.classList.remove('active');
        });
        
        // 現在の行番号をハイライト
        if (lineNumberElements[currentLineNumber - 1]) {
            lineNumberElements[currentLineNumber - 1].classList.add('active');
        }
    }
    
    addCompletionEffect() {
        // アニメーション完了時の視覚効果
        this.cursor.style.display = 'none';
        
        // 完了メッセージを表示
        const completionMessage = document.createElement('div');
        completionMessage.className = 'completion-message';
        completionMessage.textContent = '✓ コード入力完了!';
        completionMessage.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: linear-gradient(45deg, #00ff88, #00aaff);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: bold;
            animation: slideInFromRight 0.5s ease, fadeOut 2s ease 2s forwards;
            z-index: 1000;
        `;
        
        this.codeDisplay.parentElement.style.position = 'relative';
        this.codeDisplay.parentElement.appendChild(completionMessage);
        
        // 3秒後にメッセージを削除
        setTimeout(() => {
            if (completionMessage.parentElement) {
                completionMessage.parentElement.removeChild(completionMessage);
            }
        }, 3000);
        
        // キラキラ効果
        this.createSparkleEffect();
    }
    
    createSparkleEffect() {
        const sparkleContainer = document.createElement('div');
        sparkleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 999;
        `;
        
        this.codeDisplay.parentElement.appendChild(sparkleContainer);
        
        // 複数のキラキラを作成
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = '✨';
                sparkle.style.cssText = `
                    position: absolute;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    font-size: ${Math.random() * 10 + 10}px;
                    animation: sparkle 1.5s ease-out forwards;
                    pointer-events: none;
                `;
                
                sparkleContainer.appendChild(sparkle);
                
                // アニメーション完了後に削除
                setTimeout(() => {
                    if (sparkle.parentElement) {
                        sparkle.parentElement.removeChild(sparkle);
                    }
                }, 1500);
                
            }, i * 100);
        }
        
        // コンテナも削除
        setTimeout(() => {
            if (sparkleContainer.parentElement) {
                sparkleContainer.parentElement.removeChild(sparkleContainer);
            }
        }, 3000);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// CSS アニメーションの追加
const additionalStyles = `
    @keyframes slideInFromRight {
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
    
    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
    
    .line-number.active {
        background: rgba(0, 255, 136, 0.2);
        color: #00ff88;
        font-weight: bold;
    }
`;

// スタイルを動的に追加
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    new CodeTypingAnimation();
});

// パフォーマンス監視
let animationFrameCount = 0;
let lastFrameTime = performance.now();

function monitorPerformance() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime;
    
    if (deltaTime > 16.67) { // 60FPS未満
        console.warn(`Frame drop detected: ${deltaTime.toFixed(2)}ms`);
    }
    
    lastFrameTime = currentTime;
    animationFrameCount++;
    
    requestAnimationFrame(monitorPerformance);
}

// パフォーマンス監視開始（デバッグモード）
if (window.location.search.includes('debug=true')) {
    monitorPerformance();
}

// メモリリーク防止
window.addEventListener('beforeunload', () => {
    // オーディオコンテキストのクリーンアップ
    if (window.codeTypingAnimation && window.codeTypingAnimation.audioContext) {
        window.codeTypingAnimation.audioContext.close();
    }
});