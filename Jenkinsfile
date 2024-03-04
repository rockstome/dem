pipeline {
    agent any
    // triggers { 
    //     cron('*/5 6-22 * * 1-5') 
    // }
    options {
        timeout(time: 5, unit: 'MINUTES') 
    }
    stages {
        stage('Install newman & reporter') { 
            steps {
                dir('newman-reporter-esreporter') {
                    bat 'npm uninstall -g newman newman-reporter-esreporter' 
                    bat 'npm ls -g'
                    bat 'npm pack'
                    bat 'npm install -g newman newman-reporter-esreporter-1.0.3.tgz'
                    bat 'npm ls -g'
                }
            }
        }
        stage('Run collections') {
            steps {
                dir('collections') {
                    bat 'C:\\Windows\\System32\\config\\systemprofile\\AppData\\Roaming\\npm\\newman run collection1.json -r newman-reporter-esreporter'
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
