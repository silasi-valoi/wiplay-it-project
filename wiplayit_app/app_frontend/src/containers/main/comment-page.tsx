import React, { Component } from 'react';
import  AjaxLoader from "templates/ajax-loader";
import  * as action  from 'actions/actionCreators';
import Helper from 'utils/helpers';
import {  CommentsComponent } from "templates/comment"
import {Editor, EditorState} from 'draft-js';
import {pageMediaBlockRenderer} from 'templates/draft-editor';
import {store} from "store/index";




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
        let isPostBox:boolean = this.props['isPostBox'];

        const parent:object = post && post || answer && answer;
                
        if(parent){
            let commentsById:string;
            let newCommentsById:string;
            let parentId:number = parent['id']

            if (isAnswerBox) { 
               commentsById =  `commentsAnswer${parentId}`;
               newCommentsById = `newAnswerComments${parentId}`; 

            } else if(isPostBox) {
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
            if (comments.length) {
                
                store.dispatch<any>(
                    action.getCommentLindData(commentsById, comments)
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

        let commentsTitle:string; 
        if(newComments  && newComments.commentList){
            commentsTitle = 'Comments';

        }else if(oldComments && oldComments.commentList){
            commentsTitle = 'Comments';
        }
                             
        return (
            <div className="comment-page">
                <p className="comments-title">{commentsTitle}</p>
                            
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


const OldComments = (props, comments:object) => {
    let {commentsById, parent} = props;
    let commentList:object[] = comments && comments['commentList'] || []; 

    if (!commentList.length) {
        return null;
    }

    let linkData = comments['linkData'];
                  
    const commentProps:object = {
        ...props, 
        comment:linkData.comment,
    }

    return(
        <div>
            {comments['showLink'] &&
                <div>
                    <CommentsComponent {...commentProps}/>
                    <ul className="comments-loader"
                        onClick={()=> props.getCommentList(commentsById)}>
                        <li>Click to view {commentList.length - 1} more comments</li>
                    </ul>
                </div>

                ||

                <div>
                    { comments['isLoading'] &&
                        <div className="spin-loader-box">
                            <AjaxLoader/>
                        </div>

                        ||
                        <div>
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
            {commentList && commentList.map( (comment, index) => {
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




