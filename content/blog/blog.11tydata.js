import { execSync } from "child_process";

let data = {
    layout: "blogPosts.njk",
};

if (process.env.NODE_ENV === "production") {
    data.date = "git Created";
} else {
    data.date = "Created";
}

// Compute modified_date per-file using git log
// This gets the last commit date for each specific file, not globally
data.eleventyComputed = {
    modified_date: (data) => {
        const inputPath = data.page.inputPath;
        try {
            const gitDate = execSync(
                `git log -1 --format=%aI -- "${inputPath}"`,
                { encoding: "utf-8" }
            ).trim();
            return gitDate ? new Date(gitDate) : data.page.date;
        } catch {
            // Fallback to page date if git command fails
            return data.page.date;
        }
    },
};

export default data;
