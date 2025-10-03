pipeline {
    agent any
 
    environment {
        NODE_VERSION = '20'
        BUILD_PATH = "${WORKSPACE}/build"
        DEPLOY_SERVER = "103.38.50.157"
        DEPLOY_USER = "CylSrv9Mgr"
        DEPLOY_PASS = "Dwu\$CakLy@515W"
        DEPLOY_PATH = "D:/CI_CD/test_ReactJS/"  // ✅ Fixed Windows path
    }
 
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master', credentialsId: '93566bf7-5a96-4e2b-b816-de87f6a95306', url: 'http://github.cylsys.com/Kirti_Tandulkar/eadmin-frontend.git'
            }
        }
 
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                // ✅ Add missing babel plugin to avoid future warnings
                sh 'npm install'
            }
        }
 
        stage('Build React App') {
            steps {
                // ✅ Use direct react-scripts build with increased memory
                sh 'export NODE_OPTIONS=--max_old_space_size=4096 && npm run build'
            }
        }
 
        stage('Verify Build Output') {
            steps {
                script {
                    def buildExists = sh(script: "test -d ${BUILD_PATH} && echo 'exists'", returnStdout: true).trim()
                    if (buildExists != "exists") {
                        error "❌ Build directory does not exist! Aborting deployment."
                    }
                }
            }
        }
 
        stage('Install SSHPass') {
            steps {
                script {
                    def sshpassExists = sh(script: "command -v sshpass", returnStatus: true) == 0
                    if (!sshpassExists) {
                        sh 'apt update && apt install -y sshpass'
                    }
                }
            }
        }

        stage('Deploy to Windows Server') {
            steps {
                script {
                    sh '''
                        export SSHPASS="$DEPLOY_PASS"
                        sshpass -e scp -o StrictHostKeyChecking=no -r "$BUILD_PATH/." "$DEPLOY_USER@$DEPLOY_SERVER:$DEPLOY_PATH"
                    '''
                }
            }
        }
    }
 
    post {
        success {
            echo 'Deployment Successful'
            emailext(
                subject: "✅ React App Deployment Success",
                body: "React app was successfully deployed to the Windows server.",
                to: "priyanshu.sahu@cylsys.com"
            )
        }
        failure {
            echo 'Deployment Failed'
            emailext(
                subject: "❌ React App Deployment Failed",
                body: "Deployment failed. Please check Jenkins logs for details.",
                to: "priyanshu.sahu@cylsys.com"
            )
        }
    }
}
