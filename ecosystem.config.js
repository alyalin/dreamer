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
      host: 'ec2-13-49-113-158.eu-north-1.compute.amazonaws.com',
      ref: 'origin/master',
      key: '~/.ssh/aws-ec2',
      repo: 'git@github.com:alyalin/dreamer.git',
      path: '/var/app/repositories/',
      'pre-deploy-local': '',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js',
      'pre-setup': '',
    },
  },
};
