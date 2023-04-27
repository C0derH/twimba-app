import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'

if(!JSON.parse(localStorage.getItem("newTweets"))){
    localStorage.setItem('newTweets',JSON.stringify([]))
} else {
    const storageTweets = JSON.parse(localStorage.getItem("newTweets"))
    storageTweets.forEach(function(tweet){
        tweetsData.unshift(tweet)
    })
}


tweetsData.forEach(function(tweet){
    const storageLikes = JSON.parse(localStorage.getItem(`likes-${tweet.uuid}`))
    const storageIsLiked = JSON.parse(localStorage.getItem(`isLiked-${tweet.uuid}`))
    if(storageLikes && storageIsLiked){
        tweet.likes = storageLikes
        tweet.isLiked = storageIsLiked
    }
    const storageRetweets = JSON.parse(localStorage.getItem(`retweets-${tweet.uuid}`))
    const storageIsRetweeted = JSON.parse(localStorage.getItem(`isRetweeted-${tweet.uuid}`))
    
    if(storageRetweets && storageIsRetweeted){
        tweet.retweets = storageRetweets
        tweet.isRetweeted = storageIsRetweeted
    }
})

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }else if(e.target.dataset.replyBtn){
        handleReplyBtnClick(e.target.dataset.replyBtn)
    } else if(e.target.dataset.delete){
        handleDeleteClick(e.target.dataset.delete)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
    localStorage.setItem(`isLiked-${tweetId}`,JSON.stringify(targetTweetObj.isLiked))
    localStorage.setItem(`likes-${tweetId}`,JSON.stringify(targetTweetObj.likes))
}


function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
    localStorage.setItem(`isRetweeted-${tweetId}`,JSON.stringify(targetTweetObj.isRetweeted))
    localStorage.setItem(`retweets-${tweetId}`,JSON.stringify(targetTweetObj.retweets))
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleDeleteClick(tweetId){
    const localStorageTweets = JSON.parse(localStorage.getItem("newTweets"))
    deleteTweet(tweetsData,tweetId)
    const updatedStorage = deleteTweet(localStorageTweets,tweetId)
    localStorage.setItem("newTweets",JSON.stringify(updatedStorage))
    render()
}

function deleteTweet(tweets,tweetId){
   const targetTweetObj = tweets.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    const index = tweets.indexOf(targetTweetObj)
    tweets.splice(index,1)
    return tweets
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    if(tweetInput.value){
        const newTweet = {
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            isUser: true,
            uuid: uuidv4()
        }
        tweetsData.unshift(newTweet)
    render()
    tweetInput.value = ''
    const storageTweets = JSON.parse(localStorage.getItem("newTweets"))
    storageTweets.push(newTweet)
    const updatedNewTweets = storageTweets
    localStorage.setItem("newTweets",JSON.stringify(updatedNewTweets))
    }

}

function handleReplyBtnClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid.includes(tweetId)
    })[0]
    const targetReplyInput = document.getElementById(`reply-input-${tweetId}`)
    if(targetReplyInput.value){
        targetTweetObj.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: `${targetReplyInput.value}`,
        })
        render()
        document.getElementById(`replies-${tweetId}`).classList.remove('hidden')
    }
    
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let deleteIconClass = ''

        if(!tweet.isUser){
            deleteIconClass = 'hidden' 
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail ${deleteIconClass} ">
                    <i 
                    class="fa-solid fa-trash"
                    data-delete = "${tweet.uuid}"
                    ></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden tweet-replies" id="replies-${tweet.uuid}">
        ${repliesHtml}
        <textarea class="tweet-reply-input" id="reply-input-${tweet.uuid}" placeholder="Tweet your reply"></textarea>
        <button class="tweet-reply-btn" data-reply-btn = "${tweet.uuid}">Reply</button>
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

