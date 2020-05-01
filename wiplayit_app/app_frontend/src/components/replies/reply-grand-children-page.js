import React, { Component } from 'react';
import  AjaxLoader from 'templates/ajax-loader';
import {Reply,GrandChildRepliesLink  } from 'templates/replies/reply-templates';
import  * as action  from 'actions/actionCreators';
import {store} from "store/index";
import ReplyGreatGrandChildBox from "components/replies/reply-great-grand-child-page";




class ReplyGrandChildrenBox extends Component {

   constructor(props) {
      super(props);

      this.state = {
         isReplyGrandChildBox : true,
         childParent          : '',
         replyChildById       : '',
         newChildRepliesById : '',
      };
   };

   componentDidCatch(error, info) {
      // You can also log the error to an error reporting service
      console.log(error, info);
   }

    componentDidMount() {
        //console.log(this.props)
        let {reply, post, answer} = this.props; 

        if (reply) {
            let replyChildById  = post && `postReplyGrandChild${reply.id}` 
                                  || answer && `answerReplyGrandChild${reply.id}`; 
            
            let newChildRepliesById  =  `newReplies${reply.id}`; 

            this.setState({replyChildById, newChildRepliesById, childParent:reply});
         
            let props = {
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
     
        let props      =   this.getProps();
        let {
            replies,
            entities,
            replyChildById,
            newChildRepliesById } =   props;

        
        replies         =  entities && entities.replies;
        let newReplies  =  replies && replies[newChildRepliesById];

        let repliesList =  replies && replies[replyChildById]; 

        //console.log(props, repliesList,newReplies ,replyChildById,newChildRepliesById )
      
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




export default ReplyGrandChildrenBox;





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
                <GrandChildRepliesLink {...props}/>
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

const Replies = (props, replyList, isNewReplies) => {
    //console.log(replyList);
    let { 
        replyChildById,
        newChildRepliesById,
        childParent,
                    } = props;

    let replyStyles = {
            border    : 'px solid red',
            margin    : '15px 22px 10px 60px',
        };     

    return(
        <div>
            { replyList && replyList.map( (reply, index) => {
                let replyProps = {
                        reply,
                        byId : replyChildById,
                        index,
                        newRepliesById: newChildRepliesById,
                        replyStyles,
                        
                };

                let replyChildProps = {...props, reply}
                //console.log(replyChildProps, childParent.id === reply.parent)


                return (
                    <div  key={index} >
                        { childParent.id === reply.parent?
                            <div className="reply-child-container">
                                <div className="reply-child-contents">  
                                    { Reply( props, replyProps, isNewReplies) }
                                    <ReplyGreatGrandChildBox {...replyChildProps}/>
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





