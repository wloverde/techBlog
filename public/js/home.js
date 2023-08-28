document.addEventListener("DOMContentLoaded", () => {
  const submitButtons = document.querySelectorAll(".submit-comment");

  submitButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const blogpostId = button.getAttribute("data-blogpost-id");
      const commentText = document.querySelector(`#commentText-${blogpostId}`).value;
      const userId = button.getAttribute("data-user-id"); // Get user_id from the button attribute
      console.log(userId);
      try {
        const response = await fetch(`/api/comments/blogpost/${blogpostId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: commentText,
            // user_id: userId, // Use userId here
            blogpost_id: blogpostId,
          }),
        });

        if (response.ok) {
          // Comment submission successful, update UI as needed
          
           document.location.replace('/'); // Reload the page to reflect the new comment
        } else {
          console.error("Comment submission failed");
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
});