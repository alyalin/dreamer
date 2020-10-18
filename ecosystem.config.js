module.exports = {
  apps: [
    {
      name: 'dreamer-api',
      script: 'npm run start:prod',
      watch: false,
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
    },
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-18-159-187-215.eu-central-1.compute.amazonaws.com',
      ref: 'origin/master',
      key: '~/.ssh/aws-ec2',
      repo: 'git@github.com:alyalin/dreamer.git',
      path: '/var/app/repositories/',
      'pre-deploy-local': '',
      'post-deploy':
        "export NODE_OPTIONS='--max-old-space-size=4096' && npm install && npm run build && pm2 reload ecosystem.config.js",
      'pre-setup': '',
    },
  },
};
