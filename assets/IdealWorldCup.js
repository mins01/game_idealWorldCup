"use strict";
/**
 * step : ready -> start -> off/on
 * method step : xxxxStart() -> showOff()-> xxxxReady() -> showOn()
 */
/*
gameReady (loadingOn) (loadingOff)
-> gameStart  (loadingOn)
    -> roundReady
    -> roundStart (loadingOff)
        -> vsReady (vsOff)
        -> vsStart -> vsDraw (vsOn) -> vsCheck => roundEnd
        -> vsSelect -> vsSelectEnd => vsReady
    -> roundEnd (loadingOn) => roundReady, resultReady
    -> resultReady
    -> resultStart (loadingOff)
    -> resultEnd
-> gameEnd
 */
class IdealWorldCup{
    container = null;
    history = null;
    constructor(container){
        this.container = container
        this.history = [];
    }

    gameReady(){
        // this.showOn()
        this.loadingOn(0,()=>{
            this.stage('ready');
            this.loadingOff(500);
        });
    }
    gameStart(){
        this.itemsReadyShuffle();
        // this.roundStart();
        this.roundReady();
    }
    gameEnd(){
        
    }










    ready(){
        this.gameReady();
    }

    start(){
        this.gameStart();
    }
    



    //-------- 라운드 부분
    round(round){
        console.log('round');
        this.container.dataset.round = round;
        this.container.querySelectorAll('*[data-round]').forEach(el => {
            el.dataset.round = round;
        });
    }
    roundRemain(){
        return this.container.querySelectorAll('.iwc-items-ready .iwc-item').length;

    }
    roundReady(){
        console.log('roundReady');
        this.loadingOn(0);
        this.itemsReady()
        const len = this.roundRemain()
        const round = Math.ceil(len/2)*2;
        this.round(round);
        console.log(`[라운드 ${round}] 남은 아이템 수 ${len}개`);
        this.stage('round')

        if(len){
            this.loadingOff(500,()=>{
                this.delay(1500,()=>{
                    this.roundStart();
                })
            });
        }else{
            // this.roundEnd();
        }
        
        return len;
    }
    roundStart(){
        console.log('roundStart');
        this.vsReady();
    }
    roundEnd(){
        console.log('roundEnd');
        this.itemsReady()
        const roundRemain = this.roundRemain();
        if(roundRemain > 1){
            this.roundReady();
        }else{
            this.resultReady();
        }
    }

    //---------------- VS 부분

    vsReady(){
        console.log('vsReady');
        // this.showOff();
        this.vsOff();
        this.stage('vs');
        this.vsStart();
    }

    vsStart(){
        console.log('vsStart');
        const vsLen = this.vsDraw()
        this.vsCheck(vsLen);
    }

    vsDraw(){
        console.log('vsDraw');
        const items = this.container.querySelectorAll('.iwc-items-ready .iwc-item');
        const len = items.length;
        
        
        if(len==0){}
        else if(len==1){
            // console.log('부전승');
            if(this.container.dataset.vs == 'on'){
                console.log('이미 vs-on 상태');
                return false;
            }
            this.vsOn(100); // this.container.dataset.vs = "on";
            this.container.dataset.unearned = "on"; 
            this.container.querySelector('.iwc-stage-vs-item-1').appendChild(items[0])
            // this.container.querySelector('.iwc-stage-vs-item-2').appendChild(items[1])
            // this.vsSelect(1) // 부전승 자동 선택
        }
        else{
            if(this.container.dataset.vs == 'on'){
                console.log('이미 vs-on 상태');
                return false;
            }

            this.vsOn(100); // this.container.dataset.vs = "on"; 
            this.container.querySelector('.iwc-stage-vs-item-1').appendChild(items[0])
            this.container.querySelector('.iwc-stage-vs-item-2').appendChild(items[1])
        }
        return len;
    }
    vsSelect(n){
        console.log('vsSelect');
        if(this.container.dataset.vsSelect != "0"){
            console.log('이미 선택함');
            return false;
        }
        this.container.dataset.vsSelect = n;
        
        this.vsOff();
        this.vsSelectEnd();
    }
    vsSelectEnd(){
        console.log('vsSelectEnd');
        const n = this.container.dataset.vsSelect
        const item_1 = this.container.querySelector('.iwc-stage-vs-item-1 .iwc-item');
        const item_2 = this.container.querySelector('.iwc-stage-vs-item-2 .iwc-item');
        this.container.dataset.vsSelect = 0;
        this.container.dataset.vs = 'off'
        this.container.dataset.unearned = "off"; 
        
        if(!item_2){ //부전승
            this.container.querySelector('.iwc-items-win').appendChild(item_1)
            this.historySave(this.container.dataset.round,item_1.dataset.idx,item_1.dataset.idx,'-1')
        }else if(n==1){
            this.container.querySelector('.iwc-items-win').appendChild(item_1)
            this.container.querySelector('.iwc-items-lose').appendChild(item_2)
            this.historySave(this.container.dataset.round,item_1.dataset.idx,item_1.dataset.idx,item_2.dataset.idx)
        }else if(n==2){
            this.container.querySelector('.iwc-items-win').appendChild(item_2)
            this.container.querySelector('.iwc-items-lose').appendChild(item_1)
            this.historySave(this.container.dataset.round,item_2.dataset.idx,item_1.dataset.idx,item_2.dataset.idx)
        }
        this.delay(500,()=>{
            this.vsReady()
        });
    }
    vsCheck(len){
        console.log('vsCheck');
        if(len===0){
            console.log('라운드 종료');
            this.delay(100,()=>{
                this.roundEnd();
            })
            
        }else{
            
        }
    }








