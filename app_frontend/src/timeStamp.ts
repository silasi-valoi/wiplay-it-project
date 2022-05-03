


export default class GetTimeStamp {
    public  timeStamp:any;

    constructor(props) {
        this.timeStamp = props && props.timeStamp;
    }
    
    currentDate(){
        return new Date();
    }

    milliSeconds(){
        let currentTimeStamp = this.currentDate();
        let timeStamp = this.timeStamp;

        if (typeof timeStamp === 'string') {
            timeStamp = new Date(timeStamp).getTime();
        }

        return currentTimeStamp.getTime() - timeStamp;
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

    getLocaleDateString = (time, dateOptions:object)=>{
        return time.toLocaleDateString('en-GB', dateOptions)
    }

    getTime(){
        let timeCreated = new Date(this.timeStamp);
        return timeCreated; 
    }

    timeSince(){
        let currentDate = this.currentDate();
        let timeCreated = this.getTime();
       
        let secondDiff     = parseInt(`${this.seconds()}`)  
        let menDiff        = parseInt(`${this.menutes()}`);
        let hourDiff       = parseInt(`${this.hours()}`);
        let dayDiff        = parseInt(`${this.days()}`);
        let weekDiff       = parseInt(`${this.weeks()}`);
          
        let dateCreated;
        let dateOptions;
   
        let month = this.getLocaleDateString(timeCreated, {month : 'short'}); 
        let day   = this.getLocaleDateString(timeCreated, {day   : 'numeric'});
        let year  = this.getLocaleDateString(timeCreated, {year  : 'numeric'});
    
        if (secondDiff <= 59) {
            dateCreated = `Now`;

        }else if (menDiff <= 59) {
            dateCreated = `${menDiff} menutes ago`;

        }else if(hourDiff <= 23){
            dateCreated = `${hourDiff} hours ago`;
        
        }else if(dayDiff <= 6){
            dateOptions = {'weekday':'short'}
            dateCreated = this.getLocaleDateString(timeCreated, dateOptions)
        
        }else if(weekDiff === 1){
            dateCreated = 'Last Week';

        }else{
            let yearCreated = timeCreated.getFullYear();
            let currentYear = currentDate.getFullYear()
    
            if (yearCreated === currentYear) {
                dateCreated = month + ' ' + day; 
                
            }else{
                dateCreated =  month + ' ' + day + ', ' + year;
            }
        }

        return dateCreated;

    }

}


