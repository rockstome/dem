pipeline {
    agent any
    triggers { 
        cron('*/5 6-22 * * 1-5') 
    }
    options {
        timeout(time: 5, unit: 'MINUTES') 
    }
    stages {
        stage('Install reporter') { 
            steps {
                dir('newman-reporter-elastic') {
                    bat 'npm uninstall -g newman-reporter-esreporter-1.0.1.tgz' 
                    bat 'npm pack'
                    bat 'npm install -g newman-reporter-esreporter-1.0.1.tgz'
                }
            }
        }
        stage('Install newman') {
            steps {
                bat 'npm install -g newman'
            }
        }
        stage('Run collections') {
            steps {
                dir('collections') {
                    bat 'C:\\Users\\tomas\\AppData\\Roaming\\npm\\newman run collection1.json -r newman-reporter-esreporter -x'
                }
            }
        }
    }
    post {  
        failure {  
            mail body: "${env.BUILD_URL} failure", charset: 'UTF-8', from: 'foo@foomail.com', mimeType: 'text/html', subject: "ERROR CI: Project name -> ${env.JOB_NAME}", to: "foo@foomail.com";  
        }  
    } 
}
