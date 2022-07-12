declare namespace NodeJS {
  interface ProcessEnv {
    /** Firebase 프로젝트 구성 정보 */
    FIREBASE_CONFIG: string;

    /** 서비스 계정 키 파일 */
    GOOGLE_APPLICATION_CREDENTIALS: string;
  }
}
