module.exports = {
    apps: [{
        script: 'app.js',
        watch: '.'
    }
    ],

    deploy: {
        production: {
            user: 'yanyue',
            host: '121.196.183.67',
            ref: 'origin/master',
            repo: 'GIT_REPOSITORY',
            path: '/home/yanyue/g-web/koa',
            'pre-deploy-local': '',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
            'pre-setup': ''
        }
    }
};
