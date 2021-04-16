import React, { Component } from 'react';
import  AjaxLoader from 'templates/ajax-loader';
import {Reply, ChildRepliesLink } from 'templates/replies/reply-templates';
import  * as action  from 'actions/actionCreators';
import {store} from 'store/index';
import ReplyGrandChildrenBox from 'containers/main/replies/reply-grand-children-page';




class ReplyChildrenBox extends Component {

    constructor(props) {
       super(props);

        this.state = {
            isReplyChildBox    : true,
            childParent        : '',
            replyChildById  : '',
            newChildRepliesById: '',
        };
    };

    componentDidCatch(error, info) {
       // You can also log the error to an error reporting service
       console.log(error, info);
    }

    componentDidMount() {
         
        let answer = this.props['answer'];
        let reply = this.props['reply']
        let post = this.props['post']

        if (reply) {
                        
            let replyChildById  = post && `postReplyChild${reply.id}` 
                                  || answer && `answerReplyChild${reply.id}`; 
            
            let newChildRepliesById  =  `newReplies${reply.id}`; 

            this.setState({replyChildById, newChildRepliesById, childParent:reply});
            var props = {
                    actionType : 'GET_REPLY_CHILD_LINK_DATA',
                    reply,
                    byId: replyChildById,
            }
            reply.has_children && store.dispatch(action.getReplyChildLindData(props)); 
        }
     
    };
   
    componentDidUpdate(nextProps, prevState) {
      
    }; 
  
    getProps() {
        return {...this.props, ...this.state};
    };


    render() { 
        let props      = this.getProps();
        const entities = props['entities'];
        const replyChildById = props['replyChildById'];
        const newChildRepliesById = props['newChildRepliesById'];
       

        
        const replies   =  entities && entities.replies;
        let newReplies  =  replies  && replies[newChildRepliesById];

        let repliesList =  replies  && replies[replyChildById];
       
        //console.log(props,replies, newReplies, newChildRepliesById, replyChildById)
               
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


export default ReplyChildrenBox;





const NewAddedReplies = props => {
   let {entities, newChildRepliesById} = props;
   let replies = entities.replies[newChildRepliesById]; 
   let isNewReplies = true;

   let replyList = replies.replyList && replies.replyList.length && replies.replyList;  
   return Replies(props, replyList, isNewReplies);
};


const ViewedReplies = props => {
    let {entities, replyChildById } = props;
    let replies = entities.replies[replyChildById]; 

    let replyList =  replies && replies.replyList && replies.replyList.length && replies.replyList;  
    return(
        <div>
            { replies.showLink?
                <ChildRepliesLink {...props}/>
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


const Replies = (props, replyList, isNewReplies=false) => {
    let { 
        replyChildById,
        newChildRepliesById,
        childParent,
                    } = props;

    let replyStyles = {
            border     : 'px solid blue',
            margin     : '15px 22px 10px  38px',
    };     

    return(
        <div>
            { replyList && replyList.map( (reply, index) => {
                let replyProps = {
                        reply,
                        byId : props.replyChildById,
                        index,
                        newRepliesById : newChildRepliesById,
                        replyStyles,
                        
                }
                let replyChildProps = {...props, reply}
                //console.log(replyChildProps, childParent.id === reply.parent)

                return (
                    <div  key={index} >
                        { childParent.id === reply.parent?
                            <div className="reply-child-container">
                                <div className="reply-child-contents">  
                                    { Reply( props, replyProps, isNewReplies) }
                                    <ReplyGrandChildrenBox {...replyChildProps}/>
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

