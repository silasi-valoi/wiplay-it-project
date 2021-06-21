import React, { Component } from 'react';
import  AjaxLoader from 'templates/ajax-loader';
import {AuthorAvatar} from 'templates/partials';
import {Reply,GrandChildRepliesLink  } from 'templates/replies/reply-templates';
import  * as action  from 'actions/actionCreators';
import {store} from "store/index";
import RepliesLevelTree from "containers/main/replies/replies-level-3";




class RepliesLevelTwo extends Component {

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
        let answer = this.props['answer'];
        let reply = this.props['reply']
        let post = this.props['post']

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
     
        const props   =   this.getProps();
        let entities = props['entities']

        const replyChildById =   props['replyChildById'];
        const newChildRepliesById = props['newChildRepliesById']

        
        const replies         =  entities && entities.replies;
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




export default RepliesLevelTwo;





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

const Replies = (props:object, replyList:object[], isNewReplies?:boolean) => {
    const childParent:object = props['childParent'];
    
    return(
        <div>
            { replyList && replyList.map( (reply, index) => {
                let replyProps = {
                        reply,
                        byId : props['replyChildById'],
                        index,
                        newRepliesById: props['newChildRepliesById'],
                        
                        
                };
                const authorProps:object  = {
                    author : reply['author'],
                    data:reply,
                };

                let replyChildProps = {...props, reply}
               
                return (
                    <div  key={index} >
                        {childParent['id'] === reply['parent'] &&
                            <div className={`replies-level-${reply['level']}`}>
                                <div  className="reply-contents">
                                     <AuthorAvatar {...authorProps}/>
                                    { Reply( props, replyProps, isNewReplies) }
                                    
                                </div>
                                <RepliesLevelTree {...replyChildProps}/>
                            </div>
                        } 
                    </div> 
                ); 
            })}
        </div>
    );
};





