pipeline {
    agent any

    environment {
        NODE_HOME = tool name: 'NodeJS', type: 'NodeJSInstallation' // Ajusta según tu Jenkins
        PATH = "${env.NODE_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Ejecutar tests y generar reporte') {
            steps {
                sh 'node generate-report.js'
            }
        }

        stage('Build estático') {
            steps {
                echo 'No hay build, se usan archivos estáticos.'
            }
        }

        stage('Deploy a GitHub Pages') {
            steps {
                // Crea una rama gh-pages temporal
                sh 'git checkout --orphan gh-pages'

                // Agrega todos los archivos estáticos
                sh 'git add index.html report.html style.css script.js logic.js reports/'

                sh 'git commit -m "Deploy GitHub Pages [ci skip]"'

                // Push a la rama gh-pages
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                    sh 'git push --force https://$GITHUB_TOKEN@github.com/usuario/pipeline-demo.git gh-pages'
                }

                // Vuelve a main
                sh 'git checkout main'
            }
        }
    }

    post {
        always {
            echo 'Pipeline terminado'
        }
    }
}
