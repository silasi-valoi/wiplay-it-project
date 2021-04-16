import React, { Component } from 'react';
import  AjaxLoader from 'templates/ajax-loader';
import { RepliesComponent,CommentsReplyLink, Reply } from 'templates/replies/reply-templates';
import  * as action  from 'actions/actionCreators';
import ReplyChildrenBox from "containers/main/replies/reply-children-page";

import {store} from "store/index";



class RepliesBox extends Component {

   constructor(props) {
      super(props);

        this.state = {
            isReplyBox : true,
            comment    : undefined,  
        };
    };

     
    componentDidMount() {
        const comment:object = this.props['comment']; 
        let replies:object[]  = comment['replies'];
     
        let repliesById = comment &&  comment['answer'] &&  `answerReplies${comment['id']}` ||
                 comment &&  comment['post']   &&  `postReplies${comment['id']}`; 

        let newRepliesById  =  `newCommentsReplies${comment['id']}`;   

        this.setState({repliesById, newRepliesById, comment});                    
      
        if (replies && replies.length) {
                 
           let props = {
                   actionType : 'GET_REPLY_LINK_DATA',
                   replies,
                   byId: repliesById,
            }
            store.dispatch(action.getRepliesLindData(props)); 
        }
     
   };

   componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

   componentDidUpdate(nextProps, prevState) {
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
                <div>
                    {newReplies && newReplies.replyList?
                        <NewAddedReplies {...props}/>
                        :
                        ""
                    }
                </div>

                <div>
                    { repliesList?
                        <ViewedReplies {...props}/>
                        :
                        ""
                    }
                </div>
            </div>
        );
    };
};


export default RepliesBox;






const NewAddedReplies = props => {
   let {entities, newRepliesById} = props;
   let replies = entities.replies[newRepliesById]; 
   let isNewReplies = true;

   let replyList = replies.replyList && replies.replyList.length && replies.replyList;  
   return Replies(props, replyList, isNewReplies);
};


const ViewedReplies = props => {
    let {entities, repliesById} = props;
    let replies = entities.replies[repliesById]; 

    let replyList = replies.replyList && replies.replyList.length && replies.replyList;  
    return(
        <div>
            { replies.showLink?
                <CommentsReplyLink {...props}/>
                :
                <div>
                    { replies.isLoading?
                        <div className="spin-loader-box">
                            <AjaxLoader/>
                        </div>
                        :
                        <div>
                          { Replies(props, replyList)}
                        </div>
                    }
                </div>
            }

        </div>
    )
};

const Replies = (props, replyList, isNewReply=false) => {
    let {comment, repliesById, newRepliesById} = props;
   
    let replyStyles = {
         border     : 'px solid black',
         margin     : '15px 22px',
    };

    return(
        <div>
            {replyList?.map( (reply, index) => {
                let replyProps = {
                        reply,
                        byId : repliesById,
                        newRepliesById, 
                        index,
                        replyStyles,
                };

                let replyChildProps = {...props, reply}
           
                return (
                    <div  key={index} >
                        { comment.id === reply.comment?
                            <div className="reply-container">
                                <div className="reply-contents"> 
                                    { Reply( props, replyProps, isNewReply) }
                                    <ReplyChildrenBox {...replyChildProps}/>
                                </div>
                            </div>
                            :
                            ""
                        } 
                    </div> 
                ); 
            })}
        </div>
    );
};

