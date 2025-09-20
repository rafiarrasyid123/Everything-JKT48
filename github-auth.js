// GitHub OAuth Authentication untuk Cross-Device System
class GitHubAuth {
    constructor() {
        this.config = new GitHubConfig();
        this.api = null;
        this.currentUser = null;
        this.accessToken = null;
        this.initializeAuth();
    }

    async initializeAuth() {
        // Check if user is already authenticated
        this.accessToken = localStorage.getItem('github_access_token');
        this.currentUser = localStorage.getItem('github_user');

        if (this.accessToken && this.currentUser) {
            this.currentUser = JSON.parse(this.currentUser);
            this.api = new GitHubAPI(this.accessToken);
            this.onAuthSuccess();
        }

        this.init();
    }

    // Initialize event listeners
    init() {
        // GitHub login button
        const githubLoginBtn = document.getElementById('githubLoginBtn');
        if (githubLoginBtn) {
            githubLoginBtn.addEventListener('click', () => this.startGitHubAuth());
        }

        // Check for OAuth callback
        this.handleOAuthCallback();
    }

    // Start GitHub OAuth flow
    startGitHubAuth() {
        const authUrl = this.config.getGitHubAuthUrl();
        window.location.href = authUrl;
    }

    // Handle OAuth callback
    async handleOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (code) {
            try {
                await this.exchangeCodeForToken(code);
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
                this.onAuthSuccess();
            } catch (error) {
                console.error('OAuth callback error:', error);
                this.showNotification('Gagal autentikasi dengan GitHub', 'error');
            }
        }
    }

    // Exchange authorization code for access token
    async exchangeCodeForToken(code) {
        const response = await fetch(this.config.getGitHubTokenUrl(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                code: code,
                redirect_uri: this.config.redirectUri
            })
        });

        if (!response.ok) {
            throw new Error('Failed to exchange code for token');
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error_description || data.error);
        }

        this.accessToken = data.access_token;
        localStorage.setItem('github_access_token', this.accessToken);

        // Get user information
        this.api = new GitHubAPI(this.accessToken);
        const userInfo = await this.api.getUser();
        this.currentUser = {
            id: userInfo.id,
            username: userInfo.login,
            email: userInfo.email,
            name: userInfo.name,
            avatar: userInfo.avatar_url,
            githubUrl: userInfo.html_url
        };
        localStorage.setItem('github_user', JSON.stringify(this.currentUser));
    }

    // Setup or verify repository exists
    async setupRepository() {
        if (!this.currentUser) {
            throw new Error('User not authenticated');
        }

        try {
            // Check if repository exists
            await this.api.getRepository(this.currentUser.username, this.config.repositoryName);
        } catch (error) {
            if (error.message.includes('404')) {
                // Repository doesn't exist, create it
                await this.createRepository();
            } else {
                throw error;
            }
        }
    }

    // Create repository for user data
    async createRepository() {
        const createRepoData = {
            name: this.config.repositoryName,
            description: 'Mikaela Authentication System - User Data Repository',
            public: false, // Private repository for security
            auto_init: true
        };

        const response = await fetch(`${this.config.getGitHubApiUrl()}/user/repos`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Mikaela-Auth-System'
            },
            body: JSON.stringify(createRepoData)
        });

        if (!response.ok) {
            throw new Error('Failed to create repository');
        }

        // Create initial directory structure
        await this.initializeRepositoryStructure();
    }

    // Initialize repository with necessary directories and files
    async initializeRepositoryStructure() {
        const initialFiles = [
            {
                path: 'README.md',
                content: `# ${this.config.repositoryName}\n\nRepository untuk menyimpan data user sistem authentication Mikaela.\n\n## Struktur\n- \`users/\` - Data user\n- \`devices/\` - Data device\n- \`sessions/\` - Data session\n- \`backups/\` - Backup data\n\n**⚠️ JANGAN HAPUS REPOSITORY INI** - Data user Anda tersimpan di sini!`
            },
            {
                path: '.gitignore',
                content: 'node_modules/\n.env\n*.log\n.DS_Store\n.vscode/'
            }
        ];

        for (const file of initialFiles) {
            await this.api.createOrUpdateFile(
                this.currentUser.username,
                this.config.repositoryName,
                file.path,
                file.content,
                `Initialize ${file.path}`
            );
        }
    }

    // Save user data to GitHub repository
    async saveUserData(userData) {
        if (!this.currentUser) {
            throw new Error('User not authenticated');
        }

        const path = this.config.getUserDataPath(this.currentUser.username);
        const message = `Update user data for ${this.currentUser.username}`;

        try {
            // Try to get existing file to get SHA
            let sha = null;
            try {
                const existingFile = await this.api.makeRequest(
                    `/repos/${this.currentUser.username}/${this.config.repositoryName}/contents/${path}`
                );
                sha = existingFile.sha;
            } catch (error) {
                // File doesn't exist, SHA not needed
            }

            await this.api.createOrUpdateFile(
                this.currentUser.username,
                this.config.repositoryName,
                path,
                userData,
                message,
                sha
            );
        } catch (error) {
            console.error('Error saving user data:', error);
            throw error;
        }
    }

    // Load user data from GitHub repository
    async loadUserData() {
        if (!this.currentUser) {
            throw new Error('User not authenticated');
        }

        try {
            const path = this.config.getUserDataPath(this.currentUser.username);
            return await this.api.getFileContents(
                this.currentUser.username,
                this.config.repositoryName,
                path
            );
        } catch (error) {
            console.log('User data not found, starting fresh');
            return null;
        }
    }

    // Logout from GitHub
    async logout() {
        this.accessToken = null;
        this.currentUser = null;
        this.api = null;

        localStorage.removeItem('github_access_token');
        localStorage.removeItem('github_user');

        this.showNotification('Berhasil logout dari GitHub', 'success');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.accessToken !== null && this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get access token
    getAccessToken() {
        return this.accessToken;
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `github-notification ${type}`;
        notification.textContent = message;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '10000',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8',
            warning: '#ffc107'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Callback when authentication is successful
    onAuthSuccess() {
        console.log('GitHub authentication successful');
        this.showNotification('Berhasil terhubung dengan GitHub!', 'success');

        // Update UI
        this.updateUIAfterAuth();

        // Setup repository if needed
        this.setupRepository().catch(error => {
            console.error('Repository setup error:', error);
        });
    }

    // Update UI after successful authentication
    updateUIAfterAuth() {
        const githubLoginBtn = document.getElementById('githubLoginBtn');
        const userInfo = document.getElementById('githubUserInfo');

        if (githubLoginBtn) {
            githubLoginBtn.style.display = 'none';
        }

        if (userInfo && this.currentUser) {
            userInfo.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${this.currentUser.avatar}" alt="Avatar"
                         style="width: 32px; height: 32px; border-radius: 50%;">
                    <span>${this.currentUser.username}</span>
                    <button onclick="window.githubAuth.logout()" style="margin-left: auto;">
                        Logout
                    </button>
                </div>
            `;
            userInfo.style.display = 'block';
        }
    }
}

// Initialize GitHub Auth when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.githubAuth = new GitHubAuth();
});
