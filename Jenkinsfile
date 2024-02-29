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
                    bat 'npm uninstall -g newman-reporter-elastic-1.0.0.tgz' 
                    bat 'npm pack'
                    bat 'npm install -g newman-reporter-elastic-1.0.0.tgz'
                }
            }
        }
    }
}
