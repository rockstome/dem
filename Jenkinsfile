pipeline {
    agent any

    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Build reporter') { 
            steps {
                dir('newman-reporter-elastic'){
                    sh 'npm uninstall -g newman-reporter-elastic-1.0.0.tgz' 
                    sh 'npm pack'
                    sh 'npm install -g newman-reporter-elastic-1.0.0.tgz'
                }
            }
        }
    }
}
