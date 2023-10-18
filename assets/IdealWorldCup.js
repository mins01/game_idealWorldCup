"use strict";
/**
 * step : ready -> start -> off/on
 * method step : xxxxStart() -> showOff()-> xxxxReady() -> showOn()
 */
class IdealWorldCup{
    container = null;
    history = null;
    constructor(container){
        this.container = container
        this.history = [];
    }

    ready(){
        console.log('ready');

        this.showOff(100,()=>{
            this.showOn(500,()=>{
                this.stage('ready');
            });
        });
        
    }

    start(){
        console.log('start');
        this.itemsReadyShuffle();
        this.roundStart();
    }

    roundStart(){
        this.showOff();
        this.stage('round');
        this.roundReady();
        this.showOn(500,()=>{
            this.delay(2000,()=>{
                this.vsStart()
            });
        });
        
        // this.showOn(500,()=>{
            
        //     this.showOff(1000,()=>{
                
        //     });
        // });
    }

    vsStart(){
        this.showOff();
        this.delay(500,()=>{
            this.stage('vs');
            const vsLen = this.vsReady()
            this.vsOn(vsLen);
            // this.showOn(500);
        })
        
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
        this.resultStart();
    }
    resultStart(){
        this.showOff()
        this.delay(500,()=>{
            this.stage('result');
            this.resultReady();
            this.showOn(500,()=>{
            });
        })
        
    }
    resultReady(){
        console.log('result');
        const item = document.querySelector('.iwc-items-ready .iwc-item')
        if(!item) return;
        this.container.querySelector('.iwc-stage-result-item').appendChild(item);
        console.log('history',this.history);
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
        this.container.dataset.vs = 'off'
        this.container.dataset.unearned = "off"; 
        this.history = [];
    }


    stage(stage){
        this.container.dataset.stage = stage;
        this.container.querySelectorAll('*[data-stage]').forEach(el => {
            el.dataset.stage = stage;
        });
    }


    round(round){
        console.log('round');
        this.container.dataset.round = round;
        this.container.querySelectorAll('*[data-round]').forEach(el => {
            el.dataset.round = round;
        });
    }
    roundReady(){
        this.itemsReady()
        const len = this.container.querySelectorAll('.iwc-items-ready .iwc-item').length;
        const round = Math.ceil(len/2)*2;
        this.round(round);
        console.log(`[라운드 ${round}] 남은 아이템 수 ${len}개`);
        return len;
    }

    // vs(vs){
    //     console.log('vs');
    //     this.container.dataset.vs = vs;
    //     this.container.querySelectorAll('*[data-vs]').forEach(el => {
    //         el.dataset.vs = vs;
    //     });
    // }
    vsReady(){
        const items = this.container.querySelectorAll('.iwc-items-ready .iwc-item');
        const len = items.length;
        
        
        if(len==0){}
        else if(len==1){
            // console.log('부전승');
            if(this.container.dataset.vs == 'on'){
                console.log('이미 vs-on 상태');
                return false;
            }
            this.container.dataset.vs = "on";
            this.container.dataset.unearned = "on"; 
            this.container.querySelector('.iwc-stage-vs-item-1').appendChild(items[0])
            // this.container.querySelector('.iwc-stage-vs-item-2').appendChild(items[1])
            // this.showOff()
            // this.show(100,()=>{
            //     setTimeout(() => {
            //         this.vsSelect(1) // 부전승 자동 선택
            //     }, 1200);
            // });

        }
        else{
            if(this.container.dataset.vs == 'on'){
                console.log('이미 vs-on 상태');
                return false;
            }
            this.container.dataset.vs = "on"; 
            this.container.querySelector('.iwc-stage-vs-item-1').appendChild(items[0])
            this.container.querySelector('.iwc-stage-vs-item-2').appendChild(items[1])
            // this.show(100);
        }
        return len;
    }
    vsSelect(n){
        if(this.container.dataset.vsSelect != "0"){
            console.log('이미 선택함');
            return false;
        }
        this.container.dataset.vsSelect = n;
        
        this.showOff(1000,()=>{
            this.delay(500,()=>{
                this.vsSelectAfter();
                this.vsStart()
            });
        });
        
    }
    vsSelectAfter(){
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
        
    }
    vsOn(len){
        if(len===0){
            console.log('라운드 종료');
            this.delay(300,()=>{
                this.stage('loading');
                this.showOn();
                const roundRemain = this.roundReady();
                this.delay(1000,()=>{
                    if(roundRemain > 1){
                        this.roundStart();
                    }else{
                        this.resultStart();
                    }
                })
                
            })
            
        }else{
            this.showOn();
        }
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


    showOff(delay,cb){
        if(!delay){
            this.container.dataset.show = "off"; 
            if(cb){ cb(); }
        }else{
            setTimeout(() => {
                this.container.dataset.show = "off"; 
                if(cb){ cb(); }
            }, delay);
        }
    }
    showOn(delay,cb){
        if(!delay){
            this.container.dataset.show = "on"; 
            if(cb){ cb(); }
        }else{
            setTimeout(() => {
                this.container.dataset.show = "on"; 
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