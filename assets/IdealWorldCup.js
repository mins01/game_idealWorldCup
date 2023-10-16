"use strict";

class IdealWorldCup{
    container = null;
    constructor(container){
        this.container = container
    }

    start(){
        this.roundNext();
        this.stage('round');
        this.vsNext()
        this.stage('vs');

    }
    
    end(){

    }


    stage(stage){
        this.container.dataset.stage = stage;
        this.container.querySelectorAll('*[data-stage]').forEach(el => {
            el.dataset.stage = stage;
        });
    }


    round(round){
        this.container.dataset.round = round;
        this.container.querySelectorAll('*[data-round]').forEach(el => {
            el.dataset.round = round;
        });
    }
    roundNext(){
        this.itemsReady()
        const len = this.container.querySelectorAll('.iwc-items-ready .iwc-item').length;
        console.log(len,'개');
        const round = Math.ceil(len/2)*2;
        this.round(round);
        return len;
    }

    vs(vs){
        this.container.dataset.vs = vs;
        this.container.querySelectorAll('*[data-vs]').forEach(el => {
            el.dataset.vs = vs;
        });
    }
    vsNext(){
        const items = this.container.querySelectorAll('.iwc-items-ready .iwc-item');
        const len = items.length;
        
        
        if(items.length==0){}
        else if(items.length==1){ }
        else{
            if(this.container.querySelector('.iwc-stage-vs').dataset.vs == 'on'){
                console.log('이미 vs-on 상태');
                return false;
            }
            this.container.querySelector('.iwc-stage-vs').dataset.vs = "on";
            
            this.container.querySelector('.iwc-stage-vs-item-1').appendChild(items[0])
            this.container.querySelector('.iwc-stage-vs-item-2').appendChild(items[1])
        }
        return len;
    }
    vsSelect(n){
        this.container.dataset.vsSelect = n;
        this.vsSelectMove();
        const len = this.vsNext();
        this.vsCheck(len);
    }
    vsSelectMove(){
        const n = this.container.dataset.vsSelect
        const item_1 = this.container.querySelector('.iwc-stage-vs-item-1 .iwc-item');
        const item_2 = this.container.querySelector('.iwc-stage-vs-item-2 .iwc-item');
        this.container.dataset.vsSelect = 0;
        this.container.querySelector('.iwc-stage-vs').dataset.vs = 'off'
        
        if(n==1){
            this.container.querySelector('.iwc-items-win').appendChild(item_1)
            this.container.querySelector('.iwc-items-lose').appendChild(item_2)
        }else if(n==2){
            this.container.querySelector('.iwc-items-win').appendChild(item_2)
            this.container.querySelector('.iwc-items-lose').appendChild(item_1)
        }
        
    }
    vsCheck(len){
        if(len===0){
            const remain = this.roundNext();
            if(remain > 1){
                this.stage('round');
                this.vsNext()
                this.stage('vs');
            }else{
                this.result();
            }
            

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
        let items = [...document.querySelectorAll('.iwc-items-ready .iwc-item')];
        items.sort((a,b)=>{
            return Math.random() - 0.5
        })
        const iwc_items_ready = this.container.querySelector('.iwc-items-ready');
        items.forEach((el)=>{
            iwc_items_ready.appendChild(el);
        })
    }

    result(){
        const item = document.querySelector('.iwc-items-ready .iwc-item')
        this.container.querySelector('.iwc-stage-result-item').appendChild(item);
    }






    
}