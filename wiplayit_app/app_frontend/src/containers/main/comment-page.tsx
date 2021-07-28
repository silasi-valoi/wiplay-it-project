import React, { Component } from 'react';
import  AjaxLoader from "templates/ajax-loader";
import  * as action  from 'actions/actionCreators';
import  {GET_COMMENT_LIST}  from 'actions/types';

import Helper from 'utils/helpers';
import {  CommentsComponent } from "templates/comment"
import {Editor, EditorState} from 'draft-js';
import {pageMediaBlockRenderer} from 'templates/draft-editor';
import {store} from "store/index";
import Apis from 'utils/api';


const helper   = new Helper();


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
   
    
    return(
        <div className="">
            {comments['showLink'] &&
                <div className="">
                    { Comments(props, commentList) }

                    {!comments['isLoading'] &&
                        <ul className="comments-loader"
                            onClick={()=> getCommentList(commentsLoaderProps)}>
                            <li>
                                Click to view {comments['commentsCount'] - 1} more comments
                            </li>
                        </ul>

                        ||

                        <div className="spin-loader-box">
                            <AjaxLoader/>
                        </div>
                    }
                </div>

                ||

                <div className="">
                    {!comments['isLoading'] &&
                        <div className="">
                            {Comments(props, commentList)}
                        </div>
                       
                    }
                </div>
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




