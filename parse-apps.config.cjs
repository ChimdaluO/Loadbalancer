module.exports = {
    apps : [{
      name        : "loadbalancer",
      script      : "npm start",
      watch       : false,
      merge_logs  : true,
      cwd         : "/var/www/loadbalancer"

     }]
  }