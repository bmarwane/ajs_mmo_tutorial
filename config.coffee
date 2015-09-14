module.exports = config:
  paths:
    "watched": ["client", "vendor"]
    "public": "public"
  files:
    javascripts:
      joinTo:
        'js/client.js': /^client/
        'js/vendor.js': /^vendor/

    stylesheets: joinTo: 'styles/client.css'

  server:
    run: yes
    port: 9192