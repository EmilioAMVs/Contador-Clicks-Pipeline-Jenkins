FROM nginx:alpine

COPY deploy/index.html /usr/share/nginx/html/
COPY deploy/style.css /usr/share/nginx/html/
COPY deploy/script.js /usr/share/nginx/html/
COPY deploy/report.html /usr/share/nginx/html/

# Copiar carpetas si existen
COPY deploy/coverage /usr/share/nginx/html/coverage
COPY deploy/reports /usr/share/nginx/html/reports

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
