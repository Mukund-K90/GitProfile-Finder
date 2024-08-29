const repo_details = document.querySelector(".repo_details");
const userInfo = document.querySelector(".user_info");
const btn_submit = document.querySelector(".btn_submit");
const moreRepo = document.querySelector(".moreRepo");
let userUrl = "";
const token = "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";
let repoPage = "";
function fetchUser(username) {
    repoPage = "";
    try {
        fetch(`https://api.github.com/users/${username}`, {
            headers: {
                'Authorization': `token ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.message === "Not Found") {
                    userInfo.innerHTML = `<h2>User Not Found</h2>`;
                    userUrl = "";
                    return;
                } else {
                    repoPage = `https://github.com/${data.login}?tab=repositories`;
                    userInfo.innerHTML = `
                    <div class="user_img">
                        <img src="${data.avatar_url}" alt="User Avatar">
                    </div>
                    <div class="user_name">
                        <h3 id="userName">${data.name ?? "Not Available"}</h3>
                        <p id="loginName">${data.login ?? "Not Available"}</p>
                        <p id="userBio">${data.bio ?? "Not Available"}</p>
                    </div>
                    <div class="follow">
                        <div class="item followers_">
                            <p>Followers</p>
                            <span>${data.followers}</span>
                        </div>
                        <div class="item follow_">
                            <p>Following</p>
                            <span>${data.following}</span>
                        </div>
                    </div>
                `;
                    userUrl = data.html_url;
                    console.log(repoPage);
                    moreRepo.addEventListener('click', () => {
                        window.open(repoPage, '_blank');
                    });
                }
            });

        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Authorization': `token ${token}`
            }
        })
            .then(response => response.json())
            .then(repoData => {
                if (repoData.length <= 0) {
                    repo_details.innerHTML = `
                    <div class="item_">
                        <div class="repo_name">No Repo Found</div>                
                    </div>
                `;
                    moreRepo.classList.add("disable");
                    moreRepo.classList.remove("enable");
                } else {
                    if (repoData.message === "Not Found") {
                        repo_details.innerHTML = `
                        <div class="item_">
                            <div class="repo_name">No Repo Found</div>                
                        </div>
                    `;
                        moreRepo.classList.add("disable");
                        moreRepo.classList.remove("enable");
                    } else {
                        moreRepo.classList.add("enable");
                        moreRepo.classList.remove("disable");

                        const repoItems = repoData.map(item => `
                        <div class="item_">
                            <div class="repo_name">${item.name}</div>
                            <div class="repo_details_">
                                <div class="info_ star">
                                    <i style="color:#ffa534" class="fa-solid fa-star"></i>${item.watchers}
                                </div>
                                <div class="info_ fork">
                                    <p><i class="fa fa-code-fork"></i>${item.forks}</p>
                                </div>
                                <div class="info_ size">
                                    <p><i class="fa fa-file"></i>${item.size}kb</p>
                                </div>
                            </div>
                        </div>
                    `).slice(0, 6).join("");
                        repo_details.innerHTML = repoItems;
                    }
                }
            });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

btn_submit.addEventListener("click", function () {
    const userValue = document.querySelector('.input_user').value;
    fetchUser(userValue);
});

document.querySelector(".input_user").addEventListener("keyup", function (e) {
    if (e.key === 'Enter') {
        const userValue = document.querySelector('.input_user').value;
        fetchUser(userValue);
    }
});

function openProfile() {
    if (userUrl) {
        window.open(userUrl, '_blank');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const defaultUser = "Mukund-K91";
    fetchUser(defaultUser);
});