    historySave(round,item_sel,item_1,item_2){
        this.history.push([round,item_sel,item_1,item_2]);
        console.log('history',this.history);
    }
    
    end(){

    }

    debug(debug){
        this.container.dataset.debug = debug
    }

    result(){
        this.resultReady();
    }
    resultReady(){
        this.loadingOn();
        console.log('result');
        const item = document.querySelector('.iwc-items-ready .iwc-item')
        if(!item) return;
        this.container.querySelector('.iwc-stage-result-item').appendChild(item);
        console.log('history',this.history);

        this.stage('result');

        this.delay(500,()=>{
            this.resultStart();
        })

    }
    resultStart(){
        this.loadingOff();
        this.delay(500,()=>{
            this.resultEnd();
        })
    }
    resultEnd(){

    }

    reset(){
        console.log('reset');
        const iwc_items_ready = this.container.querySelector('.iwc-items-ready');
        let items = [...document.querySelectorAll('.iwc-item')];
        items.sort((a,b)=>{
            return parseFloat(a.dataset.idx) - parseFloat(b.dataset.idx);
        })
        items.forEach((el)=>{
            iwc_items_ready.appendChild(el);
        })
        this.container.dataset.vsSelect = 0;
        this.vsOff(); // this.container.dataset.vs = 'off'
        this.container.dataset.unearned = "off"; 
        this.history = [];
    }


    stage(stage){
        this.container.dataset.stage = stage;
        this.container.querySelectorAll('*[data-stage]').forEach(el => {
            el.dataset.stage = stage;
        });
    }





    itemsReady(){
        console.log('itemsReady');
        const iwc_items_ready = this.container.querySelector('.iwc-items-ready');
        document.querySelectorAll('.iwc-items-win .iwc-item').forEach((el)=>{
            iwc_items_ready.appendChild(el);
        })
    }
    itemsReadyShuffle(){
        console.log('itemsReadyShuffle');
        let items = [...document.querySelectorAll('.iwc-items-ready .iwc-item')];
        items.sort((a,b)=>{
            return Math.random() - 0.5
        })
        const iwc_items_ready = this.container.querySelector('.iwc-items-ready');
        items.forEach((el)=>{
            iwc_items_ready.appendChild(el);
        })
    }


    // showOff(delay,cb){
    //     if(!delay){
    //         this.container.dataset.show = "off"; 
    //         if(cb){ cb(); }
    //     }else{
    //         setTimeout(() => {
    //             this.container.dataset.show = "off"; 
    //             if(cb){ cb(); }
    //         }, delay);
    //     }
    // }
    // showOn(delay,cb){
    //     if(!delay){
    //         this.container.dataset.show = "on"; 
    //         if(cb){ cb(); }
    //     }else{
    //         setTimeout(() => {
    //             this.container.dataset.show = "on"; 
    //             if(cb){ cb(); }
    //         }, delay);
    //     }
    // }

    loadingOff(delay,cb){
        console.log('loadingOff',arguments);
        if(!delay){
            this.container.dataset.loading = "off"; 
            if(cb){ cb(); }
        }else{
            setTimeout(() => {
                this.container.dataset.loading = "off"; 
                if(cb){ cb(); }
            }, delay);
        }
    }
    loadingOn(delay,cb){
        console.log('loadingOn',arguments);
        if(!delay){
            this.container.dataset.loading = "on"; 
            if(cb){ cb(); }
        }else{
            setTimeout(() => {
                this.container.dataset.loading = "on"; 
                if(cb){ cb(); }
            }, delay);
        }
    }

    vsOff(delay,cb){
        console.log('vsOff',arguments);
        if(!delay){
            this.container.dataset.vs = "off"; 
            if(cb){ cb(); }
        }else{
            setTimeout(() => {
                this.container.dataset.loading = "off"; 
                if(cb){ cb(); }
            }, delay);
        }
    }
    vsOn(delay,cb){
        console.log('vsOn',arguments);
        if(!delay){
            this.container.dataset.vs = "on"; 
            if(cb){ cb(); }
        }else{
            setTimeout(() => {
                this.container.dataset.vs = "on"; 
                if(cb){ cb(); }
            }, delay);
        }
    }


    delay(delay,cb){
        setTimeout(() => { if(cb){ cb(); } }, delay);
    }

    show(delay,cb){
        this.showOff();
        this.showOn(delay,cb);
    }






    
}