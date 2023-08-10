(function($){  // 매개변수(파라미터 Parameter)
    // 즉시표현함수는 제이쿼리 달러 사인기호의 
    // 외부 플러그인(라이브러리)와 충돌을 피하기 위해 사용하는 함수식

    // 객체(Object 오브젝트) 선언 {} : 섹션별 변수 중복을 피할 수 있다.
    // const obj = new Object(); // 객체 생성자 방식
    //       obj = {}  

    const obj = {  // 객체 리터럴 방식 권장
        init(){  // 대표 메서드
            this.header();
            this.section1();
            this.section2();
            this.section3();
        },
        header(){},
        section1(){
            let cnt=0;
            let setId=0;
            const slideContainer = $('#section1 .slide-container');
            const slideWrap = $('#section1 .slide-wrap');
            const slideView = $('#section1 .slide-view');
            const slide = $('#section1 .slide');
            const slideImg = $('#section1 .slide Img');
            const pageBtn = $('#section1 .page-btn');
            const stopBtn = $('#section1 .stop-btn');
            const playBtn = $('#section1 .play-btn');
            const n = $('#section1 .slide').length-1; //10개(0~9)

            let mouseDown = null;
            let mouseUp = null;

            let dragStart = null;
            let dragEnd = null;
            let mDown = false;
            let winW = $(window).innerWidth(); // 창너비=> 슬라이드1개의 너비
            let sizeX = 10;  // 드래그 길이

            // 1. 창너비 이미지 크기에 따른 반응형
            //  비율 구하기 2560 / 1930
            const imgRate = 1.345244351;
            // 트랜스레이트 이미지 비율 324 / 2560
            const imgTranRate = 0.1265625;
            // 이미지 비율에 따라 창너비
            // slideImg.css({ width: imgRate * winW });

            // slideImg.css({ width: imgRate * winW , transform: translateX(-324px) });

            // slide img 는 크기가 창너비에 따라 이미지 크기가 바뀌고
            // translateX 도 같이 바뀐다.    창너비의 따른 이미지크기 * tran 비율 
            slideImg.css({ width: imgRate * winW, transform: `translateX(${-(imgRate * winW)*imgTranRate}px` });

            // 1px 만 바뀌어도 바로 적용되야하는 값을 넣는다.
            $(window).resize(function(){
                winW = $(window).innerWidth();
                slideImg.css({ width: imgRate * winW, transform: `translateX(${-(imgRate * winW)*imgTranRate}px` });
            });
            
            // 슬라이드박스 좌측 끝 
            // console.log( slideWrap.offset().left );

            // 터치 스와이프 이벤트
            slideContainer.on({
                mousedown(e){
                    winW = $(window).innerWidth(); // 마우스 다운하면 창너비 가져오기
                    console.log(winW);
                    console.log(sizeX);
                    mouseDown = e.clientX; 
                    // 슬라이드랩퍼박스 좌측 좌표값 -1903
                    // 계속 드래그시 슬라이드 박스 좌측값 설정한다.
                    dragStart = e.clientX - (slideWrap.offset().left+winW);  // 좌측끝 0 시작
                    mDown = true; // 1. 드래그 시작 
                    slideView.css({ cursor: 'grabbing' }); // 잡는다 (드래그)
                },
                mouseup(e){
                    mouseUp = e.clientX;        
                    
                    if( mouseDown-mouseUp > sizeX ){ // 10초과 => 10이하
                        clearInterval(setId); // 클릭시 일시중지
                        if(!slideWrap.is(':animated')){
                            nextCount();
                        }                            
                    }
                    
                    if( mouseDown-mouseUp < -sizeX ){  // -10미만 => -10이상
                        clearInterval(setId); // 클릭시 일시중지
                        if(!slideWrap.is(':animated')){
                            prevCount();
                        }                            
                    }

                    mDown = false;  // 2. 드래그 끝을 알려주는 마우스 업상태
                    slideView.css({ cursor: 'grab' }); // 놓는다 손바닥 펼친다.
                }
            })

            // slideContainer 영역을 벗어나면  mouseup의 예외처리
            // 도큐먼트에서 예외처리
            $(document).on({
                mouseup(e){
                    if(!mDown) return;

                    mouseUp = e.clientX;        
                    
                    if( mouseDown-mouseUp > sizeX ){
                        clearInterval(setId); // 클릭시 일시중지
                        if(!slideWrap.is(':animated')){
                            nextCount();
                        }                            
                    }
                    
                    if( mouseDown-mouseUp < -sizeX ){
                        clearInterval(setId); // 클릭시 일시중지
                        if(!slideWrap.is(':animated')){
                            prevCount();
                        }                            
                    }

                    mDown = false;  // 2. 드래그 끝을 알려주는 마우스 업상태
                    slideView.css({ cursor: 'grab' }); // 놓는다 손바닥 펼친다.
                }
            });

            slideContainer.on({
                
                touchstart(e){
                    // console.log(e);
                    // e.originalEvent.changedTouches[0].clientX
                    winW = $(window).innerWidth(); // 마우스 다운하면 창너비 가져오기
                    console.log(winW);
                    console.log(sizeX);
                    mouseDown = e.originalEvent.changedTouches[0].clientX; 
                    // 슬라이드랩퍼박스 좌측 좌표값 -1903
                    // 계속 드래그시 슬라이드 박스 좌측값 설정한다.
                    dragStart = e.originalEvent.changedTouches[0].clientX - (slideWrap.offset().left+winW);  // 좌측끝 0 시작
                    mDown = true; // 1. 드래그 시작 
                    slideView.css({ cursor: 'grabbing' }); // 잡는다 (드래그)
                },
                touchend(e){
                    mouseUp = e.originalEvent.changedTouches[0].clientX;        
                    
                    if( mouseDown-mouseUp > sizeX ){ // 900초과 => 900 이하
                        clearInterval(setId); // 클릭시 일시중지
                        if(!slideWrap.is(':animated')){
                            nextCount();
                        }                            
                    }
                    
                    if( mouseDown-mouseUp < -sizeX ){  // -900 미만 => -900이상
                        clearInterval(setId); // 클릭시 일시중지
                        if(!slideWrap.is(':animated')){
                            prevCount();
                        }                            
                    }

                    // -900 >= 이상이고 <= 900 이하이면 원래대로 제자리로 찾아간다.
                    if(  mouseDown-mouseUp >= -sizeX  &&  mouseDown-mouseUp <= sizeX ){
                        mainSlide();
                    }

                    mDown = false;  // 2. 드래그 끝을 알려주는 마우스 업상태
                    slideView.css({ cursor: 'grab' }); // 놓는다 손바닥 펼친다.
                }
            })



            // 1. 메인슬라이드함수

            // 페이드인 / 아웃 효과 애니메이션 슬라이드
            // 모든 슬라이드를 position: absolute; 로 해준다.
            // 맨 위 그리고 아래 포개진 슬라이드 앞뒤 순서를 정한다. z-index: 3 -> 2 -> 1 
            // 페이드 아웃 효과는 opactiy를 사용한다. 시간은 0.6s 또는 1s 정도
            // 계속 10개의 슬라이드를 반복적으로 회전하여 순서대로 보여준다.
            mainNextSlide(); // 로딩시 한 번 실행
            // 메인 다음 슬라이드
            function mainNextSlide(){
                slide.css({zIndex: 1, opacity: 1}); // 10개 모두 'z-index'로도 가능
                slide.eq(cnt).css({zIndex: 2}); //eq는 0부터 시작  // 다음 슬라이스번호 1
                // cnt가 0이면 마지막슬라이드번호 9
                // 그렇지 않으면 cnt-1
                slide.eq(cnt===0 ? n : cnt-1).css({zIndex: 3}).stop().animate({opacity: 1}, 0).animate({opacity: 0}, 1000); // 현재 슬라이스번호 0
                //ctn-1을 할경우 다시 돌아와서 cnt가 0이 되면 cnt-1 로 문제가 생긴다. 그래서 cnt=0 일경우 현재 슬라이드가 9가 되도록 설정해준다.
                pageEvent();
            }
            //메인 이전 슬라이드
            function mainPrevSlide(){
                slide.css({zIndex: 1, opacity: 1}); // 10개 모두 'z-index'로도 가능
                slide.eq(cnt===n ? 0 : cnt+1).css({zIndex: 2}); //eq는 0부터 시작  // 다음 슬라이스번호 1
                // cnt가 0이면 마지막슬라이드번호 9
                // 그렇지 않으면 cnt-1
                slide.eq(cnt).css({zIndex: 3}).stop().animate({opacity: 0}, 0).animate({opacity: 1}, 1000); // 현재 슬라이스번호 0
                //ctn-1을 할경우 다시 돌아와서 cnt가 0이 되면 cnt-1 로 문제가 생긴다. 그래서 cnt=0 일경우 현재 슬라이드가 9가 되도록 설정해준다.
                pageEvent();
            }


            // 2-1. 다음카운트함수
            function nextCount(){
                cnt++; // 1
                if(cnt>n){cnt=0};
                mainNextSlide();
            }
            // 2-2. 이전카운트함수
            function prevCount(){
                cnt--;
                if(cnt<0){cnt=n};
                mainPrevSlide();
            }

            // 3. 자동타이머함수(7초 후 7초간격 계속)
            function autoTimer(){
                setId = setInterval(nextCount, 7000);
            }
            autoTimer();

            // 4. 페이지 이벤트 함수
            function pageEvent(){
                pageBtn.removeClass('on');
                pageBtn.eq( cnt>n ? 0 : cnt).addClass('on');
            }

            // 5. 페이지버튼클릭
            pageBtn.each(function(idx){
                $(this).on({
                    click(e){
                        e.preventDefault();
                        cnt=idx;
                        mainNextSlide();
                        mainPrevSlide();
                        clearInterval(setId); // 클릭시 일시중지
                    }
                });
            });

            // 6-1. 스톱 버튼 클릭이벤트
            stopBtn.on({
                click(e){
                    e.preventDefault();
                    stopBtn.addClass('on');
                    playBtn.addClass('on');
                    clearInterval(setId); // 클릭시 일시중지
                }
            })

            // 6-2. 플레이 버튼 클릭이벤트
            playBtn.on({
                click(e){
                    e.preventDefault();
                    stopBtn.removeClass('on');
                    playBtn.removeClass('on');
                    autoTimer(); // 클릭시 재실행 7초후실행
                }
            })

            
        },
        section2(){
            // 0. 변수설정
            let cnt = 0;
            const section2Container = $('#section2 .container');
            const slideContainer = $('#section2 .slide-container');
            const slideWrap = $('#section2 .slide-wrap');
            const slideView = $('#section2 .slide-view');
            const slide = $('#section2 .slide-view .slide'); // 10개
            const slideH3 = $('#section2 .slide-view .slide h3');
            const slideH4 = $('#section2 .slide-view .slide h4');
            const pageBtn = $('#section2 .page-btn');
            const selectBtn = $('#section2 .select-btn');
            const subMenu = $('#section2 .sub-menu');
            const materialIcons = $('#section2  .select-btn .material-icons');
            const heigthRate = 0.884545392; // 너비에 대한 높이 비율
            let n = slide.length-2;   // 10개


            // 터치스와이프
            let touchStart = null;
            let touchEnd = null;

            // 드래그시작
            // 드래그끝
            let dragStart = null;
            let dragEnd = null;
            let mDown = false;
            let winW = $(window).innerWidth(); // 창너비=> 슬라이드1개의 너비
            let sizeX = 100;  // 드래그 길이
            let offsetL =   slideWrap.offset().left;  // 318 
            let slideWidth;
            // slideWrap.offset().left 좌측 좌표값
            // console.log(  slideWrap.offset().left );


            // 컨테이너 너비
            // console.log( $('#section2').innerWidth() ); // 1903
            console.log(section2Container.innerWidth()); // 1623
            // 슬라이드 1개의 너비(마진이 내부에 포함된 상태)

            resizeFn();
            //함수는 명령어의 묶음
            function resizeFn(){
                winW = $(window).innerWidth(); // 창크기가 바뀔때마다 계속 값을 보여준다.
                //1. 창 크기가 1642 픽셀 이하에서 패딩 좌측 값 0으로 설정
                if(winW <= 1642){ // 1642 이하

                    if(winW > 1280){ // 1280 초과에서는 슬라이드 3개 , 10/1(1개씩 이동)-2(마지막 2개 슬라이드는 움직이면 안됨) = 8
                        slideWidth = (section2Container.innerWidth()-0+20+20)/3 // wrap에서 maginleft -20px 를 살리기 위해 
                        // n = n-2; // 1280 초과일때 슬라이드를 8개만 보여라
                        n = slide.length-2; // 오른쪽 2개 슬라이드가 남아야해서

                        //페이지 버튼 제어(갯수) 8개인 경우 / 10개인 경우
                        pageBtn.css({ display: 'none' }); //초기값! 10개 모두 숨김
                        for(let i=0; i<n; i++){ // 8미만 7까지
                            pageBtn.eq(i).css({ display: 'block' }); // 앞에 순차적으로 8개만 보임   i는 0~7 (8개)
                        }
                        // pageBtn.eq(8).css({ display: 'none' });   //9번째
                        // pageBtn.eq(9).css({ display: 'none' })   //10번째
                        
                        if(cnt>=7){
                            cnt=7;
                        }
                    
                    }
                    else{  // 1280 이하에서는 슬라이드 1개
                        slideWidth = (section2Container.innerWidth()-0+20+20)/1  
                        // n = n;
                        console.log(slide.length);
                        n = slide.length; // 10/1 =10개 1개씩 이동 
                        pageBtn.css({ display: 'block' });// 10개 보임 (0~9) 그냥 모두 보여라
                    }

                        // pageBtn.eq(8).css({ display: 'block' });  //9번째
                        // pageBtn.eq(9).css({ display: 'block' })   //10번째


                }
                else{ // 1642 초과
                    slideWidth = (section2Container.innerWidth()-198+20+20)/3; // 한 화면 슬라이드 너비에서 magin 198를 빼준다
                    slideWrap.css({width: slideWidth * 10}); // 슬라이드 전체박스
                    slide.css({width: slideWidth, height: slideWidth*heigthRate}); // 슬라이드 한개 당
                    slideH3.css({fontSize: slideWidth*0.08}) // 38/448.333
                    slideH4.css({fontSize: slideWidth*0.03}) // 16/448.333
                    
                }
 
                mainSlide(); // 메인 슬라이드에 슬라이드 너비 전달하기 위해서 가져옴
            }

            // 가로 세로 크기가 1픽셀이라도 변경되면 동작 구동된다.
            // 가로 세로 크기가 변경이 안되면 영원히 그대로 가만히 있는다
            $(window).resize(function(){
                resizeFn();
               
            });






            slideContainer.on({
                mousedown(e){
                    slideView.css({ cursor: 'grabbing' }); // 잡는다
                    mDown = true;
                    touchStart = e.clientX;
                    dragStart = e.clientX - (slideWrap.offset().left-offsetL);
                },
                mouseup(e){
                    touchEnd = e.clientX;
                    if(touchStart-touchEnd > sizeX){
                        nextCount();
                    }
                    if(touchStart-touchEnd < -sizeX){
                        prevCount();
                    }
                    
                    // -300 >= 이상이고 <= 300 이하이면 원래대로 제자리로 찾아간다.
                    if(  touchStart-touchEnd >= -sizeX  &&  touchStart-touchEnd <= sizeX ){
                        mainSlide();
                    }
                    slideView.css({ cursor: 'grab' }); // 놓는다
                    mDown = false;
                },
                mousemove(e){
                    if(!mDown) return;

                    dragEnd = e.clientX;

                    slideWrap.css({left: dragEnd - dragStart });

                }
            });    

            $(document).on({
                mouseup(e){
                    // mDown = true; 상태에서 
                    // mouseup 에서 mDown = false; 변경
                    // 그러면 이미 실행한거임
                    // 그래서 실행 못하게 막야한다.
                    if(!mDown) return; // 마우스 다운상태에서 마우스 업이 실행이 안된상태에서만 실행하라

                    touchEnd = e.clientX;
                    if(touchStart-touchEnd > sizeX){
                        nextCount();
                    }
                    if(touchStart-touchEnd < -sizeX){
                        prevCount();
                    }
                    mDown = false;
                    // -300 >= 이상이고 <= 300 이하이면 원래대로 제자리로 찾아간다.
                    if( touchStart-touchEnd >= -sizeX  &&  touchStart-touchEnd <= sizeX ){
                        mainSlide();
                    }
                    slideView.css({ cursor: 'grab' }); // 놓는다

                }
            })

            slideContainer.on({
                touchstart(e){
                    slideView.css({ cursor: 'grabbing' }); // 잡는다
                    mDown = true;
                    touchStart = e.originalEvent.changedTouches[0].clientX;
                    dragStart = e.originalEvent.changedTouches[0].clientX - (slideWrap.offset().left-offsetL);
                },
                touchend(e){
                    touchEnd = e.originalEvent.changedTouches[0].clientX;
                    if(touchStart-touchEnd > sizeX){
                        nextCount();
                    }
                    if(touchStart-touchEnd < -sizeX){
                        prevCount();
                    }
                    
                    // -300 >= 이상이고 <= 300 이하이면 원래대로 제자리로 찾아간다.
                    if(  touchStart-touchEnd >= -sizeX  &&  touchStart-touchEnd <= sizeX ){
                        mainSlide();
                    }
                    slideView.css({ cursor: 'grab' }); // 놓는다
                    mDown = false;
                },
                touchmove(e){
                    if(!mDown) return;

                    dragEnd = e.originalEvent.changedTouches[0].clientX;

                    slideWrap.css({left: dragEnd - dragStart });

                }
            });



            // 셀렉트버튼 클릭 이벤트 => 토글 이벤트
            // 셀렉트버튼 한번 클릭하면 서브메뉴 보이고
            // 셀렉트버튼 또 한번 클릭하면 서브메뉴 숨긴
            selectBtn.on({
                click(e){
                    e.preventDefault();
                    subMenu.toggleClass('on');  // 서브메뉴
                    materialIcons.toggleClass('on'); // 아이콘
                }
            })


            // 1. 메인슬라이드함수
            mainSlide();
            function mainSlide(){                
                slideWrap.stop().animate({left: -slideWidth * cnt }, 600, 'easeInOutExpo');                
                pageBtnEvent();
            }

            // 다음카운트함수
            function nextCount(){
                cnt++;
                if(cnt>n-1) {cnt=n-1};  // 8(0~7) - 1   if(cnt>7){cnt=7} => 슬라이드 고정
                mainSlide();
            }

            // 이전카운트함수
            function prevCount(){
                cnt--
                if(cnt<0) {cnt=0};
                mainSlide();
            }


            // 2. 페이지버튼 클릭이벤트
            // each() 메서드
            pageBtn.each(function(idx){
                $(this).on({
                    click(e){
                        e.preventDefault();
                        console.log(idx);
                        cnt=idx;
                        mainSlide();
                    }
                })
            });

            //  3. 페이지버튼 이벤트 함수
            function pageBtnEvent(){
                pageBtn.removeClass('on');
                pageBtn.eq(cnt).addClass('on');
            }


        },
        section3(){},
    }
    obj.init();

})(jQuery); // 전달인수(아규먼트 Argument)
