// GitHub Configuration untuk Cross-Device Authentication System
class GitHubConfig {
    constructor() {
        this.clientId = 'YOUR_GITHUB_CLIENT_ID'; // Ganti dengan Client ID GitHub App Anda
        this.clientSecret = 'YOUR_GITHUB_CLIENT_SECRET'; // Ganti dengan Client Secret
        this.redirectUri = window.location.origin + '/github-callback.html';
        this.scope = 'user repo read:org'; // Scope untuk akses repository dan user info
        this.repositoryName = 'mikaela-auth-system'; // Nama repository untuk menyimpan data user
        this.branch = 'main';
    }

    // GitHub OAuth URLs
    getGitHubAuthUrl() {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: this.scope,
            response_type: 'code'
        });
        return `https://github.com/login/oauth/authorize?${params.toString()}`;
    }

    getGitHubTokenUrl() {
        return 'https://github.com/login/oauth/access_token';
    }

    getGitHubApiUrl() {
        return 'https://api.github.com';
    }

    // Repository URLs
    getRepositoryUrl(username) {
        return `https://github.com/${username}/${this.repositoryName}`;
    }

    getRepositoryApiUrl(username) {
        return `${this.getGitHubApiUrl()}/repos/${username}/${this.repositoryName}`;
    }

    getRepositoryContentsUrl(username, path = '') {
        return `${this.getRepositoryApiUrl(username)}/contents/${path}`;
    }

    // User data file path di repository
    getUserDataPath(username) {
        return `users/${username}.json`;
    }

    getDeviceDataPath(username, deviceId) {
        return `devices/${username}-${deviceId}.json`;
    }

    getSessionDataPath(username) {
        return `sessions/${username}-sessions.json`;
    }
}

// GitHub API Helper Functions
class GitHubAPI {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.baseURL = 'https://api.github.com';
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Authorization': `token ${this.accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Mikaela-Auth-System'
            }
        };

        const response = await fetch(url, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    // Get user information
    async getUser() {
        return this.makeRequest('/user');
    }

    // Get repository information
    async getRepository(owner, repo) {
        return this.makeRequest(`/repos/${owner}/${repo}`);
    }

    // Get file contents from repository
    async getFileContents(owner, repo, path) {
        const data = await this.makeRequest(`/repos/${owner}/${repo}/contents/${path}`);
        if (data.content) {
            return JSON.parse(atob(data.content));
        }
        return null;
    }

    // Create or update file in repository
    async createOrUpdateFile(owner, repo, path, content, message, sha = null) {
        const fileData = {
            message: message,
            content: btoa(JSON.stringify(content, null, 2)),
            branch: 'main'
        };

        if (sha) {
            fileData.sha = sha;
        }

        return this.makeRequest(`/repos/${owner}/${repo}/contents/${path}`, {
            method: 'PUT',
            body: JSON.stringify(fileData)
        });
    }

    // List files in directory
    async listFiles(owner, repo, path = '') {
        return this.makeRequest(`/repos/${owner}/${repo}/contents/${path}`);
    }
}

// Export untuk digunakan di file lain
window.GitHubConfig = GitHubConfig;
window.GitHubAPI = GitHubAPI;
