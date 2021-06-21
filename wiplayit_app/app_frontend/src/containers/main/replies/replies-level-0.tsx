import React, { Component } from 'react';
import  AjaxLoader from 'templates/ajax-loader';
import {AuthorAvatar} from 'templates/partials';
import {Reply, CommentsReplyLink} from 'templates/replies/reply-templates';
import  * as action  from 'actions/actionCreators';
import {store} from 'store/index';
import RepliesLevelOne from 'containers/main/replies/replies-level-1';




class RepliesLevelZero extends Component {
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

        if (comment) {
            let repliesById = comment['answer'] && `answerReplies${comment['id']}` 
                              || comment['post'] && `postReplies${comment['id']}`; 

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


export default RepliesLevelZero;


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

const Replies = (props, replyList:object[], isNewReply=false) => {
    let {comment, repliesById, newRepliesById} = props;
   
    let replyStyles = {
         border     : 'px solid black',
         margin     : '15px 22px',
    };

    return(
        <div>
            {replyList?.map( (reply, index) => {
                if (comment['id'] !== reply['comment']) {
                    return null;
                }

                let replyProps = {
                        reply,
                        byId : repliesById,
                        newRepliesById, 
                        index,
                        replyStyles,
                };

                const authorProps:object  = {
                    author : reply['author'],
                    data   : reply,
                };

                let replyChildProps = {...props, reply}
           
                return (
                    <div  key={index} >
                        <div  className={`replies-level-${reply['level']}`}>
                            <div  className="reply-contents">
                                <AuthorAvatar {...authorProps}/>
                                {Reply( props, replyProps, isNewReply) }
                                
                            </div>
                            <RepliesLevelOne {...replyChildProps}/>
                        </div>
                        
                    </div> 
                ); 
            })}
        </div>
    );
};






