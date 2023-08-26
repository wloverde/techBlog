document.addEventListener("DOMContentLoaded", () => {
    const submitButtons = document.querySelectorAll(".submit-comment");
  
    submitButtons.forEach(button => {
      button.addEventListener("click", async () => {
        const blogpostId = button.getAttribute("data-blogpost-id");
        const commentText = document.querySelector(`#commentText-${blogpostId}`).value;
  
        try {
          const response = await fetch("/api/comments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              blogpost_id: blogpostId,
              comment_text: commentText,
            }),
          });
  
          if (response.ok) {
            // Comment submission successful, update UI as needed
            document.location.replace('/');
          } else {
            console.error("Comment submission failed");
          }
        } catch (error) {
          console.error(error);
        }
      });
    });
  });