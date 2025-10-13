pipeline {
    agent any

    environment {
        NODE_VERSION = "20" // asegúrate de usar la versión que tienes
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/EmilioAMVs/Contador-Clicks-Pipeline-Jenkins.git'
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests & Lint') {
            steps {
                sh 'npm run lint'
                sh 'npm run test'
                sh 'npm run report'
            }
        }

        stage('Build for Pages') {
            steps {
                // copiar index.html, style.css, report.html, coverage
                sh '''
                mkdir -p deploy
                cp index.html style.css report.html -t deploy/
                cp -r coverage deploy/coverage
                cp -r reports deploy/reports
                '''
            }
        }

        stage('Deploy to GitHub Pages') {
            steps {
                sh '''
                cd deploy
                git init
                git remote add origin https://github.com/EmilioAMVs/Contador-Clicks-Pipeline-Jenkins
                git checkout -b gh-pages
                git add .
                git commit -m "Deploy from Jenkins"
                git push -f origin gh-pages
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deploy completado'
        }
        failure {
            echo '❌ Algo falló en el pipeline'
        }
    }
}
