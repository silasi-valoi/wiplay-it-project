import React, { Component } from 'react';
import  AjaxLoader from 'templates/ajax-loader';
import {AuthorAvatar} from 'templates/partials';
import {Reply, RepliesToggle} from 'templates/replies/reply-templates';
import  {getRepliesLindData} from 'actions/actionCreators';
import {store} from 'store/index';
import Api from 'utils/api';
import  {GET_REPLY_LIST}  from 'actions/types';



class RepliesConatiner extends Component {
    private isFullyMounted:boolean = false;

    constructor(props) {
      super(props);

        this.state = {
            isReplyBox : true,
            parent     : undefined,  
        };
    };

    public get isMounted() {
            return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
            this.isFullyMounted = value;
    }

    getRepliesIds(data:object){
        let isRecusive:boolean = this.props['isRecusive'];
        let isAnswerBox:boolean = this.props['isAnswerBox'];
    
        let repliesById:string; 
        let newRepliesById:string;
        let level:number = data['level'];
        let parentId:number = data['id'];

        if (isAnswerBox) {
            repliesById = isRecusive && `answerReplies-${level}-${parentId}`
                                     ||  `answerCommentReplies-${parentId}`;

        }else{
           repliesById = isRecusive && `postReplies-${level}-${parentId}`
                                    ||  `postCommentReplies-${parentId}`;
        }

        return repliesById;
    };
     
    componentDidMount() {
        this.isMounted = true;
                              
        let _replies = this.props['entities'].replies;        
        const parent:object = this.props['parent'];
        
        let newRepliesById:string;

        if (parent) {
            let level:number = parent['level']
            let parentId:number = parent['id']
            const repliesById = this.getRepliesIds(parent);

            _replies = _replies && _replies[repliesById];
            

            this.setState({repliesById, parent});
            
            if (!_replies || _replies.showLink) {
                const repliesCount:number = parent['replies_count'] || parent['child_count'];
                const replies:object[] = parent['replies'] || parent['children'];                    
                
                if (replies && replies.length) {
                    let props = {
                        replies,
                        repliesCount,
                        byId: repliesById,
                    }
                    store.dispatch(getRepliesLindData(props)); 
                }
            }
        }
    };

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        //console.log(error, info);
    }

    componentDidUpdate(nextProps, prevState) {
        //console.log(nextProps, prevState);
    }; 
   

    getProps():object {
        return {...this.props, ...this.state};
    };
   
    render() { 
        if (!this.isMounted) {
            return null;
        }

        let props  = this.getProps();
                
        let entities:object = props['entities'];
        let repliesById:string = props['repliesById'];

        const newRepliesById:string  =   props['newRepliesById'];
        
        const replies  =  entities && entities['replies'];
        let newReplies =  replies[newRepliesById];

        let repliesList =  replies[repliesById];
                            
        return (
            <div className="replies-page">
                { newReplies && newReplies.replyList &&
                    <div>
                        {NewReplies(props, newReplies)}
                    </div>
                }
                         
                { repliesList &&
                    <div>
                        { OldReplies(props, repliesList)}
                    </div>
                }
            </div>
        );
    };
};


export default RepliesConatiner;


const NewReplies = (props:object, replies:object) => {
    let isNewReplies = true;
    let replyList:Object[] = replies['replyList'];  

    return Replies(props, replyList, isNewReplies);
};


const OldReplies = (props:object, replies:object) => {
    if (!replies) {
        return null;
    }
       
    let replyList = replies['replyList'];
    let reply =   replies['linkData'].reply;
    
    return(
        <div>
            {replies['showLink'] &&
                <div  className={`replies-level-${reply['level']}`}>
                    { RepliesToggle(props, replies)}
                </div>
              
               ||

                <div>
                    {replies['isLoading'] &&
                        <div className="spin-loader-box">
                            <AjaxLoader/>
                        </div>

                        ||

                        <div>
                          { Replies(props, replyList) }
                        </div>
                    }
                </div>
            }

        </div>
    )
};

const Replies = (props, replyList:object[], isNewReply=false) => {
        
    let { parent, 
          parentId, 
          repliesById,
          newRepliesById,
          isAnswerBox } = props;
      
    return(
        <div>
            {replyList && replyList.map( (reply, index) => {
                let isCommentReply = parent && parent['id'] === reply['comment'];
                let isReplyChild = parent && parent['id'] === reply['parent'];
                
                if (!isCommentReply && !isReplyChild) return null;
                let newRepliesChildrenById;
                let byId = isNewReply && newRepliesById || repliesById;
            
                if (isAnswerBox){
                    newRepliesById = `newAnswerReplies-${reply['level']}-${reply['id']}`;

                }else{
                    newRepliesById = `newPostReplies-${reply['level']}-${reply['id']}`;
                } 

                let replyProps:object = {
                    index,
                    reply,
                    byId,
                    newRepliesById,
                };

                let replyLevelOneProps:object = {
                    ...props,
                    index,
                    parent : reply,
                    parentId : reply['id'],
                    newRepliesById,
                    isRecusive:true,
                };
                                       
                return (
                    <div  key={index} 
                          className={`replies-level-${reply['level']}`}>

                        { Reply(props, replyProps, isNewReply) }

                        <RepliesConatiner {...replyLevelOneProps}/>
                    </div>
                    
                ); 
            })}
        </div>
    );
};
