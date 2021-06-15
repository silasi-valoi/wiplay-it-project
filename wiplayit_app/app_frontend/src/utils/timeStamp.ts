


export default class GetTimeStamp {
    public  timeStamp:any;

    constructor(props) {
        this.timeStamp = props && props.timeStamp;
    }
    
    currentTimeStamp(){
        return new Date();
    }

    milliSeconds(){
        let currentTimeStamp = this.currentTimeStamp();
        return currentTimeStamp.getTime() - this.timeStamp;
    }

    seconds(){
        return this.milliSeconds() / 1000;
    }
    
    menutes(){
        return this.seconds() / 60;
    }

    hours(){
        return this.menutes()  / 60;
    }

    days(){
        return this.hours() / 24
    }

    weeks(){
        return this.days() / 7
    }

    months(){
        return this.weeks() / 4
    }

    years(){
        return this.months() / 12
    }
  
}
