import React, { Component } from 'react';
import  AjaxLoader from 'templates/ajax-loader';
import {AuthorAvatar} from 'templates/partials';
import {Reply, ChildrenRepliesLink} from 'templates/replies/reply-templates';
import  * as action  from 'actions/actionCreators';
import {store} from 'store/index';
import RepliesLevelTwo from 'containers/main/replies/replies-level-2';




class RepliesLevelOne extends Component {

    constructor(props) {
       super(props);

        this.state = {
            isReplyChildBox    : true,
            childParent        : '',
            repliesById  : '',
            newRepliesById: '',
        };
    };

    componentDidCatch(error, info) {
       // You can also log the error to an error reporting service
       //console.log(error, info);
    }

    componentDidMount() {
        let answer = this.props['answer'];
        let reply = this.props['reply']
        let post = this.props['post']

        if (reply) {
            let repliesById  = post && `postRepliesLevel-1-${reply.id}` 
                                  || answer && `answerRepliesLevel-1-${reply.id}`; 
            
            let newRepliesById  =  `newRepliesLevel-1-${reply.id}`; 

            this.setState({
                repliesById,
                newRepliesById,
                parent:reply}
            );

            const props = {
                    actionType : 'GET_REPLY_CHILD_LINK_DATA',
                    reply,
                    byId: repliesById,
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
        const byId = props['repliesById'];
        const newRepliesById = props['newRepliesById'];
               
        const replies   =  entities && entities.replies;
        let newReplies  =  replies  && replies[newRepliesById];

        let repliesList =  replies  && replies[byId];
            
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


export default RepliesLevelOne;





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
    
    //console.log(replies)

    return(
        <div>
            { replies['showLink'] &&
                <div  className={`replies-level-${reply['level']}`}>
                    { Replies(props, [reply], false) }
                    { ChildrenRepliesLink(props, replies) }
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


const Replies = (props, replyList:object[], isNewReplies=false) => {
    let {repliesLevelOneById, newRepliesLevelOneById, parent} = props;

    return(
        <div>
            {replyList && replyList.map( (reply, index) => {
                let isReplyChild = parent && parent['id'] === reply['parent']
                if (!isReplyChild) return null;

                let replyProps = {
                        reply,
                        byId : repliesLevelOneById,
                        newRepliesById : newRepliesLevelOneById,
                    }

                let replyChildProps = {...props, reply};
             
                return (
                    <div key={index} 
                         className={`reply-container replies-level-${reply['level']}`}>
                        {Reply(props, replyProps, isNewReplies) }
                        <RepliesLevelTwo {...replyChildProps}/>
                    </div> 
                ); 
            })}
        </div>
    );
};

