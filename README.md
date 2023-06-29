# Table Of Content
- [About the Project](#about-the-project)
  * [프로젝트 미리보기](#프로젝트-미리보기)
- [전체 시스템 설계](#전체-시스템-설계)
- [백엔드 설계](#백엔드-설계)
  * [전체 설계](#전체-설계)
  * [로컬 서버 설계](#로컬-서버-설계)

# About the Project
<div align="center">

  ![image](https://github.com/dar-jeeling/capstone-2023-BE/assets/74234333/09e0bfec-0c49-4167-9b57-c8dfe467b656)

  Image detection을 이용한 Logo 탐지 웹 애플리케이션
  
  사용자가 웹 애플리케이션에 이미지 파일을 올리면 <b>머신 러닝을 통해 로고를 인식한 후,</b>
  
  <b>인식된 브랜드에 대한 ChatGPT를 이용한 브랜드 소개와 쇼핑몰을 링크해주는 서비스</b>

</div>

## 프로젝트 미리보기
https://github.com/dar-jeeling/capstone-2023-BE/assets/74234333/f8256262-975d-4af4-b1d2-f61a179a1fe5


# 전체 시스템 설계
![image](https://github.com/dar-jeeling/capstone-2023-BE/assets/74234333/acc760e6-047d-4251-884e-7dda0c0618f8)

# 백엔드 설계
## 전체 설계
![image](https://github.com/dar-jeeling/capstone-2023-BE/assets/74234333/143947a4-9306-4d01-9d94-040482afcd48)

## 로컬 서버 설계
![image](https://github.com/dar-jeeling/capstone-2023-BE/assets/74234333/c978ba9a-c03b-4b83-9874-647c170b0042)

- `image.controller.ts` : 딥러닝 모델을 사용하여 이미지를 처리하는 부분
  - `child process` 모듈을 통한 TypeScript 환경에서 python 모델 코드 실행
  - python 스크립트 실행 후 aws 에 결과 업로드 후,결과 이미지 URL을 반환
- `shop11st.controller.ts`, `openai.module.ts` : 외부 api를 위한 프록시 서버
  - 외부 API와 통신하고, 그 결과를 frontend에 반환함.
  - frontend와 외부 API의 proxy 역할을 함으로써 다음과 같은 이점을 얻음.
  - 브라우저에 노출되면 곤란한 secret key와 같은 처리를 서버에서 함으로써 보안을 강화
  - 외부 API의 CORS와 같은 브라우저 정책을 서버에서 처리함으로써 회피할 수 있음.
  - 외부 API에서 응답한 XML을 frontend에서 처리하기 쉬운 json 형태로 변환하여 응답 전달
 
## 기술 스택
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
