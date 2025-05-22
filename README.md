# Functional Safety Assessment

  const deleteProject = (e) => {
    let id = e.target.id;

    const response = fetch(`http://localhost:8000/projects/${id}`, {
      method: "DELETE",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        id
      })
    });
    if (response.ok) {
      window.location.reload()
    }
    else {
      console.log(response);
    }
  }