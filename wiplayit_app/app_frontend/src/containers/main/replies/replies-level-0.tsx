import React, { Component } from 'react';
import  AjaxLoader from 'templates/ajax-loader';
import {AuthorAvatar} from 'templates/partials';
import {Reply, CommentRepliesLink} from 'templates/replies/reply-templates';
import  * as action  from 'actions/actionCreators';
import {store} from 'store/index';
import RepliesLevelOne from 'containers/main/replies/replies-level-1';
import Api from 'utils/api';
import  {GET_REPLY_LIST}  from 'actions/types';



class RepliesLevelZero extends Component {
    constructor(props) {
      super(props);

        this.state = {
            isReplyBox : true,
            parent     : undefined,  
        };
    };
     
    componentDidMount() {
        //console.log(this.props);
        let isAnswerBox:boolean = this.props['isAnswerBox'];
        let isPostBox:boolean = this.props['isPostBox'];
        let isRecusive:boolean = this.props['isRecusive'];

        /*
        if (isRecusive) {
            let fruits:string[] = [] 
            let newLength = fruits.push('Orange')
            newLength = fruits.unshift('Strawberry')
            newLength = fruits.push('Banana')
            console.log(newLength, fruits)
            
        }*/
        let _replies = this.props['entities'].replies        
        const parent:object = this.props['parent'];
        let parentId:number = this.props['parentId'];
        let repliesById:string; 
        let newRepliesById:string;

        if (parent) {
            repliesById = isAnswerBox && `answerRepliesLevel-0-${parentId}` 
                          || isPostBox && `postRepliesLevel-0-${parentId}`; 
            
            newRepliesById = isAnswerBox && `newAnswerReplieLevel-0-s${parentId}`
                            || isPostBox && `newPostRepliesLevel-0-${parentId}`;

            //console.log(_replies, repliesById)
            _replies = _replies[repliesById]
            
            //if (!replies || replies.showLink) {

                this.setState({repliesById, newRepliesById, parent});
                const replies:object[]  = parent['replies'];                    
                
                if (replies && replies.length) {
                    let props = {
                        actionType : 'GET_REPLY_LINK_DATA',
                        replies,
                        byId: repliesById,
                    }
                    store.dispatch(action.getRepliesLindData(props)); 
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
        let props  = this.getProps();
                
        let entities:object = props['entities'];
        let repliesById:string = props['repliesById']
        const newRepliesById:string  =   props['newRepliesById'];
        
        const replies  =  entities && entities['replies'];
        let newReplies =  replies[newRepliesById];

        let repliesList =  replies[repliesById];
                     
        return (
            <div>
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


export default RepliesLevelZero;


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
                    { Replies(props, [reply], false) }
                    <CommentRepliesLink {...props}/>
                </div>
              
               ||

                <div>
                    { replies['isLoading'] &&
                        <div className="spin-loader-box">
                            <AjaxLoader/>
                        </div>

                        ||

                        <div>
                          { Replies(props, replyList)}
                        </div>
                    }
                </div>
            }

        </div>
    )
};

const Replies = (props, replyList:object[], isNewReply=false) => {
    let {parent, parentId, repliesById, newRepliesById} = props;
      
    return(
        <div>
            {replyList?.map( (reply, index) => {
                let isCommentReply = parent && parent['id'] === reply['comment'];
                                                   
                if (!isCommentReply) return null;
            
                let replyProps = {
                        reply,
                        byId : repliesById,
                        newRepliesById, 
                };

                let replyLevelOneProps = {...props, reply}
                         
                return (
                    <div  key={index} 
                          className={`reply-container replies-level-${reply['level']}`}>
                        { Reply(props, replyProps, isNewReply) }
                        <RepliesLevelOne {...replyLevelOneProps}/>
                    </div>
                    
                ); 
            })}
        </div>
    );
};
