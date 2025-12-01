# Servir archivos estáticos con Nginx
FROM nginx:alpine

# Copiar los archivos de tu app
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY report.html /usr/share/nginx/html/

# Copiar carpetas si existen
COPY coverage /usr/share/nginx/html/coverage
COPY reports /usr/share/nginx/html/reports

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
