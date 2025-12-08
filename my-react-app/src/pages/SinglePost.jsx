import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/post/${id}`)  
      .then((res) => setPost(res.data.post || res.data.DATA)) 
      .catch((err) => console.log(err));
  }, [id]);

  if (!post) return <h2>Loading post...</h2>;

  return (
    <div className="single-post">
      <h1>{post.title}</h1>
      <div className="post-tags">
        {typeof post?.tag === "string" &&
          post.tag.split(",").map((t, i) => (
            <span className="tag" key={i}>
              {t.trim()}
            </span>
          ))}
      </div>
      <p>By {post.author}</p>
      <p style={{ marginTop: "20px" }}>{post.content}</p>
    </div>
  );
}

export default SinglePost;