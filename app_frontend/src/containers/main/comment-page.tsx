import React, { Component } from 'react';
import  AjaxLoader from "templates/ajax-loader";
import  * as action  from 'actions/actionCreators';

import {  CommentsComponent } from "templates/comment"
import {store} from "store/index";
import {Apis} from 'api';


class CommentsBox extends Component {
    private isFullyMounted:boolean = false;

    constructor(props) {
        super(props);

        this.state = {
            isCommentBox    : true,
            commentsById    : '',
            newCommentsById : '',
            parent          : '',
        };
    };

    public get isMounted() {
            return this.isFullyMounted;
    }; 

    public set isMounted(value:boolean) {
            this.isFullyMounted = value;
    }

    componentDidCatch(error, info) {
       // You can also log the error to an error reporting service
       //console.log(error, info);
    };

    componentDidMount() {
        this.isMounted = true;
        
        let answer = this.props['answer'];
        let post = this.props['post'];

        let isAnswerBox:boolean = this.props['isAnswerBox'];
        const parent:object = post && post || answer && answer;
                
        if(parent){
            let commentsById:string;
            let newCommentsById:string;
            let parentId:number = parent['id']

            if (isAnswerBox) { 
               commentsById =  `commentsAnswer${parentId}`;
               newCommentsById = `newAnswerComments${parentId}`; 

            } else {
                commentsById =  `commentsPost${parentId}`;
                newCommentsById = `newPostComments${parentId}`;
            }

            this.setState({
                commentsById, 
                newCommentsById,
                parent,
                parentId
            });
         
            let comments:object[] = parent['comments'];
            let commentsCount:number = parent['comments_count'];
            if (comments && comments.length) {
                
                store.dispatch<any>(
                    action.getCommentLindData({commentsById, comments, commentsCount})
                );
            }
        }
    };

    componentDidUpdate(nextProps, prevState) {
       
    } 
          
    getProps() {
        return {...this.props, ...this.state};
    }; 
   
    render() { 
         if (!this.isMounted) {
            return null;
        }

        let props  = this.getProps();
                
        let commentsById = props['commentsById'];
        let newCommentsById = props['newCommentsById'];
            
        let comments  =  props['entities']['comments'];
        let newComments = comments && comments[newCommentsById]; 
        let oldComments = comments && comments[commentsById];
                                   
        return (
            <div className="comment-page">
                <div className="new-comments-box">
                    { NewComments(props, newComments) }
                </div>
                               
                <div className="previous-comments-box">
                    { OldComments(props, oldComments) }
                </div>
            </div>
        );
   };
};


export default CommentsBox;


const NewComments = (props:object, comments:object) => {
    let commentList:object[] = comments && comments['commentList'] || [];
 
    if (!commentList.length) {
        return null
    }
   
    let commentsProps:object = {...props, isNewComments:true}
    return Comments(commentsProps, commentList);
};


const OldComments = (props:object, comments:object) => {
    let commentList:object[] = comments && comments['commentList'] || []; 

    if (!commentList.length) {
        return null;
    }
            
    let isLoading:boolean = comments['isLoading'];
   
    return(
        <div className="">
            {comments['showLink'] &&
                <div className="">
                    { Comments(props, commentList) }

                    {isLoading &&
                        <div className="spin-loader-box">
                            <AjaxLoader/>
                        </div>

                        ||

                        <div>
                            { CommentsLoader(props, comments) }
                        </div>
                        
                    }
                </div>

                ||

                <div className="">
                    {!isLoading &&
                        <div className="">
                            {Comments(props, commentList)}
                        </div>
                       
                    }
                </div>
            }
        </div>
    )
};

const CommentsLoader = (props:object, comments:object) => {
    let commentsById:string = props['commentsById'];
    let parent:object = props['parent'];

    let apiUrl:string;
    let id:number = parent && parent['id'];

    if (props['isAnswerBox']) { 
       apiUrl =  Apis.getAnswerCommentListApi(id);

    }else{
       apiUrl = Apis.getPostCommentListApi(id);
    }

    const commentsLoaderProps:object = {
        apiUrl,
        commentsById,
    } 

    const getCommentList:Function = props['getCommentList'];
      
    let commentsCount:number = comments['commentsCount'];
    let error:string = comments['error'];

    return(
        <div>
            {error &&
                <ul className="comments-loader-errors alert-danger">
                    <li className="">
                        {error}
                    </li>
                    
                    <li className="">
                        <button 
                            onClick={()=> getCommentList(commentsLoaderProps)}
                            className="btn-sm">
                            Try again
                        </button>
                    </li>
                </ul>

                ||

                <ul className="comments-loader"
                    onClick={()=> getCommentList(commentsLoaderProps)}>
                    <li>
                        Click to view {commentsCount - 1} more
                        {commentsCount > 2 && ' comments' || ' comment'}
                    </li>
                </ul>
            }
        </div>
    )
};



const Comments = (props, commentList) => {
    let parent:object = props['parent'];
                                           
    return (
        <div>
            {commentList?.map( (comment, index) => {
                if(parent){
                    let isParentComment = parent['id'] === comment.answer ||
                                          parent['id'] === comment.post
                    if(!isParentComment){
                        return null;
                    }
                    
                }

                let commentProps = {
                    ...props,
                    comment,
                    index
                };  
                              
                return(
                    <div  key={index} >
                        <CommentsComponent {...commentProps}/>
                    </div>
                )
            })}
        </div>
    );
}



