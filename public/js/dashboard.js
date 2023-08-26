document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".delete-post");
  const editButtons = document.querySelectorAll(".edit-description");
  const newPostForm = document.querySelector(".new-post-form");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const postId = button.getAttribute("data-post-id");

      try {
        const response = await fetch(`/api/blogposts/${postId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          document.location.replace("/dashboard");
        } else {
          console.error("Delete request failed");
        }
      } catch (error) {
        console.error(error);
      }
    });
  });

  editButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const postId = button.getAttribute("data-post-id");
      const editedTitle = document.querySelector(`#edit-title-${postId}`).value;
      const editedDescription = document.querySelector(`#edit-description-${postId}`).value;
      console.log(editedDescription);
      try {
        const response = await fetch(`/api/blogposts/${postId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editedTitle,
            description: editedDescription,
          }),
        });

        if (response.ok) {
          document.location.replace("/dashboard");
        } else {
          console.error("Edit submission failed");
        }
      } catch (error) {
        console.error(error);
      }
    });
  });

  newPostForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user_id = newPostForm.getAttribute("data-user-id");
    const title = document.querySelector("#post-title").value.trim();
    const description = document.querySelector(".post-description").value;
    
    if (title && description) {
      try {
        const response = await fetch(`/api/blogposts`, {
          method: "POST",
          body: JSON.stringify({
            title,
            description,
            user_id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          document.location.replace("/dashboard");
        } else {
          alert("Failed to create post, title and description required");
        }
      } catch (error) {
        console.error(error);
      }
    }
  });
});