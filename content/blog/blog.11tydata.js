let data = {
    layout: "blogPosts.njk",
}

if (process.env.NODE_ENV === "production") {
    data.date = "git Created";
    data.modified_date = "git Last Modified";
} else {
    data.date = "Created";
    data.modified_date = 'Last Modified';
}

export default data
