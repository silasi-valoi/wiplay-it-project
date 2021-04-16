import React, { Component } from 'react';
import  AjaxLoader from 'templates/ajax-loader';
import  * as action  from 'actions/actionCreators';
import  * as types  from 'actions/types';
import {store} from "store/index";

import {Reply } from 'templates/replies/reply-templates';
import Api from 'utils/api';


 
const api      = new Api();




class ReplyGreatGrandChildBox extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isReplyGreatGrandChildBox : true,
            replyChildById            : '',
            newChildRepliesById       : '',
            childParent               : '', 
        };
    };


    componentDidMount() {
        
        let answer = this.props['answer'];
        let reply = this.props['reply']
        let post = this.props['post']
        
        if (reply) {
            let replyChildById  = post   && `postReplyGreatGrandChild${reply.id}` 
                               || answer && `answerReplyGreatGrandChild${reply.id}`; 
            
            let newChildRepliesById  =  `newReplies${reply.id}`; 

            this.setState({replyChildById, newChildRepliesById, childParent:reply});

            
            var props = {
                actionType : 'GET_REPLY_CHILD_LINK_DATA',
                reply,
                byId: replyChildById,
                children : reply.children
            }

            reply.has_children && store.dispatch(action.getReplyChildLindData(props)); 
        }
    };

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        console.log(error, info);
    } 

    componentDidUpdate(nextProps, prevState) {
      
    }; 
  
    getProps() {
        return {...this.props, ...this.state};
    };

    render() {
        let props      =   this.getProps();
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


export default ReplyGreatGrandChildBox;









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
     var linkProps = {
            actionType: types.GET_REPLY_CHILD_LIST,
            byId      : replyChildById,
            children  : replyList,
        };     

    return(
        <div>
            { replies.showLink?
                <div onClick={ () => props.getReplyChildrenList( linkProps ) }> 
                    <ul>
                        <li>Click to view More</li>
                            <li>{ replies.linkData.totalReplies }</li>
                        </ul>
                </div>            
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
    
    let replyStyles = {
            border     : 'px solid green',
            margin     : '15px 22px 10px 75px'
        };     

    return(
        <div>
            { replyList && replyList.map( (reply, index) => {
                let replyProps = {
                        reply,
                        byId : props['replyChildById'],
                        index,
                        newRepliesById: props['newChildRepliesById'],
                        replyStyles,
                        
                };

                let replyChildProps = {...props, reply}
                //console.log(replyChildProps, childParent.id === reply.parent)


                return (
                    <div  key={index} >
                        { childParent['id'] === reply['parent']?
                            <div className="reply-great-grand-child-container">
                                <div className="reply-great-grand-child-contents">
                              
                                    { Reply( props, replyProps, isNewReplies) }

                                    { reply['has_children']?
                                        <ReplyGreatGrandChildBox {...replyChildProps}/>
                                        :
                                        ''
                                    }
                                   
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


